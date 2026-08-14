import { useState, useRef } from 'react'
import './ReactionTime.css'

interface GameState {
  gameStarted: boolean
  waitingForSignal: boolean
  signalActive: boolean
  reactionTime: number | null
  bestTime: number | null
  attempts: number
  message: string
  tooEarly: boolean
}

function ReactionTime() {
  const [gameState, setGameState] = useState<GameState>({
    gameStarted: false,
    waitingForSignal: false,
    signalActive: false,
    reactionTime: null,
    bestTime: parseInt(localStorage.getItem('reactionTimeBest') || '0', 10) || null,
    attempts: 0,
    message: 'Click "Start Game" to begin!',
    tooEarly: false,
  })

  const startTimeRef = useRef<number | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const startGame = () => {
    // Clear any existing timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    setGameState({
      gameStarted: true,
      waitingForSignal: true,
      signalActive: false,
      reactionTime: null,
      bestTime: gameState.bestTime,
      attempts: gameState.attempts + 1,
      message: 'Wait for the signal...',
      tooEarly: false,
    })

    // Random delay between 1-4 seconds
    const delay = Math.random() * 3000 + 1000
    timeoutRef.current = setTimeout(() => {
      setGameState((prev) => ({
        ...prev,
        waitingForSignal: false,
        signalActive: true,
        message: '🎯 CLICK NOW!',
      }))
      startTimeRef.current = Date.now()
    }, delay)
  }

  const handleClick = () => {
    if (!gameState.gameStarted) {
      return
    }

    if (gameState.waitingForSignal) {
      // Clicked too early
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      setGameState({
        gameStarted: false,
        waitingForSignal: false,
        signalActive: false,
        reactionTime: null,
        bestTime: gameState.bestTime,
        attempts: gameState.attempts,
        message: '⚠️ Too early! Wait for the signal.',
        tooEarly: true,
      })
      return
    }

    if (gameState.signalActive && startTimeRef.current) {
      const time = Date.now() - startTimeRef.current
      const newBestTime =
        gameState.bestTime === null || time < gameState.bestTime
          ? time
          : gameState.bestTime

      if (newBestTime !== gameState.bestTime) {
        localStorage.setItem('reactionTimeBest', newBestTime.toString())
      }

      setGameState({
        gameStarted: false,
        waitingForSignal: false,
        signalActive: false,
        reactionTime: time,
        bestTime: newBestTime,
        attempts: gameState.attempts,
        message: `⚡ ${time}ms - ${newBestTime === time ? '🏆 New Personal Best!' : ''}`,
        tooEarly: false,
      })
    }
  }

  const resetStats = () => {
    localStorage.removeItem('reactionTimeBest')
    setGameState({
      gameStarted: false,
      waitingForSignal: false,
      signalActive: false,
      reactionTime: null,
      bestTime: null,
      attempts: 0,
      message: 'Stats reset! Click "Start Game" to begin.',
      tooEarly: false,
    })
  }

  return (
    <div className="reaction-container">
      <div className="reaction-content">
        <h1>Reaction Time</h1>
        <p className="subtitle">Test your reflexes! Click as fast as you can when the signal appears.</p>

        <div className="reaction-game-area" onClick={handleClick}>
          <div
            className={`reaction-signal ${
              gameState.signalActive ? 'active' : ''
            } ${gameState.waitingForSignal ? 'waiting' : ''}`}
          >
            {gameState.signalActive && <span className="signal-text">🎯</span>}
            {gameState.waitingForSignal && (
              <span className="waiting-text">⏳</span>
            )}
            {!gameState.gameStarted && !gameState.waitingForSignal && (
              <span className="idle-text">Click here</span>
            )}
          </div>
        </div>

        <div className="reaction-message">
          <p className={`message ${gameState.tooEarly ? 'error' : ''}`}>
            {gameState.message}
          </p>
        </div>

        <div className="reaction-stats">
          <div className="stat-box">
            <span className="stat-label">Current Time</span>
            <span className="stat-value">
              {gameState.reactionTime !== null ? `${gameState.reactionTime}ms` : '—'}
            </span>
          </div>
          <div className="stat-box">
            <span className="stat-label">Best Time</span>
            <span className="stat-value">
              {gameState.bestTime !== null ? `${gameState.bestTime}ms` : '—'}
            </span>
          </div>
          <div className="stat-box">
            <span className="stat-label">Attempts</span>
            <span className="stat-value">{gameState.attempts}</span>
          </div>
        </div>

        <div className="reaction-buttons">
          <button
            className="start-button"
            onClick={startGame}
            disabled={gameState.gameStarted}
          >
            {gameState.gameStarted ? '⏳ Waiting...' : '▶️ Start Game'}
          </button>
          <button className="reset-button" onClick={resetStats}>
            🔄 Reset Stats
          </button>
        </div>

        <div className="instructions">
          <h2>How to Play</h2>
          <ul>
            <li>Click "Start Game" to begin</li>
            <li>Wait for the blue signal to appear</li>
            <li>Click as fast as you can when you see the signal</li>
            <li>Your reaction time will be displayed in milliseconds</li>
            <li>Try to beat your personal best!</li>
            <li>⚠️ Clicking before the signal appears counts as too early</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ReactionTime
