// Компонент Log - отображает историю ходов игры
// Props:
// - turns: массив всех сделанных ходов
//   Передается из App.jsx, строка 315 (state gameTurns из App.jsx, строка 191)
//   Каждый элемент массива имеет структуру: {square: {row: number, col: number}, player: 'X' | 'O'}
export default function Log({turns}) {
  // Паттерн: Array.map для рендеринга списка ходов
  // turn - объект {square: {row, col}, player}, key составлен из координат (например "01", "12")
  // Отображаем: turn.player (X/O), turn.square.row (0-2), turn.square.col (0-2)
  return (
  <ol id="log">
    {turns.map(turn => (
      <li key={`${turn.square.row}${turn.square.col}`}>
      {turn.player} selected {turn.square.row}, {turn.square.col}
      </li>
    ))}
  </ol>
  );
}