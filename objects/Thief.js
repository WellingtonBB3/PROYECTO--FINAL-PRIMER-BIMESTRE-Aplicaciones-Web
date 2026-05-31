import Phaser from 'phaser';

export default class Thief extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, options = {}) {
    const {
      texture = 'choro-0',
      displayWidth = 250,
      displayHeight = 312,
      bodyWidth = 80,
      bodyHeight = 160,
    } = options;

    super(scene, x, y, texture);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setDisplaySize(displayWidth, displayHeight);

    this.body.setSize(bodyWidth, bodyHeight, true);

    this.setCollideWorldBounds(true);

    this.anims.play('choro-run');
  }

  follow(target, speed = 200) {
    if (!this.active || !target?.active) return;

    if (this.x > target.x) {
      this.setVelocityX(-speed);
      this.flipX = true;
    } else {
      this.setVelocityX(speed);
      this.flipX = false;
    }
  }
}
