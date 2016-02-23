var gameHeight = 900;
var gameWidth = 1600;
var tileHeight = 160;
var tileWidth = 160;
var row1StartWidth = 600;
var row1StartHeight = 150;
var row2StartWidth = 520;
var row2StartHeight = 270;
var row3StartWidth = 440;
var row3StartHeight = 390;
var color1 = "#00D000";
var color2 = "D00076";
var color3 = "FF7400";
var game = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO, "game", { preload: preload, create: create, update: update });

function preload() {
    game.load.image("background", "../assets/backgrounds/SpaceBackground-2.jpg");
    game.load.image("newGameButton", "../assets/buttons/newGame_raised.png");
    game.load.image("saveGameButton", "../assets/buttons/saveGame_raised.png");
    game.load.image("loadGameButton", "../assets/buttons/loadGame_raised.png");
    game.load.image("tutorialButton", "../assets/buttons/tutorial_raised.png");
    game.load.image("tile", "../assets/tiles/purpleTile.png")
}

function create() {
    scaleWindow();
    showBackground();
    showMenu();
}

function scaleWindow() {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.minWidth = 240;
    game.scale.minHeight = 170;
    game.scale.maxWidth = 2880;
    game.scale.maxHeight = 1920;

    //have the game centered horizontally
    game.scale.pageAlignHorizontally = true;
}

function showBackground() {
    this.background = game.add.sprite(0, 0, "background");
}

function showMenu() {
    mainMenuButtons = game.add.group();

    newGameButton = mainMenuButtons.create(gameWidth/2, gameHeight * 0.2, "newGameButton");
    newGameButton.anchor.setTo(0.5, 0.5);
    newGameButton.inputEnabled = true;
    newGameButton.events.onInputOver.add(overNewGameButton, this);
    newGameButton.events.onInputOut.add(outNewGameButton, this);
    newGameButton.events.onInputUp.add(startNewGame);

    saveGameButton = mainMenuButtons.create(gameWidth/2, gameHeight * 0.4, "saveGameButton");
    saveGameButton.anchor.setTo(0.5, 0.5);
    saveGameButton.inputEnabled = true;
    saveGameButton.events.onInputOver.add(overSaveGameButton, this);
    saveGameButton.events.onInputOut.add(outSaveGameButton, this);
    saveGameButton.events.onInputUp.add(saveGame);

    loadGameButton = mainMenuButtons.create(gameWidth/2, gameHeight * 0.6, "loadGameButton");
    loadGameButton.anchor.setTo(0.5, 0.5);
    loadGameButton.inputEnabled = true;
    loadGameButton.events.onInputOver.add(overLoadGameButton, this);
    loadGameButton.events.onInputOut.add(outLoadGameButton, this);
    loadGameButton.events.onInputUp.add(loadGame);

    tutorialButton = mainMenuButtons.create(gameWidth/2, gameHeight * 0.8, "tutorialButton");
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
    showResourceText();
    addTiles();
    // TODO: write me!
}

function showResourceText() {
    resources = 0;
    resourceText = game.add.text(300, 50, "Available Resources: " + resources, { font: "bold 32px Arial", fill: color1});
    resourceText.anchor.set(0.5);
    resourceText.inputEnabled = true;
    //resourceText.input.enableDrag();
    resourceText.events.onInputDown.add(incrementResources, this);
}

function incrementResources(item) {
    resources++;
    item.text = "Available Resources: " + resources;
}

