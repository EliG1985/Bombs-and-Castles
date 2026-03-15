// ...existing code...

// Basic Phaser setup for battle screen
// Phaser scenes for navigation
class VillageScene extends Phaser.Scene {
    constructor() { super('village'); }
    preload() {
        this.load.image('village_bg', 'assets/Village_Screen/Village.png');
        this.load.image('menu', 'assets/Menu.png');
    }
    create() {
        const w = this.scale.width;
        const h = this.scale.height;
        this.add.image(w / 2, h / 2, 'village_bg').setDisplaySize(w, h);
        // Responsive scaling for other images (if any)
        this.add.text(w * 0.1, h * 0.08, 'Village Screen', { font: `${Math.round(h * 0.04)}px Arial`, fill: '#fff' });
        // Responsive navigation buttons at bottom center
        const btnWidth = w * 0.35;
        const btnHeight = h * 0.07;
        const btnY = h * 0.92;
        const btnSpacing = w * 0.05;
        const strategyBtn = this.add.text(w / 2 - btnWidth / 2 - btnSpacing / 2, btnY, 'Strategy', {
            font: `${Math.round(h * 0.03)}px Arial`,
            fill: '#fff',
            backgroundColor: '#007bff',
            padding: { x: Math.round(btnWidth / 6), y: Math.round(btnHeight / 4) }
        }).setInteractive();
        strategyBtn.on('pointerdown', () => {
            this.scene.start('strategy');
        });
        const battleBtn = this.add.text(w / 2 + btnWidth / 2 + btnSpacing / 2 - btnWidth, btnY, 'Battle', {
            font: `${Math.round(h * 0.03)}px Arial`,
            fill: '#fff',
            backgroundColor: '#28a745',
            padding: { x: Math.round(btnWidth / 6), y: Math.round(btnHeight / 4) }
        }).setInteractive();
        battleBtn.on('pointerdown', () => {
            this.scene.start('battle');
        });
    }
}

class StrategyScene extends Phaser.Scene {
    constructor() { super('strategy'); }
    preload() {
        this.load.image('strategy_bg', 'assets/Strategy_Screen/Forest_1_bg.png');
        this.load.image('menu', 'assets/Menu.png');
    }
    create() {
        const w = this.scale.width;
        const h = this.scale.height;
        this.add.image(w / 2, h / 2, 'strategy_bg').setDisplaySize(w, h);
        // Responsive scaling for other images (if any)
        this.add.text(w * 0.1, h * 0.08, 'Strategy Screen', { font: `${Math.round(h * 0.04)}px Arial`, fill: '#fff' });
        // Responsive back button at bottom center
        const btnWidth = w * 0.35;
        const btnHeight = h * 0.07;
        const btnY = h * 0.92;
        const strategyBtn = this.add.text(w / 2 - btnWidth / 2, btnY, 'Battle', {
            font: `${Math.round(h * 0.03)}px Arial`,
            fill: '#fff',
            backgroundColor: '#28a745',
            padding: { x: Math.round(btnWidth / 6), y: Math.round(btnHeight / 4) }
        }).setInteractive();
        strategyBtn.on('pointerdown', () => {
            this.scene.start('battle');
        });

        const backBtn = this.add.text(w / 2 + btnWidth / 2, btnY, 'Strategy', {
            font: `${Math.round(h * 0.03)}px Arial`,
            fill: '#fff',
            backgroundColor: '#007bff',
            padding: { x: Math.round(btnWidth / 6), y: Math.round(btnHeight / 4) }
        }).setInteractive();
        backBtn.on('pointerdown', () => {
            this.scene.start('village');
        });
    }
}

class BattleScene extends Phaser.Scene {
        checkWinLose() {
            // Example win/lose logic: all soldiers defeated = lose, all towers defeated = win
            const allSoldiersDefeated = this.soldiers.getChildren().every(s => !s.getData('alive'));
            const allTowersDefeated = this.towers.getChildren().every(t => !t.getData('alive'));
            if (allSoldiersDefeated && !this.ended) {
                this.ended = true;
                this.showBanner('Defeat Banner');
            } else if (allTowersDefeated && !this.ended) {
                this.ended = true;
                this.showBanner('Victory Banner');
            }
        }

