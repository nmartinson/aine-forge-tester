import { useState, useEffect, useCallback } from 'react'
import './Game2048.css'

type Board = number[][]

interface GameState {
  board: Board
  score: number
  gameOver: boolean
  won: boolean
  canMove: boolean
}

// Initialize a 4x4 board with two random tiles
function initializeBoard(): Board {
  const board = Array(4).fill(null).map(() => Array(4).fill(0))
  addNewTile(board)
  addNewTile(board)
  return board
}

// Add a new tile (2 or 4) at a random empty position
function addNewTile(board: Board): void {
  const emptyPositions: [number, number][] = []
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (board[i][j] === 0) {
        emptyPositions.push([i, j])
      }
    }
  }

  if (emptyPositions.length > 0) {
    const [row, col] = emptyPositions[Math.floor(Math.random() * emptyPositions.length)]
    board[row][col] = Math.random() < 0.9 ? 2 : 4
  }
}

// Move tiles in a direction and merge them
function move(board: Board, direction: 'left' | 'right' | 'up' | 'down'): { newBoard: Board; score: number; moved: boolean } {
  const newBoard = board.map(row => [...row])
  let score = 0
  let moved = false

  if (direction === 'left' || direction === 'right') {
    for (let i = 0; i < 4; i++) {
      const row = newBoard[i]
      const { newRow, rowScore, rowMoved } = moveAndMergeRow(row, direction === 'right')
      newBoard[i] = newRow
      score += rowScore
      if (rowMoved) moved = true
    }
  } else {
    for (let j = 0; j < 4; j++) {
      const column = [newBoard[0][j], newBoard[1][j], newBoard[2][j], newBoard[3][j]]
      const { newRow: newColumn, rowScore, rowMoved } = moveAndMergeRow(column, direction === 'down')
      for (let i = 0; i < 4; i++) {
        newBoard[i][j] = newColumn[i]
      }
      score += rowScore
      if (rowMoved) moved = true
    }
  }

  return { newBoard, score, moved }
}

// Move and merge a single row/column
function moveAndMergeRow(row: number[], reverse: boolean): { newRow: number[]; rowScore: number; rowMoved: boolean } {
  let workingRow = reverse ? [...row].reverse() : [...row]
  let rowScore = 0
  let rowMoved = false

  // Remove zeros
  workingRow = workingRow.filter(val => val !== 0)

  // Merge adjacent equal tiles
  for (let i = 0; i < workingRow.length - 1; i++) {
    if (workingRow[i] === workingRow[i + 1]) {
      workingRow[i] *= 2
      rowScore += workingRow[i]
      workingRow.splice(i + 1, 1)
    }
  }

  // Pad with zeros
  while (workingRow.length < 4) {
    workingRow.push(0)
  }

  // Check if row moved
  const originalRow = reverse ? [...row].reverse() : [...row]
  if (JSON.stringify(workingRow) !== JSON.stringify(originalRow)) {
    rowMoved = true
  }

  const newRow = reverse ? workingRow.reverse() : workingRow
  return { newRow, rowScore, rowMoved }
}

// Check if there are any valid moves left
function canMakeMove(board: Board): boolean {
  // Check for empty cells
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (board[i][j] === 0) return true
    }
  }

  // Check for possible merges
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const current = board[i][j]
      if ((j < 3 && current === board[i][j + 1]) || (i < 3 && current === board[i + 1][j])) {
        return true
      }
    }
  }

  return false
}

// Check if 2048 tile exists
function hasWon(board: Board): boolean {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (board[i][j] === 2048) return true
    }
  }
  return false
}

