import { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";

const Lobby = () => {
  const { user } = useContext(AuthContext);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Récupérer la liste des parties en cours
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch("http://localhost:3002/matches", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setMatches(data);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des parties", error);
      }
      setLoading(false);
    };

    fetchMatches();
  }, [user]);

  // Rejoindre ou créer une partie
  const handleJoinMatch = async (matchId = null) => {
    try {
      const endpoint = matchId
        ? `http://localhost:3002/matches/${matchId}`
        : "http://localhost:3002/matches";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { Authorization: `Bearer ${user.token}` },
      });

      if (response.ok) {
        const match = await response.json();
        window.location.href = `/game/${match._id}`;
      } else {
        alert("Impossible de rejoindre la partie !");
      }
    } catch (error) {
      console.error("Erreur lors de la connexion à une partie", error);
    }
  };

  return (
    <div>
      <h2>🏆 Lobby - Liste des parties 🏆</h2>

      {loading ? (
        <p>Chargement des parties...</p>
      ) : matches.length > 0 ? (
        <ul>
          {matches.map((match) => (
            <li key={match._id}>
              Partie entre {match.user1.username} {match.user2 ? `vs ${match.user2.username}` : "(en attente...)"}
              {!match.user2 && <button onClick={() => handleJoinMatch(match._id)}>Rejoindre</button>}
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucune partie disponible.</p>
      )}

      <button onClick={() => handleJoinMatch()}>Créer une nouvelle partie</button>
    </div>
  );
};

export default Lobby;