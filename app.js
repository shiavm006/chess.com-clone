const express = require("express");
const socket = require("socket.io");
const http = require("http");
const { Chess } = require("chess.js");
const path = require("path");

const app = express();
const server = http.createServer(app);

// Configure Socket.IO with CORS
const io = socket(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
  transports: ['websocket', 'polling']
});

// Store multiple game rooms
const gameRooms = new Map();

// Create a new game room
const createGameRoom = (roomId) => {
  return {
    chess: new Chess(),
    players: {
      white: null,
      black: null
    },
    spectators: new Set()
  };
};

// Serve static files
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

// Routes
app.get("/", (req, res) => {
  res.render("index", { title: "Chess Game" });
});

app.get("/game/:roomId", (req, res) => {
  const roomId = req.params.roomId;
  if (!gameRooms.has(roomId)) {
    gameRooms.set(roomId, createGameRoom(roomId));
  }
  res.render("index", { title: `Chess Game - Room ${roomId}`, roomId });
});

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("Player connected:", socket.id);
  let currentRoom = null;

  // Handle joining a room
  socket.on("joinRoom", (roomId) => {
    if (currentRoom) {
      socket.leave(currentRoom);
    }

    if (!gameRooms.has(roomId)) {
      gameRooms.set(roomId, createGameRoom(roomId));
    }

    const room = gameRooms.get(roomId);
    currentRoom = roomId;
    socket.join(roomId);

    // Assign player roles
    if (!room.players.white) {
      room.players.white = socket.id;
      socket.emit("playerRole", "w");
      console.log(`Assigned white role to ${socket.id} in room ${roomId}`);
    } else if (!room.players.black) {
      room.players.black = socket.id;
      socket.emit("playerRole", "b");
      console.log(`Assigned black role to ${socket.id} in room ${roomId}`);
    } else {
      room.spectators.add(socket.id);
      socket.emit("spectatorRole");
      console.log(`Assigned spectator role to ${socket.id} in room ${roomId}`);
    }

    // Send current game state
    socket.emit("broadState", room.chess.fen());
  });

  // Handle game start
  socket.on("startGame", (roomId) => {
    if (gameRooms.has(roomId)) {
      const room = gameRooms.get(roomId);
      if (room.players.white && room.players.black) {
        // Reset the game
        room.chess = new Chess();
        // Notify all players in the room
        io.to(roomId).emit("gameStarted");
        io.to(roomId).emit("broadState", room.chess.fen());
      }
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    if (currentRoom && gameRooms.has(currentRoom)) {
      const room = gameRooms.get(currentRoom);
      
      if (socket.id === room.players.white) {
        console.log(`White player disconnected from room ${currentRoom}:`, socket.id);
        room.players.white = null;
      } else if (socket.id === room.players.black) {
        console.log(`Black player disconnected from room ${currentRoom}:`, socket.id);
        room.players.black = null;
      } else {
        room.spectators.delete(socket.id);
      }

      // Clean up empty rooms
      if (!room.players.white && !room.players.black && room.spectators.size === 0) {
        gameRooms.delete(currentRoom);
        console.log(`Removed empty room ${currentRoom}`);
      }
    }
  });

  // Handle moves
  socket.on("move", (move) => {
    if (!currentRoom || !gameRooms.has(currentRoom)) return;

    const room = gameRooms.get(currentRoom);
    try {
      // Validate player's turn
      if (room.chess.turn() === "w" && socket.id !== room.players.white) {
        socket.emit("error", "Not your turn");
        return;
      }
      if (room.chess.turn() === "b" && socket.id !== room.players.black) {
        socket.emit("error", "Not your turn");
        return;
      }

      const result = room.chess.move(move);
      if (result) {
        // Broadcast move to all clients in the room
        io.to(currentRoom).emit("move", move);
        io.to(currentRoom).emit("broadState", room.chess.fen());
        
        // Check for game end conditions
        if (room.chess.isGameOver()) {
          let gameResult = "Game Over - ";
          if (room.chess.isCheckmate()) gameResult += "Checkmate";
          else if (room.chess.isDraw()) gameResult += "Draw";
          else if (room.chess.isStalemate()) gameResult += "Stalemate";
          else if (room.chess.isThreefoldRepetition()) gameResult += "Threefold Repetition";
          else if (room.chess.isInsufficientMaterial()) gameResult += "Insufficient Material";
          
          io.to(currentRoom).emit("gameOver", gameResult);
        }
      } else {
        socket.emit("error", "Invalid move");
      }
    } catch (err) {
      console.error("Move error:", err);
      socket.emit("error", "Invalid move");
    }
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
