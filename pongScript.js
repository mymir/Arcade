//Canvas
var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");
var color = "#ff0090";
//Ball
var cubeWidth = 15;
var x = (canvas.width - cubeWidth)/2;
var y = canvas.height/2 - 30;
var dy = -4;
var dx = 5;
//Paddles
var paddleHeight = 90;
var paddleWidth = 13;
var paddleY = (canvas.height-paddleHeight)/2;
//Event Listeners
document.addEventListener("mousemove", mouseMoveHandler, false);
//Player Status
var lives = 3;
var points = 0;
var started = 0;
var sound = new sound("beep.mp3");

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
	var relativeY = e.clientY + paddleHeight - canvas.offsetTop;
	if(relativeY > -paddleHeight/2  && relativeY < canvas.height - paddleHeight/2) {
        paddleY = relativeY;
    }
}

function start(){
	started = 1;
}

function speedUp(){
	if(points%5 == 0){
		if(dx < 0){
			dx--;
		}
		if(dx > 0){
			dx++;
		}
		if(dy < 0){
			dy--;
		}
		if(dy > 0){
			dy++;
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
}

function drawStart() {
	ctx.font = "50px Arial";
	ctx.fillStyle = color;
	ctx.fillText("CLICK HERE TO PLAY", canvas.width/2 - 260, canvas.height/2);
}

function drawLives(){
	ctx.font = "16px Arial"
	ctx.fillStyle = color;
	ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}

function drawPoints(){
	ctx.font = "16px Arial"
	ctx.fillStyle = color;
	ctx.fillText("Points: "+points, 8, 20);
}

function drawCube(){
    ctx.beginPath();
    ctx.rect(x, y, cubeWidth, cubeWidth);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

function drawPaddles(){
	ctx.beginPath();
	ctx.rect(canvas.width-paddleWidth, paddleY, paddleWidth, paddleHeight);
	ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
	ctx.rect(0, paddleY, paddleWidth, paddleHeight);
	ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

function drawLine(){
	ctx.beginPath();
	ctx.rect((canvas.width-5)/2, 0, 5, canvas.height);
	ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

function draw(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	if(started == 0) {
		drawStart();
	}
	if(started == 1){
	    drawCube();
	    drawPaddles();
	    drawPoints();
	    drawLives();
	    drawLine();
		if(x + dx < 0) {
			if(y > paddleY - cubeWidth && y < paddleY + paddleHeight + cubeWidth) {
				sound.play();
				points++;
				speedUp();
	        	dx = -dx;
	    	}
	    	else {
	    		lives--;
				x = (canvas.width - cubeWidth)/2;
				y = canvas.height/2;
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
				paddleY = (canvas.height-paddleHeight)/2;
	    	}
		} else if(x + dx > canvas.width-cubeWidth){
			if(y > paddleY - cubeWidth && y < paddleY + paddleHeight + cubeWidth) {
				sound.play();
				points++;
				speedUp();
	        	dx = -dx;
	    	}
	    	else {
	    		lives--;
				x = (canvas.width - cubeWidth)/2;
				y = canvas.height/2;
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
				paddleY = (canvas.height-paddleHeight)/2;
			}
		}
	    if(y + dy > canvas.height-cubeWidth || y + dy < cubeWidth) {
	    	sound.play();
	    	dy = -dy;
		}
	    x += dx;
	    y += dy;
	}
	if(!lives){
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawEnd();
	} else if(points == 100) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawWin();
	} else {
		requestAnimationFrame(draw);
	}
}
draw();


