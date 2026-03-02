const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth > 500 ? 400 : window.innerWidth - 20;
canvas.height = window.innerHeight > 700 ? 600 : window.innerHeight - 20;

let gameState = "start"; 
// "start" | "playing" | "gameover"

let birdImg = new Image();
birdImg.src = "gf.png";

let bgMusic = document.getElementById("bgMusic");
let voice = document.getElementById("voice");

let gravity = 0.5;
let velocity = 0;
let birdY = 250;
let score = 0;
let pipes = [];

function handleInput() {

  if (gameState === "start") {
    gameState = "playing";
    document.querySelector(".overlay").style.display = "none";

    bgMusic.currentTime = 0;
    bgMusic.play().catch(() => {});
  }

  else if (gameState === "gameover") {
    resetGame();
    return;
  }

  if (gameState === "playing") {
    velocity = -8;
  }
}

// Desktop keyboard
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    handleInput();
  }
});

// Mobile tap
document.addEventListener("touchstart", () => {
  handleInput();
});

// Mouse click
document.addEventListener("click", () => {
  handleInput();
});

function createPipe() {
  let gap = 160;
  let topHeight = Math.random() * 250 + 50;

  pipes.push({
    x: canvas.width,
    top: topHeight,
    bottom: canvas.height - topHeight - gap
  });
}

setInterval(createPipe, 2000);

function update() {
  if (gameState !== "playing") return;

  velocity += gravity;
  birdY += velocity;

  if (birdY + 60 > canvas.height || birdY < 0) {
    endGame();   
  }

  pipes.forEach(pipe => {
    pipe.x -= 2;

    if (pipe.x + 60 < 0) {
      pipes.shift();
      score++;
    }

    if (
      80 < pipe.x + 60 &&
      80 + 60 > pipe.x &&
      (birdY < pipe.top || birdY + 60 > canvas.height - pipe.bottom)
    ) {
      endGame();
    }
  });
}

function drawBird() {
  ctx.save();
  ctx.beginPath();
  ctx.arc(110, birdY + 30, 30, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(birdImg, 80, birdY, 60, 60);
  ctx.restore();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  pipes.forEach(pipe => {
    ctx.fillStyle = "#ff69b4";
    ctx.fillRect(pipe.x, 0, 60, pipe.top);
    ctx.fillRect(pipe.x, canvas.height - pipe.bottom, 60, pipe.bottom);
  });

  drawBird();

  ctx.fillStyle = "white";
  ctx.font = "24px Segoe UI";
  ctx.fillText("Score: " + score, 20, 40);
  
  if (gameState === "gameover") {
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(50, 200, 300, 200);

    ctx.fillStyle = "white";
    ctx.font = "28px Segoe UI";
    ctx.textAlign = "center";
    ctx.fillText("Game Over 💔", canvas.width / 2, 250);

    ctx.font = "22px Segoe UI";
    ctx.fillText("Final Score: " + score, canvas.width / 2, 290);

    ctx.font = "16px Segoe UI";
    ctx.fillText("Press SPACE to Try Again", canvas.width / 2, 330);

    ctx.textAlign = "left"; // reset alignment
  }
}

function resetGame() {
  birdY = 250;
  velocity = 0;
  score = 0;
  pipes = [];
  gameState = "start";
  document.querySelector(".overlay").style.display = "block";
}

function endGame() {
  if (gameState !== "playing") return; // prevent double trigger

  gameState = "gameover";

  bgMusic.pause();
  bgMusic.currentTime = 0;

  voice.pause();
  voice.currentTime = 0;

  setTimeout(() => {
    voice.play();
  }, 150);
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();