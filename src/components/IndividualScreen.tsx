import React from 'react';
import { ScrollView, Text, StyleSheet, View } from 'react-native';
import Card from './Card';
import { styles as globalStyles, Colors } from '../Styles/AppStyles'; 

export const IndividualScreen = () => {
    return (
        <ScrollView style={localStyles.container}>
            {/* Tarjeta de Racha Principal */}
            <Card style={localStyles.heroCard}>
                <Text style={localStyles.label}>Racha Actual</Text>
                <Text style={localStyles.streakNumber}>15</Text>
                <Text style={localStyles.subtext}>¡Días seguidos!</Text>
            </Card>

            {/* Mapa de Progreso */}
            <Card style={localStyles.gridCard}>
                <Text style={localStyles.gridTitle}>Progreso</Text>
                <View style={localStyles.gridContainer}>
                    {[...Array(28)].map((_, i) => (
                        <View 
                            key={i} 
                            style={[
                                localStyles.square, 
                                i % 3 === 0 && { backgroundColor: Colors.primary } 
                            ]} 
                        />
                    ))}
                </View>
            </Card>
        </ScrollView>
    );
};

const localStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16
    },
    heroCard: {
        alignItems: 'center',
        borderTopWidth: 3,
        borderTopColor: Colors.primary, 
        marginBottom: 16
    },
    label: {
        color: Colors.textMuted,
        fontSize: 14
    },
    streakNumber: {
        color: Colors.primary,
        fontSize: 50,
        fontWeight: 'bold'
    },
    subtext: {
        color: Colors.textMain
    },
    gridCard: {
        padding: 16
    },
    gridTitle: { 
        color: Colors.textMain, 
        fontWeight: 'bold', 
        marginBottom: 12 
    },
    gridContainer: {
        flexDirection: 'row', 
        flexWrap: 'wrap',      
        justifyContent: 'flex-start'
    },
    square: {
        width: 22,
        height: 22,
        backgroundColor: '#2F3241', 
        margin: 3,
        borderRadius: 4
    }
});