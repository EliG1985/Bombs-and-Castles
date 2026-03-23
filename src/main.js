
import VillageScene from './scenes/VillageScene.js';
import StrategyScene from './scenes/StrategyScene.js';
import BattleScene from './scenes/BattleScene.js';
import StoreScene from './scenes/StoreScene.js';
import LoadingScene from './scenes/LoadingScene.js';
import LogoScene from './scenes/LogoScene.js';

var config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'game-container',
    scene: [LogoScene, VillageScene, LoadingScene, StrategyScene, BattleScene, StoreScene],
    physics: { default: 'arcade', arcade: { debug: false } },
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

var game = new Phaser.Game(config);
// Resume AudioContext after user gesture
window.addEventListener('click', () => {
    if (game.sound && game.sound.context && game.sound.context.state === 'suspended') {
        game.sound.context.resume();
    }
});
window.addEventListener('touchstart', () => {
    if (game.sound && game.sound.context && game.sound.context.state === 'suspended') {
        game.sound.context.resume();
    }
});