        showBanner(bannerKey) {
            const w = this.scale.width;
            const h = this.scale.height;
            this.banner = this.add.image(w / 2, h / 2, bannerKey).setDisplaySize(w * 0.7, h * 0.3);
            this.banner.setDepth(100);
            this.time.delayedCall(2000, () => {
                this.banner.destroy();
                this.scene.start('village'); // Or transition to another screen
            });
        }
    constructor() { super('battle'); }
    preload() {
        // ...existing preload code...
        // Preload sound effects and music
        this.load.audio('bg_music', 'assets/Battle_Screen/sounds/Dragon_s_Ascent_BG.mp3');
        this.load.audio('bomb_hit', 'assets/Battle_Screen/sounds/medium-explosion.wav');
        this.load.audio('cannon_fire', 'assets/Battle_Screen/sounds/cannon-fire.wav');
        this.load.audio('victory_sound', 'assets/Battle_Screen/sounds/triumphant-success.mp3');
        this.load.audio('defeat_sound', 'assets/Battle_Screen/sounds/defeat-sound-effect.mp3');
        this.load.image('cannon_lvl1', 'assets/Cannon_lvl1.png');
        this.load.image('cannon_lvl2', 'assets/Cannon_lvl2.png');
        this.load.image('soldier_front', 'assets/Soldier_front.png');
        this.load.image('soldier_back', 'assets/Soldier_back.png');
        this.load.image('tower_lvl1', 'assets/Tower_lvl1.png');
        this.load.image('castle', 'assets/Castle.png');
        this.load.image('bomb', 'assets/Bomb_lvl1.png');
        this.load.image('explosion', 'assets/Explosion.png');
        this.load.image('pause_button', 'assets/Pause Button.png');
        this.load.image('victory_banner', 'assets/Victory Banner.png');
        this.load.image('defeat_banner', 'assets/Defeat Banner.png');
        this.load.image('upgrade_icon', 'assets/Upgrade Icon.png');
        this.load.image('inventory_slot', 'assets/Inventory Slot.png');
        this.load.image('gold_coin', 'assets/Gold Coin Icon.png');
        this.load.image('wood_resource', 'assets/Wood Resource Icon.png');
        this.load.image('settings_panel', 'assets/Settings Panel.png');
        this.load.image('menu', 'assets/Menu.png');
        // Preload all user backgrounds
        this.load.image('Crystals_bg', 'assets/Battle_Screen/bg/Crystals_bg.png');
    }

