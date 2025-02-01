import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:3002";

export function useMatches() {
  const navigate = useNavigate();

  const createMatch = async () => {
    try {
      const response = await fetch(`${API_URL}/matches`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Match créé :", data.matchId);
        
        navigate(`/game/${data.matchId}`);
        
        return data.matchId;
      } else {
        console.error("Erreur lors de la création du match");
        return null;
      }
    } catch (error) {
      console.error("Erreur réseau lors de la création du match :", error);
      return null;
    }
  };

  const joinMatch = async (matchId) => {
    if (!matchId) {
        alert("Veuillez entrer un ID de match valide !");
        return false;
    }

    try {
        const response = await fetch(`${API_URL}/matches/join`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({ matchId }),
        });

        if (response.ok) {
            
            //Rediriger `user2` vers la partie immédiatement
            navigate(`/game/${matchId}`);

            return true;
        } else {
            const errorData = await response.json();
            console.error("Erreur lors de la tentative de rejoindre le match :", errorData);
            return false;
        }
    } catch (error) {
        console.error("Erreur réseau lors de la tentative de rejoindre le match :", error);
        return false;
    }
  };

  return { createMatch, joinMatch };
}
