// Connect to MongoDB
var mongoClient = require("mongodb").MongoClient;
var ObjectID = require("mongodb").ObjectID;
var url = "mongodb://<username>:<password>@ds025379.mlab.com:25379/galactic-conquest";
mongoClient.connect(url, function (err, db) {
  if(err) throw err;
  mongoClient.savedGamesCollection = db.collection("savedGames");
  findSavedGame(mongoClient.savedGamesCollection, "56f5a6e2e4b080b1e46143b3", function() {
    db.close();
  });
});

function findSavedGame(collection, data, callback) {
  collection.find({"_id": new ObjectID(data)}).toArray(function(err, results) {
    players = results[0].players;
    currentPlayersTurn = results[0].currentTurn;
    tiles = results[0].tiles;
  });
}

// Start up server
var port = 1337;
var express = require("./config/express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io")(server);
server.listen(port);
console.log("Server running at http://localhost:" + port);

var playerCount = 0;
var MAX_PLAYERS = 6;
var players;
var currentPlayersTurn;
var tiles;
io.on("connection", function (socket) {
  var playerAdded = false;

  // handle join requests from client
  socket.on("addPlayer", function(playerName) {
    if (playerAdded) return;
    if (playerCount >= MAX_PLAYERS) return; // TODO: emit error message

    socket.playerName = playerName;
    ++playerCount;
    playerAdded = true;
    socket.emit("login", {
      playerCount: playerCount
    });

    socket.broadcast.emit("playerAdded", {
      playerName: socket.playerName,
      playerCount: playerCount
    });
    console.log(playerName + " joined");
  });

  // Chat feature
  socket.on("typing", function() {
    socket.broadcast.emit("typing", {
      playerName: socket.playerName
    });
  });

  socket.on("stopTyping", function() {
    socket.broadcast.emit("stopTyping", {
      playerName: socket.playerName
    });
  });

  socket.on("disconnect", function() {
    if (playerAdded) {
      --playerCount;
      socket.broadcast.emit("playerLeft", {
        playerName: socket.playerName,
        playerCount: playerCount
      });
      console.log(socket.playerName + " disconnected");
    }
  });

  socket.on("newMessage", function(data) {
    socket.broadcast.emit("newMessage", {
      playerName: socket.playerName,
      message: data
    });
  });

  // Menu
  socket.on("loadGame", function(data) {
    //TODO: write me!
  });

  socket.on("newGame", function() {
    //TODO: write me!
  });

  socket.on("saveGame", function() {
    //TODO: write me!
  });

  // Player Game Actions
  socket.on("buildShips", function(data) {
    //TODO: write me!
  });

  socket.on("endTurn", function(data) {
    if (currentPlayersTurn === data) {
      checkVictoryConditions();
      currentPlayersTurn = findNextPlayersTurn(data);
      socket.broadcast.emit("updateTurn", currentPlayersTurn);
      socket.emit("updateTurn", currentPlayersTurn);
    }
  });

  socket.on("selectPlanet", function(data) {
    //TODO: write me for reals
  });

  socket.on("updatePlanet", function(data) {
    var planetData = getPlanetInfo(data);
    socket.emit("updatePlanet", {
      ownerName: planetData.ownerName,
      planetName: planetData.planetName,
      fighters: planetData.fighters,
      destroyers: planetData.destroyers,
      dreadnoughts: planetData.dreadnoughts
    });
  });

  socket.on("sendShips", function(data) {
    //TODO: write me!
  });

  socket.on("updateTurn", function() {
    socket.emit("updateTurn", currentPlayersTurn);
  });
});

function findNextPlayersTurn(data) {
  for (var i = 0; i < players.length; i++) {
    if (players[i].name === data) {
      if (i + 1 < players.length) {
        return players[i+1].name;
      }
      else {
        return players[0].name;
      }
    }
  }
}

function getPlanetInfo(data) {
  for (var i = 0; i < tiles.length; i++) {
    if (tiles[i].name === data) {
      data = {
        ownerName: tiles[i].owner,
        planetName: tiles[i].name,
        fighters: tiles[i].fighters,
        destroyers: tiles[i].destroyers,
        dreadnoughts: tiles[i].dreadnoughts
      }
      return data;
    }
  }
}

function checkVictoryConditions() {
  // TODO: write me!
}