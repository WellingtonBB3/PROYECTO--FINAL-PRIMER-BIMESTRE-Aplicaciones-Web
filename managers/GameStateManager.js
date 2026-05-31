import StorageManager from './StorageManager.js';

const REGISTRY_KEYS = Object.freeze({
  score: 'score',
  highScore: 'highScore',
  currentLevel: 'currentLevel',
  levelReached: 'levelReached',
});

export default class GameStateManager {
  static bootstrap(scene) {
    // Valores por defecto (si no existen)
    if (scene.registry.get(REGISTRY_KEYS.score) === undefined) {
      scene.registry.set(REGISTRY_KEYS.score, 0);
    }

    scene.registry.set(REGISTRY_KEYS.highScore, StorageManager.getHighScore());
    scene.registry.set(REGISTRY_KEYS.levelReached, StorageManager.getLevelReached());

    if (scene.registry.get(REGISTRY_KEYS.currentLevel) === undefined) {
      scene.registry.set(REGISTRY_KEYS.currentLevel, 1);
    }
  }

  static resetRun(scene) {
    scene.registry.set(REGISTRY_KEYS.score, 0);
    scene.registry.set(REGISTRY_KEYS.currentLevel, 1);
  }

  static setCurrentLevel(scene, levelNumber) {
    const safeLevel = Math.min(Math.max(Number(levelNumber) || 1, 1), 3);
    scene.registry.set(REGISTRY_KEYS.currentLevel, safeLevel);
  }

  static getScore(scene) {
    return Number(scene.registry.get(REGISTRY_KEYS.score)) || 0;
  }

  static addScore(scene, delta) {
    const next = Math.max(0, GameStateManager.getScore(scene) + (Number(delta) || 0));
    scene.registry.set(REGISTRY_KEYS.score, next);
    return next;
  }

  static commitProgress(scene, { levelReached } = {}) {
    if (levelReached !== undefined) {
      StorageManager.setLevelReached(levelReached);
      scene.registry.set(REGISTRY_KEYS.levelReached, StorageManager.getLevelReached());
    }
  }

  static commitHighScore(scene) {
    const score = GameStateManager.getScore(scene);
    const prevHigh = StorageManager.getHighScore();
    if (score > prevHigh) {
      StorageManager.setHighScore(score);
    }
    scene.registry.set(REGISTRY_KEYS.highScore, StorageManager.getHighScore());
  }
}
