import { Box } from "@/components/Box";
import { ButtonGenre } from "@/components/ButtonGenre";
import { ButtonVoltar } from "@/components/ButtonVoltar";
import { ButtonY } from "@/components/ButtonY";
import { miscStyle } from "@/styles/misc";
import {logoStyle} from "@/styles/logo";
import { textStyle } from "@/styles/text"
import { useRouter } from 'expo-router';
import { Dimensions, Image, Text, View } from "react-native";

const { height } = Dimensions.get('window');

export default function Genre(){
    const router = useRouter();

    return(
        <View style={miscStyle.background}>
            <Image source={require('@/screenAssets/logo/full-logo.png')} style={logoStyle.logoM} height={height * 1} />
            <View style={miscStyle.center}> 
                <Box vw={0.80} padTop={0}>
                    <View style={miscStyle.formContainer}>
                        <Text style={textStyle.text}>Selecione os seus gêneros favoritos</Text>
                        <View style={miscStyle.genresContainer}>
                            <ButtonGenre title='AÇÃO'></ButtonGenre>
                            <ButtonGenre title='DRAMA'></ButtonGenre>
                            <ButtonGenre title='COMÉDIA'></ButtonGenre>
                            <ButtonGenre title='TERROR'></ButtonGenre>
                            <ButtonGenre title='FICÇÃO CIENTÍFICA'></ButtonGenre>
                            <ButtonGenre title='SUSPENSE'></ButtonGenre>
                            <ButtonGenre title='ROMANCE'></ButtonGenre>
                            <ButtonGenre title='FAROESTE'></ButtonGenre>
                            <ButtonGenre title='MUSICAL'></ButtonGenre>
                        </View>
                        <View style={{ marginTop: height * 0.03, marginBottom: height * 0.01, width: '100%' }}>
                            <Text style={textStyle.message}>*Selecione no mínimo 2 gêneros</Text>
                        </View>
                        <ButtonY title="Continuar" onPress={() => router.push('/home')} />
                        <ButtonVoltar title="Voltar" onPress={() => router.push('/register')} />
                    </View>
                </Box>
            </View>
        </View>
    )
}