# galactic-conquest
Multiplayer turn-based strategy game using http://phaser.io/ 

Playable in browser (even mobile browser for the most part).

Features a simple chat client and save game feature.

Original photos/graphics thanks to pexels.com and OpenGameArt.org.
Images were edited with GIMP.

SETUP INFORMATION

Currently isn't hosted anywhere but isn't hard to set up. You only need a Node server to run server.js and a MongoDB instance. I plan on revisiting this soon to add some polish and host it again.

You need a config.json file in the same directory as server.js containing
a url to log into your MongoDB eg:
{"url":"mongodb://<username>:<password>@ds025379.mlab.com:25379/galactic-conquest"}
