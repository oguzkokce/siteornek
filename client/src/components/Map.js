import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const Map = ({ guides }) => {
  return (
    <MapContainer
      center={[39.92077, 32.85411]}
      zoom={6}
      style={{ height: "500px", width: "100%" }}
      id="map"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {guides.map((guide) => {
        const coordinates = guide.location?.coordinates;
        if (coordinates?.length === 2) {
          return (
            <Marker key={guide._id} position={[coordinates[1], coordinates[0]]}>
              <Popup>
                <strong>{guide.name}</strong>
                <br />
                {guide.description}
              </Popup>
            </Marker>
          );
        }
        return null; // Eğer koordinatlar eksikse Marker gösterme
      })}
    </MapContainer>
  );
};

export default Map;
