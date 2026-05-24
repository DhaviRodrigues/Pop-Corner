import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { style as cinemaStyle } from '@/styles/cinema';
interface CinemaCardProps {
    nome: string;
    endereco: string;
    isParceiro: boolean;
    avaliacao: number;
    distancia: string;
    imagem: string;
    filmes: { id: number, image: string }[];
}

// Função de Estrelas Dinâmicas adaptada para o tema Cinema (Vermelha)
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

const CinemaCard = ({ nome, endereco, isParceiro, avaliacao, distancia, imagem, filmes }: CinemaCardProps) => {
    return (
        <View style={cinemaStyle.cinemaCardContainer}>

            {/* Lado Esquerdo: Informações do Cinema */}
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

                {/* Filmes em Cartaz (Abaixo das informações) */}
                <View style={cinemaStyle.moviesRowBottom}>
                    {filmes.slice(0, 2).map((filme) => (
                        <Image
                            key={filme.id}
                            source={{ uri: filme.image }}
                            style={cinemaStyle.miniPosterImage}
                        />
                    ))}
                </View>
            </View>

            {/* Lado Direito: Botão Acima e Imagem Abaixo */}
            <View style={cinemaStyle.cinemaRightActionContainer}>
                {/* A imagem agora é o fundo do container da direita */}
                <View style={cinemaStyle.imageContainerWithButton}>
                    <Image source={{ uri: imagem }} style={cinemaStyle.cinemaMainImageRight} />

                    {/* Botão sobrepondo a imagem */}
                    <TouchableOpacity style={cinemaStyle.seeMoreBtnOverlay} activeOpacity={0.8}>
                        <Text style={cinemaStyle.seeMoreBtnText}>Ver mais</Text>
                    </TouchableOpacity>
                </View>
            </View>

        </View>
  );
};

export default CinemaCard;

