var socket = io.connect('http://localhost:8888');
socket.on('playerMove', function (playerMove) {
	move(playerMove[0],playerMove[1],playerMove[2],playerMove[3],0);
});
socket.on('playerEndTurn', function (endTurn) {
	end(0);
});