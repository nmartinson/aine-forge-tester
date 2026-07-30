import { useState, useEffect } from 'react'
import './Minesweeper.css'

interface Cell {
  isMine: boolean
  isRevealed: boolean
  isFlagged: boolean
  neighborMines: number
}

type Board = Cell[][]

interface GameState {
  board: Board
  gameOver: boolean
  won: boolean
  mineCount: number
  flagCount: number
  timer: number
  isFirstClick: boolean
}

const ROWS = 10
const COLS = 10
const MINE_COUNT = 15

function Minesweeper() {
  const [gameState, setGameState] = useState<GameState>({
    board: createEmptyBoard(),
    gameOver: false,
    won: false,
    mineCount: MINE_COUNT,
    flagCount: 0,
    timer: 0,
    isFirstClick: true,
  })

  // Timer effect
  useEffect(() => {
    if (!gameState.isFirstClick && !gameState.gameOver && !gameState.won) {
      const interval = setInterval(() => {
        setGameState(prev => ({ ...prev, timer: prev.timer + 1 }))
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [gameState.isFirstClick, gameState.gameOver, gameState.won])

  function createEmptyBoard(): Board {
    return Array(ROWS).fill(null).map(() =>
      Array(COLS).fill(null).map(() => ({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborMines: 0,
      }))
    )
  }

  function initializeBoard(firstRow: number, firstCol: number): Board {
    const board = createEmptyBoard()
    
    // Place mines randomly, avoiding first click position
    let minesPlaced = 0
    while (minesPlaced < MINE_COUNT) {
      const row = Math.floor(Math.random() * ROWS)
      const col = Math.floor(Math.random() * COLS)
      
      // Don't place mine on first click or if already a mine
      if ((row === firstRow && col === firstCol) || board[row][col].isMine) {
        continue
      }
      
      board[row][col].isMine = true
      minesPlaced++
    }
    
    // Calculate neighbor mine counts
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        if (!board[row][col].isMine) {
          board[row][col].neighborMines = countNeighborMines(board, row, col)
        }
      }
    }
    
    return board
  }

  function countNeighborMines(board: Board, row: number, col: number): number {
    let count = 0
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue
        const newRow = row + dr
        const newCol = col + dc
        if (newRow >= 0 && newRow < ROWS && newCol >= 0 && newCol < COLS) {
          if (board[newRow][newCol].isMine) count++
        }
      }
    }
    return count
  }

  function revealCell(row: number, col: number) {
    if (gameState.gameOver || gameState.won) return
    
    const newBoard = gameState.board.map(r => r.map(c => ({ ...c })))
    
    // Initialize board on first click
    if (gameState.isFirstClick) {
      const initializedBoard = initializeBoard(row, col)
      setGameState(prev => ({
        ...prev,
        board: initializedBoard,
        isFirstClick: false,
      }))
      // Reveal the first cell after initialization
      setTimeout(() => revealCell(row, col), 0)
      return
    }
    
    const cell = newBoard[row][col]
    
    if (cell.isRevealed || cell.isFlagged) return
    
    cell.isRevealed = true
    
    // Hit a mine - game over
    if (cell.isMine) {
      // Reveal all mines
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          if (newBoard[r][c].isMine) {
            newBoard[r][c].isRevealed = true
          }
        }
      }
      setGameState(prev => ({
        ...prev,
        board: newBoard,
        gameOver: true,
      }))
      return
    }
    
    // If no neighbor mines, reveal adjacent cells recursively
    if (cell.neighborMines === 0) {
      revealAdjacentCells(newBoard, row, col)
    }
    
    // Check for win condition
    const won = checkWinCondition(newBoard)
    
    setGameState(prev => ({
      ...prev,
      board: newBoard,
      won,
    }))
  }

  function revealAdjacentCells(board: Board, row: number, col: number) {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue
        const newRow = row + dr
        const newCol = col + dc
        if (newRow >= 0 && newRow < ROWS && newCol >= 0 && newCol < COLS) {
          const cell = board[newRow][newCol]
          if (!cell.isRevealed && !cell.isFlagged && !cell.isMine) {
            cell.isRevealed = true
            if (cell.neighborMines === 0) {
              revealAdjacentCells(board, newRow, newCol)
            }
          }
        }
      }
    }
  }

  function toggleFlag(e: React.MouseEvent, row: number, col: number) {
    e.preventDefault()
    
    if (gameState.gameOver || gameState.won || gameState.isFirstClick) return
    
    const newBoard = gameState.board.map(r => r.map(c => ({ ...c })))
    const cell = newBoard[row][col]
    
    if (cell.isRevealed) return
    
    cell.isFlagged = !cell.isFlagged
    const newFlagCount = gameState.flagCount + (cell.isFlagged ? 1 : -1)
    
    setGameState(prev => ({
      ...prev,
      board: newBoard,
      flagCount: newFlagCount,
    }))
  }

  function checkWinCondition(board: Board): boolean {
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const cell = board[row][col]
        // If a non-mine cell is not revealed, game is not won
        if (!cell.isMine && !cell.isRevealed) {
          return false
        }
      }
    }
    return true
  }

  function resetGame() {
    setGameState({
      board: createEmptyBoard(),
      gameOver: false,
      won: false,
      mineCount: MINE_COUNT,
      flagCount: 0,
      timer: 0,
      isFirstClick: true,
    })
  }

  function getCellContent(cell: Cell): string {
    if (cell.isFlagged) return '🚩'
    if (!cell.isRevealed) return ''
    if (cell.isMine) return '💣'
    if (cell.neighborMines === 0) return ''
    return cell.neighborMines.toString()
  }

  function getCellClass(cell: Cell): string {
    const classes = ['cell']
    if (cell.isRevealed) {
      classes.push('revealed')
      if (cell.isMine) {
        classes.push('mine')
      } else if (cell.neighborMines > 0) {
        classes.push(`number-${cell.neighborMines}`)
      }
    }
    if (cell.isFlagged) classes.push('flagged')
    return classes.join(' ')
  }

  return (
    <div className="minesweeper-container">
      <div className="minesweeper-content">
        <h1>Minesweeper</h1>
        <p className="subtitle">Clear the board without hitting any mines!</p>

        <div className="game-wrapper">
          <div className="game-header">
            <div className="info-panel">
              <div className="info-item">
                <span className="info-icon">💣</span>
                <span className="info-value">{gameState.mineCount - gameState.flagCount}</span>
              </div>
              <div className="info-item">
                <span className="info-icon">⏱️</span>
                <span className="info-value">{gameState.timer}s</span>
              </div>
            </div>
            
            {gameState.gameOver && (
              <div className="status-message game-over">
                💥 Game Over! You hit a mine!
              </div>
            )}
            
            {gameState.won && (
              <div className="status-message won">
                🎉 You Won! All mines cleared in {gameState.timer} seconds!
              </div>
            )}
          </div>

          <div className="board">
            {gameState.board.map((row, rowIndex) => (
              <div key={rowIndex} className="board-row">
                {row.map((cell, colIndex) => (
                  <button
                    key={`${rowIndex}-${colIndex}`}
                    className={getCellClass(cell)}
                    onClick={() => revealCell(rowIndex, colIndex)}
                    onContextMenu={(e) => toggleFlag(e, rowIndex, colIndex)}
                    disabled={gameState.gameOver || gameState.won}
                  >
                    {getCellContent(cell)}
                  </button>
                ))}
              </div>
            ))}
          </div>

          <button className="reset-button" onClick={resetGame}>
            🔄 New Game
          </button>
        </div>

        <div className="instructions">
          <h2>How to Play</h2>
          <ul>
            <li>Left-click to reveal a cell</li>
            <li>Right-click to place/remove a flag on suspected mines</li>
            <li>Numbers show how many mines are adjacent to that cell</li>
            <li>Reveal all non-mine cells to win</li>
            <li>Hit a mine and it's game over!</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Minesweeper
