import Phaser from 'phaser';

import AudioManager from '../managers/AudioManager.js';
import GameStateManager from '../managers/GameStateManager.js';
import StorageManager from '../managers/StorageManager.js';
import { createMuteButton } from '../ui/MuteButton.js';

export default class MainMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenu' });
    }

    create() {

        // Música (si existe en /audio)
        AudioManager.playMusic(this, 'bgm');

        // Tamaño actual de la pantalla/canvas
        const width = this.scale.width;
        const height = this.scale.height;
        const uiScale = Phaser.Math.Clamp(Math.min(width / 1280, height / 720), 0.5, 1);

        const highScore = StorageManager.getHighScore();
        const levelReached = StorageManager.getLevelReached();

        // Fondo ocupando toda la pantalla
        const bg = this.add.image(width / 2, height / 2, 'background');
        bg.setDisplaySize(width, height);

        // Botón centrado abajo (escala dinámica para que no quede cortado)
        const playBtn = this.add
            .image(width / 2, height / 2, 'playButton')
            .setInteractive({ useHandCursor: true });

        const maxBtnWidth = width * 0.6;
        const maxBtnHeight = height * 0.18;
        const btnScale = Math.min(maxBtnWidth / playBtn.width, maxBtnHeight / playBtn.height, 1);
        playBtn.setScale(btnScale);

        const gap = Math.max(10, Math.round(18 * uiScale));
        const bottomPadding = Math.max(12, Math.round(24 * uiScale));
        playBtn.setPosition(width / 2, height - bottomPadding - playBtn.displayHeight / 2);

        playBtn.on('pointerdown', () => {
            // Cerrar overlays si estaban abiertos
            this.scene.stop('PauseMenu');
            this.scene.stop('GameOver');
            this.scene.stop('Win');

            // Reiniciar estado de partida
            GameStateManager.resetRun(this);

            this.scene.start('Level1');
        });

        // HUD del menú (instrucciones + progreso)
        const infoText = this.add
            .text(width / 2, 0, `High Score: ${highScore}\nNivel alcanzado: ${levelReached}`, {
                fontSize: `${Math.round(22 * uiScale)}px`,
                fill: '#fff',
                backgroundColor: '#000',
                padding: { x: Math.round(14 * uiScale), y: Math.round(10 * uiScale) },
                align: 'center',
                wordWrap: { width: Math.max(220, width - 40), useAdvancedWrap: true },
            })
            .setOrigin(0.5);

        const controlsText = this.add
            .text(
                width / 2,
                0,
                'Controles Desktop: A/D mover, ESPACIO saltar, ESC o PAUSA para pausar\nMobile: botones táctiles en pantalla',
                {
                    fontSize: `${Math.round(18 * uiScale)}px`,
                    fill: '#fff',
                    backgroundColor: '#000',
                    padding: { x: Math.round(14 * uiScale), y: Math.round(10 * uiScale) },
                    align: 'center',
                    wordWrap: { width: Math.max(220, width - 40), useAdvancedWrap: true },
                }
            )
            .setOrigin(0.5);

        // Layout vertical para que nada quede fuera de pantalla
        controlsText.setPosition(
            width / 2,
            playBtn.y - playBtn.displayHeight / 2 - gap - controlsText.height / 2
        );

        infoText.setPosition(width / 2, controlsText.y - controlsText.height / 2 - gap - infoText.height / 2);

        // Botón de mute
        createMuteButton(this);
    }
}