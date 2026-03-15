// UI/UX improvements: add buttons, menus, and sound
export function addUI(scene) {
    // Add Start Battle button
    const startBtn = scene.add.text(650, 10, 'Start Battle', {
        font: '20px Arial', fill: '#fff', backgroundColor: '#007bff', padding: { x: 10, y: 5 }
    }).setInteractive();
    startBtn.on('pointerdown', () => {
        // Start battle logic
    });

    // Add menu button
    const menuBtn = scene.add.text(650, 50, 'Menu', {
        font: '20px Arial', fill: '#fff', backgroundColor: '#28a745', padding: { x: 10, y: 5 }
    }).setInteractive();
    menuBtn.on('pointerdown', () => {
        // Open menu logic
    });

    // Add sound effect (placeholder)
    scene.sound.add('explosion');
    // Play sound on bomb hit (example)
    scene.events.on('bombHit', () => {
        scene.sound.play('explosion');
    });
}
