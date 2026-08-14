import { useState, useEffect, useRef, useCallback } from 'react'
import './PacMan.css'

interface Position {
  x: number
  y: number
}

interface Ghost {
  x: number
  y: number
  color: string
  direction: 'up' | 'down' | 'left' | 'right'
}

interface GameState {
  pacman: Position & { direction: 'up' | 'down' | 'left' | 'right' }
  ghosts: Ghost[]
  maze: number[][]
  score: number
  pelletsRemaining: number
  gameOver: boolean
  won: boolean
  paused: boolean
}

const ROWS = 15
const COLS = 15

function createMaze(): number[][] {
  const maze: number[][] = Array(ROWS).fill(null).map(() => Array(COLS).fill(1))
  
  // Create paths
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      if ((i % 2 === 1 && j % 2 === 1) || i === 0 || i === ROWS - 1 || j === 0 || j === COLS - 1) {
        maze[i][j] = 0
      }
    }
  }

  // Add some additional paths
  for (let i = 2; i < ROWS - 2; i += 3) {
    for (let j = 2; j < COLS - 2; j += 3) {
      maze[i][j] = 0
      if (j + 1 < COLS) maze[i][j + 1] = 0
    }
  }

  return maze
}

function initializeGame(): GameState {
  const maze = createMaze()
  const pelletsRemaining = maze.flat().filter(cell => cell === 0).length - 4

  return {
    pacman: { x: 1, y: 1, direction: 'right' },
    ghosts: [
      { x: COLS - 2, y: 1, color: '#FF0000', direction: 'left' },
      { x: 1, y: ROWS - 2, color: '#FFB6C1', direction: 'up' },
      { x: COLS - 2, y: ROWS - 2, color: '#00FFFF', direction: 'down' },
      { x: Math.floor(COLS / 2), y: Math.floor(ROWS / 2), color: '#FFB347', direction: 'left' },
    ],
    maze,
    score: 0,
    pelletsRemaining,
    gameOver: false,
    won: false,
    paused: false,
  }
}

function isWall(maze: number[][], x: number, y: number): boolean {
  if (x < 0 || x >= COLS || y < 0 || y >= ROWS) return true
  return maze[y][x] === 1
}

function moveEntity(
  pos: Position,
  direction: 'up' | 'down' | 'left' | 'right',
  maze: number[][]
): Position {
  let newX = pos.x
  let newY = pos.y

  switch (direction) {
    case 'up':
      newY = Math.max(0, pos.y - 1)
      break
    case 'down':
      newY = Math.min(ROWS - 1, pos.y + 1)
      break
    case 'left':
      newX = Math.max(0, pos.x - 1)
      break
    case 'right':
      newX = Math.min(COLS - 1, pos.x + 1)
      break
  }

  if (!isWall(maze, newX, newY)) {
    return { x: newX, y: newY }
  }

  return pos
}

function getRandomDirection(): 'up' | 'down' | 'left' | 'right' {
  const directions: ('up' | 'down' | 'left' | 'right')[] = ['up', 'down', 'left', 'right']
  return directions[Math.floor(Math.random() * directions.length)]
}

