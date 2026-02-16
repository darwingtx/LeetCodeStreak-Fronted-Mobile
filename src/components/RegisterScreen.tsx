import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Alert,
    TextInput,
    ActivityIndicator,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { styles, Colors } from '../Styles/AppStyles';
import { useAuth } from '../contexts/AuthContext';

interface RegisterScreenProps {
    onRegisterSuccess?: (username?: string) => void;
    initialUsername?: string;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
    onRegisterSuccess,
    initialUsername,
}) => {
    const { user, generateVerificationCode, verifyProfile, isLoading } = useAuth();

    const [verificationCode, setVerificationCode] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState<'pending' | 'verified' | 'failed'>('pending');

    const username = user?.username ?? initialUsername ?? '';

    /** Step 1: Request a verification code from the backend */
    const handleGenerateCode = async () => {
        if (!username) {
            Alert.alert('Error', 'No username found. Please log in first.');
            return;
        }

        setIsGenerating(true);
        try {
            const response = await generateVerificationCode(username);
            setVerificationCode(response.code);
            setVerificationStatus('pending');
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to generate code';
            Alert.alert('Error', message);
        } finally {
            setIsGenerating(false);
        }
    };

    /** Copy the code to clipboard */
    const copyToClipboard = async () => {
        if (verificationCode) {
            await Clipboard.setStringAsync(verificationCode);
            Alert.alert('Code Copied', 'The code has been copied to the clipboard!');
        }
    };

    /** Step 3: Ask the backend to verify the profile */
    const handleVerify = async () => {
        if (!username) return;

        setIsVerifying(true);
        try {
            const verified = await verifyProfile(username);
            if (verified) {
                setVerificationStatus('verified');
                Alert.alert(
                    'Success!',
                    'Your registration has been verified successfully.',
                    [
                        {
                            text: 'Continue',
                            onPress: () => onRegisterSuccess?.(username),
                        },
                    ]
                );
            } else {
                setVerificationStatus('failed');
                Alert.alert(
                    'Verification Failed',
                    'The code was not found in your LeetCode bio. Make sure you saved it and try again.'
                );
            }
        } catch (err) {
            setVerificationStatus('failed');
            const message = err instanceof Error ? err.message : 'Verification failed';
            Alert.alert('Error', message);
        } finally {
            setIsVerifying(false);
        }
    };

    return (
        <ScrollView style={{ flex: 1, backgroundColor: Colors.bgMain }}>
            <View style={{ padding: 20 }}>
                {/* Title */}
                <Text style={[styles.logoText, { textAlign: 'center', marginBottom: 30, marginTop: 20 }]}>
                    Complete Your Registration
                </Text>

                {/* Instructions Card */}
                <View style={[styles.card, { marginBottom: 20, padding: 20 }]}>
                    <Text style={{ color: Colors.primary, fontSize: 18, fontWeight: 'bold', marginBottom: 15 }}>
                        📋 Steps to verify your account:
                    </Text>

                    {/* Step 1: Generate Code */}
                    <View style={{ marginBottom: 20 }}>
                        <Text style={{ color: Colors.textMain, fontSize: 16, fontWeight: '600', marginBottom: 8 }}>
                            Step 1: Generate your verification code
                        </Text>
                        <Text style={{ color: Colors.textMuted, fontSize: 13, marginBottom: 12 }}>
                            Press the button below to get a unique code from the server:
                        </Text>

                        {!verificationCode ? (
                            <TouchableOpacity
                                style={{
                                    backgroundColor: Colors.primary,
                                    padding: 14,
                                    borderRadius: 8,
                                    alignItems: 'center',
                                    opacity: isGenerating ? 0.6 : 1,
                                }}
                                onPress={handleGenerateCode}
                                disabled={isGenerating}
                            >
                                {isGenerating ? (
                                    <ActivityIndicator color={Colors.bgMain} />
                                ) : (
                                    <Text style={{ color: Colors.bgMain, fontSize: 14, fontWeight: 'bold' }}>
                                        🔑 Generate Code
                                    </Text>
                                )}
                            </TouchableOpacity>
                        ) : (
                            <>
                                {/* Display the code */}
                                <View
                                    style={{
                                        backgroundColor: Colors.bgAccent,
                                        padding: 15,
                                        borderRadius: 10,
                                        borderWidth: 2,
                                        borderColor: Colors.primary,
                                        marginBottom: 10,
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: Colors.primary,
                                            fontSize: 16,
                                            fontWeight: 'bold',
                                            textAlign: 'center',
                                            fontFamily: 'monospace',
                                        }}
                                    >
                                        {verificationCode}
                                    </Text>
                                </View>

                                {/* Copy button */}
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: Colors.primary,
                                        padding: 12,
                                        borderRadius: 8,
                                        alignItems: 'center',
                                        marginBottom: 8,
                                    }}
                                    onPress={copyToClipboard}
                                >
                                    <Text style={{ color: Colors.bgMain, fontSize: 14, fontWeight: 'bold' }}>
                                        📋 Copy Code
                                    </Text>
                                </TouchableOpacity>

                                {/* Regenerate */}
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: Colors.bgAccent,
                                        padding: 10,
                                        borderRadius: 8,
                                        alignItems: 'center',
                                        borderWidth: 1,
                                        borderColor: Colors.primary,
                                    }}
                                    onPress={() => {
                                        setVerificationCode(null);
                                        setVerificationStatus('pending');
                                        handleGenerateCode();
                                    }}
                                >
                                    <Text style={{ color: Colors.primary, fontSize: 12, fontWeight: '600' }}>
                                        Generate New Code
                                    </Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>

                    {/* Divider */}
                    <View style={{ height: 1, backgroundColor: Colors.bgAccent, marginVertical: 15 }} />

                    {/* Step 2 */}
                    <View style={{ marginBottom: 20 }}>
                        <Text style={{ color: Colors.textMain, fontSize: 16, fontWeight: '600', marginBottom: 8 }}>
                            Step 2: Paste it in your LeetCode bio
                        </Text>
                        <Text style={{ color: Colors.textMuted, fontSize: 13, lineHeight: 20 }}>
                            1. Access your LeetCode profile{'\n'}
                            2. Go to the "Edit Profile" section{'\n'}
                            3. Paste the code in your bio / summary{'\n'}
                            4. Save changes
                        </Text>
                    </View>

                    {/* Divider */}
                    <View style={{ height: 1, backgroundColor: Colors.bgAccent, marginVertical: 15 }} />

                    {/* Step 3 */}
                    <View>
                        <Text style={{ color: Colors.textMain, fontSize: 16, fontWeight: '600', marginBottom: 12 }}>
                            Step 3: Verify your profile
                        </Text>
                        <Text style={{ color: Colors.textMuted, fontSize: 13, marginBottom: 15 }}>
                            After saving the code in your LeetCode bio, press verify below. The server will check your profile.
                        </Text>

                        {/* Verification status */}
                        {verificationStatus === 'verified' && (
                            <View
                                style={{
                                    backgroundColor: Colors.easy,
                                    padding: 12,
                                    borderRadius: 8,
                                    marginBottom: 15,
                                    alignItems: 'center',
                                }}
                            >
                                <Text style={{ color: Colors.bgMain, fontWeight: 'bold', fontSize: 14 }}>
                                    ✓ Registration verified successfully
                                </Text>
                            </View>
                        )}

                        {verificationStatus === 'failed' && (
                            <View
                                style={{
                                    backgroundColor: Colors.hard,
                                    padding: 12,
                                    borderRadius: 8,
                                    marginBottom: 15,
                                    alignItems: 'center',
                                }}
                            >
                                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>
                                    ✗ Verification failed — Try again
                                </Text>
                            </View>
                        )}

                        {/* Verify button */}
                        <TouchableOpacity
                            style={{
                                backgroundColor: verificationStatus === 'verified' ? Colors.easy : Colors.primary,
                                padding: 15,
                                borderRadius: 8,
                                alignItems: 'center',
                                opacity: isVerifying || !verificationCode ? 0.6 : 1,
                            }}
                            onPress={handleVerify}
                            disabled={isVerifying || verificationStatus === 'verified' || !verificationCode}
                        >
                            {isVerifying ? (
                                <ActivityIndicator color={Colors.bgMain} />
                            ) : (
                                <Text style={{ color: Colors.bgMain, fontSize: 16, fontWeight: 'bold' }}>
                                    {verificationStatus === 'verified' ? '✓ Verified' : 'Verify Registration'}
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Important Note */}
                <View
                    style={{
                        backgroundColor: Colors.bgCard,
                        padding: 15,
                        borderRadius: 10,
                        borderLeftWidth: 4,
                        borderLeftColor: Colors.secondary,
                    }}
                >
                    <Text style={{ color: Colors.secondary, fontWeight: '600', marginBottom: 5 }}>
                        💡 Important Note:
                    </Text>
                    <Text style={{ color: Colors.textMuted, fontSize: 12, lineHeight: 18 }}>
                        This code verifies that you are the real owner of your LeetCode account. Make sure the code is visible in your LeetCode bio.
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
};
