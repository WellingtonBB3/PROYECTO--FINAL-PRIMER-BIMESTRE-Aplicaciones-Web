import AudioManager from '../managers/AudioManager.js';

export function createMuteButton(scene, { x, y } = {}) {
  const { width, height } = scene.scale;
  const uiScale = Math.max(0.55, Math.min(1, Math.min(width / 1280, height / 720)));

  const padding = Math.round(10 * uiScale);
  const posX = x ?? scene.scale.width - padding;
  const posY = y ?? padding;

  const style = {
    fontSize: `${Math.round(18 * uiScale)}px`,
    fill: '#fff',
    backgroundColor: '#000',
    padding: { x: 10, y: 6 },
  };

  const label = scene.add
    .text(posX, posY, '', style)
    .setOrigin(1, 0)
    .setScrollFactor(0)
    .setDepth(200)
    .setInteractive({ useHandCursor: true });

  const sync = () => {
    label.setText(scene.sound.mute ? 'SONIDO: OFF' : 'SONIDO: ON');
  };

  sync();

  label.on('pointerdown', () => {
    AudioManager.toggleMute(scene);
    sync();
  });

  return { label, sync };
}
