// Connect to MongoDB
var fs = require("fs");
var configJson = JSON.parse(fs.readFileSync("config.json"));
var mongoClient = require("mongodb").MongoClient;
var ObjectID = require("mongodb").ObjectID;

// Start up server
var port = 1337;
var express = require("./config/express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io")(server);
server.listen(port);
console.log("Server running at http://localhost:" + port);

var playerCount = 0;
var activatedPlanets = [];

io.on("connection", function (socket) {
    var playerAdded = false;
    socket.currentGame = null;
    // handle join requests from client
    socket.on("addPlayer", function (playerName) {
        if (playerAdded) return;

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
    socket.on("typing", function () {
        socket.broadcast.emit("typing", {
            playerName: socket.playerName
        });
    });

    socket.on("stopTyping", function () {
        socket.broadcast.emit("stopTyping", {
            playerName: socket.playerName
        });
    });

    socket.on("disconnect", function () {
        if (playerAdded) {
            --playerCount;
            socket.broadcast.emit("playerLeft", {
                playerName: socket.playerName,
                playerCount: playerCount
            });
            console.log(socket.playerName + " disconnected");
        }
    });

    socket.on("newMessage", function (data) {
        socket.broadcast.emit("newMessage", {
            playerName: socket.playerName,
            message: data
        });
    });

    // Menu
    socket.on("loadGame", function (data) {
        loadSavedGame(data, function (currentGame) {
            socket.currentGame = currentGame;
            socket.emit("loadGameSuccess", {
                gameId: socket.currentGame._id.valueOf(),
                player1: socket.currentGame.players[0].name,
                player2: socket.currentGame.players[1].name,
                player3: socket.currentGame.players[2].name,
                player4: socket.currentGame.players[3].name,
                player5: socket.currentGame.players[4].name,
                player6: socket.currentGame.players[5].name
            });
        });
    });

    socket.on("newGame", function (data) {
        socket.currentGame = JSON.parse(fs.readFileSync("config/newGameTemplate.json"));
        addPlayersToGame(data, socket.currentGame);
        mongoClient.connect(configJson.url, function (err, db) {
            if (err) throw err;
            mongoClient.savedGamesCollection = db.collection("savedGames");
            mongoClient.savedGamesCollection.insertOne(socket.currentGame, function(err, docsInserted) {
                if (err) throw err;
                db.close();
                socket.emit("newGameSuccess", {
                    player1: data.player1,
                    player2: data.player2,
                    player3: data.player3,
                    player4: data.player4,
                    player5: data.player5,
                    player6: data.player6,
                    gameId: docsInserted.insertedId.valueOf()
                });
            });
        });
    });

    socket.on("saveGame", function () {
        if (socket.currentGame) {
            socket.emit("saveGameSuccess", socket.currentGame._id.valueOf());
        }
    });

    // Player Game Actions
    socket.on("activateSystem", function (data) {
        //TODO: write me!
    });

    socket.on("buildShips", function (data) {
        //TODO: write me!
    });

    socket.on("endTurn", function (data) {
        if (socket.currentGame.currentTurn === data) {
            checkVictoryConditions();
            socket.currentGame.currentTurn = findNextPlayersTurn(data, socket.currentGame);
            // TODO: update MongoDB
            socket.broadcast.emit("updateTurnSuccess", socket.currentGame.currentTurn);
            socket.emit("updateTurnSuccess", socket.currentGame.currentTurn);
        }
    });

    socket.on("selectTile", function (data) {
        socket.emit("selectTile", {
            activated: hasPlanetBeenActivated(data),
            buildable: canPlanetBuild(data, socket.playerName, socket.currentGame),
            planetName: data,
            sendable: canSendToPlanet(data, socket.playerName, socket.currentGame)
        });
    });

    socket.on("sendShips", function (data) {
        //TODO: write me!
    });

    socket.on("updatePlanet", function (data) {
        var planetData = getPlanetInfo(data, socket.currentGame);
        socket.emit("updatePlanet", {
            ownerName: planetData.ownerName,
            planetName: planetData.planetName,
            fighters: planetData.fighters,
            destroyers: planetData.destroyers,
            dreadnoughts: planetData.dreadnoughts
        });
    });

    socket.on("updateTurn", function () {
        if (socket.currentGame != null) {
            socket.emit("updateTurnSuccess", socket.currentGame.currentTurn);
        }
    });
});

function addPlayersToGame(data, currentGame) {
    currentGame.currentTurn = data.player1;

    for (var i = 0; i < currentGame.players.length; i++) {
        if (currentGame.players[i].name === "player1") {
            currentGame.players[i].name = data.player1;
        }
        else if (currentGame.players[i].name === "player2") {
            currentGame.players[i].name = data.player2;
        }
        else if (currentGame.players[i].name === "player3") {
            currentGame.players[i].name = data.player3;
        }
        else if (currentGame.players[i].name === "player4") {
            currentGame.players[i].name = data.player4;
        }
        else if (currentGame.players[i].name === "player5") {
            currentGame.players[i].name = data.player5;
        }
        else if (currentGame.players[i].name === "player6") {
            currentGame.players[i].name = data.player6;
        }
    }

    for (var i = 0; i < currentGame.tiles.length; i++) {
        if (currentGame.tiles[i].owner === "player1") {
            currentGame.tiles[i].owner = data.player1;
        }
        else if (currentGame.tiles[i].owner === "player2") {
            currentGame.tiles[i].owner = data.player2;
        }
        else if (currentGame.tiles[i].owner === "player3") {
            currentGame.tiles[i].owner = data.player3;
        }
        else if (currentGame.tiles[i].owner === "player4") {
            currentGame.tiles[i].owner = data.player4;
        }
        else if (currentGame.tiles[i].owner === "player5") {
            currentGame.tiles[i].owner = data.player5;
        }
        else if (currentGame.tiles[i].owner === "player6") {
            currentGame.tiles[i].owner = data.player6;
        }
    }

    return currentGame;
}

function canPlanetBuild(data, playerName, currentGame) {
    if (hasPlanetBeenActivated(data)) {
        return false;
    }

    for (var i = 0; i < currentGame.tiles.length; i++) {
        if (currentGame.tiles[i].name === data && currentGame.tiles[i].owner === playerName) {
            return true;
        }
    }

    return false;
}

function canSendToPlanet(data, playerName, currentGame) {
    if (hasPlanetBeenActivated(data)) {
        return false;
    }

    var targetedTile;
    for (var i = 0; i < currentGame.tiles.length; i++) {
        if (currentGame.tiles[i].name === data) {
            targetedTile = currentGame.tiles[i];
            break;
        }
    }
    if (targetedTile != null) {
        for (var i = 0; i < currentGame.tiles.length; i++) {
            if (!hasPlanetBeenActivated(currentGame.tiles[i].name) && currentGame.tiles[i].owner === playerName) {
                if (targetedTile.y === currentGame.tiles[i].y) { // send from same row
                    if (Math.abs(targetedTile.x - currentGame.tiles[i].x) === 1 ) {
                        return true;
                    }
                }
                else if (Math.abs(targetedTile.y - currentGame.tiles[i].y) > 1) { // more than one row apart
                    // do nothing
                }
                else if (targetedTile.y - currentGame.tiles[i].y === 1) { // send from row above
                    if (targetedTile.y > 3) { // bottom half of board
                        if (targetedTile.x === currentGame.tiles[i].x || targetedTile.x - currentGame.tiles[i].x === -1) {
                            return true;
                        }
                    }
                    else if (targetedTile.x === currentGame.tiles[i].x || targetedTile.x - currentGame.tiles[i].x === 1) { // top half of board
                        return true;
                    }
                }
                else if (targetedTile.y - currentGame.tiles[i].y === -1) { // send from row below
                    if (targetedTile.y > 3) { // bottom half of board
                        if (targetedTile.x === currentGame.tiles[i].x || targetedTile.x - currentGame.tiles[i].x === 1) {
                            return true;
                        }
                    }
                    else if (targetedTile.x === currentGame.tiles[i].x || targetedTile.x - currentGame.tiles[i].x === -1) { // top half of board
                        return true;
                    }
                }
            }
        }
    }

    return false;
}

function checkVictoryConditions() {
    // TODO: write me!
}

function findNextPlayersTurn(data, currentGame) {
    for (var i = 0; i < currentGame.players.length; i++) {
        if (currentGame.players[i].name === data) {
            if (i + 1 < currentGame.players.length) {
                return currentGame.players[i + 1].name;
            }
            else {
                return currentGame.players[0].name;
            }
        }
    }
}

function getPlanetInfo(data, currentGame) {
    for (var i = 0; i < currentGame.tiles.length; i++) {
        if (currentGame.tiles[i].name === data) {
            data = {
                ownerName: currentGame.tiles[i].owner,
                planetName: currentGame.tiles[i].name,
                fighters: currentGame.tiles[i].fighters,
                destroyers: currentGame.tiles[i].destroyers,
                dreadnoughts: currentGame.tiles[i].dreadnoughts
            };
            return data;
        }
    }
}

function hasPlanetBeenActivated(data) {
    for (var i = 0; i < activatedPlanets.length; i++) {
        if (activatedPlanets[i] === data) {
            return true;
        }
    }
    return false;
}

function loadSavedGame(gameId, callback) {
    mongoClient.connect(configJson.url, function (err, db) {
        if (err) console.log(err);
        mongoClient.savedGamesCollection = db.collection("savedGames");
        mongoClient.savedGamesCollection.find({"_id": new ObjectID(gameId)}).toArray(function (err, results) {
            if (err) console.log(err);
            db.close();
            callback(results[0]);
        });
    });
}