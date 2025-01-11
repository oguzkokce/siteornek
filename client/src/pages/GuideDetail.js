import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const GuideDetail = () => {
  const { id } = useParams();
  const [guide, setGuide] = useState(null);
  const [reservationDate, setReservationDate] = useState("");
  const [message, setMessage] = useState("");

  // Rehber verisini getirme
  React.useEffect(() => {
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
      // Rezervasyon API isteği
      const response = await axios.post(
        "http://localhost:5000/api/reservations",
        {
          guideId: id,
          date: reservationDate, // Tarih burada tam formatta gönderiliyor
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Kullanıcı token'ını ekle
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

  if (!guide) {
    return <p>Yükleniyor...</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>{guide.name}</h1>
      <p>{guide.description}</p>
      <p>Fiyat: {guide.price} TL</p>

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
      {message && <p>{message}</p>}
    </div>
  );
};

export default GuideDetail;