    create() {
        const w = this.scale.width;
        const h = this.scale.height;
        // Random battlefield background
        const battlefieldImages = [
            'Crystals_bg',
            'Desert_1_bg',
            'Desert_2_bg',
            'Forest_1_bg',
            'Forest_2_bg',
            'FutearisticCity_bg',
            'Graveyerd_bg',
            'Islend_bg',
            'Snow_1_bg',
            'Snow_2_bg',
            'Snow_3_bg',
            'StormyNight_bg',
            'Volcano_bg'
        ];
        const randomIndex = Math.floor(Math.random() * battlefieldImages.length);
        const bgKey = battlefieldImages[randomIndex];
        this.add.image(w / 2, h / 2, bgKey).setDisplaySize(w, h);

        // Bombs group
        this.bombs = this.physics.add.group();

        // Cannon at top, pointed down
        this.cannonOrigin = { x: w / 2, y: h * 0.08 };
        this.cannonAngle = Math.PI / 2; // Downwards
        this.cannon = this.physics.add.sprite(this.cannonOrigin.x, this.cannonOrigin.y, 'cannon_lvl1');
        this.cannon.setOrigin(0.5, 0.5);
        this.cannon.setAngle(90);
        this.cannon.setDisplaySize(w * 0.15, h * 0.12);
        this.add.text(this.cannonOrigin.x - 30, this.cannonOrigin.y - 60, 'Cannon', { font: '16px Arial', fill: '#fff' });

        // Soldiers in middle
        this.soldiers = this.physics.add.group();
        for (let i = 0; i < 3; i++) {
            let x = w * (0.3 + i * 0.2);
            let y = h * 0.5;
            let direction = i % 2 === 0 ? 'front' : 'back';
            let soldier = this.physics.add.sprite(x, y, `soldier_${direction}`);
            soldier.setOrigin(0.5, 0.5);
            soldier.setDisplaySize(w * 0.08, h * 0.12);
            this.add.text(x - 15, y - 35, 'Soldier', { font: '14px Arial', fill: '#fff' });
            soldier.setData('alive', true);
            soldier.setData('direction', direction);
            this.soldiers.add(soldier);
        }

        // Towers at bottom, guarding castle
        this.towers = this.physics.add.group();
        let towerY = h * 0.88;
        let towerX1 = w * 0.35;
        let towerX2 = w * 0.65;
        let tower1 = this.physics.add.sprite(towerX1, towerY, 'tower_lvl1');
        tower1.setOrigin(0.5, 0.5);
        tower1.setDisplaySize(w * 0.12, h * 0.18);
        this.add.text(towerX1 - 20, towerY - 60, 'Tower', { font: '14px Arial', fill: '#fff' });
        tower1.setData('alive', true);
        this.towers.add(tower1);
        let tower2 = this.physics.add.sprite(towerX2, towerY, 'tower_lvl1');
        tower2.setOrigin(0.5, 0.5);
        tower2.setDisplaySize(w * 0.12, h * 0.18);
        this.add.text(towerX2 - 20, towerY - 60, 'Tower', { font: '14px Arial', fill: '#fff' });
        tower2.setData('alive', true);
        this.towers.add(tower2);

        // Castle at bottom center
        let castleY = h * 0.95;
        this.castle = this.physics.add.sprite(w / 2, castleY, 'castle');
        this.castle.setOrigin(0.5, 0.5);
        this.castle.setDisplaySize(w * 0.18, h * 0.18);
        this.add.text(w / 2 - 30, castleY - 30, 'Castle', { font: '16px Arial', fill: '#fff' });
        this.castle.setData('alive', true);

        // Cannon power meter setup
        this.cannonPower = 1;
        this.cannonPowerDirection = 1;
        this.cannonPowerMin = 1;
        this.cannonPowerMax = 3;
        this.cannonPowerMeter = this.add.rectangle(w * 0.88, h * 0.08, 20, 100, 0x00ff00);
        this.cannonPowerMeter.setOrigin(0.5, 0);
        this.cannonPowerMeter.height = 100;
        this.cannonPowerMeter.y = h * 0.08;
        this.cannonPowerText = this.add.text(w * 0.85, h * 0.27, 'Power: Low', { font: '16px Arial', fill: '#fff' });
        this.fireButton = this.add.text(w * 0.85, h * 0.33, 'FIRE', { font: '20px Arial', fill: '#fff', backgroundColor: '#f00', padding: { x: 10, y: 5 } }).setInteractive();
        this.fireButton.on('pointerdown', () => {
            if (!this.cannonDragging && this.bombsLeft > 0) {
                this.shootBombDirection();
            }
        });
    }

