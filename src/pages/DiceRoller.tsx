import { useState } from 'react';
import './DiceRoller.css';

interface Roll {
  id: number;
  dice: number;
  sides: number;
  results: number[];
  total: number;
  timestamp: Date;
}

export default function DiceRoller() {
  const [numDice, setNumDice] = useState(1);
  const [numSides, setNumSides] = useState(6);
  const [rolls, setRolls] = useState<Roll[]>([]);
  const [nextId, setNextId] = useState(1);

  const rollDice = () => {
    const results: number[] = [];
    for (let i = 0; i < numDice; i++) {
      results.push(Math.floor(Math.random() * numSides) + 1);
    }
    const total = results.reduce((sum, val) => sum + val, 0);

    const newRoll: Roll = {
      id: nextId,
      dice: numDice,
      sides: numSides,
      results,
      total,
      timestamp: new Date(),
    };

    setRolls([newRoll, ...rolls]);
    setNextId(nextId + 1);
  };

  const clearHistory = () => {
    setRolls([]);
  };

  const average = rolls.length > 0 ? (rolls.reduce((sum, roll) => sum + roll.total, 0) / rolls.length).toFixed(2) : '0';
  const highest = rolls.length > 0 ? Math.max(...rolls.map(roll => roll.total)) : 0;
  const lowest = rolls.length > 0 ? Math.min(...rolls.map(roll => roll.total)) : 0;

  return (
    <div className="dice-roller-container">
      <h1>🎲 Dice Roller</h1>
      <p className="subtitle">Roll dice and track your results</p>

      <div className="controls">
        <div className="control-group">
          <label htmlFor="num-dice">Number of Dice:</label>
          <input
            id="num-dice"
            type="number"
            min="1"
            max="20"
            value={numDice}
            onChange={(e) => setNumDice(Math.max(1, parseInt(e.target.value) || 1))}
          />
        </div>

        <div className="control-group">
          <label htmlFor="num-sides">Sides per Die:</label>
          <select
            id="num-sides"
            value={numSides}
            onChange={(e) => setNumSides(parseInt(e.target.value))}
          >
            <option value={4}>D4 (4 sides)</option>
            <option value={6}>D6 (6 sides)</option>
            <option value={8}>D8 (8 sides)</option>
            <option value={10}>D10 (10 sides)</option>
            <option value={12}>D12 (12 sides)</option>
            <option value={20}>D20 (20 sides)</option>
            <option value={100}>D100 (100 sides)</option>
          </select>
        </div>
      </div>

      <button className="roll-button" onClick={rollDice}>
        Roll {numDice}d{numSides}
      </button>

      {rolls.length > 0 && (
        <div className="stats">
          <div className="stat">
            <span className="stat-label">Average:</span>
            <span className="stat-value">{average}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Highest:</span>
            <span className="stat-value">{highest}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Lowest:</span>
            <span className="stat-value">{lowest}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Rolls:</span>
            <span className="stat-value">{rolls.length}</span>
          </div>
        </div>
      )}

      {rolls.length > 0 && (
        <div className="history">
          <div className="history-header">
            <h2>Roll History</h2>
            <button className="clear-button" onClick={clearHistory}>
              Clear
            </button>
          </div>
          <div className="rolls-list">
            {rolls.map((roll) => (
              <div key={roll.id} className="roll-item">
                <div className="roll-info">
                  <span className="roll-dice">{roll.dice}d{roll.sides}</span>
                  <span className="roll-results">{roll.results.join(', ')}</span>
                </div>
                <div className="roll-total">{roll.total}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {rolls.length === 0 && (
        <div className="empty-state">
          <p>No rolls yet. Click the button above to start rolling!</p>
        </div>
      )}
    </div>
  );
}
