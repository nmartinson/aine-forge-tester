import { useState } from 'react'
import './DiceRoller.css'

interface DiceResult {
  dice: number[]
  total: number
  timestamp: number
}

function DiceRoller() {
  const [numDice, setNumDice] = useState(1)
  const [diceType, setDiceType] = useState(6)
  const [results, setResults] = useState<DiceResult[]>([])
  const [currentRoll, setCurrentRoll] = useState<DiceResult | null>(null)

  const rollDice = () => {
    const dice: number[] = []
    for (let i = 0; i < numDice; i++) {
      dice.push(Math.floor(Math.random() * diceType) + 1)
    }
    const total = dice.reduce((sum, die) => sum + die, 0)
    const result: DiceResult = {
      dice,
      total,
      timestamp: Date.now(),
    }
    setCurrentRoll(result)
    setResults([result, ...results.slice(0, 9)]) // Keep last 10 rolls
  }

  const clearHistory = () => {
    setResults([])
    setCurrentRoll(null)
  }

  const getAverageRoll = () => {
    if (results.length === 0) return 0
    const sum = results.reduce((acc, result) => acc + result.total, 0)
    return (sum / results.length).toFixed(2)
  }

  const getHighestRoll = () => {
    if (results.length === 0) return 0
    return Math.max(...results.map((r) => r.total))
  }

  const getLowestRoll = () => {
    if (results.length === 0) return 0
    return Math.min(...results.map((r) => r.total))
  }

  return (
    <div className="dice-roller-container">
      <div className="dice-roller-content">
        <h1>🎲 Dice Roller</h1>
        <p className="subtitle">Roll dice and track your results!</p>

        <div className="game-wrapper">
          <div className="controls-section">
            <div className="control-group">
              <label htmlFor="num-dice">Number of Dice:</label>
              <div className="input-group">
                <button
                  className="control-button"
                  onClick={() => setNumDice(Math.max(1, numDice - 1))}
                  disabled={numDice <= 1}
                >
                  −
                </button>
                <input
                  id="num-dice"
                  type="number"
                  min="1"
                  max="20"
                  value={numDice}
                  onChange={(e) => setNumDice(Math.max(1, parseInt(e.target.value) || 1))}
                  className="number-input"
                />
                <button
                  className="control-button"
                  onClick={() => setNumDice(Math.min(20, numDice + 1))}
                  disabled={numDice >= 20}
                >
                  +
                </button>
              </div>
            </div>

            <div className="control-group">
              <label htmlFor="dice-type">Dice Type:</label>
              <select
                id="dice-type"
                value={diceType}
                onChange={(e) => setDiceType(parseInt(e.target.value))}
                className="dice-select"
              >
                <option value={4}>d4 (4-sided)</option>
                <option value={6}>d6 (6-sided)</option>
                <option value={8}>d8 (8-sided)</option>
                <option value={10}>d10 (10-sided)</option>
                <option value={12}>d12 (12-sided)</option>
                <option value={20}>d20 (20-sided)</option>
                <option value={100}>d100 (100-sided)</option>
              </select>
            </div>
          </div>

          <button className="roll-button" onClick={rollDice}>
            🎲 Roll Dice
          </button>

          {currentRoll && (
            <div className="result-display">
              <div className="dice-results">
                {currentRoll.dice.map((die, index) => (
                  <div key={index} className="die-result">
                    {die}
                  </div>
                ))}
              </div>
              <div className="total-display">
                <p className="total-label">Total:</p>
                <p className="total-value">{currentRoll.total}</p>
              </div>
            </div>
          )}

          <div className="stats-section">
            <div className="stat-card">
              <p className="stat-label">Average</p>
              <p className="stat-value">{getAverageRoll()}</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Highest</p>
              <p className="stat-value">{getHighestRoll()}</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Lowest</p>
              <p className="stat-value">{getLowestRoll()}</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Rolls</p>
              <p className="stat-value">{results.length}</p>
            </div>
          </div>

          <button className="clear-button" onClick={clearHistory}>
            🗑️ Clear History
          </button>
        </div>

        <div className="history-section">
          <h2>Roll History</h2>
          {results.length === 0 ? (
            <p className="empty-message">No rolls yet. Start rolling!</p>
          ) : (
            <div className="history-list">
              {results.map((result, index) => (
                <div key={result.timestamp} className="history-item">
                  <span className="history-number">#{results.length - index}</span>
                  <span className="history-dice">{result.dice.join(', ')}</span>
                  <span className="history-total">{result.total}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="instructions">
          <h2>How to Play</h2>
          <ul>
            <li>Select the number of dice you want to roll (1-20)</li>
            <li>Choose the type of dice (d4, d6, d8, d10, d12, d20, d100)</li>
            <li>Click "Roll Dice" to roll</li>
            <li>View your results and statistics</li>
            <li>Clear history to start fresh</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default DiceRoller
