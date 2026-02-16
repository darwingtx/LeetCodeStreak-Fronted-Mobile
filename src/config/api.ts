import { Platform } from 'react-native';

/**
 * Base URL for the LeetCodeStreak API.
 * Android emulator uses 10.0.2.2 to reach the host machine's localhost.
 * iOS simulator and web can use localhost directly.
 */
const getBaseUrl = (): string => {
    if (__DEV__) {
        if (Platform.OS === 'android') {
            return 'http://192.168.1.23:8050';
        }
        return 'http://localhost:8050';
    }
    // Production URL — update this when deploying
    return 'http://localhost:8050';
};

export const API_BASE_URL = getBaseUrl();
