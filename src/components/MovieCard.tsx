import { TouchableOpacity, Image, ImageSourcePropType } from "react-native";
import { miscStyle } from "@/styles/misc";

type MovieCardProps = {
  iconPath: ImageSourcePropType;
};

export function MovieCard({ iconPath }: MovieCardProps) {
  return (
    <TouchableOpacity style={miscStyle.movieCard} activeOpacity={0.7}>
      <Image 
        source={iconPath} 
        style={miscStyle.movieCardIcon} 
        resizeMode="contain" 
      />
    </TouchableOpacity>
  );
}
