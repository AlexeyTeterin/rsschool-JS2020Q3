const rows = () => document.querySelectorAll('.row');

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

const sortUp = (nodes, indexOfColumn) => sortDown(nodes, indexOfColumn).reverse();

const setRowsOrder = (direction, columnID) => {
  const columns = ['category', 'word', 'translation', 'correct', 'wrong', 'trained', '% correct'];
  const columnIndex = columns.indexOf(columnID);
  const isUp = direction === 'up';
  const order = isUp ? sortUp(rows(), columnIndex) : sortDown(rows(), columnIndex);

  rows().forEach((row) => row.style.setProperty('order', order.indexOf(row)));
};

const clearSelection = () => {
  const selectedColumn = document.querySelector('.sorted');
  if (selectedColumn) selectedColumn.classList.remove('sorted', 'up', 'down');
};

const setSelection = (className, element) => element.classList.add('sorted', className);

const resetRowsOrder = () => rows().forEach((row) => row.style.removeProperty('order'));

const sortStats = (column) => {
  const isTargetSorted = column.classList.contains('sorted');
  const isTargetSortedDown = column.classList.contains('down');

  clearSelection();
  if (!isTargetSorted) {
    setRowsOrder('up', column.id);
    setSelection('up', column);
  } else if (!isTargetSortedDown) {
    setRowsOrder('down', column.id);
    setSelection('down', column);
  } else {
    resetRowsOrder();
  }
};

export default function handleStatsHeaderClick(event) {
  const { target } = event;
  const isHeadRowClick = target.parentElement.classList.contains('head-row');

  if (!isHeadRowClick) return;

  sortStats(target);
}
