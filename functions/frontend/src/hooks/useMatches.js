import { useState, useEffect } from "react";

const API_URL = "http://localhost:3002";

export function useMatches() {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/matches`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setMatches(data))
      .catch((err) => console.error("Erreur chargement des matchs", err));
  }, []);

  const createMatch = async () => {
    const response = await fetch(`${API_URL}/matches`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (response.ok) {
      const match = await response.json();
      setMatches([...matches, match]);
    } else {
      alert("Erreur création du match");
    }
  };

  return { matches, createMatch };
}
