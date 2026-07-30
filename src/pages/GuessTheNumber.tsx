import { useState } from 'react'
import './GuessTheNumber.css'

interface GameState {
  secretNumber: number
  guess: string
  attempts: number
  message: string
  gameOver: boolean
  won: boolean
}

function GuessTheNumber() {
  const [gameState, setGameState] = useState<GameState>({
    secretNumber: Math.floor(Math.random() * 100) + 1,
    guess: '',
    attempts: 0,
    message: 'Guess a number between 1 and 100!',
    gameOver: false,
    won: false,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGameState({
      ...gameState,
      guess: e.target.value,
    })
  }

  const handleGuess = () => {
    if (!gameState.guess) {
      setGameState({
        ...gameState,
        message: '⚠️ Please enter a number!',
      })
      return
    }

    const userGuess = parseInt(gameState.guess, 10)

    if (isNaN(userGuess) || userGuess < 1 || userGuess > 100) {
      setGameState({
        ...gameState,
        message: '⚠️ Please enter a valid number between 1 and 100!',
      })
      return
    }

    const newAttempts = gameState.attempts + 1

    if (userGuess === gameState.secretNumber) {
      setGameState({
        ...gameState,
        attempts: newAttempts,
        message: `🎉 You won! The number was ${gameState.secretNumber}. It took you ${newAttempts} attempt${newAttempts !== 1 ? 's' : ''}!`,
        gameOver: true,
        won: true,
      })
    } else if (userGuess < gameState.secretNumber) {
      setGameState({
        ...gameState,
        attempts: newAttempts,
        message: `📈 Too low! Try a higher number. (Attempt ${newAttempts})`,
        guess: '',
      })
    } else {
      setGameState({
        ...gameState,
        attempts: newAttempts,
        message: `📉 Too high! Try a lower number. (Attempt ${newAttempts})`,
        guess: '',
      })
    }
  }

  const resetGame = () => {
    setGameState({
      secretNumber: Math.floor(Math.random() * 100) + 1,
      guess: '',
      attempts: 0,
      message: 'Guess a number between 1 and 100!',
      gameOver: false,
      won: false,
    })
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleGuess()
    }
  }

  return (
    <div className="guess-container">
      <div className="guess-content">
        <h1>Guess the Number</h1>
        <p className="subtitle">Can you guess the secret number?</p>

        <div className="game-wrapper">
          <div className="status-bar">
            <p className="status">{gameState.message}</p>
          </div>

          <div className="game-info">
            <div className="info-item">
              <span className="info-label">Attempts:</span>
              <span className="info-value">{gameState.attempts}</span>
            </div>
          </div>

          <div className="input-section">
            <input
              type="number"
              min="1"
              max="100"
              value={gameState.guess}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Enter your guess..."
              disabled={gameState.gameOver}
              className="guess-input"
            />
            <button
              className="guess-button"
              onClick={handleGuess}
              disabled={gameState.gameOver}
            >
              🎯 Guess
            </button>
          </div>

          <button className="reset-button" onClick={resetGame}>
            🔄 New Game
          </button>
        </div>

        <div className="instructions">
          <h2>How to Play</h2>
          <ul>
            <li>I'm thinking of a number between 1 and 100</li>
            <li>Enter your guess in the input field</li>
            <li>I'll tell you if your guess is too high or too low</li>
            <li>Keep guessing until you find the secret number</li>
            <li>Try to find it in as few attempts as possible!</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default GuessTheNumber
