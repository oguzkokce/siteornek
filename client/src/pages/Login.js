import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Backend'e giriş isteği gönder
      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        formData
      );

      // Backend'den gelen token ve userId'yi localStorage'a kaydet
      localStorage.setItem("token", response.data.token); // Token kaydet
      localStorage.setItem("userId", response.data.userId); // Kullanıcı ID'sini kaydet

      // Kullanıcıyı giriş yapmış olarak ayarla (AuthContext üzerinden)
      login(response.data.token);

      alert("Giriş başarılı!");
    } catch (err) {
      alert(err.response?.data?.error || "Bir hata oluştu.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Giriş Yap</h1>
      <input
        type="email"
        name="email"
        placeholder="E-posta"
        onChange={handleChange}
      />
      <input
        type="password"
        name="password"
        placeholder="Şifre"
        onChange={handleChange}
      />
      <button type="submit">Giriş Yap</button>
    </form>
  );
};

export default Login;
