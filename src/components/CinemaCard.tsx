import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { style } from '@/styles/style';

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
        <View style={style.cinemaStarsWrapper}>
            {fills.map((fill, index) => (
                <View key={index} style={style.cinemaSingleStarContainer}>
                    <Text style={style.cinemaStarBackground}>★</Text>
                    <View style={[style.cinemaStarOverlay, { width: `${fill * 100}%` }]}>
                        <Text style={style.cinemaStarForeground}>★</Text>
                    </View>
                </View>
            ))}
        </View>
    );
}

const CinemaCard = ({ nome, endereco, isParceiro, avaliacao, distancia, imagem, filmes }: CinemaCardProps) => {
    return (
        <View style={style.cinemaCardContainer}>

            {/* Lado Esquerdo: Informações do Cinema */}
            <View style={style.cinemaDetailsContainer}>
                <View>
                    <View style={style.cinemaHeaderRow}>
                        <Text style={style.cinemaNameText} numberOfLines={1}>{nome}</Text>
                    </View>
                    <View style={style.redDividerLine} />
                    <Text style={style.cinemaAddressText} numberOfLines={1}>{endereco}</Text>

                    <Text style={style.cinemaDistanceText}>📍{distancia}</Text>
                </View>

                <View style={style.cinemaStarsWrapper}>
                    <DynamicStars rating={avaliacao} />
                </View>
                {isParceiro && (
                    <Image
                        source={require('@/screenAssets/cinema-parceiro.svg')}
                        style={style.partnerBadgeIcon}
                    />
                )}

                {/* Filmes em Cartaz (Abaixo das informações) */}
                <View style={style.moviesRowBottom}>
                    {filmes.slice(0, 2).map((filme) => (
                        <Image
                            key={filme.id}
                            source={{ uri: filme.image }}
                            style={style.miniPosterImage}
                        />
                    ))}
                </View>
            </View>

            {/* Lado Direito: Botão Acima e Imagem Abaixo */}
            <View style={style.cinemaRightActionContainer}>
                {/* A imagem agora é o fundo do container da direita */}
                <View style={style.imageContainerWithButton}>
                    <Image source={{ uri: imagem }} style={style.cinemaMainImageRight} />

                    {/* Botão sobrepondo a imagem */}
                    <TouchableOpacity style={style.seeMoreBtnOverlay} activeOpacity={0.8}>
                        <Text style={style.seeMoreBtnText}>Ver mais</Text>
                    </TouchableOpacity>
                </View>
            </View>

        </View>
  );
};

export default CinemaCard;

