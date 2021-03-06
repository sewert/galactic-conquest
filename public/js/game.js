var COLORS = [
    "#00D000", "#5ab15a",
    "#ff7400", "#dda170",
    "#d00076", "#b15a8b"
];
var chatPage = null;
var dialogDiv = null;
var FADE_TIME = 150;
var gameHeight = 900;
var gameDiv = null;
var gameWidth = 1600;
var loadGamePage = null;
var loginPage = null;
var newGamePage = null;
var playerName;
var resources;
var tileHeight = 160;
var tileHeightSpacing = 120;
var tileRowStartHeight = 90;
var tileRowStartWidth = 560;
var tileWidth = 160;
var tileWidthSpacing = 80;
var TYPING_TIMER_LENGTH = 400;
var row1StartWidth = tileRowStartWidth;
var row1StartHeight = tileRowStartHeight;
var row2StartWidth = tileRowStartWidth - tileWidthSpacing;
var row2StartHeight = tileRowStartHeight + tileHeightSpacing;
var row3StartWidth = tileRowStartWidth - tileWidthSpacing * 2;
var row3StartHeight = tileRowStartHeight + tileHeightSpacing * 2;
var row4StartWidth = tileRowStartWidth - tileWidthSpacing * 3;
var row4StartHeight = tileRowStartHeight + tileHeightSpacing * 3;
var row5StartWidth = tileRowStartWidth - tileWidthSpacing * 2;
var row5StartHeight = tileRowStartHeight + tileHeightSpacing * 4;
var row6StartWidth = tileRowStartWidth - tileWidthSpacing;
var row6StartHeight = tileRowStartHeight + tileHeightSpacing * 5;
var row7StartWidth = tileRowStartWidth;
var row7StartHeight = tileRowStartHeight + tileHeightSpacing * 6;

var game = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO, "gameDiv", { preload: preload, create: create, update: update });
var socket = io();

// PHASER FUNCTIONS
function preload() {
    game.load.image("background", "../assets/backgrounds/SpaceBackground-2.jpg");
    game.load.image("newGameButton", "../assets/buttons/newGame_raised.png");
    game.load.image("saveGameButton", "../assets/buttons/saveGame_raised.png");
    game.load.image("loadGameButton", "../assets/buttons/loadGame_raised.png");
    game.load.image("tutorialButton", "../assets/buttons/tutorial_raised.png");
    game.load.image("resumeButton", "../assets/buttons/resumeGame_raised.png");
    game.load.image("tile", "../assets/tiles/purpleTile.png");
    game.load.image("openTile1", "../assets/tiles/openTile1.png");
    game.load.image("openTile2", "../assets/tiles/openTile2.png");
    game.load.image("openTile3", "../assets/tiles/openTile3.png");
    game.load.image("centerTile", "../assets/tiles/centerTile.png");
    game.load.image("hazardTile1", "../assets/tiles/hazardTile1.png");
    game.load.image("homeTile1", "../assets/tiles/homeTile1.png");
    game.load.image("homeTile2", "../assets/tiles/homeTile2.png");
    game.load.image("homeTile3", "../assets/tiles/homeTile3.png");
    game.load.image("homeTile4", "../assets/tiles/homeTile4.png");
    game.load.image("homeTile5", "../assets/tiles/homeTile5.png");
    game.load.image("homeTile6", "../assets/tiles/homeTile6.png");
    game.load.image("textBackground", "../assets/text_background.png");
    game.load.image("textPanel", "../assets/text_panel.png");
}

function create() {
    scaleWindow();
    showBackground();
    showMainMenu();
    setEventHandlers();
}

function update() {
    // TODO: write me!
}

