import GameStateManager from '../managers/GameStateManager.js';

export function createHud(scene, { showScore = true } = {}) {
  const { width, height } = scene.scale;
  const uiScale = Math.max(0.55, Math.min(1, Math.min(width / 1280, height / 720)));

  const style = {
    fontSize: `${Math.round(24 * uiScale)}px`,
    fill: '#fff',
    backgroundColor: '#000',
    padding: { x: 10, y: 5 },
  };

  const x = Math.round(20 * uiScale);
  const yTop = Math.round(20 * uiScale);
  const yGap = Math.round(40 * uiScale);

  const livesText = scene.add
    .text(x, yTop, 'Vidas: 3', style)
    .setScrollFactor(0)
    .setDepth(200);

  let scoreText = null;
  if (showScore) {
    scoreText = scene.add
      .text(x, yTop + yGap, `Puntaje: ${GameStateManager.getScore(scene)}`, style)
      .setScrollFactor(0)
      .setDepth(200);
  }

  return {
    livesText,
    scoreText,
    setLives(value) {
      livesText.setText(`Vidas: ${value}`);
    },
    setScore(value) {
      if (scoreText) scoreText.setText(`Puntaje: ${value}`);
    },
    destroy() {
      livesText.destroy();
      if (scoreText) scoreText.destroy();
    },
  };
}
