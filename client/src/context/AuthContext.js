import React, { createContext, useState } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Kullanıcı durumunu yönet

  const login = (token) => {
    localStorage.setItem("token", token); // Token'ı sakla
    setUser({ token }); // Kullanıcıyı güncelle
  };

  const logout = () => {
    localStorage.removeItem("token"); // Token'ı sil
    setUser(null); // Kullanıcıyı sıfırla
  };

  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
