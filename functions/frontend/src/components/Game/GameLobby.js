import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMatches } from "../../hooks/useMatches";

function GameLobby() {
  const { createMatch, joinMatch, getUserMatches } = useMatches();
  const navigate = useNavigate();
  const [matchId, setMatchId] = useState("");
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const fetchMatches = async () => {
      const userMatches = await getUserMatches();
      console.log("🎲 Matchs affichés dans GameLobby:", userMatches);

      const completedMatches = userMatches.filter(match => match.user2 !== null);
      setMatches(completedMatches);
    };
    fetchMatches();
  }, []);

  const storedUser = localStorage.getItem("user");
  const currentUser = storedUser ? JSON.parse(storedUser).username : null;

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

      <div className="match-history">
        <h3>🕹️ Matchs joués</h3>
        {matches.length === 0 ? (
          <p>Aucun match trouvé.</p>
        ) : (
          <ul>
            {matches.map((match) => {
              const opponent =
                match.user1.username === currentUser
                  ? match.user2.username
                  : match.user1.username;

              return (
                <li key={match._id}>
                  <p><strong>🆔 Match ID:</strong> {match._id}</p>
                  <p><strong>👤 Adversaire:</strong> {opponent}</p>
                  <p><strong>🏆 Résultat:</strong> {match.winner 
                    ? (match.winner.username === currentUser ? "✅ Victoire" : "❌ Défaite") 
                    : "🤝 Match nul"}
                  </p>
                  <button onClick={() => navigate(`/match/${match._id}`)}>Détails</button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default GameLobby;
