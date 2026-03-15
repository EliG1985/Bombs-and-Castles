// Defense screen logic: position soldiers/towers and save to server
import { updateGame } from './api.js';

export function renderDefenseScreen(scene, sessionId, playerId) {
    // Example: allow user to drag soldiers/towers
    const positions = [];
    scene.soldiers.forEach((soldier, idx) => {
        soldier.setInteractive();
        scene.input.setDraggable(soldier);
        soldier.on('drag', (pointer, dragX, dragY) => {
            soldier.x = dragX;
            soldier.y = dragY;
            positions[idx] = { x: dragX, y: dragY };
        });
    });
    scene.towers.forEach((tower, idx) => {
        tower.setInteractive();
        scene.input.setDraggable(tower);
        tower.on('drag', (pointer, dragX, dragY) => {
            tower.x = dragX;
            tower.y = dragY;
            positions[scene.soldiers.length + idx] = { x: dragX, y: dragY };
        });
    });

    // Save positions to server
    scene.input.on('pointerup', () => {
        updateGame(sessionId, { playerId, defensePositions: positions });
    });
}
