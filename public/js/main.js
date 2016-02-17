var GalacticConquest = GalacticConquest || {};

GalacticConquest.game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, "gameDiv");
GalacticConquest.game.state.add("Boot", GalacticConquest.Boot);
GalacticConquest.game.state.add("Preload", GalacticConquest.Preload);
GalacticConquest.game.state.add("MainMenu", GalacticConquest.MainMenu);
GalacticConquest.game.state.add("Game", GalacticConquest.Game);
GalacticConquest.game.state.start("Boot");