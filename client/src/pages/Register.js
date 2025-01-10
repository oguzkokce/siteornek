import React, { useState } from "react";
import axios from "axios";

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
      alert(err.response.data.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="username"
        placeholder="Kullanıcı Adı"
        onChange={handleChange}
      />
      <input name="email" placeholder="E-posta" onChange={handleChange} />
      <input
        name="password"
        type="password"
        placeholder="Şifre"
        onChange={handleChange}
      />
      <button type="submit">Kayıt Ol</button>
    </form>
  );
};

export default Register;
