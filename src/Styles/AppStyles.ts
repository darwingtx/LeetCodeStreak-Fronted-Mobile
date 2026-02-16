// Styles/AppStyles.ts
import { StyleSheet, Dimensions } from 'react-native';
import { Platform } from 'react-native';

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
    // Cards
card: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
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

    streakGrid: {
        marginTop: 10,
    },
    weekRow: {
        flexDirection: 'row',
        marginBottom: 16,
        justifyContent: 'flex-start',
        gap: 6,
    },
    weekDayContainer: {
        width: (width - 100) / 7,
        height: (width - 100) / 7,
        justifyContent: 'center',
        alignItems: 'center',
    },
    square: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: 6,
        backgroundColor: Colors.bgAccent,
    },
    weekSeparator: {
        height: 8,
        marginVertical: 4,
    },
    // Listas
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
        backgroundColor: '#1A1D29', 
        borderTopWidth: 1,
        borderTopColor: '#2F3241',
        paddingBottom: Platform.OS === 'android' ? 20 : 0, 
        height: Platform.OS === 'android' ? 80 : 60, 
        alignItems: 'center',
        justifyContent: 'space-around',
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