// CHAT SYSTEM .... has evolved from chat only to jQuery
$(function(){
    var $window = $(window);
    var $playerNameInput = $(".playerNameInput");
    var $messages = $(".messages");
    var $inputMessage = $(".inputMessage");

    dialogDiv = $("#dialogDiv");
    dialogDiv.dialog({autoOpen : false, modal : false});
    loginPage = $(".loginPage");
    chatPage = $(".chatPage");
    loadGamePage = $("#loadGamePage");
    newGamePage = $("#newGamePage");
    gameDiv = $("#gameDiv");

    var connected = false;
    var typing = false;
    var lastTypingTime;
    var $currentInput = $playerNameInput.focus();

    function addParticipantsMessage (data) {
        var message = "";
        if (data.playerCount === 1) {
            message += "1 player in chat";
        } else {
            message += data.playerCount + " players in chat";
        }
        log(message);
    }

    function setPlayerName () {
        playerName = cleanInput($playerNameInput.val().trim());

        // If the username is valid
        if (playerName) {
            loginPage.fadeOut();
            gameDiv.show();
            chatPage.show();
            loginPage.off("click");
            loadGamePage.hide();

            // Tell the server your username
            socket.emit("addPlayer", playerName);
        }
    }

    function sendMessage () {
        var message = $inputMessage.val();
        // Prevent markup from being injected into the message
        message = cleanInput(message);
        // if there is a non-empty message and a socket connection
        if (message && connected) {
            $inputMessage.val("");
            addChatMessage({
                playerName: playerName,
                message: message
            });
            // tell server to execute 'new message' and send along one parameter
            socket.emit("newMessage", message);
        }
    }

    function log (message, options) {
        var $el = $("<li>").addClass("log").text(message);
        addMessageElement($el, options);
    }

    function addChatMessage (data, options) {
        // Don't fade the message in if there is an 'X was typing'
        var $typingMessages = getTypingMessages(data);
        options = options || {};
        if ($typingMessages.length !== 0) {
            options.fade = false;
            $typingMessages.remove();
        }

        var $playerNameDiv = $("<span class='playerName'/>")
            .text(data.playerName)
            .css("color", getPlayerNameColor(data.playerName));
        var $messageBodyDiv = $("<span class='messageBody'>")
            .text(data.message);

        var typingClass = data.typing ? "typing" : "";
        var $messageDiv = $("<li class='message'/>")
            .data("playerName", data.playerName)
            .addClass(typingClass)
            .append($playerNameDiv, $messageBodyDiv);

        addMessageElement($messageDiv, options);
    }

    function addChatTyping (data) {
        data.typing = true;
        data.message = "is typing";
        addChatMessage(data);
    }

    function removeChatTyping (data) {
        getTypingMessages(data).fadeOut(function () {
            $(this).remove();
        });
    }

    function addMessageElement (el, options) {
        var $el = $(el);

        // Setup default options
        if (!options) {
            options = {};
        }
        if (typeof options.fade === "undefined") {
            options.fade = true;
        }
        if (typeof options.prepend === "undefined") {
            options.prepend = false;
        }

        // Apply options
        if (options.fade) {
            $el.hide().fadeIn(FADE_TIME);
        }
        if (options.prepend) {
            $messages.prepend($el);
        } else {
            $messages.append($el);
        }
        $messages[0].scrollTop = $messages[0].scrollHeight;
    }

    function cleanInput (input) {
        return $("<div/>").text(input).text();
    }

    function updateTyping () {
        if (connected) {
            if (!typing) {
                typing = true;
                socket.emit("typing");
            }
            lastTypingTime = (new Date()).getTime();

            setTimeout(function () {
                var typingTimer = (new Date()).getTime();
                var timeDiff = typingTimer - lastTypingTime;
                if (timeDiff >= TYPING_TIMER_LENGTH && typing) {
                    socket.emit("stopTyping");
                    typing = false;
                }
            }, TYPING_TIMER_LENGTH);
        }
    }

    function getTypingMessages (data) {
        return $(".typing.message").filter(function() {
            return $(this).data("playerName") === data.playerName;
        });
    }

    function getPlayerNameColor (playerName) {
        var hash = 3;
        for (var i = 0; i < playerName.length; i++) {
            hash = playerName.charCodeAt(i) + (hash << 2); // shift char 2 bits to left
        }
        // Calculate color
        var index = Math.abs(hash % COLORS.length);
        return COLORS[index];
    }

    $("#createGame").click(function() {
        socket.emit("newGame", {
            player1: $("#player1Name").val(),
            player2: $("#player2Name").val(),
            player3: $("#player3Name").val(),
            player4: $("#player4Name").val(),
            player5: $("#player5Name").val(),
            player6: $("#player6Name").val()
        });
    });

    $("#loadGame").click(function() {
        socket.emit("loadGame", $("#gameId").val());
    });

    $window.keydown(function (event) {
        // When the client hits ENTER on their keyboard
        if (event.which === 13) {
            if (playerName) {
                sendMessage();
                socket.emit("stopTyping");
                typing = false;
            } else {
                setPlayerName();
            }
        }
    });

    $inputMessage.on("input", function() {
        updateTyping();
    });

    loginPage.click(function () {
        $currentInput.focus();
    });

    socket.on("login", function (data) {
        connected = true;
        // Display the welcome message
        var message = "Welcome to the Galactic Conquest Chat System– ";
        log(message, {
            prepend: true
        });
        addParticipantsMessage(data);
    });

    socket.on("newMessage", function (data) {
        addChatMessage(data);
    });

    socket.on("playerAdded", function (data) {
        log(data.playerName + " joined");
        addParticipantsMessage(data);
    });

    socket.on("playerLeft", function (data) {
        log(data.playerName + " left");
        addParticipantsMessage(data);
        removeChatTyping(data);
    });

    socket.on("typing", function (data) {
        addChatTyping(data);
    });

    socket.on("stopTyping", function (data) {
        removeChatTyping(data);
    });
});

