import React, { useState, useEffect } from "react";
import axios from "axios";

const MyReservations = () => {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const token = localStorage.getItem("token"); // Kullanıcı token'ını al
        const response = await axios.get(
          "http://localhost:5000/api/reservations/my-reservations",
          {
            headers: { Authorization: `Bearer ${token}` }, // Yetkilendirme başlığı
          }
        );
        setReservations(response.data);
      } catch (error) {
        console.error(
          "Rezervasyonlar alınırken hata oluştu:",
          error.response || error
        );
      }
    };

    fetchReservations();
  }, []);

  return (
    <div>
      <h1>Rezervasyonlarım</h1>
      {reservations.length > 0 ? (
        <ul>
          {reservations.map((reservation) => (
            <li key={reservation._id}>
              <strong>Rehber:</strong> {reservation.guide.name} <br />
              <strong>Tarih:</strong>{" "}
              {new Date(reservation.date).toLocaleDateString()} <br />
              <strong>Durum:</strong> {reservation.status} <br />
              <hr />
            </li>
          ))}
        </ul>
      ) : (
        <p>Henüz bir rezervasyonunuz yok.</p>
      )}
    </div>
  );
};

export default MyReservations;
