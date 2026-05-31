import Phaser from 'phaser';

import Preload from './scenes/Preload.js';
import MainMenu from './scenes/MainMenu.js';
import Level1 from './scenes/Level1.js';
import Level2 from './scenes/Level2.js';
import Level3 from './scenes/Level3.js';
import PauseMenu from './scenes/PauseMenu.js';
import GameOver from './scenes/GameOver.js';
import Win from './scenes/Win.js';

const config = {
	type: Phaser.AUTO,
	backgroundColor: '#222',
	scale: {
		mode: Phaser.Scale.RESIZE,
		autoCenter: Phaser.Scale.CENTER_BOTH,
		width: window.innerWidth,
		height: window.innerHeight,
	},
	physics: {
		default: 'arcade',
		arcade: {
			debug: false,
		},
	},
	scene: [Preload, MainMenu, Level1, Level2, Level3, PauseMenu, GameOver, Win],
};

// eslint-disable-next-line no-new
new Phaser.Game(config);