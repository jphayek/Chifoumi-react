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

  const user1 = match.user1;
  const user2 = match.user2;

  const scores = { user1: 0, user2: 0 };

  for (let i = 0; i < match.turns.length; i += 2) { 
      if (!match.turns[i] || !match.turns[i + 1]) continue;

      const turnUser1 = match.turns[i]?.username === user1.username ? match.turns[i] : match.turns[i + 1];
      const turnUser2 = match.turns[i]?.username === user2.username ? match.turns[i] : match.turns[i + 1];

      const result = checkTurnWinner({ 
          user1: turnUser1.choice, 
          user2: turnUser2.choice 
      });

      if (result === "user1") scores.user1++;
      if (result === "user2") scores.user2++;
  }

  console.log(`👤 Joueur 1: ${user1?.username || "Inconnu"}`);
  console.log(`👤 Joueur 2: ${user2?.username || "Inconnu"}`);
  console.log(`📊 Score final - ${user1?.username}: ${scores.user1}, ${user2?.username}: ${scores.user2}`);

  const winner = scores.user1 > scores.user2 ? user1 : user2;
  console.log(`✅ Gagnant déterminé : ${winner?.username || "Égalité"}`);

  return scores.user1 === scores.user2 ? "draw" : winner;
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
