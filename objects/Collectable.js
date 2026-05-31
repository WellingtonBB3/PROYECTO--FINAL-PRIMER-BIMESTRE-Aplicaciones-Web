import Phaser from 'phaser';

export default class Collectable extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture = 'caja') {
    super(scene, x, y, texture);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setScale(0.2);
    this.body.setAllowGravity(false);
  }
}
