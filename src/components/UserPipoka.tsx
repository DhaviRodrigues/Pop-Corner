import { User } from "@/types/user";
import { Image, StyleSheet, Text, View } from "react-native";

type UserPipokaProps = {
  user?: User | null;
}

export function UserPipoka({ user }: UserPipokaProps) {
  const count = user?.getPipoka() ?? 0;

  return (
    <View style={styles.container}>
      <View style={styles.textWrapper}>
        <Text style={styles.count}>{count} Pipokas</Text>
      </View>

      <View style={styles.iconWrapper}>
        <Image
          source={require("@/screenAssets/pipoka.png")}
          style={styles.icon}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#4d0d0f",
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 14,
    minHeight: 84,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 5,
  },
  textWrapper: {
    flex: 1,
  },
  count: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "700",
    lineHeight: 38,
  },
  label: {
    color: "#fff",
    fontSize: 14,
    marginTop: 4,
    opacity: 0.88,
  },
  iconWrapper: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  icon: {
    width: 48,
    height: 48,
  },
});
