import Phaser from 'phaser';

import GameStateManager from '../managers/GameStateManager.js';
import { createMuteButton } from '../ui/MuteButton.js';

export default class Win extends Phaser.Scene {
  constructor() {
    super({ key: 'Win' });
  }

  create() {
    // Persistir high score y nivel máximo
    GameStateManager.commitProgress(this, { levelReached: 3 });
    GameStateManager.commitHighScore(this);

    const score = GameStateManager.getScore(this);
    const highScore = this.registry.get('highScore') ?? 0;

    const { width, height } = this.scale;
    const uiScale = Phaser.Math.Clamp(Math.min(width / 1280, height / 720), 0.55, 1);

    // Fondo
    const bg = this.add.image(width / 2, height / 2, 'winBg');
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

    // Botón invisible para volver al menú (mantiene el layout original)
    const btnMenuW = Math.min(600 * uiScale, width * 0.9);
    const btnMenuH = Math.min(180 * uiScale, height * 0.25);
    const btnMenu = this.add.rectangle(width / 2, height * 0.72, btnMenuW, btnMenuH, 0x000000, 0);
    btnMenu.setDepth(10);
    btnMenu.setInteractive({ useHandCursor: true });

    btnMenu.on('pointerdown', () => {
      GameStateManager.resetRun(this);
      this.scene.start('MainMenu');
    });

    btnMenu.on('pointerover', () => btnMenu.setAlpha(0.2));
    btnMenu.on('pointerout', () => btnMenu.setAlpha(0));

    // Botón visible alternativo (por accesibilidad)
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
      this.scene.start('MainMenu');
    });

    createMuteButton(this);
  }
}
