# WebSocket support for real-time multiplayer
from fastapi import WebSocket, WebSocketDisconnect
from fastapi import APIRouter

router = APIRouter()

active_connections = {}

@router.websocket('/ws/{session_id}/{player_id}')
async def websocket_endpoint(websocket: WebSocket, session_id: str, player_id: str):
    await websocket.accept()
    if session_id not in active_connections:
        active_connections[session_id] = {}
    active_connections[session_id][player_id] = websocket
    try:
        while True:
            data = await websocket.receive_text()
            # Broadcast to all players in session
            for pid, ws in active_connections[session_id].items():
                if ws != websocket:
                    await ws.send_text(f"{player_id}: {data}")
    except WebSocketDisconnect:
        del active_connections[session_id][player_id]
        if not active_connections[session_id]:
            del active_connections[session_id]
