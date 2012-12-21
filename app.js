
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

var games = ['Game 1','Game 2','Game 3'];

io.sockets.on('connection', function (socket) {

  socket.on('gameChoice', function(gameChoice){

    if (games.indexOf(gameChoice)>-1){
      var gamePlayers = io.sockets.clients(gameChoice).length;

      if (gamePlayers<2){
        socket.room = gameChoice;
        socket.join(gameChoice);
        gamePlayers++;

        if (gamePlayers==1){
          socket.colour='white';
        } else {
          socket.colour='black';  
        }
        socket.emit('playerColour',socket.colour);

        // tell the player they've connected to the game
        io.sockets.in(gameChoice).emit('gameConnect', socket.id, gameChoice, gamePlayers);

        // update everyone (not just people in the room) the number of players in a game (this currently isn't working)
        io.sockets.emit('gameCount', gameChoice, gamePlayers);
      }
      else {
        socket.emit('gameFull', socket.id, gameChoice);
      }

    }

    else {
      console.log('Game does not exist');  // can fill this in to create new rooms
      // games.push(gameChoice);
      // players[socket.id] = socket.id; // this should be changed to username
      // socket.room = gameChoice;
      // socket.join(gameChoice);
    }

  });

  socket.on('playerMove', function(playerMove){
    console.log(playerMove);
    console.log(socket.id);
    console.log(socket.room);
    socket.broadcast.to(socket.room).emit('playerMove', playerMove);
  });

  socket.on('playerEndTurn', function(endTurn){
    console.log('endTurn');
    socket.broadcast.to(socket.room).emit('playerEndTurn', endTurn);
  });

});