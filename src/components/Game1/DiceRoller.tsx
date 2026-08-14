import { useState } from 'react'
import './DiceRoller.css'

interface RollHistory {
  roll: number
  timestamp: number
}

function DiceRoller() {
  const [diceCount, setDiceCount] = useState(1)
  const [diceType, setDiceType] = useState(6)
  const [currentRoll, setCurrentRoll] = useState<number[]>([])
  const [totalSum, setTotalSum] = useState(0)
  const [history, setHistory] = useState<RollHistory[]>([])
  const [isRolling, setIsRolling] = useState(false)

  const rollDice = () => {
    setIsRolling(true)
    
    // Simulate rolling animation
    setTimeout(() => {
      const rolls: number[] = []
      let sum = 0
      
      for (let i = 0; i < diceCount; i++) {
        const roll = Math.floor(Math.random() * diceType) + 1
        rolls.push(roll)
        sum += roll
      }
      
      setCurrentRoll(rolls)
      setTotalSum(sum)
      setHistory([{ roll: sum, timestamp: Date.now() }, ...history.slice(0, 9)])
      setIsRolling(false)
    }, 500)
  }

  const handleDiceCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(1, Math.min(10, parseInt(e.target.value, 10) || 1))
    setDiceCount(value)
  }

  const handleDiceTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDiceType(parseInt(e.target.value, 10))
  }

  const resetGame = () => {
    setCurrentRoll([])
    setTotalSum(0)
    setHistory([])
    setDiceCount(1)
    setDiceType(6)
  }

  const getAverageRoll = () => {
    if (history.length === 0) return 0
    const sum = history.reduce((acc, item) => acc + item.roll, 0)
    return (sum / history.length).toFixed(2)
  }

  const getHighestRoll = () => {
    if (history.length === 0) return 0
    return Math.max(...history.map(item => item.roll))
  }

  const getLowestRoll = () => {
    if (history.length === 0) return 0
    return Math.min(...history.map(item => item.roll))
  }

  return (
    <div className="dice-roller-container">
      <div className="dice-roller-content">
        <h1>🎲 Dice Roller</h1>
        <p className="subtitle">Roll the dice and track your results!</p>

        <div className="dice-controls">
          <div className="control-group">
            <label htmlFor="dice-count">Number of Dice:</label>
            <input
              id="dice-count"
              type="number"
              min="1"
              max="10"
              value={diceCount}
              onChange={handleDiceCountChange}
              className="control-input"
            />
          </div>

          <div className="control-group">
            <label htmlFor="dice-type">Dice Type:</label>
            <select
              id="dice-type"
              value={diceType}
              onChange={handleDiceTypeChange}
              className="control-select"
            >
              <option value={4}>D4 (4-sided)</option>
              <option value={6}>D6 (6-sided)</option>
              <option value={8}>D8 (8-sided)</option>
              <option value={10}>D10 (10-sided)</option>
              <option value={12}>D12 (12-sided)</option>
              <option value={20}>D20 (20-sided)</option>
              <option value={100}>D100 (100-sided)</option>
            </select>
          </div>
        </div>

        <button
          className="roll-button"
          onClick={rollDice}
          disabled={isRolling}
        >
          {isRolling ? '🎲 Rolling...' : '🎲 Roll Dice'}
        </button>

        {currentRoll.length > 0 && (
          <div className="roll-result">
            <div className="dice-display">
              {currentRoll.map((roll, index) => (
                <div key={index} className="dice-face">
                  {roll}
                </div>
              ))}
            </div>
            <div className="total-display">
              <span className="total-label">Total:</span>
              <span className="total-value">{totalSum}</span>
            </div>
          </div>
        )}

        <div className="statistics">
          <h2>Statistics</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-label">Rolls:</span>
              <span className="stat-value">{history.length}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Average:</span>
              <span className="stat-value">{getAverageRoll()}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Highest:</span>
              <span className="stat-value">{getHighestRoll()}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Lowest:</span>
              <span className="stat-value">{getLowestRoll()}</span>
            </div>
          </div>
        </div>

        {history.length > 0 && (
          <div className="history">
            <h2>Roll History</h2>
            <div className="history-list">
              {history.map((item, index) => (
                <div key={index} className="history-item">
                  <span className="history-number">#{history.length - index}</span>
                  <span className="history-value">{item.roll}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <button className="reset-button" onClick={resetGame}>
          🔄 Reset
        </button>
      </div>
    </div>
  )
}

export default DiceRoller
