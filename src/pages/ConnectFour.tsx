import { useState } from 'react'
import './ConnectFour.css'

type Player = 'red' | 'yellow' | null

interface GameState {
  board: Player[][]
  currentPlayer: 'red' | 'yellow'
  winner: Player
  isDraw: boolean
}

const ROWS = 6
const COLS = 7

function ConnectFour() {
  const [gameState, setGameState] = useState<GameState>({
    board: Array(ROWS)
      .fill(null)
      .map(() => Array(COLS).fill(null)),
    currentPlayer: 'red',
    winner: null,
    isDraw: false,
  })

  const checkWinner = (board: Player[][]): Player => {
    // Check horizontal
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS - 3; col++) {
        const [a, b, c, d] = [
          board[row][col],
          board[row][col + 1],
          board[row][col + 2],
          board[row][col + 3],
        ]
        if (a && a === b && a === c && a === d) {
          return a
        }
      }
    }

    // Check vertical
    for (let col = 0; col < COLS; col++) {
      for (let row = 0; row < ROWS - 3; row++) {
        const [a, b, c, d] = [
          board[row][col],
          board[row + 1][col],
          board[row + 2][col],
          board[row + 3][col],
        ]
        if (a && a === b && a === c && a === d) {
          return a
        }
      }
    }

    // Check diagonal (bottom-left to top-right)
    for (let row = 3; row < ROWS; row++) {
      for (let col = 0; col < COLS - 3; col++) {
        const [a, b, c, d] = [
          board[row][col],
          board[row - 1][col + 1],
          board[row - 2][col + 2],
          board[row - 3][col + 3],
        ]
        if (a && a === b && a === c && a === d) {
          return a
        }
      }
    }

    // Check diagonal (top-left to bottom-right)
    for (let row = 0; row < ROWS - 3; row++) {
      for (let col = 0; col < COLS - 3; col++) {
        const [a, b, c, d] = [
          board[row][col],
          board[row + 1][col + 1],
          board[row + 2][col + 2],
          board[row + 3][col + 3],
        ]
        if (a && a === b && a === c && a === d) {
          return a
        }
      }
    }

    return null
  }

  const isBoardFull = (board: Player[][]): boolean => {
    return board.every((row) => row.every((cell) => cell !== null))
  }

  const dropPiece = (col: number) => {
    if (gameState.winner || gameState.isDraw) {
      return
    }

    const newBoard = gameState.board.map((row) => [...row])

    // Find the lowest empty row in the column
    let row = ROWS - 1
    while (row >= 0 && newBoard[row][col] !== null) {
      row--
    }

    if (row < 0) {
      // Column is full
      return
    }

    newBoard[row][col] = gameState.currentPlayer

    const winner = checkWinner(newBoard)
    const isFull = isBoardFull(newBoard)
    const isDraw = isFull && !winner

    setGameState({
      board: newBoard,
      currentPlayer: gameState.currentPlayer === 'red' ? 'yellow' : 'red',
      winner: winner,
      isDraw: isDraw,
    })
  }

  const resetGame = () => {
    setGameState({
      board: Array(ROWS)
        .fill(null)
        .map(() => Array(COLS).fill(null)),
      currentPlayer: 'red',
      winner: null,
      isDraw: false,
    })
  }

  const getStatus = () => {
    if (gameState.winner) {
      const playerName = gameState.winner === 'red' ? 'Red' : 'Yellow'
      return `🎉 ${playerName} wins!`
    }
    if (gameState.isDraw) {
      return "🤝 It's a draw!"
    }
    const playerName = gameState.currentPlayer === 'red' ? 'Red' : 'Yellow'
    return `Current Player: ${playerName}`
  }

  return (
    <div className="connect-four-container">
      <div className="connect-four-content">
        <h1>Connect Four</h1>
        <p className="subtitle">Get four in a row to win!</p>

        <div className="game-wrapper">
          <div className="status-bar">
            <p className="status">{getStatus()}</p>
          </div>

          <div className="board">
            {gameState.board.map((row, rowIndex) => (
              <div key={rowIndex} className="board-row">
                {row.map((cell, colIndex) => (
                  <button
                    key={`${rowIndex}-${colIndex}`}
                    className={`cell ${cell ? cell : ''}`}
                    onClick={() => dropPiece(colIndex)}
                    disabled={gameState.winner !== null || gameState.isDraw}
                    aria-label={`Row ${rowIndex}, Column ${colIndex}`}
                  >
                    {cell && <div className={`piece ${cell}`} />}
                  </button>
                ))}
              </div>
            ))}
          </div>

          <div className="column-indicators">
            {Array(COLS)
              .fill(null)
              .map((_, col) => (
                <button
                  key={col}
                  className="column-button"
                  onClick={() => dropPiece(col)}
                  disabled={gameState.winner !== null || gameState.isDraw}
                  aria-label={`Drop piece in column ${col + 1}`}
                >
                  ⬇️
                </button>
              ))}
          </div>

          <button className="reset-button" onClick={resetGame}>
            🔄 New Game
          </button>
        </div>

        <div className="instructions">
          <h2>How to Play</h2>
          <ul>
            <li>Players take turns dropping pieces from the top</li>
            <li>Red goes first</li>
            <li>Pieces fall to the lowest available position in the column</li>
            <li>Get four pieces in a row (horizontally, vertically, or diagonally) to win</li>
            <li>Click the down arrow or a cell to drop a piece in that column</li>
            <li>Click "New Game" to start over</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ConnectFour
