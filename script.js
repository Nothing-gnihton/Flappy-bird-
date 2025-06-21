const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const startScreen = document.querySelector('.start-screen');
const gameOverScreen = document.querySelector('.game-over-screen');
const startBtn = document.getElementById('start-btn');
const tryAgainBtn = document.getElementById('try-again-btn');
const finalScoreEl = document.getElementById('final-score');

let topScores = [0, 0, 0];

let bird, pipes, score, gravity, birdVelocity, gameInterval;

function startGame() {
    startScreen.style.display = 'none';
    gameOverScreen.style.display = 'none';
    canvas.style.display = 'block';

    bird = { x: 80, y: 250, width: 40, height: 40 };
    pipes = [];
    score = 0;
    gravity = 0.5;
    birdVelocity = 0;

    document.addEventListener('keydown', flap);
    gameInterval = setInterval(gameLoop, 20);
}

function flap() {
    birdVelocity = -8;
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Bird
    birdVelocity += gravity;
    bird.y += birdVelocity;

    ctx.fillStyle = 'yellow';
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);

    // Pipes
    if (pipes.length === 0 || pipes[pipes.length - 1].x < 250) {
        let pipeTopHeight = Math.random() * 200 + 50;
        let gap = 150;
        pipes.push({ x: canvas.width, y: 0, width: 50, height: pipeTopHeight });
        pipes.push({ x: canvas.width, y: pipeTopHeight + gap, width: 50, height: canvas.height - (pipeTopHeight + gap) });
    }

    for (let i = 0; i < pipes.length; i++) {
        let pipe = pipes[i];
        pipe.x -= 4;
        ctx.fillStyle = 'green';
        ctx.fillRect(pipe.x, pipe.y, pipe.width, pipe.height);

        // Collision detection
        if (bird.x < pipe.x + pipe.width && bird.x + bird.width > pipe.x &&
            bird.y < pipe.y + pipe.height && bird.y + bird.height > pipe.y) {
            gameOver();
        }

        if (pipe.x + pipe.width < 0) {
            pipes.splice(i, 1);
            i--;
            if (i % 2 === 1) score++;
        }
    }

    // Ground collision
    if (bird.y + bird.height > canvas.height || bird.y < 0) {
        gameOver();
    }

    // Score display
    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.fillText(score, 10, 50);
}

function gameOver() {
    clearInterval(gameInterval);
    document.removeEventListener('keydown', flap);
    canvas.style.display = 'none';
    gameOverScreen.style.display = 'block';

    finalScoreEl.textContent = score;

    topScores.push(score);
    topScores.sort((a, b) => b - a);
    topScores = topScores.slice(0, 3);

    document.getElementById('score1').textContent = topScores[0] || 0;
    document.getElementById('score2').textContent = topScores[1] || 0;
    document.getElementById('score3').textContent = topScores[2] || 0;
}

startBtn.addEventListener('click', startGame);
tryAgainBtn.addEventListener('click', startGame);
