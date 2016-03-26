var MongoClient = require("mongodb").MongoClient;
var ObjectID = require("mongodb").ObjectID;
MongoClient.connect("mongodb://<username>:<password>@ds025379.mlab.com:25379/galactic-conquest", function (err, db) {
  if(err) throw err;

  var savedGamesCollection = db.collection("savedGames");
  //savedGameCollection.insertOne({"test":"message"}, function(err, docs) {
  //});

  // Locate all the entries using find
  savedGamesCollection.find({"_id": new ObjectID("56f5a6e2e4b080b1e46143b3")}).toArray(function(err, results) {
    console.log(results[0].players[0].name);
    db.close();
  });
});

var port = 1337;
var express = require("./config/express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io")(server);
server.listen(port);
console.log("Server running at http://localhost:" + port);

var playerCount = 0;
var MAX_PLAYERS = 6;

io.on("connection", function (socket) {
  console.log("Client connected...");

  var playerAdded = false;

  // handle join requests from client
  socket.on("addPlayer", function(playerName) {
    console.log(playerName);

    if (playerAdded) return;
    if (playerCount >= MAX_PLAYERS) return;

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
  });

  // show when client is typing
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
    }
  });

  socket.on("newMessage", function(data) {
    console.log(data);

    socket.broadcast.emit("newMessage", {
      playerName: socket.playerName,
      message: data
    });
  });
});