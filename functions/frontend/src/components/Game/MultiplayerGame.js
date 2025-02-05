import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import useAuth from "../../hooks/useAuth";
import "../../styles/MultiPlayerGame.css";

const socket = io("http://localhost:3002");

function MultiplayerGame() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [match, setMatch] = useState(null);
  const [turns, setTurns] = useState([]);
  const [winner, setWinner] = useState(null);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [opponentMove, setOpponentMove] = useState(null);

  useEffect(() => {
    if (!matchId) {
      console.error("⚠️ Erreur : matchId est NULL !");
      return;
    }

    fetch(`http://localhost:3002/matches/${matchId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setMatch(data))
      .catch((err) =>
        console.error("❌ Erreur lors de la récupération du match :", err)
      );
  }, [matchId]);

  useEffect(() => {
    if (!matchId) return;

    socket.emit("joinMatch", matchId);

    socket.on("playerJoined", () => console.log("👤 Joueur connecté :", user.username));
    socket.on("gameStart", () => {
      setIsMyTurn(true);
    });
    socket.on("waitingForPlayer", () => setIsMyTurn(false));
    socket.on("turnPlayed", (turnData) => {
      setTurns((prevTurns) => [...prevTurns, turnData]);
      if (turnData.username !== user.username) {
        setIsMyTurn(true);
        setOpponentMove(turnData.choice);
      }
    });
    socket.on("gameOver", ({ winner }) => setWinner(winner));

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
    socket.emit("playTurn", matchId, { username: user.username, choice });
    setIsMyTurn(false);
  };

  const handleBackToLobby = () => {
    console.log("🚀 Redirection vers /matches");
    navigate("/matches");
  };

  return (
    <div className="multiplayer-game">
      <h1 className="game-title">
        🎮 Partie en cours : <span className="match-id">{matchId}</span>
      </h1>

      {!match ? (
        <h2 className="loading">🔍 Chargement du match...</h2>
      ) : winner ? (
        <div className="winner-section">
          <h2 className="winner">🏆 Le gagnant est : {winner}</h2>
        </div>
      ) : (
        <>
          <h2 className={`turn-status ${isMyTurn ? "your-turn" : "waiting"}`}>
            {isMyTurn ? "🟢 C'est votre tour !" : "🔴 Tour de votre adversaire..."}
          </h2>

          <div className="choices">
            <button
              className={`choice-btn ${!isMyTurn && "disabled"}`}
              onClick={() => playTurn("rock")}
              disabled={!isMyTurn}
            >
              🪨 Pierre
            </button>
            <button
              className={`choice-btn ${!isMyTurn && "disabled"}`}
              onClick={() => playTurn("paper")}
              disabled={!isMyTurn}
            >
              📄 Papier
            </button>
            <button
              className={`choice-btn ${!isMyTurn && "disabled"}`}
              onClick={() => playTurn("scissors")}
              disabled={!isMyTurn}
            >
              ✂️ Ciseaux
            </button>
          </div>

          <div className="game-info">
            <h2>Tours joués :</h2>
            {turns.length === 0 ? ( // Vérification si aucun tour n'a été joué
              <p className="no-turns-message">⚠️ Vous n'avez pas encore commencé à jouer !</p>
            ) : (
              <ul>
                {turns.map((turn, index) => (
                  <li key={index}>
                    {turn.choice === "rock" && "🪨 "}
                    {turn.choice === "paper" && "📄 "}
                    {turn.choice === "scissors" && "✂️ "}
                    {turn.username} a choisi {turn.choice}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="opponent-move">
            {opponentMove && (
              <p>
                <span className="opponent-icon">🔍</span> Humm qui va gagner !
              </p>
            )}
          </div>
        </>
      )}

      <button className="back-to-lobby" onClick={handleBackToLobby}>
        Retour au lobby
      </button>
    </div>
  );
}

export default MultiplayerGame;
