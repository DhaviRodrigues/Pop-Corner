import { Box } from "@/components/Box";
import { ButtonGenre } from "@/components/ButtonGenre";
import { ButtonVoltar } from "@/components/ButtonVoltar";
import { ButtonY } from "@/components/ButtonY";
import { style } from "@/styles/style";
import { useRouter } from 'expo-router';
import { Dimensions, Image, Text, View } from "react-native";

const { height } = Dimensions.get('window');

export default function Genre(){
    const router = useRouter();

    return(
        <View style={style.background}>
            <Image source={require('@/screenAssets/logo/full-logo.png')} style={style.logoM} height={height * 1} />
            <View style={style.center}> 
                <Box vw={0.80} padTop={0}>
                    <View style={style.formContainer}>
                        <Text style={style.text}>Selecione os seus gêneros favoritos</Text>
                        <View style={style.genresContainer}>
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
                            <Text style={style.message}>*Selecione no mínimo 2 gêneros</Text>
                        </View>
                        <ButtonY title="Continuar" onPress={() => router.push('/home')} />
                        <ButtonVoltar title="Voltar" onPress={() => router.push('/register')} />
                    </View>
                </Box>
            </View>
        </View>
    )
}