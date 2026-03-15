# Bombs and Castles

2D mobile game project (Phaser.js) for battle screen prototype.

## Structure

## Getting Started
Frontend: Open `index.html` in your browser to see the battle screen prototype.
Backend: Run `main.py` in `server/` to start FastAPI backend.

## Next Steps
# Bombs and Castles

2D multiplayer mobile game (Phaser.js + FastAPI)

## Project Structure
- `assets/` — images, sounds, sprites
- `src/` — game logic (battle, defense, village, UI, multiplayer)
- `config/` — game settings, mobile packaging guide
- `index.html` — entry point
- `server/` — backend (Python FastAPI, SQLite, WebSocket)

## Getting Started
1. Install dependencies:
	- Frontend: `npm install`
	- Backend: `pip install fastapi uvicorn`

2. Start backend server:
	- Open terminal in project folder
	- Run:
	  ```
	  uvicorn server.main:app --reload
	  ```

3. Open frontend:
	- Open `index.html` in your browser (Chrome/Edge)

## What You Can Do
- Play battle screen: rotate cannon, shoot bombs, hit soldiers/towers/castle (explosion + sound)
- Drag soldiers/towers in defense screen and save positions
- Upgrade/build village structures and save to server
- Join multiplayer sessions, synchronize actions, see other players
- All actions update backend and database
- UI includes basic buttons and menus

## Features Implemented
- Battle, defense, and village screens
- Backend API and database (SQLite)
- Real-time multiplayer (WebSocket)
- Mobile packaging (Cordova/Capacitor)
- UI/UX, sound, error handling, basic tests

## Mobile Packaging
See `config/cordova.md` for Cordova/Capacitor instructions.

## API Endpoints
- `POST /game/create` — create new game session
- `POST /game/join` — join game session
- `POST /game/update` — update game state
- `GET /game/{session_id}` — get game state
- `GET /game/{session_id}/players` — get players in session
- `WS /ws/{session_id}/{player_id}` — real-time multiplayer

## Code Documentation
- Game logic: `src/main.js`, `src/defense.js`, `src/village.js`, `src/multiplayer.js`
- UI/UX: `src/ui.js`
- Error handling: `src/errors.js`
- Backend: `server/main.py`, `server/game.py`, `server/db.py`, `server/ws.py`

## Development Roadmap
See `docs/game_structure.md` and `docs/features_roadmap.md` for full roadmap and progress.

## Mobile Packaging
See `config/cordova.md` for Cordova/Capacitor instructions.

## API Endpoints
- `POST /game/create` — create new game session
- `POST /game/join` — join game session
- `POST /game/update` — update game state
- `GET /game/{session_id}` — get game state
- `WS /ws/{session_id}/{player_id}` — real-time multiplayer

## Code Documentation
- Game logic: `src/main.js`, `src/defense.js`, `src/village.js`, `src/multiplayer.js`
- UI/UX: `src/ui.js`
- Error handling: `src/errors.js`
- Backend: `server/main.py`, `server/game.py`, `server/db.py`, `server/ws.py`

## Development Roadmap
See `docs/game_structure.md` for full roadmap and progress.
