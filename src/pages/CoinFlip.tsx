import { useState } from 'react'
import './CoinFlip.css'

interface GameState {
  result: 'heads' | 'tails' | null
  isFlipping: boolean
  flips: number
  headsCount: number
  tailsCount: number
}

function CoinFlip() {
  const [gameState, setGameState] = useState<GameState>({
    result: null,
    isFlipping: false,
    flips: 0,
    headsCount: 0,
    tailsCount: 0,
  })

  const handleFlip = () => {
    if (gameState.isFlipping) return

    setGameState((prev) => ({
      ...prev,
      isFlipping: true,
      result: null,
    }))

    // Simulate coin flip animation
    setTimeout(() => {
      const newResult = Math.random() < 0.5 ? 'heads' : 'tails'
      const newFlips = gameState.flips + 1
      const newHeadsCount = gameState.headsCount + (newResult === 'heads' ? 1 : 0)
      const newTailsCount = gameState.tailsCount + (newResult === 'tails' ? 1 : 0)

      setGameState({
        result: newResult,
        isFlipping: false,
        flips: newFlips,
        headsCount: newHeadsCount,
        tailsCount: newTailsCount,
      })
    }, 1000)
  }

  const resetGame = () => {
    setGameState({
      result: null,
      isFlipping: false,
      flips: 0,
      headsCount: 0,
      tailsCount: 0,
    })
  }

  return (
    <div className="coin-flip-container">
      <div className="coin-flip-content">
        <h1>Coin Flip</h1>
        <p className="subtitle">Click the button to flip a coin!</p>

        <div className="game-wrapper">
          <div className="coin-display">
            <div className={`coin ${gameState.isFlipping ? 'flipping' : ''} ${gameState.result ? gameState.result : ''}`}>
              <div className="coin-face heads">
                <span>Heads</span>
              </div>
              <div className="coin-face tails">
                <span>Tails</span>
              </div>
            </div>
          </div>

          <div className="result-display">
            {gameState.result && (
              <p className="result-text">
                Result: <span className="result-value">{gameState.result.toUpperCase()}</span>
              </p>
            )}
            {gameState.isFlipping && <p className="flipping-text">Flipping...</p>}
            {!gameState.result && !gameState.isFlipping && <p className="prompt-text">Ready to flip?</p>}
          </div>

          <button className="flip-button" onClick={handleFlip} disabled={gameState.isFlipping}>
            🪙 Flip Coin
          </button>

          <div className="stats">
            <div className="stat-item">
              <span className="stat-label">Total Flips:</span>
              <span className="stat-value">{gameState.flips}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Heads:</span>
              <span className="stat-value">{gameState.headsCount}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Tails:</span>
              <span className="stat-value">{gameState.tailsCount}</span>
            </div>
          </div>

          <button className="reset-button" onClick={resetGame}>
            🔄 Reset
          </button>
        </div>

        <div className="instructions">
          <h2>How to Play</h2>
          <ul>
            <li>Click the "Flip Coin" button to flip a coin</li>
            <li>The coin will spin for a moment and then land on either Heads or Tails</li>
            <li>Your results are tracked at the bottom</li>
            <li>Click "Reset" to start over with fresh statistics</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default CoinFlip
