// Use Phaser from window.Phaser
const Phaser = window.Phaser;

// Global variable to store target scene
window.nextSceneToLoad = 'village';

class LoadingScene extends Phaser.Scene {
    constructor() { super('loading'); }
    preload() {
        this.load.image('loading_bg', 'assets/General/LoadingScreen.png');
        this.load.image('loading_bar_empty', 'assets/General/LoadingBar_empty.png');
        this.load.image('loading_bar_fill', 'assets/General/Blue_Bar.png');
        // Preload loading screen audio from correct path
        this.load.audio('loading_audio', 'assets/Battle_Screen/sounds/Dragon_s_Ascent_BG.mp3');
    }
    create() {
        const w = this.scale.width;
        const h = this.scale.height;
        this.add.image(w / 2, h / 2, 'loading_bg').setDisplaySize(w, h);


        const barW = w * 0.6;
        const barH = h * 0.27;
        const barY = h * 0.93;
        this.add.image(w / 2, barY, 'loading_bar_empty').setDisplaySize(barW, barH);

        // Adjust these values if the border is thicker/thinner
        const borderMargin = barW * 0.04; // 4% of bar width as border margin
        const fillMaxW = barW - borderMargin * 2;
        const fillX = w / 2 - barW / 2 + borderMargin;

        const fill = this.add.image(fillX, barY, 'loading_bar_fill')
            .setOrigin(0, 0.5)
            .setDisplaySize(0, barH);

        let isFirstLoad = window.firstLoad === undefined;
        if (isFirstLoad) window.firstLoad = false;
        let loadingAudio = null;
        const nextScene = window.nextSceneToLoad || 'village';
        // Start next scene, but keep loading visible until next scene is ready
        this.scene.launch(nextScene);
        let progress = 0;
        let barSpeed = 0.005; // Initial speed
        let barDone = false;
        // Listen for next scene's create event
        this.scene.get(nextScene).events.once('create', () => {
            barDone = true;
        });
        // Animate progress bar
        this.time.addEvent({
            delay: 16,
            loop: true,
            callback: () => {
                if (!barDone) {
                    // If not done, fill slowly
                    progress = Math.min(progress + barSpeed, 0.98);
                } else {
                    // When done, finish bar quickly
                    progress = Math.min(progress + 0.05, 1);
                }
                fill.setDisplaySize(fillMaxW * progress, barH);
                if (progress >= 1) {
                    if (window.logoAudioStopped) {
                        if (!loadingAudio) loadingAudio = this.sound.add('loading_audio');
                        if (loadingAudio && !loadingAudio.isPlaying) loadingAudio.play();
                    }
                    if (loadingAudio && loadingAudio.isPlaying) loadingAudio.stop();
                    this.scene.stop('loading');
                }
            }
        });
    }
}

export default LoadingScene;
