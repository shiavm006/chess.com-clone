# Real-Time Multiplayer Chess Game

A modern, real-time multiplayer chess game built with Node.js, Express, Socket.IO, and Chess.js. Play chess with friends in real-time with a beautiful, responsive interface.

![Chess Game](https://img.shields.io/badge/Chess-Game-green)
![Node.js](https://img.shields.io/badge/Node.js-v14+-blue)
![Socket.IO](https://img.shields.io/badge/Socket.IO-v4.8.1-orange)

## Features

- 🎮 Real-time multiplayer gameplay
- 🎯 Drag-and-drop piece movement
- 👥 Support for multiple game rooms
- 👀 Spectator mode
- 🎨 Responsive and modern UI
- ♟️ Full chess rules implementation
- 🔄 Automatic board flipping for black player
- 🏆 Game state tracking (checkmate, stalemate, etc.)
- 🔌 Automatic reconnection handling

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

## Installation

1. Clone the repository:
```bash
git clone <your-repository-url>
cd chess-game
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Playing on Local Network

To play with friends on the same local network (e.g., same WiFi):

1. Find your computer's local IP address:
   - On Windows: Open Command Prompt and type `ipconfig`
   - On Mac/Linux: Open Terminal and type `ifconfig` or `ip addr`
   - Look for IPv4 address (usually starts with 192.168. or 10.0.)

2. Update the server configuration in `app.js`:
```javascript
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';  // Add this line
server.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});
```

3. Start the server:
```bash
npm run dev
```

4. Share the game:
   - Host player: Use `http://localhost:3000`
   - Other players: Use `http://<your-local-ip>:3000`
   - Example: If your IP is 192.168.1.5, others should use `http://192.168.1.5:3000`

5. Troubleshooting:
   - Ensure all players are on the same network
   - Check if your firewall allows connections on port 3000
   - If connection fails, try disabling firewall temporarily
   - Make sure no other application is using port 3000



## How to Play

1. Open the game in your browser
2. Click "Start New Game"
3. Share the game URL with a friend
4. Once both players join, the game will start automatically
5. White moves first, followed by black
6. Drag and drop pieces to make moves
7. The game will automatically detect checkmate, stalemate, and other end conditions

## Game Rules

- Standard chess rules apply
- Pawns automatically promote to queens
- The board automatically flips for the black player
- Invalid moves are prevented
- Players can only move their own pieces
- Players must wait for their turn

## Technical Stack

- **Frontend:**
  - HTML5/CSS3
  - JavaScript (ES6+)
  - Chess.js for chess logic
  - Socket.IO client for real-time communication

- **Backend:**
  - Node.js
  - Express.js
  - Socket.IO
  - Chess.js

## Project Structure

```
chess-game/
├── public/
│   └── js/
│       └── chessgame.js    # Client-side game logic
├── views/
│   └── index.ejs          # Main game view
├── app.js                 # Server and game logic
├── package.json           # Project dependencies
├── Procfile              # Railway deployment config
└── README.md             # Project documentation
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Chess.js](https://github.com/jhlywa/chess.js) for chess logic
- [Socket.IO](https://socket.io/) for real-time communication
- [TailwindCSS](https://tailwindcss.com/) for styling 