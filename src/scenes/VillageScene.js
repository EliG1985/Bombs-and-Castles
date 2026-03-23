// Use Phaser from window.Phaser
const Phaser = window.Phaser;

class VillageScene extends Phaser.Scene {
    constructor() { super('village'); }
    preload() {
        this.load.image('village_bg', 'assets/Village_Screen/Village.png');
        this.load.image('menu', 'assets/General/Menu.png');
        this.load.image('store_button', 'assets/General/Store_button.png');
        this.load.image('village_button', 'assets/General/Village_button.png');
        this.load.image('battle_button', 'assets/General/Battle_button.png');
        this.load.image('strategy_button', 'assets/General/Strategy_button.png');
        this.load.audio('bg_music', 'assets/Battle_Screen/sounds/Dragon_s_Ascent_BG.mp3');
    }
    create() {
        let bgMusicStarted = false;
        const w = this.scale.width;
        const h = this.scale.height;
        this.add.image(w / 2, h / 2, 'village_bg').setDisplaySize(w, h);
        this.add.text(w * 0.1, h * 0.08, 'Village Screen', { font: `${Math.round(h * 0.04)}px Arial`, fill: '#fff' });
        // --- Button sizing constants for easy adjustment ---
        const STORE_BTN_HEIGHT = Math.min(w, h) * 0.20;
        const STORE_BTN_WIDTH = STORE_BTN_HEIGHT; // Change this value to make the button wider or narrower
        const BTN_AREA_WIDTH = w * 0.65;
        const BTN_COUNT = 2;
        const BTN_IMG_WIDTH = BTN_AREA_WIDTH / BTN_COUNT;
        const BTN_IMG_HEIGHT = h * 0.10;
        const BTN_Y = h * 0.87;
        const BTN_SPACING = w * 0.02;
        const BTN_START_X = w / 2 - BTN_AREA_WIDTH / 2 + BTN_IMG_WIDTH / 2;

        // --- Store button ---
        const storeBtn = this.add.image(w * 0.90, h * 0.10, 'store_button')
            .setDisplaySize(STORE_BTN_WIDTH, STORE_BTN_HEIGHT)
            .setInteractive();
        storeBtn.on('pointerdown', () => {
            if (!bgMusicStarted) {
                this.sound.play('bg_music', { loop: true });
                bgMusicStarted = true;
            }
            window.nextSceneToLoad = 'store';
            this.scene.start('loading');
        });
        // --- Navigation buttons (strategy, battle) ---
        // Strategy button
        const strategyBtn = this.add.image(BTN_START_X, BTN_Y, 'strategy_button')
            .setDisplaySize(BTN_IMG_WIDTH, BTN_IMG_HEIGHT)
            .setInteractive();
        strategyBtn.on('pointerdown', () => {
            if (!bgMusicStarted) {
                this.sound.play('bg_music', { loop: true });
                bgMusicStarted = true;
            }
            window.nextSceneToLoad = 'strategy';
            this.scene.start('loading');
        });

        // Battle button
        const battleBtn = this.add.image(BTN_START_X + BTN_IMG_WIDTH + BTN_SPACING, BTN_Y, 'battle_button')
            .setDisplaySize(BTN_IMG_WIDTH, BTN_IMG_HEIGHT)
            .setInteractive();
        battleBtn.on('pointerdown', () => {
            if (!bgMusicStarted) {
                this.sound.play('bg_music', { loop: true });
                bgMusicStarted = true;
            }
            window.nextSceneToLoad = 'battle';
            this.scene.start('loading');
        });
    }
}

export default VillageScene;