// GAME LOGIC
function addTiles() {
    mapTiles = game.add.group();

    tile1_1 = mapTiles.create(row1StartWidth, row1StartHeight, "homeTile1");
    tile1_1.name = "Eridanus";
    tile1_2 = mapTiles.create(row1StartWidth + tileWidth, row1StartHeight, "openTile1");
    tile1_2.name = "Scorpius";
    tile1_3 = mapTiles.create(row1StartWidth + tileWidth * 2, row1StartHeight, "openTile1");
    tile1_3.name = "Cancer";
    tile1_4 = mapTiles.create(row1StartWidth + tileWidth * 3, row1StartHeight, "homeTile2");
    tile1_4.name = "Taurus";

    tile2_1 = mapTiles.create(row2StartWidth, row2StartHeight, "openTile1");
    tile2_1.name = "Lyra";
    tile2_2 = mapTiles.create(row2StartWidth + tileWidth, row2StartHeight, "hazardTile1");
    tile2_2.name = "Andromeda";
    tile2_3 = mapTiles.create(row2StartWidth + tileWidth * 2, row2StartHeight, "openTile2");
    tile2_3.name = "Virgo";
    tile2_4 = mapTiles.create(row2StartWidth + tileWidth * 3, row2StartHeight, "hazardTile1");
    tile2_4.name = "Corvus";
    tile2_5 = mapTiles.create(row2StartWidth + tileWidth * 4, row2StartHeight, "openTile1");
    tile2_5.name = "Ursa";

    tile3_1 = mapTiles.create(row3StartWidth, row3StartHeight, "openTile1");
    tile3_1.name = "Draco";
    tile3_2 = mapTiles.create(row3StartWidth + tileWidth, row3StartHeight, "openTile2");
    tile3_2.name = "Gemini";
    tile3_3 = mapTiles.create(row3StartWidth + tileWidth * 2, row3StartHeight, "openTile3");
    tile3_3.name = "Bootes";
    tile3_4 = mapTiles.create(row3StartWidth + tileWidth * 3, row3StartHeight, "openTile3");
    tile3_4.name = "Orion";
    tile3_5 = mapTiles.create(row3StartWidth + tileWidth * 4, row3StartHeight, "openTile2");
    tile3_5.name = "Hydra";
    tile3_6 = mapTiles.create(row3StartWidth + tileWidth * 5, row3StartHeight, "openTile1");
    tile3_6.name = "Canis";

    tile4_1 = mapTiles.create(row4StartWidth, row4StartHeight, "homeTile3");
    tile4_1.name = "Phoenix";
    tile4_2 = mapTiles.create(row4StartWidth + tileWidth, row4StartHeight, "hazardTile1");
    tile4_2.name = "Auriga";
    tile4_3 = mapTiles.create(row4StartWidth + tileWidth * 2, row4StartHeight, "openTile3");
    tile4_3.name = "Avalon";
    tile4_4 = mapTiles.create(row4StartWidth + tileWidth * 3, row4StartHeight, "centerTile");
    tile4_4.name = "Sol";
    tile4_5 = mapTiles.create(row4StartWidth + tileWidth * 4, row4StartHeight, "openTile3");
    tile4_5.name = "Pertinax";
    tile4_6 = mapTiles.create(row4StartWidth + tileWidth * 5, row4StartHeight, "hazardTile1");
    tile4_6.name = "Peelar";
    tile4_7 = mapTiles.create(row4StartWidth + tileWidth * 6, row4StartHeight, "homeTile4");
    tile4_7.name = "Aman";

    tile5_1 = mapTiles.create(row5StartWidth, row5StartHeight, "openTile1");
    tile5_1.name = "Choveer";
    tile5_2 = mapTiles.create(row5StartWidth + tileWidth, row5StartHeight, "openTile2");
    tile5_2.name = "Imdali";
    tile5_3 = mapTiles.create(row5StartWidth + tileWidth * 2, row5StartHeight, "openTile3");
    tile5_3.name = "Arawak";
    tile5_4 = mapTiles.create(row5StartWidth + tileWidth * 3, row5StartHeight, "openTile3");
    tile5_4.name = "Tiye";
    tile5_5 = mapTiles.create(row5StartWidth + tileWidth * 4, row5StartHeight, "openTile2");
    tile5_5.name = "Gordian";
    tile5_6 = mapTiles.create(row5StartWidth + tileWidth * 5, row5StartHeight, "openTile1");
    tile5_6.name = "Vitellius";

    tile6_1 = mapTiles.create(row6StartWidth, row6StartHeight, "openTile1");
    tile6_1.name = "Garion";
    tile6_2 = mapTiles.create(row6StartWidth + tileWidth, row6StartHeight, "hazardTile1");
    tile6_2.name = "Anteus";
    tile6_3 = mapTiles.create(row6StartWidth + tileWidth * 2, row6StartHeight, "openTile2");
    tile6_3.name = "Sarapis";
    tile6_4 = mapTiles.create(row6StartWidth + tileWidth * 3, row6StartHeight, "hazardTile1");
    tile6_4.name = "Caracalla";
    tile6_5 = mapTiles.create(row6StartWidth + tileWidth * 4, row6StartHeight, "openTile1");
    tile6_5.name = "Excalibur";

    tile7_1 = mapTiles.create(row7StartWidth, row7StartHeight, "homeTile5");
    tile7_1.name = "Numina";
    tile7_2 = mapTiles.create(row7StartWidth + tileWidth, row7StartHeight, "openTile1");
    tile7_2.name = "Ivaldi";
    tile7_3 = mapTiles.create(row7StartWidth + tileWidth * 2, row7StartHeight, "openTile1");
    tile7_3.name = "Blackrock";
    tile7_4 = mapTiles.create(row7StartWidth + tileWidth * 3, row7StartHeight, "homeTile6");
    tile7_4.name = "Catullus";

    mapTiles.forEach(function(tile) {
        tile.anchor.setTo(0.5, 0.5);
        tile.inputEnabled  = true;
        tile.events.onInputOver.add(overItemAnimation, this);
        tile.events.onInputOver.add(updatePlanet, this);
        tile.events.onInputOut.add(outItemAnimation, this);
        tile.events.onInputDown.add(selectTile, this);
    })
}

