import React, { useEffect, useState } from "react";
import axios from "axios";

const GuideDashboard = () => {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/api/guides/reservations",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setReservations(response.data);
      } catch (error) {
        console.error("Rezervasyonlar alınamadı:", error);
      }
    };

    fetchReservations();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/guides/reservations/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReservations((prev) =>
        prev.map((res) => (res._id === id ? { ...res, status } : res))
      );
    } catch (error) {
      console.error("Durum güncellenemedi:", error);
    }
  };

  return (
    <div>
      <h2>Rezervasyonlarım</h2>
      {reservations.map((res) => (
        <div key={res._id}>
          <p>{res.user.email}</p>
          <p>{res.status}</p>
          <button onClick={() => handleStatusChange(res._id, "approved")}>
            Onayla
          </button>
          <button onClick={() => handleStatusChange(res._id, "rejected")}>
            Reddet
          </button>
        </div>
      ))}
    </div>
  );
};

export default GuideDashboard;
