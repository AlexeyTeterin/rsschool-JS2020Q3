import { COLUMNS } from './sortStats.js';
import { createElement, getCardStats } from './utils.js';

export default class StatsPanel {
  constructor(scores) {
    this.scores = scores;
    this.statsPanel = createElement('div', 'stats-field');

    const headRow = createElement('div', ['row', 'head-row']);
    const resetBtn = createElement('button', 'reset-btn', 'Reset');
    const repeatBtn = createElement('button', 'repeat-btn', 'Repeat difficult words');
    const buttons = createElement('div', 'buttons');

    COLUMNS.forEach((column) => {
      const div = createElement('div', 'sorter', column, column);
      headRow.append(div);
    });
    buttons.append(repeatBtn, resetBtn);
    this.statsPanel.append(buttons, headRow);

    Object.keys(scores).forEach((word) => this.renderStatsRow(word));

    return this.statsPanel;
  }

  createStatsRow(word) {
    const row = createElement('div', 'row', '', word);
    const columns = getCardStats(this.scores[word]);

    columns.forEach((column) => {
      const div = createElement('div', null, column);
      row.append(div);
    });

    return row;
  }

  renderStatsRow(word) {
    const row = this.createStatsRow(word);
    this.statsPanel.append(row);
  }
}
