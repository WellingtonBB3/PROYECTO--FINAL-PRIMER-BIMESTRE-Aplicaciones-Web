import Phaser from 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(
    scene,
    x,
    y,
    options = {}
  ) {
    const {
      texture = 'prota-0',
      displayWidth = 250,
      displayHeight = 312,
      bodyWidth = 80,
      bodyHeight = 160,
      bodyOffsetX,
      bodyOffsetY,
    } = options;

    super(scene, x, y, texture);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setDisplaySize(displayWidth, displayHeight);

    // Phaser crea el body al agregarlo a physics; aquí ya existe
    const hasOffsets = Number.isFinite(bodyOffsetX) || Number.isFinite(bodyOffsetY);
    if (hasOffsets) {
      this.body.setSize(bodyWidth, bodyHeight);
      this.body.setOffset(bodyOffsetX ?? 0, bodyOffsetY ?? 0);
    } else {
      // Centrado por defecto: colisiones más consistentes entre resoluciones
      this.body.setSize(bodyWidth, bodyHeight, true);
    }

    this.setCollideWorldBounds(true);
  }
}
