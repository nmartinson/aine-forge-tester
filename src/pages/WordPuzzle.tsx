import { useState, useEffect, useCallback } from 'react'
import './WordPuzzle.css'

interface Word {
  word: string
  hint: string
}

const WORD_LIST: Word[] = [
  { word: 'REACT', hint: 'A JavaScript library for building UIs' },
  { word: 'TYPESCRIPT', hint: 'JavaScript with types' },
  { word: 'PUZZLE', hint: 'A game that challenges your mind' },
  { word: 'DEVELOPER', hint: 'Someone who writes code' },
  { word: 'ALGORITHM', hint: 'Step-by-step procedure for solving a problem' },
  { word: 'DATABASE', hint: 'Organized collection of data' },
  { word: 'FUNCTION', hint: 'Reusable block of code' },
  { word: 'VARIABLE', hint: 'Container for storing data' },
  { word: 'INTERFACE', hint: 'Contract defining properties and methods' },
  { word: 'COMPONENT', hint: 'Reusable piece of UI' },
  { word: 'FRAMEWORK', hint: 'Foundation for building applications' },
  { word: 'DEBUGGING', hint: 'Finding and fixing errors' },
]

function WordPuzzle() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set())
  const [wrongGuesses, setWrongGuesses] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)
  const [score, setScore] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [message, setMessage] = useState('')

  const MAX_WRONG_GUESSES = 6
  const currentWord = WORD_LIST[currentWordIndex]

  const getDisplayWord = useCallback(() => {
    return currentWord.word
      .split('')
      .map((letter) => (guessedLetters.has(letter) ? letter : '_'))
      .join(' ')
  }, [currentWord, guessedLetters])

  const isWordComplete = useCallback(() => {
    return currentWord.word.split('').every((letter) => guessedLetters.has(letter))
  }, [currentWord, guessedLetters])

  useEffect(() => {
    if (!gameStarted) return

    if (isWordComplete()) {
      setWon(true)
      setScore((prev) => prev + (MAX_WRONG_GUESSES - wrongGuesses) * 10)
      setMessage('🎉 Word found! Great job!')
    } else if (wrongGuesses >= MAX_WRONG_GUESSES) {
      setGameOver(true)
      setMessage(`💀 Game Over! The word was: ${currentWord.word}`)
    }
  }, [guessedLetters, wrongGuesses, gameStarted, isWordComplete, currentWord, MAX_WRONG_GUESSES])

  const handleLetterClick = (letter: string) => {
    if (guessedLetters.has(letter) || gameOver || won) return

    const newGuessed = new Set(guessedLetters)
    newGuessed.add(letter)
    setGuessedLetters(newGuessed)

    if (!currentWord.word.includes(letter)) {
      setWrongGuesses((prev) => prev + 1)
    }
  }

  const startGame = () => {
    setGameStarted(true)
    setGuessedLetters(new Set())
    setWrongGuesses(0)
    setGameOver(false)
    setWon(false)
    setMessage('')
  }

  const nextWord = () => {
    if (currentWordIndex < WORD_LIST.length - 1) {
      setCurrentWordIndex((prev) => prev + 1)
      setGuessedLetters(new Set())
      setWrongGuesses(0)
      setGameOver(false)
      setWon(false)
      setMessage('')
    } else {
      setGameStarted(false)
      setMessage(`🏆 Puzzle Complete! Final Score: ${score}`)
    }
  }

  const resetGame = () => {
    setCurrentWordIndex(0)
    setGuessedLetters(new Set())
    setWrongGuesses(0)
    setGameOver(false)
    setWon(false)
    setScore(0)
    setGameStarted(false)
    setMessage('')
  }

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

  return (
    <div className="word-puzzle-container">
      <div className="word-puzzle-content">
        <h1>📚 Word Puzzle</h1>
        <p className="subtitle">Guess the word letter by letter!</p>

        <div className="puzzle-wrapper">
          <div className="stats-bar">
            <div className="stat">
              <span className="stat-label">Score:</span>
              <span className="stat-value">{score}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Word:</span>
              <span className="stat-value">{currentWordIndex + 1}/{WORD_LIST.length}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Wrong:</span>
              <span className="stat-value">{wrongGuesses}/{MAX_WRONG_GUESSES}</span>
            </div>
          </div>

          {!gameStarted && (
            <div className="start-message">
              <p>Click "Start Game" to begin</p>
              <p className="controls-hint">Guess letters to find the hidden word</p>
            </div>
          )}

          {gameStarted && (
            <div className="puzzle-game">
              <div className="hint-box">
                <p className="hint-label">💡 Hint:</p>
                <p className="hint-text">{currentWord.hint}</p>
              </div>

              <div className="word-display">
                <div className="word-letters">{getDisplayWord()}</div>
              </div>

              <div className="hangman-display">
                <div className={`hangman hangman-${wrongGuesses}`}>
                  {wrongGuesses >= 1 && <div className="head">⭕</div>}
                  {wrongGuesses >= 2 && <div className="body">📦</div>}
                  {wrongGuesses >= 3 && <div className="left-arm">👈</div>}
                  {wrongGuesses >= 4 && <div className="right-arm">👉</div>}
                  {wrongGuesses >= 5 && <div className="left-leg">🦵</div>}
                  {wrongGuesses >= 6 && <div className="right-leg">🦵</div>}
                </div>
              </div>

              {message && (
                <div className={`message ${won ? 'success' : gameOver ? 'error' : ''}`}>
                  {message}
                </div>
              )}

              <div className="alphabet-grid">
                {alphabet.map((letter) => (
                  <button
                    key={letter}
                    className={`letter-button ${
                      guessedLetters.has(letter)
                        ? currentWord.word.includes(letter)
                          ? 'correct'
                          : 'wrong'
                        : ''
                    } ${gameOver || won ? 'disabled' : ''}`}
                    onClick={() => handleLetterClick(letter)}
                    disabled={guessedLetters.has(letter) || gameOver || won}
                  >
                    {letter}
                  </button>
                ))}
              </div>

              {(gameOver || won) && (
                <div className="button-group">
                  {currentWordIndex < WORD_LIST.length - 1 ? (
                    <button className="next-button" onClick={nextWord}>
                      ➡️ Next Word
                    </button>
                  ) : (
                    <button className="finish-button" onClick={resetGame}>
                      🏁 Finish
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {!gameStarted && (
            <div className="button-group">
              <button className="start-button" onClick={startGame}>
                ▶️ Start Game
              </button>
            </div>
          )}
        </div>

        <div className="instructions">
          <h2>How to Play</h2>
          <ul>
            <li>Click letters to guess the hidden word</li>
            <li>You have {MAX_WRONG_GUESSES} wrong guesses allowed</li>
            <li>Each correct word earns you points based on wrong guesses</li>
            <li>Use the hint to help you find the word</li>
            <li>Complete all {WORD_LIST.length} words to finish the puzzle!</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default WordPuzzle
