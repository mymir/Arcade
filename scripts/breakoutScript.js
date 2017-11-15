//Canvas
var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");
var color = "#ff0090";
//Ball
var x = canvas.width/2;
var y = canvas.height-30;
var dx = 5;
var dy = -6;
var ballRadius = 10;
//Paddle
var paddleHeight = 10;
var paddleWidth = 90;
var paddleX = (canvas.width-paddleWidth)/2;
//Brick Variables
var brickRowCount = 5;
var brickColumnCount = 9;
var brickWidth = 70;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var bricks = [];
for(c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
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

function drawBricks(){
	for(c=0; c<brickColumnCount; c++){
		for(r=0; r<brickRowCount; r++){
			if(bricks[c][r].status == 1){
				var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
	            var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
	            bricks[c][r].x = brickX;
	            bricks[c][r].y = brickY;
	            ctx.beginPath();
	            ctx.rect(brickX, brickY, brickWidth, brickHeight);
	            ctx.fillStyle = color;
	            ctx.fill();
	            ctx.closePath();
			}
		}
	}
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
draw();


