import { View, Image, ImageSourcePropType } from "react-native";
import { componentStyle } from "@/styles/component";
// Importação do tipo ReactNode para permitir que o componente aceite qualquer elemento React como filho, facilitando a composição de layout.
import { ReactNode } from "react";
import React from 'react';

// Definição da interface de propriedades, onde 'children' é opcional.
type ProfileIconProps = {
  children?: ReactNode;
  source?: ImageSourcePropType;
};

/**
 * Componente responsável pela exibição da imagem de perfil do usuário.
 * A estrutura foi pensada para permitir a sobreposição de outros componentes (como o botão de edição) através da prop children.
 * Agora aceita uma source dinâmica para exibir a foto de perfil do usuário.
 */
export function ProfileIcon({ children, source }: ProfileIconProps) {
    const profileSource = source || require('@/screenAssets/icon-perfil.png');
    
    return (
        // O container principal gerencia o alinhamento central e as dimensões circulares da imagem.
        <View style={componentStyle.iconPerfilContainer}>
            <View style={{ width: '100%', height: '100%', borderRadius: 999, overflow: 'hidden' }}>
                <Image source={profileSource} style={componentStyle.iconPerfilImage} />
            </View>
            {/* A renderização de children abaixo da imagem permite que elementos enviados pelo componente pai apareçam como camadas superiores (overlays). */}
            {children}
        </View>
    );
}