export default function Game2048() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const board = initializeBoard()
    return {
      board,
      score: 0,
      gameOver: false,
      won: false,
      canMove: true,
    }
  })

  const handleMove = useCallback((direction: 'left' | 'right' | 'up' | 'down') => {
    if (gameState.gameOver || gameState.won) return

    const { newBoard, score, moved } = move(gameState.board, direction)

    if (!moved) return

    const updatedBoard = [...newBoard]
    addNewTile(updatedBoard)

    const newScore = gameState.score + score
    const won = hasWon(updatedBoard)
    const canMove = canMakeMove(updatedBoard)
    const gameOver = !canMove && !won

    setGameState({
      board: updatedBoard,
      score: newScore,
      gameOver,
      won,
      canMove,
    })
  }, [gameState])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      handleMove('left')
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      handleMove('right')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      handleMove('up')
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      handleMove('down')
    }
  }, [handleMove])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const resetGame = () => {
    const board = initializeBoard()
    setGameState({
      board,
      score: 0,
      gameOver: false,
      won: false,
      canMove: true,
    })
  }

  const getTileColor = (value: number): string => {
    const colors: { [key: number]: string } = {
      2: '#eee4da',
      4: '#ede0c8',
      8: '#f2b179',
      16: '#f59563',
      32: '#f67c5f',
      64: '#f65e3b',
      128: '#edcf72',
      256: '#edcc61',
      512: '#edc850',
      1024: '#edc53f',
      2048: '#edc22e',
    }
    return colors[value] || '#3c3c2f'
  }

  const getTileTextColor = (value: number): string => {
    return value <= 4 ? '#776e65' : '#f9f6f2'
  }

  return (
    <div className="game-2048-container">
      <h1>2048</h1>
      <p className="game-2048-description">Combine tiles to reach 2048! Use arrow keys or buttons to move.</p>

      <div className="game-2048-wrapper">
        <div className="game-2048-stats">
          <div className="stat-box">
            <p className="stat-label">Score</p>
            <p className="stat-value">{gameState.score}</p>
          </div>
        </div>

        <div className="game-2048-board">
          {gameState.board.map((row, rowIdx) => (
            <div key={rowIdx} className="game-2048-row">
              {row.map((tile, colIdx) => (
                <div
                  key={`${rowIdx}-${colIdx}`}
                  className="game-2048-tile"
                  style={{
                    backgroundColor: tile === 0 ? 'rgba(0, 0, 0, 0.1)' : getTileColor(tile),
                    color: getTileTextColor(tile),
                  }}
                >
                  {tile !== 0 && <span className="tile-value">{tile}</span>}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="game-2048-controls">
          <div className="button-group">
            <button
              className="arrow-button up"
              onClick={() => handleMove('up')}
              disabled={gameState.gameOver || gameState.won}
              aria-label="Move up"
            >
              ↑
            </button>
          </div>
          <div className="button-group horizontal">
            <button
              className="arrow-button left"
              onClick={() => handleMove('left')}
              disabled={gameState.gameOver || gameState.won}
              aria-label="Move left"
            >
              ←
            </button>
            <button
              className="arrow-button down"
              onClick={() => handleMove('down')}
              disabled={gameState.gameOver || gameState.won}
              aria-label="Move down"
            >
              ↓
            </button>
            <button
              className="arrow-button right"
              onClick={() => handleMove('right')}
              disabled={gameState.gameOver || gameState.won}
              aria-label="Move right"
            >
              →
            </button>
          </div>
        </div>

        {gameState.won && (
          <div className="game-2048-message won">
            <p>🎉 You reached 2048!</p>
            <p className="message-score">Final Score: {gameState.score}</p>
          </div>
        )}

        {gameState.gameOver && (
          <div className="game-2048-message game-over">
            <p>Game Over!</p>
            <p className="message-score">Final Score: {gameState.score}</p>
          </div>
        )}

        <button className="reset-button" onClick={resetGame}>
          🔄 New Game
        </button>
      </div>

      <div className="game-2048-instructions">
        <h2>How to Play</h2>
        <ul>
          <li>Use arrow keys or buttons to move tiles</li>
          <li>When two tiles with the same number touch, they merge into one</li>
          <li>Each merge adds the tile value to your score</li>
          <li>Reach the 2048 tile to win!</li>
          <li>The game ends when no more moves are possible</li>
        </ul>
      </div>
    </div>
  )
}
