import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Profile.css"; // CSS dosyasını dahil ediyoruz

const Profile = () => {
  const [formData, setFormData] = useState({ username: "", email: "" });
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setFormData(response.data);
      } catch (error) {
        console.error("Kullanıcı bilgileri alınamadı:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "http://localhost:5000/api/users/profile",
        { username: formData.username, email: formData.email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Profil güncellendi!");
      setFormData(response.data);
    } catch (error) {
      console.error("Profil güncellenirken hata oluştu:", error);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:5000/api/users/password",
        {
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Şifre güncellendi!");
      setPasswordData({ oldPassword: "", newPassword: "" });
    } catch (error) {
      console.error(
        "Şifre güncellenirken hata oluştu:",
        error.response?.data || error.message
      );
    }
  };

  const handleProfileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordInputChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  if (loading) return <p>Yükleniyor...</p>;

  return (
    <div className="profile-container">
      <h1>Profilim</h1>
      <div className="form-container">
        {/* Profil Güncelleme Formu */}
        <form className="profile-form" onSubmit={handleProfileSubmit}>
          <h2>Profil Bilgileri</h2>
          <div className="input-group">
            <input
              type="text"
              name="username"
              value={formData.username}
              placeholder="Kullanıcı Adı"
              onChange={handleProfileChange}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              placeholder="E-posta"
              onChange={handleProfileChange}
              required
            />
          </div>
          <button className="submit-button" type="submit">
            Güncelle
          </button>
        </form>

        {/* Şifre Değiştirme Formu */}
        <form className="password-form" onSubmit={handlePasswordChange}>
          <h2>Şifre Değiştir</h2>
          <div className="input-group">
            <input
              type="password"
              name="oldPassword"
              value={passwordData.oldPassword}
              placeholder="Eski Şifre"
              onChange={handlePasswordInputChange}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              placeholder="Yeni Şifre"
              onChange={handlePasswordInputChange}
              required
            />
          </div>
          <button className="submit-button" type="submit">
            Değiştir
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
