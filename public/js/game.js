var playerName;
var gameHeight = 900;
var gameWidth = 1600;
var tileHeight = 160;
var tileWidth = 160;
var tileWidthSpacing = 80;
var tileHeightSpacing = 120;
var tileRowStartWidth = 560;
var tileRowStartHeight = 90;
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
var color1 = "#00D000";
var color2 = "D00076";
var color3 = "FF7400";
var game = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO, "gameDiv", { preload: preload, create: create, update: update });

function preload() {
    game.load.image("background", "../assets/backgrounds/SpaceBackground-2.jpg");
    game.load.image("newGameButton", "../assets/buttons/newGame_raised.png");
    game.load.image("saveGameButton", "../assets/buttons/saveGame_raised.png");
    game.load.image("loadGameButton", "../assets/buttons/loadGame_raised.png");
    game.load.image("tutorialButton", "../assets/buttons/tutorial_raised.png");
    game.load.image("menuButton", "../assets/buttons/menu_raised.png");
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
}

function create() {
    scaleWindow();
    showBackground();
    showMainMenu();
}

function scaleWindow() {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.minWidth = 240;
    game.scale.minHeight = 170;
    game.scale.maxWidth = 2880;
    game.scale.maxHeight = 1920;
    game.scale.pageAlignHorizontally = true;
}

