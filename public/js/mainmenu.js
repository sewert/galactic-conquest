var GalacticConquest = GalacticConquest || {};

GalacticConquest.MainMenu = function() {};
GalacticConquest.MainMenu.prototype = {
    create: function() {
        this.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, "background");
        this.background.autoScroll(-20, 0);

        //start game text
        var text = "Tap to begin";
        var style = { font: "30px Arial", fill: "#fff", align: "center" };
        var t = this.game.add.text(this.game.width/2, this.game.height/2, text, style);
        t.anchor.set(0.5);

        //highest score
        text = "Highest score: "+this.highestScore;
        style = { font: "15px Arial", fill: "#fff", align: "center" };

        var h = this.game.add.text(this.game.width/2, this.game.height/2 + 50, text, style);
        h.anchor.set(0.5);
    },
    update: function() {
        if(this.game.input.activePointer.justPressed()) {
            this.game.state.start("Game");
        }
    }
};

//
//function showMenu() {
//    mainMenuButtons = game.add.group();
//
//    newGameButton = mainMenuButtons.create(gameWidth/2, gameHeight * 0.2, "newGameButton");
//    newGameButton.anchor.setTo(0.5, 0.5);
//    newGameButton.inputEnabled = true;
//    newGameButton.events.onInputOver.add(overNewGameButton, this);
//    newGameButton.events.onInputOut.add(outNewGameButton, this);
//    newGameButton.events.onInputUp.add(startNewGame);
//
//    saveGameButton = mainMenuButtons.create(gameWidth/2, gameHeight * 0.4, "saveGameButton");
//    saveGameButton.anchor.setTo(0.5, 0.5);
//    saveGameButton.inputEnabled = true;
//    saveGameButton.events.onInputOver.add(overSaveGameButton, this);
//    saveGameButton.events.onInputOut.add(outSaveGameButton, this);
//    saveGameButton.events.onInputUp.add(saveGame);
//
//    loadGameButton = mainMenuButtons.create(gameWidth/2, gameHeight * 0.6, "loadGameButton");
//    loadGameButton.anchor.setTo(0.5, 0.5);
//    loadGameButton.inputEnabled = true;
//    loadGameButton.events.onInputOver.add(overLoadGameButton, this);
//    loadGameButton.events.onInputOut.add(outLoadGameButton, this);
//    loadGameButton.events.onInputUp.add(loadGame);
//
//    tutorialButton = mainMenuButtons.create(gameWidth/2, gameHeight * 0.8, "tutorialButton");
//    tutorialButton.anchor.setTo(0.5, 0.5);
//    tutorialButton.inputEnabled = true;
//    tutorialButton.events.onInputOver.add(overTutorialButton, this);
//    tutorialButton.events.onInputOut.add(outTutorialButton, this);
//    tutorialButton.events.onInputUp.add(startTutorial);
//}
//
//function overNewGameButton() {
//    this.game.add.tween(this.newGameButton.scale).to({x: 1.1, y: 1.1}, 300, Phaser.Easing.Exponential.Out, true);
//}
//
//function outNewGameButton() {
//    this.game.add.tween(this.newGameButton.scale).to({x: 1.0, y: 1.0}, 300, Phaser.Easing.Exponential.Out, true);
//}
//
//function overSaveGameButton() {
//    this.game.add.tween(this.saveGameButton.scale).to({x: 1.1, y: 1.1}, 300, Phaser.Easing.Exponential.Out, true);
//}
//
//function outSaveGameButton() {
//    this.game.add.tween(this.saveGameButton.scale).to({x: 1.0, y: 1.0}, 300, Phaser.Easing.Exponential.Out, true);
//}
//
//function overLoadGameButton() {
//    this.game.add.tween(this.loadGameButton.scale).to({x: 1.1, y: 1.1}, 300, Phaser.Easing.Exponential.Out, true);
//}
//
//function outLoadGameButton() {
//    this.game.add.tween(this.loadGameButton.scale).to({x: 1.0, y: 1.0}, 300, Phaser.Easing.Exponential.Out, true);
//}
//
//function overTutorialButton() {
//    this.game.add.tween(this.tutorialButton.scale).to({x: 1.1, y: 1.1}, 300, Phaser.Easing.Exponential.Out, true);
//}
//
//function outTutorialButton() {
//    this.game.add.tween(this.tutorialButton.scale).to({x: 1.0, y: 1.0}, 300, Phaser.Easing.Exponential.Out, true);
//}
//
//function startNewGame() {
//    removeMainMenu();
//    game.state.start("play");
//}
//
//function removeMainMenu() {
//    var tween = this.game.add.tween(this.mainMenuButtons.scale).to({x: 0.0, y: 1.0}, 500, Phaser.Easing.Exponential.In, true);
//    tween.onComplete.add(function () {
//        mainMenuButtons.destroy();
//    });
//}
//
//function saveGame() {
//    // TODO: write me!
//}
//
//function loadGame() {
//    // TODO: write me!
//}
//
//function startTutorial() {
//    removeMainMenu();
//    // TODO: write me!
//}