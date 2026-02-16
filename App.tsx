import React, { useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native';
import { styles, Colors } from './src/Styles/AppStyles';
import { IndividualScreen } from './src/components/IndividualScreen';
import GroupStreak from './src/components/GroupStreak';
import Profile from './src/components/Profile';
import DailyProblem from './src/components/DailyProblem';
import { FlameIcon } from './src/components/FlameIcon';
import { LoginScreen } from './src/components/LoginScreen';
import { RegisterScreen } from './src/components/RegisterScreen';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';

/** Splash / loading screen shown while restoring the session */
function SplashScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: '#1A1D29', justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: Colors.textMain, fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        LeetCode<Text style={{ color: Colors.primary }}>Streak</Text>
      </Text>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
}

/** Main authenticated app with bottom tab navigation */
function MainApp() {
  const [activeTab, setActiveTab] = useState('Indiv');
  const { logout } = useAuth();

  const renderContent = () => {
    switch (activeTab) {

      case 'Indiv': return <IndividualScreen />;
      case 'Daily': return <DailyProblem />;
      case 'Grupo': return <GroupStreak />;
      case 'Perfil': return <Profile />;
      default: return <IndividualScreen />;
    }
  };

  const insets = useSafeAreaInsets();

  return (
    <View style={{
      flex: 1,
      backgroundColor: '#1A1D29',
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
    }}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logoText}>
          LeetCode<Text style={{ color: Colors.primary }}>Streak</Text>
        </Text>
      </View>

      <View style={{ flex: 1 }}>
        {renderContent()}
      </View>

      {/* Bottom Navigation */}
      <View style={styles.tabBar}>
        {['Indiv', 'Daily', 'Grupo', 'Perfil'].map((tab) => {
          const isActive = activeTab === tab;

          return (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={styles.tabItem}
            >
              {tab === 'Daily' ? (
                <View style={{ alignItems: 'center' }}>
                  <FlameIcon size={24} active={isActive} />
                  <Text style={[styles.tabText, isActive && { color: Colors.primary, marginTop: 2 }]}>
                  </Text>
                </View>
              ) : (
                <Text style={[styles.tabText, isActive && { color: Colors.primary, fontWeight: 'bold' }]}>
                  {tab}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

/** Root navigator that switches between Auth and Main flows */
function AppNavigator() {
  const { user, isRestoringSession, login, verifyExistence, register } = useAuth();
  const [showRegister, setShowRegister] = useState(false);
  const [pendingUsername, setPendingUsername] = useState('');

  // Show splash while restoring the session from secure storage
  if (isRestoringSession) {
    return <SplashScreen />;
  }

  // Not authenticated → show login or register
  if (!user) {
    if (showRegister) {
      return (
        <View style={{ flex: 1, backgroundColor: '#1A1D29' }}>
          <RegisterScreen
            initialUsername={pendingUsername}
            onRegisterSuccess={async (username) => {
              if (username) {
                try {
                  await login(username);
                } catch (err) {
                  console.error('Login after register failed:', err);
                }
              }
              setShowRegister(false);
            }}
          />
          <TouchableOpacity
            onPress={() => setShowRegister(false)}
            style={{ padding: 15, alignItems: 'center', marginBottom: 20 }}
          >
            <Text style={{ color: Colors.primary }}>Already have an account? Log in</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <LoginScreen
        onLogin={async (username: string) => {
          try {
            const exists = await verifyExistence(username);
            if (exists) {
              await login(username);
            } else {
              // If user doesn't exist, create them first
              await register(username);
              setPendingUsername(username);
              setShowRegister(true);
            }
          } catch (err) {
            console.error('Login flow error:', err);
          }
        }}
      />
    );
  }

  // Authenticated → show main app
  return <MainApp />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}