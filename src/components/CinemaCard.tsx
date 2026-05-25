import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { style as cinemaStyle } from '@/styles/cinema';

interface CinemaCardProps {
    id: string; 
    nome: string;
    endereco: string;
    isParceiro: boolean;
    avaliacao: number;
    distancia: string;
    imagem: string;
    filmes: { id: number, image: string }[];
}

function DynamicStars({ rating }: { rating: number }) {
    const fills = Array.from({ length: 5 }, (_, i) => Math.max(0, Math.min(1, rating - i)));

    return (
        <View style={cinemaStyle.cinemaStarsWrapper}>
            {fills.map((fill, index) => (
                <View key={index} style={cinemaStyle.cinemaSingleStarContainer}>
                    <Text style={cinemaStyle.cinemaStarBackground}>★</Text>
                    <View style={[cinemaStyle.cinemaStarOverlay, { width: `${fill * 100}%` }]}>
                        <Text style={cinemaStyle.cinemaStarForeground}>★</Text>
                    </View>
                </View>
            ))}
        </View>
    );
}

const CinemaCard = ({ id, nome, endereco, isParceiro, avaliacao, distancia, imagem, filmes }: CinemaCardProps) => {
    const router = useRouter(); // <-- Hook de roteamento

    return (
        <View style={cinemaStyle.cinemaCardContainer}>

            <View style={cinemaStyle.cinemaDetailsContainer}>
                <View>
                    <View style={cinemaStyle.cinemaHeaderRow}>
                        <Text style={cinemaStyle.cinemaNameText} numberOfLines={1}>{nome}</Text>
                    </View>
                    <View style={cinemaStyle.redDividerLine} />
                    <Text style={cinemaStyle.cinemaAddressText} numberOfLines={1}>{endereco}</Text>

                    <Text style={cinemaStyle.cinemaDistanceText}>📍{distancia}</Text>
                </View>

                <View style={cinemaStyle.cinemaStarsWrapper}>
                    <DynamicStars rating={avaliacao} />
                </View>
                {isParceiro && (
                    <Image 
                        source={{ uri: imagem }} 
                        style={cinemaStyle.cinemaMainImageRight} 
                        resizeMode="contain" 
                    />
                )}

                <View style={cinemaStyle.moviesRowBottom}>
                    {filmes.slice(0, 2).map((filme, index) => (
                        <Image
                            key={filme.id ? filme.id : index} 
                            source={{ uri: filme.image || "https://placehold.co/200x300/1A1A1A/FFFEB2?text=Filme" }}
                            style={cinemaStyle.miniPosterImage}
                        />
                    ))}
                </View>
            </View>

            <View style={cinemaStyle.cinemaRightActionContainer}>
                <View style={cinemaStyle.imageContainerWithButton}>
                    <Image source={{ uri: imagem }} style={cinemaStyle.cinemaMainImageRight} />

                    {/* REDIRECIONA PASSANDO O ID DO CINEMA */}
                    <TouchableOpacity 
                        style={cinemaStyle.seeMoreBtnOverlay} 
                        activeOpacity={0.8}
                        onPress={() => router.push({ pathname: '/cinemaDetails', params: { id } })}
                    >
                        <Text style={cinemaStyle.seeMoreBtnText}>Ver mais</Text>
                    </TouchableOpacity>
                </View>
            </View>

        </View>
  );
};

export default CinemaCard;