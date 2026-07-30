import { useState, useEffect } from 'react'
import './Sudoku.css'

type SudokuBoard = (number | null)[][]
type SudokuSolution = number[][]

interface SudokuGame {
  board: SudokuBoard
  solution: SudokuSolution
  selected: [number, number] | null
  mistakes: number
  completed: boolean
}

// Generate a valid Sudoku puzzle
function generateSudokuPuzzle(): { board: SudokuBoard; solution: SudokuSolution } {
  const solution = generateSolution()
  const board = JSON.parse(JSON.stringify(solution)) as SudokuBoard
  
  // Remove numbers to create puzzle (remove ~50 cells for medium difficulty)
  let removed = 0
  while (removed < 50) {
    const row = Math.floor(Math.random() * 9)
    const col = Math.floor(Math.random() * 9)
    if (board[row][col] !== null) {
      board[row][col] = null
      removed++
    }
  }
  
  return { board, solution }
}

function generateSolution(): SudokuSolution {
  const board: SudokuSolution = Array(9).fill(null).map(() => Array(9).fill(0))
  fillSudoku(board)
  return board
}

function fillSudoku(board: SudokuSolution): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5)
        for (const num of numbers) {
          if (isValidPlacement(board, row, col, num)) {
            board[row][col] = num
            if (fillSudoku(board)) {
              return true
            }
            board[row][col] = 0
          }
        }
        return false
      }
    }
  }
  return true
}

function isValidPlacement(board: SudokuSolution, row: number, col: number, num: number): boolean {
  // Check row
  for (let c = 0; c < 9; c++) {
    if (board[row][c] === num) return false
  }
  
  // Check column
  for (let r = 0; r < 9; r++) {
    if (board[r][col] === num) return false
  }
  
  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3
  const boxCol = Math.floor(col / 3) * 3
  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if (board[r][c] === num) return false
    }
  }
  
  return true
}

function isBoardValid(board: SudokuBoard, solution: SudokuSolution): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] !== null && board[row][col] !== solution[row][col]) {
        return false
      }
    }
  }
  return true
}

function isBoardComplete(board: SudokuBoard): boolean {
  return board.every(row => row.every(cell => cell !== null))
}

export default function Sudoku() {
  const [game, setGame] = useState<SudokuGame>(() => {
    const { board, solution } = generateSudokuPuzzle()
    return {
      board,
      solution,
      selected: null,
      mistakes: 0,
      completed: false,
    }
  })

  const [initialBoard] = useState<SudokuBoard>(() => {
    const { board } = generateSudokuPuzzle()
    return board
  })

  useEffect(() => {
    const { board, solution } = generateSudokuPuzzle()
    setGame({
      board,
      solution,
      selected: null,
      mistakes: 0,
      completed: false,
    })
  }, [])

  const handleCellClick = (row: number, col: number) => {
    if (initialBoard[row][col] === null) {
      setGame(prev => ({
        ...prev,
        selected: [row, col],
      }))
    }
  }

  const handleNumberInput = (num: number) => {
    if (!game.selected) return

    const [row, col] = game.selected
    if (initialBoard[row][col] !== null) return

    const newBoard = game.board.map(r => [...r])
    newBoard[row][col] = num

    const isValid = isBoardValid(newBoard, game.solution)
    const newMistakes = isValid ? game.mistakes : game.mistakes + 1
    const isComplete = isBoardComplete(newBoard) && isValid

    setGame(prev => ({
      ...prev,
      board: newBoard,
      mistakes: newMistakes,
      completed: isComplete,
    }))
  }

  const handleClear = () => {
    if (!game.selected) return

    const [row, col] = game.selected
    if (initialBoard[row][col] !== null) return

    const newBoard = game.board.map(r => [...r])
    newBoard[row][col] = null

    setGame(prev => ({
      ...prev,
      board: newBoard,
    }))
  }

  const handleReset = () => {
    const { board, solution } = generateSudokuPuzzle()
    setGame({
      board,
      solution,
      selected: null,
      mistakes: 0,
      completed: false,
    })
  }

  return (
    <div className="sudoku-container">
      <h1>Sudoku</h1>
      <p className="sudoku-description">Fill the grid so that every row, column, and 3×3 box contains the digits 1–9.</p>
      
      <div className="sudoku-game">
        <div className="sudoku-board">
          {game.board.map((row, rowIdx) => (
            <div key={rowIdx} className="sudoku-row">
              {row.map((cell, colIdx) => {
                const isSelected = game.selected && game.selected[0] === rowIdx && game.selected[1] === colIdx
                const isInitial = initialBoard[rowIdx][colIdx] !== null
                const isInvalid = !isBoardValid(game.board, game.solution)
                
                return (
                  <button
                    key={`${rowIdx}-${colIdx}`}
                    className={`sudoku-cell ${isSelected ? 'selected' : ''} ${isInitial ? 'initial' : ''} ${isInvalid ? 'invalid' : ''}`}
                    onClick={() => handleCellClick(rowIdx, colIdx)}
                    disabled={isInitial}
                  >
                    {cell}
                  </button>
                )
              })}
            </div>
          ))}
        </div>

        <div className="sudoku-controls">
          <div className="sudoku-stats">
            <p>Mistakes: <span className="mistakes-count">{game.mistakes}</span></p>
            {game.completed && <p className="completed-message">✓ Puzzle Solved!</p>}
          </div>

          <div className="sudoku-input">
            <p>Enter numbers:</p>
            <div className="number-buttons">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <button
                  key={num}
                  className="number-btn"
                  onClick={() => handleNumberInput(num)}
                  disabled={!game.selected}
                >
                  {num}
                </button>
              ))}
            </div>
            <button className="clear-btn" onClick={handleClear} disabled={!game.selected}>
              Clear
            </button>
          </div>

          <button className="reset-btn" onClick={handleReset}>
            New Game
          </button>
        </div>
      </div>
    </div>
  )
}
