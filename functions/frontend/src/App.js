import React, { useState } from "react";
import "./App.css";

function App() {
  const [result, setResult] = useState("");
  const [scores, setScores] = useState({ user: 0, computer: 0, ties: 0 });

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

  return (
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
  );
}

export default App;
