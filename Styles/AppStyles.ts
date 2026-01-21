// Styles/AppStyles.ts
import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const Colors = {
    bgMain: '#1A1D29',    
    bgCard: '#252936',    
    bgAccent: '#2F3241',  
    primary: '#FFA116',   
    secondary: '#FFC01E', 
    easy: '#1CBABA',      
    medium: '#FFB700',    
    hard: '#F63737',      
    textMain: '#E8E9ED',  
    textMuted: '#9BA3AF', 
};

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgMain,
    },
    safeArea: {
        flex: 1,
        paddingTop: 40,
    },
    header: {
        padding: 20,
        alignItems: 'center',
    },
    logoText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.textMain,
    },
    highlight: {
        color: Colors.primary,
    },

    card: {
        backgroundColor: Colors.bgCard,
        borderRadius: 15,
        padding: 20,
        marginHorizontal: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
    streakHero: {
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.bgAccent,
    },
    streakNumber: {
        fontSize: 60,
        fontWeight: 'bold',
        color: Colors.primary,
    },

    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 10,
    },
    square: {
        width: (width - 100) / 7,
        aspectRatio: 1,
        borderRadius: 4,
        backgroundColor: Colors.bgAccent,
    },

    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.bgAccent,
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
        marginHorizontal: 20,
    },
    indicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 15,
    },

    tabBar: {
        flexDirection: 'row',
        height: 70,
        backgroundColor: Colors.bgCard,
        borderTopWidth: 1,
        borderTopColor: Colors.bgAccent,
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    tabItem: {
        alignItems: 'center',
    },
    tabText: {
        color: Colors.textMuted,
        fontSize: 12,
        marginTop: 4,
    },
    activeTabText: {
        color: Colors.primary,
        fontWeight: 'bold',
    }
});