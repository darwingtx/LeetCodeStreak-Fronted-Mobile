import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Colors } from '../Styles/AppStyles';
import Card from './Card'; 


export const LoginScreen = ({ onLogin }: { onLogin: (username: string) => void }) => {
    const [username, setUsername] = useState('');

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={localStyles.container}
        >
            <View style={localStyles.logoContainer}>
                <Text style={localStyles.subTitle}>Track your progress every day</Text>
            </View>

            <Card style={localStyles.loginCard}>
                <Text style={localStyles.label}>Username</Text>
                <TextInput
                    style={localStyles.input}
                    placeholder="Enter your LeetCode user"
                    placeholderTextColor="#5A5E70"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                />

                <TouchableOpacity 
                    style={[localStyles.button, !username && { opacity: 0.6 }]} 
                    onPress={() => username && onLogin(username)}
                    disabled={!username}
                >
                    <Text style={localStyles.buttonText}>Get Started</Text>
                </TouchableOpacity>
            </Card>

            <Text style={localStyles.footerText}>
                We use your username to fetch your public streak data.
            </Text>
        </KeyboardAvoidingView>
    );
};

const localStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1A1D29', // Fondo oscuro principal
        justifyContent: 'center',
        padding: 24,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logoText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginTop: 10,
    },
    subTitle: {
        color: '#9BA3AF', // Muted text
        fontSize: 16,
        marginTop: 5,
    },
    loginCard: {
        padding: 20,
        backgroundColor: '#252936', // Fondo de tarjeta
    },
    label: {
        color: '#E8E9ED',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#1A1D29',
        borderRadius: 8,
        padding: 15,
        color: '#FFFFFF',
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#2F3241',
        marginBottom: 20,
    },
    button: {
        backgroundColor: Colors.primary, 
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    footerText: {
        color: '#5A5E70',
        fontSize: 12,
        textAlign: 'center',
        marginTop: 20,
        lineHeight: 18,
    }
});