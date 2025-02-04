import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // AuthContext'i içeri aktar
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const { role, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  console.log("Auth Durumu:", { isAuthenticated, role }); // Kontrol için ekledik

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">ShowAround</Link>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/">Anasayfa</Link>
        </li>
        <li>
          <Link to="/guides">Rehberler</Link>
        </li>
        {isAuthenticated && role === "user" && (
          <>
            <li>
              <Link to="/profile">Profil</Link>
            </li>
            <li>
              <Link to="/my-reservations">Rezervasyonlarım</Link>
            </li>
          </>
        )}
        {isAuthenticated && role === "guide" && (
          <>
            <li>
              <Link to="/guide-dashboard">Rehber Paneli</Link>
            </li>
          </>
        )}
        {isAuthenticated ? (
          <li>
            <button onClick={handleLogout} className="logout-button">
              Çıkış Yap
            </button>
          </li>
        ) : (
          <>
            <li>
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
