import { Box } from "@/components/Box";
import { ButtonVoltar } from "@/components/ButtonVoltar";
import { ButtonY } from "@/components/ButtonY";
import { Input } from "@/components/Input";
import { Pencil } from "@/components/Pencil";
import { ProfileIcon } from "@/components/ProfileIcon";
import { style } from "@/styles/style";
import { useRouter } from 'expo-router';
import { Dimensions, Image, ScrollView, Text, View } from "react-native";

const { height } = Dimensions.get('window');

export default function Register(){
    const router = useRouter();

    return(
        <View style={style.background}>
            <ScrollView showsVerticalScrollIndicator={false} style={{ width: '100%' }}>
            <Image source={require('@/screenAssets/logo/full-logo.png')} style={style.logoS} height={height * 1} />
            <View style={style.center}> 
                <Box vw={0.80} padTop={0}> 
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
                        <ButtonY title="Continuar" onPress={() => router.push('/verificacaoEmail')} />
                        <ButtonVoltar title="Voltar" onPress={() => router.push('/')} />
                    </View>
                </Box>    
            </View>
        </ScrollView>       
        </View>
    )
}