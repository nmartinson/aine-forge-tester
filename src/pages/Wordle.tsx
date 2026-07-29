import { useState, useCallback } from 'react'
import './Wordle.css'

interface GuessRow {
  word: string
  feedback: ('correct' | 'present' | 'absent' | 'empty')[]
}

const WORD_LIST = [
  'REACT',
  'TYPESCRIPT',
  'JAVASCRIPT',
  'DEVELOPER',
  'ALGORITHM',
  'DATABASE',
  'FUNCTION',
  'VARIABLE',
  'INTERFACE',
  'COMPONENT',
  'FRAMEWORK',
  'DEBUGGING',
  'NETWORK',
  'STORAGE',
  'BROWSER',
  'SERVER',
  'CLIENT',
  'ROUTER',
  'PROMISE',
  'ASYNC',
  'AWAIT',
  'CALLBACK',
  'CLOSURE',
  'SCOPE',
  'HOISTING',
  'PROTOTYPE',
  'INHERITANCE',
  'POLYMORPHISM',
  'ENCAPSULATION',
  'ABSTRACTION',
]

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
const MAX_GUESSES = 6
const WORD_LENGTH = 5

function Wordle() {
  const [targetWord, setTargetWord] = useState('')
  const [guesses, setGuesses] = useState<GuessRow[]>([])
  const [currentGuess, setCurrentGuess] = useState('')
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)
  const [message, setMessage] = useState('')
  const [gameStarted, setGameStarted] = useState(false)
  const [usedLetters, setUsedLetters] = useState<Set<string>>(new Set())
  const [stats, setStats] = useState({ wins: 0, losses: 0, streak: 0 })

  const selectRandomWord = useCallback(() => {
    return WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)]
  }, [])

  const startGame = () => {
    const word = selectRandomWord()
    setTargetWord(word)
    setGuesses([])
    setCurrentGuess('')
    setGameOver(false)
    setWon(false)
    setMessage('')
    setGameStarted(true)
    setUsedLetters(new Set())
  }

  const calculateFeedback = (guess: string, target: string): ('correct' | 'present' | 'absent' | 'empty')[] => {
    const feedback: ('correct' | 'present' | 'absent' | 'empty')[] = Array(WORD_LENGTH).fill('absent')
    const targetLetters = target.split('')
    const guessLetters = guess.split('')

    // First pass: mark correct positions
    for (let i = 0; i < WORD_LENGTH; i++) {
      if (guessLetters[i] === targetLetters[i]) {
        feedback[i] = 'correct'
        targetLetters[i] = '' // Mark as used
      }
    }

    // Second pass: mark present letters
    for (let i = 0; i < WORD_LENGTH; i++) {
      if (feedback[i] === 'absent') {
        const letterIndex = targetLetters.indexOf(guessLetters[i])
        if (letterIndex !== -1) {
          feedback[i] = 'present'
          targetLetters[letterIndex] = '' // Mark as used
        }
      }
    }

    return feedback
  }

  const handleGuess = () => {
    if (currentGuess.length !== WORD_LENGTH) {
      setMessage('Word must be 5 letters long')
      return
    }

    const feedback = calculateFeedback(currentGuess, targetWord)
    const newGuesses = [...guesses, { word: currentGuess, feedback }]
    setGuesses(newGuesses)

    // Update used letters
    const newUsedLetters = new Set(usedLetters)
    currentGuess.split('').forEach(letter => newUsedLetters.add(letter))
    setUsedLetters(newUsedLetters)

    if (currentGuess === targetWord) {
      setWon(true)
      setGameOver(true)
      setMessage('🎉 You won!')
      setStats(prev => ({ ...prev, wins: prev.wins + 1, streak: prev.streak + 1 }))
    } else if (newGuesses.length >= MAX_GUESSES) {
      setGameOver(true)
      setMessage(`💀 Game Over! The word was: ${targetWord}`)
      setStats(prev => ({ ...prev, losses: prev.losses + 1, streak: 0 }))
    }

    setCurrentGuess('')
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleGuess()
    }
  }

  const handleLetterClick = (letter: string) => {
    if (gameOver || currentGuess.length >= WORD_LENGTH) return
    setCurrentGuess(currentGuess + letter)
  }

  const handleBackspace = () => {
    setCurrentGuess(currentGuess.slice(0, -1))
  }

  const getLetterStatus = (letter: string): 'correct' | 'present' | 'absent' | 'unused' => {
    for (const guess of guesses) {
      for (let i = 0; i < WORD_LENGTH; i++) {
        if (guess.word[i] === letter) {
          if (guess.feedback[i] === 'correct') return 'correct'
          if (guess.feedback[i] === 'present') return 'present'
        }
      }
    }
    return usedLetters.has(letter) ? 'absent' : 'unused'
  }

  const resetGame = () => {
    setTargetWord('')
    setGuesses([])
    setCurrentGuess('')
    setGameOver(false)
    setWon(false)
    setMessage('')
    setGameStarted(false)
    setUsedLetters(new Set())
  }

  return (
    <div className="wordle-container">
      <div className="wordle-content">
        <h1>🎮 Wordle</h1>
        <p className="subtitle">Guess the word in 6 tries!</p>

        <div className="stats-display">
          <div className="stat-item">
            <span className="stat-label">Wins:</span>
            <span className="stat-value">{stats.wins}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Losses:</span>
            <span className="stat-value">{stats.losses}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Streak:</span>
            <span className="stat-value">{stats.streak}</span>
          </div>
        </div>

        {!gameStarted && (
          <div className="start-section">
            <p className="start-message">Click "Start Game" to begin playing Wordle!</p>
            <button className="start-button" onClick={startGame}>
              ▶️ Start Game
            </button>
          </div>
        )}

        {gameStarted && (
          <div className="game-wrapper">
            <div className="guesses-container">
              {Array.from({ length: MAX_GUESSES }).map((_, rowIndex) => (
                <div key={rowIndex} className="guess-row">
                  {Array.from({ length: WORD_LENGTH }).map((_, colIndex) => {
                    const guess = guesses[rowIndex]
                    const letter = guess?.word[colIndex] || ''
                    const feedback = guess?.feedback[colIndex] || 'empty'
                    const isCurrent = rowIndex === guesses.length && colIndex < currentGuess.length

                    return (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        className={`letter-tile ${feedback} ${isCurrent ? 'current' : ''}`}
                      >
                        {letter || (isCurrent ? currentGuess[colIndex] : '')}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>

            {message && (
              <div className={`message ${won ? 'success' : gameOver ? 'error' : ''}`}>
                {message}
              </div>
            )}

            <div className="input-section">
              <input
                type="text"
                value={currentGuess}
                onChange={(e) => setCurrentGuess(e.target.value.toUpperCase().slice(0, WORD_LENGTH))}
                onKeyPress={handleKeyPress}
                placeholder="Type your guess..."
                maxLength={WORD_LENGTH}
                disabled={gameOver}
                className="guess-input"
              />
              <button
                className="submit-button"
                onClick={handleGuess}
                disabled={gameOver || currentGuess.length !== WORD_LENGTH}
              >
                Submit
              </button>
              <button
                className="backspace-button"
                onClick={handleBackspace}
                disabled={gameOver || currentGuess.length === 0}
              >
                ⌫
              </button>
            </div>

            <div className="keyboard">
              {ALPHABET.map((letter) => {
                const status = getLetterStatus(letter)
                return (
                  <button
                    key={letter}
                    className={`key ${status}`}
                    onClick={() => handleLetterClick(letter)}
                    disabled={gameOver || currentGuess.length >= WORD_LENGTH || status === 'correct' || status === 'absent'}
                  >
                    {letter}
                  </button>
                )
              })}
            </div>

            {gameOver && (
              <div className="button-group">
                <button className="play-again-button" onClick={startGame}>
                  🔄 Play Again
                </button>
                <button className="quit-button" onClick={resetGame}>
                  🏠 Quit
                </button>
              </div>
            )}
          </div>
        )}

        <div className="instructions">
          <h2>How to Play</h2>
          <ul>
            <li>Guess the word in 6 tries</li>
            <li>Each guess must be a valid 5-letter word</li>
            <li>After each guess, tiles change color:</li>
            <ul>
              <li>🟩 <strong>Green</strong> - Letter is correct and in the right position</li>
              <li>🟨 <strong>Yellow</strong> - Letter is in the word but wrong position</li>
              <li>⬜ <strong>Gray</strong> - Letter is not in the word</li>
            </ul>
            <li>Use the keyboard or on-screen buttons to enter letters</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Wordle
