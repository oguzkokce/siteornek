import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import axios from "axios";

const GuideRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    description: "",
    price: "",
    location: { lat: null, lng: null },
  });
  const [markerPosition, setMarkerPosition] = useState([39.92077, 32.85411]); // Varsayılan Ankara koordinatları

  // Haritaya tıklama olayı
  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;
        setMarkerPosition([lat, lng]);
        setFormData((prev) => ({
          ...prev,
          location: { lat, lng },
        }));
      },
    });
    return null;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Kayıt Edilen Veri:", formData); // Konsolda veriyi kontrol edin

    try {
      const response = await axios.post(
        "http://localhost:5000/api/guides/register",
        {
          ...formData,
          location: {
            type: "Point",
            coordinates: [formData.location.lng, formData.location.lat], // Backend için longitude, latitude formatı
          },
        }
      );
      alert("Rehber başarıyla kaydedildi!");
    } catch (error) {
      console.error(
        "Kayıt sırasında hata:",
        error.response?.data || error.message
      );
      alert("Kayıt sırasında bir hata oluştu.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Rehber Kayıt</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Ad:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Şifre:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Açıklama:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Fiyat:</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Hizmet Verilen Lokasyonu Seçin:</label>
          <MapContainer
            center={markerPosition}
            zoom={6}
            style={{ height: "400px", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <MapClickHandler />
            <Marker position={markerPosition}></Marker>
          </MapContainer>
          <p>
            Seçilen Lokasyon: Enlem: {formData.location.lat || "N/A"}, Boylam:{" "}
            {formData.location.lng || "N/A"}
          </p>
        </div>
        <button type="submit">Kayıt Ol</button>
      </form>
    </div>
  );
};

export default GuideRegister;
