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
import { useUser } from "@/contexts/UserContext";

// IMPORTAÇÕES EXCLUSIVAS DO FIREBASE (Sem Mock)
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/config/firebase";

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
  
  const { user } = useUser();

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
      // Injetando CSS do mapa para não ficar tela preta
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

    // BUSCA REAL DO FIREBASE
    const fetchCinemasFromFirebase = async () => {
      try {
        console.log("Buscando dados na coleção 'cinemas' do Firebase...");
        const querySnapshot = await getDocs(collection(db, "cinemas"));
        
        const cinemasData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // ESSE CONSOLE VAI PROVAR O QUE ESTÁ VINDO DO BANCO DE DADOS
        console.log("CINEMAS RECEBIDOS DO FIREBASE:", cinemasData);
        
        setCinemas(cinemasData);
      } catch (error) {
        console.error("Erro ao carregar cinemas do Firebase:", error);
      }
    };

    fetchCinemasFromFirebase();
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
        <div style="position: relative; width: 55px; height: 70px; display: flex; justify-content: center;">
          <img src="${urlPinFundo}" style="width: 100%; height: 100%; position: absolute; z-index: 1;" />
          <img src="${profilePicUrl}" style="
            width: 30px; height: 30px; border-radius: 50%; position: absolute; 
            top: 7px; z-index: 2; object-fit: cover; border: 3px solid #000000;
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
    <View style={style.mapContainer as any}>
      <MapContainer center={userLocation || [-8.1147, -34.9037]} zoom={13} style={{ height: "100%", width: "100%", zIndex: 1 }}>
        <MapUpdater center={userLocation} />
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />

        {userLocation && (
          <>
            <Circle center={userLocation} radius={accuracy || 50} pathOptions={{ color: '#ff0000', fillColor: '#330707', fillOpacity: 0.2 }} />
            <Marker position={userLocation} icon={userLocationIcon}>
              <Popup>Você está aqui</Popup>
            </Marker>
          </>
        )}

        {/* MAP EM CIMA DOS CINEMAS EXCLUSIVOS DO FIREBASE */}
        {cinemas.map((cinema) => {
          let lat: number | undefined;
          let lng: number | undefined;

          // 1. TENTA LER COMO CAMPOS SEPARADOS (caso existam)
          if (cinema.latitude !== undefined && cinema.longitude !== undefined) {
            lat = parseFloat(String(cinema.latitude));
            lng = parseFloat(String(cinema.longitude));
          }
          // 2. TENTA LER COMO GEOPOINT (Formato que o seu Firebase está salvando: 'coordinates')
          else if (cinema.coordinates && typeof cinema.coordinates.latitude === 'number') {
            lat = cinema.coordinates.latitude;
            lng = cinema.coordinates.longitude;
          }
          // 3. TENTA LER COMO ARRAY (caso tenha algum cinema antigo assim)
          else if (Array.isArray(cinema.coordinates) && cinema.coordinates.length >= 2) {
            lat = parseFloat(String(cinema.coordinates[0]));
            lng = parseFloat(String(cinema.coordinates[1]));
          }

          // Segurança: Verifica se são números válidos
          if (lat === undefined || lng === undefined || isNaN(lat) || isNaN(lng)) {
            console.warn(`Cinema "${cinema.nome}" ignorado: coordenadas inválidas.`);
            return null;
          }

          // Agora o TypeScript sabe que lat e lng são 'number' (não undefined)
          return (
            <Marker key={cinema.id} position={[lat, lng]} icon={customIcon}>
              <Popup className="custom-popup">
                <div style={popupStyles.container as React.CSSProperties}>
                  <div style={popupStyles.textSection as React.CSSProperties}>
                    <h3 style={popupStyles.title as React.CSSProperties}>{cinema.nome}</h3>
                    <DynamicStarsPopup rating={cinema.avaliacao || 0} />
                    <button style={popupStyles.button as React.CSSProperties} onClick={() => alert("Detalhes de " + cinema.nome)}>
                      Ver Detalhes
                    </button>
                  </div>
                  <img src={cinema.imagem} alt={cinema.nome} style={popupStyles.image as React.CSSProperties} />
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

      <TouchableOpacity style={style.backButtonMap as any} onPress={() => router.back()}>
        <Image source={require("@/screenAssets/back-icon-buttom.svg")} style={style.backIconMap as any} />
      </TouchableOpacity>

      <View style={style.navbarWrapperMap as any}>
        <BottomNavbar />
      </View>
    </View>
  );
}