import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // AuthContext'i içeri aktar
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const { role, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  console.log("Auth Durumu:", { isAuthenticated, role }); // Kontrol için ekledik

  return (
    <nav style={{ padding: "10px", backgroundColor: "#f4f4f4" }}>
      <ul style={{ display: "flex", listStyleType: "none" }}>
        <li style={{ marginRight: "20px" }}>
          <Link to="/">Anasayfa</Link>
        </li>
        <li style={{ marginRight: "20px" }}>
          <Link to="/guides">Rehberler</Link>
        </li>
        {isAuthenticated && role === "user" && (
          <>
            <li style={{ marginRight: "20px" }}>
              <Link to="/profile">Profil</Link>
            </li>
            <li style={{ marginRight: "20px" }}>
              <Link to="/my-reservations">Rezervasyonlarım</Link>
            </li>
          </>
        )}
        {isAuthenticated && role === "guide" && (
          <>
            <li style={{ marginRight: "20px" }}>
              <Link to="/guide-dashboard">Rehber Paneli</Link>
            </li>
          </>
        )}
        {isAuthenticated ? (
          <li>
            <button onClick={handleLogout} style={{ cursor: "pointer" }}>
              Çıkış Yap
            </button>
          </li>
        ) : (
          <>
            <li style={{ marginRight: "20px" }}>
              <Link to="/login">Giriş Yap</Link>
            </li>
            <li>
              <Link to="/register">Kayıt Ol</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
