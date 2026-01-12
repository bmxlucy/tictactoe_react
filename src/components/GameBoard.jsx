
// Компонент GameBoard - отрисовывает игровое поле 3x3 с кнопками для ходов
// Props:
// - onSelectSquare: callback-функция, вызываемая при клике на клетку
//   Передается из App.jsx, строка 310 (функция handleSelectSquare из App.jsx, строка 217)
// - board: двумерный массив 3x3 с текущим состоянием поля (null, 'X' или 'O' в каждой клетке)
//   Передается из App.jsx, строка 311 (вычисляется функцией deriveGameBoard, строка 151, вызывается на строке 200)
// - disabled: булево значение, заблокировано ли поле (игра закончена)
//   Передается из App.jsx, строка 312 (winner || hasDraw)
export default function GameBoard({onSelectSquare, board, disabled}) {
 

  // СТАРЫЙ КОД (закомментирован): раньше состояние поля хранилось здесь в GameBoard
  // Сейчас состояние вынесено в App.jsx для централизованного управления (single source of truth)
  // const [gameBoard, setGameBoard] = useState(initialGameBoard);
  // function handleSelectSquare(rowIndex, colIndex) {
  //   setGameBoard((prevGameBoard) => {
  //     const updatedBoard = [...prevGameBoard.map(innerArray => [...innerArray])];
  //     updatedBoard[rowIndex][colIndex] = activePlayerSymbol;
  //     return updatedBoard;
  //   });

  //   onSelectSquare();
  // }

  // Паттерн: Array.map для рендеринга списка
  // Внешний map: перебираем board (двумерный массив 3x3), row - строка поля, rowIndex - индекс строки (0-2)
  // Внутренний map: перебираем row, playerSymbol - содержимое клетки (null/'X'/'O'), colIndex - индекс столбца (0-2)
  // Кнопка onClick вызывает onSelectSquare с координатами (rowIndex, colIndex) -> handleSelectSquare в App.jsx
  // Кнопка disabled если: playerSymbol !== null (занята) ИЛИ disabled === true (игра закончена)
  return <ol id='game-board'>
    {board.map((row, rowIndex) => (
      <li key={rowIndex}>
        <ol>
          {row.map((playerSymbol, colIndex) => (
            <li key={colIndex}>
              <button onClick={() => onSelectSquare(rowIndex, colIndex)} disabled={playerSymbol !== null || disabled}>
                {playerSymbol}
              </button>
            </li>
          ))}
        </ol>
      </li>
    ))}
  </ol>;
}