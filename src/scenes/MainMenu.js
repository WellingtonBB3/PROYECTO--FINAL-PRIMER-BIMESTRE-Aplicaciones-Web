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

        const highScore = StorageManager.getHighScore();
        const levelReached = StorageManager.getLevelReached();

        // Fondo ocupando toda la pantalla
        const bg = this.add.image(width / 2, height / 2, 'background');

        bg.setDisplaySize(width, height);

        // Botón centrado abajo
        const playBtn = this.add.image(width / 2, height * 0.85, 'playButton')
            .setInteractive();

        playBtn.setScale(0.2);

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
        this.add
            .text(
                width / 2,
                height * 0.62,
                `High Score: ${highScore}\nNivel alcanzado: ${levelReached}`,
                {
                    fontSize: '22px',
                    fill: '#fff',
                    backgroundColor: '#000',
                    padding: { x: 14, y: 10 },
                    align: 'center',
                }
            )
            .setOrigin(0.5);

        this.add
            .text(
                width / 2,
                height * 0.74,
                'Controles Desktop: A/D mover, ESPACIO saltar, ESC o PAUSA para pausar\nMobile: botones táctiles en pantalla',
                {
                    fontSize: '18px',
                    fill: '#fff',
                    backgroundColor: '#000',
                    padding: { x: 14, y: 10 },
                    align: 'center',
                }
            )
            .setOrigin(0.5);

        // Botón de mute
        createMuteButton(this);
    }
}