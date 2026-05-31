import Phaser from 'phaser';

import AudioManager from '../managers/AudioManager.js';
import GameStateManager from '../managers/GameStateManager.js';
import Player from '../objects/Player.js';
import { createHud } from '../ui/Hud.js';
import { createMuteButton } from '../ui/MuteButton.js';
import { registerPauseControls } from '../ui/PauseControls.js';
import { createTouchControls } from '../ui/TouchControls.js';

export default class Level2 extends Phaser.Scene {
  constructor() {
    super({ key: 'Level2' });
  }

  create() {
    AudioManager.playMusic(this, 'bgm');
    GameStateManager.setCurrentLevel(this, 2);

    const { width, height } = this.scale;
    const uiScale = Phaser.Math.Clamp(Math.min(width / 1280, height / 720), 0.55, 1);

    // Fondo
    const bg = this.add.image(width / 2, height / 2, 'fondoCerro');
    bg.setDisplaySize(width, height);
    bg.setDepth(-1);

    // Bounds del mundo y cámara
    this.physics.world.setBounds(0, 0, width, height);
    this.cameras.main.setBounds(0, 0, width, height);

    // Estado
    this.lives = 3;
    this.timeRemaining = 30;
    this.invulnerable = false;
    this.levelCompleted = false;

    // HUD
    this.hud = createHud(this, { showScore: true });
    this.hud.setLives(this.lives);
    this.hud.setScore(GameStateManager.getScore(this));

    this.timeText = this.add
      .text(width - 20, 100, 'Tiempo: 0:30', {
        fontSize: `${Math.round(24 * uiScale)}px`,
        fill: '#fff',
        backgroundColor: '#000',
        padding: { x: 10, y: 5 },
      })
      .setOrigin(1, 0)
      .setScrollFactor(0)
      .setDepth(200);

    this.victoryText = this.add
      .text(width / 2, height / 2, '', {
        fontSize: `${Math.round(48 * uiScale)}px`,
        fill: '#00ff00',
        fontStyle: 'bold',
        backgroundColor: '#000',
        padding: { x: 20, y: 20 },
        align: 'center',
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(200)
      .setVisible(false);

    // Player
    this.player = new Player(this, width / 2, height - 120, {
      displayWidth: Math.round(200 * uiScale),
      displayHeight: Math.round(200 * uiScale),
      bodyWidth: Math.max(26, Math.round(50 * uiScale)),
      bodyHeight: Math.max(26, Math.round(50 * uiScale)),
    });

    // Input
    this.keys = this.input.keyboard.addKeys({
      a: Phaser.Input.Keyboard.KeyCodes.A,
      d: Phaser.Input.Keyboard.KeyCodes.D,
    });

    this.touchControls = createTouchControls(this, { showJump: false });

    // UI global
    createMuteButton(this);
    registerPauseControls(this);

    // Proyectiles
    this.projectiles = this.physics.add.group();
    this.projectiles.setDepth(10);

    // Disparadores (sprites)
    this.dispensers = [];

    const makeDispenser = (x, y, flipX) => {
      const disp = this.add.sprite(x, y, 'disparador-1');
      disp.setDisplaySize(Math.round(200 * uiScale), Math.round(200 * uiScale));
      disp.setFlipX(flipX);
      disp.pos = { x, y };
      this.dispensers.push(disp);
    };

    const marginX = Math.max(80, Math.round(120 * uiScale));
    const marginY = Math.max(80, Math.round(120 * uiScale));
    const clampX = (v) => Phaser.Math.Clamp(v, marginX, width - marginX);
    const clampY = (v) => Phaser.Math.Clamp(v, marginY, height - marginY);

    makeDispenser(clampX(width * 0.15), clampY(height * 0.35), false);
    makeDispenser(clampX(width * 0.85), clampY(height * 0.18), true);
    makeDispenser(clampX(width * 0.45), clampY(height * 0.4), false);
    makeDispenser(clampX(width * 0.78), clampY(height * 0.65), true);

    // Timers
    this.time.addEvent({
      delay: 1000,
      callback: this.tickClock,
      callbackScope: this,
      loop: true,
    });

    this.time.addEvent({
      delay: 2000,
      callback: this.fireFromRandomDispenser,
      callbackScope: this,
      loop: true,
    });

    // Colisiones
    this.physics.add.overlap(this.player, this.projectiles, this.onHit, null, this);
  }

  update() {
    if (this.levelCompleted) return;

    const left = this.keys.a.isDown || this.touchControls.state.left;
    const right = this.keys.d.isDown || this.touchControls.state.right;

    let velocityX = 0;
    if (left && !right) velocityX = -300;
    if (right && !left) velocityX = 300;

    this.player.setVelocityX(velocityX);

    if (velocityX < 0) {
      this.player.setFlipX(true);
      this.player.anims.play('prota-run', true);
    } else if (velocityX > 0) {
      this.player.setFlipX(false);
      this.player.anims.play('prota-run', true);
    } else {
      this.player.anims.stop();
      this.player.setTexture('prota-0');
    }

    // Limpieza: destruir proyectiles fuera de pantalla
    const { width, height } = this.scale;
    this.projectiles.children.iterate((b) => {
      if (!b) return;
      if (b.x < -80 || b.x > width + 80 || b.y < -80 || b.y > height + 80) {
        b.destroy();
      }
    });
  }

  fireFromRandomDispenser() {
    if (this.levelCompleted) return;

    const dispenser = Phaser.Utils.Array.GetRandom(this.dispensers);
    if (!dispenser) return;

    dispenser.anims.play('disparador-disparo', true);

    // Dirección hacia el jugador
    let dx = this.player.x - dispenser.pos.x;
    let dy = this.player.y - dispenser.pos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 0) {
      dx /= distance;
      dy /= distance;
    }

    const bullet = this.projectiles.create(dispenser.pos.x, dispenser.pos.y, 'bolita');
    bullet.setScale(0.08);

    if (dispenser.flipX === false) {
      bullet.setFlipX(true);
    }

    bullet.body.setCircle(8);

    const speed = 200;
    bullet.setVelocity(dx * speed, dy * speed);
  }

  onHit(player, bullet) {
    if (this.levelCompleted) return;
    if (this.invulnerable) return;

    bullet.destroy();

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

  tickClock() {
    if (this.levelCompleted) return;

    this.timeRemaining -= 1;

    const minutes = Math.floor(this.timeRemaining / 60);
    let seconds = this.timeRemaining % 60;
    if (seconds < 10) seconds = `0${seconds}`;

    this.timeText.setText(`Tiempo: ${minutes}:${seconds}`);

    if (this.timeRemaining <= 0) {
      this.levelCompleted = true;

      // Bonus por completar
      const score = GameStateManager.addScore(this, 5);
      this.hud.setScore(score);

      this.victoryText.setText('¡Nivel completado!').setVisible(true);

      // Persistir progreso
      GameStateManager.commitProgress(this, { levelReached: 3 });

      this.time.delayedCall(
        2000,
        () => {
          this.scene.stop();
          this.scene.start('Level3');
        },
        [],
        this
      );
    }
  }
}
