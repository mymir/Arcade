//Canvas
var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");
var color = "#ff0090";
//Player
var playerHeight = 20;
var playerWidth = 30;
var playerX = (canvas.width-playerWidth)/2;
//Ships
var shipRowCount = 5;
var shipColumnCount = 11;
var shipWidth = 30;
var shipHeight = 18;
var shipPadding = 25;
var shipOffsetTop = 30;
var shipOffsetLeft = 30;
var shipDx = shipWidth + shipPadding;
var shipDy = shipHeight + shipPadding;
var ships = [];
for(c=0; c<shipColumnCount; c++) {
    ships[c] = [];
    for(r=0; r<shipRowCount; r++) {
        ships[c][r] = { x: 0, y: 0, status: 1, width: 30};
    }
}
//Event Listeners
document.addEventListener("mousemove", mouseMoveHandler, false);
//Player Status
var lives = 3;
var points = 0;
var started = 0;
var sound = new sound("resources/beep.mp3");

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
}

function mouseMoveHandler(e){
	var relativeX = e.clientX - canvas.offsetLeft;
	if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}

function start(){
	started = 1;
}

function collisionDetection(){
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status == 1){
            	if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                	dy = -dy;
                	b.status = 0;
                	sound.play();
                	points++;
            	}
            }
        }
    }
}

function drawWin() {
	ctx.font = "50px Arial";
	ctx.fillStyle = color;
	ctx.fillText("YOU WIN!", canvas.width/2 - 120, canvas.height/2);
}

function drawEnd() {
	ctx.font = "50px Arial";
	ctx.fillStyle = color;
	ctx.fillText("GAME OVER!", canvas.width/2 - 160, canvas.height/2);

	ctx.font = "30px Arial";
	ctx.fillStyle = color;
	ctx.fillText("Points: "+points, canvas.width/2 - 60, canvas.height/2 + 50);
}

function drawStart() {
	ctx.font = "50px Arial";
	ctx.fillStyle = color;
	ctx.fillText("CLICK HERE TO PLAY", canvas.width/2 - 260, canvas.height/2);
}

function drawLives(){
	ctx.font = "20px Arial"
	ctx.fillStyle = color;
	ctx.fillText("Lives: "+lives, canvas.width-80, 20);
}

function drawPoints(){
	ctx.font = "20px Arial"
	ctx.fillStyle = color;
	ctx.fillText("Points: "+points, 8, 20);
}

function drawBall(){
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

function drawPaddle(){
	ctx.beginPath();
	ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
	ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

function drawRow(int) {
	for(c=0; c<shipColumnCount; c++){
		if(ships[c][int].status == 1){
			var shipX = (c*(shipWidth+shipPadding))+shipOffsetLeft;
	        var shipY = (r*(shipHeight+shipPadding))+shipOffsetTop;
	        ships[c][r].x = shipX;
			ships[c][r].y = shipY;
			ctx.beginPath();
			ctx.rect(shipX, shipY, shipWidth+(2*r), shipHeight);
			ctx.fillStyle = color;
			ctx.fill();
	        ctx.closePath();
		}
	}
	shipOffsetLeft += shipDx;
	if(shipOffsetLeft > 130 || shipOffsetLeft < 60){
		shipDx = -shipDx
	}
}
function drawShips(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	for(c=0; c<shipColumnCount; c++){
		for(r=0; r<shipRowCount; r++){
			drawRow(r);
		}
	}
	shipOffsetLeft += shipDx;
	if(shipOffsetLeft > 130 || shipOffsetLeft < 60){
		shipDx = -shipDx
	}
	// requestAnimationFrame(drawShips);
}

function draw(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	if(started == 0) {
		drawStart();
	}
	if(started == 1){
	    drawBricks();
	    drawBall();
	    drawPaddle();
	    drawPoints();
	    drawLives();
	    collisionDetection();
		if(y + dy < ballRadius) {
			sound.play();
		    dy = -dy;
		} else if(y + dy > canvas.height-ballRadius){
			if(x > paddleX - ballRadius && x < paddleX + paddleWidth + ballRadius) {
				sound.play();
	        	dy = -dy;
	    	}
	    	else {
	    		lives--;
				x = canvas.width/2;
				y = canvas.height-30;
				if(dx < 0){
					dx = -dx;
				}
				if(dx > 0){
					dx = dx;
				}
				if(dy < 0){
					dy = dy;
				}
				if(dy > 0){
					dy = -dy;
				}
				paddleX = (canvas.width-paddleWidth)/2;
	    	}
		}
	    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
	    	sound.play();
	    	dx = -dx;
		}
	    x += dx;
	    y += dy;
	}
	if(!lives){
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawEnd();
	} else if(points == brickRowCount*brickColumnCount) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawWin();
	} else {
		requestAnimationFrame(draw);
	}
}
setInterval(drawShips, 1000);

