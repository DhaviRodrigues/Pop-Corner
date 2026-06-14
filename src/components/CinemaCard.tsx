import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { style as cinemaStyle } from "@/styles/cinema";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase";

function DynamicStars({ rating }: { rating: number }) {
  const fills = Array.from({ length: 5 }, (_, i) =>
    Math.max(0, Math.min(1, rating - i)),
  );
  return (
    <View style={cinemaStyle.cinemaStarsWrapper}>
      {fills.map((fill, index) => (
        <View key={index} style={cinemaStyle.cinemaSingleStarContainer}>
          <Text style={cinemaStyle.cinemaStarBackground}>★</Text>
          <View
            style={[cinemaStyle.cinemaStarOverlay, { width: `${fill * 100}%` }]}
          >
            <Text style={cinemaStyle.cinemaStarForeground}>★</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const CinemaCard = ({
  cinemaData,
  id,
  distancia,
}: {
  cinemaData: any;
  id: string;
  distancia: string;
}) => {
  const router = useRouter();
  const [filmesImagens, setFilmesImagens] = useState<any[]>([]);

  useEffect(() => {
    // Busca as fotos dos filmes no Firebase baseando-se no array do Cinema
    const fetchFilmes = async () => {
      if (
        !cinemaData?.filmesEmCartaz ||
        cinemaData.filmesEmCartaz.length === 0
      ) {
        setFilmesImagens([]);
        return;
      }

      try {
        const filmesBuscados = [];
        const idsParaBuscar = cinemaData.filmesEmCartaz.slice(0, 2);
        const placeholder =
          "https://placehold.co/200x300/1A1A1A/FFFEB2?text=Poster";

        for (const filmeId of idsParaBuscar) {
          const filmeRef = doc(db, "filmes", filmeId);
          const filmeSnap = await getDoc(filmeRef);
          if (filmeSnap.exists()) {
            const fData = filmeSnap.data();
            let imagemFilme =
              fData.image ||
              fData.url_imagem ||
              fData.imagem ||
              fData.poster_path ||
              fData.backdrop_path ||
              null;

            if (
              imagemFilme &&
              typeof imagemFilme === "string" &&
              imagemFilme.startsWith("/")
            ) {
              imagemFilme = `https://image.tmdb.org/t/p/w500${imagemFilme}`;
            }

            filmesBuscados.push({
              id: filmeId,
              image: imagemFilme || placeholder,
            });
          }
        }

        setFilmesImagens(filmesBuscados);
      } catch (error) {
        console.error("Erro ao carregar imagens dos filmes:", error);
        setFilmesImagens([]);
      }
    };

    fetchFilmes();
  }, [cinemaData]);

  return (
    <View style={cinemaStyle.cinemaCardContainer}>
      {cinemaData.is_parceiro && (
        <Image
          source={require("@/screenAssets/cinema-parceiro.svg")}
          style={{
            position: "absolute",
            top: 92,
            right: 285,
            width: 76,
            height: 40,
            zIndex: 10,
          }}
          resizeMode="contain"
        />
      )}

      <View style={cinemaStyle.cinemaDetailsContainer}>
        <View>
          <View style={cinemaStyle.cinemaHeaderRow}>
            <Text style={cinemaStyle.cinemaNameText} numberOfLines={1}>
              {cinemaData.nome}
            </Text>
          </View>
          <View style={cinemaStyle.redDividerLine} />
          <Text style={cinemaStyle.cinemaAddressText} numberOfLines={1}>
            {cinemaData.endereco}
          </Text>

          <Text style={cinemaStyle.cinemaDistanceText}>📍 {distancia}</Text>
        </View>

        <View style={cinemaStyle.cinemaStarsWrapper}>
          <DynamicStars rating={cinemaData.avaliacao || 0} />
        </View>

        <View style={cinemaStyle.moviesRowBottom}>
          {filmesImagens.length > 0 ? (
            filmesImagens.map((filme, index) => (
              <Image
                key={filme.id ? filme.id : index}
                source={{ uri: filme.image }}
                style={cinemaStyle.miniPosterImage}
              />
            ))
          ) : (
            <Text style={{ color: "#666", fontSize: 10, marginTop: 5 }}></Text>
          )}
        </View>
      </View>

      <View style={cinemaStyle.cinemaRightActionContainer}>
        <View style={cinemaStyle.imageContainerWithButton}>
          <Image
            source={{
              uri:
                cinemaData.url_imagem ||
                cinemaData.imagem ||
                "https://placehold.co/600x400/D9D9D9/A62103?text=Sem+Imagem",
            }}
            style={cinemaStyle.cinemaMainImageRight}
          />

          <TouchableOpacity
            style={cinemaStyle.seeMoreBtnOverlay}
            activeOpacity={0.8}
            onPress={() =>
              router.push({ pathname: "/cinemaDetails", params: { id } })
            }
          >
            <Text style={cinemaStyle.seeMoreBtnText}>Ver mais</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default CinemaCard;