    update() {
        // Cooldown logic for abilities
        for (let i = 0; i < this.soldierAbilityCooldown.length; i++) {
            if (this.soldierAbilityCooldown[i] > 0) {
                this.soldierAbilityCooldown[i] -= 1/60;
            }
        }
        for (let i = 0; i < this.towerAbilityCooldown.length; i++) {
            if (this.towerAbilityCooldown[i] > 0) {
                this.towerAbilityCooldown[i] -= 1/60;
            }
        }
        // Remove shield after 3 seconds (demo)
        this.towers.getChildren().forEach(tower => {
            if (tower.getData('shielded')) {
                if (!tower.shieldTimer) tower.shieldTimer = 3;
                tower.shieldTimer -= 1/60;
                if (tower.shieldTimer <= 0) {
                    tower.setData('shielded', false);
                    tower.shieldTimer = null;
                    this.abilityText.setText('');
                }
            }
        });
        // Bomb collision with soldiers
        this.physics.world.collide(this.bombs, this.soldiers, (bomb, soldier) => {
            if (soldier.getData('alive')) {
                let damage = bomb.getData('damage') || 1;
                soldier.setTexture('explosion');
                soldier.setData('alive', false);
                bomb.destroy();
                this.events.emit('bombHit');
                this.add.text(soldier.x, soldier.y - 40, `-${damage} HP`, { font: '16px Arial', fill: '#ff0' }).setDepth(10);
            }
        });
        // Bomb collision with towers
        this.physics.world.collide(this.bombs, this.towers, (bomb, tower) => {
            if (tower.getData('alive')) {
                let damage = bomb.getData('damage') || 1;
                tower.setTexture('explosion');
                tower.setData('alive', false);
                bomb.destroy();
                this.events.emit('bombHit');
                this.add.text(tower.x, tower.y - 40, `-${damage} HP`, { font: '16px Arial', fill: '#ff0' }).setDepth(10);
            }
        });
        // Bomb collision with castle
        this.physics.world.collide(this.bombs, this.castle, (bomb, castle) => {
            if (castle.getData('alive')) {
                let damage = bomb.getData('damage') || 1;
                castle.setTexture('explosion');
                castle.setData('alive', false);
                bomb.destroy();
                this.events.emit('bombHit');
                this.add.text(castle.x, castle.y - 40, `-${damage} HP`, { font: '16px Arial', fill: '#ff0' }).setDepth(10);
            }
        });
        // Cannon power meter logic
        if (this.cannonPowerMeter && !this.cannonDragging) {
            // Animate meter up and down
            this.cannonPower += this.cannonPowerDirection * 0.03;
            if (this.cannonPower >= this.cannonPowerMax) {
                this.cannonPower = this.cannonPowerMax;
                this.cannonPowerDirection = -1;
            }
            if (this.cannonPower <= this.cannonPowerMin) {
                this.cannonPower = this.cannonPowerMin;
                this.cannonPowerDirection = 1;
            }
            // Update meter UI
            let meterHeight = 100 * (this.cannonPower - this.cannonPowerMin) / (this.cannonPowerMax - this.cannonPowerMin);
            this.cannonPowerMeter.height = meterHeight;
            this.cannonPowerMeter.y = 50 + (100 - meterHeight);
            let powerLabel = this.cannonPower <= 1.2 ? 'Low' : (this.cannonPower >= 2.8 ? 'Max' : 'Medium');
            this.cannonPowerText.setText('Power: ' + powerLabel);
        }
        // Check win/lose conditions
        this.checkWinLose();
    }

    shootBombDirection() {
        const startX = this.cannonOrigin.x;
        const startY = this.cannonOrigin.y;
        const bomb = this.bombs.create(startX, startY, 'bomb');
        bomb.setDisplaySize(20, 20);
        let power = Math.round(this.cannonPower);
        let distance = 400 + 200 * (power - 1);
        bomb.setData('damage', power);
        const targetX = startX + Math.cos(this.cannonAngle) * distance;
        const targetY = startY + Math.sin(this.cannonAngle) * distance;
        this.physics.moveTo(bomb, targetX, targetY, 300 + 100 * (power - 1));
        this.bombsLeft--;
        this.bombsCounterText.setText(`Bombs: ${this.bombsLeft}/${this.bombsMax}`);
    }

    addBombs(amount) {
        this.bombsMax += amount;
        this.bombsLeft += amount;
        this.bombsCounterText.setText(`Bombs: ${this.bombsLeft}/${this.bombsMax}`);
    }

    // ...existing methods...
}

// Phaser game initialization (must be after all class definitions)
var config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'game-container',
    scene: [VillageScene, StrategyScene, BattleScene],
    physics: { default: 'arcade', arcade: { debug: false } },
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

var game = new Phaser.Game(config);
