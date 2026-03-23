// Use Phaser from window.Phaser
const Phaser = window.Phaser;

class StrategyScene extends Phaser.Scene {
    constructor() { super('strategy'); }
    preload() {
        this.load.image('menu', 'assets/General/Menu.png');
        this.load.image('village_button', 'assets/General/Village_button.png');
        this.load.image('battle_button', 'assets/General/Battle_button.png');
        this.load.image('strategy_button', 'assets/General/Strategy_button.png');
        this.load.image('strategy_bg', 'assets/Strategy_Screen/Strategy_bg.png');
    }
    create() {
        const w = this.scale.width;
        const h = this.scale.height;
        // Add background image
        this.add.image(w / 2, h / 2, 'strategy_bg').setDisplaySize(w, h);
        const btnImgWidth = w * 0.28;
        // Standardized button sizes (match VillageScene)
        const BTN_AREA_WIDTH = w * 0.65;
        const BTN_COUNT = 2;
        const BTN_IMG_WIDTH = BTN_AREA_WIDTH / BTN_COUNT;
        const BTN_IMG_HEIGHT = h * 0.10;
        const btnY = h * 0.92;
        const btnSpacing = w * 0.04;
        // Hide strategy button on strategy screen
        const villageBtn = this.add.image(w / 2 - BTN_IMG_WIDTH / 2 - btnSpacing, btnY, 'village_button')
            .setDisplaySize(BTN_IMG_WIDTH, BTN_IMG_HEIGHT)
            .setInteractive();
        villageBtn.on('pointerdown', () => {
            window.nextSceneToLoad = 'village';
            this.scene.start('loading');
        });
        const battleBtn = this.add.image(w / 2 + BTN_IMG_WIDTH / 2 + btnSpacing, btnY, 'battle_button')
            .setDisplaySize(BTN_IMG_WIDTH, BTN_IMG_HEIGHT)
            .setInteractive();
        battleBtn.on('pointerdown', () => {
            window.nextSceneToLoad = 'battle';
            this.scene.start('loading');
        });
        // (Store button removed)
    }
    showBanner(bannerKey) {
        const w = this.scale.width;
        const h = this.scale.height;
        this.banner = this.add.image(w / 2, h / 2, bannerKey).setDisplaySize(w * 0.7, h * 0.3);
        this.banner.setDepth(100);
        this.time.delayedCall(2000, () => {
            this.banner.destroy();
            this.scene.start('village');
        });
    }
}

export default StrategyScene;
