var socket = io.connect('http://localhost:8888');

// setting up the game
socket.on('gameConnect', function(player,gameChoice){
	$('#chat').append('<b>'+player + ':</b> ' + 'You have succesfully connected to '+ gameChoice + '<br>');
});

socket.on('gameFull', function(player, gameChoice){
	$('#chat').append('<b>'+player + ':</b> ' + 'Sorry, '+ gameChoice + 'is full.<br>');
})

// this needs to be fixed. Changing the text changes the name of the game which causes problems
// socket.on('gameCount', function(gameChoice, gamePlayers){
// 	$('#chat ul li a').each(function(){
// 		if (this.text == gameChoice){
// 			$(this).append('<li> '+gamePlayers+' players </li>');
// 		}
// 	});
// });

// control of the game
socket.on('playerMove', function (playerMove) {
	move(playerMove[0],playerMove[1],playerMove[2],playerMove[3],0);
});

socket.on('playerEndTurn', function (endTurn) {
	end(0);
});