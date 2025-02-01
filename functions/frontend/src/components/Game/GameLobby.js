import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMatches } from "../../hooks/useMatches";

function GameLobby() {
  const { createMatch, joinMatch } = useMatches();
  const navigate = useNavigate();
  const [matchId, setMatchId] = useState("");

  const handleCreateMatch = async () => {
    const id = await createMatch();
    if (id) {
        console.log("🚀 Redirection vers /game/" + id);
    }
  };


  const handleJoinMatch = async () => {
    if (!matchId) {
      alert("Veuillez entrer un ID de match !");
      return;
    }
    const success = await joinMatch(matchId);
    if (success) {
      navigate(`/game/${matchId}`);
    } else {
      alert("Impossible de rejoindre la partie. Vérifiez l'ID.");
    }
  };

  return (
    <div className="game-lobby">
      <h2>Créer ou Rejoindre une Partie</h2>

      <div className="create-match">
        <button onClick={handleCreateMatch}>Créer une nouvelle partie</button>
      </div>

      <div className="join-match">
        <input 
          type="text" 
          placeholder="Entrez l'ID du match" 
          value={matchId} 
          onChange={(e) => setMatchId(e.target.value)} 
        />
        <button onClick={handleJoinMatch}>Rejoindre</button>
      </div>
    </div>
  );
}

export default GameLobby;
