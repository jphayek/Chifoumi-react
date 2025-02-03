const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const Match = require("./models/match");
const { checkMatchWinner } = require("./lib/chifoumi");


const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("Nouvelle connexion WebSocket :", socket.id);

  socket.on("joinMatch", (matchId) => {
    
    if (!matchId) {
      return;
    }
  
    socket.join(matchId);
    const clients = io.sockets.adapter.rooms.get(matchId);  
    if (clients && clients.size === 2) {
      io.to(matchId).emit("gameStart", { matchId });
    } else {
      io.to(matchId).emit("waitingForPlayer");
    }
  });
  
  const Match = require("./models/match");
  const { checkMatchWinner } = require("./lib/chifoumi");
  
  socket.on("playTurn", async (matchId, turnData) => {
      console.log(`Tour joué dans ${matchId} :`, turnData);
      io.to(matchId).emit("turnPlayed", turnData);
  
      try {
          const match = await Match.findById(matchId);
          if (!match) {
              console.error("⚠️ Match non trouvé !");
              return;
          }
  
          match.turns.push(turnData);
  
          if (match.turns.length >= 6) {
              match.winner = checkMatchWinner(match);
              await match.save();
              io.to(matchId).emit("gameOver", { matchId, winner: match.winner?.username || "draw" });
          } else {
              await match.save();
          }
      } catch (error) {
          console.error("❌ Erreur lors de l'ajout du tour :", error);
      }
  });
  

  socket.on("disconnect", () => {
    console.log("Utilisateur déconnecté");
  });
});

server.listen(process.env.PORT || 3002, () =>
  console.log("Serveur WebSocket lancé sur le port 3002")
);


