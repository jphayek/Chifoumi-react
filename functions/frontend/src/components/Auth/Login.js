import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import "./Form.css";

const Login = () => {
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
      const response = await fetch("http://localhost:3002/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        login(data.token);
        alert("Connexion réussie !");
        navigate("/matches");
      } else {
        setError("Nom d'utilisateur ou mot de passe incorrect !");
      }
    } catch (error) {
      setError("Erreur réseau, veuillez réessayer.");
    }
  };

  return (
    <div className="form-container">
      <h2>Se connecter</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Nom d'utilisateur</label>
          <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} placeholder="Entrez votre nom" />
        </div>
        <div className="form-group">
          <label htmlFor="password">Mot de passe</label>
          <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} placeholder="Entrez votre mot de passe" />
        </div>
        <button type="submit" className="form-btn">Se connecter</button>
      </form>
      <p>Pas encore de compte ? <a href="/register">S'inscrire</a></p>
    </div>
  );
};

export default Login;
