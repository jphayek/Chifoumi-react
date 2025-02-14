import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import "./App.css";
import Register from "./components/Auth/Register";
import Login from "./components/Auth/Login";
import GameLobby from "./components/Game/GameLobby";
import MultiplayerGame from "./components/Game/MultiplayerGame";
import useAuth from "./hooks/useAuth";
import MatchDetails from "./components/Matches/MatchDetails";

function LayoutWithLogout({ children }) {
  const { logout } = useAuth();
  const location = useLocation();

  const showLogoutButton = location.pathname.startsWith("/matches") || location.pathname.startsWith("/game");

  return (
    <div className="app-container">
      {children}
      {showLogoutButton && (
        <div className="logout-container">
          <button className="logout-btn" onClick={logout}>
            🚪 Déconnexion
          </button>
        </div>
      )}
    </div>
  );
}


function App() {
  const { user } = useAuth();

  return (
    <Router>
      <LayoutWithLogout>
        <Routes>
          <Route path="/" element={user ? <Navigate to="/matches" /> : <Navigate to="/login" />} />
          <Route path="/matches" element={user ? <GameLobby /> : <Navigate to="/login" />} />
          <Route path="/game/:matchId" element={user ? <MultiplayerGame /> : <Navigate to="/login" />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/match/:matchId" element={<MatchDetails />} />
        </Routes>
      </LayoutWithLogout>
    </Router>
  );
}

export default App;
