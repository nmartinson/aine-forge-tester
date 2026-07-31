import { useState, useEffect } from 'react'
import './Minesweeper.css'

type CellState = 'hidden' | 'revealed' | 'flagged'

interface Cell {
  isMine: boolean
  state: CellState
  adjacentMines: number
}

interface GameState {
  board: Cell[][]
  gameOver: boolean
  won: boolean
  minesRemaining: number
}

const ROWS = 8
const COLS = 8
const MINES = 10

function Minesweeper() {
  const [gameState, setGameState] = useState<GameState | null>(null)

  // Initialize the game
  useEffect(() => {
    initializeGame()
  }, [])

  const initializeGame = () => {
    const board: Cell[][] = Array(ROWS)
      .fill(null)
      .map(() =>
        Array(COLS)
          .fill(null)
          .map(() => ({
            isMine: false,
            state: 'hidden' as CellState,
            adjacentMines: 0,
          }))
      )

    // Place mines randomly
    let minesPlaced = 0
    while (minesPlaced < MINES) {
      const row = Math.floor(Math.random() * ROWS)
      const col = Math.floor(Math.random() * COLS)
      if (!board[row][col].isMine) {
        board[row][col].isMine = true
        minesPlaced++
      }
    }

    // Calculate adjacent mines
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        if (!board[row][col].isMine) {
          let count = 0
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const newRow = row + dr
              const newCol = col + dc
              if (
                newRow >= 0 &&
                newRow < ROWS &&
                newCol >= 0 &&
                newCol < COLS &&
                board[newRow][newCol].isMine
              ) {
                count++
              }
            }
          }
          board[row][col].adjacentMines = count
        }
      }
    }

    setGameState({
      board,
      gameOver: false,
      won: false,
      minesRemaining: MINES,
    })
  }

  const revealCell = (row: number, col: number) => {
    if (!gameState || gameState.gameOver || gameState.won) return

    const newBoard = gameState.board.map((r) => [...r])
    const cell = newBoard[row][col]

    if (cell.state !== 'hidden') return

    if (cell.isMine) {
      // Game over - reveal all mines
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          if (newBoard[r][c].isMine) {
            newBoard[r][c].state = 'revealed'
          }
        }
      }
      setGameState({
        ...gameState,
        board: newBoard,
        gameOver: true,
      })
      return
    }

    // Flood fill for empty cells
    const flood = (r: number, c: number) => {
      if (
        r < 0 ||
        r >= ROWS ||
        c < 0 ||
        c >= COLS ||
        newBoard[r][c].state !== 'hidden'
      ) {
        return
      }

      newBoard[r][c].state = 'revealed'

      if (newBoard[r][c].adjacentMines === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            flood(r + dr, c + dc)
          }
        }
      }
    }

    flood(row, col)

    // Check if won
    let revealedCount = 0
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (newBoard[r][c].state === 'revealed') {
          revealedCount++
        }
      }
    }

    const won = revealedCount === ROWS * COLS - MINES

    setGameState({
      ...gameState,
      board: newBoard,
      won,
    })
  }

  const toggleFlag = (row: number, col: number, e: React.MouseEvent) => {
    e.preventDefault()
    if (!gameState || gameState.gameOver || gameState.won) return

    const newBoard = gameState.board.map((r) => [...r])
    const cell = newBoard[row][col]

    if (cell.state === 'revealed') return

    if (cell.state === 'hidden') {
      cell.state = 'flagged'
      setGameState({
        ...gameState,
        board: newBoard,
        minesRemaining: gameState.minesRemaining - 1,
      })
    } else if (cell.state === 'flagged') {
      cell.state = 'hidden'
      setGameState({
        ...gameState,
        board: newBoard,
        minesRemaining: gameState.minesRemaining + 1,
      })
    }
  }

  const getStatus = () => {
    if (!gameState) return 'Loading...'
    if (gameState.won) return '🎉 You won!'
    if (gameState.gameOver) return '💣 Game Over!'
    return `Mines remaining: ${gameState.minesRemaining}`
  }

  if (!gameState) {
    return <div className="minesweeper-container">Loading...</div>
  }

  return (
    <div className="minesweeper-container">
      <div className="minesweeper-content">
        <h1>Minesweeper</h1>
        <p className="subtitle">Find all the safe cells without hitting a mine!</p>

        <div className="game-wrapper">
          <div className="status-bar">
            <p className="status">{getStatus()}</p>
          </div>

          <div className="board">
            {gameState.board.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  className={`cell ${cell.state} ${
                    cell.state === 'revealed' && cell.isMine ? 'mine' : ''
                  }`}
                  onClick={() => revealCell(rowIndex, colIndex)}
                  onContextMenu={(e) => toggleFlag(rowIndex, colIndex, e)}
                >
                  {cell.state === 'revealed' && !cell.isMine && cell.adjacentMines > 0
                    ? cell.adjacentMines
                    : cell.state === 'revealed' && cell.isMine
                      ? '💣'
                      : cell.state === 'flagged'
                        ? '🚩'
                        : ''}
                </button>
              ))
            )}
          </div>

          <button className="reset-button" onClick={initializeGame}>
            🔄 New Game
          </button>
        </div>

        <div className="instructions">
          <h2>How to Play</h2>
          <ul>
            <li>Click on cells to reveal them</li>
            <li>Right-click to place or remove flags</li>
            <li>Numbers show how many mines are adjacent to that cell</li>
            <li>Reveal all non-mine cells to win</li>
            <li>Avoid clicking on mines!</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Minesweeper