function displayGame() {
    removeMainMenu();
    setTimeout(addTiles, 500);
    setTimeout(showActivatePlanetPanel, 500);
    setTimeout(showEndTurnButton, 500);
    setTimeout(showPauseMenuButton, 500);
    setTimeout(showPlanetInfoPanel, 500);
    setTimeout(showPlayerTurnText, 500);
    setTimeout(showResourceText, 500);
    setTimeout(gameDiv.show(), 500);
}

function endTurn() {
    socket.emit("endTurn", playerName);
}

function gameOver(playerName) {
    dialogDiv.empty();
    dialogDiv.dialog("option", "title", "Game Finished");
    dialogDiv.append("<p>" + playerName + " won the game!</p>");
    setTimeout(dialogDiv.dialog("open"), 500);
}

function getCurrentResources() {
    socket.emit("getCurrentResources", playerName);
}

function getCurrentResourcesSuccess(data) {
    resources = data;
    updateResourceText(resources);
}

function loadGame() {
    setTimeout(gameDiv.hide(), 500);
    setTimeout(loadGamePage.fadeIn(), 500);
}

function loadGameSuccess(data) {
    dialogDiv.empty();
    dialogDiv.dialog("option", "title", "Game Loaded");
    dialogDiv.append("<p>GameId " + data.gameId + " successfully loaded</p>");
    dialogDiv.append("<p>Player names are:</p>");
    dialogDiv.append("<p>" + data.player1 + "</p>");
    dialogDiv.append("<p>" + data.player2 + "</p>");
    dialogDiv.append("<p>" + data.player3 + "</p>");
    dialogDiv.append("<p>" + data.player4 + "</p>");
    dialogDiv.append("<p>" + data.player5 + "</p>");
    dialogDiv.append("<p>" + data.player6 + "</p>");
    setTimeout(dialogDiv.dialog("open"), 500);
    displayGame();
    setTimeout(gameDiv.hide(), 500);
    setTimeout(loginPage.fadeIn(), 500);
}

