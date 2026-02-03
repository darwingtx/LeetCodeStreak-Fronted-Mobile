// components/Card.tsx
import React from 'react';
import { View } from 'react-native';
import { styles } from '../Styles/AppStyles';

interface CardProps {
    children: React.ReactNode;
    style?: any;
}

const Card = ({ children, style }: CardProps) => (
    <View style={[styles.card, style]}>
        {children}
    </View>
);

export default Card;