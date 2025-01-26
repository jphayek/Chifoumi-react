import React from "react";
import "./App.css";

function App() {
  return (
    <div className="app">
      <h1>Chi Fou Mi</h1>
      <div className="choices">
        <button>🪨 Pierre</button>
        <button>📄 Papier</button>
        <button>✂️ Ciseaux</button>
      </div>
      <div className="result">
        <h2>Résultat : </h2>
        <p>Vous : Pierre | Ordinateur : Ciseaux</p>
      </div>
    </div>
  );
}

export default App;
