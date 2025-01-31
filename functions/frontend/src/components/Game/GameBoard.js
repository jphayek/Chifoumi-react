import { motion } from "framer-motion";
import { useState } from "react";

function GameBoard({ playGame }) {
  const [selected, setSelected] = useState(null);

  const handleChoice = (choice) => {
    setSelected(choice);
    playGame(choice);
  };

  return (
    <div className="game-board">
      <h2>Choisissez votre coup</h2>
      <div className="choices">
        {["Pierre", "Papier", "Ciseaux"].map((choice) => (
          <motion.button
            key={choice}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
            className={`choice-btn ${selected === choice ? "selected" : ""}`}
            onClick={() => handleChoice(choice)}
          >
            {choice}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

export default GameBoard;
