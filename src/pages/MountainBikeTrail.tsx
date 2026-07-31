import { useState } from 'react'
import BikeSelector from './BikeSelector'
import { Bike } from './BikeData'
import './MountainBikeTrail.css'

interface Trail {
  id: number
  name: string
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  distance: number
  elevation: number
  terrain: string
  description: string
}

interface GameState {
  selectedTrail: Trail | null
  selectedBike: Bike | null
  currentPosition: number
  speed: number
  stamina: number
  gameStarted: boolean
  gameOver: boolean
  won: boolean
  message: string
  time: number
}

const TRAILS: Trail[] = [
  {
    id: 1,
    name: 'Sunny Ridge Loop',
    difficulty: 'beginner',
    distance: 5,
    elevation: 200,
    terrain: 'Smooth dirt and gravel',
    description: 'Perfect for beginners. A gentle loop with scenic views.',
  },
  {
    id: 2,
    name: 'Rocky Mountain Pass',
    difficulty: 'intermediate',
    distance: 12,
    elevation: 800,
    terrain: 'Rocky with some technical sections',
    description: 'A challenging ride with rocky terrain and steep climbs.',
  },
  {
    id: 3,
    name: 'Forest Descent',
    difficulty: 'advanced',
    distance: 15,
    elevation: 1200,
    terrain: 'Dense forest with roots and rocks',
    description: 'Fast descents through dense forest. Requires skill and focus.',
  },
  {
    id: 4,
    name: 'Extreme Peak Challenge',
    difficulty: 'expert',
    distance: 25,
    elevation: 2500,
    terrain: 'Extreme terrain with cliffs and jumps',
    description: 'The ultimate challenge. Only for experienced riders.',
  },
]

