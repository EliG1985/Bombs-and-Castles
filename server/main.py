# FastAPI backend for Bombs and Castles
from fastapi import FastAPI
from fastapi import Request
from server.game import GameSession, Player
from server.storage import game_sessions
from server.db import get_connection


from server.ws import router as ws_router
app = FastAPI()
app.include_router(ws_router)


@app.get("/")
def root():
    return {"message": "Bombs and Castles backend running"}

@app.get("/game/{session_id}")
def get_game_state(session_id: str):
    session = game_sessions.get(session_id)
    if session:
        return {"state": session.get_state()}
    return {"error": "Session not found"}

import json
# Create new game session
@app.post("/game/create")
async def create_game(request: Request):
    data = await request.json()
    session_id = data.get("session_id")
    if not session_id:
        return {"error": "Missing session_id"}
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT session_id FROM game_sessions WHERE session_id=?", (session_id,))
        if cursor.fetchone():
            return {"error": "Session already exists"}
        cursor.execute("INSERT INTO game_sessions (session_id, state) VALUES (?, ?)", (session_id, json.dumps({})))
        conn.commit()
    game_sessions[session_id] = GameSession(session_id)
    return {"message": "Game session created", "session_id": session_id}

import json

# Join game session
@app.post("/game/join")
async def join_game(request: Request):
    data = await request.json()
    session_id = data.get("session_id")
    player_id = data.get("player_id")
    session = game_sessions.get(session_id)
    if not session:
        return {"error": "Session not found"}
    for p in session.players:
        if p.player_id == player_id:
            return {"error": "Player already joined"}
    player = Player(player_id)
    session.add_player(player)
    # Save player to DB
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("INSERT OR IGNORE INTO players (player_id, session_id, units, buildings) VALUES (?, ?, ?, ?)",
                       (player_id, session_id, json.dumps([]), json.dumps([])))
        conn.commit()
    return {"message": "Player joined", "player_id": player_id}

# Get players in session
@app.get("/game/{session_id}/players")
def get_players(session_id: str):
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT player_id FROM players WHERE session_id=?", (session_id,))
        players = [row[0] for row in cursor.fetchall()]
    return {"players": players}

# Update game state
@app.post("/game/update")
async def update_game(request: Request):
    data = await request.json()
    session_id = data.get("session_id")
    state = data.get("state")
    session = game_sessions.get(session_id)
    if not session:
        return {"error": "Session not found"}
    session.state = state
    # Save state to DB
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("UPDATE game_sessions SET state=? WHERE session_id=?", (json.dumps(state), session_id))
        conn.commit()
    return {"message": "Game state updated"}

# בעתיד: הוספת מסלולים לניהול משתמשים, יצירת משחקים, עדכון מצב
