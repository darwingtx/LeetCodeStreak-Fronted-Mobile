import React from 'react';
import { ScrollView, Text, StyleSheet, View, Dimensions } from 'react-native';
import Card from './Card';
import { Colors } from '../Styles/AppStyles';

const { width } = Dimensions.get('window');


const MARGIN = 16;
const CARD_PADDING = 16;
// Calculo del ancho de la targeta (mapa de progreso)
const AVAILABLE_WIDTH = width - (MARGIN * 2) - (CARD_PADDING * 2);
// Calculo del ancho de cada columna (7 días por semana)
const COLUMN_WIDTH = AVAILABLE_WIDTH / 7; 
// Tamaño del cuadrado dentro de cada columna (85% del ancho para dejar espacio entre ellos)
const SQUARE_SIZE = COLUMN_WIDTH * 0.85; 

const generateWeeks = () => {
    const daysInMonth = 28; // Febrero 2026
    const firstDayOffset = 6; // Empieza en Domingo (si tu semana es L-D)
    const weeks: number[][] = [];
    let currentWeek: number[] = Array(firstDayOffset).fill(0);

    for (let day = 1; day <= daysInMonth; day++) {
        currentWeek.push(day);
        if (currentWeek.length === 7) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
    }
    if (currentWeek.length > 0) {
        while (currentWeek.length < 7) currentWeek.push(0);
        weeks.push(currentWeek);
    }
    return weeks;
};

export const IndividualScreen = () => {
    const weekDays = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

    return (
        <ScrollView style={localStyles.container} contentContainerStyle={{ paddingBottom: 100 }}>

            {/* Tarjeta de Racha */}
            <Card style={localStyles.heroCard}>
                <Text style={localStyles.label}>Racha Actual</Text>
                <Text style={localStyles.streakNumber}>15</Text>
                <Text style={localStyles.subtext}>¡Días seguidos!</Text>
            </Card>

                {/* Mapa de Progreso */}
            <Card style={localStyles.gridCard}>
                <Text style={localStyles.gridTitle}>Progreso - Febrero</Text>
                
                <View style={localStyles.weekRow}>
                    {weekDays.map((day, i) => (
                        <View key={i} style={localStyles.column}>
                            <Text style={localStyles.weekDayLabel}>{day}</Text>
                        </View>
                    ))}
                </View>

                <View style={localStyles.streakGrid}>
                    {generateWeeks().map((week, weekIndex) => (
                        <View key={weekIndex} style={localStyles.weekRow}>
                            {week.map((day, dayIndex) => (
                                <View key={dayIndex} style={localStyles.column}>
                                    {day > 0 ? (
                                        <View 
                                            style={[
                                                localStyles.square,
                                                day % 3 === 0 && { backgroundColor: Colors.primary },
                                                day % 4 === 0 && { backgroundColor: Colors.medium },
                                                day % 5 === 0 && { backgroundColor: Colors.bgAccent }
                                            ]}
                                        >
                                            <Text style={localStyles.dayNumber}>{day}</Text>
                                        </View>
                                    ) : (
                                        <View style={[localStyles.square, { backgroundColor: 'transparent' }]} />
                                    )}
                                </View>
                            ))}
                        </View>
                    ))}
                </View>
            </Card>
        </ScrollView>
    );
};

const localStyles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.bgMain },
    heroCard: {
        alignItems: 'center',
        paddingVertical: 25,
        borderTopWidth: 4,
        borderTopColor: Colors.primary,
        margin: MARGIN,
    },
    label: { color: Colors.textMuted, fontSize: 14, fontWeight: '600' },
    streakNumber: { color: Colors.primary, fontSize: 64, fontWeight: 'bold' },
    subtext: { color: Colors.textMain, fontSize: 16 },
    
    gridCard: {
        marginHorizontal: MARGIN,
        padding: CARD_PADDING,
    },
    gridTitle: { 
        color: Colors.textMain, 
        fontWeight: 'bold', 
        fontSize: 18,
        marginBottom: 20 
    },
    weekRow: {
        flexDirection: 'row',
        width: '100%',
        marginBottom: 8, 
    },
    column: {
        width: COLUMN_WIDTH, 
        alignItems: 'center', 
    },
    weekDayLabel: {
        color: Colors.textMuted,
        fontSize: 12,
        fontWeight: 'bold',
    },
    streakGrid: { width: '100%' },
    square: {
        width: SQUARE_SIZE,
        height: SQUARE_SIZE,
        borderRadius: 8,
        backgroundColor: Colors.bgAccent,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dayNumber: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.4)',
        fontWeight: 'bold'
    }
});