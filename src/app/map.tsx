import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { mockCinemas } from "@/data/mockCinemas";
import BottomNavbar from "@/components/Navbar";
import { COLORS } from "@/constants/colors";

// 1. Transformamos a função em um Componente React para o Popup renderizar corretamente
const DynamicStarsPopup = ({ rating }: { rating: number }) => {
  return (
    <div style={popupStyles.starsContainer}>
      {Array.from({ length: 5 }, (_, i) => {
        const fill = Math.max(0, Math.min(1, rating - i)) * 100;
        return (
          <div
            key={i}
            style={{
              position: "relative",
              display: "inline-block",
              fontSize: "22px",
              color: "#444",
            }}
          >
            ★
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: `${fill}%`,
                overflow: "hidden",
                color: "#FFFEB2",
              }}
            >
              ★
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default function MapaWeb() {
  const router = useRouter();
  const [MapComponents, setMapComponents] = useState<any>(null);

  useEffect(() => {
    if (Platform.OS === "web") {
      Promise.all([import("react-leaflet"), import("leaflet")]).then(
        ([ReactLeaflet, L]) => {
          setMapComponents({ ...ReactLeaflet, L: L.default });
        },
      );
    }
  }, []);

  if (!MapComponents) {
    return <View style={{ flex: 1, backgroundColor: "#000" }} />;
  }

  const { MapContainer, TileLayer, Marker, Popup, L } = MapComponents;

  const customIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/DhaviRodrigues/Pop-Corner/e63d33c613bef08c923a14e758fd10eda1f1b608/src/screenAssets/pin-localizacao.svg",
    iconSize: [35, 45], // Aumentado um pouco para melhor visibilidade
    iconAnchor: [17, 45],
    popupAnchor: [1, -34],
  });

  return (
    <View style={styles.container}>
      <MapContainer
        center={[-8.1147, -34.9037]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />

        {mockCinemas.map((cinema) => (
          <Marker
            key={cinema.id}
            position={[cinema.latitude, cinema.longitude]}
            icon={customIcon}
          >
            <Popup className="custom-popup">
              <div style={popupStyles.container}>
                {/* LADO ESQUERDO: Texto, Estrelas e Botão */}
                <div style={popupStyles.textSection}>
                  <h3 style={popupStyles.title}>{cinema.nome}</h3>

                  <DynamicStarsPopup rating={cinema.avaliacao} />

                  <button
                    style={popupStyles.button}
                    onClick={() => alert("Detalhes de " + cinema.nome)}
                  >
                    Ver Detalhes
                  </button>
                </div>

                {/* LADO DIREITO: Imagem do Cinema */}
                <img
                  src={cinema.imagem}
                  alt={cinema.nome}
                  style={popupStyles.image}
                />
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Image
          source={require("@/screenAssets/back-icon-buttom.svg")}
          style={styles.backIcon}
        />
      </TouchableOpacity>

      <View style={styles.navbarWrapper}>
        <BottomNavbar />
      </View>
    </View>
  );
}

const popupStyles = {
  container: {
    backgroundColor: COLORS.primary,
    padding: "12px",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "row" as const,
    alignItems: "center",
    gap: "15px",
    minWidth: "280px",
    elevation: 50,
  },
  textSection: {
    flex: 1,
    textAlign: "left" as const,
  },
  title: {
    margin: "0 0 5px 0",
    color: "#FFF",
    fontFamily: "Poppins-Bold, sans-serif",
    fontSize: "16px",
    lineHeight: "1.2",
  },
  image: {
    width: "130px",
    height: "100px",
    borderRadius: "8px",
    objectFit: "cover" as const,
  },
  starsContainer: {
    display: "flex",
    justifyContent: "flex-start",
    marginBottom: "8px",
  },
  button: {
    backgroundColor: "#FFFEB2",
    color: "#000",
    border: "none",
    padding: "8px",
    borderRadius: "6px",
    fontFamily: "Poppins-Bold, sans-serif",
    fontWeight: "bold" as const,
    cursor: "pointer",
    width: "90%",
    fontSize: "12px",
  },
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  backButton: {
    position: "absolute",
    top: 20,
    left: 10,
    zIndex: 1000,
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 10,
    borderRadius: 50,
  },
  backIcon: { 
    width: 50,
    height: 50,
  },
  navbarWrapper: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    zIndex: 1000,
  },
});
