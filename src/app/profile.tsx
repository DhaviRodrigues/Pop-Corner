import { miscStyle } from "@/styles/misc";
import { textStyle } from "@/styles/text";
import { Link, useRouter } from 'expo-router';
import { UserPipoka } from "@/components/UserPipoka";
import { ProfileIcon } from "@/components/ProfileIcon";
import { Dimensions, Image, Text, TouchableOpacity, View } from "react-native";
import { MyCoupons } from "@/components/MyCoupons";
import { useUser } from "@/contexts/UserContext";

const { height } = Dimensions.get('window');

export default function Profile(){
    const { user } = useUser();

    return(
        <View style={miscStyle.background}>
            <View style={miscStyle.center}> 
                <Text style={textStyle.message}>Perfil de Usuário</Text>
                <ProfileIcon/>
                <UserPipoka user={user} />
                <MyCoupons/>
                <Text style={textStyle.text}>{user?.getName()}</Text>
                <Text style={[textStyle.text, { fontFamily: 'Poppins-Light' }]}>{user?.getEmail()}</Text>

            </View>
        </View>
    )
}