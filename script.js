const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
const popup_mssg = document.getElementById('popup-mssg');
const grid = 15;
const paddleHeight = grid * 5; // 80
const maxPaddleY = canvas.height - grid - paddleHeight;


var paddleSpeed = 6;
var leftPaddleSpeed = 5.45;
var ballSpeed = 5;

//added variables
var playerScore1 = 0;
var playerScore2 = 0;
var scores = playerScore1 + " - " + playerScore2;
document.getElementById('scoreboard').innerHTML = scores;

const leftPaddle = {
  // start in the middle of the game on the left side
  x: grid * 2,
  y: canvas.height / 2 - paddleHeight / 2,
  width: grid,
  height: paddleHeight,

  // paddle velocity
  dy: 0
};
const rightPaddle = {
  // start in the middle of the game on the right side
  x: canvas.width - grid * 3,
  y: canvas.height / 2 - paddleHeight / 2,
  width: grid,
  height: paddleHeight,

  // paddle velocity
  dy: 0
};
const ball = {
  // start in the middle of the game
  x: canvas.width / 2,
  y: canvas.height / 2,
  width: grid,
  height: grid,

  // keep track of when need to reset the ball position
  resetting: false,

  // ball velocity (start going to the top-right corner)
  dx: ballSpeed,
  dy: -ballSpeed
};


// check for collision between two objects using axis-aligned bounding box (AABB)
// @see https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
function collides(obj1, obj2) {
  return obj1.x < obj2.x + obj2.width &&
         obj1.x + obj1.width > obj2.x &&
         obj1.y < obj2.y + obj2.height &&
         obj1.y + obj1.height > obj2.y;
}

// function updates player scores
//function updateScore() {
   // scoreText.textContent = `${playerScore1} : ${playerScore2}`;
//}

// game loop
function loop() {
  requestAnimationFrame(loop);
  context.clearRect(0,0,canvas.width,canvas.height);

  // move paddles by their velocity
  leftPaddle.y += leftPaddle.dy;
  rightPaddle.y += rightPaddle.dy;

  // prevent paddles from going through walls
  if (leftPaddle.y < grid) {
    leftPaddle.y = grid;
  }
  else if (leftPaddle.y > maxPaddleY) {
    leftPaddle.y = maxPaddleY;
  }

  if (rightPaddle.y < grid) {
    rightPaddle.y = grid;
  }
  else if (rightPaddle.y > maxPaddleY) {
    rightPaddle.y = maxPaddleY;
  }

  // draw paddles
  context.fillStyle = 'white';
  context.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
  context.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);

  // move ball by its velocity
  ball.x += ball.dx;
  ball.y += ball.dy;
  
  // left paddle w/ ball movement
  if(ball.dy < 0) {
    leftPaddle.dy = -leftPaddleSpeed;
  }
  if (ball.dy > 0) {
    leftPaddle.dy = leftPaddleSpeed;
  }

  // prevent ball from going through walls by changing its velocity
  if (ball.y < grid) {
    ball.y = grid;
    ball.dy *= -1;
  }
  else if (ball.y + grid > canvas.height - grid) {
    ball.y = canvas.height - grid * 2;
    ball.dy *= -1;
  }

  // reset ball if it goes past paddle (but only if we haven't already done so)
  if ( (ball.x < 0 || ball.x > canvas.width) && !ball.resetting) {
    ball.resetting = true;
      // if ball x < 0 right player2 gets a point
      if (ball.x < 0) {
          playerScore2++;
          scores = playerScore1 + " - " + playerScore2;
          document.getElementById('scoreboard').innerHTML = scores;
      }
      if(ball.x > canvas.width){
        playerScore1++; 
        scores = playerScore1 + " - " + playerScore2;
        document.getElementById('scoreboard').innerHTML = scores;
          ball.resetting = true;
        }
    // rest before launching ball again
    setTimeout(() => {
      ball.resetting = false;
      ball.x = canvas.width / 2;
      ball.y = canvas.height / 2;
    }, 400);
  }

  // check to see if ball collides with paddle. if they do change x velocity
  if (collides(ball, leftPaddle)) {
    ball.dx *= -1;

    // move ball next to the paddle otherwise the collision will happen again
    // in the next frame
    ball.x = leftPaddle.x + leftPaddle.width;
  }
  else if (collides(ball, rightPaddle)) {
    ball.dx *= -1;

    // move ball next to the paddle otherwise the collision will happen again
    // in the next frame
    ball.x = rightPaddle.x - ball.width;
  }

  // draw ball
  context.fillRect(ball.x, ball.y, ball.width, ball.height);

  // draw walls
  context.fillStyle = 'lightgrey';
  context.fillRect(0, 0, canvas.width, grid);
  context.fillRect(0, canvas.height - grid, canvas.width, canvas.height);

  // draw dotted line down the middle
  for (let i = grid; i < canvas.height - grid; i += grid * 2) {
    context.fillRect(canvas.width / 2 - grid / 2, i, grid, grid);
  }
  
  if(playerScore1 == 7 || playerScore2 == 7) {
    handlePopUp();
  }
}

// listen to keyboard events to move the paddles
document.addEventListener('keydown', function(e) {
 

  // up arrow key
  if (e.which === 38) {
    rightPaddle.dy = -paddleSpeed;
  }
  // down arrow key
  else if (e.which === 40) {
    rightPaddle.dy = paddleSpeed;
  }
});

// listen to keyboard events to stop the paddle if key is released
document.addEventListener('keyup', function(e) {
  if (e.which === 38 || e.which === 40) {
    rightPaddle.dy = 0;
  }
});

// Popup for outcome of game
function handlePopUp() {
  if (playerScore1 == 7) {
    document.getElementById('outcome').innerHTML = "It was a good try, better luck next time!";
    
  }
  else {
    document.getElementById('outcome').results.innerHTML = "Jeez, they just let anyone win nowadays. Nice Job Champ!";
  }
  showPopUp();
  
  // stop ball once game ends
  ball.resetting = true;
}
// start game again
function rematch() {
  playerScore1 = 0;
  playerScore2 = 0;
  score = playerScore1 + " - " + playerScore2;
  document.getElementById('scoreboard').innerHTML = scores;
  
  popup_mssg.style.display = "none";
  
  setTimeout(() => {
    ball.resetting = false;
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
  }, 400);
}

function showPopup(){
        popup_mssg.style.display = "block";
}
  
  
  
// start the game
requestAnimationFrame(loop);
