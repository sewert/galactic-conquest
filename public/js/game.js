var gameHeight = 768;
var gameWidth = 1024;
var game = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO, "game", { preload: preload, create: create, update: update });

function preload() {
    game.load.image("background", "../assets/backgrounds/SpaceBackground-2.jpg");
    game.load.image("newGameButton", "../assets/buttons/newGame_raised.png");
    game.load.image("saveGameButton", "../assets/buttons/saveGame_raised.png");
    game.load.image("loadGameButton", "../assets/buttons/loadGame_raised.png");
    game.load.image("tutorialButton", "../assets/buttons/tutorial_raised.png");
}

function create() {
    this.background = game.add.sprite(0, 0, "background");

    showMenu();
}

function showMenu() {
    mainMenuButtons = game.add.group();

    newButton = mainMenuButtons.create(gameWidth/2, 184, "newGameButton");
    newButton.anchor.setTo(0.5, 0.5);
    newButton.inputEnabled = true;
    newButton.events.onInputUp.add(startNewGame);

    newButton = mainMenuButtons.create(gameWidth/2, 294, "saveGameButton");
    newButton.anchor.setTo(0.5, 0.5);
    newButton.inputEnabled = true;
    newButton.events.onInputUp.add(saveGame);

    newButton = mainMenuButtons.create(gameWidth/2, 404, "loadGameButton");
    newButton.anchor.setTo(0.5, 0.5);
    newButton.inputEnabled = true;
    newButton.events.onInputUp.add(loadGame);

    newButton = mainMenuButtons.create(gameWidth/2, 514, "tutorialButton");
    newButton.anchor.setTo(0.5, 0.5);
    newButton.inputEnabled = true;
    newButton.events.onInputUp.add(startTutorial);
}

function startNewGame() {
    removeMainMenu();
    // TODO: write me!
}

function removeMainMenu() {
    mainMenuButtons.destroy();
}

function saveGame() {
     // TODO: write me!
}

function loadGame() {
    // TODO: write me!
}

function startTutorial() {
    // TODO: write me!
}

function update() {
    // TODO: write me!
}