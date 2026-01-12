// Компонент GameOver - экран окончания игры (победа или ничья)
// Props:
// - winner: имя победителя (строка) или undefined (если ничья)
//   Передается из App.jsx, строка 308 (вычисляется функцией deriveWinner, строка 94, вызывается на строке 204)
// - onRestart: callback-функция для перезапуска игры
//   Передается из App.jsx, строка 308 (функция handleRestart из App.jsx, строка 248)
export default function GameOver({winner, onRestart}) {
  // Условный рендеринг: winner && <p> - если есть победитель, показываем его имя (паттерн: short-circuit evaluation)
  // !winner && <p> - если winner === undefined, показываем "It's a Draw!"
  // Кнопка onClick вызывает onRestart -> handleRestart в App.jsx, очищает gameTurns и перезапускает игру
  return <div id="game-over">
    <h2>Game Over!</h2>
    {winner && <p>{winner} won!</p>}
    {!winner && <p>It's a Draw!</p>}
    <p><button onClick={onRestart}>Rematch!</button></p>
  </div>
}