// src/components/DailyProblem.tsx
import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { Colors } from '../Styles/AppStyles';

const DailyProblem = () => {
    return (
        <ScrollView style={localStyles.container}>

            <View style={localStyles.headerSection}>
                <Text style={localStyles.title}>3379. Transformed Array</Text>
                <View style={localStyles.tagContainer}>
                    <Text style={[localStyles.tag, { color: Colors.easy }]}>Easy</Text>
                    <Text style={localStyles.tag}>Topics</Text>
                    <Text style={localStyles.tag}>Companies</Text>
                </View>
            </View>

            <View style={localStyles.content}>
                <Text style={localStyles.description}>
                    You are given an integer array <Text style={localStyles.code}>nums</Text> that represents a circular array.
                    Your task is to create a new array <Text style={localStyles.code}>result</Text> of the same size...
                </Text>

                {/* Ejemplo 1 */}
                <View style={localStyles.exampleBox}>
                    <Text style={localStyles.exampleTitle}>Example 1:</Text>
                    <Text style={localStyles.exampleText}>
                        <Text style={{ fontWeight: 'bold' }}>Input: </Text>nums = [3,-2,1,1]{"\n"}
                        <Text style={{ fontWeight: 'bold' }}>Output: </Text>[1,1,1,3]
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
};

const localStyles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    headerSection: { marginBottom: 20 },
    title: { color: 'white', fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
    tagContainer: { flexDirection: 'row', gap: 10 },
    tag: { color: '#9BA3AF', backgroundColor: '#252936', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, fontSize: 12 },
    content: { gap: 15 },
    description: { color: '#E8E9ED', lineHeight: 22, fontSize: 16 },
    code: { backgroundColor: '#2F3241', color: Colors.primary, fontFamily: 'monospace', paddingHorizontal: 4 },
    exampleBox: { backgroundColor: '#252936', padding: 15, borderRadius: 8, marginTop: 10 },
    exampleTitle: { color: 'white', fontWeight: 'bold', marginBottom: 5 },
    exampleText: { color: '#E8E9ED', fontFamily: 'monospace' },
});

export default DailyProblem;