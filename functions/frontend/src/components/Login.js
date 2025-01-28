import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Form.css";

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { username, password } = formData;
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser || username !== storedUser.username || password !== storedUser.password) {
      setError("Nom d'utilisateur ou mot de passe incorrect !");
      return;
    }

    
    localStorage.setItem("token", "loggedin");
    alert("Connexion réussie !");
    onLogin();
    navigate("/game");
  };

  return (
    <div className="form-container">
      <h2>Se connecter</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Nom d'utilisateur</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Entrez votre nom"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Mot de passe</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Entrez votre mot de passe"
          />
        </div>
        <button type="submit" className="form-btn">
          Se connecter
        </button>
      </form>
      <p>
        Pas encore de compte ? <a href="/register">S'inscrire</a>
      </p>
    </div>
  );
};

export default Login;
