document.addEventListener("DOMContentLoaded", function () {
    // Select elements
    const loadingBtn = document.getElementById("loadingBtn");
    const rulesBtn = document.getElementById("rulesBtn");
    const gameRules = document.getElementById("gameRules");
    const closeBtn = document.getElementById("closeRules");
    const playBtn = document.getElementById("playBtn");
    const gameBoard = document.getElementById("gameBoard");
    const replayButton = document.getElementById("replayButton");

    let gameOver = false; // Track if the game is over

    // Show loading for 4 seconds
    setTimeout(() => {
        loadingBtn.style.display = "none";
        rulesBtn.classList.remove("hidden");
    }, 4000);

    // Show game rules
    rulesBtn.addEventListener("click", function () {
        gameRules.classList.remove("hidden");
        rulesBtn.style.display = "none";
    });

    // Hide game rules & show "START" button
    closeBtn.addEventListener("click", function () {
        gameRules.classList.add("hidden");
        playBtn.classList.remove("hidden");
    });

    // Start the game
    playBtn.addEventListener("click", function () {
        playBtn.style.display = "none";
        gameBoard.classList.remove("hidden");
        initializeGrid();
    });

    // Restart game when replay is clicked
    replayButton.addEventListener("click", restartGame);
    
    // Game logic
    const rows = 5, cols = 5;
    let bombCount, grid = [], score = 0, highScore = localStorage.getItem("highScore") ? parseInt(localStorage.getItem("highScore")) : 0;
    let timer, timeLeft = 60;
    document.getElementById("highScore").innerText = highScore;

    function initializeGrid() {
        gameOver = false; // Reset game state
        clearInterval(timer);
        timeLeft = 60;
        document.getElementById("timer").innerText = timeLeft;
        score = 0;
        document.getElementById("score").innerText = score;
        bombCount = Math.floor(Math.random() * 6) + 5; // Random between 5 and 10
        document.getElementById("mineCount").innerText = bombCount;

        timer = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                document.getElementById("timer").innerText = timeLeft;
            } else {
                clearInterval(timer);
                endGame("Time's up! Game Over.");
            }
        }, 1000);

        const gridElement = document.getElementById("grid");
        gridElement.innerHTML = "";
        grid = Array.from({ length: rows }, () => Array(cols).fill(0));

        let placedBombs = 0;
        while (placedBombs < bombCount) {
            let r = Math.floor(Math.random() * rows);
            let c = Math.floor(Math.random() * cols);
            if (grid[r][c] !== "B") {
                grid[r][c] = "B";
                placedBombs++;
            }
        }

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (grid[r][c] !== "B") {
                    grid[r][c] = Math.floor(Math.random() * 10) + 1;
                }
            }
        }

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                let cell = document.createElement("div");
                cell.classList.add("cell");
                cell.dataset.row = r;
                cell.dataset.col = c;
                cell.addEventListener("click", () => revealCell(r, c, cell));
                gridElement.appendChild(cell);
            }
        }
    }

    function revealCell(r, c, cell) {
        if (gameOver) return; // Stop interaction if the game is over

        if (grid[r][c] === "B") {
            cell.classList.add("bomb");
            cell.innerText = "💣";
            endGame("You landed on a mine!");
            return;
        }
        cell.classList.add("revealed");
        cell.innerText = grid[r][c];
        score += grid[r][c];
        document.getElementById("score").innerText = score;

        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore);
            document.getElementById("highScore").innerText = highScore;
        }
    }

    function endGame(message) {
        clearInterval(timer);
        alert(message);
        gameOver = true; // Stop further interactions
        replayButton.classList.remove("hidden");
    }

    function restartGame() {
        replayButton.classList.add("hidden");
        initializeGrid();
    }
});
