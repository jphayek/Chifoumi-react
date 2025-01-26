import React, { useState } from "react";
import "./App.css";

function App() {
  const [result, setResult] = useState("");

  const playGame = (userChoice) => {
    const choices = ["Pierre", "Papier", "Ciseaux"];
    const computerChoice = choices[Math.floor(Math.random() * choices.length)];
    let outcome = "";

    if (userChoice === computerChoice) {
      outcome = "Égalité !";
    } else if (
      (userChoice === "Pierre" && computerChoice === "Ciseaux") ||
      (userChoice === "Papier" && computerChoice === "Pierre") ||
      (userChoice === "Ciseaux" && computerChoice === "Papier")
    ) {
      outcome = "Vous gagnez !";
    } else {
      outcome = "Vous perdez !";
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
      </main>
      <footer className="footer">
        <p>💡 Que le meilleur gagne ! 💡</p>
      </footer>
    </div>
  );
}

export default App;
