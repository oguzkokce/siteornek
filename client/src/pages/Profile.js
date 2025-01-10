import React, { useState, useEffect } from "react";
import axios from "axios";

const Profile = () => {
  const [formData, setFormData] = useState({ username: "", email: "" });
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(true);

  // Kullanıcı bilgilerini yükle
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

  // Profil bilgileri güncelleme
  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token"); // Token'ı al
      const response = await axios.put(
        "http://localhost:5000/api/users/profile",
        {
          username: formData.username,
          email: formData.email,
        },
        {
          headers: { Authorization: `Bearer ${token}` }, // Token'ı header'a ekle
        }
      );

      alert("Profil güncellendi!");
      setFormData(response.data);
    } catch (error) {
      console.error("Profil güncellenirken hata oluştu:", error);
    }
  };

  // Şifre değiştirme
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token"); // Token'ı al
      await axios.put(
        "http://localhost:5000/api/users/password",
        {
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` }, // Token'ı header'a ekle
        }
      );
      alert("Şifre güncellendi!");
      setPasswordData({ oldPassword: "", newPassword: "" }); // Şifre formunu temizle
    } catch (error) {
      console.error(
        "Şifre güncellenirken hata oluştu:",
        error.response?.data || error.message
      );
    }
  };

  // Input değişikliklerini takip et
  const handleProfileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordInputChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  if (loading) return <p>Yükleniyor...</p>;

  return (
    <div>
      <h1>Profilim</h1>

      {/* Profil Güncelleme Formu */}
      <form onSubmit={handleProfileSubmit}>
        <h2>Profil Bilgileri</h2>
        <input
          type="text"
          name="username"
          value={formData.username}
          placeholder="Kullanıcı Adı"
          onChange={handleProfileChange}
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          placeholder="E-posta"
          onChange={handleProfileChange}
        />
        <button type="submit">Güncelle</button>
      </form>

      {/* Şifre Değiştirme Formu */}
      <form onSubmit={handlePasswordChange}>
        <h2>Şifre Değiştir</h2>
        <input
          type="password"
          name="oldPassword"
          value={passwordData.oldPassword}
          placeholder="Eski Şifre"
          onChange={handlePasswordInputChange}
        />
        <input
          type="password"
          name="newPassword"
          value={passwordData.newPassword}
          placeholder="Yeni Şifre"
          onChange={handlePasswordInputChange}
        />
        <button type="submit">Değiştir</button>
      </form>
    </div>
  );
};

export default Profile;