function addTiles() {
    mapTiles = game.add.group();

    tile1_1 = mapTiles.create(row1StartWidth, row1StartHeight, "tile");
    tile1_1.anchor.setTo(0.5, 0.5);
    tile1_1.inputEnabled = true;
    tile1_1.events.onInputOver.add(overNewGameButton, this);
    tile1_1.events.onInputOut.add(outNewGameButton, this);
    tile1_1.events.onInputUp.add(startNewGame);

    tile1_2 = mapTiles.create(row1StartWidth + tileWidth, row1StartHeight, "tile");
    tile1_2.anchor.setTo(0.5, 0.5);
    tile1_2.inputEnabled = true;
    tile1_2.events.onInputOver.add(overSaveGameButton, this);
    tile1_2.events.onInputOut.add(outSaveGameButton, this);
    tile1_2.events.onInputUp.add(saveGame);

    tile1_3 = mapTiles.create(row1StartWidth + tileWidth * 2, row1StartHeight, "tile");
    tile1_3.anchor.setTo(0.5, 0.5);
    tile1_3.inputEnabled = true;
    tile1_3.events.onInputOver.add(overLoadGameButton, this);
    tile1_3.events.onInputOut.add(outLoadGameButton, this);
    tile1_3.events.onInputUp.add(loadGame);

    tile1_4 = mapTiles.create(row1StartWidth + tileWidth * 3, row1StartHeight, "tile");
    tile1_4.anchor.setTo(0.5, 0.5);
    tile1_4.inputEnabled = true;
    tile1_4.events.onInputOver.add(overTutorialButton, this);
    tile1_4.events.onInputOut.add(outTutorialButton, this);
    tile1_4.events.onInputUp.add(startTutorial);

    tile2_1 = mapTiles.create(row2StartWidth, row2StartHeight, "tile");
    tile2_1.anchor.setTo(0.5, 0.5);
    tile2_1.inputEnabled = true;
    tile2_1.events.onInputOver.add(overNewGameButton, this);
    tile2_1.events.onInputOut.add(outNewGameButton, this);
    tile2_1.events.onInputUp.add(startNewGame);

    tile2_2 = mapTiles.create(row2StartWidth + tileWidth, row2StartHeight, "tile");
    tile2_2.anchor.setTo(0.5, 0.5);
    tile2_2.inputEnabled = true;
    tile2_2.events.onInputOver.add(overSaveGameButton, this);
    tile2_2.events.onInputOut.add(outSaveGameButton, this);
    tile2_2.events.onInputUp.add(saveGame);

    tile2_3 = mapTiles.create(row2StartWidth + tileWidth * 2, row2StartHeight, "tile");
    tile2_3.anchor.setTo(0.5, 0.5);
    tile2_3.inputEnabled = true;
    tile2_3.events.onInputOver.add(overLoadGameButton, this);
    tile2_3.events.onInputOut.add(outLoadGameButton, this);
    tile2_3.events.onInputUp.add(loadGame);

    tile2_4 = mapTiles.create(row2StartWidth + tileWidth * 3, row2StartHeight, "tile");
    tile2_4.anchor.setTo(0.5, 0.5);
    tile2_4.inputEnabled = true;
    tile2_4.events.onInputOver.add(overTutorialButton, this);
    tile2_4.events.onInputOut.add(outTutorialButton, this);
    tile2_4.events.onInputUp.add(startTutorial);

    tile2_5 = mapTiles.create(row2StartWidth + tileWidth * 4, row2StartHeight, "tile");
    tile2_5.anchor.setTo(0.5, 0.5);
    tile2_5.inputEnabled = true;
    tile2_5.events.onInputOver.add(overTutorialButton, this);
    tile2_5.events.onInputOut.add(outTutorialButton, this);
    tile2_5.events.onInputUp.add(startTutorial);

    tile3_1 = mapTiles.create(row3StartWidth, row3StartHeight, "tile");
    tile3_1.anchor.setTo(0.5, 0.5);
    tile3_1.inputEnabled = true;
    tile3_1.events.onInputOver.add(overNewGameButton, this);
    tile3_1.events.onInputOut.add(outNewGameButton, this);
    tile3_1.events.onInputUp.add(startNewGame);

    tile3_2 = mapTiles.create(row3StartWidth + tileWidth, row3StartHeight, "tile");
    tile3_2.anchor.setTo(0.5, 0.5);
    tile3_2.inputEnabled = true;
    tile3_2.events.onInputOver.add(overSaveGameButton, this);
    tile3_2.events.onInputOut.add(outSaveGameButton, this);
    tile3_2.events.onInputUp.add(saveGame);

    tile3_3 = mapTiles.create(row3StartWidth + tileWidth * 2, row3StartHeight, "tile");
    tile3_3.anchor.setTo(0.5, 0.5);
    tile3_3.inputEnabled = true;
    tile3_3.events.onInputOver.add(overLoadGameButton, this);
    tile3_3.events.onInputOut.add(outLoadGameButton, this);
    tile3_3.events.onInputUp.add(loadGame);

    tile3_4 = mapTiles.create(row3StartWidth + tileWidth * 3, row3StartHeight, "tile");
    tile3_4.anchor.setTo(0.5, 0.5);
    tile3_4.inputEnabled = true;
    tile3_4.events.onInputOver.add(overTutorialButton, this);
    tile3_4.events.onInputOut.add(outTutorialButton, this);
    tile3_4.events.onInputUp.add(startTutorial);

    tile3_5 = mapTiles.create(row3StartWidth + tileWidth * 4, row3StartHeight, "tile");
    tile3_5.anchor.setTo(0.5, 0.5);
    tile3_5.inputEnabled = true;
    tile3_5.events.onInputOver.add(overTutorialButton, this);
    tile3_5.events.onInputOut.add(outTutorialButton, this);
    tile3_5.events.onInputUp.add(startTutorial);


    tile3_6 = mapTiles.create(row3StartWidth + tileWidth * 5, row3StartHeight, "tile");
    tile3_6.anchor.setTo(0.5, 0.5);
    tile3_6.inputEnabled = true;
    tile3_6.events.onInputOver.add(overTutorialButton, this);
    tile3_6.events.onInputOut.add(outTutorialButton, this);
    tile3_6.events.onInputUp.add(startTutorial);
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
    removeMainMenu();
    // TODO: write me!
}

function update() {
    // TODO: write me!
}