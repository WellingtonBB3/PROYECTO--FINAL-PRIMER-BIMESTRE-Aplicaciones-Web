export function registerPauseControls(scene) {
  const { width, height } = scene.scale;
  const uiScale = Math.max(0.55, Math.min(1, Math.min(width / 1280, height / 720)));

  const style = {
    fontSize: `${Math.round(18 * uiScale)}px`,
    fill: '#fff',
    backgroundColor: '#000',
    padding: { x: 10, y: 6 },
  };

  const openPause = () => {
    if (!scene.scene.isActive()) return;
    if (scene.scene.isActive('PauseMenu')) return;
    scene.scene.launch('PauseMenu', { returnScene: scene.sys.settings.key });
    scene.scene.pause();
  };

  const btn = scene.add
    .text(width - 20, Math.round(56 * uiScale), 'PAUSA', style)
    .setOrigin(1, 0)
    .setScrollFactor(0)
    .setDepth(200)
    .setInteractive({ useHandCursor: true });

  btn.on('pointerdown', openPause);

  scene.input.keyboard?.on('keydown-ESC', openPause);
  scene.events.once('shutdown', () => {
    scene.input.keyboard?.off('keydown-ESC', openPause);
  });

  return {
    button: btn,
    openPause,
  };
}
