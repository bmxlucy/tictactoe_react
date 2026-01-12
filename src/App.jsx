// Импортируем хук useState из React для управления состоянием компонента
import {useState} from 'react';
// Импортируем компонент Player, который отображает информацию об игроке и позволяет редактировать имя
// Расположен в src/components/Player.jsx
import Player from "./components/Player.jsx"
// Импортируем компонент GameBoard, который отрисовывает игровое поле 3x3
// Расположен в src/components/GameBoard.jsx
import GameBoard from "./components/GameBoard.jsx"
// Импортируем компонент Log, который отображает историю ходов игроков
// Расположен в src/components/Log.jsx
import Log from './components/Log.jsx';
// Импортируем компонент GameOver, который показывается при завершении игры
// Расположен в src/components/GameOver.jsx
import GameOver from './components/GameOver.jsx';

// Константа с начальными именами игроков
// Используется: 
// 1. Для инициализации state players (строка 102)
// 2. Для передачи initialName в компонент Player (строки 144, 150)
const PLAYERS = {
  X: 'Player 1',
  O: 'Player 2'
};

// Константа с начальным состоянием игрового поля (пустая доска 3x3)
// null означает, что клетка не занята
// Используется в функции deriveGameBoard (строка 90) для создания копии доски
const INITIAL_GAME_BOARD = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

// Массив всех возможных выигрышных комбинаций в крестики-нолики
// Включает: 3 горизонтали, 3 вертикали, 2 диагонали
// Используется в функции deriveWinner (строка 64) для проверки победителя
const WINNING_COMBINATIONS = [
  // Первая горизонталь (верхняя строка)
  [
    { row: 0, column: 0 },
    { row: 0, column: 1 },
    { row: 0, column: 2 },
  ],
  // Вторая горизонталь (средняя строка)
  [
    { row: 1, column: 0 },
    { row: 1, column: 1 },
    { row: 1, column: 2 },
  ],
  // Третья горизонталь (нижняя строка)
  [
    { row: 2, column: 0 },
    { row: 2, column: 1 },
    { row: 2, column: 2 },
  ],
  // Первая вертикаль (левый столбец)
  [
    { row: 0, column: 0 },
    { row: 1, column: 0 },
    { row: 2, column: 0 },
  ],
  // Вторая вертикаль (средний столбец)
  [
    { row: 0, column: 1 },
    { row: 1, column: 1 },
    { row: 2, column: 1 },
  ],
  // Третья вертикаль (правый столбец)
  [
    { row: 0, column: 2 },
    { row: 1, column: 2 },
    { row: 2, column: 2 },
  ],
  // Главная диагональ (слева-сверху вправо-вниз)
  [
    { row: 0, column: 0 },
    { row: 1, column: 1 },
    { row: 2, column: 2 },
  ],
  // Побочная диагональ (справа-сверху влево-вниз)
  [
    { row: 0, column: 2 },
    { row: 1, column: 1 },
    { row: 2, column: 0 },
  ],
];

// Функция для определения победителя игры
// Параметры:
// - gameBoard: текущее состояние игрового поля (приходит из deriveGameBoard, строка 106)
// - players: объект с именами игроков (приходит из state players, строка 107)
// Вызывается: в компоненте App на строке 107
// Возвращает: имя победителя или undefined, если победителя нет
function deriveWinner(gameBoard, players) {
  // Переменная для хранения имени победителя
  let winner;

  // Перебираем все возможные выигрышные комбинации из константы WINNING_COMBINATIONS
    for (const combination of WINNING_COMBINATIONS) {
      // Получаем символ (X или O) из первой клетки комбинации
      // combination[0] - это объект вида {row: 0, column: 0}
      const firstSquareSymbol = gameBoard[combination[0].row][combination[0].column];
      // Получаем символ из второй клетки комбинации
      const secondSquareSymbol = gameBoard[combination[1].row][combination[1].column];
      // Получаем символ из третьей клетки комбинации
      const thirdSquareSymbol = gameBoard[combination[2].row][combination[2].column];

    // Проверяем условия победы:
    // 1. Первая клетка не пустая (firstSquareSymbol не null)
    // 2. Все три клетки содержат одинаковый символ
    if (
      firstSquareSymbol && 
      firstSquareSymbol === secondSquareSymbol && 
      firstSquareSymbol === thirdSquareSymbol
    ) {
      // Если условия выполнены, получаем имя игрока по его символу (X или O)
      // players[firstSquareSymbol] обращается к объекту players: {X: 'Player 1', O: 'Player 2'}
      winner = players[firstSquareSymbol];
    }
  }
  // Возвращаем имя победителя или undefined
  return winner;
}

