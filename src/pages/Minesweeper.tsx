import { useState, useCallback } from 'react'
import './Minesweeper.css'

type CellState = 'hidden' | 'revealed' | 'flagged'

interface Cell {
  isMine: boolean
  adjacentMines: number
  state: CellState
}

type GameStatus = 'idle' | 'playing' | 'won' | 'lost'

const ROWS = 9
const COLS = 9
const MINE_COUNT = 10

function createEmptyBoard(): Cell[][] {
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({
      isMine: false,
      adjacentMines: 0,
      state: 'hidden' as CellState,
    }))
  )
}

function placeMines(board: Cell[][], firstRow: number, firstCol: number): Cell[][] {
  const newBoard = board.map((row) => row.map((cell) => ({ ...cell })))
  let placed = 0

  while (placed < MINE_COUNT) {
    const r = Math.floor(Math.random() * ROWS)
    const c = Math.floor(Math.random() * COLS)
    // Avoid placing a mine on the first clicked cell or its neighbours
    if (
      !newBoard[r][c].isMine &&
      (Math.abs(r - firstRow) > 1 || Math.abs(c - firstCol) > 1)
    ) {
      newBoard[r][c].isMine = true
      placed++
    }
  }

  // Calculate adjacent mine counts
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
        newBoard[r][c].adjacentMines = count
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
    if (cell.state !== 'hidden') continue
    cell.state = 'revealed'
    if (cell.adjacentMines === 0 && !cell.isMine) {
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
      if (!cell.isMine && cell.state !== 'revealed') return false
    }
  }
  return true
}

const NUMBER_COLORS: Record<number, string> = {
  1: '#3b82f6',
  2: '#10b981',
  3: '#ef4444',
  4: '#8b5cf6',
  5: '#f59e0b',
  6: '#06b6d4',
  7: '#f97316',
  8: '#ec4899',
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
      if (cell.state !== 'hidden') return

      let currentBoard = board

      if (status === 'idle') {
        currentBoard = placeMines(board, row, col)
        setStatus('playing')
      }

      if (currentBoard[row][col].isMine) {
        // Reveal all mines
        const revealedBoard = currentBoard.map((r) =>
          r.map((c) => (c.isMine ? { ...c, state: 'revealed' as CellState } : { ...c }))
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
      if (status === 'won' || status === 'lost' || status === 'idle') return
      const cell = board[row][col]
      if (cell.state === 'revealed') return

      const newBoard = board.map((r) => r.map((c) => ({ ...c })))
      if (newBoard[row][col].state === 'hidden') {
        newBoard[row][col].state = 'flagged'
        setFlagCount((f) => f + 1)
      } else {
        newBoard[row][col].state = 'hidden'
        setFlagCount((f) => f - 1)
      }
      setBoard(newBoard)
    },
    [board, status]
  )

  const getStatusMessage = () => {
    if (status === 'won') return '🎉 You win! All mines cleared!'
    if (status === 'lost') return '💥 Boom! You hit a mine!'
    if (status === 'idle') return '🖱️ Click any cell to start'
    return `🚩 ${flagCount} / ${MINE_COUNT} mines flagged`
  }

  const getCellContent = (cell: Cell) => {
    if (cell.state === 'flagged') return '🚩'
    if (cell.state === 'hidden') return ''
    if (cell.isMine) return '💣'
    if (cell.adjacentMines > 0) return String(cell.adjacentMines)
    return ''
  }

  const getCellStyle = (cell: Cell): React.CSSProperties => {
    if (cell.state === 'revealed' && !cell.isMine && cell.adjacentMines > 0) {
      return { color: NUMBER_COLORS[cell.adjacentMines] ?? 'var(--text-color)' }
    }
    return {}
  }

  return (
    <div className="minesweeper-container">
      <div className="minesweeper-content">
        <h1>Minesweeper</h1>
        <p className="subtitle">Clear the minefield without triggering any bombs!</p>

        <div className="game-wrapper">
          <div className="status-bar">
            <p className="status">{getStatusMessage()}</p>
          </div>

          <div
            className="ms-board"
            style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}
          >
            {board.map((row, r) =>
              row.map((cell, c) => (
                <button
                  key={`${r}-${c}`}
                  className={[
                    'ms-cell',
                    cell.state === 'revealed' ? 'revealed' : '',
                    cell.state === 'revealed' && cell.isMine ? 'mine' : '',
                    cell.state === 'flagged' ? 'flagged' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => handleReveal(r, c)}
                  onContextMenu={(e) => handleFlag(e, r, c)}
                  disabled={status === 'won' || status === 'lost'}
                  aria-label={`Cell row ${r + 1} column ${c + 1}`}
                  style={getCellStyle(cell)}
                >
                  {getCellContent(cell)}
                </button>
              ))
            )}
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
            <li>The first click is always safe!</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Minesweeper