function showBackground() {
    this.background = game.add.sprite(0, 0, "background");
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
    mapTiles.inputEnabled = false;

    mainMenuButtons = game.add.group();

    resumeGameButton = mainMenuButtons.create(gameWidth/2, gameHeight * 0.2, "resumeButton");
    resumeGameButton.events.onInputDown.add(resumeGame);

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

function resumeGame() {
    mapTiles.inputEnabled = true;
    removeMainMenu();
    showPauseMenuButton();
}

function startNewGame() {
    removeMainMenu();
    setTimeout(showResourceText, 500);
    setTimeout(showPlayerTurnText, 500);
    setTimeout(addTiles, 500);
    setTimeout(showPauseMenuButton, 500);
    // TODO: write me!
}

function showResourceText() {
    resourceTextBackground = game.add.sprite(40, 25, "textBackground");
    resources = 0;
    resourceText = game.add.text(90, 45, "Resources: " + resources, { font: "50px Arial"});
    //resourceText.anchor.set(0.5);
    resourceText.inputEnabled = true;
    //resourceText.input.enableDrag();
    resourceText.events.onInputDown.add(incrementResources, this);
}

function showPlayerTurnText() {
    playerTextBackground = game.add.sprite(1160, 25, "textBackground");
    playerTurnText = game.add.text(1210, 45, "'s Turn", {font: "50px Arial"});
    //playerTurnText.anchor.set(0.5);
    playerTurnText.inputEnabled = true;
}

function showPauseMenuButton() {
    menuButton = game.add.sprite(1360, 775, "menuButton");
    menuButton.inputEnabled = true;
    menuButton.events.onInputOver.add(overItemAnimation, this);
    menuButton.events.onInputOut.add(outItemAnimation, this);
    menuButton.events.onInputDown.add(showPauseMenu);
}

function incrementResources(item) {
    resources++;
    item.text = "Resources: " + resources;
}

function addTiles() {
    mapTiles = game.add.group();

    tile1_1 = mapTiles.create(row1StartWidth, row1StartHeight, "homeTile1");
    tile1_1.name = "tile1_1";
    tile1_2 = mapTiles.create(row1StartWidth + tileWidth, row1StartHeight, "openTile1");
    tile1_2.name = "tile1_2";
    tile1_3 = mapTiles.create(row1StartWidth + tileWidth * 2, row1StartHeight, "openTile1");
    tile1_3.name = "tile1_3";
    tile1_4 = mapTiles.create(row1StartWidth + tileWidth * 3, row1StartHeight, "homeTile2");
    tile1_4.name = "tile1_4";

    tile2_1 = mapTiles.create(row2StartWidth, row2StartHeight, "openTile1");
    tile2_1.name = "tile2_1";
    tile2_2 = mapTiles.create(row2StartWidth + tileWidth, row2StartHeight, "hazardTile1");
    tile2_2.name = "tile2_2";
    tile2_3 = mapTiles.create(row2StartWidth + tileWidth * 2, row2StartHeight, "openTile2");
    tile2_3.name = "tile2_3";
    tile2_4 = mapTiles.create(row2StartWidth + tileWidth * 3, row2StartHeight, "hazardTile1");
    tile2_4.name = "tile2_4";
    tile2_5 = mapTiles.create(row2StartWidth + tileWidth * 4, row2StartHeight, "openTile1");
    tile2_5.name = "tile2_5";

    tile3_1 = mapTiles.create(row3StartWidth, row3StartHeight, "openTile1");
    tile3_1.name = "tile3_1";
    tile3_2 = mapTiles.create(row3StartWidth + tileWidth, row3StartHeight, "openTile2");
    tile3_2.name = "tile3_2";
    tile3_3 = mapTiles.create(row3StartWidth + tileWidth * 2, row3StartHeight, "openTile3");
    tile3_3.name = "tile3_3";
    tile3_4 = mapTiles.create(row3StartWidth + tileWidth * 3, row3StartHeight, "openTile3");
    tile3_4.name = "tile3_4";
    tile3_5 = mapTiles.create(row3StartWidth + tileWidth * 4, row3StartHeight, "openTile2");
    tile3_5.name = "tile3_5";
    tile3_6 = mapTiles.create(row3StartWidth + tileWidth * 5, row3StartHeight, "openTile1");
    tile3_6.name = "tile3_6";

    tile4_1 = mapTiles.create(row4StartWidth, row4StartHeight, "homeTile3");
    tile4_1.name = "tile4_1";
    tile4_2 = mapTiles.create(row4StartWidth + tileWidth, row4StartHeight, "hazardTile1");
    tile4_2.name = "tile4_2";
    tile4_3 = mapTiles.create(row4StartWidth + tileWidth * 2, row4StartHeight, "openTile3");
    tile4_3.name = "tile4_3";
    tile4_4 = mapTiles.create(row4StartWidth + tileWidth * 3, row4StartHeight, "centerTile");
    tile4_4.name = "tile4_4";
    tile4_5 = mapTiles.create(row4StartWidth + tileWidth * 4, row4StartHeight, "openTile3");
    tile4_5.name = "tile4_5";
    tile4_6 = mapTiles.create(row4StartWidth + tileWidth * 5, row4StartHeight, "hazardTile1");
    tile4_6.name = "tile4_6";
    tile4_7 = mapTiles.create(row4StartWidth + tileWidth * 6, row4StartHeight, "homeTile4");
    tile4_7.name = "tile4_7";

    tile5_1 = mapTiles.create(row5StartWidth, row5StartHeight, "openTile1");
    tile5_1.name = "tile5_1";
    tile5_2 = mapTiles.create(row5StartWidth + tileWidth, row5StartHeight, "openTile2");
    tile5_2.name = "tile5_2";
    tile5_3 = mapTiles.create(row5StartWidth + tileWidth * 2, row5StartHeight, "openTile3");
    tile5_3.name = "tile5_3";
    tile5_4 = mapTiles.create(row5StartWidth + tileWidth * 3, row5StartHeight, "openTile3");
    tile5_4.name = "tile5_4";
    tile5_5 = mapTiles.create(row5StartWidth + tileWidth * 4, row5StartHeight, "openTile2");
    tile5_5.name = "tile5_5";
    tile5_6 = mapTiles.create(row5StartWidth + tileWidth * 5, row5StartHeight, "openTile1");
    tile5_6.name = "tile5_6";

    tile6_1 = mapTiles.create(row6StartWidth, row6StartHeight, "openTile1");
    tile6_1.name = "tile6_1";
    tile6_2 = mapTiles.create(row6StartWidth + tileWidth, row6StartHeight, "hazardTile1");
    tile6_2.name = "tile6_2";
    tile6_3 = mapTiles.create(row6StartWidth + tileWidth * 2, row6StartHeight, "openTile2");
    tile6_3.name = "tile6_3";
    tile6_4 = mapTiles.create(row6StartWidth + tileWidth * 3, row6StartHeight, "hazardTile1");
    tile6_4.name = "tile6_4";
    tile6_5 = mapTiles.create(row6StartWidth + tileWidth * 4, row6StartHeight, "openTile1");
    tile6_5.name = "tile6_5";

    tile7_1 = mapTiles.create(row7StartWidth, row7StartHeight, "homeTile5");
    tile7_1.name = "tile7_1";
    tile7_2 = mapTiles.create(row7StartWidth + tileWidth, row7StartHeight, "openTile1");
    tile7_2.name = "tile7_2";
    tile7_3 = mapTiles.create(row7StartWidth + tileWidth * 2, row7StartHeight, "openTile1");
    tile7_3.name = "tile7_3";
    tile7_4 = mapTiles.create(row7StartWidth + tileWidth * 3, row7StartHeight, "homeTile6");
    tile7_4.name = "tile7_4";

    mapTiles.forEach(function(tile) {
        tile.anchor.setTo(0.5, 0.5);
        tile.inputEnabled  = true;
        tile.events.onInputOver.add(overItemAnimation, this);
        tile.events.onInputOut.add(outItemAnimation, this);
        tile.events.onInputDown.add(selectTile, this);
    })
}

function overItemAnimation(item) {
    game.add.tween(item.scale).to({x: 1.1, y: 1.1}, 300, Phaser.Easing.Exponential.Out, true);
}

function outItemAnimation(item) {
    game.add.tween(item.scale).to({x: 1.0, y: 1.0}, 300, Phaser.Easing.Exponential.Out, true);
}

function selectTile(item) {
    // TODO: write me!
    alert(item.name + " selected");
}

function removeMainMenu() {
    var tween = this.game.add.tween(this.mainMenuButtons.scale).to({x: 0.0, y: 1.0}, 500, Phaser.Easing.Exponential.In, true);
    tween.onComplete.add(function () {
        mainMenuButtons.destroy();
    });
}

function saveGame() {
     // TODO: write me!
}

function loadGame() {
    // TODO: write me!
}

function startTutorial() {
    //removeMainMenu();
    // TODO: write me!
}

function update() {
    // TODO: write me!
}

// chat system
// https://github.com/socketio/socket.io/tree/master/examples/chat
// TODO: attempt to convert to Angular (project was originally planned to be completed in Angular... but tutorials for necessary features were better in jQuery)
$(function(){
    var FADE_TIME = 150;
    var TYPING_TIMER_LENGTH = 400;
    var COLORS = [
        '#e21400', '#91580f', '#f8a700', '#f78b00',
        '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
        '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
    ]; // TODO: update colors

    var $window = $(window);
    var $playerNameInput = $(".playerNameInput");
    var $messages = $(".messages");
    var $inputMessage = $(".inputMessage");

    var $loginPage = $(".loginPage");
    var $chatPage = $(".chatPage");
    var $gameDiv = $("#gameDiv");

    var connected = false;
    var typing = false;
    var lastTypingTime;
    var $currentInput = $playerNameInput.focus();

    var socket = io();

    function addParticipantsMessage (data) {
        var message = '';
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
            $loginPage.fadeOut();
            $gameDiv.show();
            $chatPage.show();
            $loginPage.off('click');

            // Tell the server your username
            socket.emit('addPlayer', playerName);
        }
    }

    function sendMessage () {
        var message = $inputMessage.val();
        // Prevent markup from being injected into the message
        message = cleanInput(message);
        // if there is a non-empty message and a socket connection
        if (message && connected) {
            $inputMessage.val('');
            addChatMessage({
                playerName: playerName,
                message: message
            });
            // tell server to execute 'new message' and send along one parameter
            socket.emit('newMessage', message);
        }
    }

    function log (message, options) {
        var $el = $('<li>').addClass('log').text(message);
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

        var $playerNameDiv = $('<span class="playerName"/>')
            .text(data.playerName)
            .css('color', getPlayerNameColor(data.playerName));
        var $messageBodyDiv = $('<span class="messageBody">')
            .text(data.message);

        var typingClass = data.typing ? 'typing' : '';
        var $messageDiv = $('<li class="message"/>')
            .data('playerName', data.playerName)
            .addClass(typingClass)
            .append($playerNameDiv, $messageBodyDiv);

        addMessageElement($messageDiv, options);
    }

    function addChatTyping (data) {
        data.typing = true;
        data.message = 'is typing';
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
        if (typeof options.fade === 'undefined') {
            options.fade = true;
        }
        if (typeof options.prepend === 'undefined') {
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
        return $('<div/>').text(input).text();
    }

    function updateTyping () {
        if (connected) {
            if (!typing) {
                typing = true;
                socket.emit('typing');
            }
            lastTypingTime = (new Date()).getTime();

            setTimeout(function () {
                var typingTimer = (new Date()).getTime();
                var timeDiff = typingTimer - lastTypingTime;
                if (timeDiff >= TYPING_TIMER_LENGTH && typing) {
                    socket.emit('stopTyping');
                    typing = false;
                }
            }, TYPING_TIMER_LENGTH);
        }
    }

    function getTypingMessages (data) {
        return $('.typing.message').filter(function (i) {
            return $(this).data('playerName') === data.playerName;
        });
    }

    function getPlayerNameColor (playerName) {
        // Compute hash code
        var hash = 7;
        for (var i = 0; i < playerName.length; i++) {
            hash = playerName.charCodeAt(i) + (hash << 5) - hash;
        }
        // Calculate color
        var index = Math.abs(hash % COLORS.length);
        return COLORS[index];
    }

    $window.keydown(function (event) {
        // When the client hits ENTER on their keyboard
        if (event.which === 13) {
            if (playerName) {
                sendMessage();
                socket.emit('stopTyping');
                typing = false;
            } else {
                setPlayerName();
            }
        }
    });

    $inputMessage.on('input', function() {
        updateTyping();
    });

    $loginPage.click(function () {
        $currentInput.focus();
    });

    socket.on('login', function (data) {
        connected = true;
        // Display the welcome message
        var message = "Welcome to the Galactic Conquest Chat System– ";
        log(message, {
            prepend: true
        });
        addParticipantsMessage(data);
    });

    socket.on('newMessage', function (data) {
        addChatMessage(data);
    });

    socket.on('playerAdded', function (data) {
        log(data.playerName + ' joined');
        addParticipantsMessage(data);
    });

    socket.on('playerLeft', function (data) {
        log(data.playerName + ' left');
        addParticipantsMessage(data);
        removeChatTyping(data);
    });

    socket.on('typing', function (data) {
        addChatTyping(data);
    });

    socket.on('stopTyping', function (data) {
        removeChatTyping(data);
    });
});