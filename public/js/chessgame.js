const socket = io();
const chess = new Chess();
const boardElement = document.querySelector(".chessboard");

let draggedPiece = null;
let sourceSquare = null;
let playerRole = null;

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
        pieceElement.innerText = getPieceUnicode(square.type, square.color); // <-- Use Unicode
        pieceElement.draggable = playerRole === square.color;
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
        if (draggedPiece) {
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
  if(playerRole ==="b"){
    boardElement.classList.add("flipped");
  }
  else{
    boardElement.classList.remove("flipped");
  }
};

const getPieceUnicode = (type, color) => {
  const unicodePieces = {
    p: { w: "\u2659", b: "\u265F" },
    r: { w: "\u2656", b: "\u265C" },
    n: { w: "\u2658", b: "\u265E" },
    b: { w: "\u2657", b: "\u265D" },
    q: { w: "\u2655", b: "\u265B" },
    k: { w: "\u2654", b: "\u265A" },
  };
  return unicodePieces[type][color];
};

const handleMove = (source,target) => {
    const move = {
      from: `${String.fromCharCode(97+source.col)}${8-source.row}`,
      to: `${String.fromCharCode(97+target.col)}${8-target.row}`,
      promotion: "q",
    };
    const result = chess.move(move);
        if (result) {
            renderBoard(); // Show move immediately
            socket.emit("move", move); // Inform server
        } else {
        console.warn("Invalid move:", move);
        }
};
socket.on("playerRole",function(role){
    playerRole = role
    renderBoard();
})

socket.on("spectatorRole",function(){
    playerRole = null
    renderBoard();
})

socket.on("broadState",function(fen){
    chess.load(fen);
    renderBoard();
})

socket.on("move",function(move){
    chess.move(move);
    renderBoard();
})
// Call renderBoard to display the chessboard
renderBoard();
