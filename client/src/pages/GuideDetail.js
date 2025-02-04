import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Search from "./Search";

const GuideDetail = () => {
  const { id } = useParams();
  const [guide, setGuide] = useState(null); // Rehber detayları
  const [guides, setGuides] = useState([]); // Arama sonuçları
  const [reservationDate, setReservationDate] = useState(""); // Rezervasyon tarihi
  const [message, setMessage] = useState(""); // Rezervasyon mesajı

  // Rehber detaylarını getirme
  useEffect(() => {
    const fetchGuide = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/guides/${id}`
        );
        setGuide(response.data);
      } catch (error) {
        console.error("Rehber detayını çekerken hata oluştu:", error);
      }
    };

    fetchGuide();
  }, [id]);

  // Rezervasyon yapma fonksiyonu
  const handleReservation = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/reservations",
        {
          guideId: id,
          date: reservationDate,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setMessage("Rezervasyon başarıyla oluşturuldu!");
      setReservationDate("");
    } catch (error) {
      console.error("Rezervasyon yaparken hata oluştu:", error);
      setMessage("Rezervasyon yapılamadı. Lütfen tekrar deneyin.");
    }
  };

  // Arama sonuçlarını güncelleme
  const handleSearchResults = (results) => {
    setGuides(results);
  };

  // Rehber detayları yüklenirken
  if (!guide) {
    return <p>Yükleniyor...</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>{guide.name}</h1>
      <p>{guide.description}</p>
      <p>Fiyat: {guide.price} TL</p>

      {/* Arama Bileşeni */}
      <Search onSearchResults={handleSearchResults} />

      {/* Arama Sonuçları */}
      <div style={{ marginTop: "20px" }}>
        {guides.length > 0 ? (
          guides.map((guide) => (
            <div key={guide.id}>
              <h2>{guide.name}</h2>
              <p>{guide.location}</p>
            </div>
          ))
        ) : (
          <p>Arama sonuçları burada görünecek.</p>
        )}
      </div>

      {/* Rezervasyon Formu */}
      <form onSubmit={handleReservation} style={{ marginTop: "20px" }}>
        <div>
          <label>
            Tarih ve Saat:
            <input
              type="datetime-local"
              value={reservationDate}
              onChange={(e) => setReservationDate(e.target.value)}
              required
            />
          </label>
        </div>
        <button type="submit">Rezervasyon Yap</button>
      </form>

      {/* Mesaj */}
      {message && (
        <p style={{ marginTop: "10px", color: "green" }}>{message}</p>
      )}
    </div>
  );
};

export default GuideDetail;
