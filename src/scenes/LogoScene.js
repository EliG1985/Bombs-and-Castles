// Use Phaser from window.Phaser
const Phaser = window.Phaser;

class LogoScene extends Phaser.Scene {
    constructor() { super('logo'); }
    preload() {
        this.load.image('logo_bg', 'assets/General/LogoScreen.png');
        this.load.audio('intro_logo', 'assets/Battle_Screen/sounds/The_Crimson_Vanguard_Opening.mp3');
    }
    create() {
        const w = this.scale.width;
        const h = this.scale.height;
        this.add.image(w / 2, h / 2, 'logo_bg').setDisplaySize(w, h);
        let transitioned = false;
        let intro = this.sound.add('intro_logo');
        let played = false;
        const playIntro = () => {
            if (!played) {
                played = true;
                intro.play();
                intro.once('complete', goToLoading);
            }
        };
        const goToLoading = () => {
            if (transitioned) return;
            transitioned = true;
            if (intro && intro.isPlaying) intro.stop();
            window.nextSceneToLoad = 'village';
            this.scene.start('loading');
        };
        // Resume AudioContext after user gesture
        const resumeAudioContext = () => {
            if (this.sound && this.sound.context && this.sound.context.state === 'suspended') {
                this.sound.context.resume();
            }
        };
        // On tap, instantly skip logo, stop audio, and go to loading
        this.input.once('pointerdown', () => {
            resumeAudioContext();
            if (intro && intro.isPlaying) intro.stop();
            window.logoAudioStopped = true;
            goToLoading();
        });
        // Optionally, play intro audio automatically if allowed (but will be blocked by browser until gesture)
        playIntro();
        this.events.on('shutdown', () => {
            if (intro && intro.isPlaying) intro.stop();
        });
    }
}

export default LogoScene;
