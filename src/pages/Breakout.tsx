import { useState, useEffect, useRef, useCallback } from 'react'
import './Breakout.css'

interface Ball {
  x: number
  y: number
  dx: number
  dy: number
  radius: number
}

interface Paddle {
  x: number
  y: number
  width: number
  height: number
}

interface Brick {
  x: number
  y: number
  width: number
  height: number
  active: boolean
  color: string
}

interface GameState {
  ball: Ball
  paddle: Paddle
  bricks: Brick[]
  score: number
  lives: number
  gameOver: boolean
  won: boolean
  paused: boolean
}

const CANVAS_WIDTH = 400
const CANVAS_HEIGHT = 500
const PADDLE_WIDTH = 80
const PADDLE_HEIGHT = 10
const BALL_RADIUS = 5
const BRICK_WIDTH = 75
const BRICK_HEIGHT = 15
const BRICK_ROWS = 4
const BRICK_COLS = 5

function createBricks(): Brick[] {
  const bricks: Brick[] = []
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A']
  
  for (let row = 0; row < BRICK_ROWS; row++) {
    for (let col = 0; col < BRICK_COLS; col++) {
      bricks.push({
        x: col * (BRICK_WIDTH + 5) + 10,
        y: row * (BRICK_HEIGHT + 5) + 30,
        width: BRICK_WIDTH,
        height: BRICK_HEIGHT,
        active: true,
        color: colors[row % colors.length],
      })
    }
  }
  return bricks
}

function initializeGame(): GameState {
  return {
    ball: {
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT - 60,
      dx: 3,
      dy: -3,
      radius: BALL_RADIUS,
    },
    paddle: {
      x: (CANVAS_WIDTH - PADDLE_WIDTH) / 2,
      y: CANVAS_HEIGHT - 20,
      width: PADDLE_WIDTH,
      height: PADDLE_HEIGHT,
    },
    bricks: createBricks(),
    score: 0,
    lives: 3,
    gameOver: false,
    won: false,
    paused: false,
  }
}

function checkCollision(ball: Ball, paddle: Paddle): boolean {
  return (
    ball.x + ball.radius > paddle.x &&
    ball.x - ball.radius < paddle.x + paddle.width &&
    ball.y + ball.radius > paddle.y &&
    ball.y - ball.radius < paddle.y + paddle.height
  )
}

function checkBrickCollision(ball: Ball, brick: Brick): boolean {
  return (
    ball.x + ball.radius > brick.x &&
    ball.x - ball.radius < brick.x + brick.width &&
    ball.y + ball.radius > brick.y &&
    ball.y - ball.radius < brick.y + brick.height
  )
}

