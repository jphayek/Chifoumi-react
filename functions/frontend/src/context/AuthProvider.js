import { useState, useEffect } from "react";
import AuthContext from "./AuthContext";
import { jwtDecode } from "jwt-decode";

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(sessionStorage.getItem("token"));
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("Utilisateur décodé :", decoded);
        setUser(decoded);
      } catch (error) {
        console.error("Erreur lors du décodage du token :", error);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [token]);

  const login = (newToken) => {
    console.log("Token reçu dans login :", newToken);
  
    if (!newToken || typeof newToken !== "string") {
      console.error("Erreur : le token est invalide ou undefined !");
      return;
    }
  
    sessionStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(jwtDecode(newToken));
  };
  

  const logout = () => {
    sessionStorage.removeItem("token");
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
