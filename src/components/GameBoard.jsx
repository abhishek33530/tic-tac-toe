import { useState, useEffect } from 'react';
import clickSound from '../assets/click.wav';
import winSound from '../assets/win.wav';
import drawSound from '../assets/draw.wav';

const GameBoard = ({ theme, playerNames, onGameEnd }) => {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([{ squares: Array(9).fill(null), time: new Date() }]);
  const [currentMove, setCurrentMove] = useState(0);
  const [winningLine, setWinningLine] = useState(null);
  const [moveSound] = useState(new Audio(clickSound));
  const [victorySound] = useState(new Audio(winSound));
  const [drawSoundEffect] = useState(new Audio(drawSound));

  useEffect(() => {
    moveSound.volume = 0.3;
    victorySound.volume = 0.3;
    drawSoundEffect.volume = 0.3;
  }, [moveSound, victorySound, drawSoundEffect]);

  const handleClick = (i) => {
    const historyCopy = history.slice(0, currentMove + 1);
    const current = historyCopy[historyCopy.length - 1];
    const squares = [...current.squares];

    if (calculateWinner(squares) || squares[i]) return;

    squares[i] = xIsNext ? 'X' : 'O';
    moveSound.play();

    setHistory([...historyCopy, { squares, time: new Date() }]);
    setCurrentMove(historyCopy.length);
    setSquares(squares);
    setXIsNext(!xIsNext);

    const winner = calculateWinner(squares);
    if (winner) {
      setWinningLine(getWinningLine(squares));
      victorySound.play();
      onGameEnd(winner);
    } else if (squares.every(square => square)) {
      drawSoundEffect.play();
      onGameEnd('draw');
    }
  };

  const jumpTo = (move) => {
    setCurrentMove(move);
    setSquares(history[move].squares);
    setXIsNext(move % 2 === 0);
    setWinningLine(null);
  };

  const moves = history.map((step, move) => {
    const time = step.time.toLocaleTimeString();
    const desc = move ? 
      'Go to move #' + move + ' (' + time + ')' :
      'Go to game start';
    return (
      <li key={move} className={move === currentMove ? 'current-move' : ''}>
        <button onClick={() => jumpTo(move)}>{desc}</button>
      </li>
    );
  });

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + playerNames[winner];
  } else if (squares.every(square => square)) {
    status = 'Draw!';
  } else {
    status = 'Next player: ' + playerNames[xIsNext ? 'X' : 'O'];
  }

  return (
    <div className={'game-board ' + theme}>
      <div className="status">{status}</div>
      <div className="board">
        {[0, 1, 2].map((row) => (
          <div key={row} className="board-row">
            {[0, 1, 2].map((col) => {
              const i = row * 3 + col;
              return (
                <button
                  key={i}
                  className={'square ' + (winningLine?.includes(i) ? 'winning' : '') + (squares[i] ? ' filled' : '')}
                  onClick={() => handleClick(i)}
                >
                  {squares[i]}
                </button>
              );
            })}
          </div>
        ))}
      </div>
      <div className="game-info">
        <h3>Move History</h3>
        <ol>{moves}</ol>
      </div>
    </div>
  );
};

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function getWinningLine(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  for (const line of lines) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return line;
    }
  }
  return null;
}

export default GameBoard;
