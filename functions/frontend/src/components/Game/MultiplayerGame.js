import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import useAuth from "../../hooks/useAuth";

const socket = io("http://localhost:3002");

function MultiplayerGame() {
  const { matchId } = useParams();
  const { user } = useAuth();

  const [match, setMatch] = useState(null); // 🔥 Stocker le match
  const [turns, setTurns] = useState([]);
  const [winner, setWinner] = useState(null);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [opponentMove, setOpponentMove] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);

  console.log("👤 Utilisateur actuel :", user);

  
  useEffect(() => {
    if (!matchId) {
      console.error("⚠️ Erreur : matchId est NULL !");
      return;
    }

    console.log("🔍 Récupération du match en cours...");
    fetch(`http://localhost:3002/matches/${matchId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("🎯 Match récupéré :", data);
        setMatch(data);
      })
      .catch((err) => console.error("❌ Erreur lors de la récupération du match :", err));
  }, [matchId]);

  useEffect(() => {
    if (!matchId) return;

    console.log("🔗 Connexion WebSocket avec matchId :", matchId);
    socket.emit("joinMatch", matchId);

    socket.on("playerJoined", () => {
      console.log("👤 Joueur connecté :", user.username);
    });

    socket.on("gameStart", () => {
      console.log("🎉 La partie commence !");
      setGameStarted(true);
      setIsMyTurn(true);
    });

    socket.on("waitingForPlayer", () => {
      console.log("🕒 En attente d'un autre joueur...");
      setGameStarted(false);
    });

    socket.on("turnPlayed", (turnData) => {
      console.log("🔄 Tour joué :", turnData);
      setTurns((prevTurns) => [...prevTurns, turnData]);

      if (turnData.username === user.username) {
        setIsMyTurn(false);
      } else {
        setIsMyTurn(true);
        setOpponentMove(turnData.choice);
      }
    });

    socket.on("gameOver", ({ matchId, winner }) => {
      console.log("🏆 Partie terminée ! Gagnant :", winner);
      setWinner(winner);
    });

    return () => {
      socket.off("playerJoined");
      socket.off("gameStart");
      socket.off("waitingForPlayer");
      socket.off("turnPlayed");
      socket.off("gameOver");
    };
  }, [matchId, user.username]);

  const playTurn = (choice) => {
    if (!isMyTurn) {
      alert("⚠️ Ce n'est pas votre tour !");
      return;
    }

    console.log(`🎮 ${user.username} joue : ${choice}`);
    socket.emit("playTurn", matchId, { username: user.username, choice });
    setIsMyTurn(false);
  };

  return (
    <div>
      <h1>Partie en cours : {matchId}</h1>

      {!match ? (
        <h2>🔍 Chargement du match...</h2> // 🔥 Afficher "Chargement" si le match n'est pas prêt
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
