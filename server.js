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
io.on("connection", function (socket) {
    var playerAdded = false;
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
            if (err) console.log(err);
            mongoClient.savedGamesCollection = db.collection("savedGames");
            mongoClient.savedGamesCollection.insertOne(socket.currentGame, function(err, docsInserted) {
                if (err) console.log(err);
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
    socket.on("buildShips", function (buildData) {
        buildShips(socket.currentGame, buildData, function(data) {
            socket.currentGame = data.currentGame;
            socket.emit("buildShipsSuccess", data.response);
        });
    });

    socket.on("endTurn", function (playerName) {
        if (socket.currentGame.currentTurn === playerName) {
            socket.currentGame.currentTurn = findNextPlayersTurn(playerName, socket.currentGame);
            socket.currentGame.activatedPlanets = [];
            produceResources(socket.currentGame, function (players) {
                socket.currentGame.players = players;
                saveCurrentGame(socket.currentGame, function () {
                    socket.broadcast.emit("updateTurnSuccess", socket.currentGame.currentTurn);
                    socket.emit("updateTurnSuccess", socket.currentGame.currentTurn);
                    socket.broadcast.emit("startTurn", socket.currentGame.currentTurn);
                    socket.emit("startTurn", socket.currentGame.currentTurn);
                });
            });
        }
        else {
            readCurrentTurn(socket.currentGame._id.valueOf(), function (currentTurn) {
                socket.currentGame.currentTurn = currentTurn;
                socket.broadcast.emit("updateTurnSuccess", socket.currentGame.currentTurn);
                socket.emit("updateTurnSuccess", socket.currentGame.currentTurn);
            });
        }

        checkVictoryConditions(socket.currentGame._id.valueOf(), playerName, function (victoryResult) {
            if (victoryResult === true) {
                socket.emit("gameOver", playerName);
                socket.broadcast.emit("gameOver", playerName);
            }
        });
    });

    socket.on("getCurrentResources", function(playerName) {
        if (playerName && socket.currentGame) {
            for (var i = 0; i < socket.currentGame.players.length; i++) {
                if (socket.currentGame.players[i].name === playerName) {
                    socket.emit("getCurrentResourcesSuccess", socket.currentGame.players[i].resources);
                }
            }
        }
    });

    socket.on("selectTile", function (data) {
        if (socket.currentGame && data.playerName !== socket.currentGame.currentTurn) {
           return;
        }

        var planetData = getPlanetInfo(data.planetName, socket.currentGame);
        if (planetData) {
            socket.emit("selectTileSuccess", {
                ownerName: planetData.ownerName,
                planetName: planetData.planetName,
                fighters: planetData.fighters,
                destroyers: planetData.destroyers,
                dreadnoughts: planetData.dreadnoughts,
                activated: hasPlanetBeenActivated(planetData.planetName, socket.currentGame.activatedPlanets),
                buildable: canPlanetBuild(planetData.planetName, socket.playerName, socket.currentGame),
                planetName: planetData.planetName,
                sendable: canSendToPlanet(planetData.planetName, socket.playerName, socket.currentGame)
            });
        }
    });

    socket.on("sendShips", function (sendData) {
        sendShips(socket.currentGame, sendData, function(data) {
            socket.currentGame = data.currentGame;
            socket.emit("sendShipsSuccess", data.response);
        });
    });

    socket.on("updatePlanet", function (data) {
        if (socket.currentGame != null) {
            var planetData = getPlanetInfo(data, socket.currentGame);
            socket.emit("updatePlanetSuccess", {
                ownerName: planetData.ownerName,
                planetName: planetData.planetName,
                fighters: planetData.fighters,
                destroyers: planetData.destroyers,
                dreadnoughts: planetData.dreadnoughts,
                activated: hasPlanetBeenActivated(planetData.planetName, socket.currentGame.activatedPlanets),
                buildable: canPlanetBuild(planetData.planetName, socket.playerName, socket.currentGame),
                planetName: planetData.planetName,
                sendable: canSendToPlanet(planetData.planetName, socket.playerName, socket.currentGame)
            });
        }
    });

    socket.on("updateTurn", function () {
        if (socket.currentGame != null) {
            loadSavedGame(socket.currentGame._id.valueOf(), function(currentGame) {
                socket.currentGame = currentGame;
                socket.emit("updateTurnSuccess", socket.currentGame.currentTurn);
            });
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

function buildShips(currentGame, buildData, callback) {
    if (canPlanetBuild(buildData.planetName, buildData.playerName, currentGame)) {
        var playerIndex = getPlayerIndex(buildData.playerName, currentGame);
        var necessaryResources = parseInt(buildData.fighters);
        necessaryResources += (parseInt(buildData.destroyers) * 2);
        necessaryResources += (parseInt(buildData.dreadnoughts) * 3);
        if (currentGame.players[playerIndex].resources >= necessaryResources) {
            var planetIndex = getPlanetIndex(buildData.planetName, currentGame.tiles);
            currentGame.tiles[planetIndex].fighters = parseInt(buildData.fighters) + parseInt(currentGame.tiles[planetIndex].fighters);
            currentGame.tiles[planetIndex].destroyers = parseInt(buildData.destroyers) + parseInt(currentGame.tiles[planetIndex].destroyers);
            currentGame.tiles[planetIndex].dreadnoughts = parseInt(buildData.dreadnoughts) + parseInt(currentGame.tiles[planetIndex].dreadnoughts);
            currentGame.players[playerIndex].resources = parseInt(currentGame.players[playerIndex].resources) - necessaryResources;
            currentGame.activatedPlanets.push(buildData.planetName);
            saveCurrentGame(currentGame, function () {
                callback({
                    response: "Success",
                    currentGame: currentGame
                });
            });
        }
        else {
            callback({
                response: "Insufficient resources. Costs " + necessaryResources + " to build but only " + currentGame.players[playerIndex].resources + " available",
                currentGame: currentGame
            });
        }
    }
    else {
        callback({
            response: "Planet cannot build ships this turn.",
            currentGame: currentGame
        });
    }
}

function canPlanetBuild(planetName, playerName, currentGame) {
    if (currentGame.currentTurn !== playerName) {
        return false;
    }

    if (hasPlanetBeenActivated(planetName, currentGame.activatedPlanets)) {
        return false;
    }

    for (var i = 0; i < currentGame.tiles.length; i++) {
        if (currentGame.tiles[i].name === planetName && currentGame.tiles[i].owner === playerName) {
            return true;
        }
    }

    return false;
}

function canSendFromSpecificPlanet(targetPlanetName, sourcePlanetName, senderPlayerName, currentGame) {
    if (hasPlanetBeenActivated(targetPlanetName, currentGame.activatedPlanets)) {
        return false;
    }
    if (hasPlanetBeenActivated(sourcePlanetName, currentGame.activatedPlanets)) {
        return false;
    }

    var targetedPlanet = currentGame.tiles[getPlanetIndex(targetPlanetName, currentGame.tiles)];
    var sourcePlanet = currentGame.tiles[getPlanetIndex(sourcePlanetName, currentGame.tiles)];

    if (targetedPlanet && sourcePlanet) {
        if (sourcePlanet.owner !== senderPlayerName) {
            return false;
        }

        if (targetedPlanet.y === sourcePlanet.y) { // send from same row
            if (Math.abs(targetedPlanet.x - sourcePlanet.x) === 1 ) {
                return true;
            }
        }
        else if (Math.abs(targetedPlanet.y - sourcePlanet.y) > 1) { // more than one row apart
            return false;
        }
        else if (targetedPlanet.y - sourcePlanet.y === 1) { // send from row above
            if (targetedPlanet.y > 3) { // bottom half of board
                if (targetedPlanet.x === sourcePlanet.x || targetedPlanet.x - sourcePlanet.x === -1) {
                    return true;
                }
            }
            else if (targetedPlanet.x === sourcePlanet.x || targetedPlanet.x - sourcePlanet.x === 1) { // top half of board
                return true;
            }
        }
        else if (targetedPlanet.y - sourcePlanet.y === -1) { // send from row below
            if (targetedPlanet.y > 3) { // bottom half of board
                if (targetedPlanet.x === sourcePlanet.x || targetedPlanet.x - sourcePlanet.x === 1) {
                    return true;
                }
            }
            else if (targetedPlanet.x === sourcePlanet.x || targetedPlanet.x - sourcePlanet.x === -1) { // top half of board
                return true;
            }
        }
    }
    else {
        return false;
    }

    return false;
}

function canSendToPlanet(targetPlanetName, senderName, currentGame) {
    if (hasPlanetBeenActivated(targetPlanetName, currentGame.activatedPlanets)) {
        return false;
    }

    var targetedPlanet;
    for (var i = 0; i < currentGame.tiles.length; i++) {
        if (currentGame.tiles[i].name === targetPlanetName) {
            targetedPlanet = currentGame.tiles[i];
            break;
        }
    }
    if (targetedPlanet != null) {
        for (i = 0; i < currentGame.tiles.length; i++) {
            if (!hasPlanetBeenActivated(currentGame.tiles[i].name, currentGame.activatedPlanets) && currentGame.tiles[i].owner === senderName) {
                if (targetedPlanet.y === currentGame.tiles[i].y) { // send from same row
                    if (Math.abs(targetedPlanet.x - currentGame.tiles[i].x) === 1 ) {
                        return true;
                    }
                }
                else if (Math.abs(targetedPlanet.y - currentGame.tiles[i].y) > 1) { // more than one row apart
                    // do nothing
                }
                else if (targetedPlanet.y - currentGame.tiles[i].y === 1) { // send from row above
                    if (targetedPlanet.y > 3) { // bottom half of board
                        if (targetedPlanet.x === currentGame.tiles[i].x || targetedPlanet.x - currentGame.tiles[i].x === -1) {
                            return true;
                        }
                    }
                    else if (targetedPlanet.x === currentGame.tiles[i].x || targetedPlanet.x - currentGame.tiles[i].x === 1) { // top half of board
                        return true;
                    }
                }
                else if (targetedPlanet.y - currentGame.tiles[i].y === -1) { // send from row below
                    if (targetedPlanet.y > 3) { // bottom half of board
                        if (targetedPlanet.x === currentGame.tiles[i].x || targetedPlanet.x - currentGame.tiles[i].x === 1) {
                            return true;
                        }
                    }
                    else if (targetedPlanet.x === currentGame.tiles[i].x || targetedPlanet.x - currentGame.tiles[i].x === -1) { // top half of board
                        return true;
                    }
                }
            }
        }
    }

    return false;
}

function checkVictoryConditions(gameId, playerName, callback) {
    var victoryResult = true;
    loadSavedGame(gameId, function (currentGame) {
        for (var i = 0; i < currentGame.tiles.length; i++) {
            if (currentGame.tiles[i].owner !== playerName && currentGame.tiles[i].owner !== "neutral") {
                victoryResult = false;
            }
        }
        callback(victoryResult);
    });
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

function getPlanetIndex(planetName, tiles) {
    for (var i = 0; i < tiles.length; i++) {
        if (tiles[i].name === planetName) {
            return i;
        }
    }
}

function getPlanetInfo(data, currentGame) {
    if (currentGame) {
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
}

function getPlayerIndex(playerName, currentGame) {
    for (var i = 0; i < currentGame.players.length; i++) {
        if (currentGame.players[i].name === playerName) {
            return i;
        }
    }
}

function hasPlanetBeenActivated(planetName, activatedPlanets) {
    for (var i = 0; i < activatedPlanets.length; i++) {
        if (activatedPlanets[i] === planetName) {
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

function produceResources(currentGame, callback) {
    var playerIndex = getPlayerIndex(currentGame.currentTurn, currentGame);

    var resources = parseInt(currentGame.players[playerIndex].resources);
    for (i = 0; i < currentGame.tiles.length; i++) {
        if (currentGame.tiles[i].owner === currentGame.currentTurn) {
            resources += parseInt(currentGame.tiles[i].production);
        }
    }
    currentGame.players[playerIndex].resources = resources;

    callback(currentGame.players);
}

function readCurrentTurn(gameId, callback) {
    mongoClient.connect(configJson.url, function (err, db) {
        if (err) console.log(err);
        mongoClient.savedGamesCollection = db.collection("savedGames");
        mongoClient.savedGamesCollection.find({"_id": new ObjectID(gameId)}).toArray(function (err, results) {
            if (err) console.log(err);
            db.close();
            callback(results[0].currentTurn);
        });
    });
}

function saveCurrentGame(currentGame, callback) {
    mongoClient.connect(configJson.url, function (err, db) {
        if (err) console.log(err);
        mongoClient.savedGamesCollection = db.collection("savedGames");
        mongoClient.savedGamesCollection.updateOne({"_id": new ObjectID(currentGame._id.valueOf())}, {$set:{"currentTurn":currentGame.currentTurn, "activatedPlanets": currentGame.activatedPlanets, "players":currentGame.players, "tiles":currentGame.tiles}});
        db.close();
        callback();
    });
}

function sendShips(currentGame, sendData, callback) {
    if (canSendFromSpecificPlanet(sendData.targetPlanet, sendData.sourcePlanet, sendData.playerName, currentGame)) {
        // TODO: verify ships counts, move ships, check for combat, update new planet owner and ship info, save game, then return
    }
    else {
        callback({
            response: sendData.sourcePlanet + " cannot send ships to " + sendData.targetPlanet + " this turn.",
            currentGame: currentGame
        });
    }
}