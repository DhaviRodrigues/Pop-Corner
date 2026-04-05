import React from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { style } from '@/styles/style';

type PencilProps = {
  onPress?: () => void;
};

export function Pencil({ onPress }: PencilProps) {
    return (
        <TouchableOpacity style={style.editButtonContainer} onPress={onPress}>
            <Image 
                source={require('@/screenAssets/icons/pencil.svg')} 
                style={style.editButtonIcon} 
            />
        </TouchableOpacity>
    );
}