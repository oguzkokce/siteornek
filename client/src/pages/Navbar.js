import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import LogoutButton from "./LogoutButton";

const Navbar = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <nav>
      <Link to="/">Ana Sayfa</Link>
      {!isAuthenticated && <Link to="/login">Giriş Yap</Link>}
      {!isAuthenticated && <Link to="/register">Kayıt Ol</Link>}
      {isAuthenticated && <LogoutButton />}
    </nav>
  );
};

export default Navbar;
