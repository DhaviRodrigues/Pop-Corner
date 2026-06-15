import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  Platform,
  Text,
} from "react-native";
import { useRouter } from "expo-router";
import BottomNavbar from "@/components/Navbar";
import { style, popupStyles } from "@/styles/cinema";
import { useAuth } from "@/contexts/UserContext";
import { BackButton } from "@/components/BackButton";
import { getAllCinemas } from "@/services/cinemaService";

const DynamicStarsPopup = ({ rating }: { rating: number }) => {
  return (
    <div style={popupStyles.starsContainer as React.CSSProperties}>
      {Array.from({ length: 5 }, (_, i) => {
        const fill = Math.max(0, Math.min(1, rating - i)) * 100;
        return (
          <div key={i} style={{ position: "relative", display: "inline-block", fontSize: "22px", color: "#444" }}>
            ★
            <div style={{ position: "absolute", top: 0, left: 0, width: `${fill}%`, overflow: "hidden", color: "#FFFEB2" }}>
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
  
  const { user } = useAuth();

  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [locationError, setLocationError] = useState<boolean>(false);
  const [cinemas, setCinemas] = useState<any[]>([]);

  const requestLocation = () => {
    setLocationError(false);
    
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
          setAccuracy(position.coords.accuracy);
          setLocationError(false);
        },
        (error) => {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              setUserLocation([pos.coords.latitude, pos.coords.longitude]);
              setAccuracy(pos.coords.accuracy);
              setLocationError(false);
            },
            (err) => setLocationError(true),
            { enableHighAccuracy: false, timeout: 10000, maximumAge: Infinity }
          );
        },
        { enableHighAccuracy: true, timeout: 6000, maximumAge: 0 }
      );
    } else {
      setLocationError(true);
    }
  };

  useEffect(() => {
    if (Platform.OS === "web") {
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      Promise.all([import("react-leaflet"), import("leaflet")]).then(
        ([ReactLeaflet, L]) => {
          setMapComponents({ ...ReactLeaflet, L: L.default });
          requestLocation();
        }
      );
    }
    
    const fetchCinemasData = async () => {
      try {
        const cinemasData = await getAllCinemas();
        setCinemas(cinemasData);
      } catch (error) {
        console.error("Erro ao carregar cinemas no Mapa via service:", error);
      }
    };

    fetchCinemasData();
  }, []);

  if (!MapComponents) {
    return <View style={style.mapContainer as any} />;
  }

  const { MapContainer, TileLayer, Marker, Popup, Circle, useMap, L } = MapComponents;

  const MapUpdater = ({ center }: { center: [number, number] | null }) => {
    const map = useMap();
    useEffect(() => { if (center) map.flyTo(center, 14, { duration: 1.5 }); }, [center, map]);
    return null;
  };

  const customIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/DhaviRodrigues/Pop-Corner/e63d33c613bef08c923a14e758fd10eda1f1b608/src/screenAssets/pin-localizacao.svg",
    iconSize: [35, 45],
    iconAnchor: [17, 45],
    popupAnchor: [1, -34],
  });

  const urlFotoUsuario = user ? user.getProfilePicture() : require("@/screenAssets/icon-perfil.png"); 
  const urlPinFundo = require("@/screenAssets/pin-user.svg"); 

  
const createUserPin = (profilePicUrl: string) => {
  return L.divIcon({
    className: "custom-user-marker", 
    html: `
      <div style="width: 55px; height: 70px; display: flex; justify-content: center; align-items: center;">
         <img src="${urlPinFundo}" style="position: absolute; width: 55px; height: 70px;" />
         <img src="${profilePicUrl}" style="width: 30px; height: 30px; border-radius: 50%; border: 3px solid #000; position: absolute; top: 7px; object-fit: cover;" />
      </div>
    `,
    iconSize: [55, 70],      
    iconAnchor: [27.5, 70],  
  });
};

  const userLocationIcon = createUserPin(urlFotoUsuario);

  return (
    <View style={style.mapContainer as any}>
      <MapContainer center={userLocation || [-8.1147, -34.9037]} zoom={13} style={{ height: "100%", width: "100%", zIndex: 1 }}>
        <MapUpdater center={userLocation} />
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />

        {userLocation && (
          <>
            <Circle center={userLocation} radius={accuracy || 50} pathOptions={{ color: '#ff0000', fillColor: '#330707', fillOpacity: 0.2 }} />
            <Marker  key={urlFotoUsuario} position={userLocation} icon={userLocationIcon}>
              <Popup>Você está aqui</Popup>
            </Marker>
          </>
        )}

        {cinemas.map((cinema) => {
          let lat: number | undefined;
          let lng: number | undefined;

          if (cinema.latitude !== undefined && cinema.longitude !== undefined) {
            lat = parseFloat(String(cinema.latitude));
            lng = parseFloat(String(cinema.longitude));
          }
          else if (cinema.coordinates && typeof cinema.coordinates.latitude === 'number') {
            lat = cinema.coordinates.latitude;
            lng = cinema.coordinates.longitude;
          }
          else if (Array.isArray(cinema.coordinates) && cinema.coordinates.length >= 2) {
            lat = parseFloat(String(cinema.coordinates[0]));
            lng = parseFloat(String(cinema.coordinates[1]));
          }

          if (lat === undefined || lng === undefined || isNaN(lat) || isNaN(lng)) {
            console.warn(`Cinema "${cinema.nome}" ignorado: coordenadas inválidas.`);
            return null;
          }
          
          return (
            <Marker key={cinema.id} position={[lat, lng]} icon={customIcon}>
              <Popup className="custom-popup">
                <div style={popupStyles.container as React.CSSProperties}>
                  <div style={popupStyles.textSection as React.CSSProperties}>
                    <h3 style={popupStyles.title as React.CSSProperties}>{cinema.nome}</h3>
                    <DynamicStarsPopup rating={cinema.avaliacao || 0} />
                    
                    <button 
                      style={popupStyles.button as React.CSSProperties} 
                      onClick={() => router.push({ pathname: '/cinemaDetails', params: { id: cinema.id } })}
                    >
                      Ver Detalhes
                    </button>
                  </div>
                  <img 
                    src={cinema.url_imagem || cinema.urlImagem || cinema.imagem} 
                    alt={cinema.nome} 
                    style={popupStyles.image as React.CSSProperties}
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/130x100?text=Sem+Foto";
                      console.log("Falha ao carregar URL:", cinema.url_imagem);
                    }}
                  />
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {locationError && (
        <View style={style.retryContainer as any}>
          <Text style={style.retryText as any}>Não conseguimos acesso à sua localização.</Text>
          <TouchableOpacity style={style.retryButton as any} onPress={requestLocation}>
            <Text style={style.retryButtonText as any}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      )}

      <BackButton style={style.backButtonMap as any} />

      <View style={style.navbarWrapperMap as any}>
        <BottomNavbar />
      </View>
    </View>
  );
}