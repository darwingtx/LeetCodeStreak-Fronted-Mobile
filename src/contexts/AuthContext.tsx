import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '../config/api';

// ─── Types ───────────────────────────────────────────────────────────────────

interface User {
    id: string;
    username: string;
    isVerified: boolean;
    role: string;
    currentStreak?: number;
    timezone?: string;
    lastProblemSolvedAt?: string;
    longestStreak?: number;
}

interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

interface VerificationCodeResponse {
    code: string;
    instructions: string;
}

interface AuthContextType {
    /** Current authenticated user, null if not logged in */
    user: User | null;
    /** True while any auth operation is in progress */
    isLoading: boolean;
    /** True while the initial token restore is running */
    isRestoringSession: boolean;
    /** Last error message from an auth operation */
    error: string | null;

    /** Check if a LeetCode username exists in our database */
    verifyExistence: (username: string) => Promise<boolean>;
    /** Register a new LeetCode username */
    register: (username: string) => Promise<void>;
    /** Log in with a LeetCode username */
    login: (username: string) => Promise<void>;
    /** Log out and revoke the refresh token */
    logout: () => Promise<void>;
    /** Generate a verification code to place in the user's LeetCode bio */
    generateVerificationCode: (username: string) => Promise<VerificationCodeResponse>;
    /** Verify profile ownership after the code has been placed */
    verifyProfile: (username: string) => Promise<boolean>;
    /** Helper to make authenticated API requests with auto-refresh */
    authFetch: (url: string, options?: RequestInit) => Promise<Response>;
    /** Fetch the latest profile data from the server */
    refreshProfile: () => Promise<void>;
    /** Dismiss the current error */
    clearError: () => void;
}

// ─── Secure Storage Keys ─────────────────────────────────────────────────────

const STORAGE_KEYS = {
    ACCESS_TOKEN: 'auth_access_token',
    REFRESH_TOKEN: 'auth_refresh_token',
    USER_DATA: 'auth_user_data',
} as const;

// ─── Context ─────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Hook to consume the AuthContext.
 * Must be used within an AuthProvider.
 */
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an <AuthProvider>');
    }
    return context;
};

