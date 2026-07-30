import { useState, useEffect, useCallback, useMemo } from 'react'
import './Hangman.css'

interface GameState {
  word: string
  guessedLetters: string[]
  wrongGuesses: number
  gameOver: boolean
  won: boolean
}

function Hangman() {
  const words = useMemo(() => [
    'TYPESCRIPT',
    'JAVASCRIPT',
    'PROGRAMMING',
    'DEVELOPER',
    'ALGORITHM',
    'DATABASE',
    'FRAMEWORK',
    'COMPONENT',
    'FUNCTION',
    'VARIABLE',
    'CONSTANT',
    'INTERFACE',
    'ABSTRACT',
    'INHERITANCE',
    'POLYMORPHISM',
  ], [])

  const maxWrongGuesses = 6
  const [gameState, setGameState] = useState<GameState>({
    word: '',
    guessedLetters: [],
    wrongGuesses: 0,
    gameOver: false,
    won: false,
  })

  // Initialize game
  const initializeGame = useCallback(() => {
    const randomWord = words[Math.floor(Math.random() * words.length)]
    setGameState({
      word: randomWord,
      guessedLetters: [],
      wrongGuesses: 0,
      gameOver: false,
      won: false,
    })
  }, [words])

  useEffect(() => {
    initializeGame()
  }, [initializeGame])

  // Check for win/loss
  useEffect(() => {
    if (gameState.word === '') return

    const wordLetters = new Set(gameState.word.split(''))
    const guessedLetters = new Set(gameState.guessedLetters)
    const allLettersGuessed = Array.from(wordLetters).every(letter =>
      guessedLetters.has(letter)
    )

    if (allLettersGuessed) {
      setGameState(prev => ({ ...prev, won: true, gameOver: true }))
    } else if (gameState.wrongGuesses >= maxWrongGuesses) {
      setGameState(prev => ({ ...prev, gameOver: true }))
    }
  }, [gameState.guessedLetters, gameState.wrongGuesses, gameState.word])

  const handleGuess = (letter: string) => {
    if (gameState.gameOver || gameState.guessedLetters.includes(letter)) {
      return
    }

    const newGuessedLetters = [...gameState.guessedLetters, letter]
    const isCorrect = gameState.word.includes(letter)
    const newWrongGuesses = isCorrect
      ? gameState.wrongGuesses
      : gameState.wrongGuesses + 1

    setGameState(prev => ({
      ...prev,
      guessedLetters: newGuessedLetters,
      wrongGuesses: newWrongGuesses,
    }))
  }

  const getDisplayWord = () => {
    return gameState.word
      .split('')
      .map(letter => (gameState.guessedLetters.includes(letter) ? letter : '_'))
      .join(' ')
  }

  const getHangmanStage = () => {
    const stages = [
      '  +---+\n  |   |\n      |\n      |\n      |\n      |\n=========',
      '  +---+\n  |   |\n  O   |\n      |\n      |\n      |\n=========',
      '  +---+\n  |   |\n  O   |\n  |   |\n      |\n      |\n=========',
      '  +---+\n  |   |\n  O   |\n /|   |\n      |\n      |\n=========',
      '  +---+\n  |   |\n  O   |\n /|\\  |\n      |\n      |\n=========',
      '  +---+\n  |   |\n  O   |\n /|\\  |\n /    |\n      |\n=========',
      '  +---+\n  |   |\n  O   |\n /|\\  |\n / \\  |\n      |\n=========',
    ]
    return stages[gameState.wrongGuesses]
  }

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

  return (
    <div className="hangman-container">
      <div className="hangman-content">
        <h1 className="hangman-title">Hangman Game</h1>
        <p className="hangman-subtitle">Guess the word before you run out of tries!</p>

        <div className="hangman-game-area">
          <div className="hangman-drawing">
            <pre className="hangman-figure">{getHangmanStage()}</pre>
            <div className="hangman-stats">
              <div className="stat">
                <span className="stat-label">Wrong Guesses:</span>
                <span className="stat-value">{gameState.wrongGuesses} / {maxWrongGuesses}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Guessed:</span>
                <span className="stat-value">{gameState.guessedLetters.length}</span>
              </div>
            </div>
          </div>

          <div className="hangman-word-display">
            <div className="word-container">
              <p className="display-word">{getDisplayWord()}</p>
            </div>

            {gameState.gameOver && (
              <div className={`hangman-result ${gameState.won ? 'won' : 'lost'}`}>
                {gameState.won ? (
                  <>
                    <h2>🎉 You Won!</h2>
                    <p>The word was: <strong>{gameState.word}</strong></p>
                  </>
                ) : (
                  <>
                    <h2>💀 Game Over!</h2>
                    <p>The word was: <strong>{gameState.word}</strong></p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="hangman-keyboard">
          {alphabet.map(letter => (
            <button
              key={letter}
              className={`letter-btn ${
                gameState.guessedLetters.includes(letter) ? 'guessed' : ''
              } ${
                gameState.word.includes(letter) && gameState.guessedLetters.includes(letter)
                  ? 'correct'
                  : ''
              } ${
                !gameState.word.includes(letter) && gameState.guessedLetters.includes(letter)
                  ? 'wrong'
                  : ''
              }`}
              onClick={() => handleGuess(letter)}
              disabled={gameState.gameOver || gameState.guessedLetters.includes(letter)}
            >
              {letter}
            </button>
          ))}
        </div>

        <button className="hangman-reset-btn" onClick={initializeGame}>
          {gameState.gameOver ? 'Play Again' : 'New Game'}
        </button>
      </div>
    </div>
  )
}

export default Hangman