function newGameSuccess(data) {
    playerName = data.player1;
    socket.emit("addPlayer", playerName);
    newGamePage.fadeOut();
    setTimeout(gameDiv.show(), 500);
    setTimeout(chatPage.show(), 500);
    dialogDiv.empty();
    dialogDiv.dialog("option", "title", "New Game Created");
    dialogDiv.append("<p>New game created with the following players:</p><p> " + data.player1 + "</p>");
    dialogDiv.append("<p>" + data.player2 + "</p>");
    dialogDiv.append("<p>" + data.player3 + "</p>");
    dialogDiv.append("<p>" + data.player4 + "</p>");
    dialogDiv.append("<p>" + data.player5 + "</p>");
    dialogDiv.append("<p>" + data.player6 + "</p>");
    dialogDiv.append("<p>Each player needs to use this GameId to load the game:</p><p>" + data.gameId + "</p>");
    dialogDiv.append("<p>You can find this GameId again by selecting Save Game from the menu</p>");
    setTimeout(dialogDiv.dialog("open"), 500);
    displayGame();
}

function outItemAnimation(item) {
    game.add.tween(item.scale).to({x: 1.0, y: 1.0}, 300, Phaser.Easing.Exponential.Out, true);
}

function overItemAnimation(item) {
    game.add.tween(item.scale).to({x: 1.1, y: 1.1}, 300, Phaser.Easing.Exponential.Out, true);
}

function removeMainMenu() {
    var tween = this.game.add.tween(this.mainMenuButtons.scale).to({x: 0.0, y: 1.0}, 500, Phaser.Easing.Exponential.In, true);
    tween.onComplete.add(function () {
        mainMenuButtons.destroy();
    });
}

function resumeGame() {
    mapTiles.inputEnabled = true;
    removeMainMenu();
    showPauseMenuButton();
}

function saveGame() {
    socket.emit("saveGame");
}

