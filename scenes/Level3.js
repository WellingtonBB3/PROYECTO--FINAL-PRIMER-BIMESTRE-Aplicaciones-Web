import Phaser from 'phaser';

import AudioManager from '../managers/AudioManager.js';
import GameStateManager from '../managers/GameStateManager.js';
import Player from '../objects/Player.js';
import { DEFAULT_GRAVITY_Y } from '../physics/constants.js';
import { sideScrollerWorld } from '../physics/world.js';
import { createHud } from '../ui/Hud.js';
import { createMuteButton } from '../ui/MuteButton.js';
import { registerPauseControls } from '../ui/PauseControls.js';
import { anyJumpJustPressed, createTouchControls } from '../ui/TouchControls.js';

export default class Level3 extends Phaser.Scene {
  constructor() {
    super({ key: 'Level3' });
  }

  create() {
    AudioManager.playMusic(this, 'bgm');
    GameStateManager.setCurrentLevel(this, 3);

    const { width, height, worldWidth } = sideScrollerWorld(this);
    this.uiScale = Phaser.Math.Clamp(Math.min(width / 1280, height / 720), 0.55, 1);

    // Fondo
    const bg = this.add.image(worldWidth / 2, height / 2, 'level3Background');
    bg.setDisplaySize(worldWidth, height);
    bg.setDepth(-1);

    // Físicas
    this.physics.world.gravity.y = DEFAULT_GRAVITY_Y;

    // Estado
    this.lives = 3;
    this.invulnerable = false;

    // HUD
    this.hud = createHud(this, { showScore: true });
    this.hud.setLives(this.lives);
    this.hud.setScore(GameStateManager.getScore(this));

    // Suelo
    const groundOffset = Phaser.Math.Clamp(Math.round(height * 0.14), 50, 140);
    this.groundY = height - groundOffset;
    const ground = this.add.rectangle(worldWidth / 2, this.groundY, worldWidth, 40, 0x8b4513);
    this.ground = this.physics.add.existing(ground, true);
    this.ground.body.gameObject.setVisible(false);

    // Player
    const playerDisplayWidth = Math.round(250 * this.uiScale);
    const playerDisplayHeight = Math.round(312 * this.uiScale);
    const playerBodyWidth = Math.max(40, Math.round(playerDisplayWidth * 0.35));
    const playerBodyHeight = Math.max(70, Math.round(playerDisplayHeight * 0.5));

    const startY = Phaser.Math.Clamp(
      this.groundY - Math.round(220 * this.uiScale),
      50,
      this.groundY - 60
    );
    this.player = new Player(this, 100, startY, {
      displayWidth: playerDisplayWidth,
      displayHeight: playerDisplayHeight,
      bodyWidth: playerBodyWidth,
      bodyHeight: playerBodyHeight,
    });

    this.physics.add.collider(this.player, this.ground);

    // Cámara
    this.cameras.main.startFollow(this.player);

    // Input
    this.keys = this.input.keyboard.addKeys({
      a: Phaser.Input.Keyboard.KeyCodes.A,
      d: Phaser.Input.Keyboard.KeyCodes.D,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE,
    });

    this.touchControls = createTouchControls(this, { showJump: true });

    // UI global
    createMuteButton(this);
    registerPauseControls(this);

    // Cajas
    this.boxes = this.physics.add.group();

    this.time.addEvent({
      delay: 1500,
      callback: this.spawnBox,
      callbackScope: this,
      loop: true,
    });

    this.physics.add.overlap(this.player, this.boxes, this.onHitBox, null, this);
  }

  spawnBox() {
    const worldWidth = this.physics.world.bounds.width;

    const x = Phaser.Math.Between(0, worldWidth);
    const uiScale = this.uiScale ?? 1;
    const box = this.boxes.create(x, -50 * uiScale, 'caja');
    box.setScale(0.3 * uiScale);

    // Hitbox
    box.body.setSize(90 * uiScale, 90 * uiScale);

    // Más peso
    box.body.setGravityY(200);
  }

  onHitBox(player, box) {
    if (this.invulnerable) return;

    box.destroy();

    this.lives -= 1;
    this.hud.setLives(this.lives);

    AudioManager.playSfx(this, 'sfxHit', { volume: 0.6 });

    if (this.lives <= 0) {
      this.scene.launch('GameOver', { returnScene: this.sys.settings.key });
      this.scene.pause();
      return;
    }

    this.invulnerable = true;
    player.setTint(0xff0000);

    this.time.delayedCall(
      1000,
      () => {
        this.invulnerable = false;
        player.clearTint();
      },
      [],
      this
    );
  }

  update() {
    const left = this.keys.a.isDown || this.touchControls.state.left;
    const right = this.keys.d.isDown || this.touchControls.state.right;

    let velocityX = 0;
    if (left && !right) velocityX = -200;
    if (right && !left) velocityX = 200;

    this.player.setVelocityX(velocityX);

    if (velocityX < 0) this.player.flipX = true;
    if (velocityX > 0) this.player.flipX = false;

    if (velocityX !== 0) {
      this.player.anims.play('prota-run', true);
    } else {
      this.player.anims.stop();
      this.player.setTexture('prota-0');
    }

    // Salto
    if (anyJumpJustPressed(this, this.keys.space, this.touchControls)) {
      if (this.player.body.blocked.down || this.player.body.touching.down) {
        this.player.setVelocityY(-420);
        AudioManager.playSfx(this, 'sfxJump', { volume: 0.5 });
      }
    }

    // Limpieza: cajas fuera de bounds
    const height = this.scale.height;
    this.boxes.children.iterate((b) => {
      if (!b) return;
      if (b.y > height + 200) b.destroy();
    });

    // Victoria: final del mapa
    const worldWidth = this.physics.world.bounds.width;
    const finalX = worldWidth - 250;

    if (this.player.x >= finalX) {
      this.scene.stop();
      this.scene.start('Win');
    }
  }
}
