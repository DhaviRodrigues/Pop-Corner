import { BoxDark } from "@/components/BoxDark";
import { LogoutButton } from "@/components/LogoutButton";
import { MyCoupons } from "@/components/MyCoupons";
import BottomNavbar from "@/components/Navbar";
import { ProfileIcon } from "@/components/ProfileIcon";
import { UserPipoka } from "@/components/UserPipoka";
import { COLORS } from "@/constants/colors";
import { useUser } from "@/contexts/UserContext";
import { miscStyle } from "@/styles/misc";
import { textStyle } from "@/styles/text";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import {profileStyle} from "@/styles/profile";
import { Dimensions, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

const { height } = Dimensions.get('window');

export default function Profile(){
    const { user } = useUser();
    const router = useRouter();

    const handleEditProfile = () => {
        router.push('/');
    };

    const handleChangePassword = () => {
        router.push('/passwordRecovery');
    };

    const handleLogout = () => {
    };

    return(
        <View style={miscStyle.background}>
        <ScrollView showsVerticalScrollIndicator={false} 
        style={{ width: '100%' }}>
            <View style={{ alignItems: 'center', width: '100%' }}> 
                <Text style={textStyle.profileText}>Perfil de Usuário</Text>
                <ProfileIcon/>
                <UserPipoka user={user} />
                <Text style={textStyle.text}>{user?.getName()}</Text>
                <Text style={[textStyle.message, { fontFamily: 'Poppins-Light' }]}>{user?.getEmail()}</Text>
                <MyCoupons/>
                <BoxDark vw={0.75} padTop={height * 0.02}>
                    <Text style={profileStyle.configTitle}>Configurações</Text>
                    <TouchableOpacity style={profileStyle.configRow} onPress={handleEditProfile}>
                        <View style={profileStyle.configLeftContent}>
                            <View style={profileStyle.configIcon}>
                                <Image style={profileStyle.iconImage} source={require('@/screenAssets/icons/profile-icon.svg')} />
                            </View>
                            <View style={profileStyle.configTextContent}>
                                <Text style={profileStyle.configLabel}>Editar Perfil</Text>
                                <Text style={profileStyle.configDescription}>Alterar Nome, Gêneros Preferidos, Foto de Perfil</Text>
                            </View>
                        </View>
                        <MaterialCommunityIcons name="chevron-right" size={height * 0.03} color={COLORS.white} />
                    </TouchableOpacity>

                    <TouchableOpacity style={profileStyle.configRow} onPress={handleChangePassword}>
                        <View style={profileStyle.configLeftContent}>
                            <View style={profileStyle.configIcon}>
                                <Image style={profileStyle.iconImage} source={require('@/screenAssets/icons/password-icon.svg')} />
                            </View>
                            <View style={profileStyle.configTextContent}>
                                <Text style={profileStyle.configLabel}>Alterar Senha</Text>
                                <Text style={profileStyle.configDescription}>Melhore sua segurança</Text>
                            </View>
                        </View>
                        <MaterialCommunityIcons name="chevron-right" size={height * 0.03} color={COLORS.white} />
                    </TouchableOpacity>

                    <LogoutButton onPress={handleLogout} />
                </BoxDark>
            </View>
            </ScrollView>
                <BottomNavbar />
            </View>
    )
}