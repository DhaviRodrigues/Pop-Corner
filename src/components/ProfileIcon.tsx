import { Text, TouchableOpacity, View,Image } from "react-native";
import { style } from "@/styles/style";
import { ReactNode } from "react";

type ProfileIconProps = {
  children?: ReactNode;
};

export function ProfileIcon({ children }: ProfileIconProps) {
    return (
        <View style={style.iconPerfilContainer}>
            <Image 
                source={require('@/screenAssets/icon-perfil.png')} 
                style={style.iconPerfilImage} 
            />
            {children}
        </View>
    );
}
