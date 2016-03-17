var port = 1337;
var express = require("./config/express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io")(server);
server.listen(port);
console.log("Server running at http://localhost:" + port);

io.on("connection", function (client) {
  console.log("Client connected...");

  client.on("join", function(data) {
    console.log(data);
  });

  client.on("chatMessage", function(data) {
    console.log(data);
    client.emit("chatMessage", data);
    client.broadcast.emit("chatMessage", data);
  });
});