var socket = io.connect('http://localhost:8888');
socket.on('playerMove', function (playerMove) {
	console.log(playerMove);
	move(playerMove[0],playerMove[1],playerMove[2],playerMove[3]);
});