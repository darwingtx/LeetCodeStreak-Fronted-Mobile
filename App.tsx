
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar 
} from 'react-native';
import { styles, Colors } from './Styles/AppStyles';


const IndividualStreak = () => (
  <ScrollView>
    <View style={[styles.card, styles.streakHero]}>
      <Text style={{ color: Colors.textMuted }}>Racha Actual</Text>
      <Text style={styles.streakNumber}>15</Text>
      <Text style={{ color: Colors.textMain }}>¡Días de constancia!</Text>
    </View>

    <View style={styles.card}>
      <Text style={{ color: Colors.textMain, fontWeight: 'bold', marginBottom: 10 }}>Progreso</Text>
      <View style={styles.grid}>
        {[...Array(10)].map((_, i) => (
          <View key={i} style={[styles.square, i % 3 === 0 && {backgroundColor: Colors.secondary}]} />
        ))}
      </View>
    </View>

    <Text style={{ color: Colors.textMain, marginLeft: 20, marginBottom: 10, fontWeight: 'bold' }}>
      Ejercicios Recientes
    </Text>
    <View style={styles.listItem}>
      <View style={[styles.indicator, { backgroundColor: Colors.easy }]} />
      <View>
        <Text style={{ color: Colors.textMain, fontWeight: 'bold' }}>Two Sum</Text>
        <Text style={{ color: Colors.textMuted, fontSize: 12 }}>Hoy - 10:30 AM</Text>
      </View>
    </View>
  </ScrollView>
);

const GroupStreak = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ color: Colors.textMain }}>Sección Grupal en Construcción</Text>
  </View>
);

const Profile = () => (
  <View style={{ flex: 1, padding: 20 }}>
    <View style={{ alignItems: 'center', marginBottom: 30 }}>
      <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.bgAccent }} />
      <Text style={{ color: Colors.textMain, fontSize: 20, marginTop: 10 }}>@DevUser</Text>
    </View>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <View style={[styles.card, { flex: 1, alignItems: 'center', marginHorizontal: 5 }]}>
        <Text style={{ color: Colors.easy, fontWeight: 'bold' }}>45</Text>
        <Text style={{ color: Colors.textMuted, fontSize: 10 }}>Fácil</Text>
      </View>
      <View style={[styles.card, { flex: 1, alignItems: 'center', marginHorizontal: 5 }]}>
        <Text style={{ color: Colors.medium, fontWeight: 'bold' }}>20</Text>
        <Text style={{ color: Colors.textMuted, fontSize: 10 }}>Medio</Text>
      </View>
    </View>
  </View>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('Indiv');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.logoText}>LeetCode<Text style={styles.highlight}>Streak</Text></Text>
      </View>

      <View style={{ flex: 1 }}>
        {activeTab === 'Indiv' && <IndividualStreak />}
        {activeTab === 'Grupo' && <GroupStreak />}
        {activeTab === 'Perfil' && <Profile />}
      </View>

      {/* Navegación Inferior Personalizada */}
      <View style={styles.tabBar}>
        {['Indiv', 'Grupo', 'Perfil'].map((tab) => (
          <TouchableOpacity 
            key={tab} 
            onPress={() => setActiveTab(tab)}
            style={styles.tabItem}
          >
            <Text style={[
              styles.tabText, 
              activeTab === tab && styles.activeTabText
            ]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}