import { useState } from 'react'
import './Mastermind.css'

type Color = 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'orange'
type ColorOrNull = Color | null

interface Guess {
  colors: Color[]
  feedback: { correct: number; wrongPosition: number }
}

interface GameState {
  secretCode: Color[]
  guesses: Guess[]
  currentGuess: Color[]
  gameOver: boolean
  won: boolean
  message: string
}

const COLORS: Color[] = ['red', 'blue', 'green', 'yellow', 'purple', 'orange']
const CODE_LENGTH = 4
const MAX_GUESSES = 10

function Mastermind() {
  const [gameState, setGameState] = useState<GameState>(() => ({
    secretCode: generateSecretCode(),
    guesses: [],
    currentGuess: [],
    gameOver: false,
    won: false,
    message: 'Guess the 4-color code! You have 10 attempts.',
  }))

  function generateSecretCode(): Color[] {
    return Array.from({ length: CODE_LENGTH }, () => COLORS[Math.floor(Math.random() * COLORS.length)])
  }

  function calculateFeedback(guess: Color[], secret: Color[]): { correct: number; wrongPosition: number } {
    let correct = 0
    let wrongPosition = 0

    const secretCopy: ColorOrNull[] = [...secret]
    const guessCopy: ColorOrNull[] = [...guess]

    // First pass: count correct positions
    for (let i = 0; i < CODE_LENGTH; i++) {
      if (guessCopy[i] === secretCopy[i]) {
        correct++
        guessCopy[i] = null
        secretCopy[i] = null
      }
    }

    // Second pass: count wrong positions
    for (let i = 0; i < CODE_LENGTH; i++) {
      if (guessCopy[i] !== null) {
        const index = secretCopy.indexOf(guessCopy[i])
        if (index !== -1) {
          wrongPosition++
          secretCopy[index] = null
        }
      }
    }

    return { correct, wrongPosition }
  }

  const addColorToGuess = (color: Color) => {
    if (gameState.currentGuess.length < CODE_LENGTH && !gameState.gameOver) {
      setGameState({
        ...gameState,
        currentGuess: [...gameState.currentGuess, color],
      })
    }
  }

  const removeColorFromGuess = () => {
    if (gameState.currentGuess.length > 0) {
      setGameState({
        ...gameState,
        currentGuess: gameState.currentGuess.slice(0, -1),
      })
    }
  }

  const submitGuess = () => {
    if (gameState.currentGuess.length !== CODE_LENGTH) {
      setGameState({
        ...gameState,
        message: '⚠️ Please select 4 colors!',
      })
      return
    }

    const feedback = calculateFeedback(gameState.currentGuess, gameState.secretCode)
    const newGuesses = [...gameState.guesses, { colors: gameState.currentGuess, feedback }]

    if (feedback.correct === CODE_LENGTH) {
      setGameState({
        ...gameState,
        guesses: newGuesses,
        currentGuess: [],
        gameOver: true,
        won: true,
        message: `🎉 You won! You cracked the code in ${newGuesses.length} attempt${newGuesses.length !== 1 ? 's' : ''}!`,
      })
    } else if (newGuesses.length >= MAX_GUESSES) {
      setGameState({
        ...gameState,
        guesses: newGuesses,
        currentGuess: [],
        gameOver: true,
        won: false,
        message: `💥 Game Over! The code was: ${gameState.secretCode.join(' ')}`,
      })
    } else {
      setGameState({
        ...gameState,
        guesses: newGuesses,
        currentGuess: [],
        message: `Guess ${newGuesses.length + 1} of ${MAX_GUESSES}`,
      })
    }
  }

  const resetGame = () => {
    setGameState({
      secretCode: generateSecretCode(),
      guesses: [],
      currentGuess: [],
      gameOver: false,
      won: false,
      message: 'Guess the 4-color code! You have 10 attempts.',
    })
  }

  const getColorStyle = (color: Color): React.CSSProperties => {
    const colorMap: Record<Color, string> = {
      red: '#ef4444',
      blue: '#3b82f6',
      green: '#10b981',
      yellow: '#eab308',
      purple: '#a855f7',
      orange: '#f97316',
    }
    return { backgroundColor: colorMap[color] }
  }

  return (
    <div className="mastermind-container">
      <div className="mastermind-content">
        <h1>🔐 Mastermind</h1>
        <p className="subtitle">Crack the secret color code!</p>

        <div className="game-wrapper">
          <div className="status-bar">
            <p className="status">{gameState.message}</p>
          </div>

          <div className="game-info">
            <div className="info-item">
              <span className="info-label">Attempts:</span>
              <span className="info-value">{gameState.guesses.length}/{MAX_GUESSES}</span>
            </div>
          </div>

          <div className="guesses-section">
            <div className="guesses-list">
              {gameState.guesses.map((guess, index) => (
                <div key={index} className="guess-row">
                  <div className="guess-colors">
                    {guess.colors.map((color, colorIndex) => (
                      <div
                        key={colorIndex}
                        className="color-peg"
                        style={getColorStyle(color)}
                        title={color}
                      />
                    ))}
                  </div>
                  <div className="feedback">
                    <div className="feedback-row">
                      {Array.from({ length: guess.feedback.correct }).map((_, i) => (
                        <div key={`correct-${i}`} className="feedback-peg correct" title="Correct position" />
                      ))}
                      {Array.from({ length: guess.feedback.wrongPosition }).map((_, i) => (
                        <div key={`wrong-${i}`} className="feedback-peg wrong-position" title="Wrong position" />
                      ))}
                      {Array.from({ length: CODE_LENGTH - guess.feedback.correct - guess.feedback.wrongPosition }).map((_, i) => (
                        <div key={`empty-${i}`} className="feedback-peg empty" />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {!gameState.gameOver && (
              <div className="current-guess-section">
                <div className="current-guess">
                  {Array.from({ length: CODE_LENGTH }).map((_, index) => (
                    <div
                      key={index}
                      className="color-peg-slot"
                      style={index < gameState.currentGuess.length ? getColorStyle(gameState.currentGuess[index]) : {}}
                    />
                  ))}
                </div>
                <button className="remove-button" onClick={removeColorFromGuess} disabled={gameState.currentGuess.length === 0}>
                  ← Remove
                </button>
              </div>
            )}
          </div>

          {!gameState.gameOver && (
            <div className="color-selector">
              <div className="colors-grid">
                {COLORS.map(color => (
                  <button
                    key={color}
                    className="color-button"
                    style={getColorStyle(color)}
                    onClick={() => addColorToGuess(color)}
                    disabled={gameState.currentGuess.length >= CODE_LENGTH}
                    title={color}
                  />
                ))}
              </div>
              <button
                className="submit-button"
                onClick={submitGuess}
                disabled={gameState.currentGuess.length !== CODE_LENGTH}
              >
                ✓ Submit Guess
              </button>
            </div>
          )}

          {gameState.gameOver && (
            <button className="reset-button" onClick={resetGame}>
              🔄 Play Again
            </button>
          )}
        </div>

        <div className="instructions">
          <h2>How to Play</h2>
          <ul>
            <li>I've chosen a secret code of 4 colored pegs</li>
            <li>Click the color buttons to build your guess</li>
            <li>Submit your guess to get feedback</li>
            <li>🔴 Black peg = correct color in correct position</li>
            <li>⚪ White peg = correct color in wrong position</li>
            <li>Empty = color not in the code</li>
            <li>You have 10 attempts to crack the code!</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Mastermind
