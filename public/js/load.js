var GalacticConquest = GalacticConquest || {};

GalacticConquest.Preload = function() {};
GalacticConquest.Preload.prototype = {
    preload: function() {
        this.splash = this.add.sprite(this.game.world.centerX, this.game.world.centerY, "logo");
        this.splash.anchor.setTo(0.5);
        this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 128, "preloadbar");
        this.preloadBar.anchor.setTo(0.5);
        this.load.setPreloadSprite(this.preloadBar);

        game.load.image("background", "../assets/backgrounds/SpaceBackground-2.jpg");
        game.load.image("newGameButton", "../assets/buttons/newGame_raised.png");
        game.load.image("saveGameButton", "../assets/buttons/saveGame_raised.png");
        game.load.image("loadGameButton", "../assets/buttons/loadGame_raised.png");
        game.load.image("tutorialButton", "../assets/buttons/tutorial_raised.png");
    },

    create: function() {
        this.state.start("MainMenu");
    }
};