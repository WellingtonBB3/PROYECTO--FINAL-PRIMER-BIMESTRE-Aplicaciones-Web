import StorageManager from './StorageManager.js';

export default class AudioManager {
  static #music = null;

  static applyMute(scene) {
    scene.sound.mute = StorageManager.getAudioMuted();
  }

  static toggleMute(scene) {
    const next = !scene.sound.mute;
    scene.sound.mute = next;
    StorageManager.setAudioMuted(next);
    return next;
  }

  static playMusic(scene, key, config = {}) {
    if (!scene.cache.audio.exists(key)) return null;

    if (AudioManager.#music && AudioManager.#music.key === key) {
      if (!AudioManager.#music.isPlaying) {
        AudioManager.#music.play();
      }
      return AudioManager.#music;
    }

    if (AudioManager.#music) {
      AudioManager.#music.stop();
      AudioManager.#music.destroy();
      AudioManager.#music = null;
    }

    AudioManager.#music = scene.sound.add(key, {
      loop: true,
      volume: 0.4,
      ...config,
    });

    AudioManager.#music.play();
    return AudioManager.#music;
  }

  static stopMusic() {
    if (!AudioManager.#music) return;
    AudioManager.#music.stop();
    AudioManager.#music.destroy();
    AudioManager.#music = null;
  }

  static playSfx(scene, key, config = {}) {
    if (!scene.cache.audio.exists(key)) return;
    scene.sound.play(key, config);
  }
}
