import React, { useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { styles, Colors } from './src/Styles/AppStyles'; 
import { IndividualScreen } from './src/components/IndividualScreen';
import GroupStreak from './src/components/GroupStreak';
import Profile from './src/components/Profile';

export default function App() {
  // Estado para controlar la navegación simple
  const [activeTab, setActiveTab] = useState('Indiv');

  // Función para decidir qué componente renderizar
  const renderContent = () => {
    switch (activeTab) {
      case 'Indiv': 
        return <IndividualScreen />;
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
        <Text style={styles.logoText}>
          LeetCode<Text style={{ color: Colors.primary }}>Streak</Text>
        </Text>
      </View>

      {/* Área de contenido dinámico */}
      <View style={{ flex: 1 }}>
        {renderContent()}
      </View>

      {/* Navegación Inferior */}
      <View style={styles.tabBar}>
        {['Indiv', 'Grupo', 'Perfil'].map((tab) => (
          <TouchableOpacity 
            key={tab} 
            onPress={() => setActiveTab(tab)}
            style={styles.tabItem}
          >
            <Text style={[
              styles.tabText, 
              activeTab === tab && { color: Colors.primary, fontWeight: 'bold' }
            ]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}