function MountainBikeTrail() {
  const [gameState, setGameState] = useState<GameState>({
    selectedTrail: null,
    selectedBike: null,
    currentPosition: 0,
    speed: 0,
    stamina: 100,
    gameStarted: false,
    gameOver: false,
    won: false,
    message: 'Select a bike and trail to begin your adventure!',
    time: 0,
  })

  const [bikeSelected, setBikeSelected] = useState(false)

  const handleBikeSelected = (bike: Bike) => {
    setGameState((prev) => ({
      ...prev,
      selectedBike: bike,
      message: `${bike.emoji} ${bike.name} selected! Now choose your trail.`,
    }))
    setBikeSelected(true)
  }

  const selectTrail = (trail: Trail) => {
    setGameState({
      selectedTrail: trail,
      selectedBike: gameState.selectedBike,
      currentPosition: 0,
      speed: 0,
      stamina: 100,
      gameStarted: true,
      gameOver: false,
      won: false,
      message: `Starting ${trail.name} on your ${gameState.selectedBike?.name}! Use the controls to navigate.`,
      time: 0,
    })
  }

  const accelerate = () => {
    if (!gameState.gameStarted || gameState.gameOver) return

    const newSpeed = Math.min(gameState.speed + 5, 100)
    const staminaCost = newSpeed > 70 ? 3 : 1
    const newStamina = Math.max(gameState.stamina - staminaCost, 0)

    if (newStamina === 0) {
      setGameState((prev) => ({
        ...prev,
        speed: 0,
        stamina: 0,
        gameOver: true,
        message: '😫 Out of stamina! You crashed. Game Over!',
      }))
      return
    }

    const newPosition = gameState.currentPosition + newSpeed / 10
    const trail = gameState.selectedTrail!

    if (newPosition >= trail.distance) {
      setGameState((prev) => ({
        ...prev,
        currentPosition: trail.distance,
        speed: 0,
        gameOver: true,
        won: true,
        message: `🏁 Congratulations! You completed ${trail.name}!`,
      }))
    } else {
      setGameState((prev) => ({
        ...prev,
        currentPosition: newPosition,
        speed: newSpeed,
        stamina: newStamina,
        time: prev.time + 1,
      }))
    }
  }

  const brake = () => {
    if (!gameState.gameStarted || gameState.gameOver) return

    const newSpeed = Math.max(gameState.speed - 10, 0)
    const staminaRecovery = gameState.speed > 50 ? 2 : 1
    const newStamina = Math.min(gameState.stamina + staminaRecovery, 100)

    setGameState((prev) => ({
      ...prev,
      speed: newSpeed,
      stamina: newStamina,
      time: prev.time + 1,
    }))
  }

  const rest = () => {
    if (!gameState.gameStarted || gameState.gameOver) return

    const newStamina = Math.min(gameState.stamina + 15, 100)
    const newSpeed = Math.max(gameState.speed - 5, 0)

    setGameState((prev) => ({
      ...prev,
      speed: newSpeed,
      stamina: newStamina,
      message: '💪 Resting and recovering stamina...',
      time: prev.time + 1,
    }))
  }

  const resetGame = () => {
    setGameState({
      selectedTrail: null,
      selectedBike: null,
      currentPosition: 0,
      speed: 0,
      stamina: 100,
      gameStarted: false,
      gameOver: false,
      won: false,
      message: 'Select a bike and trail to begin your adventure!',
      time: 0,
    })
    setBikeSelected(false)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return '#10b981'
      case 'intermediate':
        return '#f59e0b'
      case 'advanced':
        return '#ef4444'
      case 'expert':
        return '#8b5cf6'
      default:
        return '#6b7280'
    }
  }

  const progressPercentage = gameState.selectedTrail
    ? (gameState.currentPosition / gameState.selectedTrail.distance) * 100
    : 0

  return (
    <div className="trail-container">
      <div className="trail-content">
        <h1>🚵 Mountain Bike Trail Adventure</h1>
        <p className="subtitle">Navigate challenging trails and test your biking skills!</p>

        {!bikeSelected ? (
          <BikeSelector onBikeSelected={handleBikeSelected} />
        ) : !gameState.gameStarted ? (
          <div className="trail-selection">
            <h2>Choose Your Trail</h2>
            <div className="bike-info-banner">
              <p>
                🚴 Riding: <strong>{gameState.selectedBike?.name}</strong>
              </p>
              <button className="change-bike-btn" onClick={resetGame}>
                Change Bike
              </button>
            </div>
            <div className="trails-grid">
              {TRAILS.map((trail) => (
                <div
                  key={trail.id}
                  className="trail-card"
                  style={{ borderLeftColor: getDifficultyColor(trail.difficulty) }}
                >
                  <div className="trail-header">
                    <h3>{trail.name}</h3>
                    <span
                      className="difficulty-badge"
                      style={{ backgroundColor: getDifficultyColor(trail.difficulty) }}
                    >
                      {trail.difficulty.toUpperCase()}
                    </span>
                  </div>
                  <div className="trail-stats">
                    <div className="stat">
                      <span className="stat-label">Distance:</span>
                      <span className="stat-value">{trail.distance} km</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Elevation:</span>
                      <span className="stat-value">{trail.elevation} m</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Terrain:</span>
                      <span className="stat-value">{trail.terrain}</span>
                    </div>
                  </div>
                  <p className="trail-description">{trail.description}</p>
                  <button
                    className="select-trail-btn"
                    onClick={() => selectTrail(trail)}
                    style={{ backgroundColor: getDifficultyColor(trail.difficulty) }}
                  >
                    Start Trail
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="game-wrapper">
            <div className="status-bar">
              <p className="status">{gameState.message}</p>
            </div>

            <div className="trail-info">
              <div className="trail-name">
                {gameState.selectedTrail?.name} ({gameState.selectedTrail?.difficulty.toUpperCase()})
              </div>
              <div className="trail-distance">
                {gameState.currentPosition.toFixed(1)} / {gameState.selectedTrail?.distance} km
              </div>
            </div>

            <div className="progress-section">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <div className="progress-text">{progressPercentage.toFixed(0)}% Complete</div>
            </div>

            <div className="stats-grid">
              <div className="stat-box">
                <div className="stat-icon">⚡</div>
                <div className="stat-label">Speed</div>
                <div className="stat-value">{gameState.speed.toFixed(0)} km/h</div>
              </div>
              <div className="stat-box">
                <div className="stat-icon">💪</div>
                <div className="stat-label">Stamina</div>
                <div className="stat-value">{gameState.stamina.toFixed(0)}%</div>
                <div className="stamina-bar">
                  <div
                    className="stamina-fill"
                    style={{
                      width: `${gameState.stamina}%`,
                      backgroundColor:
                        gameState.stamina > 50
                          ? '#10b981'
                          : gameState.stamina > 25
                            ? '#f59e0b'
                            : '#ef4444',
                    }}
                  ></div>
                </div>
              </div>
              <div className="stat-box">
                <div className="stat-icon">⏱️</div>
                <div className="stat-label">Time</div>
                <div className="stat-value">{gameState.time}s</div>
              </div>
            </div>

            <div className="controls">
              <button
                className="control-btn accelerate"
                onClick={accelerate}
                disabled={gameState.gameOver}
              >
                🚀 Accelerate
              </button>
              <button
                className="control-btn brake"
                onClick={brake}
                disabled={gameState.gameOver}
              >
                🛑 Brake
              </button>
              <button
                className="control-btn rest"
                onClick={rest}
                disabled={gameState.gameOver}
              >
                😮‍💨 Rest
              </button>
            </div>

            {gameState.gameOver && (
              <div className={`game-over-message ${gameState.won ? 'won' : 'lost'}`}>
                <p>{gameState.won ? '🏆 Victory!' : '💔 Defeat!'}</p>
                <p>{gameState.message}</p>
              </div>
            )}

            <button className="reset-button" onClick={resetGame}>
              🔄 Choose Another Trail
            </button>
          </div>
        )}

        <div className="instructions">
          <h2>How to Play</h2>
          <ul>
            <li>Select a bike that matches your riding style</li>
            <li>Choose a trail based on your skill level</li>
            <li>Use Accelerate to move forward and gain speed</li>
            <li>Use Brake to slow down and recover stamina</li>
            <li>Use Rest to recover stamina faster but lose speed</li>
            <li>Balance speed and stamina to complete the trail</li>
            <li>Reach the end of the trail to win!</li>
            <li>Running out of stamina means game over</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default MountainBikeTrail
