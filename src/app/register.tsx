import { Box } from "@/components/Box";
import { Input } from "@/components/Input";
import { style } from "@/styles/style";
import { Image, View, Text, TouchableOpacity } from "react-native";
import { Link, useRouter } from 'expo-router';
import {ButtonY} from "@/components/ButtonY";
import {ButtonB} from "@/components/ButtonB";
import { ProfileIcon } from "@/components/ProfileIcon";
import { Pencil } from "@/components/Pencil";
import { ButtonVoltar } from "@/components/ButtonVoltar";
import { Dimensions } from "react-native";

const { height } = Dimensions.get('window');

export default function Register(){
    const router = useRouter();

    return(
        <View style={style.background}>
            <Image source={require('@/screenAssets/logo/full-logo.png')} style={style.logoS} height={height * 1} />
            <View style={style.center}> 
                <Box vw={0.80} vh={0.75} padTop={0} /> 
                <View style={style.formContainer}>
                    <Text style={style.text}>Foto de Perfil</Text>
                    <ProfileIcon>
                        <Pencil onPress={() => console.log("Editar foto")} />
                    </ProfileIcon>
                    <Text style={style.text}>Insira suas informações pessoais</Text>
                    <Input icon={require('@/screenAssets/Navbar/perfil-icon.svg')} text="Nome:" />
                    <Input icon={require('@/screenAssets/icons/email-icon.png')} text="Email:" />
                    <Input icon={require('@/screenAssets/icons/password-icon.png')} text="Senha:" secureTextEntry={true} />
                    <Input icon={require('@/screenAssets/icons/password-icon.png')} text="Confirmar Senha:" secureTextEntry={true} />
                    <Text style={style.message}>*A senha deve conter mais de 8 caracteres, letras maiúsculas e números</Text>
                    <ButtonY title="Continuar" onPress={() => router.push('/home')} />
                    <View style={{ flex: 1 }} />
                        <ButtonVoltar title="Voltar" onPress={() => router.push('/')} />
                </View>
            </View>
        </View>
    )
}