import { Box } from "@/components/Box";
import { ButtonVoltar } from "@/components/ButtonVoltar";
import { ButtonY } from "@/components/ButtonY";
import { Input } from "@/components/Input";
import { Pencil } from "@/components/Pencil";
import { ProfileIcon } from "@/components/ProfileIcon";
import { ValidationPopup } from "@/components/ValidationPopup";
import { User } from '@/types/user';
import { logoStyle } from "@/styles/logo";
import { miscStyle } from "@/styles/misc";
import { textStyle } from "@/styles/text";
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Dimensions, Image, Text, View } from "react-native";
import { useUserRegistration } from '@/contexts/UserRegistrationContext';
import { ALLOWED_IMAGE_EXTENSIONS } from '@/services/storage';
import { db } from '@/config/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { sendVerificationEmail } from '@/services/cadastro2fa';

const { height } = Dimensions.get('window');

export default function Register() {
    const router = useRouter();
    const { setData } = useUserRegistration();
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [profilePhotoUri, setProfilePhotoUri] = useState<string | null>(null);
    const [profilePhotoFileName, setProfilePhotoFileName] = useState<string | undefined>(undefined);
    const [validationMessage, setValidationMessage] = useState("");
    const [showValidationPopup, setShowValidationPopup] = useState(false);
    
    // Estado único de carregamento
    const [isLoading, setIsLoading] = useState(false);
    const [isPhotoLoading, setIsPhotoLoading] = useState(false);

    const getImageExtension = (uri: string) => {
        return uri.split('.').pop()?.split('?')[0]?.toLowerCase() || '';
    };

    const isValidPhotoFormat = (uri: string | null, fileName?: string | undefined) => {
        if (!uri && !fileName) return true;

        const extFromName = fileName ? getImageExtension(fileName) : '';
        if (extFromName && ALLOWED_IMAGE_EXTENSIONS.includes(extFromName)) return true;

        const ext = uri ? getImageExtension(uri) : '';
        return ext && ALLOWED_IMAGE_EXTENSIONS.includes(ext);
    };

    const handlePhotoSelecting = () => {
        setIsPhotoLoading(true);
    };

    const handlePhotoSelected = (photo: { uri: string | null; fileName?: string } | null) => {
        const uri = photo?.uri ?? null;
        const fileName = photo?.fileName;
        setProfilePhotoUri(uri);
        setProfilePhotoFileName(fileName);
        setIsPhotoLoading(false);
    };

    const handleContinue = async () => {
        // Trava para evitar cliques duplos se já estiver carregando
        if (isLoading || isPhotoLoading) return;

        const result = User.validateRegister(name, email, password, confirmPassword);

        if (!result.valid) {
            setValidationMessage(result.error);
            setShowValidationPopup(true);
            return;
        }

        if (!isValidPhotoFormat(profilePhotoUri, profilePhotoFileName)) {
            setValidationMessage('Formato de imagem inválido. Use apenas JPG, JPEG ou PNG.');
            setShowValidationPopup(true);
            return;
        }

        setIsLoading(true);

        const code = Math.floor(10000 + Math.random() * 90000).toString(); 

        const cleanEmail = email.trim().toLowerCase();

        // Salvar no Firestore
        await setDoc(doc(db, "temp_codes", cleanEmail), {
            code: code,
            createdAt: serverTimestamp()
        });

        // Enviar o e-mail
        const enviado = await sendVerificationEmail(email.trim(), code);

        if (!enviado) {
            setValidationMessage("Erro ao enviar e-mail. Tente novamente.");
            setShowValidationPopup(true);
            setIsLoading(false); 
            return;
        }

        // Salvar dados no contexto, incluindo a URI da foto de perfil (será feito upload em genre.tsx)
        setData({
            name: name.trim(),
            email: cleanEmail,
            password,
            profilePhotoUri: profilePhotoUri || undefined,
            profilePhotoFileName: profilePhotoFileName || undefined,
            favoriteGenres: [],
        });

        router.push('/verificacaoEmail');
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    };

    function closeValidationPopup() {
        setShowValidationPopup(false);
    }

    return (
        <View style={miscStyle.background}>
            <Image source={require('@/screenAssets/logo/full-logo.png')} style={logoStyle.logoS} />
            
            <View style={miscStyle.center}>
                <Box vw={0.80} padTop={0}>
                    <View style={miscStyle.formContainer}>
                        <Text style={textStyle.text}>Foto de Perfil</Text>
                        <ProfileIcon source={profilePhotoUri ? { uri: profilePhotoUri } : undefined}>
                            <Pencil onPhotoSelecting={handlePhotoSelecting} onPhotoSelected={handlePhotoSelected} isLoading={isLoading} />
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

                        <Text style={textStyle.message}>
                            *A senha deve conter mais de 8 caracteres, letras maiúsculas e números
                        </Text>

                        {/* Apenas um botão, usando o estado isLoading */}
                        <ButtonY 
                            title={isLoading ? "Enviando..." : isPhotoLoading ? "Carregando foto..." : "Continuar"} 
                            onPress={handleContinue} 
                            disabled={isLoading || isPhotoLoading} 
                        />
                        
                        <ButtonVoltar title="Voltar" onPress={() => router.push('/')} />
                    </View>
                </Box>
            </View>

            <ValidationPopup
                visible={showValidationPopup}
                message={validationMessage}
                onClose={closeValidationPopup}
            />
        </View>
    );
}