// Village building screen: upgrade/build structures and save to server
import { updateGame } from './api.js';

export function renderVillageScreen(scene, sessionId, playerId) {
    // Example: upgrade/build structures
    let structures = [
        { type: 'castle', level: 1 },
        { type: 'tower', level: 1 },
        { type: 'barracks', level: 1 }
    ];

    // Upgrade structure
    function upgradeStructure(idx) {
        structures[idx].level++;
        updateGame(sessionId, { playerId, villageStructures: structures });
    }

    // Build new structure
    function buildStructure(type) {
        structures.push({ type, level: 1 });
        updateGame(sessionId, { playerId, villageStructures: structures });
    }

    // Example UI triggers (replace with real UI)
    scene.input.on('pointerdown', (pointer) => {
        // For demo: upgrade first structure
        upgradeStructure(0);
    });
}
