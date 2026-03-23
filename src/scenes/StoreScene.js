// Use Phaser from window.Phaser
const Phaser = window.Phaser;

class StoreScene extends Phaser.Scene {
    constructor() { super('store'); }
    preload() {
        this.load.image('store_bg', 'assets/store/InAppStore_bg.png');
        this.load.image('inventory_slot', 'assets/store/Inventory_Slot.png');
    }
    create() {
        const w = this.scale.width;
        const h = this.scale.height;
            // Store background
            this.add.image(w / 2, h / 2, 'store_bg').setDisplaySize(w, h);

            // (Title removed as requested)

            // Diamond slot layout (9 slots)
            const slotSize = Math.min(w, h) * 0.13;
            const centerX = w / 2;
            const centerY = h * 0.55;
            const d = slotSize * 0.75; // reduced distance between centers

            // 9-slot diamond coordinates (relative to center)
            const positions = [
                [0, -2 * d],      // Top
                [-d, -d],         // Upper-left
                [d, -d],          // Upper-right
                [-2 * d, 0],      // Far left
                [0, 0],           // Center
                [2 * d, 0],       // Far right
                [-d, d],          // Lower-left
                [d, d],           // Lower-right
                [0, 2 * d],       // Bottom
            ];
            positions.forEach(([dx, dy]) => {
                this.add.image(centerX + dx, centerY + dy, 'inventory_slot').setDisplaySize(slotSize, slotSize);
            });
        
        // Add a village button at the bottom, using the same logic as in StrategyScene
        // Standardized button sizes (match VillageScene)
        const BTN_AREA_WIDTH = w * 0.65;
        const BTN_COUNT = 2;
        const BTN_IMG_WIDTH = BTN_AREA_WIDTH / BTN_COUNT;
        const BTN_IMG_HEIGHT = h * 0.10;
        const btnY = h * 0.88;
        const villageBtn = this.add.image(w / 2, btnY, 'village_button')
            .setDisplaySize(BTN_IMG_WIDTH, BTN_IMG_HEIGHT)
            .setInteractive();
        villageBtn.on('pointerdown', () => {
            window.nextSceneToLoad = 'village';
            this.scene.start('loading');
        });
        // (Removed all other text from the store scene)
    }
}

export default StoreScene;
