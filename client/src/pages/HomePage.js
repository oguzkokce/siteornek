import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import "./HomePage.css"; // CSS dosyası

const HomePage = () => {
  const [featuredGuides, setFeaturedGuides] = useState([]);

  // API'den rehber verilerini çek
  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/guides");
        // Rehberlerden iki tanesini öne çıkar
        setFeaturedGuides(response.data.slice(0, 2)); // İlk iki rehberi al
      } catch (error) {
        console.error("Rehberleri çekerken hata oluştu:", error);
      }
    };

    fetchGuides();
  }, []);

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Dünyayı Keşfet</h1>
          <p>Yerel rehberler ile unutulmaz bir deneyim yaşayın.</p>
          <Link to="/guides">
            <button className="cta-button">Rehberler</button>
          </Link>
        </div>
      </section>

      {/* Öne Çıkan Rehberler */}
      <section className="featured-guides">
        <h2>Öne Çıkan Rehberler</h2>
        <div className="guide-cards">
          {featuredGuides.length > 0 ? (
            featuredGuides.map((guide) => (
              <div className="guide-card" key={guide._id}>
                <div className="guide-card-content">
                  <h3>{guide.name}</h3>
                  <p>{guide.description}</p>
                </div>
              </div>
            ))
          ) : (
            <p>Öne çıkan rehberler yükleniyor...</p>
          )}
        </div>
      </section>

      <section className="how-it-works">
        <h2>Nasıl Çalışır?</h2>
        <div className="steps">
          <div className="step">
            <div className="icon-circle">🔍</div>
            <h3>1. Arama Yap</h3>
            <p>Gitmek istediğiniz yeri seçin ve rehberlere göz atın.</p>
          </div>
          <div className="step">
            <div className="icon-circle">👤</div>
            <h3>2. Rehber Seç</h3>
            <p>Size uygun rehberi seçin ve rezervasyon yapın.</p>
          </div>
          <div className="step">
            <div className="icon-circle">🌍</div>
            <h3>3. Keşfetmeye Başla</h3>
            <p>Unutulmaz bir deneyim için rehberinizle buluşun.</p>
          </div>
        </div>
      </section>

      <section className="testimonials">
        <h2>Kullanıcı Yorumları</h2>
        <div className="testimonial-slider">
          <div className="testimonial">
            <p>
              "Ahmet Rehber ile harika bir doğa turu yaptık. Kesinlikle tavsiye
              ederim!"
            </p>
            <h4>- Fatma Y.</h4>
          </div>
          <div className="testimonial">
            <p>"Ayşe Rehber'in şehir turu, seyahatimizin en güzel kısmıydı!"</p>
            <h4>- Ali K.</h4>
          </div>
        </div>
      </section>

      {/* Alt Bilgi (Footer) */}
      <footer className="footer">
        <p>&copy; 2025 Oğuz KÖKÇE. Tüm hakları saklıdır.</p>
      </footer>
    </div>
  );
};

export default HomePage;
