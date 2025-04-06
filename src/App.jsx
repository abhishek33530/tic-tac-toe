import { useState, useEffect } from 'react';
import GameBoard from './components/GameBoard';
import './App.css';

function App() {
  const [theme, setTheme] = useState('dark');
  const [scores, setScores] = useState({ X: 0, O: 0 });
  const [playerNames, setPlayerNames] = useState({ X: 'Player X', O: 'Player O' });
  const [isEditingNames, setIsEditingNames] = useState(false);
  const [tempNames, setTempNames] = useState({ X: 'Player X', O: 'Player O' });

  useEffect(() => {
    // Load saved theme and scores from localStorage
    const savedTheme = localStorage.getItem('theme');
    const savedScores = localStorage.getItem('scores');
    const savedNames = localStorage.getItem('playerNames');

    if (savedTheme) setTheme(savedTheme);
    if (savedScores) setScores(JSON.parse(savedScores));
    if (savedNames) setPlayerNames(JSON.parse(savedNames));
  }, []);

  useEffect(() => {
    // Save theme and scores to localStorage
    localStorage.setItem('theme', theme);
    localStorage.setItem('scores', JSON.stringify(scores));
    localStorage.setItem('playerNames', JSON.stringify(playerNames));
  }, [theme, scores, playerNames]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleGameEnd = (winner) => {
    if (winner !== 'draw') {
      setScores(prev => ({
        ...prev,
        [winner]: prev[winner] + 1
      }));
    }
  };

  const handleNameSubmit = (e) => {
    e.preventDefault();
    setPlayerNames(tempNames);
    setIsEditingNames(false);
  };

  const resetScores = () => {
    setScores({ X: 0, O: 0 });
  };

  return (
    <div className={`app ${theme}`}>
      <div className="header">
        <h1>Tic Tac Toe</h1>
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>

      <div className="player-info">
        {isEditingNames ? (
          <form onSubmit={handleNameSubmit} className="name-form">
            <div>
              <label htmlFor="playerX">Player X:</label>
              <input
                id="playerX"
                value={tempNames.X}
                onChange={e => setTempNames({ ...tempNames, X: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="playerO">Player O:</label>
              <input
                id="playerO"
                value={tempNames.O}
                onChange={e => setTempNames({ ...tempNames, O: e.target.value })}
              />
            </div>
            <div className="form-buttons">
              <button type="submit">Save</button>
              <button type="button" onClick={() => setIsEditingNames(false)}>Cancel</button>
            </div>
          </form>
        ) : (
          <div className="scores">
            <div>{playerNames.X}: {scores.X}</div>
            <button onClick={() => setIsEditingNames(true)}>Edit Names</button>
            <div>{playerNames.O}: {scores.O}</div>
          </div>
        )}
      </div>

      <GameBoard
        theme={theme}
        playerNames={playerNames}
        onGameEnd={handleGameEnd}
      />

      <div className="controls">
        <button onClick={resetScores}>Reset Scores</button>
      </div>
    </div>
  );
}

export default App;
