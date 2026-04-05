import { Box } from "@/components/Box";
import { Input } from "@/components/Input";
import { style } from "@/styles/style";
import { Image, View, Text, TouchableOpacity } from "react-native";
import { Link, useRouter } from 'expo-router';
import {ButtonY} from "@/components/ButtonY";
import {ButtonB} from "@/components/ButtonB";

export default function Index(){
    const router = useRouter();

    return(
        <View style={style.background}>
            <Image source={require('@/screenAssets/logo/full-logo.png')} style={style.logoB}/>
            <View style={style.center}> 
                <Box vw={0.80} vh={0.5} padTop={0} /> 
                <Image 
                    source={require('@/screenAssets/popcorn-collor.png')} 
                    style={style.popcorn}
                />
                <View style={style.formContainer}>
                    <Input icon={require('@/screenAssets/icons/email-icon.png')} text="Email:" />
                    <Input icon={require('@/screenAssets/icons/password-icon.png')} text="Senha:" secureTextEntry={true} />
                    <Link href="./forgot-password" asChild>
                        <TouchableOpacity style={style.esqueceuSenhaContainer}>
                            <Text style={style.esqueceuSenha}>Esqueceu a Senha?</Text>
                        </TouchableOpacity>
                    </Link>
                    <ButtonY title="Entrar" onPress={() => router.push('/home')} />
                    <Text style={style.message}>Ainda não possui uma conta?</Text>
                    <ButtonB title="Cadastre-se" onPress={() => router.push('/register')} />
                </View>
            </View>
        </View>
    )
}