function saveGameSuccess(data) {
    dialogDiv.empty();
    dialogDiv.dialog("option", "title", "Game Saved");
    dialogDiv.append("<p>Game saved with GameId: " + data + "</p>");
    setTimeout(dialogDiv.dialog("open"), 500);
}

function scaleWindow() {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.minWidth = 240;
    game.scale.minHeight = 170;
    game.scale.maxWidth = 1600;
    game.scale.maxHeight = 900;
    game.scale.pageAlignHorizontally = true;
}

function selectTile(item) {
    socket.emit("selectTile", {
        planetName: item.name,
        playerName: playerName
    });
}

function selectTileSuccess(data) {
    dialogDiv.empty();
    dialogDiv.dialog("option", "title", "Activate Planet");
    if (data.activated === false) {
        dialogDiv.append("<p>Activate " + data.planetName + "?</p>");
        if (data.buildable === true) {
            dialogDiv.append("<p><input type='submit' id='buildShips' value='Build Ships Here'></p>");
        }
        else {
            dialogDiv.append("<p>Unable to build ships here.</p>");
        }
        dialogDiv.append("<p><input type='submit' id='sendShips' value='Send Ships Here'></p>");
    }
    else {
        dialogDiv.append("<p>Tile has already been activated.</p>")
    }

    dialogDiv.find("#buildShips").click(function() {
        buildShips(data.planetName)
    });
    dialogDiv.find("#sendShips").click(function() {
        sendShips(data.planetName)
    });
    dialogDiv.dialog("open");
}

function sendShips(planetName) {
    dialogDiv.empty();
    dialogDiv.dialog("option", "title", "Send ships to " + planetName);
    dialogDiv.append("<p>Send Ships from planet:<input type='text' id='sourcePlanet'></p>");
    dialogDiv.append("<p>Quantity of fighters:<input type='number' id='fighters' min='0' value='0'></p>");
    dialogDiv.append("<p>Quantity of destroyers:<input type='number' id='destroyers' min='0' value='0'></p>");
    dialogDiv.append("<p>Quantity of dreadnoughts:<input type='number' id='dreadnoughts' min='0' value='0'></p>");
    dialogDiv.append("<p><input type='submit' id='send' value='Send Ships'></p>");

    dialogDiv.find("#send").click(function() {
        socket.emit("sendShips", {
            playerName: playerName,
            targetPlanet: planetName,
            sourcePlanet: dialogDiv.find("#sourcePlanet").val(),
            fighters: dialogDiv.find("#fighters").val(),
            destroyers: dialogDiv.find("#destroyers").val(),
            dreadnoughts: dialogDiv.find("#dreadnoughts").val()
        });

        dialogDiv.find("#send").hide();
    });
}

function sendShipsSuccess(response) {
    if (response !== "Success") {
        dialogDiv.empty();
        dialogDiv.dialog("option", "title", "Unable to send ships");
        dialogDiv.append("<p>" + response + "</p>");
        dialogDiv.dialog("open");
    }
    else {
        dialogDiv.empty();
        dialogDiv.dialog("option", "title", "Send ships success!");
        dialogDiv.append("<p>Ships sent successfully! System has now been activated.</p>");
        dialogDiv.dialog("open");
    }
}

function buildShips(planetName) {
    dialogDiv.empty();
    dialogDiv.dialog("option", "title", "Build Ships at " + planetName);
    dialogDiv.append("<p>" + resources + " resources available for construction" + "</p>");
    dialogDiv.append("<p>Quantity of fighters:<input type='number' id='fighters' min='0' value='0'></p>");
    dialogDiv.append("<p>Quantity of destroyers:<input type='number' id='destroyers' min='0' value='0'></p>");
    dialogDiv.append("<p>Quantity of dreadnoughts:<input type='number' id='dreadnoughts' min='0' value='0'></p>");
    dialogDiv.append("<p><input type='submit' id='build' value='Build Ships'></p>");

    dialogDiv.find("#build").click(function() {
        socket.emit("buildShips", {
            playerName: playerName,
            planetName: planetName,
            fighters: dialogDiv.find("#fighters").val(),
            destroyers: dialogDiv.find("#destroyers").val(),
            dreadnoughts: dialogDiv.find("#dreadnoughts").val()
        });

        dialogDiv.find("#build").hide();
    });
}

