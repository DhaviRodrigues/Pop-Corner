import React from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { componentStyle } from '@/styles/component';

type PencilProps = {
  onPress?: () => void;
};

export function Pencil({ onPress }: PencilProps) {
    return (
        <TouchableOpacity style={componentStyle.editButtonContainer} onPress={onPress}>
            <Image 
                source={require('@/screenAssets/icons/pencil.svg')} 
                style={componentStyle.editButtonIcon} 
            />
        </TouchableOpacity>
    );
}