export default function Breakout() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameState, setGameState] = useState<GameState>(initializeGame)
  const [mouseX, setMouseX] = useState(CANVAS_WIDTH / 2)
  const gameLoopRef = useRef<number | null>(null)

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      setMouseX(Math.max(0, Math.min(x, CANVAS_WIDTH)))
    }
  }, [])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect()
      const x = e.touches[0].clientX - rect.left
      setMouseX(Math.max(0, Math.min(x, CANVAS_WIDTH)))
    }
  }, [])

  const updateGame = useCallback((state: GameState): GameState => {
    if (state.gameOver || state.won || state.paused) return state

    const newState = { ...state }
    const ball = { ...newState.ball }
    const paddle = { ...newState.paddle }

    // Update paddle position
    paddle.x = Math.max(0, Math.min(mouseX - paddle.width / 2, CANVAS_WIDTH - paddle.width))

    // Update ball position
    ball.x += ball.dx
    ball.y += ball.dy

    // Wall collisions
    if (ball.x - ball.radius < 0 || ball.x + ball.radius > CANVAS_WIDTH) {
      ball.dx *= -1
      ball.x = Math.max(ball.radius, Math.min(CANVAS_WIDTH - ball.radius, ball.x))
    }

    if (ball.y - ball.radius < 0) {
      ball.dy *= -1
      ball.y = ball.radius
    }

    // Ball lost
    if (ball.y - ball.radius > CANVAS_HEIGHT) {
      newState.lives -= 1
      if (newState.lives <= 0) {
        newState.gameOver = true
      } else {
        ball.x = CANVAS_WIDTH / 2
        ball.y = CANVAS_HEIGHT - 60
        ball.dx = 3
        ball.dy = -3
      }
    }

    // Paddle collision
    if (checkCollision(ball, paddle)) {
      ball.dy *= -1
      const hitPos = (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2)
      ball.dx = hitPos * 5
      ball.y = paddle.y - ball.radius
    }

    // Brick collisions
    const bricks = newState.bricks.map(brick => {
      if (!brick.active) return brick
      if (checkBrickCollision(ball, brick)) {
        brick.active = false
        newState.score += 10
        ball.dy *= -1
        return brick
      }
      return brick
    })

    newState.bricks = bricks
    newState.ball = ball
    newState.paddle = paddle

    // Check win condition
    if (bricks.every(b => !b.active)) {
      newState.won = true
    }

    return newState
  }, [mouseX])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('touchmove', handleTouchMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [handleMouseMove, handleTouchMove])

  useEffect(() => {
    const gameLoop = () => {
      setGameState(prev => updateGame(prev))
      gameLoopRef.current = requestAnimationFrame(gameLoop)
    }
    gameLoopRef.current = requestAnimationFrame(gameLoop)
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current)
    }
  }, [updateGame])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = '#1a1a2e'
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    // Draw bricks
    gameState.bricks.forEach(brick => {
      if (brick.active) {
        ctx.fillStyle = brick.color
        ctx.fillRect(brick.x, brick.y, brick.width, brick.height)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
        ctx.lineWidth = 1
        ctx.strokeRect(brick.x, brick.y, brick.width, brick.height)
      }
    })

    // Draw paddle
    ctx.fillStyle = '#3b82f6'
    ctx.fillRect(gameState.paddle.x, gameState.paddle.y, gameState.paddle.width, gameState.paddle.height)
    ctx.strokeStyle = '#60a5fa'
    ctx.lineWidth = 2
    ctx.strokeRect(gameState.paddle.x, gameState.paddle.y, gameState.paddle.width, gameState.paddle.height)

    // Draw ball
    ctx.fillStyle = '#fbbf24'
    ctx.beginPath()
    ctx.arc(gameState.ball.x, gameState.ball.y, gameState.ball.radius, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#fcd34d'
    ctx.lineWidth = 2
    ctx.stroke()
  }, [gameState])

  const resetGame = () => {
    setGameState(initializeGame())
  }

  const togglePause = () => {
    setGameState(prev => ({ ...prev, paused: !prev.paused }))
  }

  return (
    <div className="breakout-container">
      <h1>Breakout</h1>
      <p className="breakout-description">Break all the bricks! Move your paddle with the mouse.</p>

      <div className="breakout-wrapper">
        <div className="breakout-stats">
          <div className="stat-box">
            <p className="stat-label">Score</p>
            <p className="stat-value">{gameState.score}</p>
          </div>
          <div className="stat-box">
            <p className="stat-label">Lives</p>
            <p className="stat-value">{gameState.lives}</p>
          </div>
        </div>

        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="breakout-canvas"
        />

        <div className="breakout-controls">
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
          <div className="breakout-message game-over">
            <p>Game Over!</p>
            <p className="message-score">Final Score: {gameState.score}</p>
          </div>
        )}

        {gameState.won && (
          <div className="breakout-message won">
            <p>You Won! 🎉</p>
            <p className="message-score">Final Score: {gameState.score}</p>
          </div>
        )}

        {gameState.paused && !gameState.gameOver && !gameState.won && (
          <div className="breakout-message paused">
            <p>Paused</p>
          </div>
        )}
      </div>

      <div className="breakout-instructions">
        <h2>How to Play</h2>
        <ul>
          <li>Move your paddle left and right to bounce the ball</li>
          <li>Break all the bricks to win</li>
          <li>Don't let the ball fall off the bottom</li>
          <li>You have 3 lives</li>
        </ul>
      </div>
    </div>
  )
}
