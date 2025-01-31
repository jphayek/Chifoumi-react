import React, { useState, useEffect } from "react";
import socket from "../socket";

function MultiplayerGame({ matchId, username }) {
  const [turns, setTurns] = useState([]);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    socket.emit("joinMatch", matchId, username);

    socket.on("playerJoined", (match) => {
      console.log("Joueurs dans la partie :", match);
    });

    socket.on("turnPlayed", (turnData) => {
      setTurns((prevTurns) => [...prevTurns, turnData]);
    });

    socket.on("gameOver", ({ match, winner }) => {
      setWinner(winner);
    });

    return () => {
      socket.off("playerJoined");
      socket.off("turnPlayed");
      socket.off("gameOver");
    };
  }, [matchId, username]);

  const playTurn = (choice) => {
    const turnData = { username, choice };
    socket.emit("playTurn", matchId, turnData);
  };

  if (winner) {
    return <h2>Le gagnant est : {winner.username}</h2>;
  }

  return (
    <div>
      <h1>Partie en cours : {matchId}</h1>
      <div>
        <button onClick={() => playTurn("Pierre")}>🪨 Pierre</button>
        <button onClick={() => playTurn("Papier")}>📄 Papier</button>
        <button onClick={() => playTurn("Ciseaux")}>✂️ Ciseaux</button>
      </div>
      <div>
        <h2>Tours joués :</h2>
        {turns.map((turn, index) => (
          <p key={index}>
            {turn.username} a choisi {turn.choice}
          </p>
        ))}
      </div>
    </div>
  );
}

export default MultiplayerGame;
