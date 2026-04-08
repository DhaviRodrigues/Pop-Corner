import { TouchableOpacity, Image, ImageSourcePropType } from "react-native";
import { style } from "@/styles/style";

type MovieCardProps = {
  iconPath: ImageSourcePropType;
};

export function MovieCard({ iconPath }: MovieCardProps) {
  return (
    <TouchableOpacity style={style.movieCard} activeOpacity={0.7}>
      <Image 
        source={iconPath} 
        style={style.movieCardIcon} 
        resizeMode="contain" 
      />
    </TouchableOpacity>
  );
}
