const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");

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
  

  socket.on("playTurn", (matchId, turnData) => {
    console.log(`Tour joué dans ${matchId} :`, turnData);
    io.to(matchId).emit("turnPlayed", turnData);
  });

  socket.on("disconnect", () => {
    console.log("Utilisateur déconnecté");
  });
});

server.listen(process.env.PORT || 3002, () =>
  console.log("Serveur WebSocket lancé sur le port 3002")
);
