// Импортируем хук useState из React для управления локальным состоянием компонента
import { useState } from  'react';

// Компонент Player - отображает информацию об одном игроке с возможностью редактирования имени
// Props:
// - initialName: начальное имя игрока (строка), передается из App.jsx строки 296/302
// - symbol: символ игрока ('X' или 'O'), передается из App.jsx строки 297/303
// - isActive: булево значение, активен ли игрок сейчас, передается из App.jsx строки 298/304
// - onChangeName: callback-функция для изменения имени, передается из App.jsx строки 299/305
export default function Player({initialName, symbol, isActive, onChangeName}) {
  // State: текущее имя игрока
  // Инициализируется prop initialName (из App.jsx, PLAYERS.X или PLAYERS.O)
  // Изменяется: функцией handleChange при вводе текста (строка 49)
  // Используется: 
  // 1. Для отображения имени в span или input (строки 58, 66)
  // 2. Для передачи в родительский компонент через onChangeName (строка 41)
  const [playerName, setPlayerName] = useState(initialName);
  // State: режим редактирования имени (true - редактируется, false - только просмотр)
  // Инициализируется: false (по умолчанию режим просмотра)
  // Изменяется: функцией handleEditClick при клике на кнопку Edit/Save (строка 30)
  // Используется:
  // 1. Для переключения между span и input (строки 62-66)
  // 2. Для определения текста кнопки Edit/Save (строка 82)
  // 3. Для решения, вызывать ли onChangeName (строка 37)
  const [isEditing, setIsEditing] = useState(false);

// Функция-обработчик клика на кнопку Edit/Save
// ОБЪЯВЛЕНА: здесь, в компоненте Player (строка 30)
// ВЫЗЫВАЕТСЯ: при клике на кнопку Edit/Save (строка 82)
function handleEditClick() {
  // Паттерн: functional state update
  // Инвертируем значение isEditing (true -> false или false -> true)
  // Используем функциональную форму, чтобы гарантировать актуальность предыдущего значения
  setIsEditing(editing => !editing);
  // Если мы ВЫХОДИМ из режима редактирования (isEditing сейчас true, станет false)
  // то сохраняем новое имя, вызывая callback из родителя
  if (isEditing) {
    // Вызываем функцию handlePlayerNameChange из App.jsx (строка 261)
    // Передаем symbol (какого игрока обновляем) и playerName (новое имя)
    // Это обновит state players в App.jsx
    onChangeName(symbol, playerName);
  }
}

// Функция-обработчик изменения текста в input
// Параметр event: событие onChange от input элемента
// ОБЪЯВЛЕНА: здесь, в компоненте Player (строка 49)
// ВЫЗЫВАЕТСЯ: при вводе текста в input (строка 66)
function handleChange(event) {
  // Обновляем state playerName новым значением из input
  // event.target.value - текущее значение input поля
  setPlayerName(event.target.value);
}

  // Переменная для хранения JSX - либо span с именем, либо input для редактирования
  // По умолчанию отображаем имя как текст в span
  // playerName берется из state (строка 17)
  let editablePlayerName = <span className="player-name">{playerName}</span>;
  //let btnCaption = 'Edit';

  // Если включен режим редактирования, заменяем span на input
  if (isEditing) {
    // Создаем контролируемый input (controlled component pattern)
    // value={playerName} - значение input синхронизировано с state
    // onChange={handleChange} - при изменении обновляем state
    editablePlayerName = <input type="text" required value={playerName} onChange={handleChange}/>;
    //btnCaption = 'Save';
  }


  // Элемент списка (list item)
  // Условный класс: если isActive === true (получен из App.jsx), добавляем класс 'active' для выделения активного игрока
  // editablePlayerName - либо span с текстом, либо input для редактирования
  // symbol - отображаем символ игрока (X или O), получен как prop из App.jsx
  // Кнопка меняет текст в зависимости от isEditing: 'Save' или 'Edit', при клике вызывается handleEditClick
  return (
    <li className={isActive ? 'active' : undefined}>
      <span className="player">
        {editablePlayerName}
        <span className="player-symbol">{symbol}</span>
      </span>
      <button onClick={handleEditClick}>{isEditing ? 'Save' : 'Edit'}</button>
    </li>
  );
} 