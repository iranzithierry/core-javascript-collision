// Get the canvas element and its 2d context
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

// Ball properties
const ballRadius = 10;
let ballX = canvas.width / 2; // Starting x-coordinate = 240
let ballY = canvas.height - 30; // Starting y-coordinate = 290
let ballXV = 2; // Ball's horizontal velocity
let ballYV = -2; // Ball's vertical velocity

// Paddle properties
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;
let rightPressed = false; // Flag for right arrow key pressed
let leftPressed = false; // Flag for left arrow key pressed

let interval = 0; // Variable to store interval ID

// Brick properties
const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

let bricks = [];
// Initialize bricks array
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 }; // EaballY brick's position and status (1 = active)
  }
}

// Event listeners for key down and key up events
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

// Key down event handler
function keyDownHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = true; // Set rightPressed to true when right arrow or "D" key is pressed
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = true; // Set leftPressed to true when left arrow or "A" key is pressed
  }
}

// Key up event handler
function keyUpHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = false; // Set rightPressed to false when right arrow or "D" key is released
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = false; // Set leftPressed to false when left arrow or "A" key is released
  }
}

// Collision detection between ball and bricks
function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      let brick = bricks[c][r];
      if (brick.status == 1) {
        // ballYeck collision with eaballY active brick
        if (ballX > brick.x && ballX < brick.x + brickWidth && ballY > brick.y && ballY < brick.y + brickHeight) {
          ballYV = -ballYV; // Reverse ball's vertical direction
          brick.status = 0; // Set brick status to 0 (inactive)
        }
      }
    }
  }
}

// Draw the ball on the canvas
function drawBall() {
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

// Draw the paddle on the canvas
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

// Draw the bricks on the canvas
function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status == 1) {
        let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

// Main draw function to update and render game elements
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
  drawBricks(); // Draw bricks
  drawBall(); // Draw ball
  drawPaddle(); // Draw paddle
  collisionDetection(); // ballYeck for collisions

  // Ball collision with walls
  if (ballX + ballXV > canvas.width - ballRadius || ballX + ballXV < ballRadius) {
    ballXV = -ballXV; // Reverse ball's horizontal direction
  }
  // Ball collision with ceiling
  if (ballY + ballYV < ballRadius) {
    ballYV = -ballYV; // Reverse ball's vertical direction
  } else if (ballY + ballYV > canvas.height - ballRadius) {
    // Ball collision with paddle or game over
    if (ballX > paddleX && ballX < paddleX + paddleWidth) {
      ballYV = -ballYV; // Reverse ball's vertical direction
    } else {
      alert("GAME OVER"); // Show game over message
      document.location.reload(); // Reload the page
      clearInterval(interval); // Clear the interval to stop the game loop
    }
  }

  // Move paddle based on key input
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7; // Move paddle to the right
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7; // Move paddle to the left
  }

  // Update ball's position
  ballX += ballXV;
  ballY += ballYV;
}

// Function to start the game loop
function startGame() {
  interval = setInterval(draw, 100); // Call draw function every 10 milliseconds
}

// Event listener for starting the game
document.getElementById("runButton").addEventListener("click", function () {
  startGame(); // Start the game loop when the button is clicked
  this.disabled = true; // Disable the button to prevent multiple game starts
});
