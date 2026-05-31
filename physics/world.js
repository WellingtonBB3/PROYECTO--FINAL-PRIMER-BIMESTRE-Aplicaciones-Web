import { WORLD_WIDTH_MULTIPLIER } from './constants.js';

export function sideScrollerWorld(scene, { multiplier = WORLD_WIDTH_MULTIPLIER } = {}) {
  const width = scene.scale.width;
  const height = scene.scale.height;
  const worldWidth = width * multiplier;

  scene.physics.world.setBounds(0, 0, worldWidth, height);
  scene.cameras.main.setBounds(0, 0, worldWidth, height);

  return { width, height, worldWidth };
}
