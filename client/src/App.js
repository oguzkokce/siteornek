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
import HomePage from "./pages/HomePage";
import AuthProvider, { AuthContext } from "./context/AuthContext";
import Profile from "./pages/Profile";
import PrivateRoute from "./components/PrivateRoute";
import GuideList from "./pages/GuideList";
import GuideDetail from "./pages/GuideDetail";
import MyReservations from "./pages/MyReservations";
import GuideRegister from "./pages/GuideRegister";
import GuideLogin from "./pages/GuideLogin";
import GuideDashboard from "./pages/GuideDashboard";
import "./App.css";

const Navbar = () => {
  const { isAuthenticated, role, logout } = useContext(AuthContext); // role eklendi
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Çıkış işlemi
    navigate("/"); // Çıkış yaptıktan sonra anasayfaya yönlendir
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          ShowAround
        </Link>
        <ul className="navbar-menu">
          {/* Herkese görünür linkler */}
          <li>
            <Link to="/">Ana Sayfa</Link>
          </li>
          <li>
            <Link to="/guides">Rehberler</Link>
          </li>

          {/* Kullanıcı giriş yaptıysa */}
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

          {/* Rehber giriş yaptıysa */}
          {isAuthenticated && role === "guide" && (
            <>
              <li>
                <Link to="/guide-dashboard">Rehber Paneli</Link>
              </li>
            </>
          )}

          {/* Giriş yapıldıysa çıkış butonu */}
          {isAuthenticated ? (
            <li>
              <button onClick={handleLogout} className="navbar-logout">
                Çıkış Yap
              </button>
            </li>
          ) : (
            <>
              {/* Giriş yapılmadıysa giriş ve kayıt linkleri */}
              <li>
                <Link to="/login">Giriş Yap</Link>
              </li>
              <li>
                <Link to="/register">Kayıt Ol</Link>
              </li>
              <li>
                <Link to="/guide-login">Rehber Girişi</Link>
              </li>
              <li>
                <Link to="/guide-register">Rehber Kayıt</Link>
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
          {/* Kullanıcı Rotaları */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<HomePage />} />
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

          {/* Rehber Rotaları */}
          <Route path="/guide-register" element={<GuideRegister />} />
          <Route path="/guide-login" element={<GuideLogin />} />
          <Route
            path="/guide-dashboard"
            element={<PrivateRoute element={<GuideDashboard />} />}
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
