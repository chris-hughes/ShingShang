
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , io = require('socket.io');

var app = module.exports = express.createServer();
io = io.listen(app);

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  io.set('log level', 2);
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);

app.listen(8888, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});

// Socket.io

var players = {};
var games = ['Game 1'];

io.sockets.on('connection', function (socket) {

  socket.on('gameChoice', function(gameChoice){

    if (games.indexOf(gameChoice)>-1){

      // add the player to the players object
      players[socket.id] = socket.id; // this should be changed to username
      // store the room name in the socket
      socket.room = gameChoice;
      // send the client to the room
      socket.join(gameChoice);

      var gamePlayers = io.sockets.clients(gameChoice).length;
      // tell the player they've connected to the game
      io.sockets.in(gameChoice).emit('gameConnect', socket.id, gameChoice);
      // update everyone the number of players in a game
      io.sockets.emit('gameCount', gameChoice, gamePlayers);
    }

    else {
      console.log('Game does not exist');
      // games.push(gameChoice);
      // players[socket.id] = socket.id; // this should be changed to username
      // socket.room = gameChoice;
      // socket.join(gameChoice);
    }
  });

  socket.on('playerMove', function(playerMove){
    console.log(playerMove);
    socket.broadcast.emit('playerMove', playerMove);
  });

  socket.on('playerEndTurn', function(endTurn){
    console.log('endTurn');
    socket.broadcast.emit('playerEndTurn', endTurn);
  });

});