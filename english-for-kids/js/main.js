/* eslint-disable import/extensions */
import Game from './game.js';
import handleStatsHeaderClick from './sortStats.js';

new Game().init();

document.addEventListener('click', handleStatsHeaderClick);
