import { useState, useEffect, useRef, useCallback } from 'react'
import './WhackAMole.css'

interface Mole {
  id: number
  isActive: boolean
  isHit: boolean
}

function WhackAMole() {
  const [moles, setMoles] = useState<Mole[]>(
    Array.from({ length: 9 }, (_, i) => ({ id: i, isActive: false, isHit: false }))
  )
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [isPlaying, setIsPlaying] = useState(false)
  const [highScore, setHighScore] = useState(0)
  const gameIntervalRef = useRef<number | null>(null)
  const timerIntervalRef = useRef<number | null>(null)

  useEffect(() => {
    // Load high score from localStorage
    const savedHighScore = localStorage.getItem('whackamole-highscore')
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10))
    }
  }, [])

  const endGame = useCallback(() => {
    setIsPlaying(false)
    if (gameIntervalRef.current) {
      clearInterval(gameIntervalRef.current)
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
    }
  }, [])

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      // Start the game loop
      gameIntervalRef.current = window.setInterval(() => {
        setMoles((prevMoles) => {
          const newMoles = prevMoles.map((mole) => ({
            ...mole,
            isActive: false,
            isHit: false,
          }))

          // Randomly activate 1-3 moles
          const numMolesToActivate = Math.floor(Math.random() * 3) + 1
          const availableIndices = Array.from({ length: 9 }, (_, i) => i)
          
          for (let i = 0; i < numMolesToActivate; i++) {
            const randomIndex = Math.floor(Math.random() * availableIndices.length)
            const moleIndex = availableIndices[randomIndex]
            availableIndices.splice(randomIndex, 1)
            newMoles[moleIndex].isActive = true
          }

          return newMoles
        })
      }, 800)

      // Start the timer
      timerIntervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            endGame()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (gameIntervalRef.current) {
        clearInterval(gameIntervalRef.current)
      }
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
      }
    }
  }, [isPlaying, timeLeft, endGame])

  const startGame = () => {
    setScore(0)
    setTimeLeft(30)
    setIsPlaying(true)
    setMoles(Array.from({ length: 9 }, (_, i) => ({ id: i, isActive: false, isHit: false })))
  }

  useEffect(() => {
    // Update high score when game ends
    if (!isPlaying && timeLeft === 0 && score > highScore) {
      setHighScore(score)
      localStorage.setItem('whackamole-highscore', score.toString())
    }
  }, [isPlaying, timeLeft, score, highScore])

  const whackMole = (moleId: number) => {
    if (!isPlaying) return

    setMoles((prevMoles) => {
      const newMoles = [...prevMoles]
      const mole = newMoles[moleId]
      
      if (mole.isActive && !mole.isHit) {
        mole.isHit = true
        setScore((prevScore) => prevScore + 10)
      }
      
      return newMoles
    })
  }

  return (
    <div className="whackamole-container">
      <div className="whackamole-content">
        <h1>🔨 Whack-a-Mole</h1>
        <p className="subtitle">Test your reflexes and whack those moles!</p>

        <div className="game-wrapper">
          <div className="game-stats">
            <div className="stat-item">
              <span className="stat-label">Score:</span>
              <span className="stat-value">{score}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Time:</span>
              <span className="stat-value">{timeLeft}s</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">High Score:</span>
              <span className="stat-value">{highScore}</span>
            </div>
          </div>

          {!isPlaying && timeLeft === 30 && (
            <div className="game-start">
              <p className="start-message">Ready to test your reflexes?</p>
              <button className="start-button" onClick={startGame}>
                🎮 Start Game
              </button>
            </div>
          )}

          {!isPlaying && timeLeft === 0 && (
            <div className="game-over">
              <h2>🎉 Game Over!</h2>
              <p className="final-score">Final Score: {score}</p>
              {score > highScore && score > 0 && (
                <p className="new-highscore">🏆 New High Score!</p>
              )}
              <button className="start-button" onClick={startGame}>
                🔄 Play Again
              </button>
            </div>
          )}

          <div className="mole-grid">
            {moles.map((mole) => (
              <div
                key={mole.id}
                className={`mole-hole ${mole.isActive ? 'active' : ''} ${
                  mole.isHit ? 'hit' : ''
                }`}
                onClick={() => whackMole(mole.id)}
              >
                <div className="hole-background"></div>
                {mole.isActive && (
                  <div className={`mole ${mole.isHit ? 'whacked' : ''}`}>
                    {mole.isHit ? '💫' : '🐹'}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="instructions">
          <h2>How to Play</h2>
          <ul>
            <li>Click "Start Game" to begin</li>
            <li>Click on the moles as they pop up from their holes</li>
            <li>Each successful hit earns you 10 points</li>
            <li>You have 30 seconds to score as many points as possible</li>
            <li>Try to beat your high score!</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default WhackAMole