export default function PacMan() {
  const [gameState, setGameState] = useState<GameState>(initializeGame)
  const [nextDirection, setNextDirection] = useState<'up' | 'down' | 'left' | 'right'>('right')
  const gameLoopRef = useRef<number | null>(null)
  const moveCounterRef = useRef(0)

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault()
        setNextDirection('up')
        break
      case 'ArrowDown':
        e.preventDefault()
        setNextDirection('down')
        break
      case 'ArrowLeft':
        e.preventDefault()
        setNextDirection('left')
        break
      case 'ArrowRight':
        e.preventDefault()
        setNextDirection('right')
        break
    }
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const updateGame = useCallback((state: GameState, direction: 'up' | 'down' | 'left' | 'right'): GameState => {
    if (state.gameOver || state.won || state.paused) return state

    const newState = { ...state }
    const maze = newState.maze

    // Move Pac-Man
    let newPacmanPos = moveEntity(state.pacman, direction, maze)
    if (JSON.stringify(newPacmanPos) === JSON.stringify(state.pacman)) {
      newPacmanPos = moveEntity(state.pacman, state.pacman.direction, maze)
    }
    const newPacman: GameState['pacman'] = { ...newPacmanPos, direction }

    // Eat pellets
    if (maze[newPacman.y][newPacman.x] === 0) {
      newState.score += 10
      maze[newPacman.y][newPacman.x] = 2 // Mark as eaten
      newState.pelletsRemaining -= 1
    }

    // Move ghosts (every other frame)
    moveCounterRef.current += 1
    if (moveCounterRef.current % 2 === 0) {
      const newGhosts = newState.ghosts.map(ghost => {
        let newGhost = moveEntity(ghost, ghost.direction, maze)
        if (JSON.stringify(newGhost) === JSON.stringify(ghost)) {
          const newDir = getRandomDirection()
          newGhost = moveEntity(ghost, newDir, maze)
          return { ...ghost, ...newGhost, direction: newDir }
        }
        return { ...ghost, ...newGhost }
      })
      newState.ghosts = newGhosts
    }

    // Check collisions with ghosts
    const collision = newState.ghosts.some(
      ghost => ghost.x === newPacman.x && ghost.y === newPacman.y
    )
    if (collision) {
      newState.gameOver = true
    }

    // Check win condition
    if (newState.pelletsRemaining === 0) {
      newState.won = true
    }

    newState.pacman = newPacman
    return newState
  }, [])

  useEffect(() => {
    const gameLoop = () => {
      setGameState(prev => updateGame(prev, nextDirection))
      gameLoopRef.current = requestAnimationFrame(gameLoop)
    }
    gameLoopRef.current = requestAnimationFrame(gameLoop)
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current)
    }
  }, [updateGame, nextDirection])

  const resetGame = () => {
    setGameState(initializeGame())
    setNextDirection('right')
    moveCounterRef.current = 0
  }

  const togglePause = () => {
    setGameState(prev => ({ ...prev, paused: !prev.paused }))
  }

  return (
    <div className="pacman-container">
      <h1>Pac-Man</h1>
      <p className="pacman-description">Navigate the maze and eat all the pellets! Use arrow keys to move.</p>

      <div className="pacman-wrapper">
        <div className="pacman-stats">
          <div className="stat-box">
            <p className="stat-label">Score</p>
            <p className="stat-value">{gameState.score}</p>
          </div>
          <div className="stat-box">
            <p className="stat-label">Pellets</p>
            <p className="stat-value">{gameState.pelletsRemaining}</p>
          </div>
        </div>

        <div className="pacman-maze">
          {gameState.maze.map((row, y) => (
            <div key={y} className="maze-row">
              {row.map((cell, x) => {
                const isPacman = gameState.pacman.x === x && gameState.pacman.y === y
                const ghost = gameState.ghosts.find(g => g.x === x && g.y === y)
                const isPellet = cell === 0 && !isPacman && !ghost

                return (
                  <div
                    key={`${x}-${y}`}
                    className={`maze-cell ${cell === 1 ? 'wall' : 'path'}`}
                  >
                    {isPacman && <div className="pacman">●</div>}
                    {ghost && <div className="ghost" style={{ backgroundColor: ghost.color }}>👻</div>}
                    {isPellet && <div className="pellet">·</div>}
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        <div className="pacman-controls">
          <button
            className="control-button"
            onClick={togglePause}
            disabled={gameState.gameOver || gameState.won}
          >
            {gameState.paused ? '▶ Resume' : '⏸ Pause'}
          </button>
          <button className="control-button reset" onClick={resetGame}>
            🔄 New Game
          </button>
        </div>

        {gameState.gameOver && (
          <div className="pacman-message game-over">
            <p>Game Over!</p>
            <p className="message-score">Final Score: {gameState.score}</p>
          </div>
        )}

        {gameState.won && (
          <div className="pacman-message won">
            <p>You Won! 🎉</p>
            <p className="message-score">Final Score: {gameState.score}</p>
          </div>
        )}

        {gameState.paused && !gameState.gameOver && !gameState.won && (
          <div className="pacman-message paused">
            <p>Paused</p>
          </div>
        )}
      </div>

      <div className="pacman-instructions">
        <h2>How to Play</h2>
        <ul>
          <li>Use arrow keys to move Pac-Man through the maze</li>
          <li>Eat all the pellets to win</li>
          <li>Avoid the ghosts!</li>
          <li>Each pellet eaten gives you 10 points</li>
        </ul>
      </div>
    </div>
  )
}
