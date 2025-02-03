const checkTurnWinner = (turn) => {
  if (turn.user1 === "rock" && turn.user2 === "paper") {
    return "user2";
  }
  if (turn.user1 === "paper" && turn.user2 === "rock") {
    return "user1";
  }
  if (turn.user1 === "rock" && turn.user2 === "scissors") {
    return "user1";
  }
  if (turn.user1 === "scissors" && turn.user2 === "rock") {
    return "user2";
  }
  if (turn.user1 === "paper" && turn.user2 === "scissors") {
    return "user2";
  }
  if (turn.user1 === "scissors" && turn.user2 === "paper") {
    return "user1";
  }
  return "draw";
};
const checkTurnPlayed = (turn) => {
  if (turn.user1 && turn.user2) {
    return true;
  }
  return false;
};

const checkMatchWinner = (match) => {
  if (match.turns.length < 6) return null; 

  const scores = { user1: 0, user2: 0 };

  for (let i = 0; i < match.turns.length; i += 2) { 
      const result = checkTurnWinner({ 
          user1: match.turns[i]?.choice, 
          user2: match.turns[i + 1]?.choice 
      });

      if (result === "user1") scores.user1++;
      if (result === "user2") scores.user2++;
  }

  if (scores.user1 === scores.user2) {
      return "draw"; 
  }

  return scores.user1 > scores.user2 ? match.user1 : match.user2; 
};




const getLastTurnPlayed = (match) => {
  return match.turns.reduce((acc, turn, index) => {
    if (checkTurnPlayed(turn)) return index;
    return acc;
  }, -1);
};

module.exports = {
  checkTurnWinner,
  checkTurnPlayed,
  checkMatchWinner,
  getLastTurnPlayed,
};
