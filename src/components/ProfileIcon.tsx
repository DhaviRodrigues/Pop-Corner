import { Text, TouchableOpacity, View,Image } from "react-native";
import { componentStyle } from "@/styles/component";
import { ReactNode } from "react";

type ProfileIconProps = {
  children?: ReactNode;
};

export function ProfileIcon({ children }: ProfileIconProps) {
    return (
        <View style={componentStyle.iconPerfilContainer}>
            <Image 
                source={require('@/screenAssets/icon-perfil.png')} 
                style={componentStyle.iconPerfilImage} 
            />
            {children}
        </View>
    );
}
