import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import useAuth from "../../hooks/useAuth";

const socket = io("http://localhost:3001");

function MultiplayerGame() {
  const { matchId } = useParams();
  const { user } = useAuth();
  const [turns, setTurns] = useState([]);
  const [winner, setWinner] = useState(null);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [opponentMove, setOpponentMove] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);

  const calculateWinner = (myChoice, opponentChoice) => {
    let winner = null;
    if (myChoice === opponentChoice) {
      winner = "Égalité";
    } else if (
      (myChoice === "rock" && opponentChoice === "scissors") ||
      (myChoice === "scissors" && opponentChoice === "paper") ||
      (myChoice === "paper" && opponentChoice === "rock")
    ) {
      winner = user.username;
    } else {
      winner = opponentChoice.username; // L'adversaire gagne
    }
    setWinner(winner);
  };

  useEffect(() => {
    if (!matchId) {
      console.error("Erreur : matchId est NULL !");
      return;
    }

    socket.emit("joinMatch", matchId);

    socket.on("gameStart", () => {
      setGameStarted(true);
      setIsMyTurn(true);
    });

    socket.on("waitingForPlayer", () => {
      setGameStarted(false);
    });

    socket.on("turnPlayed", (turnData) => {
      setTurns((prevTurns) => [...prevTurns, turnData]);

      if (turnData.username === user.username) {
        setIsMyTurn(false);
      } else {
        setIsMyTurn(true);
        setOpponentMove(turnData.choice);
      }

      // Vérifier si les deux joueurs ont joué
      if (turns.length >= 1) {
        const opponentTurn = turns.find(turn => turn.username !== user.username);
        if (opponentTurn) {
          calculateWinner(turnData.choice, opponentTurn.choice);
        }
      }
    });

    return () => {
      socket.off("gameStart");
      socket.off("waitingForPlayer");
      socket.off("turnPlayed");
    };
  }, [matchId, user.username, turns]);

  const playTurn = (choice) => {
    if (!isMyTurn) {
      alert("⚠️ Ce n'est pas votre tour !");
      return;
    }

    socket.emit("playTurn", matchId, { username: user.username, choice });
    setIsMyTurn(false);
  };

  return (
    <div>
      <h1>Partie en cours : {matchId}</h1>

      {!gameStarted ? (
        <h2>🕒 Attente d'un autre joueur...</h2>
      ) : winner ? (
        <h2>🏆 Le gagnant est : {winner}</h2>
      ) : (
        <>
          <h2>{isMyTurn ? "🟢 C'est votre tour !" : "🔴 Attendez votre adversaire..."}</h2>
          <div>
            <button onClick={() => playTurn("rock")} disabled={!isMyTurn}>🪨 Pierre</button>
            <button onClick={() => playTurn("paper")} disabled={!isMyTurn}>📄 Papier</button>
            <button onClick={() => playTurn("scissors")} disabled={!isMyTurn}>✂️ Ciseaux</button>
          </div>

          <div>
            <h2>Tours joués :</h2>
            {turns.map((turn, index) => (
              <p key={index}>{turn.username} a choisi {turn.choice}</p>
            ))}
          </div>

          <div>
            {opponentMove && <p>🆚 Votre adversaire a joué : {opponentMove}</p>}
          </div>
        </>
      )}
    </div>
  );
}

export default MultiplayerGame;
