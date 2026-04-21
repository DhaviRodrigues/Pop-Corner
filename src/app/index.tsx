import { Box } from "@/components/Box";
import { ButtonB } from "@/components/ButtonB";
import { ButtonY } from "@/components/ButtonY";
import { Input } from "@/components/Input";
import { ValidationPopup } from "@/components/ValidationPopup";
import { logoStyle } from "@/styles/logo";
import { miscStyle } from "@/styles/misc";
import { textStyle } from "@/styles/text";
import { loginUser, fetchUserData } from "@/services/auth";
import { validateLogin } from "@/validation/login";
import { useUser } from "@/contexts/UserContext";
import { Link, useRouter } from 'expo-router';
import { useState } from "react";
import { ActivityIndicator, Dimensions, Image, Text, TouchableOpacity, View } from "react-native";
const { height } = Dimensions.get('window');

export default function Index(){
    const router = useRouter();
    const { setUser } = useUser();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [validationMessage, setValidationMessage] = useState("");
    const [showValidationPopup, setShowValidationPopup] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    async function handleLogin() {
        const validation = validateLogin(email, password);
        if (!validation.valid) {
            setValidationMessage(validation.error);
            setShowValidationPopup(true);
            return;
        }

        setIsLoading(true);
        const result = await loginUser(email, password);

        if (result.valid) {
            const userData = await fetchUserData();
            if (userData) {
                setUser(userData);
            }

            setShowValidationPopup(false);
            setValidationMessage("");
            setIsLoading(false);
            router.push('/home');
            return;
        }

        setValidationMessage(result.error);
        setShowValidationPopup(true);
        setIsLoading(false);
    }

    function closeValidationPopup() {
        setShowValidationPopup(false);
    }

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
                        <Link href="/passwordRecovery" asChild>
                            <TouchableOpacity style={miscStyle.esqueceuSenhaContainer}>
                                <Text style={textStyle.underlineText}>Esqueceu a Senha?</Text>
                            </TouchableOpacity>
                        </Link>
                        {isLoading ? (
                            <ActivityIndicator size="large" color="#FFD60A" style={{ marginVertical: height * 0.02 }} />
                        ) : (
                            <ButtonY title="Entrar" onPress={handleLogin} />
                        )}
                        <View style={{ marginTop: height * 0.005, marginBottom: height * 0.000, width: '100%' }}>
                            <Text style={textStyle.message}>Ainda não possui uma conta?</Text>
                        </View>
                        <ButtonB title="Cadastre-se" onPress={() => router.push('/register')} />
                    </View>
                </Box>
            </View>
            <ValidationPopup
                visible={showValidationPopup}
                message={validationMessage}
                onClose={closeValidationPopup}
            />
        </View>
    )
}