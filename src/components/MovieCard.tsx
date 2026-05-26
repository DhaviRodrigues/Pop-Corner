import { TouchableOpacity, Image } from "react-native";
import { miscStyle } from "@/styles/misc";
import { useRouter } from "expo-router";

type MovieCardProps = {
  movie: {
    id: string;
    image: string;
  };
};

export function MovieCard({ movie }: MovieCardProps) {
  const router = useRouter();

  return (
    <TouchableOpacity 
      style={[miscStyle.movieCard, { overflow: 'hidden' }]} 
      activeOpacity={0.8}
      onPress={() => router.push({ pathname: "/movieDetails", params: { id: movie.id } })}
    >
      <Image 
        source={{ uri: movie.image }} 
        style={{ width: '100%', height: '100%' }} 
        resizeMode="cover" 
      />
    </TouchableOpacity>
  );
}