// Функция для определения активного игрока (чья сейчас очередь ходить)
// Параметр:
// - gameTurns: массив всех сделанных ходов (приходит из state gameTurns)
// Вызывается: 
// 1. В компоненте App на строке 135 для определения activePlayer
// 2. Внутри handleSelectSquare на строке 146 для определения текущего игрока
// Возвращает: 'X' или 'O' - символ игрока, который должен ходить
function deriveActivePlayer(gameTurns) {

  // По умолчанию первым ходит игрок X
  let currentPlayer = 'X';
  // Проверяем, есть ли уже сделанные ходы И последний ход (gameTurns[0]) был сделан игроком X
  // gameTurns[0] - это последний ход, т.к. новые ходы добавляются в начало массива (строка 149)
  // Если последний ход был X, значит теперь ходит O
  if(gameTurns.length > 0 && gameTurns[0].player === 'X') {
    currentPlayer = 'O';
  }
  // Возвращаем символ активного игрока
  return currentPlayer;
}

// Функция для вычисления текущего состояния игрового поля на основе истории ходов
// Параметр:
// - gameTurns: массив всех сделанных ходов (приходит из state gameTurns, строка 136)
// Вызывается: в компоненте App на строке 136
// Возвращает: двумерный массив 3x3 с текущим состоянием игрового поля
function deriveGameBoard(gameTurns) {
  // Создаем глубокую копию начального пустого поля
  // Используем spread operator (...) дважды для создания копии массива и всех вложенных массивов
  // Это важно, чтобы не мутировать константу INITIAL_GAME_BOARD
  let gameBoard = [...INITIAL_GAME_BOARD.map(array => [...array])];

  // Перебираем все сделанные ходы из истории
  for (const turn of gameTurns) {
    // Деструктуризация: извлекаем из объекта хода информацию о клетке и игроке
    // turn имеет структуру: {square: {row: 0, col: 1}, player: 'X'}
    const { square, player } = turn;
    // Деструктуризация: извлекаем координаты клетки
    const {row, col } = square;

    // Записываем символ игрока в соответствующую клетку игрового поля
    gameBoard[row][col] = player;
  }
  // Возвращаем восстановленное игровое поле
  return gameBoard; 
}

