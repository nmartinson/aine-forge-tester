import { useState, useEffect, useRef, useCallback } from 'react'
import './DonkeyKong.css'

interface Player {
  x: number
  y: number
  width: number
  height: number
  velocityY: number
  isJumping: boolean
}

interface Barrel {
  id: number
  x: number
  y: number
  width: number
  height: number
  velocityX: number
  level: number
}

interface Platform {
  x: number
  y: number
  width: number
  height: number
  level: number
}

interface Rect {
  x: number
  y: number
  width: number
  height: number
}

const GAME_WIDTH = 400
const GAME_HEIGHT = 500
const PLAYER_WIDTH = 20
const PLAYER_HEIGHT = 30
const BARREL_SIZE = 20
const GRAVITY = 0.6
const JUMP_STRENGTH = -12
const PLAYER_SPEED = 5
const BARREL_SPEED = 3
const PLATFORM_HEIGHT = 15

const PLATFORMS: Platform[] = [
  { x: 0, y: GAME_HEIGHT - 50, width: GAME_WIDTH, height: PLATFORM_HEIGHT, level: 0 },
  { x: 50, y: GAME_HEIGHT - 130, width: GAME_WIDTH - 100, height: PLATFORM_HEIGHT, level: 1 },
  { x: 0, y: GAME_HEIGHT - 210, width: GAME_WIDTH, height: PLATFORM_HEIGHT, level: 2 },
  { x: 50, y: GAME_HEIGHT - 290, width: GAME_WIDTH - 100, height: PLATFORM_HEIGHT, level: 3 },
  { x: 0, y: GAME_HEIGHT - 370, width: GAME_WIDTH, height: PLATFORM_HEIGHT, level: 4 },
  { x: 50, y: GAME_HEIGHT - 450, width: GAME_WIDTH - 100, height: PLATFORM_HEIGHT, level: 5 },
]

