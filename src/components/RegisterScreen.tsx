import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Alert,
    TextInput,
    Clipboard,
} from 'react-native';
import { styles, Colors } from '../Styles/AppStyles';

interface RegisterScreenProps {
    onRegisterSuccess?: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
    onRegisterSuccess,
}) => {
    // Generar un código único aleatorio
    const generateUniqueCode = () => {
        return 'LC' + Math.random().toString(36).substring(2, 15).toUpperCase() + Date.now().toString(36).toUpperCase();
    };

    const [verificationCode, setVerificationCode] = useState(generateUniqueCode());
    const [userInput, setUserInput] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState<'pending' | 'verified' | 'failed'>('pending');

    // Función para copiar el código
    const copyToClipboard = async () => {
        await Clipboard.setString(verificationCode);
        Alert.alert('Code Copied', 'The code has been copied to the clipboard!');
    };

    // Función para verificar que el usuario completó los pasos
    const verifySteps = async () => {
        setIsVerifying(true);

        // Simulamos una verificación - en producción harías una llamada a un servidor
        // que verificaría si el código está en el README del usuario de LeetCode
        setTimeout(() => {
            if (userInput.trim() === verificationCode) {
                setVerificationStatus('verified');
                Alert.alert(
                    'Success!',
                    'Your registration has been verified successfully.',
                    [
                        {
                            text: 'Continue',
                            onPress: () => {
                                if (onRegisterSuccess) {
                                    onRegisterSuccess();
                                }
                            },
                        },
                    ]
                );
            } else {
                setVerificationStatus('failed');
                Alert.alert(
                    'Verification Failed',
                    'The code does not match. Please make sure you have correctly copied the code to your LeetCode README.'
                );
            }
            setIsVerifying(false);
        }, 2000);
    };

    // Función para regenerar el código
    const regenerateCode = () => {
        setVerificationCode(generateUniqueCode());
        setUserInput('');
        setVerificationStatus('pending');
        Alert.alert('New Code Generated', 'A new verification code has been generated.');
    };

    return (
        <ScrollView style={{ flex: 1, backgroundColor: Colors.bgMain }}>
            <View style={{ padding: 20 }}>
                {/* Título */}
                <Text style={[styles.logoText, { textAlign: 'center', marginBottom: 30, marginTop: 20 }]}>
                    Complete Your Registration
                </Text>

                {/* Card de Instrucciones */}
                <View style={[styles.card, { marginBottom: 20 }]}>
                    <Text style={{ color: Colors.primary, fontSize: 18, fontWeight: 'bold', marginBottom: 15 }}>
                        📋 Steps to verify your account:
                    </Text>

                    {/* Paso 1 */}
                    <View style={{ marginBottom: 20 }}>
                        <Text style={{ color: Colors.textMain, fontSize: 16, fontWeight: '600', marginBottom: 8 }}>
                            Step 1: Copy your verification code
                        </Text>
                        <Text style={{ color: Colors.textMuted, fontSize: 13, marginBottom: 12 }}>
                            Your unique code for this session:
                        </Text>

                        {/* Código a copiar */}
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

                        {/* Botón copiar */}
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

                        <TouchableOpacity
                            style={{
                                backgroundColor: Colors.bgAccent,
                                padding: 10,
                                borderRadius: 8,
                                alignItems: 'center',
                                borderWidth: 1,
                                borderColor: Colors.primary,
                            }}
                            onPress={regenerateCode}
                        >
                            <Text style={{ color: Colors.primary, fontSize: 12, fontWeight: '600' }}>
                                Generate New Code
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Divisor */}
                    <View
                        style={{
                            height: 1,
                            backgroundColor: Colors.bgAccent,
                            marginVertical: 15,
                        }}
                    />

                    {/* Step 2 */}
                    <View style={{ marginBottom: 20 }}>
                        <Text style={{ color: Colors.textMain, fontSize: 16, fontWeight: '600', marginBottom: 8 }}>
                            Step 2: Paste it in your LeetCode README
                        </Text>
                        <Text style={{ color: Colors.textMuted, fontSize: 13, lineHeight: 20 }}>
                            1. Access your LeetCode profile{'\n'}
                            2. Go to your "About" section{'\n'}
                            3. Paste the code in your README{'\n'}
                            4. Save changes
                        </Text>
                    </View>

                    {/* Divisor */}
                    <View
                        style={{
                            height: 1,
                            backgroundColor: Colors.bgAccent,
                            marginVertical: 15,
                        }}
                    />

                    {/* Paso 3 */}
                    <View>
                        <Text style={{ color: Colors.textMain, fontSize: 16, fontWeight: '600', marginBottom: 12 }}>
                            Step 3: Verify your registration
                        </Text>
                        <Text style={{ color: Colors.textMuted, fontSize: 13, marginBottom: 15 }}>
                            Confirm that you have completed the previous steps by pasting the code here:
                        </Text>


                        {/* Estado de verificación */}
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
                                    ✗ Verificación fallida - Intenta de nuevo
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
                                opacity: isVerifying ? 0.6 : 1,
                            }}
                            onPress={verifySteps}
                            disabled={isVerifying || verificationStatus === 'verified' || userInput.trim() === ''}
                        >
                            <Text style={{ color: Colors.bgMain, fontSize: 16, fontWeight: 'bold' }}>
                                {isVerifying ? 'Verificando...' : verificationStatus === 'verified' ? '✓ Verificado' : 'Verificar registro'}
                            </Text>
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
                        This code verifies that you are the real owner of your LeetCode account. Make sure the code is visible in your LeetCode README.
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
};
