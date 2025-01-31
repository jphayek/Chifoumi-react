import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Register from "./components/Auth/Register";
import Login from "./components/Auth/Login";
import MatchesList from './components/Matches/MatchesList';

function App() {
  const [result, setResult] = useState("");
  const [scores, setScores] = useState({ user: 0, computer: 0, ties: 0 });
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token") // Vérification si un utilisateur est connecté ou pas
  );

  const playGame = (userChoice) => {
    const choices = ["Pierre", "Papier", "Ciseaux"];
    const computerChoice = choices[Math.floor(Math.random() * choices.length)];
    let outcome = "";

    if (userChoice === computerChoice) {
      outcome = "Égalité !";
      setScores((prevScores) => {
        const newScores = { ...prevScores, ties: prevScores.ties + 1 };
        triggerHighlight("ties");
        return newScores;
      });
    } else if (
      (userChoice === "Pierre" && computerChoice === "Ciseaux") ||
      (userChoice === "Papier" && computerChoice === "Pierre") ||
      (userChoice === "Ciseaux" && computerChoice === "Papier")
    ) {
      outcome = "Vous gagnez !";
      setScores((prevScores) => {
        const newScores = { ...prevScores, user: prevScores.user + 1 };
        triggerHighlight("user");
        return newScores;
      });
    } else {
      outcome = "Vous perdez !";
      setScores((prevScores) => {
        const newScores = { ...prevScores, computer: prevScores.computer + 1 };
        triggerHighlight("computer");
        return newScores;
      });
    }

    const triggerHighlight = (key) => {
      const scoreElement = document.querySelector(`.scores p.${key}`);
      if (scoreElement) {
        scoreElement.classList.add("animated");
        setTimeout(() => {
          scoreElement.classList.remove("animated");
        }, 500);
      }
    };

    setResult(`Vous : ${userChoice} | Ordinateur : ${computerChoice} -> ${outcome}`);
  };

  const resetScores = () => {
    setScores({ user: 0, computer: 0, ties: 0 });
    setResult("");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <Routes>
        {/* Redirection vers Login si non connecté */}
        <Route
          path="/"
          element={isLoggedIn ? <Navigate to="/game" /> : <Navigate to="/login" />}
        />
        <Route path="/matches" element={<MatchesList />} />
        <Route
          path="/game"
          element={
            isLoggedIn ? (
              <div className="app">
                <header className="header">
                  <h1>🎮 Jeu Chi Fou Mi 🎮</h1>
                  <button className="logout-btn" onClick={handleLogout}>
                    🚪 Déconnexion
                  </button>
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
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/register" element={<Register />} />
        <Route
          path="/login"
          element={
            <Login
              onLogin={() => {
                setIsLoggedIn(true);
              }}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
