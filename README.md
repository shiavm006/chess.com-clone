# Real-Time Multiplayer Chess Game

A modern, real-time multiplayer chess game built with Node.js, Express, Socket.IO, and Chess.js. Play chess with friends in real-time with a beautiful, responsive interface.

![Chess Game](https://img.shields.io/badge/Chess-Game-green)
![Node.js](https://img.shields.io/badge/Node.js-v14+-blue)
![Socket.IO](https://img.shields.io/badge/Socket.IO-v4.8.1-orange)

## Live Demo

The game is now live! You can play it at:
[Chess Game](https://your-chess-game.com) 

To play with a friend:
1. Visit the website
2. Click "Start New Game"
3. Share the game room URL with your friend
4. Start playing!

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

## Deployment

The application is configured for deployment on Railway. Follow these steps to deploy:

1. Install Railway CLI:
```bash
npm i -g @railway/cli
```

2. Login to Railway:
```bash
railway login
```

3. Initialize the project:
```bash
railway init
```

4. Deploy:
```bash
railway up
```

## How to Play

### Playing Online (Recommended)

1. Visit [https://your-chess-game.com](https://your-chess-game.com)
2. Click the "Start New Game" button
3. Share the game room URL with your opponent
4. Wait for your opponent to join
5. The first player gets white pieces, the second gets black
6. Start playing!

### Playing Locally (Development)

1. Start the server:
```bash
npm start
```

2. Open your browser and navigate to:
   - For local play: `http://localhost:3000`
   - For network play: `http://<your-ip-address>:3000`

3. Game Controls:
   - Click and drag pieces to move them
   - The game automatically validates moves
   - White moves first
   - The game will indicate whose turn it is
   - Invalid moves will be rejected
   - The game will announce checkmate, stalemate, or other end conditions

## Troubleshooting

If you encounter any issues:

1. Connection Problems:
   - Ensure both players are on the same network
   - Check if port 3000 is available
   - Try refreshing the page
   - Check your firewall settings

2. Game Issues:
   - If the board doesn't load, refresh the page
   - If moves aren't registering, check your internet connection
   - If the game freezes, refresh the page and start a new game

3. Deployment Issues:
   - Make sure all dependencies are installed
   - Check if the Railway CLI is properly installed
   - Verify your Railway account is active
   - Check the Railway dashboard for deployment logs

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