function buildShipsSuccess(response) {
    if (response !== "Success") {
        dialogDiv.empty();
        dialogDiv.dialog("option", "title", "Unable to build ships");
        dialogDiv.append("<p>" + response + "</p>");
        dialogDiv.dialog("open");
    }
    else {
        dialogDiv.empty();
        dialogDiv.dialog("option", "title", "Build ship success!");
        dialogDiv.append("<p>Ships built successfully! System has now been activated.</p>");
        dialogDiv.dialog("open");
    }
    getCurrentResources();
}

function setEventHandlers() {
    socket.on("buildShipsSuccess", buildShipsSuccess);
    socket.on("gameOver", gameOver);
    socket.on("getCurrentResourcesSuccess", getCurrentResourcesSuccess);
    socket.on("loadGameSuccess", loadGameSuccess);
    socket.on("newGameSuccess", newGameSuccess);
    socket.on("saveGameSuccess", saveGameSuccess);
    socket.on("sendShipsSuccess", sendShipsSuccess);
    socket.on("selectTileSuccess", selectTileSuccess);
    socket.on("startTurn", startTurn);
    socket.on("updatePlanetSuccess", updatePlanetSuccess);
    socket.on("updateTurnSuccess", updateTurnSuccess);
}

function showActivatePlanetPanel() {
    activatePlanetTextPanel = game.add.sprite(1280, 145, "textPanel");
    activateSystemText = game.add.text(1290, 150, "Click to Activate", { font: "30px Arial"});
    activateSystemPlanetText = game.add.text(1290, 180, "Tile: ", { font: "30px Arial"});
    buildableSystemText = game.add.text(1290, 210, "Can Build? ", { font: "30px Arial"});
    sendableSystemText = game.add.text(1290, 240, "Can Send? ", { font: "30px Arial"});
}

function showBackground() {
    this.background = game.add.sprite(0, 0, "background");
}

function showEndTurnButton() {
    endTurnButton = game.add.sprite(1160, 775, "textBackground");
    endTurnButtonText = game.add.text(1170, 800, "End Turn", {font: "40px Arial"});
    endTurnButton.inputEnabled = true;
    endTurnButton.events.onInputOver.add(overItemAnimation, this);
    endTurnButton.events.onInputOut.add(outItemAnimation, this);
    endTurnButton.events.onInputDown.add(endTurn);
}

function showMainMenu() {
    mainMenuButtons = game.add.group();

    newGameButton = mainMenuButtons.create(gameWidth/2, gameHeight * 0.2, "newGameButton");
    newGameButton.events.onInputDown.add(startNewGame);

    saveGameButton = mainMenuButtons.create(gameWidth/2, gameHeight * 0.4, "saveGameButton");
    saveGameButton.events.onInputDown.add(saveGame);

    loadGameButton = mainMenuButtons.create(gameWidth/2, gameHeight * 0.6, "loadGameButton");
    loadGameButton.events.onInputDown.add(loadGame);

    tutorialButton = mainMenuButtons.create(gameWidth/2, gameHeight * 0.8, "tutorialButton");
    tutorialButton.events.onInputDown.add(startTutorial);

    mainMenuButtons.forEach(function(menuButton) {
        menuButton.anchor.setTo(0.5, 0.5);
        menuButton.inputEnabled  = true;
        menuButton.events.onInputOver.add(overItemAnimation, this);
        menuButton.events.onInputOut.add(outItemAnimation, this);
    })
}

