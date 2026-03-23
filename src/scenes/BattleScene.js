// Use Phaser from window.Phaser
const Phaser = window.Phaser;


class BattleScene extends Phaser.Scene {
    constructor() {
        super('battle');
        this.projectiles = [];
        this.defeatBannerShown = false;
        this.maxBombs = 8;
        this.bombsLeft = 8;
    }

    update(time, delta) {
        // Manual projectile update (straight line, no gravity)
        const dt = Math.min((delta || 16) / 1000, 0.032);
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const p = this.projectiles[i];
            p.age += dt;
            // No gravity: straight line
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.sprite.setPosition(p.x, p.y);
            // Spin the bomb as it moves
            p.sprite.angle += 360 * dt; // 1 full rotation per second
            // Remove if out of bounds
            if (p.x < -40 || p.x > this.scale.width + 40 || p.y > this.scale.height + 60) {
                p.sprite.destroy();
                this.projectiles.splice(i, 1);
                continue;
            }
            // Collision with towers
            let hit = false;
            this.towers.getChildren().forEach(tower => {
                if (tower.active && Phaser.Math.Distance.Between(p.x, p.y, tower.x, tower.y) < tower.displayWidth * 0.5) {
                    this.explodeBomb(p.sprite, true);
                    this.damageObject(tower, 1);
                    p.sprite.destroy();
                    this.projectiles.splice(i, 1);
                    hit = true;
                }
            });
            if (hit) continue;
            // Collision with castle
            if (this.castle.active && Phaser.Math.Distance.Between(p.x, p.y, this.castle.x, this.castle.y) < this.castle.displayWidth * 0.5) {
                this.explodeBomb(p.sprite, true);
                this.damageObject(this.castle, 1);
                p.sprite.destroy();
                this.projectiles.splice(i, 1);
                continue;
            }
            // Collision with soldiers
            this.soldiers.getChildren().forEach(soldier => {
                if (soldier.active && Phaser.Math.Distance.Between(p.x, p.y, soldier.x, soldier.y) < soldier.displayWidth * 0.5) {
                    this.explodeBomb(p.sprite, true);
                    this.damageObject(soldier, 1);
                    p.sprite.destroy();
                    this.projectiles.splice(i, 1);
                    hit = true;
                }
            });
            if (hit) continue;
        }

