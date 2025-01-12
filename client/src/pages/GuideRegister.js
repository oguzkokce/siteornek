import React, { useState } from "react";
import axios from "axios";

const GuideRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/guides/register",
        formData
      );
      setMessage("Rehber başarıyla kayıt oldu!");
      setFormData({ name: "", email: "", password: "" });
    } catch (error) {
      setMessage("Hata oluştu, tekrar deneyin.");
    }
  };

  return (
    <div>
      <h2>Rehber Kayıt</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Ad"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="E-posta"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Şifre"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          required
        />
        <button type="submit">Kayıt Ol</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default GuideRegister;
