import { Box } from "@/components/Box";
import { ButtonVoltar } from "@/components/ButtonVoltar";
import { ButtonY } from "@/components/ButtonY";
import { Input } from "@/components/Input";
import { Pencil } from "@/components/Pencil";
import { ProfileIcon } from "@/components/ProfileIcon";
import { ValidationPopup } from "@/components/ValidationPopup";
import { logoStyle } from "@/styles/logo";
import { miscStyle } from "@/styles/misc";
import { textStyle } from "@/styles/text";
import { validateRegister } from "@/validation/user_register";
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Dimensions, Image, ScrollView, Text, View } from "react-native";
import { useUserRegistration } from '@/contexts/UserRegistrationContext';

const { height } = Dimensions.get('window');

export default function Register(){
    const router = useRouter();
    const { setData } = useUserRegistration();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [validationMessage, setValidationMessage] = useState("");
    const [showValidationPopup, setShowValidationPopup] = useState(false);

    const handleContinue = () => {
        const result = validateRegister(name, email, password, confirmPassword);

        if (!result.valid) {
            setValidationMessage(result.error);
            setShowValidationPopup(true);
            return;
        }

        // Salvar dados no contexto
        setData({
            name: name.trim(),
            email: email.trim(),
            password,
            favoriteGenres: [], // será definido depois
        });

        router.push('/verificacaoEmail');
    };

    function closeValidationPopup() {
        setShowValidationPopup(false);
    }

    return(
        <View style={miscStyle.background}>
            <ScrollView showsVerticalScrollIndicator={false} style={{ width: '100%' }}>
            <Image source={require('@/screenAssets/logo/full-logo.png')} style={logoStyle.logoS} height={height * 1} />
            <View style={miscStyle.center}> 
                <Box vw={0.80} padTop={0}> 
                    <View style={miscStyle.formContainer}>
                        <Text style={textStyle.text}>Foto de Perfil</Text>
                        <ProfileIcon>
                            <Pencil onPress={() => console.log("Editar foto")} />
                        </ProfileIcon>
                        <Text style={textStyle.text}>Insira suas informações pessoais</Text>
                        <Input
                          icon={require('@/screenAssets/Navbar/perfil-icon.svg')}
                          text="Nome:"
                          value={name}
                          onChangeText={setName}
                        />
                        <Input
                          icon={require('@/screenAssets/icons/email-icon.png')}
                          text="Email:"
                          value={email}
                          onChangeText={setEmail}
                        />
                        <Input
                          icon={require('@/screenAssets/icons/password-icon.png')}
                          text="Senha:"
                          secureTextEntry={true}
                          value={password}
                          onChangeText={setPassword}
                        />
                        <Input
                          icon={require('@/screenAssets/icons/password-icon.png')}
                          text="Confirmar Senha:"
                          secureTextEntry={true}
                          value={confirmPassword}
                          onChangeText={setConfirmPassword}
                        />
                        <Text style={textStyle.message}>*A senha deve conter mais de 8 caracteres, letras maiúsculas e números</Text>
                        <ButtonY title="Continuar" onPress={handleContinue} />
                        <ButtonVoltar title="Voltar" onPress={() => router.push('/')} />
                    </View>
                </Box>    
            </View>
        </ScrollView>
            <ValidationPopup
                visible={showValidationPopup}
                message={validationMessage}
                onClose={closeValidationPopup}
            />
        </View>
    )
}