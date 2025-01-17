import React, { useState } from "react";
import axios from "axios";
import "./Register.css"; // CSS dosyasını dahil ediyoruz

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/register",
        formData
      );
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.error || "Kayıt sırasında bir hata oluştu.");
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h1>Kayıt Ol</h1>
        <div className="input-group">
          <input
            name="username"
            placeholder="Kullanıcı Adı"
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <input
            name="email"
            placeholder="E-posta"
            type="email"
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <input
            name="password"
            type="password"
            placeholder="Şifre"
            onChange={handleChange}
            required
          />
        </div>
        <button className="submit-button" type="submit">
          Kayıt Ol
        </button>
      </form>
    </div>
  );
};

export default Register;
