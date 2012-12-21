 $(document).ready(function() {

	// a little helper function that lets you select an element at x,y (start at 0,0)
	// (watch out for the non-middle rows - x will always be "along from the left")
	function at(x,y){
		return $('.board .row').eq(x).find('div').eq(y);
	}

	// clear the text of all the squares
	function clear(){
		$('.board .row div').text('').removeClass('selected')
	}

	var Piece = function(type,x,y,colour){
		this.type=type;
		if (type==='dragon'){
			this.heirarchy=2;
		}
		else if (type==='bear'){
			this.heirarchy=1;
		}
		else {
			this.heirarchy=0;
		}
		this.x=x;
		this.y=y;
		this.colour=colour;
	};


	// initialise black pieces
	var d1black = new Piece('dragon',0,1,'black');
	var d2black = new Piece('dragon',0,8,'black');
	var b1black = new Piece('bear',0,2,'black');
	var b2black = new Piece('bear',1,1,'black');
	var b3black = new Piece('bear',0,7,'black');
	var b4black = new Piece('bear',1,8,'black');
	var m1black = new Piece('monkey',0,3,'black');
	var m2black = new Piece('monkey',1,2,'black');
	var m3black = new Piece('monkey',2,1,'black');
	var m4black = new Piece('monkey',0,6,'black');
	var m5black = new Piece('monkey',1,7,'black');
	var m6black = new Piece('monkey',2,8,'black');

	// initialise white pieces
	var d1white = new Piece('dragon',9,1,'white');
	var d2white = new Piece('dragon',9,8,'white');
	var b1white = new Piece('bear',9,2,'white');
	var b2white = new Piece('bear',8,1,'white');
	var b3white = new Piece('bear',9,7,'white');
	var b4white = new Piece('bear',8,8,'white');
	var m1white = new Piece('monkey',9,3,'white');
	var m2white = new Piece('monkey',8,2,'white');
	var m3white = new Piece('monkey',7,1,'white');
	var m4white = new Piece('monkey',9,6,'white');
	var m5white = new Piece('monkey',8,7,'white');
	var m6white = new Piece('monkey',7,8,'white');

	// create array of all pieces
	var pieces = [d1black,d2black,b1black,b2black,b3black,b4black,m1black,m2black,m3black,m4black,m5black,m6black,d1white,d2white,b1white,b2white,b3white,b4white,m1white,m2white,m3white,m4white,m5white,m6white];

	function draw(type,x,y,colour){
		if (type==='dragon'){
			if (colour==='white') {
				at(x,y).html("<span class='piece'>&#9812;</span>");
			}
			else {
				at(x,y).html("<span class='piece'>&#9818;</span>");
			}
		}
		else if (type==='bear'){
			if (colour==='white') {
				at(x,y).html("<span class='piece'>&#9815;</span>");
			}
			else {
				at(x,y).html("<span class='piece'>&#9821;</span>");
			}
		}
		else {
			if (colour==='white') {
				at(x,y).html("<span class='piece'>&#9817;</span>");
			}
			else {
				at(x,y).html("<span class='piece'>&#9823;</span>");
			}
		}
	}

	var render = function(){
		console.log('rendered');
		console.log(turn);
		clear();
		for (i=0;i<pieces.length;i++){
			draw(pieces[i].type, pieces[i].x ,pieces[i].y, pieces[i].colour);
		}

		$('.row').each(function(row){
			$(this).find('> div').each(function(col){
				$(this).data('coords', {row:row, col:col})
			});
		});

		if (gameOver===1){
			$('#log').text('Game over - Black won')
		}
		else if (gameOver===2){
			$('#log').text('Game over - White won');	
		}
		else if (turn % 2===0 && window.colour=='white')  {

			$('.piece').draggable({
				cursor: 'hand',
				containment: ".board"
			});

			$('.board .row div').droppable({
				accept: '.piece',
				hoverClass: 'hover',
				drop: function(event, ui) {

					var old_square = ui.draggable;
					var new_square = this;
					var args = [$(old_square).parent().data('coords').row,$(old_square).parent().data('coords').col,
						$(new_square).data('coords').row,$(new_square).data('coords').col];

					move(args[0],args[1],args[2],args[3],1);

				},
			});
		} else if (turn % 2===1 && window.colour=='black')  {

			$('.piece').draggable({
				cursor: 'hand',
				containment: ".board"
			});

			$('.board .row div').droppable({
				accept: '.piece',
				hoverClass: 'hover',
				drop: function(event, ui) {

					var old_square = ui.draggable;
					var new_square = this;
					var args = [$(old_square).parent().data('coords').row,$(old_square).parent().data('coords').col,
						$(new_square).data('coords').row,$(new_square).data('coords').col];

					move(args[0],args[1],args[2],args[3],1);

				},
			});
		}
	}

	// render the initial board - this is noe done through socket.io
	// render();

	// function to check if a piece was jumped
	function jumped(startx,starty,newx,newy,piece){
		if (Math.abs(newx-startx)===1 || Math.abs(newy-starty)===1){
				return -1;
		}

		// jumping south
		else if (newx-startx===2 && newy-starty===0){
			var jumpPiece=-1;
			for (i=0;i<pieces.length;i++){
				if (pieces[i].x===(startx+1) && pieces[i].y===starty) {
					jumpPiece=i;
				}
			}
			return jumpPiece;	
		}


		// jumping south-west
		else if (newx-startx===2 && newy-starty===-2){
			var jumpPiece=-1;
			for (i=0;i<pieces.length;i++){
				if (pieces[i].x===(startx+1) && pieces[i].y===(starty-1)) {
					jumpPiece=i;
				}
			}
			return jumpPiece;
		}

		// jumping west
		else if (newx-startx===0 && newy-starty===-2){
			var jumpPiece=-1;
			for (i=0;i<pieces.length;i++){
				if (pieces[i].x===(startx) && pieces[i].y===(starty-1)) {
					jumpPiece=i;
				}
			}
			return jumpPiece;
		}

		// jumping north-west
		else if (newx-startx===-2 && newy-starty===-2){
			var jumpPiece=-1;
			for (i=0;i<pieces.length;i++){
				if (pieces[i].x===(startx-1) && pieces[i].y===(starty-1)) {
					jumpPiece=i;
				}
			}
			return jumpPiece;
		}

		// jumping north
		else if (newx-startx===-2 && newy-starty===0){
			var jumpPiece=-1;
			for (i=0;i<pieces.length;i++){
				if (pieces[i].x===(startx-1) && pieces[i].y===(starty)) {
					jumpPiece=i;
				}
			}
			return jumpPiece;
		}

		// jumping north-east
		else if (newx-startx===-2 && newy-starty===2){
			var jumpPiece=-1;
			for (i=0;i<pieces.length;i++){
				if (pieces[i].x===(startx-1) && pieces[i].y===(starty+1)) {
					jumpPiece=i;
				}
			}
			return jumpPiece;
		}

		// jumping east
		else if (newx-startx===0 && newy-starty===2){
			var jumpPiece=-1;
			for (i=0;i<pieces.length;i++){
				if (pieces[i].x===(startx) && pieces[i].y===(starty+1)) {
					jumpPiece=i;
				}
			}
			return jumpPiece;
		}

		// jumping south-east
		else if (newx-startx===2 && newy-starty===2){
			var jumpPiece=-1;
			for (i=0;i<pieces.length;i++){
				if (pieces[i].x===(startx+1) && pieces[i].y===(starty+1)) {
					jumpPiece=i;
				}
			}
			return jumpPiece;
		}
	}

	// function to check move is legal

	function legalMove(startx,starty,newx,newy,piece,movePiece){
		// check if they're trying to move off the board
		if (newx<0 || newx>9 || newy<0 || newy>9){
			render();
			$('#log').text('Can not move piece off the board');
			return false;
		}
		if ((newx<4 || newx>5) && (newy<1 || newy>8)){
			render();
			$('#log').text('Can not move piece off the board');
			return false;
		}

		// check if they're trying to make a spazzy move like a knight or something
		if (Math.abs(newx-startx)>2 || Math.abs(newy-starty)>2){
			render();
			$('#log').text(piece.type+'s do not move like that');
			return false;
		}
		else if (!(Math.abs(newx-startx)+Math.abs(newy-starty)===1 || Math.abs(newx-startx)+Math.abs(newy-starty)===2 || Math.abs(newx-startx)+Math.abs(newy-starty)===4)) {
			render();
			$('#log').text(piece.type+'s do not move like that');
			return false;
		}


		// check to see if it was a jump and if so what piece was jumped
		// value of -1 means no jump was made
		var jumpPiece = jumped(startx,starty,newx,newy,piece);

		// now check individual pieces
		if (piece.type==='dragon'){
			if (jumpPiece===-1 && lastMoveJump===1){
				$('#log').text('you must jump again or end turn');
				return;
			}
			else if (jumpPiece===-1) {
				$('#log').text('dragons do not move that way');
				return false;
			}
			else if (pieces[jumpPiece].heirarchy>piece.heirarchy){
				$('#log').text(piece.type +'s can not jump '+pieces[jumpPiece].type+'s');
				return false;
			}
			else if (pieces[jumpPiece].colour===piece.colour){
				$('#log').text('you jumped a friend');
				lastMoveJump=1;
				lastPiece=movePiece;
				return true;
			}
			else {
				$('#log').text('you captured an enemey '+pieces[jumpPiece].type);
				if (lastMoveJump===1){
					$('#log').text('Shing-Shang bitch!');
					shingShang=1;
				}
				lastMoveJump=1;
				if (jumpPiece<movePiece){
					lastPiece=movePiece-1;
				}
				else {
					lastPiece=movePiece;
				}
				pieces.splice(jumpPiece,1);
				return jumpPiece;

			}
		}

		else if (piece.type==='bear'){
			if (jumpPiece===-1 && lastMoveJump===1){
				$('#log').text('you must jump again or end turn');
				return;
			}
			else if (jumpPiece===-1){
				if ((Math.abs(newx-startx)===1 || Math.abs(newy-starty)===1) && lastMoveJump===0){
					return true;
				}
			}
			else if (pieces[jumpPiece].heirarchy>piece.heirarchy){
				$('#log').text(piece.type +'s can not jump '+pieces[jumpPiece].type+'s');
				return false;
			}
			else if (pieces[jumpPiece].colour===piece.colour){
				$('#log').text('you jumped a friend');
				lastMoveJump=1;
				lastPiece=movePiece;
				return true;
			}
			else {
				$('#log').text('you captured an enemey '+pieces[jumpPiece].type);
				if (lastMoveJump===1){
					$('#log').text('Shing-Shang bitch!');
					shingShang=1;
				}
				lastMoveJump=1;
				if (jumpPiece<movePiece){
					lastPiece=movePiece-1;
				}
				else {
					lastPiece=movePiece;
				}
				pieces.splice(jumpPiece,1);
				return jumpPiece;

			}
		}

		else {
			if (jumpPiece===-1 && lastMoveJump===1){
				render();
				$('#log').text('you must jump again or end turn');
				return;
			}
			else if (jumpPiece===-1 && lastMoveJump===0){
				return true;
			}
			else if (pieces[jumpPiece].heirarchy>piece.heirarchy){
				render();
				$('#log').text(piece.type +'s can not jump '+pieces[jumpPiece].type+'s');
				return false;
			}
			else if (pieces[jumpPiece].colour===piece.colour){
				$('#log').text('you jumped a friend');
				lastMoveJump=1;
				lastPiece=movePiece;
				return true;
			}
			else {
				$('#log').text('you captured an enemey '+pieces[jumpPiece].type);
				if (lastMoveJump===1){
					$('#log').text('Shing-Shang bitch!');
					shingShang=1;
				}
				lastMoveJump=1;
				if (jumpPiece<movePiece){
					lastPiece=movePiece-1;
				}
				else {
					lastPiece=movePiece;
				}
				pieces.splice(jumpPiece,1);
				return jumpPiece;

			}
		}
	}


	// check to see if someone has won
	function win(movePiece){
		var whiteDragonCount=0;
		var blackDragonCount=0;
		for (i=0;i<pieces.length;i++){
			if (pieces[i].colour==='black' && pieces[i].type==='dragon' && pieces[i].x===8 && (pieces[i].y===4 || pieces[i].y===5)) {
					$('#log').text('black wins!!! Sucks to be white');
					gameOver=1;
					return;
			}
			else if (pieces[i].colour==='white' && pieces[i].type==='dragon' && pieces[i].x===1 && (pieces[i].y===4 || pieces[i].y===5)) {
					$('#log').text('white wins!!! Sucks to be black');
					gameOver=2;
					return;
			}
			if (pieces[i].colour==='white' && pieces[i].type==='dragon'){
				whiteDragonCount++;
			}
			else if (pieces[i].colour==='black' && pieces[i].type==='dragon'){
				blackDragonCount++;
			}
		}

		if (whiteDragonCount===0){
			$('#log').text('Black wins!!! Sucks to be White');
			gameOver=1;
			return;
		}
		else if (blackDragonCount===0){
			$('#log').text('White wins!!! Sucks to be Black');
			gameOver=2;
			return;
		}
	}

	// create global variables to contral the turns
	var turn=0; 			// this is the turn number
	var lastPiece=-1; 		// this will hold the index of the last piece moved
	var lastMoveJump=0; 	// this will tell if the last move was a jump
	var shingShang=0;		// this will tell if there's been a shing shang
	var gameOver=0;

	function move(startx,starty,newx,newy,emit){

		// check if the game is over
		if (gameOver>0){
			win();	// this is just an easier way of logging who has won
			return;
		}

		// find the piece you are trying to move in the pieces array
		var movePiece=-1;
		for (i=0;i<pieces.length;i++){
			if (pieces[i].x===startx && pieces[i].y===starty) {
				movePiece=i;
			}
		}

		if (lastMoveJump===1){
			if (lastPiece!==movePiece){
				render();
				$('#log').text('must move the same piece or end turn')
				return;
			}
		}

		if (movePiece<0){
			render();
			$('#log').text("No piece to move in starting cell");
			return;
		}
		else if (turn % 2===0 && pieces[movePiece].colour==="black"){
			movePiece=-1; // this will stop the turn from happening
			render();
			$('#log').text("it is White's turn");
			return;
		}
		else if (turn % 2===1 && pieces[movePiece].colour==="white"){
			$('#log').text("it is Black's turn");
			render();
			movePiece=-1; // this will stop the turn from happening
			return;
		}


		// check to see if there is already a piece in the target cell
		var allowMove=-1;
		for (i=0;i<pieces.length;i++){
			if (pieces[i].x===newx && pieces[i].y===newy) {
				allowMove=i;
			}
		}
		if (allowMove>-1){
			render();
			$('#log').text("Piece already in target cell");
			return;
		}

		// move the piece if it's allowed
		var allow=legalMove(startx,starty,newx,newy,pieces[movePiece],movePiece);
		if (allow===false){
			return;
		}
		if (movePiece>-1 && allowMove<0){
			if (allow===true){
				pieces[movePiece].x=newx;
				pieces[movePiece].y=newy;
			}
			else if (allow>-1){
				if (allow<movePiece){
					pieces[movePiece-1].x=newx;
					pieces[movePiece-1].y=newy;
				}
				else {
					pieces[movePiece].x=newx;
					pieces[movePiece].y=newy;	
				}
			}

			

			if (emit==1){
				var args = [startx,starty,newx,newy,1];
				socket.emit('playerMove', args);
			}

			// check for a winner
			win();
			if (gameOver>0){
				$('#endturn').hide();
				$('.piece').draggable("disable");
				return;
			}
			else if (gameOver==0 && lastMoveJump==1){
				if (turn % 2===0 && window.colour=='white')  {
					$('#endturn').show();
				} else if (turn % 2===1 && window.colour=='black')  {
					$('#endturn').show();
				}
			}

			// if no jump then end the turn
			if (lastMoveJump===0){
				lastPiece=-1;
				turn++;
				$('#log').text(" ");
				if (turn % 2===0){
					$('#turn_icon').css('color','white').text("White's Turn");
				} else {
					$('#turn_icon').css('color','black').text("Black's Turn");
				}
			}
			render();
		}
	}

	function end(emit){

		if (emit==1){
			socket.emit('playerEndTurn', 1 );
		}
		
		$('#endturn').hide();
		if (shingShang===1){
			$('#log').text(pieces[lastPiece].colour+' gets another turn');
			lastMoveJump=0;
			lastPiece=-1
			shingShang=0;;
		}
		else {
			lastMoveJump=0;
			lastPiece=-1;
			turn++;
			$('#log').text(" ");
			if (turn % 2===0){
				$('#turn_icon').css('color','white').text("White's Turn");
			} else {
				$('#turn_icon').css('color','black').text("Black's Turn");
			}
			render();
		}
	}

	function game_choice(link){
		socket.emit('gameChoice', link.text);
	}

	function end_test(){
		move(7,8,6,8,1);
		move(2,8,4,8,1);
		move(8,7,7,6,1);
		move(1,7,2,7,1);
		move(7,6,6,6,1);
		move(0,6,1,5,1);
	}

	// make end a global function so it can be called outside the document.ready callback

	window.end = end;
	window.render = render;
	window.move = move;
	window.end_test = end_test;
	window.game_choice = game_choice;

});