function DonkeyKong() {
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [barrels, setBarrels] = useState<Barrel[]>([])
  const [player, setPlayer] = useState<Player>({
    x: GAME_WIDTH / 2 - PLAYER_WIDTH / 2,
    y: GAME_HEIGHT - 80,
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
    velocityY: 0,
    isJumping: false,
  })

  const gameLoopRef = useRef<NodeJS.Timeout | null>(null)
  const barrelCounterRef = useRef(0)
  const barrelIdRef = useRef(0)
  const keysPressed = useRef<{ [key: string]: boolean }>({})

  const startGame = useCallback(() => {
    setPlayer({
      x: GAME_WIDTH / 2 - PLAYER_WIDTH / 2,
      y: GAME_HEIGHT - 80,
      width: PLAYER_WIDTH,
      height: PLAYER_HEIGHT,
      velocityY: 0,
      isJumping: false,
    })
    setBarrels([])
    setScore(0)
    setLevel(1)
    setGameOver(false)
    setWon(false)
    setGameStarted(true)
    barrelCounterRef.current = 0
    barrelIdRef.current = 0
  }, [])

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameStarted && (e.key === ' ' || e.key === 'Enter')) {
        e.preventDefault()
        startGame()
        return
      }

      keysPressed.current[e.key] = true

      if (e.key === ' ' || e.key === 'ArrowUp') {
        e.preventDefault()
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key] = false
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [gameStarted, startGame])

  // Collision detection
  const checkCollision = (rect1: Rect, rect2: Rect): boolean => {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    )
  }

  // Check if player is on platform
  const getPlayerOnPlatform = useCallback((p: Player): Platform | null => {
    for (const platform of PLATFORMS) {
      if (
        p.y + p.height >= platform.y &&
        p.y + p.height <= platform.y + platform.height + 5 &&
        p.x + p.width > platform.x &&
        p.x < platform.x + platform.width &&
        p.velocityY >= 0
      ) {
        return platform
      }
    }
    return null
  }, [])

  // Game loop
  useEffect(() => {
    if (!gameStarted || gameOver || won) return

    gameLoopRef.current = setInterval(() => {
      setPlayer((prevPlayer) => {
        const newPlayer = { ...prevPlayer }

        // Apply gravity
        newPlayer.velocityY += GRAVITY
        newPlayer.y += newPlayer.velocityY

        // Handle horizontal movement
        if (keysPressed.current['ArrowLeft'] || keysPressed.current['a']) {
          newPlayer.x = Math.max(0, newPlayer.x - PLAYER_SPEED)
        }
        if (keysPressed.current['ArrowRight'] || keysPressed.current['d']) {
          newPlayer.x = Math.min(GAME_WIDTH - newPlayer.width, newPlayer.x + PLAYER_SPEED)
        }

        // Check platform collision
        const platformBelow = getPlayerOnPlatform(newPlayer)
        if (platformBelow) {
          newPlayer.y = platformBelow.y - newPlayer.height
          newPlayer.velocityY = 0
          newPlayer.isJumping = false

          // Jump
          if (keysPressed.current[' '] || keysPressed.current['ArrowUp'] || keysPressed.current['w']) {
            newPlayer.velocityY = JUMP_STRENGTH
            newPlayer.isJumping = true
          }
        }

        // Check if reached top
        if (newPlayer.y < 20) {
          setWon(true)
          return newPlayer
        }

        // Check if fell off bottom
        if (newPlayer.y > GAME_HEIGHT) {
          setGameOver(true)
          return newPlayer
        }

        return newPlayer
      })

      // Spawn barrels
      barrelCounterRef.current++
      const barrelSpawnRate = Math.max(40 - level * 5, 20)
      if (barrelCounterRef.current > barrelSpawnRate) {
        barrelCounterRef.current = 0
        const newBarrel: Barrel = {
          id: barrelIdRef.current++,
          x: Math.random() > 0.5 ? 0 : GAME_WIDTH - BARREL_SIZE,
          y: Math.random() * (GAME_HEIGHT - 200) + 50,
          width: BARREL_SIZE,
          height: BARREL_SIZE,
          velocityX: Math.random() > 0.5 ? BARREL_SPEED + level * 0.5 : -(BARREL_SPEED + level * 0.5),
          level: Math.floor(Math.random() * 6),
        }
        setBarrels((prev) => [...prev, newBarrel])
      }

      // Update barrels
      setBarrels((prevBarrels) => {
        const updatedBarrels = prevBarrels
          .map((barrel) => ({
            ...barrel,
            x: barrel.x + barrel.velocityX,
          }))
          .filter((barrel) => barrel.x > -BARREL_SIZE && barrel.x < GAME_WIDTH)

        // Check barrel collision with player
        for (const barrel of updatedBarrels) {
          if (checkCollision(player, barrel)) {
            setGameOver(true)
            return updatedBarrels
          }
        }

        return updatedBarrels
      })
    }, 30)

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current)
    }
  }, [gameStarted, gameOver, won, player, level, getPlayerOnPlatform])

  const resetGame = () => {
    setGameStarted(false)
    setGameOver(false)
    setWon(false)
    setScore(0)
    setLevel(1)
    setBarrels([])
    setPlayer({
      x: GAME_WIDTH / 2 - PLAYER_WIDTH / 2,
      y: GAME_HEIGHT - 80,
      width: PLAYER_WIDTH,
      height: PLAYER_HEIGHT,
      velocityY: 0,
      isJumping: false,
    })
  }

  const nextLevel = () => {
    setLevel((prev) => prev + 1)
    setScore((prev) => prev + 1000)
    setWon(false)
    setGameOver(false)
    setBarrels([])
    setPlayer({
      x: GAME_WIDTH / 2 - PLAYER_WIDTH / 2,
      y: GAME_HEIGHT - 80,
      width: PLAYER_WIDTH,
      height: PLAYER_HEIGHT,
      velocityY: 0,
      isJumping: false,
    })
  }

  return (
    <div className="donkey-kong-container">
      <div className="donkey-kong-content">
        <h1>🦍 Donkey Kong</h1>
        <p className="subtitle">Jump over barrels and reach the top!</p>

        <div className="game-wrapper">
          <div className="stats-bar">
            <div className="stat">
              <span className="stat-label">Score:</span>
              <span className="stat-value">{score}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Level:</span>
              <span className="stat-value">{level}</span>
            </div>
          </div>

          {gameOver && (
            <div className="game-over-message">
              <p>💀 Game Over!</p>
              <p className="final-score">Final Score: {score}</p>
            </div>
          )}

          {won && (
            <div className="win-message">
              <p>🎉 Level Complete!</p>
              <p className="final-score">Score: {score}</p>
            </div>
          )}

          {!gameStarted && !gameOver && !won && (
            <div className="start-message">
              <p>Press SPACE or ENTER to start</p>
              <p className="controls-hint">Use arrow keys or WASD to move and jump</p>
            </div>
          )}

          <div className="game-board">
            <div
              className="game-canvas"
              style={{
                width: `${GAME_WIDTH}px`,
                height: `${GAME_HEIGHT}px`,
              }}
            >
              {/* Render platforms */}
              {PLATFORMS.map((platform, index) => (
                <div
                  key={`platform-${index}`}
                  className="platform"
                  style={{
                    left: `${platform.x}px`,
                    top: `${platform.y}px`,
                    width: `${platform.width}px`,
                    height: `${platform.height}px`,
                  }}
                />
              ))}

              {/* Render player */}
              <div
                className="player"
                style={{
                  left: `${player.x}px`,
                  top: `${player.y}px`,
                  width: `${player.width}px`,
                  height: `${player.height}px`,
                }}
              >
                🧑
              </div>

              {/* Render barrels */}
              {barrels.map((barrel) => (
                <div
                  key={`barrel-${barrel.id}`}
                  className="barrel"
                  style={{
                    left: `${barrel.x}px`,
                    top: `${barrel.y}px`,
                    width: `${barrel.width}px`,
                    height: `${barrel.height}px`,
                  }}
                >
                  🛢️
                </div>
              ))}

              {/* Donkey Kong at top */}
              <div className="donkey-kong-sprite">🦍</div>
            </div>
          </div>

          <div className="button-group">
            {!gameStarted ? (
              <button className="start-button" onClick={startGame}>
                ▶️ Start Game
              </button>
            ) : gameOver || won ? (
              <>
                <button className="reset-button" onClick={resetGame}>
                  🔄 Reset Game
                </button>
                {won && (
                  <button className="next-level-button" onClick={nextLevel}>
                    ⬆️ Next Level
                  </button>
                )}
              </>
            ) : null}
          </div>
        </div>

        <div className="instructions">
          <h2>How to Play</h2>
          <ul>
            <li>Use arrow keys or WASD to move left and right</li>
            <li>Press SPACE or UP arrow to jump</li>
            <li>Avoid the barrels rolling down the platforms</li>
            <li>Reach the top to complete the level</li>
            <li>Each level gets faster and harder!</li>
            <li>Completing a level gives you 1000 bonus points</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default DonkeyKong
