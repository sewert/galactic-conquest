var GalacticConquest = GalacticConquest || {};
GalacticConquest.Boot = function(){};

GalacticConquest.Boot.prototype = {
    preload: function() {
        this.load.image("logo", "../assets/planets/Sun.png");
        this.load.image("preloadbar", "../assets/copyrightProtected/preload-bar.png");
    },
    create: function() {
        this.game.stage.backgroundColor="xfff";
        this.scale.scaleMode = Phaser.ScaleManager.RESIZE;
        this.scale.minWidth = 240;
        this.scale.minHeight = 170;
        this.scale.maxWidth = 2880;
        this.scale.maxHeight = 1920;
        this.scale.pageAlignHorizontally = true;
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.state.start("Preload");
  }
};