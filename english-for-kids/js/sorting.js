const tryParseInt = (str) => {
  const parsed = parseInt(str, 10);
  return (Number.isNaN(parsed)) ? str : parsed;
};

const sortDown = (nodes, indexOfColumn) => Array.from(nodes)
  .slice(1)
  .sort((a, b) => {
    const first = tryParseInt(a.childNodes[indexOfColumn].textContent);
    const second = tryParseInt(b.childNodes[indexOfColumn].textContent);
    if (second < first) return -1;
    if (second > first) return 1;
    return 0;
  });

const sorters = [
  'category', 'word', 'translation', 'correct', 'wrong', 'trained', '% correct',
];

const resetHeaderStyle = () => {
  const sortedHeader = document.querySelector('.sorted');
  if (sortedHeader) sortedHeader.classList.remove('sorted', 'up', 'down');
};

const removeSorting = (rows) => {
  resetHeaderStyle();
  rows.forEach((row) => row.style.removeProperty('order'));
};

export default function handleStatsSorting(event) {
  const { target } = event;
  const isHeadRowClick = target.parentElement.classList.contains('head-row');
  if (!isHeadRowClick) return;

  const isTargetSorted = target.classList.contains('sorted');
  const isTargetSortedDown = target.classList.contains('down');
  const columnIndex = sorters.indexOf(target.id);
  const rows = document.querySelectorAll('.row');
  const sortStats = (direction) => {
    const isUp = direction === 'up';
    const order = isUp ? sortDown(rows, columnIndex).reverse() : sortDown(rows, columnIndex);
    target.classList.add('sorted', direction);
    rows.forEach((row) => row.style.setProperty('order', order.indexOf(row)));
  };

  resetHeaderStyle();
  if (!isTargetSorted) {
    sortStats('up');
  } else if (!isTargetSortedDown) {
    sortStats('down');
  } else {
    removeSorting(rows);
  }
}
