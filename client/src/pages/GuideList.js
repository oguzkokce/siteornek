import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Map from "../components/Map";

const GuideList = () => {
  const [guides, setGuides] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/guides");
        console.log("API'den Gelen Veri:", response.data);
        setGuides(response.data);
      } catch (error) {
        console.error("Rehberleri çekerken hata oluştu:", error);
        setError("Rehberleri yüklerken bir sorun oluştu.");
      }
    };

    fetchGuides();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Rehberler</h1>

      {/* Hata Mesajı */}
      {error && (
        <div
          style={{
            color: "red",
            textAlign: "center",
            marginBottom: "20px",
            fontWeight: "bold",
          }}
        >
          {error}
        </div>
      )}

      {/* Harita Bileşeni */}
      <div
        style={{
          height: "400px",
          width: "100%",
          marginBottom: "20px",
          zIndex: 0,
          position: "relative",
        }}
      >
        <Map guides={guides} />
      </div>

      {/* Rehber Listesi */}
      <div style={{ position: "relative", zIndex: 10, overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "20px",
          }}
        >
          <thead>
            <tr>
              <th style={tableHeaderStyle}>Adı</th>
              <th style={tableHeaderStyle}>Konum</th>
              <th style={tableHeaderStyle}>Açıklama</th>
              <th style={tableHeaderStyle}>Fiyat</th>
            </tr>
          </thead>
          <tbody>
            {guides.length > 0 ? (
              guides.map((guide) => {
                const location = guide.location?.coordinates || [];
                return (
                  <tr key={guide._id}>
                    <td style={tableCellStyle}>
                      <Link
                        to={`/guides/${guide._id}`}
                        style={{
                          textDecoration: "none",
                          color: "#007bff",
                          fontWeight: "bold",
                          cursor: "pointer",
                        }}
                      >
                        {guide.name || "Ad Bilgisi Yok"}
                      </Link>
                    </td>
                    <td style={tableCellStyle}>
                      {Array.isArray(location) && location.length === 2
                        ? `${location[1]}, ${location[0]}`
                        : "Konum bilgisi yok"}
                    </td>
                    <td style={tableCellStyle}>{guide.description}</td>
                    <td style={tableCellStyle}>{guide.price} TL</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="4"
                  style={{ textAlign: "center", padding: "10px" }}
                >
                  Yükleniyor veya rehber bulunamadı.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// CSS için inline stil
const tableHeaderStyle = {
  backgroundColor: "#f4f4f4",
  padding: "10px",
  borderBottom: "2px solid #ddd",
  textAlign: "left",
};

const tableCellStyle = {
  padding: "10px",
  borderBottom: "1px solid #ddd",
};

export default GuideList;