// Главный компонент приложения - игра в крестики-нолики
function App() {
  // State: объект с именами игроков {X: 'Player 1', O: 'Player 2'}
  // Инициализируется константой PLAYERS (строка 13)
  // Изменяется: функцией handlePlayerNameChange (строка 160)
  // Используется: 
  // 1. В функции deriveWinner для получения имени победителя (строка 107)
  // 2. Для передачи в компонент GameOver через prop winner (строка 186)
  const [players, setPlayers] = useState(PLAYERS);
  // State: массив всех сделанных ходов игры
  // Каждый элемент: {square: {row: number, col: number}, player: 'X' | 'O'}
  // Инициализируется: пустым массивом (начало игры)
  // Изменяется: 
  // 1. Функцией handleSelectSquare при клике на клетку поля (строка 145)
  // 2. Функцией handleRestart при перезапуске игры (строка 157)
  // Используется:
  // 1. Для вычисления activePlayer (строка 135)
  // 2. Для вычисления gameBoard (строка 136)
  // 3. Передается в компонент Log как prop turns (строка 190)
  const [gameTurns, setGameTurns] = useState([]);

// Derived state: вычисляем активного игрока на основе истории ходов
// Используется функция deriveActivePlayer (строка 103)
// Передается в компонент Player как prop isActive (строки 176, 182)
const activePlayer = deriveActivePlayer(gameTurns);
// Derived state: вычисляем текущее состояние игрового поля на основе истории ходов
// Используется функция deriveGameBoard (строка 118)
// Передается в компонент GameBoard как prop board (строка 187)
const gameBoard = deriveGameBoard(gameTurns);
// Derived state: определяем победителя игры
// Используется функция deriveWinner (строка 61)
// Передается в компонент GameOver как prop winner (строка 186)
const winner = deriveWinner(gameBoard, players);
// Derived state: проверяем, закончилась ли игра ничьей
// Ничья = все 9 клеток заполнены (gameTurns.length === 9) И нет победителя
// Используется: для отображения GameOver (строка 186) и блокировки поля (строка 187)
const hasDraw = gameTurns.length === 9 && !winner;

  // Функция-обработчик клика по клетке игрового поля
  // Параметры:
  // - rowIndex: индекс строки (0-2) кликнутой клетки
  // - colIndex: индекс столбца (0-2) кликнутой клетки
  // ОБЪЯВЛЕНА: здесь, в компоненте App (строка 140)
  // ПЕРЕДАЕТСЯ: в компонент GameBoard как prop onSelectSquare (строка 187)
  // ВЫЗЫВАЕТСЯ: в компоненте GameBoard при клике на button (файл GameBoard.jsx, строка 22)
  function handleSelectSquare(rowIndex, colIndex) {
    // Проверяем, не закончилась ли игра (есть победитель или ничья)
    // Если игра закончена, прерываем выполнение функции - ходы больше невозможны
    if (winner || hasDraw) {
      return;
    }
    
    // Паттерн: functional state update
    // Обновляем state gameTurns на основе предыдущего значения (prevTurns)
    // Это важно для корректной работы при асинхронных обновлениях React
    setGameTurns((prevTurns => {
      // Определяем, чей сейчас ход, используя предыдущее состояние ходов
      // Используем prevTurns вместо gameTurns для гарантии актуальности данных
      const currentPlayer = deriveActivePlayer(prevTurns);

      // Создаем новый массив ходов
      // Новый ход добавляется В НАЧАЛО массива (важно для deriveActivePlayer)
      // spread operator (...prevTurns) распаковывает все предыдущие ходы
      const updatedTurns = [
        { square: { row: rowIndex, col: colIndex }, player: currentPlayer },
        ...prevTurns];

        // Возвращаем обновленный массив ходов, который станет новым значением state
        return updatedTurns;
    }));
  }

  // Функция для перезапуска игры (начать новую партию)
  // ОБЪЯВЛЕНА: здесь, в компоненте App (строка 177)
  // ПЕРЕДАЕТСЯ: в компонент GameOver как prop onRestart (строка 186)
  // ВЫЗЫВАЕТСЯ: в компоненте GameOver при клике на кнопку "Rematch!" (файл GameOver.jsx, строка 6)
  function handleRestart() {
    // Очищаем массив ходов - возвращаем игру к начальному состоянию
    // Это автоматически обнуляет gameBoard, activePlayer, winner и hasDraw
    setGameTurns([]);
  }

  // Функция для изменения имени игрока
  // Параметры:
  // - symbol: символ игрока ('X' или 'O')
  // - newName: новое имя игрока (строка)
  // ОБЪЯВЛЕНА: здесь, в компоненте App (строка 180)
  // ПЕРЕДАЕТСЯ: в оба компонента Player как prop onChangeName (строки 177, 183)
  // ВЫЗЫВАЕТСЯ: в компоненте Player при клике "Save" (файл Player.jsx, строка 10)
  function handlePlayerNameChange(symbol, newName) {
    // Паттерн: functional state update
    // Обновляем state players на основе предыдущего значения
    setPlayers(prevPlayers => {
      return {
        // Копируем все существующие свойства объекта prevPlayers
        ...prevPlayers,
        // Обновляем конкретное свойство (X или O) новым именем
        // Computed property name: [symbol] может быть 'X' или 'O'
        [symbol]: newName
      };
    });
  }

  // Список игроков - упорядоченный список (ol) для отображения двух игроков
  // Компонент Player для игрока X:
  // - initialName: начальное имя из PLAYERS.X ('Player 1'), объявлен в Player.jsx строка 7, используется для state playerName
  // - symbol: символ игрока 'X', объявлен в Player.jsx строка 7, используется для отображения и как параметр onChangeName
  // - isActive: activePlayer === 'X', объявлен в Player.jsx строка 7, используется для класса 'active'
  // - onChangeName: функция handlePlayerNameChange (строка 250), вызывается в Player.jsx при сохранении имени
  // Компонент Player для игрока O - аналогичная структура с символом 'O' и именем PLAYERS.O
  // Условный рендеринг GameOver: показывается только если winner || hasDraw (есть победитель или ничья)
  // - winner: имя победителя или undefined, объявлен в GameOver.jsx строка 7, вычисляется на строке 167
  // - onRestart: функция handleRestart (строка 237), вызывается при клике "Rematch!"
  // Компонент GameBoard - игровое поле 3x3:
  // - onSelectSquare: функция handleSelectSquare (строка 200), вызывается при клике на клетку
  // - board: двумерный массив gameBoard (строка 166), используется для отрисовки клеток
  // - disabled: winner || hasDraw, блокирует клики когда игра закончена
  // Компонент Log - история ходов:
  // - turns: массив gameTurns (строка 163), используется для отображения списка ходов
  return (
    <main>
      <div id="game-container">
        <ol id="players" className='highlight-player'>
          <Player 
            initialName={PLAYERS.X}
            symbol='X'
            isActive={activePlayer === 'X'}
            onChangeName={handlePlayerNameChange}
          />
          <Player 
            initialName={PLAYERS.O}
            symbol='O'
            isActive={activePlayer === 'O'}
            onChangeName={handlePlayerNameChange}
          />
        </ol>
        {(winner || hasDraw) && <GameOver winner={winner} onRestart={handleRestart}/>}
        <GameBoard 
          onSelectSquare={handleSelectSquare} 
          board={gameBoard} 
          disabled={winner || hasDraw}/>
      </div>

    <Log turns={gameTurns}/>
    </main>
  ) 
}

// Экспортируем компонент App как default export
// Импортируется в главном файле приложения (обычно main.jsx или index.jsx)
export default App
