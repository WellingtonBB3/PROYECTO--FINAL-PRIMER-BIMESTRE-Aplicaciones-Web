import Phaser from 'phaser';

import AudioManager from '../managers/AudioManager.js';
import GameStateManager from '../managers/GameStateManager.js';

export default class Preload extends Phaser.Scene {
  constructor() {
    super({ key: 'Preload' });
  }

  preload() {
    const { width, height } = this.scale;

    const loadingText = this.add
      .text(width / 2, height / 2, 'Cargando... 0%', {
        fontSize: '24px',
        fill: '#fff',
        backgroundColor: '#000',
        padding: { x: 12, y: 8 },
      })
      .setOrigin(0.5);

    this.load.on('progress', (value) => {
      loadingText.setText(`Cargando... ${Math.round(value * 100)}%`);
    });

    // --- IMÁGENES ---
    this.load.image('background', 'assets/Guayaquil.jpg');
    this.load.image('playButton', 'assets/botons.png');

    this.load.image('level1Background', 'assets/Malecon.png');
    this.load.image('fondoCerro', 'assets/CerroSan.png');
    this.load.image('level3Background', 'assets/Bahia.png');

    this.load.image('pauseBg', 'assets/pausa.png');
    this.load.image('bolita', 'assets/bala.jpg');
    this.load.image('caja', 'assets/caja1.png');

    this.load.image('gameOverBg', 'assets/GameOver.png');
    this.load.image('winBg', 'assets/Ganar.png');

    for (let i = 0; i < 10; i++) {
      const frameNum = String(i).padStart(3, '0');
      this.load.image(`prota-${i}`, `assets/prota${frameNum}.png`);
    }

    for (let i = 0; i < 10; i++) {
      const frameNum = String(i).padStart(3, '0');
      this.load.image(`choro-${i}`, `assets/choro${frameNum}.png`);
    }

    for (let i = 1; i <= 4; i++) {
      this.load.image(`disparador-${i}`, `assets/disparador${i}.png`);
    }

    // --- AUDIO ---
    // En Vite, los archivos que se cargan por URL deben estar en public/.
    // Coloca los audios en public/audio (si no existen, verás 404 en consola).
    this.load.audio('bgm', 'audio/bgm.mp3');
    this.load.audio('sfxJump',  'audio/jump.mp3');
    this.load.audio('sfxHit', 'audio/hit.mp3');
  }

  create() {
    // Animaciones globales (se crean una sola vez)
    if (!this.anims.exists('prota-run')) {
      const protaFrames = [];
      for (let i = 0; i < 10; i++) {
        protaFrames.push({ key: `prota-${i}` });
      }
      this.anims.create({
        key: 'prota-run',
        frames: protaFrames,
        frameRate: 10,
        repeat: -1,
      });
    }

    if (!this.anims.exists('choro-run')) {
      const choroFrames = [];
      for (let i = 0; i < 10; i++) {
        choroFrames.push({ key: `choro-${i}` });
      }
      this.anims.create({
        key: 'choro-run',
        frames: choroFrames,
        frameRate: 10,
        repeat: -1,
      });
    }

    if (!this.anims.exists('disparador-disparo')) {
      const disparadorFrames = [
        { key: 'disparador-1' },
        { key: 'disparador-2' },
        { key: 'disparador-3' },
        { key: 'disparador-4' },
      ];
      this.anims.create({
        key: 'disparador-disparo',
        frames: disparadorFrames,
        frameRate: 8,
        repeat: 0,
      });
    }

    // Estado + persistencia
    GameStateManager.bootstrap(this);

    // Audio: aplicar mute persistido
    AudioManager.applyMute(this);

    this.scene.start('MainMenu');
  }
}
