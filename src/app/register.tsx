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
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Dimensions, Image, Text, View, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useUserRegistration } from '@/contexts/UserRegistrationContext';
import { ALLOWED_IMAGE_EXTENSIONS } from '@/services/storage';
import { AuthService } from "@/services/authservice";

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

    // CORREÇÃO: Declarada antes de ser chamada no fluxo para evitar o erro de referência
    const validateRegisterInput = () => {
        if (!name.trim() || !email.trim() || !password || !confirmPassword) {
            return { valid: false, error: "Todos os campos devem ser preenchidos." };
        }
        if (password !== confirmPassword) {
            return { valid: false, error: "As senhas inseridas não coincidem." };
        }
        if (password.length < 8) {
            return { valid: false, error: "A senha deve conter no mínimo 8 caracteres." };
        }
        return { valid: true, error: "" };
    };

    const handleContinue = async () => {
        // Trava para evitar cliques duplos se já estiver carregando
        if (isLoading || isPhotoLoading) return;

        // Agora o validador já foi inicializado e está pronto para uso
        const result = validateRegisterInput();

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

        const enviado = await AuthService.initiateRegistration(cleanEmail, code);

        if (!enviado) {
            setValidationMessage("Erro ao enviar e-mail. Tente novamente.");
            setShowValidationPopup(true);
            setIsLoading(false); 
            return;
        }

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
        <View style={{ flex: 1, backgroundColor: miscStyle.background.backgroundColor }}>
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
                style={{ flex: 1 }}
            >
                <ScrollView 
                    contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}
                    keyboardShouldPersistTaps="handled"
                >
                </ScrollView>
                <View style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    justifyContent: 'center',
                    alignItems: 'center',
                    pointerEvents: 'box-none'
                }}>
                    <Image source={require('@/screenAssets/logo/full-logo.png')} style={logoStyle.logoS} />
                    <Box vw={0.80} padTop={0}>
                        <View style={miscStyle.formContainer}>
                            <Text style={textStyle.text}>Foto de Perfil</Text>
                            <ProfileIcon source={profilePhotoUri ? { uri: profilePhotoUri } : undefined}>
                                <Pencil onPhotoSelecting={handlePhotoSelecting} onPhotoSelected={handlePhotoSelected} isLoading={isLoading} />
                            </ProfileIcon>
                            
                            <Text style={textStyle.text}>Insira suas informações pessoais</Text>
                            
                            <Input icon={require('@/screenAssets/icons/profile-icon-gray.png')} text="Nome:" value={name} onChangeText={setName} />
                            <Input icon={require('@/screenAssets/icons/email-icon.png')} text="Email:" value={email} onChangeText={setEmail} />
                            <Input icon={require('@/screenAssets/icons/password-icon-gray.png')} text="Senha:" value={password} onChangeText={setPassword} />
                            <Input icon={require('@/screenAssets/icons/password-icon-gray.png')} text="Confirmar Senha:" value={confirmPassword} onChangeText={setConfirmPassword} />

                            <Text style={textStyle.message}>
                                *A senha deve conter mais de 8 caracteres, letras maiúsculas e números
                            </Text>

                            <ButtonY 
                                title={isLoading ? "Enviando..." : isPhotoLoading ? "Carregando foto..." : "Continuar"} 
                                onPress={handleContinue} 
                                disabled={isLoading || isPhotoLoading} 
                            />
                        <ButtonVoltar title="Voltar" onPress={() => router.push('/')} />
                        </View>
                    </Box>
                </View>
                <View style={{ padding: 20 }}>
                </View>
            </KeyboardAvoidingView>

            <ValidationPopup
                visible={showValidationPopup}
                message={validationMessage}
                onClose={closeValidationPopup}
            />
        </View>
    );
}