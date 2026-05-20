import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  Platform,
  Text,
} from "react-native";
import { useRouter } from "expo-router";
import { mockCinemas } from "@/data/mockCinemas";
import BottomNavbar from "@/components/Navbar";
import { style, popupStyles } from "@/styles/cinema";

const DynamicStarsPopup = ({ rating }: { rating: number }) => {
  return (
    <div style={popupStyles.starsContainer as React.CSSProperties}>
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
  
  // States de Geolocalização
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [locationError, setLocationError] = useState<boolean>(false);

  // Função para pedir e processar a localização
  const requestLocation = () => {
    setLocationError(false);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
          setAccuracy(position.coords.accuracy);
          setLocationError(false);
        },
        (error) => {
          console.error("Erro de localização:", error);
          setLocationError(true);
          alert("Por favor, permita o acesso à sua localização para que o mapa funcione corretamente.");
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } else {
      alert("A geolocalização não é suportada neste navegador.");
      setLocationError(true);
    }
  };

  useEffect(() => {
    if (Platform.OS === "web") {
      Promise.all([import("react-leaflet"), import("leaflet")]).then(
        ([ReactLeaflet, L]) => {
          setMapComponents({ ...ReactLeaflet, L: L.default });
          requestLocation(); // Dispara o pedido de localização assim que o mapa carregar
        }
      );
    }
  }, []);

  if (!MapComponents) {
    return <View style={style.mapContainer} />;
  }

  // Extração dos componentes Leaflet importados dinamicamente
  const { MapContainer, TileLayer, Marker, Popup, Circle, useMap, L } = MapComponents;

  // Sub-componente mágico do Leaflet que move a câmera quando a localização é descoberta
  const MapUpdater = ({ center }: { center: [number, number] | null }) => {
    const map = useMap();
    useEffect(() => {
      if (center) {
        map.flyTo(center, 14, { duration: 1.5 }); // flyTo faz a transição de câmera suave
      }
    }, [center, map]);
    return null;
  };

  const customIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/DhaviRodrigues/Pop-Corner/e63d33c613bef08c923a14e758fd10eda1f1b608/src/screenAssets/pin-localizacao.svg",
    iconSize: [35, 45],
    iconAnchor: [17, 45],
    popupAnchor: [1, -34],
  });


  const urlFotoUsuario = require("@/screenAssets/icon-perfil.png"); 
  const urlPinFundo =require ("@/screenAssets/pin-user.svg"); 

  const createUserPin = (profilePicUrl: string) => {
    return new L.divIcon({
      className: "custom-user-marker", 
      html: `
        <div style="position: relative; width: 55px; height: 70px; display: flex; justify-content: center;">
          <img src="${urlPinFundo}" style="width: 100%; height: 100%; position: absolute; z-index: 1;" />
          <img src="${profilePicUrl}" style="
            width: 30px; 
            height: 30px; 
            border-radius: 50%; 
            position: absolute; 
            top: 7px; /* Ajuste o top caso a foto fique desalinhada do buraco do SVG */
            z-index: 2; 
            object-fit: cover;
            border: 3px solid #000000;
          " />
        </div>
      `,
      iconSize: [55, 70],      
      iconAnchor: [27.5, 70],  
      popupAnchor: [0, -70],   
    });
  };

  const userLocationIcon = createUserPin(urlFotoUsuario);

  return (
    <View style={style.mapContainer}>
      <MapContainer
        center={userLocation || [-8.1147, -34.9037]} 
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <MapUpdater center={userLocation} />

        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />

        {/* Marcador e círculo de acurácia do Usuário */}
        {userLocation && (
          <>
            <Circle 
              center={userLocation} 
              radius={accuracy || 50} 
              pathOptions={{ color: '#ff0000', fillColor: '#330707', fillOpacity: 0.2 }} 
            />
            <Marker position={userLocation} icon={userLocationIcon}>
              <Popup>Você está aqui</Popup>
            </Marker>
          </>
        )}

        {/* Marcadores dos Cinemas Mockados */}
        {mockCinemas.map((cinema) => (
          <Marker key={cinema.id} position={[cinema.latitude, cinema.longitude]} icon={customIcon}>
            <Popup className="custom-popup">
              <div style={popupStyles.container as React.CSSProperties}>
                <div style={popupStyles.textSection as React.CSSProperties}>
                  <h3 style={popupStyles.title as React.CSSProperties}>{cinema.nome}</h3>
                  <DynamicStarsPopup rating={cinema.avaliacao} />
                  <button style={popupStyles.button as React.CSSProperties} onClick={() => alert("Detalhes de " + cinema.nome)}>
                    Ver Detalhes
                  </button>
                </div>
                <img src={cinema.imagem} alt={cinema.nome} style={popupStyles.image as React.CSSProperties} />
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

   
      {locationError && (
        <View style={style.retryContainer}>
          <Text style={style.retryText}>
            Não conseguimos acesso à sua localização para mostrar os cinemas perto de você.
          </Text>
          <TouchableOpacity style={style.retryButton} onPress={requestLocation}>
            <Text style={style.retryButtonText}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={style.backButtonMap} onPress={() => router.back()}>
        <Image source={require("@/screenAssets/back-icon-buttom.svg")} style={style.backIconMap} />
      </TouchableOpacity>

      <View style={style.navbarWrapperMap}>
        <BottomNavbar />
      </View>
    </View>
  );
}