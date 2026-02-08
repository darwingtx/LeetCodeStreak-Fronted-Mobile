// src/components/FlameIcon.tsx
import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { Colors } from '../Styles/AppStyles';

interface Props {
    size?: number;
    active?: boolean;
}

export const FlameIcon = ({ size = 24, active = false }: Props) => (
    <Svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
    >
        <Path
            d="M12 2C9.5 5 14 7 14 11C14 13.5 12.5 15 12 15C11.5 15 10 13.5 10 11C10 9 8 7.5 8 7.5C6 9.5 5 11.5 5 14C5 18 8.1 22 12 22C15.9 22 19 18 19 14C19 9 14.5 6 12 2Z"
            fill={active ? Colors.primary : Colors.textMuted}
        />
    </Svg>
);
