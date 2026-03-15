// API utility for connecting frontend to backend
const API_BASE = 'http://localhost:8000'; // Update if needed

export async function createGame(sessionId) {
    const res = await fetch(`${API_BASE}/game/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId })
    });
    return res.json();
}

export async function joinGame(sessionId, playerId) {
    const res = await fetch(`${API_BASE}/game/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, player_id: playerId })
    });
    return res.json();
}

export async function updateGame(sessionId, state) {
    const res = await fetch(`${API_BASE}/game/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, state })
    });
    return res.json();
}

export async function getGameState(sessionId) {
    const res = await fetch(`${API_BASE}/game/${sessionId}`);
    return res.json();
}

export async function getPlayers(sessionId) {
    const res = await fetch(`${API_BASE}/game/${sessionId}/players`);
    return res.json();
}
