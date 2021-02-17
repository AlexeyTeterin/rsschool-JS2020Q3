import { createElement, getCardStats } from './utils.js';

export default class StatsRow {
  constructor(word, scores) {
    const row = createElement('div', 'row', '', word);
    const columns = getCardStats(scores[word]);

    columns.forEach((column) => {
      const div = createElement('div', null, column);
      row.append(div);
    });

    return row;
  }
}
