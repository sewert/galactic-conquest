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
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.add.sprite(0, 0, "background");

    showMenu();
}

function showMenu() {
    newGameButton = game.add.sprite(gameWidth / 2, 184, "newGameButton");
    newGameButton.anchor.setTo(0.5, 0.5);
    saveGameButton = game.add.sprite(gameWidth / 2, 294, "saveGameButton");
    saveGameButton.anchor.setTo(0.5, 0.5);
    loadGameButton = game.add.sprite(gameWidth / 2, 404, "loadGameButton");
    loadGameButton.anchor.setTo(0.5, 0.5);
    tutorialButton = game.add.sprite(gameWidth / 2, 514, "tutorialButton");
    tutorialButton.anchor.setTo(0.5, 0.5);
}
function update() {

}