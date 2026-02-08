import React, { useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { styles, Colors } from './src/Styles/AppStyles';
import { IndividualScreen } from './src/components/IndividualScreen';
import GroupStreak from './src/components/GroupStreak';
import Profile from './src/components/Profile';
import DailyProblem from './src/components/DailyProblem';
import { FlameIcon } from './src/components/FlameIcon';

export default function App() {


  const [activeTab, setActiveTab] = useState('Indiv');


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
      <StatusBar barStyle="light-content" />

      {/* Header Fijo */}
      <View style={styles.header}>
        <Text style={styles.logoText}>
          LeetCode<Text style={{ color: Colors.primary }}>Streak</Text>
        </Text>

        <TouchableOpacity onPress={() => setActiveTab('Daily')}>
          <View style={{
            width: 38,
            height: 38,
            borderRadius: 19,
            backgroundColor: activeTab === 'Daily' ? Colors.primary + '30' : Colors.bgAccent,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: activeTab === 'Daily' ? Colors.primary : 'transparent'
          }}>
            <FlameIcon size={22} active={activeTab === 'Daily'} />
          </View>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1 }}>
        {renderContent()}
      </View>

      {/* Navegación Inferior */}
      <View style={styles.tabBar}>
        {['Indiv', 'Daily', 'Grupo', 'Perfil'].map((tab) => {
          const isActive = activeTab === tab;

          return (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={styles.tabItem}
            >
              {/* Si es la pestaña Daily, mostramos la Flama SVG, si no, el texto */}
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
    </SafeAreaView>
  );
}