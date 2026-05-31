import Phaser from 'phaser';

import AudioManager from '../managers/AudioManager.js';
import GameStateManager from '../managers/GameStateManager.js';
import Player from '../objects/Player.js';
import Thief from '../objects/Thief.js';
import { DEFAULT_GRAVITY_Y } from '../physics/constants.js';
import { sideScrollerWorld } from '../physics/world.js';
import { createHud } from '../ui/Hud.js';
import { createMuteButton } from '../ui/MuteButton.js';
import { registerPauseControls } from '../ui/PauseControls.js';
import { anyJumpJustPressed, createTouchControls } from '../ui/TouchControls.js';

// Nivel ambientado en el Malecón de Guayaquil
export default class Level1 extends Phaser.Scene {
  constructor() {
    super({ key: 'Level1' });
  }

  create() {
    AudioManager.playMusic(this, 'bgm');
    GameStateManager.setCurrentLevel(this, 1);

    const { width, height, worldWidth } = sideScrollerWorld(this);
    this.uiScale = Phaser.Math.Clamp(Math.min(width / 1280, height / 720), 0.55, 1);

    // Fondo
    this.bg = this.add.image(worldWidth / 2, height / 2, 'level1Background');
    this.bg.setDisplaySize(worldWidth, height);
    this.bg.setDepth(-1);

    // Físicas
    this.physics.world.gravity.y = DEFAULT_GRAVITY_Y;

    // Estado del nivel
    this.objectiveKills = 5;
    this.kills = 0;
    this.objectiveCompleted = false;
    this.transitioning = false;

    this.lives = 3;
    this.invulnerable = false;

    // HUD
    this.hud = createHud(this, { showScore: true });
    this.hud.setLives(this.lives);
    this.hud.setScore(GameStateManager.getScore(this));

    this.killsText = this.add
      .text(20, 100, `Enemigos: ${this.kills}/${this.objectiveKills}`, {
        fontSize: `${Math.round(24 * this.uiScale)}px`,
        fill: '#fff',
        backgroundColor: '#000',
        padding: { x: 10, y: 5 },
      })
      .setScrollFactor(0)
      .setDepth(200);

    this.messageText = this.add
      .text(width / 2, 140, '', {
        fontSize: `${Math.round(28 * this.uiScale)}px`,
        fill: '#00ff00',
        backgroundColor: '#000',
        padding: { x: 15, y: 10 },
        align: 'center',
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(200)
      .setVisible(false);

    // Suelo
    const groundOffset = Phaser.Math.Clamp(Math.round(height * 0.2), 70, 180);
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

    // Enemigo (primer spawn)
    this.time.delayedCall(
      3000,
      () => {
        if (this.scene.isActive()) this.spawnEnemy();
      },
      [],
      this
    );
  }

  spawnEnemy() {
    const height = this.scale.height;
    const worldWidth = this.physics.world.bounds.width;
    const uiScale = this.uiScale ?? Phaser.Math.Clamp(Math.min(this.scale.width / 1280, height / 720), 0.55, 1);

    const lado = Phaser.Math.Between(0, 1);
    let spawnX;

    if (lado === 0) {
      // Derecha
      spawnX = Math.min(this.player.x + 800, worldWidth - 300);
    } else {
      // Izquierda
      spawnX = Math.max(this.player.x - 800, 300);
    }

    const groundY = this.groundY ?? height - Phaser.Math.Clamp(Math.round(height * 0.2), 70, 180);
    const spawnY = Phaser.Math.Clamp(groundY - Math.round(250 * uiScale), 50, groundY - 60);

    const enemyDisplayWidth = Math.round(250 * uiScale);
    const enemyDisplayHeight = Math.round(300 * uiScale);
    const enemyBodyWidth = Math.round(enemyDisplayWidth * 0.25);
    const enemyBodyHeight = Math.round(enemyDisplayHeight * 0.30);

    if (this.enemyCollider) {
      this.enemyCollider.destroy();
      this.enemyCollider = null;
    }

    this.enemy = new Thief(this, spawnX, spawnY, {
      displayWidth: enemyDisplayWidth,
      displayHeight: enemyDisplayHeight,
      bodyWidth: enemyBodyWidth,
      bodyHeight: enemyBodyHeight,
    });

    this.physics.add.collider(this.enemy, this.ground);

    this.enemyCollider = this.physics.add.collider(
      this.player,
      this.enemy,
      this.onPlayerEnemyCollide,
      null,
      this
    );
  }

  onPlayerEnemyCollide(player, enemy) {
    if (!player?.active || !enemy?.active) return;

    // 'Aplastar' = el cuerpo del jugador llega desde arriba
    const tolerance = Math.max(8, Math.round(12 * (this.uiScale ?? 1)));
    const stomp = player.body.bottom <= enemy.body.top + tolerance;
    if (stomp) {
      enemy.destroy();
      this.enemy = null;
      if (this.enemyCollider) {
        this.enemyCollider.destroy();
        this.enemyCollider = null;
      }

      // Rebote al saltar sobre él
      player.setVelocityY(-300);

      // Gana una vida (máx 3)
      this.lives = Math.min(this.lives + 1, 3);
      this.hud.setLives(this.lives);

      // Suma puntaje
      const score = GameStateManager.addScore(this, 1);
      this.hud.setScore(score);

      // Conteo de enemigos del objetivo
      this.kills += 1;
      this.killsText.setText(`Enemigos: ${this.kills}/${this.objectiveKills}`);

      AudioManager.playSfx(this, 'sfxHit', { volume: 0.5 });

      if (this.kills >= this.objectiveKills) {
        this.objectiveCompleted = true;
        this.messageText
          .setText('Objetivo completado.\nLlega al final del mapa.')
          .setVisible(true);
        return;
      }

      // Spawn siguiente enemigo
      this.time.delayedCall(
        3000,
        () => {
          if (this.scene.isActive() && !this.objectiveCompleted) {
            this.spawnEnemy();
          }
        },
        [],
        this
      );

      return;
    }

    // Daño normal
    if (this.invulnerable) return;

    this.invulnerable = true;
    this.lives -= 1;
    this.hud.setLives(this.lives);

    player.setTint(0xff0000);
    AudioManager.playSfx(this, 'sfxHit', { volume: 0.6 });

    this.time.delayedCall(
      1000,
      () => {
        player.clearTint();
        this.invulnerable = false;
      },
      [],
      this
    );

    if (this.lives <= 0) {
      this.scene.launch('GameOver', { returnScene: this.sys.settings.key });
      this.scene.pause();
    }
  }

  update() {
    if (!this.player?.active) return;

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
        this.player.setVelocityY(-520);
        AudioManager.playSfx(this, 'sfxJump', { volume: 0.5 });
      }
    }

    // Enemigo sigue al jugador
    if (this.enemy && this.enemy.active) {
      this.enemy.follow(this.player, 200);
    }

    // Final del mapa
    const worldWidth = this.physics.world.bounds.width;
    const finalX = worldWidth - 250;

    if (this.player.x >= finalX) {
      if (this.objectiveCompleted) {
        if (this.transitioning) return;
        this.transitioning = true;

        this.messageText.setText('¡Nivel completado!').setVisible(true);

        // Persistir progreso
        GameStateManager.commitProgress(this, { levelReached: 2 });

        this.time.delayedCall(
          2000,
          () => {
            this.scene.stop();
            this.scene.start('Level2');
          },
          [],
          this
        );
      } else {
        const remaining = Math.max(this.objectiveKills - this.kills, 0);
        this.messageText.setText(`Faltan ${remaining} enemigos`).setVisible(true);
      }
    } else if (!this.objectiveCompleted) {
      this.messageText.setVisible(false);
    }
  }
}
