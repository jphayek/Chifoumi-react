import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import "../../styles/Form.css";

const Register = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = formData;
  
    try {
      const response = await fetch("http://localhost:3002/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
      console.log("Réponse complète du serveur :", data); // VÉRIFIER LE TOKEN
  
      if (response.ok) {
        if (!data.token) {
          console.error("🚨 Erreur : le token n'est pas présent !");
          return;
        }
  
        login(data.token);
        alert("Inscription réussie !");
        navigate("/matches");
      } else {
        setError(data.message || "Nom d'utilisateur déjà pris !");
      }
    } catch (error) {
      console.error("Erreur lors de la requête :", error);
      setError("Erreur réseau, veuillez réessayer.");
    }
  };
  
  

  return (
    <div className="form-container">
      <h2>Créer un compte</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Nom d'utilisateur</label>
          <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} placeholder="Entrez votre nom" />
        </div>
        <div className="form-group">
          <label htmlFor="password">Mot de passe</label>
          <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} placeholder="Entrez un mot de passe" />
        </div>
        <button type="submit" className="form-btn">S'inscrire</button>
      </form>
      <p>Déjà un compte ? <a href="/login">Se connecter</a></p>
    </div>
  );
};

export default Register;
