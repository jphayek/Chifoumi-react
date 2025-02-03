import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Register from "./components/Auth/Register";
import Login from "./components/Auth/Login";
import GameLobby from "./components/Game/GameLobby";
import MultiplayerGame from "./components/Game/MultiplayerGame";
import useAuth from "./hooks/useAuth";
import MatchDetails from "./components/Matches/MatchDetails";

<Route path="/match/:id" element={<MatchDetails />} />


function App() {
  const { user, logout } = useAuth();

  return (
    <Router>
      <div className="app-container">
        {user && (
          <button className="logout-btn" onClick={logout}>
            🚪 Déconnexion
          </button>
        )}

        <Routes>
          <Route path="/" element={user ? <Navigate to="/matches" /> : <Navigate to="/login" />} />
          <Route path="/matches" element={user ? <GameLobby /> : <Navigate to="/login" />} />
          <Route path="/game/:matchId" element={user ? <MultiplayerGame /> : <Navigate to="/login" />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
