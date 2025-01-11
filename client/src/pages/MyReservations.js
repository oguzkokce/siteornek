import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const MyReservations = () => {
  const { user } = useContext(AuthContext); // Kullanıcı bilgisi
  const [reservations, setReservations] = useState([]); // Rezervasyonlar
  const [error, setError] = useState(""); // Hata mesajı

  // API'den rezervasyonları getir
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const token = localStorage.getItem("token"); // Token'i al
        const response = await axios.get(
          "http://localhost:5000/api/reservations/my-reservations",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Token'i header'a ekle
            },
          }
        );
        setReservations(response.data); // Gelen veriyi kaydet
      } catch (err) {
        console.error("Rezervasyonları çekerken hata oluştu:", err);
        setError("Rezervasyonlar yüklenirken bir hata oluştu."); // Hata mesajı
      }
    };

    fetchReservations(); // Fonksiyonu çağır
  }, []);

  // Eğer hata varsa hata mesajını göster
  if (error) {
    return <p>{error}</p>;
  }

  // Eğer rezervasyon yoksa bilgi mesajı göster
  if (!reservations.length) {
    return <p>Henüz bir rezervasyon yapılmamış.</p>;
  }

  // Rezervasyonları listele
  return (
    <div style={{ padding: "20px" }}>
      <h1>Rezervasyonlarım</h1>
      <ul>
        {reservations.map((reservation, index) => (
          <li key={index}>
            <p>
              <strong>Rehber:</strong>{" "}
              {reservation.guide?.name || "Rehber bilgisi mevcut değil"}
            </p>
            <p>
              <strong>Tarih:</strong>{" "}
              {new Date(reservation.date).toLocaleString()}
            </p>
            <p>
              <strong>Durum:</strong> {reservation.status || "Belirtilmemiş"}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyReservations;
