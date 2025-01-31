import React, { useState, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import "./App.css";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Lobby from "./pages/Lobby";
import AuthContext from "./context/AuthContext";

function App() {
  const { user, logout } = useContext(AuthContext);
  const [result, setResult] = useState("");
  const [scores, setScores] = useState({ user: 0, computer: 0, ties: 0 });

  const playGame = (userChoice) => {
    const choices = ["Pierre", "Papier", "Ciseaux"];
    const computerChoice = choices[Math.floor(Math.random() * choices.length)];
    let outcome = "";

    if (userChoice === computerChoice) {
      outcome = "Égalité !";
      setScores((prevScores) => ({ ...prevScores, ties: prevScores.ties + 1 }));
    } else if (
      (userChoice === "Pierre" && computerChoice === "Ciseaux") ||
      (userChoice === "Papier" && computerChoice === "Pierre") ||
      (userChoice === "Ciseaux" && computerChoice === "Papier")
    ) {
      outcome = "Vous gagnez !";
      setScores((prevScores) => ({ ...prevScores, user: prevScores.user + 1 }));
    } else {
      outcome = "Vous perdez !";
      setScores((prevScores) => ({ ...prevScores, computer: prevScores.computer + 1 }));
    }

    setResult(`Vous : ${userChoice} | Ordinateur : ${computerChoice} -> ${outcome}`);
  };

  const resetScores = () => {
    setScores({ user: 0, computer: 0, ties: 0 });
    setResult("");
  };

  return (
    <Router>
      <nav>
        <Link to="/">Accueil</Link>
        {!user ? (
          <>
            <Link to="/login">Connexion</Link>
            <Link to="/register">Inscription</Link>
          </>
        ) : (
          <>
            <Link to="/lobby">Lobby</Link>
            <button onClick={logout}>Déconnexion</button>
          </>
        )}
      </nav>

      <Routes>
        {/* Page d'accueil : Jeu contre l'ordinateur */}
        <Route
          path="/"
          element={
            <div className="app">
              <header className="header">
                <h1>🎮 Jeu Chi Fou Mi 🎮</h1>
              </header>
              <main className="main">
                <div className="choices">
                  <button className="choice-btn" onClick={() => playGame("Pierre")}>
                    🪨 Pierre
                  </button>
                  <button className="choice-btn" onClick={() => playGame("Papier")}>
                    📄 Papier
                  </button>
                  <button className="choice-btn" onClick={() => playGame("Ciseaux")}>
                    ✂️ Ciseaux
                  </button>
                </div>
                <div className="result">
                  <h2>Résultat :</h2>
                  <p>{result || "Choisissez une option pour commencer !"}</p>
                </div>
                <div className="scores">
                  <h2>Tableau des Scores :</h2>
                  <p className="user">👤 Joueur : {scores.user}</p>
                  <p className="computer">💻 Ordinateur : {scores.computer}</p>
                  <p className="ties">⚖️ Égalités : {scores.ties}</p>
                  <button className="reset-btn" onClick={resetScores}>
                    🔄 Réinitialiser les Scores
                  </button>
                </div>
              </main>
              <footer className="footer">
                <p>💡 Que le meilleur gagne ! 💡</p>
              </footer>
            </div>
          }
        />

        {/* Pages Authentification */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Page du Lobby (Liste des parties en ligne) */}
        <Route path="/lobby" element={user ? <Lobby /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
