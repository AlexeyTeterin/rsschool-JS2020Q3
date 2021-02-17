import { COLUMNS } from './sortStats.js';
import StatsRow from './StatsRow.js';
import { createElement } from './utils.js';

export default class StatsPanel {
  constructor(scores) {
    const statsPanel = createElement('div', 'stats-field');
    const headRow = createElement('div', ['row', 'head-row']);
    const resetBtn = createElement('button', 'reset-btn', 'Reset');
    const repeatBtn = createElement('button', 'repeat-btn', 'Repeat difficult words');
    const buttons = createElement('div', 'buttons');

    COLUMNS.forEach((column) => {
      const div = createElement('div', 'sorter', column, column);
      headRow.append(div);
    });
    buttons.append(repeatBtn, resetBtn);
    statsPanel.append(buttons, headRow);

    Object.keys(scores).forEach((word) => {
      const row = new StatsRow(word, scores);
      statsPanel.append(row);
    });

    return statsPanel;
  }
}
