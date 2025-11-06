import { getNowIST } from './date.js';
export function generateInlineCalendar(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const today = getNowIST();

  const monthName = firstDay.toLocaleString('en-US', { month: 'long' });
  const keyboard = [];

  // --- Row 1: Navigation ---
  keyboard.push([
    { text: '<<', callback_data: `n_${year}-${month}_--` },
    { text: `${monthName.slice(0, 3)} ${year}`, callback_data: ' ' },
    { text: '>>', callback_data: `n_${year}-${month}_++` },
  ]);

  // --- Row 2: Weekday Header ---
  keyboard.push([
    { text: 'Su', callback_data: ' ' },
    { text: 'Mo', callback_data: ' ' },
    { text: 'Tu', callback_data: ' ' },
    { text: 'We', callback_data: ' ' },
    { text: 'Th', callback_data: ' ' },
    { text: 'Fr', callback_data: ' ' },
    { text: 'Sa', callback_data: ' ' },
  ]);

  // --- Rows 3–8: Dates Grid ---
  const daysRow: any[] = [];
  let emptyCells = firstDay.getDay();

  // Empty leading cells
  for (let i = 0; i < emptyCells; i++) {
    daysRow.push({ text: ' ', callback_data: 'ignore' });
  }

  for (let d = 1; d <= lastDay.getDate(); d++) {
    // This date
    const thisDate = new Date(year, month, d);

    const isPast =
      thisDate <
      new Date(today.getFullYear(), today.getMonth(), today.getDate());

    if (isPast) {
      // Disabled past date
      daysRow.push({
        text: ' ', // dim dot instead of number
        callback_data: ' ',
      });
    } else {
      // Active future/today date
      daysRow.push({
        text: `${d}`,
        callback_data: `n_${year}-${month + 1}-${d}_0`,
      });
    }

    if (daysRow.length === 7) {
      keyboard.push([...daysRow]);
      daysRow.length = 0;
    }
  }

  // Fill last row trailing empty cells
  if (daysRow.length > 0) {
    while (daysRow.length < 7)
      daysRow.push({ text: ' ', callback_data: 'ignore' });

    keyboard.push([...daysRow]);
  }

  // --- Last Row: bottom navigation ---
  keyboard.push([
    { text: '<', callback_data: `n_${year}_${month}_--` },
    { text: '>', callback_data: `n_${year}_${month}_++` },
  ]);

  return keyboard;
}
