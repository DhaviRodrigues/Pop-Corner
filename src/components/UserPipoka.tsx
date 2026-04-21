import { User } from "@/types/user";
import { Image, StyleSheet, Text, View } from "react-native";
import { componentStyle } from "@/styles/component";
import { Dimensions} from "react-native";

const { height } = Dimensions.get('window');

type UserPipokaProps = {
  user?: User | null;
}

export function UserPipoka({ user }: UserPipokaProps) {
  const count = user?.getPipoka() ?? 0;

  return (
    <View style={componentStyle.userPipokaContainer}>
      <View style={componentStyle.UserPipokaTextWrapper}>
        <Text style={componentStyle.userPipokaBaseText}>
          <Text style={componentStyle.userPipokaCount}>{count}</Text>
          <Text style={componentStyle.userPipokaBaseText}> Pipokas</Text>
        </Text>
      </View>

      <View style={componentStyle.userPipokaIconWrapper}>
        <Image
          source={require("@/screenAssets/popcorn-collor.png")}
          style={componentStyle.userPipokaIcon}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}
