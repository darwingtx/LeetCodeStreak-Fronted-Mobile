import React from 'react';
import { View, Text } from 'react-native';
import { styles, Colors } from '../Styles/AppStyles';

const Profile = () => (
    <View style={{ flex: 1, padding: 20 }}>
        <View style={{ alignItems: 'center', marginBottom: 30 }}>
            {/* Avatar */}
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

export default Profile;