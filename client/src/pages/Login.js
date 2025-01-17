import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "./Login.css"; // CSS dosyasını dahil ediyoruz

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        formData
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.userId);

      login(response.data.token);
      alert("Giriş başarılı!");
    } catch (err) {
      alert(err.response?.data?.error || "Bir hata oluştu.");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1>Giriş Yap</h1>
        <div className="input-group">
          <input
            type="email"
            name="email"
            placeholder="E-posta"
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <input
            type="password"
            name="password"
            placeholder="Şifre"
            onChange={handleChange}
            required
          />
        </div>
        <button className="submit-button" type="submit">
          Giriş Yap
        </button>
      </form>
    </div>
  );
};

export default Login;
