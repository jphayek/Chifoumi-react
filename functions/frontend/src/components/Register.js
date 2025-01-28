import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Form.css";

const Register = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { username, password } = formData;

    if (username.trim() === "" || password.trim() === "") {
      setError("Tous les champs sont obligatoires !");
      return;
    }

    localStorage.setItem("user", JSON.stringify({ username, password }));
    alert("Inscription réussie !");
    navigate("/login");
  };

  return (
    <div className="form-container">
      <h2>Créer un compte</h2>
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
            placeholder="Entrez un mot de passe"
          />
        </div>
        <button type="submit" className="form-btn">
          S'inscrire
        </button>
      </form>
      <p>
        Déjà un compte ? <a href="/login">Se connecter</a>
      </p>
    </div>
  );
};

export default Register;
