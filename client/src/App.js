import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import AuthProvider, { AuthContext } from "./context/AuthContext";
import Profile from "./pages/Profile";
import PrivateRoute from "./components/PrivateRoute";
import GuideList from "./pages/GuideList";
import GuideDetail from "./pages/GuideDetail";
import MyReservations from "./pages/MyReservations";
import "./App.css";

const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Çıkış yapma işlemi
    navigate("/"); // Çıkış yaptıktan sonra anasayfaya yönlendir
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          ShowAround
        </Link>
        <ul className="navbar-menu">
          <li>
            <Link to="/">Ana Sayfa</Link>
          </li>
          <li>
            <Link to="/guides">Rehberler</Link>
          </li>
          {isAuthenticated ? (
            <>
              <li>
                <Link to="/profile">Profil</Link>
              </li>
              <li>
                <Link to="/my-reservations">Rezervasyonlarım</Link>
              </li>
              <li>
                <button onClick={handleLogout} className="navbar-logout">
                  Çıkış Yap
                </button>
              </li>
            </>
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
      </div>
    </nav>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route
            path="/profile"
            element={<PrivateRoute element={<Profile />} />}
          />
          <Route path="/guides" element={<GuideList />} />
          <Route path="/guides/:id" element={<GuideDetail />} />
          <Route
            path="/my-reservations"
            element={<PrivateRoute element={<MyReservations />} />}
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
