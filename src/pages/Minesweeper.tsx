import { useState, useCallback } from 'react'
import './Minesweeper.css'

const ROWS = 9
const COLS = 9
const MINES = 10

interface Cell {
  isMine: boolean
  isRevealed: boolean
  isFlagged: boolean
  neighborCount: number
}

type GameStatus = 'idle' | 'playing' | 'won' | 'lost'

function createEmptyBoard(): Cell[][] {
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      neighborCount: 0,
    }))
  )
}

function placeMines(board: Cell[][], firstRow: number, firstCol: number): Cell[][] {
  const newBoard = board.map((row) => row.map((cell) => ({ ...cell })))
  let placed = 0

  while (placed < MINES) {
    const r = Math.floor(Math.random() * ROWS)
    const c = Math.floor(Math.random() * COLS)
    if (!newBoard[r][c].isMine && !(r === firstRow && c === firstCol)) {
      newBoard[r][c].isMine = true
      placed++
    }
  }

  // Calculate neighbor counts
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (!newBoard[r][c].isMine) {
        let count = 0
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr
            const nc = c + dc
            if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && newBoard[nr][nc].isMine) {
              count++
            }
          }
        }
        newBoard[r][c].neighborCount = count
      }
    }
  }

  return newBoard
}

function revealCells(board: Cell[][], row: number, col: number): Cell[][] {
  const newBoard = board.map((r) => r.map((cell) => ({ ...cell })))
  const stack: [number, number][] = [[row, col]]

  while (stack.length > 0) {
    const [r, c] = stack.pop()!
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) continue
    const cell = newBoard[r][c]
    if (cell.isRevealed || cell.isFlagged || cell.isMine) continue
    cell.isRevealed = true
    if (cell.neighborCount === 0) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr !== 0 || dc !== 0) {
            stack.push([r + dr, c + dc])
          }
        }
      }
    }
  }

  return newBoard
}

function checkWin(board: Cell[][]): boolean {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = board[r][c]
      if (!cell.isMine && !cell.isRevealed) return false
    }
  }
  return true
}

const NEIGHBOR_COLORS: Record<number, string> = {
  1: '#3b82f6',
  2: '#10b981',
  3: '#ef4444',
  4: '#8b5cf6',
  5: '#f59e0b',
  6: '#06b6d4',
  7: '#f97316',
  8: '#94a3b8',
}

function Minesweeper() {
  const [board, setBoard] = useState<Cell[][]>(createEmptyBoard)
  const [status, setStatus] = useState<GameStatus>('idle')
  const [flagCount, setFlagCount] = useState(0)

  const resetGame = useCallback(() => {
    setBoard(createEmptyBoard())
    setStatus('idle')
    setFlagCount(0)
  }, [])

  const handleReveal = useCallback(
    (row: number, col: number) => {
      if (status === 'won' || status === 'lost') return
      const cell = board[row][col]
      if (cell.isRevealed || cell.isFlagged) return

      let currentBoard = board

      if (status === 'idle') {
        currentBoard = placeMines(board, row, col)
        setStatus('playing')
      }

      if (currentBoard[row][col].isMine) {
        // Reveal all mines
        const revealedBoard = currentBoard.map((r) =>
          r.map((c) => (c.isMine ? { ...c, isRevealed: true } : { ...c }))
        )
        setBoard(revealedBoard)
        setStatus('lost')
        return
      }

      const newBoard = revealCells(currentBoard, row, col)
      setBoard(newBoard)
      if (checkWin(newBoard)) {
        setStatus('won')
      }
    },
    [board, status]
  )

  const handleFlag = useCallback(
    (e: React.MouseEvent, row: number, col: number) => {
      e.preventDefault()
      if (status === 'won' || status === 'lost') return
      const cell = board[row][col]
      if (cell.isRevealed) return

      const newBoard = board.map((r) => r.map((c) => ({ ...c })))
      const toggled = !newBoard[row][col].isFlagged
      newBoard[row][col].isFlagged = toggled
      setBoard(newBoard)
      setFlagCount((prev) => prev + (toggled ? 1 : -1))
    },
    [board, status]
  )

  const getStatus = () => {
    if (status === 'won') return '🎉 You cleared the minefield!'
    if (status === 'lost') return '💥 Boom! You hit a mine!'
    if (status === 'idle') return 'Click any cell to start'
    return `Mines remaining: ${MINES - flagCount}`
  }

  return (
    <div className="minesweeper-container">
      <div className="minesweeper-content">
        <h1>Minesweeper</h1>
        <p className="subtitle">Clear the board without hitting a mine!</p>

        <div className="game-wrapper">
          <div className="status-bar">
            <p className="status" data-testid="game-status">{getStatus()}</p>
          </div>

          <div
            className="ms-board"
            style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}
          >
            {board.map((row, r) =>
              row.map((cell, c) => {
                let cellClass = 'ms-cell'
                if (cell.isRevealed) cellClass += ' revealed'
                if (cell.isMine && cell.isRevealed) cellClass += ' mine'
                if (!cell.isRevealed && !cell.isFlagged) cellClass += ' hidden'

                let content: React.ReactNode = null
                if (cell.isFlagged && !cell.isRevealed) {
                  content = '🚩'
                } else if (cell.isRevealed && cell.isMine) {
                  content = '💣'
                } else if (cell.isRevealed && cell.neighborCount > 0) {
                  content = (
                    <span style={{ color: NEIGHBOR_COLORS[cell.neighborCount] }}>
                      {cell.neighborCount}
                    </span>
                  )
                }

                return (
                  <button
                    key={`${r}-${c}`}
                    className={cellClass}
                    onClick={() => handleReveal(r, c)}
                    onContextMenu={(e) => handleFlag(e, r, c)}
                    aria-label={
                      cell.isFlagged
                        ? `Flagged cell at row ${r + 1} column ${c + 1}`
                        : cell.isRevealed
                        ? `Revealed cell at row ${r + 1} column ${c + 1}`
                        : `Hidden cell at row ${r + 1} column ${c + 1}`
                    }
                    disabled={cell.isRevealed}
                  >
                    {content}
                  </button>
                )
              })
            )}
          </div>

          <div className="ms-info">
            <span>💣 {MINES} mines</span>
            <span>🚩 {flagCount} flagged</span>
            <span>📐 {ROWS}×{COLS}</span>
          </div>

          <button className="reset-button" onClick={resetGame}>
            🔄 New Game
          </button>
        </div>

        <div className="instructions">
          <h2>How to Play</h2>
          <ul>
            <li>Left-click a cell to reveal it</li>
            <li>Right-click a cell to place or remove a flag</li>
            <li>Numbers show how many mines are adjacent to that cell</li>
            <li>Reveal all non-mine cells to win</li>
            <li>The first click is always safe</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Minesweeper