// ─── Provider ────────────────────────────────────────────────────────────────

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isRestoringSession, setIsRestoringSession] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const profileFetchedRef = useRef(false);

    // Keep tokens in a ref so authFetch always sees the latest values
    // without triggering re-renders.
    const tokensRef = useRef<AuthTokens | null>(null);

    // ── Helpers: Secure Storage ──────────────────────────────────────────────

    const persistSession = async (tokens: AuthTokens, userData: User) => {
        await SecureStore.setItemAsync(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
        await SecureStore.setItemAsync(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
        await SecureStore.setItemAsync(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
        tokensRef.current = tokens;
    };

    const clearSession = async () => {
        await SecureStore.deleteItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
        await SecureStore.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
        await SecureStore.deleteItemAsync(STORAGE_KEYS.USER_DATA);
        tokensRef.current = null;
    };

    // ── Token Refresh ────────────────────────────────────────────────────────

    const refreshTokens = async (): Promise<AuthTokens | null> => {
        const currentRefreshToken = tokensRef.current?.refreshToken
            ?? await SecureStore.getItemAsync(STORAGE_KEYS.REFRESH_TOKEN);

        if (!currentRefreshToken) return null;

        try {
            const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken: currentRefreshToken }),
            });

            if (!response.ok) {
                // Refresh token expired or revoked — force full logout
                await clearSession();
                setUser(null);
                return null;
            }

            const data = await response.json();
            const newTokens: AuthTokens = {
                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
            };

            // Persist the rotated tokens
            await SecureStore.setItemAsync(STORAGE_KEYS.ACCESS_TOKEN, newTokens.accessToken);
            await SecureStore.setItemAsync(STORAGE_KEYS.REFRESH_TOKEN, newTokens.refreshToken);
            tokensRef.current = newTokens;

            return newTokens;
        } catch {
            return null;
        }
    };

    // ── Authenticated Fetch (auto-refresh on 401) ────────────────────────────

    const authFetch = useCallback(async (url: string, options: RequestInit = {}): Promise<Response> => {
        const accessToken = tokensRef.current?.accessToken;

        const makeRequest = (token: string | undefined) =>
            fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            });

        let response = await makeRequest(accessToken);

        // If we got a 401, try refreshing once and retry
        if (response.status === 401) {
            const newTokens = await refreshTokens();
            if (newTokens) {
                response = await makeRequest(newTokens.accessToken);
            }
        }

        return response;
    }, []);

    // ── Profile Logic ────────────────────────────────────────────────────────

    /**
     * Fetches the latest user data from /user/profile/:id
     * and updates both the state and SecureStore.
     */
    const refreshProfile = useCallback(async () => {
        if (!user) return;

        try {
            const response = await authFetch(`${API_BASE_URL}/user/profile/${user.id}`);
            if (response.ok) {
                const data = await response.json();
                const updatedUser: User = {
                    ...user,
                    ...data,
                };
                setUser(updatedUser);
                await SecureStore.setItemAsync(STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUser));
            }
        } catch (err) {
            console.error('Failed to refresh profile:', err);
        }
    }, [user, authFetch]);

    // ── Restore Session on App Start ─────────────────────────────────────────

    useEffect(() => {
        const restoreSession = async () => {
            try {
                const [storedAccessToken, storedRefreshToken, storedUserData] = await Promise.all([
                    SecureStore.getItemAsync(STORAGE_KEYS.ACCESS_TOKEN),
                    SecureStore.getItemAsync(STORAGE_KEYS.REFRESH_TOKEN),
                    SecureStore.getItemAsync(STORAGE_KEYS.USER_DATA),
                ]);

                if (storedAccessToken && storedRefreshToken && storedUserData) {
                    tokensRef.current = {
                        accessToken: storedAccessToken,
                        refreshToken: storedRefreshToken,
                    };

                    // Attempt a refresh to make sure the session is still valid
                    const newTokens = await refreshTokens();
                    if (newTokens) {
                        setUser(JSON.parse(storedUserData));
                    } else {
                        // Session is invalid, clean up
                        await clearSession();
                    }
                }
            } catch {
                await clearSession();
            } finally {
                setIsRestoringSession(false);
            }
        };

        restoreSession();
    }, []);

    // Fetch profile once per "app launch" when user is available
    useEffect(() => {
        if (user && !profileFetchedRef.current) {
            profileFetchedRef.current = true;
            refreshProfile();
        }
    }, [user, refreshProfile]);

    // ── Auth Operations ──────────────────────────────────────────────────────

    /**
     * Check if a LeetCode username exists in our database.
     * Calls GET /auth/verifyExistence/:username
     */
    const verifyExistence = useCallback(async (username: string): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/auth/verifyExistence/${encodeURIComponent(username)}`);

            if (!response.ok) {
                // If the endpoint doesn't exist yet or returns an error, we might want to handle it
                // For now, let's assume it works or return false on error
                return false;
            }

            const data = await response.json();
            return !!data.exists;
        } catch (err) {
            console.error('Error verifying existence:', err);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Register a new LeetCode username in the database.
     * Calls POST /auth/register/:username
     */
    const register = useCallback(async (username: string): Promise<void> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/auth/register/${encodeURIComponent(username)}`, {
                method: 'POST',
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message ?? `Registration failed (status ${response.status})`);
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Registration failed';
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Login with a LeetCode username.
     * Calls GET /auth/login/:username
     */
    const login = useCallback(async (username: string): Promise<void> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/auth/login/${encodeURIComponent(username)}`);

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(
                    errorData?.message ?? `Login failed (status ${response.status})`
                );
            }

            const data = await response.json();

            const tokens: AuthTokens = {
                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
            };

            const userData: User = {
                id: data.user?.id ?? data.id ?? '',
                username: data.user?.username ?? username,
                isVerified: data.user?.isVerified ?? false,
                role: data.user?.role ?? 'user',
            };

            await persistSession(tokens, userData);
            setUser(userData);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'An unexpected error occurred';
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Logout: revokes the refresh token and clears local session.
     * Calls POST /auth/logout
     */
    const logout = useCallback(async (): Promise<void> => {
        setIsLoading(true);
        setError(null);

        try {
            const refreshToken = tokensRef.current?.refreshToken;

            if (refreshToken) {
                // Best-effort: try to revoke server-side
                await authFetch(`${API_BASE_URL}/auth/logout`, {
                    method: 'POST',
                    body: JSON.stringify({ refreshToken }),
                }).catch(() => {
                    // Ignore network errors — we still clear the local session
                });
            }
        } finally {
            profileFetchedRef.current = false;
            await clearSession();
            setUser(null);
            setIsLoading(false);
        }
    }, [authFetch]);

    /**
     * Generate a verification code the user must place in their LeetCode bio.
     * Calls POST /auth/verify/generate/:username
     */
    const generateVerificationCode = useCallback(
        async (username: string): Promise<VerificationCodeResponse> => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch(
                    `${API_BASE_URL}/auth/verify/generate/${encodeURIComponent(username)}`,
                    { method: 'POST' },
                );

                if (!response.ok) {
                    const errorData = await response.json().catch(() => null);
                    throw new Error(
                        errorData?.message ?? `Failed to generate verification code (status ${response.status})`
                    );
                }

                return await response.json();
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to generate verification code';
                setError(message);
                throw err;
            } finally {
                setIsLoading(false);
            }
        },
        [],
    );

    /**
     * Verify profile ownership after the code is placed in the bio.
     * Calls POST /auth/verify/:username
     */
    const verifyProfile = useCallback(async (username: string): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `${API_BASE_URL}/auth/verify/${encodeURIComponent(username)}`,
                { method: 'POST' },
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(
                    errorData?.message ?? `Verification failed (status ${response.status})`
                );
            }

            const data = await response.json();

            // Update the local user's verified status
            if (data.verified && user) {
                const updatedUser = { ...user, isVerified: true };
                setUser(updatedUser);
                await SecureStore.setItemAsync(STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUser));
            }

            return data.verified;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Verification failed';
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    const clearError = useCallback(() => setError(null), []);

    // ── Context Value ────────────────────────────────────────────────────────

    const value: AuthContextType = {
        user,
        isLoading,
        isRestoringSession,
        error,
        verifyExistence,
        register,
        login,
        logout,
        generateVerificationCode,
        verifyProfile,
        authFetch,
        refreshProfile,
        clearError,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
