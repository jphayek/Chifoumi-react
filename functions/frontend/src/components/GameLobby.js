import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function GameLobby() {
  const [matchId, setMatchId] = useState("");
  const [matches, setMatches] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    
    const fetchMatches = async () => {
      try {
        const response = await fetch("http://localhost:3002/matches", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setMatches(data);
        } else {
          alert("Erreur lors de la récupération des matchs.");
        }
      } catch (error) {
        alert("Erreur réseau lors de la récupération des matchs.");
      }
    };

    fetchMatches();
  }, []);

  const createMatch = async () => {
    try {
      const response = await fetch("http://localhost:3002/matches", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const match = await response.json();
        setMatchId(match._id);
        alert(`Match créé avec succès ! ID : ${match._id}`);
        // Rediriger vers la page du match
        navigate(`/game/${match._id}`);
      } else {
        alert("Erreur lors de la création du match.");
      }
    } catch (error) {
      alert("Erreur réseau lors de la création du match.");
    }
  };

  const joinMatch = () => {
    if (matchId) {
      navigate(`/game/${matchId}`);
    } else {
      alert("Veuillez entrer un Match ID valide.");
    }
  };

  return (
    <div className="game-lobby">
      <h2>Lobby des parties</h2>

      <div className="create-match">
        <button onClick={createMatch}>Créer une nouvelle partie</button>
      </div>

      <div className="join-match">
        <h3>Rejoindre une partie existante</h3>
        <input
          type="text"
          placeholder="Entrer l'ID de la partie"
          value={matchId}
          onChange={(e) => setMatchId(e.target.value)}
        />
        <button onClick={joinMatch}>Rejoindre</button>
      </div>

      <div className="matches-list">
        <h3>Matchs en cours :</h3>
        <ul>
          {matches.length > 0 ? (
            matches.map((match) => (
              <li key={match._id}>
                <p>Match ID: {match._id}</p>
                <p>Joueur 1: {match.user1.username}</p>
                <p>
                  {match.user2
                    ? `Joueur 2: ${match.user2.username}`
                    : "En attente d'un joueur"}
                </p>
                {match.user2 ? (
                  <button onClick={() => navigate(`/game/${match._id}`)}>
                    Rejoindre
                  </button>
                ) : (
                  <span> - En attente d'un joueur</span>
                )}
              </li>
            ))
          ) : (
            <p>Aucun match disponible pour le moment.</p>
          )}
        </ul>
      </div>
    </div>
  );
}

export default GameLobby;
