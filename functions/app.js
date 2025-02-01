require("dotenv-flow").config();
const express = require("express");
const app = express();
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const { checkTurnWinner, checkMatchWinner } = require("./lib/chifoumi");
const NotificationCenter = require("./lib/notificationCenter");
const createToken = require("./lib/jwt").createToken;
const verifyJwt = require("./middlewares/verifyJwt");
require("./lib/mongo");
const User = require("./models/user");
const Match = require("./models/match");
const turnValidator = require("./middlewares/turnValidator");
const path = require("path");

app.use(express.json());
app.use(cors());

// Servir les fichiers React en production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "functions/frontend/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "functions/frontend", "build", "index.html"));
  });
}

app.post("/login", async function (req, res) {
  try {
    let user = await User.findOne({
      username: req.body.username,
      password: req.body.password,
    });
    if (!user) {
      return res.sendStatus(401);
    }
    res.json({ token: await createToken(user) });
  } catch (error) {
    res.status(500).json(error);
  }
});
app.post("/register", async function (req, res) {
  try {
    let user = await User.findOne({
      username: req.body.username,
    });
    if (!user) {
      user = new User({
        ...req.body,
        _id: uuidv4(),
      });
      user = await user.save();
      res.status(201).json(user);
    } else {
      res.status(409).json({ error: "User already exists" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

app.post("/matches", verifyJwt(), async function (req, res) {
  try {
    const match = new Match({
      user1: req.user,
      user2: null,
      turns: [],
      createdAt: new Date(),
    });

    await match.save();

    res.status(201).json({ matchId: match._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post("/matches/join", verifyJwt(), async function (req, res) {
  try {
      const { matchId } = req.body;
      if (!matchId || matchId.length !== 24) {
          return res.status(400).json({ error: "ID invalide" });
      }

      const match = await Match.findById(matchId);
      if (!match) {
          return res.status(404).json({ error: "Match introuvable" });
      }

      if (match.user2) {
          return res.status(400).json({ error: "Ce match est déjà complet" });
      }

      if (match.user1._id === req.user._id) {
          return res.status(400).json({ error: "Vous ne pouvez pas rejoindre votre propre partie !" });
      }

      match.user2 = {
          _id: req.user._id,
          username: req.user.username,
          iat: req.user.iat,
          exp: req.user.exp,
      };

      await match.save();

      res.status(200).json({ success: true, matchId });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});


app.get("/matches", verifyJwt(), async function (req, res) {
  try {
    const { order, itemsPerPage, page, ...criteria } = req.query;

    const matches = await Match.find({
      $or: [
        { "user1._id": req.user._id },
        { "user2._id": req.user._id },
        { user2: null }
      ],
    });
    res.json(matches);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des matchs :", error);
    res.status(500).json(error);
  }
});

app.get("/matches/:id", verifyJwt(), async (req, res) => {
  try {
    const match = await Match.findOne({
      _id: req.params.id,
      $or: [{ "user1._id": req.user._id }, { "user2._id": req.user._id }],
    });
    match.turns = match.turns.map((turn) => {
      if (!turn.winner) {
        if (turn.user2 && match.user2._id !== req.user._id) {
          turn.user2 = "?";
        }
        if (turn.user1 && match.user1._id !== req.user._id) {
          turn.user1 = "?";
        }
      }
      return turn;
    });
    if (match) res.json(match);
    else res.sendStatus(404);
  } catch (error) {
    res.status(500).json(error);
  }
});
app.post(
  "/matches/:id/turns/:idTurn",
  verifyJwt(),
  turnValidator,
  async function (req, res) {
    try {
      const idTurn = parseInt(req.params.idTurn);
      const match = req.match;
      const turn = req.turn;
      const isPlayer1 = match.user1._id === req.user._id;
      turn[isPlayer1 ? "user1" : "user2"] = req.body.move;
      match.turns[idTurn - 1] = turn;
      if (turn.user1 && turn.user2) {
        turn.winner = checkTurnWinner(turn);
      }
      await match.save();
      res.sendStatus(202);
      NotificationCenter.notify({
        type: isPlayer1 ? "PLAYER1_MOVED" : "PLAYER2_MOVED",
        matchId: match._id.valueOf(),
        payload: {
          turn: idTurn,
        },
      });
      if (turn.user1 && turn.user2) {
        NotificationCenter.notify({
          type: "TURN_ENDED",
          matchId: match._id.valueOf(),
          payload: {
            newTurnId: idTurn + 1,
            winner: checkTurnWinner(turn),
          },
        });

        if (match.turns.length === 3) {
          match.winner = checkMatchWinner(match);
          await match.save();
          NotificationCenter.notify({
            type: "MATCH_ENDED",
            matchId: match._id.valueOf(),
            payload: {
              winner: (match.winner && match.winner.username) || "draw",
            },
          });
        }
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

app.get("/matches/:id/subscribe", verifyJwt(), function (request, response) {
  try {
    const clientId = request.user._id;

    const newClient = {
      id: clientId,
      matchId: request.params.id,
      response,
    };

    NotificationCenter.addClient(newClient);

    request.on("close", () => {
      console.log(`${clientId} Connection closed`);
      NotificationCenter.removeClient(newClient);
    });
  } catch (error) {
    response.status(500).json(error);
  }
});

app.get("/game/:matchId", verifyJwt(), async (req, res) => {
  try {
    const match = await Match.findOne({
      _id: req.params.id,
      $or: [{ "user1._id": req.user._id }, { "user2._id": req.user._id }],
    });

    if (!match) return res.status(404).json({ error: "Match non trouvé" });

    res.json(match);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = app;
