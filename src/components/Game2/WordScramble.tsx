import { useState } from 'react'
import './WordScramble.css'

interface GameState {
  currentWord: string
  scrambledWord: string
  userGuess: string
  score: number
  attempts: number
  message: string
  gameOver: boolean
  won: boolean
  wordIndex: number
}

const WORDS = [
  'REACT',
  'JAVASCRIPT',
  'TYPESCRIPT',
  'COMPONENT',
  'FUNCTION',
  'VARIABLE',
  'ALGORITHM',
  'DATABASE',
  'NETWORK',
  'SECURITY',
  'DEVELOPER',
  'FRAMEWORK',
  'LIBRARY',
  'INTERFACE',
  'PROTOCOL',
  'BROWSER',
  'SERVER',
  'CLIENT',
  'REQUEST',
  'RESPONSE',
]

function shuffleWord(word: string): string {
  const arr = word.split('')
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr.join('')
}

function WordScramble() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)]
    return {
      currentWord: randomWord,
      scrambledWord: shuffleWord(randomWord),
      userGuess: '',
      score: 0,
      attempts: 0,
      message: 'Unscramble the letters to form a word!',
      gameOver: false,
      won: false,
      wordIndex: 0,
    }
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGameState({
      ...gameState,
      userGuess: e.target.value.toUpperCase(),
    })
  }

  const handleGuess = () => {
    if (!gameState.userGuess.trim()) {
      setGameState({
        ...gameState,
        message: '⚠️ Please enter a word!',
      })
      return
    }

    const newAttempts = gameState.attempts + 1

    if (gameState.userGuess === gameState.currentWord) {
      const newScore = gameState.score + (10 - Math.min(newAttempts - 1, 9))
      setGameState({
        ...gameState,
        attempts: newAttempts,
        score: newScore,
        message: `🎉 Correct! The word was "${gameState.currentWord}". +${10 - Math.min(newAttempts - 1, 9)} points!`,
        won: true,
        gameOver: true,
      })
    } else {
      setGameState({
        ...gameState,
        attempts: newAttempts,
        userGuess: '',
        message: `❌ Wrong! Try again. (Attempt ${newAttempts})`,
      })

      if (newAttempts >= 5) {
        setGameState((prev) => ({
          ...prev,
          message: `💥 Game Over! The word was "${gameState.currentWord}". Final Score: ${prev.score}`,
          gameOver: true,
        }))
      }
    }
  }

  const nextWord = () => {
    const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)]
    setGameState({
      currentWord: randomWord,
      scrambledWord: shuffleWord(randomWord),
      userGuess: '',
      score: gameState.score,
      attempts: 0,
      message: 'Unscramble the letters to form a word!',
      gameOver: false,
      won: false,
      wordIndex: gameState.wordIndex + 1,
    })
  }

  const resetGame = () => {
    const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)]
    setGameState({
      currentWord: randomWord,
      scrambledWord: shuffleWord(randomWord),
      userGuess: '',
      score: 0,
      attempts: 0,
      message: 'Unscramble the letters to form a word!',
      gameOver: false,
      won: false,
      wordIndex: 0,
    })
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (gameState.gameOver && gameState.won) {
        nextWord()
      } else if (!gameState.gameOver) {
        handleGuess()
      }
    }
  }

  return (
    <div className="word-scramble-container">
      <div className="word-scramble-content">
        <h1>Word Scramble</h1>
        <p className="subtitle">Unscramble the letters to form a word!</p>

        <div className="game-wrapper">
          <div className="word-display">
            <p className="scrambled-label">Unscramble this:</p>
            <div className="scrambled-word">
              {gameState.scrambledWord.split('').map((letter, index) => (
                <span key={index} className="letter">
                  {letter}
                </span>
              ))}
            </div>
          </div>

          <div className="status-bar">
            <p className={`status ${gameState.won ? 'success' : gameState.gameOver ? 'error' : ''}`}>
              {gameState.message}
            </p>
          </div>

          <div className="game-info">
            <div className="info-item">
              <span className="info-label">Score:</span>
              <span className="info-value">{gameState.score}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Attempts:</span>
              <span className="info-value">{gameState.attempts}/5</span>
            </div>
            <div className="info-item">
              <span className="info-label">Words:</span>
              <span className="info-value">{gameState.wordIndex}</span>
            </div>
          </div>

          <div className="input-section">
            <input
              type="text"
              value={gameState.userGuess}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Enter your guess..."
              disabled={gameState.gameOver}
              className="word-input"
              maxLength={gameState.currentWord.length}
            />
            {!gameState.gameOver && (
              <button className="guess-button" onClick={handleGuess}>
                🎯 Guess
              </button>
            )}
            {gameState.gameOver && gameState.won && (
              <button className="next-button" onClick={nextWord}>
                ➡️ Next Word
              </button>
            )}
          </div>

          <button className="reset-button" onClick={resetGame}>
            🔄 New Game
          </button>
        </div>

        <div className="instructions">
          <h2>How to Play</h2>
          <ul>
            <li>Look at the scrambled letters</li>
            <li>Type the correct word in the input field</li>
            <li>You have 5 attempts per word</li>
            <li>Earn more points for fewer attempts</li>
            <li>Complete as many words as you can!</li>
            <li>Press Enter or click "Guess" to submit</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default WordScramble
