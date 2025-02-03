import { useState, useEffect } from "react";
import AuthContext from "./AuthContext";
import { jwtDecode } from "jwt-decode";

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("Utilisateur décodé :", decoded);
        setUser(decoded);
        localStorage.setItem("user", JSON.stringify(decoded)); 
      } catch (error) {
        console.error("Erreur lors du décodage du token :", error);
        setUser(null);
        localStorage.removeItem("user");
      }
    } else {
      setUser(null);
      localStorage.removeItem("user");
    }
  }, [token]);

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    const decoded = jwtDecode(newToken);
    setUser(decoded);
    localStorage.setItem("user", JSON.stringify(decoded)); 
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user"); 
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };