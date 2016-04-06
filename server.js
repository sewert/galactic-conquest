// Connect to MongoDB
var fs = require("fs");
var configJson = JSON.parse(fs.readFileSync("config.json"));
var mongoClient = require("mongodb").MongoClient;
var ObjectID = require("mongodb").ObjectID;
mongoClient.connect(configJson.url, function (err, db) {
    if (err) throw err;
    mongoClient.savedGamesCollection = db.collection("savedGames");
    findSavedGame(mongoClient.savedGamesCollection, "56f5a6e2e4b080b1e46143b3", function () {
        db.close();
    });
});

function findSavedGame(collection, gameId, callback) {
    collection.find({"_id": new ObjectID(gameId)}).toArray(function (err, results) {
        players = results[0].players;
        currentPlayersTurn = results[0].currentTurn;
        tiles = results[0].tiles;
        currentGameId = gameId;
    });
}

function loadSavedGame(gameId) {
    mongoClient.connect(configJson.url, function (err, db) {
        if (err) throw err;
        mongoClient.savedGamesCollection = db.collection("savedGames");
        findSavedGame(mongoClient.savedGamesCollection, gameId, function () {
            db.close();
        });
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
var activatedPlanets = [];
var currentGameId;

io.on("connection", function (socket) {
    var playerAdded = false;

    // handle join requests from client
    socket.on("addPlayer", function (playerName) {
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
        loadSavedGame(data);
    });

    socket.on("newGame", function (data) {
        //TODO: write me!
        // create new game with the given players
        socket.emit("newGameSuccess", "gameId");
    });

    socket.on("saveGame", function () {
        //TODO: write me!
    });

    // Player Game Actions
    socket.on("activateSystem", function (data) {
        //TODO: write me!
    });

    socket.on("buildShips", function (data) {
        //TODO: write me!
    });

    socket.on("endTurn", function (data) {
        if (currentPlayersTurn === data) {
            checkVictoryConditions();
            currentPlayersTurn = findNextPlayersTurn(data);
            socket.broadcast.emit("updateTurnSuccess", currentPlayersTurn);
            socket.emit("updateTurnSuccess", currentPlayersTurn);
        }
    });

    socket.on("selectTile", function (data) {
        socket.emit("selectTile", {
            activated: hasPlanetBeenActivated(data),
            buildable: canPlanetBuild(data, socket.playerName),
            planetName: data,
            sendable: canSendToPlanet(data, socket.playerName)
        });
    });

    socket.on("sendShips", function (data) {
        //TODO: write me!
    });

    socket.on("updatePlanet", function (data) {
        var planetData = getPlanetInfo(data);
        socket.emit("updatePlanet", {
            ownerName: planetData.ownerName,
            planetName: planetData.planetName,
            fighters: planetData.fighters,
            destroyers: planetData.destroyers,
            dreadnoughts: planetData.dreadnoughts
        });
    });

    socket.on("updateTurn", function () {
        socket.emit("updateTurnSuccess", currentPlayersTurn);
    });
});

function canPlanetBuild(data, playerName) {
    if (hasPlanetBeenActivated(data)) {
        return false;
    }

    for (var i = 0; i < tiles.length; i++) {
        if (tiles[i].name === data && tiles[i].owner === playerName) {
            return true;
        }
    }

    return false;
}

function canSendToPlanet(data, playerName) {
    if (hasPlanetBeenActivated(data)) {
        return false;
    }

    var targetedTile;
    for (var i = 0; i < tiles.length; i++) {
        if (tiles[i].name === data) {
            targetedTile = tiles[i];
            break;
        }
    }
    if (targetedTile != null) {
        for (var i = 0; i < tiles.length; i++) {
            if (!hasPlanetBeenActivated(tiles[i].name) && tiles[i].owner === playerName) {
                if (targetedTile.y === tiles[i].y) { // send from same row
                    if (Math.abs(targetedTile.x - tiles[i].x) === 1 ) {
                        return true;
                    }
                }
                else if (Math.abs(targetedTile.y - tiles[i].y) > 1) { // more than one row apart
                    // do nothing
                }
                else if (targetedTile.y - tiles[i].y === 1) { // send from row above
                    if (targetedTile.y > 3) { // bottom half of board
                        if (targetedTile.x === tiles[i].x || targetedTile.x - tiles[i].x === -1) {
                            return true;
                        }
                    }
                    else if (targetedTile.x === tiles[i].x || targetedTile.x - tiles[i].x === 1) { // top half of board
                        return true;
                    }
                }
                else if (targetedTile.y - tiles[i].y === -1) { // send from row below
                    if (targetedTile.y > 3) { // bottom half of board
                        if (targetedTile.x === tiles[i].x || targetedTile.x - tiles[i].x === 1) {
                            return true;
                        }
                    }
                    else if (targetedTile.x === tiles[i].x || targetedTile.x - tiles[i].x === -1) { // top half of board
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

function findNextPlayersTurn(data) {
    for (var i = 0; i < players.length; i++) {
        if (players[i].name === data) {
            if (i + 1 < players.length) {
                return players[i + 1].name;
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