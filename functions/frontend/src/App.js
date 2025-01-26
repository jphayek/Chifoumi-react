import React, { useState, useEffect } from "react";

function App() {
  const [result, setResult] = useState("");

  // Appel API vers le backend
  useEffect(() => {
    fetch("/api/chifoumi") // Appel API via la route backend
      .then((res) => res.json())
      .then((data) => setResult(data.message))
      .catch((err) => console.error("Erreur :", err));
  }, []);

  return (
    <div>
      <h1>Jeu de Chi Fou Mi</h1>
      <p>Résultat : {result || "Chargement..."}</p>
    </div>
  );
}

export default App;
