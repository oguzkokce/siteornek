import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "./MyReservations.css"; // CSS dosyasını dahil ediyoruz

const MyReservations = () => {
  const { user } = useContext(AuthContext);
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/api/reservations/my-reservations",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setReservations(response.data);
      } catch (err) {
        console.error("Rezervasyonları çekerken hata oluştu:", err);
        setError("Rezervasyonlar yüklenirken bir hata oluştu.");
      }
    };

    fetchReservations();
  }, []);

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (!reservations.length) {
    return <p className="info-message">Henüz bir rezervasyon yapılmamış.</p>;
  }

  return (
    <div className="reservations-container">
      <h1>Rezervasyonlarım</h1>
      <ul className="reservations-list">
        {reservations.map((reservation, index) => (
          <li key={index} className="reservation-item">
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
