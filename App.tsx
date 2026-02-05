import React, { useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { styles, Colors } from './src/Styles/AppStyles';
import { IndividualScreen } from './src/components/IndividualScreen';
import GroupStreak from './src/components/GroupStreak';
import Profile from './src/components/Profile';
import DailyProblem from './src/components/DailyProblem';

export default function App() {
  // Estado para controlar la navegación simple
  const [activeTab, setActiveTab] = useState('Indiv');

  // Función para decidir qué componente renderizar
  const renderContent = () => {
    switch (activeTab) {
      case 'Indiv':
        return <IndividualScreen />;
      case 'Daily':
        return <DailyProblem />;
      case 'Grupo':
        return <GroupStreak />;
      case 'Perfil':
        return <Profile />;
      default:
        return <IndividualScreen />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* StatusBar */}
      <StatusBar barStyle="light-content" />

      {/* Header Fijo */}
<View style={styles.header}>
    <Text style={styles.logoText}>LeetCode<Text style={{ color: Colors.primary }}>Streak</Text></Text>
    {/* Nuevo botón de acceso rápido en el Header */}
    <TouchableOpacity onPress={() => setActiveTab('Daily')}>
        <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: Colors.primary + '20', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: Colors.primary, fontWeight: 'bold' }}>🔥</Text>
        </View>
    </TouchableOpacity>
</View>

      {/* Área de contenido dinámico */}
      <View style={{ flex: 1 }}>
        {renderContent()}
      </View>

      {/* Navegación Inferior */}
      <View style={styles.tabBar}>
        {['Indiv', 'Daily', 'Grupo', 'Perfil'].map((tab) => (
          <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={styles.tabItem}>
            <Text style={[styles.tabText, activeTab === tab && { color: Colors.primary }]}>
              {tab === 'Daily' ? '🔥' : tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}