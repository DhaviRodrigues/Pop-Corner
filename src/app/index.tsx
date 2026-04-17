import { Box } from "@/components/Box";
import { ButtonB } from "@/components/ButtonB";
import { ButtonY } from "@/components/ButtonY";
import { Input } from "@/components/Input";
import { miscStyle } from "@/styles/misc";
import { textStyle } from "@/styles/text";
import { logoStyle } from "@/styles/logo";
import { Link, useRouter } from 'expo-router';
import { Dimensions, Image, Text, TouchableOpacity, View } from "react-native";
const { height } = Dimensions.get('window');

export default function Index(){
    const router = useRouter();

    return(
        <View style={miscStyle.background}>
            <Image source={require('@/screenAssets/logo/full-logo.png')} style={logoStyle.logoB}/>
            <View style={miscStyle.center}> 
                <Box vw={0.80} padTop={0}> 
                    <Image 
                        source={require('@/screenAssets/popcorn-collor.png')} 
                        style={miscStyle.popcorn}
                    />
                    <View style={miscStyle.formContainer}>
                        <Input icon={require('@/screenAssets/icons/email-icon.png')} text="Email:" />
                        <Input icon={require('@/screenAssets/icons/password-icon.png')} text="Senha:" secureTextEntry={true} />
                        <Link href="/passwordRecovery" asChild>
                            <TouchableOpacity style={miscStyle.esqueceuSenhaContainer}>
                                <Text style={textStyle.underlineText}>Esqueceu a Senha?</Text>
                            </TouchableOpacity>
                        </Link>
                        <ButtonY title="Entrar" onPress={() => router.push('/home')} />
                        <View style={{ marginTop: height * 0.005, marginBottom: height * 0.000, width: '100%' }}>
                            <Text style={textStyle.message}>Ainda não possui uma conta?</Text>
                        </View>
                        <ButtonB title="Cadastre-se" onPress={() => router.push('/register')} />
                    </View>
                </Box>
            </View>
        </View>
    )
}