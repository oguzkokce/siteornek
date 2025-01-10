import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const GuideDetail = () => {
  const { id } = useParams();
  const [guide, setGuide] = useState(null);
  const [reservationDate, setReservationDate] = useState("");
  const [reservationTime, setReservationTime] = useState("");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");

  // Rehber verisini getirme (Önceden eklenmiş olmalı)
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
      const response = await axios.post(
        "http://localhost:5000/api/reservations",
        {
          guideId: id,
          userId: "userIdFromContextOrState", // Oturumdaki kullanıcının ID'si
          date: reservationDate,
          time: reservationTime,
          note,
        }
      );

      setMessage("Rezervasyon başarıyla oluşturuldu!");
      setReservationDate("");
      setReservationTime("");
      setNote("");
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
      <p>
        Konum:{" "}
        {guide.location?.coordinates
          ? `${guide.location.coordinates[1]}, ${guide.location.coordinates[0]}`
          : "Konum bilgisi yok"}
      </p>

      {/* Rezervasyon Formu */}
      <form onSubmit={handleReservation} style={{ marginTop: "20px" }}>
        <div>
          <label>
            Tarih:
            <input
              type="date"
              value={reservationDate}
              onChange={(e) => setReservationDate(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Saat:
            <input
              type="time"
              value={reservationTime}
              onChange={(e) => setReservationTime(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Not:
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Rehbere bir not bırakabilirsiniz."
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
