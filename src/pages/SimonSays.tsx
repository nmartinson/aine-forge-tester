import { useState, useCallback } from 'react'
import './SimonSays.css'

type Color = 'red' | 'blue' | 'green' | 'yellow'

interface GameState {
  sequence: Color[]
  playerSequence: Color[]
  isPlaying: boolean
  gameOver: boolean
  level: number
  score: number
  highScore: number
}

const COLORS: Color[] = ['red', 'blue', 'green', 'yellow']
const COLOR_SOUNDS: Record<Color, string> = {
  red: '🔴',
  blue: '🔵',
  green: '🟢',
  yellow: '🟡',
}

function SimonSays() {
  const [gameState, setGameState] = useState<GameState>({
    sequence: [],
    playerSequence: [],
    isPlaying: false,
    gameOver: false,
    level: 0,
    score: 0,
    highScore: parseInt(localStorage.getItem('simonSaysHighScore') || '0', 10),
  })

  const [activeColor, setActiveColor] = useState<Color | null>(null)

  // Play a color with animation and sound
  const playColor = useCallback(async (color: Color, duration = 500) => {
    setActiveColor(color)
    // Simple beep sound effect using Web Audio API
    try {
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      const frequencies: Record<Color, number> = {
        red: 261.63,
        blue: 329.63,
        green: 392.0,
        yellow: 523.25,
      }

      oscillator.frequency.value = frequencies[color]
      oscillator.type = 'sine'
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.1)
    } catch (e) {
      // Audio context not available, continue without sound
    }

    await new Promise((resolve) => setTimeout(resolve, duration))
    setActiveColor(null)
  }, [])

  // Play the entire sequence
  const playSequence = useCallback(
    async (sequence: Color[]) => {
      setGameState((prev) => ({ ...prev, isPlaying: true }))
      for (const color of sequence) {
        await playColor(color, 600)
        await new Promise((resolve) => setTimeout(resolve, 200))
      }
      setGameState((prev) => ({ ...prev, isPlaying: false }))
    },
    [playColor]
  )

  // Start a new round
  const startNewRound = useCallback(async () => {
    const newSequence = [...gameState.sequence, COLORS[Math.floor(Math.random() * 4)]]
    setGameState((prev) => ({
      ...prev,
      sequence: newSequence,
      playerSequence: [],
      level: prev.level + 1,
      score: prev.score + 10,
    }))
    await new Promise((resolve) => setTimeout(resolve, 1000))
    await playSequence(newSequence)
  }, [gameState.sequence, playSequence])

  // Initialize game
  const initializeGame = useCallback(async () => {
    const newSequence: Color[] = [COLORS[Math.floor(Math.random() * 4)]]
    setGameState({
      sequence: newSequence,
      playerSequence: [],
      isPlaying: true,
      gameOver: false,
      level: 1,
      score: 10,
      highScore: gameState.highScore,
    })
    await new Promise((resolve) => setTimeout(resolve, 500))
    await playSequence(newSequence)
  }, [playSequence, gameState.highScore])

  // Handle color click
  const handleColorClick = useCallback(
    async (color: Color) => {
      if (gameState.isPlaying || gameState.gameOver) return

      const newPlayerSequence = [...gameState.playerSequence, color]
      setGameState((prev) => ({ ...prev, playerSequence: newPlayerSequence }))
      await playColor(color, 300)

      // Check if player's move is correct
      if (gameState.sequence[newPlayerSequence.length - 1] !== color) {
        // Game over - wrong color
        const newHighScore = Math.max(gameState.score, gameState.highScore)
        setGameState((prev) => ({
          ...prev,
          gameOver: true,
          highScore: newHighScore,
        }))
        localStorage.setItem('simonSaysHighScore', newHighScore.toString())
        return
      }

      // Check if player completed the sequence
      if (newPlayerSequence.length === gameState.sequence.length) {
        await new Promise((resolve) => setTimeout(resolve, 500))
        await startNewRound()
      }
    },
    [gameState, playColor, startNewRound]
  )

  return (
    <div className="simon-says-container">
      <div className="simon-says-content">
        <h1 className="simon-title">Simon Says</h1>
        <p className="simon-subtitle">Watch the pattern and repeat it!</p>

        <div className="simon-stats">
          <div className="stat">
            <span className="stat-label">Level</span>
            <span className="stat-value">{gameState.level}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Score</span>
            <span className="stat-value">{gameState.score}</span>
          </div>
          <div className="stat">
            <span className="stat-label">High Score</span>
            <span className="stat-value">{gameState.highScore}</span>
          </div>
        </div>

        <div className="simon-board">
          {COLORS.map((color) => (
            <button
              key={color}
              className={`simon-button simon-${color} ${
                activeColor === color ? 'active' : ''
              }`}
              onClick={() => handleColorClick(color)}
              disabled={gameState.isPlaying || gameState.gameOver}
              aria-label={`${color} button`}
            >
              <span className="simon-emoji">{COLOR_SOUNDS[color]}</span>
            </button>
          ))}
        </div>

        <div className="simon-info">
          {gameState.isPlaying && (
            <p className="simon-message">🎵 Watch the pattern...</p>
          )}
          {!gameState.isPlaying && !gameState.gameOver && gameState.level > 0 && (
            <p className="simon-message">👆 Your turn! Repeat the pattern</p>
          )}
          {gameState.gameOver && (
            <div className="simon-game-over">
              <h2>💥 Game Over!</h2>
              <p>You reached level {gameState.level}</p>
              <p>Final Score: {gameState.score}</p>
            </div>
          )}
        </div>

        <button
          className="simon-start-btn"
          onClick={initializeGame}
          disabled={gameState.isPlaying}
        >
          {gameState.gameOver ? 'Play Again' : gameState.level === 0 ? 'Start Game' : 'Reset'}
        </button>
      </div>
    </div>
  )
}

export default SimonSays
