const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");
const playagain=document.getElementById("playagain");

// Constants
const paddleWidth = 100, paddleHeight = 10, ballRadius = 10;
const paddleY = canvas.height - paddleHeight - 10; // Bottom position for paddle
const paddleSpeed = 5, ballSpeed = 4;

// Variables
let paddleX = (canvas.width - paddleWidth) / 2;
let ballX = canvas.width / 2, ballY = canvas.height / 2;
let ballSpeedX = ballSpeed, ballSpeedY = -ballSpeed;
let score = 0, gameOver = false;

function reset() {
    paddleX = (canvas.width - paddleWidth) / 2;
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = ballSpeed;
    ballSpeedY = -ballSpeed;
    score = 0;
    gameOver = false;
    playagain.style.display = "none";
    gameLoop();
}

// Paddle movement flags
let moveLeft = false, moveRight = false;

// Functions
function drawRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function drawCircle(x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
}

function drawText(text, x, y, font, color) {
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
}

function update() {
    if (gameOver) return;

    // Move paddle
    if (moveLeft && paddleX > 0) {
        paddleX -= paddleSpeed;
    }
    if (moveRight && paddleX < canvas.width - paddleWidth) {
        paddleX += paddleSpeed;
    }

    // Move the ball
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Ball collision with walls
    if (ballX - ballRadius <= 0 || ballX + ballRadius >= canvas.width) {
        ballSpeedX *= -1;
    }
    if (ballY - ballRadius <= 0) {
        ballSpeedY *= -1;
    }

    // Ball collision with paddle
    if (
        ballY + ballRadius >= paddleY &&
        ballX >= paddleX &&
        ballX <= paddleX + paddleWidth
    ) {
        ballSpeedY *= -1;
        score++; // Increment score on successful bounce
    }

    // Ball falls below the paddle
    if (ballY - ballRadius > canvas.height) {
        gameOver = true;
        playagain.style.display="block";
    }
}

function draw() {
    // Clear the canvas
    drawRect(0, 0, canvas.width, canvas.height, "black");

    // Draw paddle
    drawRect(paddleX, paddleY, paddleWidth, paddleHeight, "white");

    // Draw ball
    drawCircle(ballX, ballY, ballRadius, "white");

    // Draw score
    drawText(`Score: ${score}`, 10, 30, "20px Arial", "white");

    // Draw game over text if game ends
    if (gameOver) {
        drawText("Game Over!", canvas.width / 2 - 70, canvas.height / 2, "30px Arial", "red");
        drawText(`Final Score: ${score}`, canvas.width / 2 - 85, canvas.height / 2 + 40, "20px Arial", "white");
        
    }
}

function gameLoop() {
    update();
    draw();
    if (!gameOver) {
        requestAnimationFrame(gameLoop);
    }
}

// Paddle control
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
        moveLeft = true;
    }
    if (event.key === "ArrowRight") {
        moveRight = true;
    }
});

document.addEventListener("keyup", (event) => {
    if (event.key === "ArrowLeft") {
        moveLeft = false;
    }
    if (event.key === "ArrowRight") {
        moveRight = false;
    }
});

playagain.addEventListener("click",reset);
reset();

// Start the game loop
gameLoop();