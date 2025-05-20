const socket = io(window.location.origin, {
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 10000
});
const chess = new Chess();
const boardElement = document.querySelector(".chessboard");
const startScreen = document.querySelector(".start-screen");
const startButton = document.getElementById("startGame");
const gameStatus = document.querySelector(".game-status");

let draggedPiece = null;
let sourceSquare = null;
let playerRole = null;
let gameStarted = false;

// Get room ID from URL
const getRoomId = () => {
  const path = window.location.pathname;
  const match = path.match(/\/game\/([^\/]+)/);
  return match ? match[1] : 'default';
};

// Join room on connection
socket.on('connect', () => {
  console.log('Connected to server');
  const roomId = getRoomId();
  socket.emit('joinRoom', roomId);
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
  gameStatus.textContent = 'Connection lost. Reconnecting...';
});

socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
  gameStatus.textContent = 'Connection error. Please check your network and refresh the page.';
  gameStatus.classList.remove('hidden');
});

socket.on('reconnect_attempt', (attemptNumber) => {
  console.log(`Reconnection attempt ${attemptNumber}`);
  gameStatus.textContent = `Reconnecting... Attempt ${attemptNumber}/5`;
  gameStatus.classList.remove('hidden');
});

socket.on('reconnect', (attemptNumber) => {
  console.log(`Reconnected after ${attemptNumber} attempts`);
  gameStatus.textContent = 'Reconnected! Game will resume shortly...';
  setTimeout(() => {
    const roomId = getRoomId();
    socket.emit('joinRoom', roomId);
  }, 1000);
});

// Handle game start
startButton.addEventListener('click', () => {
  const roomId = getRoomId();
  socket.emit('startGame', roomId);
  startScreen.classList.add('hidden');
  gameStatus.classList.remove('hidden');
});

const getPieceUnicode = (type, color) => {
  const unicodePieces = {
    p: { w: "♙", b: "♟" },
    r: { w: "♖", b: "♜" },
    n: { w: "♘", b: "♞" },
    b: { w: "♗", b: "♝" },
    q: { w: "♕", b: "♛" },
    k: { w: "♔", b: "♚" }
  };
  return unicodePieces[type][color];
};

const renderBoard = () => {
  const board = chess.board();
  boardElement.innerHTML = "";
  board.forEach((row, rowindex) => {
    row.forEach((square, squareindex) => {
      const squareElement = document.createElement("div");
      squareElement.classList.add(
        "square",
        (rowindex + squareindex) % 2 === 0 ? "light" : "dark"
      );
      squareElement.dataset.row = rowindex;
      squareElement.dataset.col = squareindex;

      if (square) {
        const pieceElement = document.createElement("div");
        pieceElement.classList.add(
          "piece",
          square.color === "w" ? "white" : "black"
        );
        pieceElement.innerText = getPieceUnicode(square.type, square.color);
        pieceElement.draggable = gameStarted && playerRole === square.color;
        pieceElement.addEventListener("dragstart", (e) => {
          if (pieceElement.draggable) {
            draggedPiece = pieceElement;
            sourceSquare = { row: rowindex, col: squareindex };
            e.dataTransfer.setData("text/plain", "");
          }
        });
        pieceElement.addEventListener("dragend", () => {
          draggedPiece = null;
          sourceSquare = null;
        });
        squareElement.appendChild(pieceElement);
      }
      squareElement.addEventListener("dragover", (e) => {
        e.preventDefault();
      });
      squareElement.addEventListener("drop", (e) => {
        e.preventDefault();
        if (draggedPiece && gameStarted) {
          const targetSquare = {
            row: parseInt(squareElement.dataset.row),
            col: parseInt(squareElement.dataset.col),
          };
          handleMove(sourceSquare, targetSquare);
        }
      });
      boardElement.appendChild(squareElement);
    });
  });
  
  // Handle board flipping for black player
  if (playerRole === "b") {
    boardElement.classList.add("flipped");
  } else {
    boardElement.classList.remove("flipped");
  }
};

const handleMove = (source, target) => {
  if (!gameStarted) {
    console.warn("Game hasn't started yet");
    return;
  }

  if (!playerRole) {
    console.warn("You are a spectator");
    return;
  }

  const move = {
    from: `${String.fromCharCode(97 + source.col)}${8 - source.row}`,
    to: `${String.fromCharCode(97 + target.col)}${8 - target.row}`,
    promotion: "q" // Always promote to queen for simplicity
  };
  
  try {
    const result = chess.move(move);
    if (result) {
      renderBoard();
      socket.emit("move", move);
      gameStatus.textContent = "Waiting for opponent's move...";
    } else {
      console.warn("Invalid move:", move);
      gameStatus.textContent = "Invalid move!";
      setTimeout(() => {
        gameStatus.textContent = playerRole === "w" ? "Your turn" : "Opponent's turn";
      }, 2000);
    }
  } catch (e) {
    console.error("Invalid move:", e);
    gameStatus.textContent = "Invalid move!";
    setTimeout(() => {
      gameStatus.textContent = playerRole === "w" ? "Your turn" : "Opponent's turn";
    }, 2000);
  }
};

// Socket event handlers
socket.on("playerRole", (role) => {
  playerRole = role;
  renderBoard();
});

socket.on("spectatorRole", () => {
  playerRole = null;
  renderBoard();
});

socket.on("broadState", (fen) => {
  chess.load(fen);
  renderBoard();
});

socket.on("move", (move) => {
  chess.move(move);
  renderBoard();
});

socket.on("gameStarted", () => {
  gameStarted = true;
  gameStatus.textContent = playerRole === "w" ? "Your turn" : "Opponent's turn";
  renderBoard();
});

socket.on("error", (message) => {
  console.warn("Game error:", message);
  alert(message);
});

socket.on("gameOver", (result) => {
  console.log("Game over:", result);
  gameStatus.textContent = result;
  gameStarted = false;
  setTimeout(() => {
    startScreen.classList.remove('hidden');
    gameStatus.classList.add('hidden');
  }, 3000);
});

// Initialize the board
renderBoard();
