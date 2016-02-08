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

    newGameButton = mainMenuButtons.create(gameWidth/2, 184, "newGameButton");
    newGameButton.anchor.setTo(0.5, 0.5);
    newGameButton.inputEnabled = true;
    newGameButton.events.onInputOver.add(overNewGameButton, this);
    newGameButton.events.onInputOut.add(outNewGameButton, this);
    newGameButton.events.onInputUp.add(startNewGame);

    saveGameButton = mainMenuButtons.create(gameWidth/2, 304, "saveGameButton");
    saveGameButton.anchor.setTo(0.5, 0.5);
    saveGameButton.inputEnabled = true;
    saveGameButton.events.onInputOver.add(overSaveGameButton, this);
    saveGameButton.events.onInputOut.add(outSaveGameButton, this);
    saveGameButton.events.onInputUp.add(saveGame);

    loadGameButton = mainMenuButtons.create(gameWidth/2, 424, "loadGameButton");
    loadGameButton.anchor.setTo(0.5, 0.5);
    loadGameButton.inputEnabled = true;
    loadGameButton.events.onInputOver.add(overLoadGameButton, this);
    loadGameButton.events.onInputOut.add(outLoadGameButton, this);
    loadGameButton.events.onInputUp.add(loadGame);

    tutorialButton = mainMenuButtons.create(gameWidth/2, 544, "tutorialButton");
    tutorialButton.anchor.setTo(0.5, 0.5);
    tutorialButton.inputEnabled = true;
    tutorialButton.events.onInputOver.add(overTutorialButton, this);
    tutorialButton.events.onInputOut.add(outTutorialButton, this);
    tutorialButton.events.onInputUp.add(startTutorial);
}

function overNewGameButton() {
    this.game.add.tween(this.newGameButton.scale).to({x: 1.1, y: 1.1}, 300, Phaser.Easing.Exponential.Out, true);
}

function outNewGameButton() {
    this.game.add.tween(this.newGameButton.scale).to({x: 1.0, y: 1.0}, 300, Phaser.Easing.Exponential.Out, true);
}

function overSaveGameButton() {
    this.game.add.tween(this.saveGameButton.scale).to({x: 1.1, y: 1.1}, 300, Phaser.Easing.Exponential.Out, true);
}

function outSaveGameButton() {
    this.game.add.tween(this.saveGameButton.scale).to({x: 1.0, y: 1.0}, 300, Phaser.Easing.Exponential.Out, true);
}

function overLoadGameButton() {
    this.game.add.tween(this.loadGameButton.scale).to({x: 1.1, y: 1.1}, 300, Phaser.Easing.Exponential.Out, true);
}

function outLoadGameButton() {
    this.game.add.tween(this.loadGameButton.scale).to({x: 1.0, y: 1.0}, 300, Phaser.Easing.Exponential.Out, true);
}

function overTutorialButton() {
    this.game.add.tween(this.tutorialButton.scale).to({x: 1.1, y: 1.1}, 300, Phaser.Easing.Exponential.Out, true);
}

function outTutorialButton() {
    this.game.add.tween(this.tutorialButton.scale).to({x: 1.0, y: 1.0}, 300, Phaser.Easing.Exponential.Out, true);
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