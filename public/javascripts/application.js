 $(document).ready(function() {

	console.log("application.js injected");

	// a little helper function that lets you select an element at x,y (start at 0,0)
	// (watch out for the non-middle rows - x will always be "along from the left")
	function at(x,y){
		return $('.board .row').eq(x).find('div').eq(y);
	}

	// clear the text of all the squares
	function clear(){
		$('.board .row div').text('').removeClass('redDragon GreenDragon redBear GreenBear redMonkey GreenMonkey selected')
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


	// initialise Green pieces
	var d1Green = new Piece('dragon',0,1,'Green');
	var d2Green = new Piece('dragon',0,8,'Green');
	var b1Green = new Piece('bear',0,2,'Green');
	var b2Green = new Piece('bear',1,1,'Green');
	var b3Green = new Piece('bear',0,7,'Green');
	var b4Green = new Piece('bear',1,8,'Green');
	var m1Green = new Piece('monkey',0,3,'Green');
	var m2Green = new Piece('monkey',1,2,'Green');
	var m3Green = new Piece('monkey',2,1,'Green');
	var m4Green = new Piece('monkey',0,6,'Green');
	var m5Green = new Piece('monkey',1,7,'Green');
	var m6Green = new Piece('monkey',2,8,'Green');

	// initialise red pieces
	var d1Red = new Piece('dragon',9,1,'Red');
	var d2Red = new Piece('dragon',9,8,'Red');
	var b1Red = new Piece('bear',9,2,'Red');
	var b2Red = new Piece('bear',8,1,'Red');
	var b3Red = new Piece('bear',9,7,'Red');
	var b4Red = new Piece('bear',8,8,'Red');
	var m1Red = new Piece('monkey',9,3,'Red');
	var m2Red = new Piece('monkey',8,2,'Red');
	var m3Red = new Piece('monkey',7,1,'Red');
	var m4Red = new Piece('monkey',9,6,'Red');
	var m5Red = new Piece('monkey',8,7,'Red');
	var m6Red = new Piece('monkey',7,8,'Red');

	// create array of all pieces
	var pieces = [d1Green,d2Green,b1Green,b2Green,b3Green,b4Green,m1Green,m2Green,m3Green,m4Green,m5Green,m6Green,d1Red,d2Red,b1Red,b2Red,b3Red,b4Red,m1Red,m2Red,m3Red,m4Red,m5Red,m6Red];

	function draw(type,x,y,colour){
		if (type==='dragon'){
			if (colour==='Red') {
				at(x,y).text('D').addClass('redDragon');
			}
			else {
				at(x,y).text('D').addClass('GreenDragon');
			}
		}
		else if (type==='bear'){
			if (colour==='Red') {
				at(x,y).text('B').addClass('redBear');
			}
			else {
				at(x,y).text('B').addClass('GreenBear');
			}
		}
		else {
			if (colour==='Red') {
				at(x,y).text('M').addClass('redMonkey');
			}
			else {
				at(x,y).text('M').addClass('GreenMonkey');
			}
		}
	}

	var render = function(){
		clear();
		for (i=0;i<pieces.length;i++){
			draw(pieces[i].type, pieces[i].x ,pieces[i].y, pieces[i].colour);
		}
	}


	// jQuery bit to make the game clickable
	var args = []; 
	$('.row div').on('click', function(){
		if (gameOver===1){
			console.log('Games over - Green won');	
		}
		else if (gameOver===2){
			console.log('Games over - Red won');	
		}
		else {
	 		args.push($(this).parent().index());
	 		args.push($(this).index());
	 		if (args.length===2){
	 			at(args[0],args[1]).removeClass('redDragon GreenDragon redBear GreenBear redMonkey GreenMonkey');
	 			at(args[0],args[1]).addClass('selected');
	 		}
	 		if(args.length > 2){
	  			move.apply(this,args);
	  			args = [];
	 		}
		}
	}
	)


	// render the initial board
	render();

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
			at(startx,starty).removeClass('selected');
			render();
			console.log('Can not move piece off the board');
			return false;
		}
		if ((newx<4 || newx>5) && (newy<1 || newy>8)){
			at(startx,starty).removeClass('selected');
			render();
			console.log('Can not move piece off the board');
			return false;
		}

		// check if they're trying to make a spazzy move like a knight or something
		if (Math.abs(newx-startx)>2 || Math.abs(newy-starty)>2){
			at(startx,starty).removeClass('selected');
			render();
			console.log(piece.type+'s do not move like that');
			return false;
		}
		else if (!(Math.abs(newx-startx)+Math.abs(newy-starty)===1 || Math.abs(newx-startx)+Math.abs(newy-starty)===2 || Math.abs(newx-startx)+Math.abs(newy-starty)===4)) {
			at(startx,starty).removeClass('selected');
			render();
			console.log(piece.type+'s do not move like that');
			return false;
		}


		// check to see if it was a jump and if so what piece was jumped
		// value of -1 means no jump was made
		var jumpPiece = jumped(startx,starty,newx,newy,piece);

		// now check individual pieces
		if (piece.type==='dragon'){
			if (jumpPiece===-1 && lastMoveJump===1){
				console.log('you must jump again or end turn');
				return;
			}
			else if (jumpPiece===-1) {
				console.log('dragons do not move that way');
				return false;
			}
			else if (pieces[jumpPiece].heirarchy>piece.heirarchy){
				console.log(piece.type +'s can not jump '+pieces[jumpPiece].type+'s');
				return false;
			}
			else if (pieces[jumpPiece].colour===piece.colour){
				console.log('you jumped a friend');
				$('#endturn').show();
				lastMoveJump=1;
				lastPiece=movePiece;
				return true;
			}
			else {
				if (lastMoveJump===1){
					console.log('Shing-Shang bitch!');
					shingShang=1;
				}
				console.log('you captured an enemey '+pieces[jumpPiece].type);
				$('#endturn').show();
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
				console.log('you must jump again or end turn');
				return;
			}
			else if (jumpPiece===-1){
				if ((Math.abs(newx-startx)===1 || Math.abs(newy-starty)===1) && lastMoveJump===0){
					return true;
				}
			}
			else if (pieces[jumpPiece].heirarchy>piece.heirarchy){
				console.log(piece.type +'s can not jump '+pieces[jumpPiece].type+'s');
				return false;
			}
			else if (pieces[jumpPiece].colour===piece.colour){
				console.log('you jumped a friend');
				$('#endturn').show();
				lastMoveJump=1;
				lastPiece=movePiece;
				return true;
			}
			else {
				if (lastMoveJump===1){
					console.log('Shing-Shang bitch!');
					shingShang=1;
				}
				console.log('you captured an enemey '+pieces[jumpPiece].type);
				$('#endturn').show();
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
				at(startx,starty).removeClass('selected');
				render();
				console.log('you must jump again or end turn');
				return;
			}
			else if (jumpPiece===-1 && lastMoveJump===0){
				return true;
			}
			else if (pieces[jumpPiece].heirarchy>piece.heirarchy){
				at(startx,starty).removeClass('selected');
				render();
				console.log(piece.type +'s can not jump '+pieces[jumpPiece].type+'s');
				return false;
			}
			else if (pieces[jumpPiece].colour===piece.colour){
				console.log('you jumped a friend');
				$('#endturn').show();
				lastMoveJump=1;
				lastPiece=movePiece;
				return true;
			}
			else {
				if (lastMoveJump===1){
					console.log('Shing-Shang bitch!');
					shingShang=1;
				}
				console.log('you captured an enemey '+pieces[jumpPiece].type);
				$('#endturn').show();
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
		var redDragonCount=0;
		var greenDragonCount=0;
		for (i=0;i<pieces.length;i++){
			if (pieces[i].colour==='Green' && pieces[i].type==='dragon' && pieces[i].x===8 && (pieces[i].y===4 || pieces[i].y===5)) {
					console.log('Green wins!!! Sucks to be red');
					gameOver=1;
					return;
			}
			else if (pieces[i].colour==='Red' && pieces[i].type==='dragon' && pieces[i].x===1 && (pieces[i].y===4 || pieces[i].y===5)) {
					console.log('Red wins!!! Sucks to be green');
					gameOver=2;
					return;
			}
			if (pieces[i].colour==='Red' && pieces[i].type==='dragon'){
				redDragonCount++;
			}
			else if (pieces[i].colour==='Green' && pieces[i].type==='dragon'){
				greenDragonCount++;
			}
		}

		if (redDragonCount===0){
			console.log('Green wins!!! Sucks to be red');
			gameOver=1;
			return;
		}
		else if (greenDragonCount===0){
			console.log('Red wins!!! Sucks to be green');
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

	function move(startx,starty,newx,newy){

		// find the piece you are trying to move in the pieces array
		var movePiece=-1;
		for (i=0;i<pieces.length;i++){
			if (pieces[i].x===startx && pieces[i].y===starty) {
				movePiece=i;
			}
		}

		if (lastMoveJump===1){
			if (lastPiece!==movePiece){
				at(startx,starty).removeClass('selected');
				render();
				console.log('must move the same piece or end turn')
				return;
			}
		}

		if (movePiece<0){
			at(startx,starty).removeClass('selected');
			render();
			console.log("No piece to move in starting cell");
			return;
		}
		else if (turn % 2===0 && pieces[movePiece].colour==="Green"){
				movePiece=-1; // this will stop the turn from happening
				at(startx,starty).removeClass('selected');
				render();
				console.log("it is red's turn");
				return;
		}
		else if (turn % 2===1 && pieces[movePiece].colour==="Red"){
				console.log("it is green's turn");
				at(startx,starty).removeClass('selected');
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
			at(startx,starty).removeClass('selected');
			render();
			console.log("Piece already in target cell");
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

			render();

			// check for a winner
			win();

			// if no jump then end the turn
			if (lastMoveJump===0){
				lastPiece=-1;
				turn++;
				if (turn % 2===0){
					$('#turn_icon').css("background-color","#ff0000").text("Red's Turn");
				} else {
					$('#turn_icon').css("background-color","#00ff00").text("Green's Turn");
				}
			}
		}
	}

	function end(){
		$('#endturn').hide();
		if (shingShang===1){
			console.log(pieces[lastPiece].colour+' gets another turn');
			lastMoveJump=0;
			lastPiece=-1
			shingShang=0;;
		}
		else {
			lastMoveJump=0;
			lastPiece=-1;
			turn++;
			if (turn % 2===0){
				$('#turn_icon').css("background-color","#ff0000").text("Red's Turn");
			} else {
				$('#turn_icon').css("background-color","#00ff00").text("Green's Turn");
			}
		}
	}
	// make end a global function so it can be called outside the document.ready callback
	window.end = end;

});