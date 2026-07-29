import { useState, useEffect, useCallback } from 'react'
import './WordScramble.css'

interface ScrambleWord {
  word: string
  scrambled: string
  hint: string
  category: string
}

const WORD_LIST: ScrambleWord[] = [
  { word: 'JAVASCRIPT', scrambled: 'TPIRCSCAJA', hint: 'Popular web programming language', category: 'Programming' },
  { word: 'ALGORITHM', scrambled: 'MHTIROGLA', hint: 'Step-by-step procedure', category: 'Computer Science' },
  { word: 'DATABASE', scrambled: 'ESABATAD', hint: 'Organized data storage', category: 'Technology' },
  { word: 'FUNCTION', scrambled: 'NOITCNUF', hint: 'Reusable code block', category: 'Programming' },
  { word: 'VARIABLE', scrambled: 'ELBAIRAV', hint: 'Data container', category: 'Programming' },
  { word: 'COMPILER', scrambled: 'RELIPCOM', hint: 'Converts code to machine language', category: 'Computer Science' },
  { word: 'NETWORK', scrambled: 'KROWTEN', hint: 'Connected computers', category: 'Technology' },
  { word: 'SECURITY', scrambled: 'YTIRUCES', hint: 'Protection from threats', category: 'Technology' },
  { word: 'INTERFACE', scrambled: 'ECAFRETNI', hint: 'User interaction point', category: 'Programming' },
  { word: 'FRAMEWORK', scrambled: 'KROWEMARF', hint: 'Foundation for apps', category: 'Programming' },
]

function WordScramble() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [userInput, setUserInput] = useState('')
  const [score, setScore] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info')
  const [wordsCompleted, setWordsCompleted] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [gameComplete, setGameComplete] = useState(false)

  const currentWord = WORD_LIST[currentWordIndex]

  const handleGuess = useCallback(() => {
    const guess = userInput.toUpperCase().trim()

    if (!guess) {
      setMessage('Please enter a word!')
      setMessageType('error')
      return
    }

    if (guess === currentWord.word) {
      const points = 100 - hintsUsed * 10
      setScore((prev) => prev + points)
      setWordsCompleted((prev) => prev + 1)
      setMessage(`✅ Correct! +${points} points`)
      setMessageType('success')
      setUserInput('')
      setShowHint(false)
      setHintsUsed(0)

      // Move to next word after a delay
      setTimeout(() => {
        if (currentWordIndex < WORD_LIST.length - 1) {
          setCurrentWordIndex((prev) => prev + 1)
          setMessage('')
        } else {
          setGameComplete(true)
          setMessage(`🏆 Puzzle Complete! Final Score: ${score + points}`)
          setMessageType('success')
        }
      }, 1500)
    } else {
      setMessage('❌ Not quite right. Try again!')
      setMessageType('error')
      setUserInput('')
    }
  }, [userInput, currentWord, hintsUsed, currentWordIndex, score])

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleGuess()
    }
  }

  const toggleHint = () => {
    if (!showHint) {
      setShowHint(true)
      setHintsUsed((prev) => prev + 1)
    } else {
      setShowHint(false)
    }
  }

  const startGame = () => {
    setGameStarted(true)
    setScore(0)
    setWordsCompleted(0)
    setCurrentWordIndex(0)
    setUserInput('')
    setMessage('')
    setShowHint(false)
    setHintsUsed(0)
    setGameComplete(false)
  }

  const resetGame = () => {
    setGameStarted(false)
    setScore(0)
    setWordsCompleted(0)
    setCurrentWordIndex(0)
    setUserInput('')
    setMessage('')
    setShowHint(false)
    setHintsUsed(0)
    setGameComplete(false)
  }

  const skipWord = () => {
    if (currentWordIndex < WORD_LIST.length - 1) {
      setCurrentWordIndex((prev) => prev + 1)
      setUserInput('')
      setMessage('')
      setShowHint(false)
      setHintsUsed(0)
    } else {
      setGameComplete(true)
      setMessage(`🏆 Puzzle Complete! Final Score: ${score}`)
      setMessageType('success')
    }
  }

  return (
    <div className="word-scramble-container">
      <div className="word-scramble-content">
        <h1>🔀 Word Scramble</h1>
        <p className="subtitle">Unscramble the letters to find the word!</p>

        <div className="scramble-wrapper">
          <div className="stats-bar">
            <div className="stat">
              <span className="stat-label">Score:</span>
              <span className="stat-value">{score}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Words:</span>
              <span className="stat-value">{wordsCompleted}/{WORD_LIST.length}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Progress:</span>
              <span className="stat-value">{currentWordIndex + 1}/{WORD_LIST.length}</span>
            </div>
          </div>

          {!gameStarted && (
            <div className="start-message">
              <p>🎮 Welcome to Word Scramble!</p>
              <p className="controls-hint">Unscramble the letters to find the hidden word</p>
            </div>
          )}

          {gameStarted && !gameComplete && (
            <div className="scramble-game">
              <div className="category-badge">{currentWord.category}</div>

              <div className="scrambled-display">
                <p className="scrambled-label">Unscramble:</p>
                <div className="scrambled-word">{currentWord.scrambled}</div>
              </div>

              <div className="hint-section">
                <button
                  className={`hint-button ${showHint ? 'active' : ''}`}
                  onClick={toggleHint}
                >
                  💡 {showHint ? 'Hide Hint' : 'Show Hint'}
                </button>
                {showHint && (
                  <div className="hint-box">
                    <p className="hint-text">{currentWord.hint}</p>
                  </div>
                )}
              </div>

              {message && (
                <div className={`message ${messageType}`}>
                  {message}
                </div>
              )}

              <div className="input-section">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your answer..."
                  className="word-input"
                  disabled={message === `✅ Correct! +${100 - hintsUsed * 10} points`}
                  autoFocus
                />
              </div>

              <div className="button-group">
                <button className="submit-button" onClick={handleGuess}>
                  ✓ Submit
                </button>
                <button className="skip-button" onClick={skipWord}>
                  ⏭️ Skip
                </button>
              </div>
            </div>
          )}

          {gameComplete && (
            <div className="game-complete">
              <div className="final-score">
                <p className="score-label">Final Score:</p>
                <p className="score-value">{score}</p>
              </div>
              <p className="completion-message">
                🎉 You completed {wordsCompleted} out of {WORD_LIST.length} words!
              </p>
              <button className="play-again-button" onClick={resetGame}>
                🔄 Play Again
              </button>
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
            <li>Look at the scrambled letters</li>
            <li>Unscramble them to form the correct word</li>
            <li>Type your answer and click Submit</li>
            <li>Use hints if you get stuck (but they cost points!)</li>
            <li>Skip words you can't solve</li>
            <li>Earn 100 points per correct word (minus 10 per hint used)</li>
            <li>Complete all {WORD_LIST.length} words to finish!</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default WordScramble
