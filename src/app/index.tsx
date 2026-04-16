import { Box } from "@/components/Box";
import { ButtonB } from "@/components/ButtonB";
import { ButtonY } from "@/components/ButtonY";
import { Input } from "@/components/Input";
import { style } from "@/styles/style";
import { Link, useRouter } from 'expo-router';
import { Dimensions, Image, Text, TouchableOpacity, View } from "react-native";
const { height } = Dimensions.get('window');

export default function Index(){
    const router = useRouter();

    return(
        <View style={style.background}>
            <Image source={require('@/screenAssets/logo/full-logo.png')} style={style.logoB}/>
            <View style={style.center}> 
                <Box vw={0.80} padTop={0}> 
                    <Image 
                        source={require('@/screenAssets/popcorn-collor.png')} 
                        style={style.popcorn}
                    />
                    <View style={style.formContainer}>
                        <Input icon={require('@/screenAssets/icons/email-icon.png')} text="Email:" />
                        <Input icon={require('@/screenAssets/icons/password-icon.png')} text="Senha:" secureTextEntry={true} />
                        <Link href="/recuperarSenha" asChild>
                            <TouchableOpacity style={style.esqueceuSenhaContainer}>
                                <Text style={style.esqueceuSenha}>Esqueceu a Senha?</Text>
                            </TouchableOpacity>
                        </Link>
                        <ButtonY title="Entrar" onPress={() => router.push('/home')} />
                        <View style={{ marginTop: height * 0.025, marginBottom: height * 0.001, width: '100%' }}>
                            <Text style={style.message}>Ainda não possui uma conta?</Text>
                        </View>
                        <ButtonB title="Cadastre-se" onPress={() => router.push('/register')} />
                    </View>
                </Box>
            </View>
        </View>
    )
}