function showPauseMenu() {
    menuButton.destroy();
    menuButtonText.destroy();
    mapTiles.inputEnabled = false;

    mainMenuButtons = game.add.group();

    resumeGameButton = mainMenuButtons.create(gameWidth/2, gameHeight * 0.2, "resumeButton");
    resumeGameButton.events.onInputDown.add(resumeGame);

    saveGameButton = mainMenuButtons.create(gameWidth/2, gameHeight * 0.4, "saveGameButton");
    saveGameButton.events.onInputDown.add(saveGame);

    loadGameButton = mainMenuButtons.create(gameWidth/2, gameHeight * 0.6, "loadGameButton");
    //loadGameButton.events.onInputDown.add(loadGame);

    tutorialButton = mainMenuButtons.create(gameWidth/2, gameHeight * 0.8, "tutorialButton");
    tutorialButton.events.onInputDown.add(startTutorial);

    mainMenuButtons.forEach(function(menuButton) {
        menuButton.anchor.setTo(0.5, 0.5);
        menuButton.inputEnabled  = true;
        menuButton.events.onInputOver.add(overItemAnimation, this);
        menuButton.events.onInputOut.add(outItemAnimation, this);
    })
}

function showPauseMenuButton() {
    menuButton = game.add.sprite(40, 775, "textBackground");
    menuButtonText = game.add.text(50, 800, "Menu", {font: "40px Arial"});
    menuButton.inputEnabled = true;
    menuButton.events.onInputOver.add(overItemAnimation, this);
    menuButton.events.onInputOut.add(outItemAnimation, this);
    menuButton.events.onInputDown.add(showPauseMenu);
}

function showPlanetInfoPanel() {
    planetInfoTextPanel = game.add.sprite(40, 145, "textPanel");
    planetOwnerText = game.add.text(50, 150, "Owner:", { font: "30px Arial"});
    fighterCountText = game.add.text(50, 180, "Fighters:", { font: "30px Arial"});
    destroyerCountText = game.add.text(50, 210, "Destroyers:", { font: "30px Arial"});
    dreadnoughtCountText = game.add.text(50, 240, "Dreadnoughts:", { font: "30px Arial"});
}

function showPlayerTurnText() {
    playerTextBackground = game.add.sprite(1160, 25, "textBackground");
    playerTurnText = game.add.text(1170, 50, " ", {font: "40px Arial"});
    //playerTurnText.anchor.set(0.5);
    playerTurnText.inputEnabled = true;
    socket.emit("updateTurn");
}

function showResourceText() {
    resourceTextBackground = game.add.sprite(40, 25, "textBackground");
    resourceTextBackground.inputEnabled = true;
    resourceTextBackground.events.onInputOver.add(getCurrentResources);
    resourceText = game.add.text(50, 50, "Resources: ", { font: "40px Arial"});
    resourceText.inputEnabled = true;
    resourceText.events.onInputOver.add(getCurrentResources);
}

function startNewGame() {
    setTimeout(gameDiv.hide(), 500);
    setTimeout(newGamePage.fadeIn(), 500);
}

function startTurn(data) {
    if (data === playerName) {
        getCurrentResources();
        dialogDiv.empty();
        dialogDiv.dialog("option", "title", "Your Turn!");
        dialogDiv.append("<p>Its your turn!</p>");
        dialogDiv.dialog("open");
    }
    updateTurn();
}

function startTutorial() {
    //removeMainMenu();
    // TODO: write me!
}

function updatePlanet(item) {
    socket.emit("updatePlanet", item.name);
    getCurrentResources();
}

function updatePlanetSuccess(data) {
    planetOwnerText.setText("Owner: " + data.ownerName);
    fighterCountText.setText("Fighters: " + data.fighters);
    destroyerCountText.setText("Destroyers: " + data.destroyers);
    dreadnoughtCountText.setText("Dreadnoughts: " + data.dreadnoughts);
    activateSystemPlanetText.setText("Tile: " + data.planetName);
    buildableSystemText.setText("Can Build? " + data.buildable);
    sendableSystemText.setText("Can Send? " + data.sendable);
}

function updateResourceText(resources) {
    resourceText.text = "Resources: " + resources;
}

function updateTurn() {
    socket.emit("updateTurn");
}

function updateTurnSuccess(data) {
    playerTurnText.setText(data + "'s turn");
}