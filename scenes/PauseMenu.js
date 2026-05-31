import Phaser from 'phaser';

function detectReturnScene(scene) {
  const candidateKeys = ['Level1', 'Level2', 'Level3'];
  for (const key of candidateKeys) {
    if (scene.scene.isPaused(key) || scene.scene.isActive(key)) {
      return key;
    }
  }
  return 'Level1';
}

export default class PauseMenu extends Phaser.Scene {
  constructor() {
    super({ key: 'PauseMenu' });
  }

  create(data) {
    this.returnScene = data?.returnScene || detectReturnScene(this);

    const { width, height } = this.scale;
    const uiScale = Phaser.Math.Clamp(Math.min(width / 1280, height / 720), 0.55, 1);

    const overlay = this.add
      .rectangle(0, 0, width, height, 0x000000, 0.6)
      .setOrigin(0, 0)
      .setDepth(100);
    overlay.setInteractive({ useHandCursor: true });

    const pauseImg = this.add
      .image(width / 2, height / 2, 'pauseBg')
      .setDepth(101);

    // Asegurar que la imagen quepa en pantallas pequeñas
    const maxPauseW = width * 0.9;
    const maxPauseH = height * 0.65;
    const pauseScale = Math.min(maxPauseW / pauseImg.width, maxPauseH / pauseImg.height, uiScale, 1);
    pauseImg.setScale(pauseScale);

    const hint = this.add
      .text(width / 2, height * 0.15, 'Toca o presiona ESC para continuar', {
        fontSize: `${Math.round(18 * uiScale)}px`,
        fill: '#fff',
        backgroundColor: '#000',
        padding: { x: 10, y: 6 },
      })
      .setOrigin(0.5)
      .setDepth(102);

    // Botones invisibles alineados con la imagen de pausa
    const btnWidth = Math.min(550 * uiScale, pauseImg.displayWidth * 0.9);
    const btnHeight = Math.min(90 * uiScale, pauseImg.displayHeight * 0.22);
    const offsetY = pauseImg.displayHeight * 0.2;

    const btnReiniciar = this.add
      .rectangle(width / 2, pauseImg.y - offsetY, btnWidth, btnHeight, 0x000000, 0)
      .setDepth(103)
      .setInteractive({ useHandCursor: true });

    btnReiniciar.on('pointerdown', () => {
      this.scene.stop();
      this.scene.stop(this.returnScene);
      this.scene.start(this.returnScene);
    });

    btnReiniciar.on('pointerover', () => btnReiniciar.setAlpha(0.2));
    btnReiniciar.on('pointerout', () => btnReiniciar.setAlpha(0));

    const btnMenu = this.add
      .rectangle(width / 2, pauseImg.y + offsetY, btnWidth, btnHeight, 0x000000, 0)
      .setDepth(103)
      .setInteractive({ useHandCursor: true });

    btnMenu.on('pointerdown', () => {
      this.scene.stop();
      this.scene.stop(this.returnScene);
      this.scene.start('MainMenu');
    });

    btnMenu.on('pointerover', () => btnMenu.setAlpha(0.2));
    btnMenu.on('pointerout', () => btnMenu.setAlpha(0));

    const resume = () => {
      this.scene.stop();
      this.scene.resume(this.returnScene);
    };

    overlay.on('pointerdown', resume);
    pauseImg.setInteractive({ useHandCursor: true }).on('pointerdown', resume);
    hint.setInteractive({ useHandCursor: true }).on('pointerdown', resume);

    this.input.keyboard?.once('keydown-ESC', resume);
  }
}
