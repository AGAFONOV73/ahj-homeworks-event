import "./styles.css";
import goblinImage from "./assets/goblin.png";
import hammerImage from "./assets/hammer.png";

class WhackAGoblinGame {
  constructor() {
    this.board = document.getElementById("gameBoard");
    this.scoreElement = document.getElementById("score");
    this.missesElement = document.getElementById("misses");
    this.startButton = document.getElementById("startButton");
    this.score = 0;
    this.misses = 0;
    this.MAX_MISSES = 5;
    this.gameInterval = null;
    this.goblinTimeout = null;
    this.currentPosition = null;
    this.goblin = null;
    this.goblinVisible = false;
    this.gameActive = false;

    this.initBoard();
    this.setupCursor();
    this.bindEvents();
  }

  initBoard() {
    this.board.innerHTML = "";

    for (let i = 0; i < 16; i++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.index = i;
      cell.addEventListener("click", () => this.handleCellClick(cell));
      this.board.appendChild(cell);
    }

    this.goblin = document.createElement("img");
    this.goblin.className = "goblin";
    this.goblin.src = goblinImage;
    this.goblin.alt = "Goblin";
  }

  setupCursor() {
    document.body.style.cursor = `url(${hammerImage}) 16 16, pointer`;
  }

  handleCellClick(cell) {
    if (!this.gameActive) return;

    if (this.goblinVisible && cell === this.board.children[this.currentPosition]) {
      
      this.score++;
      this.scoreElement.textContent = this.score;
      this.hideGoblin();
      this.resetMisses();
    } else if (this.goblinVisible) {
      
      this.addMiss();
    }
  }

  showRandomGoblin() {
    if (!this.gameActive) return;

    this.hideGoblin();

    let newPosition;
    do {
      newPosition = Math.floor(Math.random() * 16);
    } while (newPosition === this.currentPosition);

    const newCell = this.board.children[newPosition];
    newCell.appendChild(this.goblin);
    this.currentPosition = newPosition;
    this.goblinVisible = true;

    
    this.goblinTimeout = setTimeout(() => {
      if (this.goblinVisible && this.gameActive) {
        this.addMiss();
        this.hideGoblin();
      }
    }, 1000);
  }

  hideGoblin() {
    if (this.currentPosition !== null && this.goblinVisible) {
      const currentCell = this.board.children[this.currentPosition];
      if (currentCell.contains(this.goblin)) {
        currentCell.removeChild(this.goblin);
      }
    }
    this.goblinVisible = false;
    if (this.goblinTimeout) {
      clearTimeout(this.goblinTimeout);
    }
  }

  addMiss() {
    this.misses++;
    this.updateMissesDisplay();

    if (this.misses >= this.MAX_MISSES) {
      this.endGame();
    }
  }

  resetMisses() {
    this.misses = 0;
    this.updateMissesDisplay();
  }

  updateMissesDisplay() {
    this.missesElement.textContent = `${this.misses}/${this.MAX_MISSES}`;

    
    if (this.misses >= 3) {
      this.missesElement.style.color = "#ff0000";
      this.missesElement.style.fontWeight = "bold";
    } else {
      this.missesElement.style.color = "";
      this.missesElement.style.fontWeight = "";
    }
  }

  startGame() {
    this.gameActive = true;
    this.score = 0;
    this.misses = 0;
    this.scoreElement.textContent = this.score;
    this.updateMissesDisplay();
    this.startButton.disabled = true;

    
    setTimeout(() => {
      this.gameInterval = setInterval(() => {
        if (!this.gameActive) {
          clearInterval(this.gameInterval);
          return;
        }
        this.showRandomGoblin();
      }, 1500); 

      
      this.showRandomGoblin();
    }, 500);
  }

  endGame() {
    this.gameActive = false;
    this.hideGoblin();
    clearInterval(this.gameInterval);
    
    
    const cells = document.querySelectorAll(".cell");
    cells.forEach(cell => {
      cell.style.pointerEvents = "none";
      cell.style.opacity = "0.6";
    });

    setTimeout(() => {
      alert(
        `Game Over!\n\nПропущено гоблинов: ${this.misses}/5\nВаш счет: ${this.score}\n\nНажмите OK для перезапуска`
      );
      location.reload();
    }, 300);
  }

  bindEvents() {
    this.startButton.addEventListener("click", () => this.startGame());
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new WhackAGoblinGame();
});