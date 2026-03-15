// Multiplayer synchronization: listen and broadcast actions between players
export function setupMultiplayer(sessionId, playerId) {
    const ws = new WebSocket(`ws://localhost:8000/ws/${sessionId}/${playerId}`);

    ws.onmessage = (event) => {
        // Handle incoming actions from other players
        const msg = event.data;
        // Example: parse and update game state
        // updateGameStateFromMessage(msg);
    };

    // Send action to other players
    function sendAction(action) {
        ws.send(JSON.stringify(action));
    }

    return { sendAction };
}
