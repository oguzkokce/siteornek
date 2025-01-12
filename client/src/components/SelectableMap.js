import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";

const SelectableMap = ({ onLocationSelect, initialPosition }) => {
  const [position, setPosition] = useState(
    initialPosition || [39.92077, 32.85411]
  ); // Başlangıç pozisyonu (Türkiye merkez)

  // Haritaya tıklanınca Marker'ı güncelle
  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]); // Marker pozisyonunu güncelle
        onLocationSelect({ lat, lng }); // Seçilen pozisyonu dışarı aktar
      },
    });

    return position ? <Marker position={position}></Marker> : null;
  };

  return (
    <MapContainer
      center={position}
      zoom={6}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <LocationMarker />
    </MapContainer>
  );
};

export default SelectableMap;
