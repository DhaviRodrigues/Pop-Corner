import { BoxDark } from "@/components/BoxDark";
import { BoxDarkSelection } from "@/components/BoxDarkSelection";
import { ButtonY } from "@/components/ButtonY";
import { TitleBar } from "@/components/TitleBar";
import { COLORS } from "@/constants/colors";
import { miscStyle } from "@/styles/misc";
import { useRouter } from "expo-router";
import { Dimensions, Image, ScrollView, View } from "react-native";

const { height } = Dimensions.get("window");

export default function UpdateProfile() {
  const router = useRouter();

  return (
    <View style={miscStyle.background}>
      <TitleBar title="Configurações de Perfil" compact />

      <ScrollView contentContainerStyle={{
          alignItems: "center",
          width: "100%",
        }}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={require('@/screenAssets/logo/full-logo.png')}
          style={{
            width: height * 0.15,
            height: height * 0.12,
            marginBottom: height * 0.01,
            resizeMode: 'contain',
          }}
        />

        <BoxDark vw={0.8} padTop={height * 0.03}>
          <BoxDarkSelection
            iconSource={require('@/screenAssets/icons/profile-icon.svg')}
            title="Alterar Nome de Usuário"
            description="Renomeia o nome do usuário"
            onPress={() => null}
          />

          <BoxDarkSelection
            iconSource={require('@/screenAssets/trashbin.svg')}
            title="Remover Foto de Perfil"
            description="Restaura a foto de perfil para a imagem padrão"
            onPress={() => null}
          />

          <BoxDarkSelection
            iconSource={require('@/screenAssets/arrows.svg')}
            title="Mudar Foto de Perfil"
            description="Troca sua foto de perfil pela imagem selecionada"
            onPress={() => null}
          />

          <BoxDarkSelection
            iconSource={require('@/screenAssets/movie-tape.svg')}
            title="Gerenciar Gêneros Favoritos"
            description="Permite a adição e remoção de gêneros aos favoritos"
            onPress={() => null}
          />

          <BoxDarkSelection
            iconSource={require('@/screenAssets/trashbin.svg')}
            title="Deletar Perfil"
            description="Remova sua conta permanentemente"
            onPress={() => null}
            color={COLORS.gold}
            style={{ marginTop: height * 0.015}}
          />
        </BoxDark>

        <ButtonY title="Voltar" onPress={() => router.push('/profile')} />
      </ScrollView>
    </View>
  );
}
