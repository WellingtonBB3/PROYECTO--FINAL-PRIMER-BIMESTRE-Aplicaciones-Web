import Phaser from 'phaser';

import GameStateManager from '../managers/GameStateManager.js';
import { createMuteButton } from '../ui/MuteButton.js';

function detectReturnScene(scene) {
  const candidateKeys = ['Level3', 'Level2', 'Level1'];
  for (const key of candidateKeys) {
    if (scene.scene.isPaused(key) || scene.scene.isActive(key)) {
      return key;
    }
  }
  return 'Level1';
}

export default class GameOver extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOver' });
  }

  create(data) {
    const returnScene = data?.returnScene || detectReturnScene(this);

    // Persistir high score
    GameStateManager.commitHighScore(this);

    const score = GameStateManager.getScore(this);
    const highScore = this.registry.get('highScore') ?? 0;

    const { width, height } = this.scale;
    const uiScale = Phaser.Math.Clamp(Math.min(width / 1280, height / 720), 0.55, 1);

    // Fondo
    const bg = this.add.image(width / 2, height / 2, 'gameOverBg');
    bg.setDisplaySize(width, height);

    // Marcadores
    this.add
      .text(width / 2, height * 0.18, `Puntaje: ${score}\nHigh Score: ${highScore}`, {
        fontSize: `${Math.round(26 * uiScale)}px`,
        fill: '#fff',
        backgroundColor: '#000',
        padding: { x: Math.round(14 * uiScale), y: Math.round(10 * uiScale) },
        align: 'center',
        wordWrap: { width: Math.max(220, width - 40), useAdvancedWrap: true },
      })
      .setOrigin(0.5)
      .setDepth(10);

    // Botón invisible para reintentar (mantiene el layout original)
    const btnRetryW = Math.min(600 * uiScale, width * 0.9);
    const btnRetryH = Math.min(180 * uiScale, height * 0.25);
    const btnRetry = this.add.rectangle(width / 2, height * 0.68, btnRetryW, btnRetryH, 0x000000, 0);
    btnRetry.setDepth(10);
    btnRetry.setInteractive({ useHandCursor: true });

    btnRetry.on('pointerdown', () => {
      GameStateManager.resetRun(this);
      this.scene.stop(returnScene);
      this.scene.start(returnScene);
    });

    btnRetry.on('pointerover', () => btnRetry.setAlpha(0.2));
    btnRetry.on('pointerout', () => btnRetry.setAlpha(0));

    // Botón visible alternativo (por accesibilidad / si el área del PNG no coincide)
    const btnMenuText = this.add
      .text(width / 2, height * 0.9, 'Volver al menú', {
        fontSize: `${Math.round(22 * uiScale)}px`,
        fill: '#fff',
        backgroundColor: '#000',
        padding: { x: Math.round(12 * uiScale), y: Math.round(8 * uiScale) },
      })
      .setOrigin(0.5)
      .setDepth(11)
      .setInteractive({ useHandCursor: true });

    btnMenuText.on('pointerdown', () => {
      GameStateManager.resetRun(this);
      this.scene.stop(returnScene);
      this.scene.start('MainMenu');
    });

    createMuteButton(this);
  }
}
