import { User } from "@/types/user";
import { Image, StyleSheet, Text, View } from "react-native";
import { componentStyle } from "@/styles/component";
import { Dimensions} from "react-native";

// Definição da altura da janela para fins de consistência métrica com os demais componentes do projeto.
const { height } = Dimensions.get('window');

// Tipagem das propriedades, aceitando um objeto User que pode ser nulo ou indefinido durante o carregamento do estado.
type UserPipokaProps = {
  user?: User | null;
}

export function UserPipoka({ user }: UserPipokaProps) {
  // Atribuição do valor de "Pipokas" (moeda/pontuação do app). 
  // O encadeamento opcional (?.) e o operador de coalescência nula (??) garantem que o valor padrão seja 0 caso o usuário não esteja autenticado.
  const count = user?.getPipoka() ?? 0;

  return (
    <View style={componentStyle.userPipokaContainer}>
      <View style={componentStyle.UserPipokaTextWrapper}>
        <Text style={componentStyle.userPipokaBaseText}>
          {/* O uso de Text aninhado permite aplicar estilos distintos (negrito/cor) para o número e para o rótulo mantendo-os na mesma linha. */}
          <Text style={componentStyle.userPipokaCount}>{count}</Text>
          <Text style={componentStyle.userPipokaBaseText}> Pipokas</Text>
        </Text>
      </View>

      <View style={componentStyle.userPipokaIconWrapper}>
        <Image
          source={require("@/screenAssets/popcorn-collor.png")}
          style={componentStyle.userPipokaIcon}
          // resizeMode "contain" evita que a imagem do ícone sofra distorção independente da densidade de pixels do dispositivo.
          resizeMode="contain"
        />
      </View>
    </View>
  );
}
