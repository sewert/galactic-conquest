var gameHeight = 900;
var gameWidth = 1600;
var tileHeight = 160;
var tileWidth = 160;
var tileWidthSpacing = 80;
var tileHeightSpacing = 120;
var tileRowStartWidth = 550;
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
    game.scale.pageAlignHorizontally = true;
}

function showBackground() {
    this.background = game.add.sprite(0, 0, "background");
}

function showMenu() {
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

function startNewGame() {
    removeMainMenu();
    showResourceText();
    addTiles();
    // TODO: write me!
}

function showResourceText() {
    resources = 0;
    resourceText = game.add.text(200, 50, "Available Resources: " + resources, { font: "bold 32px Arial", fill: color1});
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
    tile1_2 = mapTiles.create(row1StartWidth + tileWidth, row1StartHeight, "tile");
    tile1_3 = mapTiles.create(row1StartWidth + tileWidth * 2, row1StartHeight, "tile");
    tile1_4 = mapTiles.create(row1StartWidth + tileWidth * 3, row1StartHeight, "tile");

    tile2_1 = mapTiles.create(row2StartWidth, row2StartHeight, "tile");
    tile2_2 = mapTiles.create(row2StartWidth + tileWidth, row2StartHeight, "tile");
    tile2_3 = mapTiles.create(row2StartWidth + tileWidth * 2, row2StartHeight, "tile");
    tile2_4 = mapTiles.create(row2StartWidth + tileWidth * 3, row2StartHeight, "tile");
    tile2_5 = mapTiles.create(row2StartWidth + tileWidth * 4, row2StartHeight, "tile");

    tile3_1 = mapTiles.create(row3StartWidth, row3StartHeight, "tile");
    tile3_2 = mapTiles.create(row3StartWidth + tileWidth, row3StartHeight, "tile");
    tile3_3 = mapTiles.create(row3StartWidth + tileWidth * 2, row3StartHeight, "tile");
    tile3_4 = mapTiles.create(row3StartWidth + tileWidth * 3, row3StartHeight, "tile");
    tile3_5 = mapTiles.create(row3StartWidth + tileWidth * 4, row3StartHeight, "tile");
    tile3_6 = mapTiles.create(row3StartWidth + tileWidth * 5, row3StartHeight, "tile");

    tile4_1 = mapTiles.create(row4StartWidth, row4StartHeight, "tile");
    tile4_2 = mapTiles.create(row4StartWidth + tileWidth, row4StartHeight, "tile");
    tile4_3 = mapTiles.create(row4StartWidth + tileWidth * 2, row4StartHeight, "tile");
    tile4_4 = mapTiles.create(row4StartWidth + tileWidth * 3, row4StartHeight, "tile");
    tile4_5 = mapTiles.create(row4StartWidth + tileWidth * 4, row4StartHeight, "tile");
    tile4_6 = mapTiles.create(row4StartWidth + tileWidth * 5, row4StartHeight, "tile");
    tile4_7 = mapTiles.create(row4StartWidth + tileWidth * 6, row4StartHeight, "tile");

    tile5_1 = mapTiles.create(row5StartWidth, row5StartHeight, "tile");
    tile5_2 = mapTiles.create(row5StartWidth + tileWidth, row5StartHeight, "tile");
    tile5_3 = mapTiles.create(row5StartWidth + tileWidth * 2, row5StartHeight, "tile");
    tile5_4 = mapTiles.create(row5StartWidth + tileWidth * 3, row5StartHeight, "tile");
    tile5_5 = mapTiles.create(row5StartWidth + tileWidth * 4, row5StartHeight, "tile");
    tile5_6 = mapTiles.create(row5StartWidth + tileWidth * 5, row5StartHeight, "tile");

    tile6_1 = mapTiles.create(row6StartWidth, row6StartHeight, "tile");
    tile6_2 = mapTiles.create(row6StartWidth + tileWidth, row6StartHeight, "tile");
    tile6_3 = mapTiles.create(row6StartWidth + tileWidth * 2, row6StartHeight, "tile");
    tile6_4 = mapTiles.create(row6StartWidth + tileWidth * 3, row6StartHeight, "tile");
    tile6_5 = mapTiles.create(row6StartWidth + tileWidth * 4, row6StartHeight, "tile");

    tile7_1 = mapTiles.create(row7StartWidth, row7StartHeight, "tile");
    tile7_2 = mapTiles.create(row7StartWidth + tileWidth, row7StartHeight, "tile");
    tile7_3 = mapTiles.create(row7StartWidth + tileWidth * 2, row7StartHeight, "tile");
    tile7_4 = mapTiles.create(row7StartWidth + tileWidth * 3, row7StartHeight, "tile");

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
    //TODO: write me!
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