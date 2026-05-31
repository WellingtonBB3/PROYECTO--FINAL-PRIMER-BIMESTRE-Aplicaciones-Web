const KEY_PREFIX = 'proyecto_juego_';

const KEYS = Object.freeze({
  highScore: `${KEY_PREFIX}highScore`,
  levelReached: `${KEY_PREFIX}levelReached`,
  audioMuted: `${KEY_PREFIX}audioMuted`,
});

function safeParseInt(value, fallback) {
  const parsed = Number.parseInt(String(value), 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function safeParseBool(value, fallback) {
  if (value === true || value === false) return value;
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (value === '1') return true;
  if (value === '0') return false;
  return fallback;
}

export default class StorageManager {
  static isAvailable() {
    try {
      const testKey = `${KEY_PREFIX}__test__`;
      window.localStorage.setItem(testKey, '1');
      window.localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  static getHighScore() {
    if (!StorageManager.isAvailable()) return 0;
    return safeParseInt(window.localStorage.getItem(KEYS.highScore), 0);
  }

  static setHighScore(score) {
    if (!StorageManager.isAvailable()) return;
    const value = Math.max(0, Number(score) || 0);
    window.localStorage.setItem(KEYS.highScore, String(value));
  }

  static getLevelReached() {
    if (!StorageManager.isAvailable()) return 1;
    const level = safeParseInt(window.localStorage.getItem(KEYS.levelReached), 1);
    return Math.min(Math.max(level, 1), 3);
  }

  static setLevelReached(level) {
    if (!StorageManager.isAvailable()) return;
    const safeLevel = Math.min(Math.max(Number(level) || 1, 1), 3);
    const current = StorageManager.getLevelReached();
    if (safeLevel > current) {
      window.localStorage.setItem(KEYS.levelReached, String(safeLevel));
    }
  }

  static getAudioMuted() {
    if (!StorageManager.isAvailable()) return false;
    return safeParseBool(window.localStorage.getItem(KEYS.audioMuted), false);
  }

  static setAudioMuted(muted) {
    if (!StorageManager.isAvailable()) return;
    window.localStorage.setItem(KEYS.audioMuted, muted ? '1' : '0');
  }
}
