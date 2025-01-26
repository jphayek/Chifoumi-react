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
      setScores((prevScores) => ({
        ...prevScores,
        computer: prevScores.computer + 1,
      }));
    }

    setResult(`Vous : ${userChoice} | Ordinateur : ${computerChoice} -> ${outcome}`);
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

        
        <br></br>
        <button className="reset-btn" onClick={() => setScores({ user: 0, computer: 0, ties: 0 })}>
          🔄 Réinitialiser les Scores
        </button>
        
        <div className="scores">
          <h2>Tableau des Scores :</h2>
          <p>👤 Joueur : {scores.user}</p>
          <p>💻 Ordinateur : {scores.computer}</p>
          <p>⚖️ Égalités : {scores.ties}</p>
        </div>
        
      </main>
      <footer className="footer">
        <p>💡 Que le meilleur gagne ! 💡</p>
      </footer>
    </div>
  );
}

export default App;
