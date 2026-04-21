import { Box } from "@/components/Box";
import { ButtonGenre } from "@/components/ButtonGenre";
import { ButtonVoltar } from "@/components/ButtonVoltar";
import { ButtonY } from "@/components/ButtonY";
import { ValidationPopup } from "@/components/ValidationPopup";
import { miscStyle } from "@/styles/misc";
import {logoStyle} from "@/styles/logo";
import { textStyle } from "@/styles/text";
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Dimensions, Image, Text, View, ActivityIndicator } from "react-native";
import { useUserRegistration } from '@/contexts/UserRegistrationContext';
import { registerUser, fetchUserData } from '@/services/auth';
import { useUser } from '@/contexts/UserContext';

const { height } = Dimensions.get('window');

const genres = ['AÇÃO', 'DRAMA', 'COMÉDIA', 'TERROR', 'FICÇÃO CIENTÍFICA', 'SUSPENSE', 'ROMANCE', 'FAROESTE', 'MUSICAL'];

export default function Genre(){
    const router = useRouter();
    const { data, resetData } = useUserRegistration();
    const { setUser } = useUser();
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [validationMessage, setValidationMessage] = useState("");
    const [showValidationPopup, setShowValidationPopup] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const toggleGenre = (genre: string) => {
        setSelectedGenres(prev => 
            prev.includes(genre) 
                ? prev.filter(g => g !== genre) 
                : [...prev, genre]
        );
    };

    const handleContinue = async () => {
        if (selectedGenres.length < 2) {
            setValidationMessage("Selecione no mínimo 2 gêneros.");
            setShowValidationPopup(true);
            return;
        }

        setIsLoading(true);
        
        const result = await registerUser(
            data.name,
            data.email,
            data.password,
            selectedGenres
        );

        if (result.valid) {
            const userData = await fetchUserData();
            if (userData) {
                setUser(userData);
            }

            resetData();
            setIsLoading(false);
            router.push('/home');
            return;
        }

        setValidationMessage(result.error);
        setShowValidationPopup(true);
        setIsLoading(false);
    };

    const closeValidationPopup = () => {
        setShowValidationPopup(false);
    };

    return(
        <View style={miscStyle.background}>
            <Image source={require('@/screenAssets/logo/full-logo.png')} style={logoStyle.logoM} height={height * 1} />
            <View style={miscStyle.center}> 
                <Box vw={0.80} padTop={0}>
                    <View style={miscStyle.formContainer}>
                        <Text style={textStyle.text}>Selecione os seus gêneros favoritos</Text>
                        <View style={miscStyle.genresContainer}>
                            {genres.map(genre => (
                                <ButtonGenre 
                                    key={genre}
                                    title={genre}
                                    selected={selectedGenres.includes(genre)}
                                    onToggle={() => toggleGenre(genre)}
                                />
                            ))}
                        </View>
                        <View style={{ marginTop: height * 0.03, marginBottom: height * 0.01, width: '100%' }}>
                            <Text style={textStyle.message}>*Selecione no mínimo 2 gêneros</Text>
                        </View>
                        {isLoading ? (
                            <ActivityIndicator size="large" color="#FFD60A" style={{ marginVertical: height * 0.02 }} />
                        ) : (
                            <ButtonY title="Continuar" onPress={handleContinue} />
                        )}
                        <ButtonVoltar title="Voltar" onPress={() => router.push('/register')} />
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