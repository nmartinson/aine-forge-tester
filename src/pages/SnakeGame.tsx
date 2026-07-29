import { useState, useEffect, useRef } from 'react'
import './SnakeGame.css'

interface Position {
  x: number
  y: number
}

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'

const GRID_SIZE = 20
const CELL_SIZE = 20

function SnakeGame() {
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }])
  const [food, setFood] = useState<Position>({ x: 15, y: 15 })
  const [direction, setDirection] = useState<Direction>('RIGHT')
  const [nextDirection, setNextDirection] = useState<Direction>('RIGHT')
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null)

  // Generate random food position
  const generateFood = (): Position => {
    return {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    }
  }

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameStarted && (e.key === ' ' || e.key === 'Enter')) {
        e.preventDefault()
        startGame()
        return
      }

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault()
          if (direction !== 'DOWN') setNextDirection('UP')
          break
        case 'ArrowDown':
          e.preventDefault()
          if (direction !== 'UP') setNextDirection('DOWN')
          break
        case 'ArrowLeft':
          e.preventDefault()
          if (direction !== 'RIGHT') setNextDirection('LEFT')
          break
        case 'ArrowRight':
          e.preventDefault()
          if (direction !== 'LEFT') setNextDirection('RIGHT')
          break
        default:
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [direction, gameStarted])

  // Game loop
  useEffect(() => {
    if (!gameStarted || gameOver) return

    gameLoopRef.current = setInterval(() => {
      setSnake((prevSnake) => {
        setDirection(nextDirection)
        const head = prevSnake[0]
        let newHead: Position

        switch (nextDirection) {
          case 'UP':
            newHead = { x: head.x, y: (head.y - 1 + GRID_SIZE) % GRID_SIZE }
            break
          case 'DOWN':
            newHead = { x: head.x, y: (head.y + 1) % GRID_SIZE }
            break
          case 'LEFT':
            newHead = { x: (head.x - 1 + GRID_SIZE) % GRID_SIZE, y: head.y }
            break
          case 'RIGHT':
            newHead = { x: (head.x + 1) % GRID_SIZE, y: head.y }
            break
        }

        // Check collision with self
        if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true)
          return prevSnake
        }

        let newSnake = [newHead, ...prevSnake]

        // Check if food is eaten
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((prev) => prev + 10)
          setFood(generateFood())
        } else {
          newSnake.pop()
        }

        return newSnake
      })
    }, 150)

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current)
    }
  }, [gameStarted, gameOver, food, nextDirection])

  const startGame = () => {
    setSnake([{ x: 10, y: 10 }])
    setFood(generateFood())
    setDirection('RIGHT')
    setNextDirection('RIGHT')
    setGameOver(false)
    setScore(0)
    setGameStarted(true)
  }

  const resetGame = () => {
    setGameStarted(false)
    setGameOver(false)
    setSnake([{ x: 10, y: 10 }])
    setFood(generateFood())
    setDirection('RIGHT')
    setNextDirection('RIGHT')
    setScore(0)
  }

  return (
    <div className="snake-container">
      <div className="snake-content">
        <h1>🐍 Snake Game</h1>
        <p className="subtitle">A classic game from old mobile phones!</p>

        <div className="game-wrapper">
          <div className="stats-bar">
            <div className="stat">
              <span className="stat-label">Score:</span>
              <span className="stat-value">{score}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Length:</span>
              <span className="stat-value">{snake.length}</span>
            </div>
          </div>

          {gameOver && (
            <div className="game-over-message">
              <p>💀 Game Over!</p>
              <p className="final-score">Final Score: {score}</p>
            </div>
          )}

          {!gameStarted && !gameOver && (
            <div className="start-message">
              <p>Press SPACE or ENTER to start</p>
              <p className="controls-hint">Use arrow keys to move</p>
            </div>
          )}

          <div className="game-board">
            <div
              className="game-grid"
              style={{
                width: `${GRID_SIZE * CELL_SIZE}px`,
                height: `${GRID_SIZE * CELL_SIZE}px`,
              }}
            >
              {/* Render snake */}
              {snake.map((segment, index) => (
                <div
                  key={`snake-${index}`}
                  className={`snake-segment ${index === 0 ? 'head' : ''}`}
                  style={{
                    left: `${segment.x * CELL_SIZE}px`,
                    top: `${segment.y * CELL_SIZE}px`,
                    width: `${CELL_SIZE}px`,
                    height: `${CELL_SIZE}px`,
                  }}
                />
              ))}

              {/* Render food */}
              <div
                className="food"
                style={{
                  left: `${food.x * CELL_SIZE}px`,
                  top: `${food.y * CELL_SIZE}px`,
                  width: `${CELL_SIZE}px`,
                  height: `${CELL_SIZE}px`,
                }}
              >
                🍎
              </div>
            </div>
          </div>

          <div className="button-group">
            {!gameStarted ? (
              <button className="start-button" onClick={startGame}>
                ▶️ Start Game
              </button>
            ) : (
              <button className="reset-button" onClick={resetGame}>
                🔄 Reset Game
              </button>
            )}
          </div>
        </div>

        <div className="instructions">
          <h2>How to Play</h2>
          <ul>
            <li>Use arrow keys to move the snake</li>
            <li>Eat the apple 🍎 to grow and earn points</li>
            <li>Don't hit the walls or yourself</li>
            <li>Each apple eaten gives you 10 points</li>
            <li>Try to get the highest score!</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default SnakeGame
