import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Lobby from "./pages/Lobby"; // Prochaine étape
import { useContext } from "react";
import AuthContext from "./context/AuthContext";

function App() {
  const { user, logout } = useContext(AuthContext);

  return (
    <Router>
      <nav>
        <Link to="/">Accueil</Link>
        {!user ? (
          <>
            <Link to="/login">Connexion</Link>
            <Link to="/register">Inscription</Link>
          </>
        ) : (
          <>
            <Link to="/lobby">Lobby</Link>
            <button onClick={logout}>Déconnexion</button>
          </>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<h1>Bienvenue sur Chi Fou Mi !</h1>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/lobby" element={user ? <Lobby /> : <Login />} />
      </Routes>
    </Router>
  );
}

export default App;