        // Show defeat banner only if bombs are empty AND no objects destroyed
        if (!this.defeatBannerShown && this.bombsLeft === 0 && this.projectiles.length === 0 && this.bombGroup.countActive(true) === 0) {
            const allSoldiersAlive = this.soldiers.getChildren().every(s => s.active);
            const allTowersAlive = this.towers.getChildren().every(t => t.active);
            const castleAlive = this.castle.active;
            if (allSoldiersAlive && allTowersAlive && castleAlive) {
                this.defeatBannerShown = true;
                this.physics.pause();
                this.showEndBanner('defeat');
            }
        }
    }

    preload() {
            this.load.image('bombs_amount', 'assets/Battle_Screen/Bombs_Amount.png');
        this.load.audio('cannon_move', 'assets/Battle_Screen/sounds/Cannon_move.wav');
        this.load.image('cannon_smoke', 'assets/Battle_Screen/cannon_smoke.png');
        this.load.image('victory_1_star', 'assets/Battle_Screen/victory_1_star.png');
        this.load.image('victory_2_stars', 'assets/Battle_Screen/victory_2_stars.png');
        this.load.image('victory_3_stars', 'assets/Battle_Screen/victory_3_stars.png');
        this.load.image('defete_banner', 'assets/Battle_Screen/defete_banner.png');
        this.load.audio('intro_logo', 'assets/Battle_Screen/sounds/The_Crimson_Vanguard_Opening.mp3');
        this.load.audio('bg_music', 'assets/Battle_Screen/sounds/Dragon_s_Ascent_BG.mp3');
        this.load.audio('bomb_hit', 'assets/Battle_Screen/sounds/medium-explosion.wav');
        this.load.audio('cannon_fire', 'assets/Battle_Screen/sounds/cannon-fire.wav');
        this.load.audio('victory_sound', 'assets/Battle_Screen/sounds/triumphant-success.mp3');
        this.load.audio('defeat_sound', 'assets/Battle_Screen/sounds/defeat-sound-effect.mp3');
        this.load.image('cannon_lvl1', 'assets/Battle_Screen/Cannon_lvl1.png');
        this.load.image('soldier_back', 'assets/Battle_Screen/Soldier_back.png');
        this.load.image('tower_lvl1', 'assets/Battle_Screen/Tower_lvl1.png');
        this.load.image('castle', 'assets/Battle_Screen/Castle.png');
        this.load.image('bomb', 'assets/Battle_Screen/Bomb_lvl1.png');
        this.load.image('explosion', 'assets/Battle_Screen/Explosion.png');
        const bgNames = [
            'Crystals_bg', 'Desert_1_bg', 'Desert_2_bg', 'Forest_2_bg',
            'FutearisticCity_bg', 'Graveyerd_bg', 'Islend_bg', 'Snow_1_bg', 'Snow_2_bg',
            'Snow_3_bg', 'StormyNight_bg', 'Volcano_bg'
        ];
        bgNames.forEach(bg => {
            this.load.image(bg, `assets/Battle_Screen/bg/${bg}.png`);
        });
        this.load.image('joystick_panel', 'assets/General/Joystic_panel_1.png');
    }
    create() {
                        // Bomb amount UI at top left
                        const bombIconSize = Math.min(this.scale.width, this.scale.height) * 0.11;
                        this.bombAmountSprite = this.add.image(bombIconSize * 0.6, bombIconSize * 0.6, 'bombs_amount');
                        this.bombAmountSprite.setDisplaySize(bombIconSize, bombIconSize);
                        this.bombAmountSprite.setDepth(1000);
                        // Bomb count text styled like attached image
                        this.bombAmountText = this.add.text(bombIconSize * 1.18, bombIconSize * 0.6, this.bombsLeft.toString(), {
                            fontFamily: 'Arial Black',
                            fontSize: Math.floor(bombIconSize * 0.7) + 'px',
                            color: '#ffb300',
                            fontStyle: 'bold',
                            stroke: '#00eaff',
                            strokeThickness: Math.floor(bombIconSize * 0.13),
                            shadow: { offsetX: 0, offsetY: 2, color: '#000', blur: 4, fill: true }
                        });
                        this.bombAmountText.setOrigin(0, 0.5);
                        this.bombAmountText.setDepth(1001);
                        // Update bomb count display
                        if (this.bombAmountText && this.bombAmountText.text !== this.bombsLeft.toString()) {
                            this.bombAmountText.setText(this.bombsLeft.toString());
                        }
                this.bombsLeft = this.maxBombs;
            // Set Arcade Physics world bounds to match the game size
            this.physics.world.setBounds(0, 0, this.scale.width, this.scale.height);
        // Declare w, h, panelW, panelH, panelY FIRST
        const w = this.scale.width;
        const h = this.scale.height;
        const panelW = w * 0.78;
        const panelH = h * 0.12;
        const panelY = h - 4 - panelH / 2; // borderThickness = 4

        // Add joystick panel image at the bottom left
        const joystickPanelY = panelY;
        const joystickPanelX = w * 0.08;
        const joystickPanelW = panelW * 0.18;
        const joystickPanelH = panelH * 0.9;
        this.joystickPanel = this.add.image(joystickPanelX, joystickPanelY, 'joystick_panel');
        this.joystickPanel.setOrigin(0.5, 0.5);
        this.joystickPanel.setDisplaySize(joystickPanelW, joystickPanelH);

        // Add background image (choose one, e.g., 'Crystals_bg')
        this.add.image(w / 2, h / 2, 'Crystals_bg').setDisplaySize(w, h).setDepth(0);

        // Add fire button at the right side of the panel (after background)
        const fireBtnSize = panelH * 0.7;
        const fireBtnX = w - fireBtnSize * 0.7; // Padding from right edge
        this.fireBtn = this.add.rectangle(fireBtnX, panelY, fireBtnSize, fireBtnSize, 0xffffff, 0.8);
        this.fireBtn.setOrigin(0.5, 0.5);
        this.fireBtn.setInteractive();
        this.fireBtn.setDepth(20);
        this.fireBtnText = this.add.text(fireBtnX, panelY, 'FIRE', {
            fontSize: Math.floor(fireBtnSize * 0.4) + 'px',
            color: '#000',
            fontStyle: 'bold'
        });
        this.fireBtnText.setOrigin(0.5, 0.5);
        this.fireBtnText.setDepth(21);

        // Add power meter bar above the fire button, right side
        const powerBarW = fireBtnSize * 1.2;
        const powerBarH = fireBtnSize * 0.18;
        const powerBarY = panelY - fireBtnSize / 2 - powerBarH * 1.5;
        this.powerBarBg = this.add.rectangle(fireBtnX, powerBarY, powerBarW, powerBarH, 0x888888, 0.5);
        this.powerBarBg.setOrigin(0.5, 0.5);
        this.powerBarBg.setDepth(22);
        this.powerBar = this.add.rectangle(fireBtnX, powerBarY, powerBarW * 0.5, powerBarH, 0x00ff00, 0.9);
        this.powerBar.setOrigin(0.5, 0.5);
        this.powerBar.setScale(0.5, 1);
        this.powerBar.setDepth(23);
        this.powerBar.visible = false;
        this.powerBarBg.visible = false;

        // --- Controls logic ---
        this.joystickPanel.setInteractive();
        this.joystickPanel.on('pointerdown', (pointer) => {
            this.joystickPanel.isDragging = true;
        });
        this.joystickPanel.on('pointerup', () => {
            this.joystickPanel.isDragging = false;
        });
        this.joystickPanel.on('pointermove', (pointer) => {
            if (this.joystickPanel.isDragging) {
                // Calculate angle from cannon to pointer
                const dx = pointer.x - this.cannon.x;
                const dy = pointer.y - this.cannon.y;
                const angle = Phaser.Math.RadToDeg(Math.atan2(dy, dx));
                this.cannon.setAngle(angle);
            }
        });

        // --- Power meter and variable velocity logic ---
        let power = 0.5; // 0..1
        let powerDirection = 1;
        let powerTween = null;
        let fireBtnPressed = false;
        let powerBarUpdateEvent = null;

        const fireBomb = (powerValue) => {
            if (this.bombsLeft <= 0) return;
            this.bombsLeft--;
            if (this.bombAmountText) {
                this.bombAmountText.setText(this.bombsLeft.toString());
            }
            // Use the same trigonometry as cannon aiming
            const cannonLength = this.cannon.displayHeight / 2;
            const angleDeg = this.cannon.angle;
            const angleRad = Phaser.Math.DegToRad(angleDeg);
            const bombOffset = 10;
            const tipX = this.cannon.x - Math.sin(angleRad) * (cannonLength + bombOffset);
            const tipY = this.cannon.y + Math.cos(angleRad) * (cannonLength + bombOffset);
            // Speed: min 250, max 600
            const speed = 250 + 350 * powerValue;
            const vx = -Math.sin(angleRad) * speed;
            const vy = Math.cos(angleRad) * speed;
            // Create bomb sprite (no physics)
            const bombSprite = this.add.sprite(tipX, tipY, 'bomb');
            bombSprite.setOrigin(0.5, 0.5);
            bombSprite.setDisplaySize(40, 40);
            bombSprite.setAngle(angleDeg);
            // Add to projectiles array
            this.projectiles.push({
                x: tipX,
                y: tipY,
                vx,
                vy,
                sprite: bombSprite,
                age: 0
            });
            // Add cannon smoke at the tip of the barrel
            const smoke = this.add.sprite(tipX, tipY, 'cannon_smoke');
            smoke.setOrigin(0.5, 0.5);
            smoke.setDisplaySize(50, 50);
            smoke.setAngle(angleDeg);
            smoke.setAlpha(1);
            smoke.setDepth(100); // Ensure smoke is above cannon
            // Fade out and destroy after 1 second
            this.tweens.add({
                targets: smoke,
                alpha: 0,
                duration: 1000,
                onComplete: () => smoke.destroy()
            });
            this.sound.play('cannon_fire');
        };

        this.fireBtn.on('pointerdown', () => {
            fireBtnPressed = true;
            this.powerBar.visible = true;
            this.powerBarBg.visible = true;
            power = 0.5;
            powerDirection = 1;
            // Animate power bar up and down
            if (powerBarUpdateEvent) powerBarUpdateEvent.remove();
            powerBarUpdateEvent = this.time.addEvent({
                delay: 16,
                loop: true,
                callback: () => {
                    if (!fireBtnPressed) return;
                    power += powerDirection * 0.012;
                    if (power >= 1) { power = 1; powerDirection = -1; }
                    if (power <= 0) { power = 0; powerDirection = 1; }
                    this.powerBar.setScale(power, 1);
                    // Color: green (low) to red (high)
                    const color = Phaser.Display.Color.Interpolate.ColorWithColor(
                        new Phaser.Display.Color(0, 255, 0),
                        new Phaser.Display.Color(255, 0, 0),
                        1,
                        power
                    );
                    this.powerBar.fillColor = Phaser.Display.Color.GetColor(color.r, color.g, color.b);
                }
            });
            // If released quickly, treat as tap (medium power)
            this.fireBtnTapTimeout = this.time.delayedCall(180, () => {
                // If still holding after 180ms, keep power bar animating
            });
        });

        this.fireBtn.on('pointerup', () => {
            if (!fireBtnPressed) return;
            fireBtnPressed = false;
            this.powerBar.visible = false;
            this.powerBarBg.visible = false;
            if (powerBarUpdateEvent) powerBarUpdateEvent.remove();
            let usePower;
            // If released quickly (tap), use normal (slower) speed
            if (this.fireBtnTapTimeout && this.fireBtnTapTimeout.getProgress() < 1) {
                usePower = 0.35; // Normal, slower speed
            } else {
                usePower = power;
            }
            fireBomb(usePower);
        });
        // Duplicate declarations removed. Use the ones at the top of create().

        // Add background image (choose one, e.g., 'Crystals_bg')
        this.add.image(w / 2, h / 2, 'Crystals_bg').setDisplaySize(w, h);

        // Add cannon sprite at top center, closer to the top edge, pointing vertically downwards (Y axis)
        const cannonR = Math.min(w, h) * 0.15;
        const cannonX = w / 2;
        const cannonY = h * 0.01 + cannonR; // Move even closer to the top
        this.cannon = this.physics.add.sprite(cannonX, cannonY, 'cannon_lvl1');
        this.cannon.setOrigin(0.5, 0.5);
        this.cannon.setDisplaySize(cannonR * 2, cannonR * 2);
        this.cannon.setDepth(2); // Ensure cannon is above background
        this.cannon.setAngle(0); // 0 degrees = vertical (downwards, along Y axis)

        // --- Tap-to-Aim control with 170 degree limit ---
        // --- Drag-to-Aim: Cannon follows finger while holding ---
        let aiming = false;
        const updateCannonAngle = (pointer) => {
            // Ignore touches on the fire button
            if (pointer.x > this.fireBtn.x - this.fireBtn.width / 1.5 &&
                pointer.x < this.fireBtn.x + this.fireBtn.width / 1.5 &&
                pointer.y > this.fireBtn.y - this.fireBtn.height / 1.5 &&
                pointer.y < this.fireBtn.y + this.fireBtn.height / 1.5) {
                return;
            }
            // Calculate angle from cannon barrel tip to pointer
            // Assume barrel tip is at the edge of the cannon sprite in the direction it's facing
            const cannonLength = this.cannon.displayHeight / 2; // barrel length (from center to tip)
            const barrelAngleRad = Phaser.Math.DegToRad(this.cannon.angle);
            const barrelTipX = this.cannon.x + Math.sin(barrelAngleRad) * cannonLength;
            const barrelTipY = this.cannon.y + Math.cos(barrelAngleRad) * cannonLength;
            // Calculate angle from barrel tip to pointer
            const dx = pointer.x - this.cannon.x;
            const dy = pointer.y - this.cannon.y;
            let angle = Phaser.Math.RadToDeg(-Math.atan2(dx, dy));
            // Restrict angle to 180-degree arc (from left to right, facing down)
            if (angle < -90) angle = -90;
            if (angle > 90) angle = 90;
            this.cannon.setAngle(angle);
        };
        this.input.on('pointerdown', (pointer) => {
            // Only start aiming if not on fire button
            if (!(pointer.x > this.fireBtn.x - this.fireBtn.width / 2 &&
                pointer.x < this.fireBtn.x + this.fireBtn.width / 2 &&
                pointer.y > this.fireBtn.y - this.fireBtn.height / 2 &&
                pointer.y < this.fireBtn.y + this.fireBtn.height / 2)) {
                aiming = true;
                updateCannonAngle(pointer);
                this.sound.play('cannon_move');
            }
        });
        this.input.on('pointermove', (pointer) => {
            if (aiming && pointer.isDown) {
                updateCannonAngle(pointer);
            }
        });
        this.input.on('pointerup', () => {
            aiming = false;
        });

        // Make towers and castle more circular and centered, above the panel
        this.towers = this.physics.add.group();
        let panelTopY = panelY - panelH / 2;
        // Towers: restore to previous position above the panel
        let castleR = Math.min(w, h) * 0.09;
        let castleMarginBottom = Math.min(w, h) * 0.04 + 10; // margin from bottom
        let castleY = h - castleMarginBottom - castleR; // near the bottom
        let towerY = panelTopY - Math.min(w, h) * 0.09 - 10; // original towerY
        let towerX1 = w * 0.35;
        let towerX2 = w * 0.65;
        let towerR = Math.min(w, h) * 0.07;
        let tower1 = this.physics.add.sprite(towerX1, towerY, 'tower_lvl1');
        tower1.setOrigin(0.5, 0.5);
        tower1.setDisplaySize(towerR * 2, towerR * 2);
        tower1.setData('alive', true);
        tower1.setData('health', 3);
        tower1.healthBar = this.add.rectangle(towerX1, towerY - towerR - 10, towerR * 2, 8, 0xff0000);
        tower1.healthBar.setOrigin(0.5, 0.5);
        this.towers.add(tower1);
        let tower2 = this.physics.add.sprite(towerX2, towerY, 'tower_lvl1');
        tower2.setOrigin(0.5, 0.5);
        tower2.setDisplaySize(towerR * 2, towerR * 2);
        tower2.setData('alive', true);
        tower2.setData('health', 3);
        tower2.healthBar = this.add.rectangle(towerX2, towerY - towerR - 10, towerR * 2, 8, 0xff0000);
        tower2.healthBar.setOrigin(0.5, 0.5);
        this.towers.add(tower2);
        // Castle centered and circular, now much closer to the bottom
        this.castle = this.physics.add.sprite(w / 2, castleY, 'castle');
        this.castle.setOrigin(0.5, 0.5);
        this.castle.setDisplaySize(castleR * 2, castleR * 2);
        this.castle.setData('alive', true);
        this.castle.setData('health', 5);
        this.castle.healthBar = this.add.rectangle(w / 2, castleY - castleR - 10, castleR * 2, 10, 0xff0000);
        this.castle.healthBar.setOrigin(0.5, 0.5);
        // Add 3 soldiers centered in the screen
        this.soldiers = this.physics.add.group();
        const soldierY = h * 0.5;
        const soldierR = Math.min(w, h) * 0.07;
        const soldierSpacing = w * 0.12;
        for (let i = 0; i < 3; i++) {
            const soldierX = w * 0.5 + (i - 1) * soldierSpacing;
            let soldier = this.physics.add.sprite(soldierX, soldierY, 'soldier_back');
            soldier.setOrigin(0.5, 0.5);
            soldier.setDisplaySize(soldierR, soldierR);
            soldier.setData('health', 2);
            soldier.healthBar = this.add.rectangle(soldierX, soldierY - soldierR / 2 - 8, soldierR, 6, 0xff0000);
            soldier.healthBar.setOrigin(0.5, 0.5);
            this.soldiers.add(soldier);
        }
        // Bomb firing state
        this.bombGroup = this.physics.add.group({
            runChildUpdate: true,
            classType: Phaser.Physics.Arcade.Sprite
        });

        // Collide bombs with towers
        this.physics.add.collider(this.bombGroup, this.towers, (bomb, tower) => {
            this.explodeBomb(bomb, true);
            this.damageObject(tower, 1);
        });
        // Collide bombs with castle
        this.physics.add.collider(this.bombGroup, this.castle, (bomb, castle) => {
            this.explodeBomb(bomb, true);
            this.damageObject(castle, 1);
        });
        // Collide bombs with world bounds
        this.bombGroup.children.iterate((bomb) => {
            if (bomb) {
                bomb.body.collideWorldBounds = true;
                bomb.body.onWorldBounds = true;
            }
        });
        this.physics.world.on('worldbounds', (body) => {
            // Find the bomb sprite from the body
            const bomb = body.gameObject;
            if (this.bombGroup.contains(bomb)) {
                this.explodeBomb(bomb, false);
            }
        });
        // Border variables
        const borderThickness = 4;
        const borderColor = 0xffffff;
        // Navigation to Village (only show other screens)
        const navBtnSize = Math.min(w, h) * 0.12;
        const navBtnY = h * 0.08;
        // ...existing code...
        // ...existing code...
    }
    damageObject(obj, dmg) {
        let health = obj.getData('health');
                health -= dmg;
                obj.setData('health', health);
                // Update health bar
                if (obj.healthBar) {
                    let maxHealth = 2;
                    if (obj.texture.key === 'tower_lvl1') maxHealth = 3;
                    if (obj.texture.key === 'castle') maxHealth = 5;
                    obj.healthBar.width = obj.displayWidth * (health / maxHealth);
                }
                if (health <= 0) {
                    obj.setData('alive', false);
                    obj.destroy();
                    if (obj.healthBar) obj.healthBar.destroy();
                    // If the destroyed object is the castle, stop the game and show the victory banner
                    if (obj.texture && obj.texture.key === 'castle') {
                        this.physics.pause();
                        this.showEndBanner('victory');
                    }
                }
            }


    showEndBanner(type) {
        // type: 'victory' or 'defeat'
        const w = this.scale.width;
        const h = this.scale.height;
        let bannerKey = 'defete_banner';
        let soundKey = 'defeat_sound';
        let stars = 0;
        if (type === 'victory') {
            // Count destroyed objects
            let soldiersDestroyed = 0;
            let towersDestroyed = 0;
            let castleDestroyed = 0;
            this.soldiers.getChildren().forEach(s => { if (!s.active) soldiersDestroyed++; });
            this.towers.getChildren().forEach(t => { if (!t.active) towersDestroyed++; });
            if (!this.castle.active) castleDestroyed = 1;
            // Determine stars
            if (castleDestroyed) {
                bannerKey = 'victory_3_stars';
                stars = 3;
            } else if (soldiersDestroyed > 0 && towersDestroyed > 0) {
                bannerKey = 'victory_2_stars';
                stars = 2;
            } else if (soldiersDestroyed > 0 && towersDestroyed === 0 && !castleDestroyed) {
                bannerKey = 'victory_1_star';
                stars = 1;
            } else {
                bannerKey = 'victory_1_star';
                stars = 1;
            }
            soundKey = 'victory_sound';
        }
        // Show banner
        const banner = this.add.image(w / 2, h / 2, bannerKey);
        banner.setOrigin(0.5, 0.5);
        banner.setDisplaySize(w * 0.7, h * 0.3);
        banner.setDepth(200);
        // Play sound
        this.sound.play(soundKey);
        // Add banner navigation/retry buttons only here
        const btnW = w * 0.22;
        const btnH = h * 0.11;
        const btnY = h / 2 + banner.displayHeight / 2 + btnH * 0.7;
        let btnLabel = (type === 'victory') ? 'Next' : 'Retry';
        // Village button
        const btnVillage = this.add.rectangle(w / 2 - btnW * 0.6, btnY, btnW, btnH, 0x4e9a06, 0.92).setDepth(201).setInteractive();
        const txtVillage = this.add.text(btnVillage.x, btnVillage.y, 'Village', { fontSize: Math.floor(btnH * 0.38) + 'px', color: '#fff', fontStyle: 'bold' }).setOrigin(0.5).setDepth(202);
        btnVillage.on('pointerup', () => { this.scene.start('village'); });
        // Retry/Next button
        const btnRetry = this.add.rectangle(w / 2 + btnW * 0.6, btnY, btnW, btnH, 0x1e3a5c, 0.92).setDepth(201).setInteractive();
        const txtRetry = this.add.text(btnRetry.x, btnRetry.y, btnLabel, { fontSize: Math.floor(btnH * 0.38) + 'px', color: '#fff', fontStyle: 'bold' }).setOrigin(0.5).setDepth(202);
        btnRetry.on('pointerup', () => {
            this.scene.restart();
        });
    }
    // ...existing code...

    explodeBomb(bomb, didDamage) {
                // Play explosion sound
                this.sound.play('bomb_hit');
                // Remove bomb
                const x = bomb.x;
                const y = bomb.y;
                bomb.destroy();
                // Show explosion image at bomb location
                const explosion = this.add.image(x, y, 'explosion');
                explosion.setOrigin(0.5, 0.5);
                explosion.setDisplaySize(Math.min(this.sys.game.config.width, this.sys.game.config.height) * 0.12, Math.min(this.sys.game.config.width, this.sys.game.config.height) * 0.12);
                // Fade out and destroy after 1 second
                this.tweens.add({
                    targets: explosion,
                    alpha: 0,
                    duration: 1000,
                    onComplete: () => explosion.destroy()
                });
                // If didDamage, apply damage logic here
            }
    // Example: Call this when bomb hits a target
    bombHitTarget() {
        this.sound.play('bomb_hit');
    }

    // Example: Call this when player wins
    playerVictory() {
        this.sound.play('victory_sound');
    }

    // Example: Call this when player loses
    playerDefeat() {
        this.sound.play('defeat_sound');
    }

    // Options method (currently empty, safe placeholder)
    options() {
        // Add options logic here if needed in the future
    }
}

export default BattleScene;
