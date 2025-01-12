import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Özel ikon tanımı
const customIcon = new L.Icon({
  iconUrl: require("../assets/marker-icon.png"), // Marker için özel resim
  iconRetinaUrl: require("../assets/marker-icon-2x.png"),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: require("../assets/marker-shadow.png"),
  shadowSize: [41, 41],
});

const Map = ({ guides }) => {
  return (
    <MapContainer
      center={[39.92077, 32.85411]} // Harita başlangıç merkezi (Ankara)
      zoom={6} // Başlangıç yakınlaştırma seviyesi
      style={{ height: "500px", width: "100%" }} // Harita boyutları
      id="map"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {guides.map((guide) => {
        const coordinates = guide.location?.coordinates; // Koordinatları al
        if (coordinates?.length === 2) {
          return (
            <Marker
              key={guide._id} // Her marker için benzersiz bir key
              position={[coordinates[1], coordinates[0]]} // [lat, lng]
              icon={customIcon} // Özel ikon
            >
              <Popup>
                <strong>{guide.name}</strong>
                <br />
                {guide.description || "Açıklama bulunmuyor."}
              </Popup>
            </Marker>
          );
        }
        return null; // Eğer koordinatlar eksikse bir şey döndürme
      })}
    </MapContainer>
  );
};

export default Map;
