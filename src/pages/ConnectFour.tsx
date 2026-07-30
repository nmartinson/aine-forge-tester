import { useState } from 'react'
import './ConnectFour.css'

type Player = 'red' | 'yellow' | null
type Board = Player[][]

interface GameState {
  board: Board
  currentPlayer: 'red' | 'yellow'
  gameOver: boolean
  winner: Player
  message: string
}

const ROWS = 6
const COLS = 7

function ConnectFour() {
  const [gameState, setGameState] = useState<GameState>({
    board: Array(ROWS).fill(null).map(() => Array(COLS).fill(null)),
    currentPlayer: 'red',
    gameOver: false,
    winner: null,
    message: '🔴 Red Player\'s Turn',
  })

  const checkWinner = (board: Board): Player => {
    // Check horizontal
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS - 3; col++) {
        const [a, b, c, d] = [
          board[row][col],
          board[row][col + 1],
          board[row][col + 2],
          board[row][col + 3],
        ]
        if (a && a === b && b === c && c === d) return a
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
        if (a && a === b && b === c && c === d) return a
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
        if (a && a === b && b === c && c === d) return a
      }
    }

    // Check diagonal (top-right to bottom-left)
    for (let row = 0; row < ROWS - 3; row++) {
      for (let col = 3; col < COLS; col++) {
        const [a, b, c, d] = [
          board[row][col],
          board[row + 1][col - 1],
          board[row + 2][col - 2],
          board[row + 3][col - 3],
        ]
        if (a && a === b && b === c && c === d) return a
      }
    }

    return null
  }

  const isBoardFull = (board: Board): boolean => {
    return board[0].every(cell => cell !== null)
  }

  const dropPiece = (col: number) => {
    if (gameState.gameOver) return

    const newBoard = gameState.board.map(row => [...row])

    // Find the lowest empty row in the column
    let row = ROWS - 1
    while (row >= 0 && newBoard[row][col] !== null) {
      row--
    }

    if (row < 0) {
      // Column is full
      setGameState(prev => ({
        ...prev,
        message: '⚠️ Column is full! Choose another column.',
      }))
      return
    }

    // Place the piece
    newBoard[row][col] = gameState.currentPlayer

    // Check for winner
    const winner = checkWinner(newBoard)
    if (winner) {
      setGameState({
        board: newBoard,
        currentPlayer: gameState.currentPlayer,
        gameOver: true,
        winner,
        message: `🎉 ${winner === 'red' ? '🔴 Red' : '🟡 Yellow'} Player Wins!`,
      })
      return
    }

    // Check for draw
    if (isBoardFull(newBoard)) {
      setGameState({
        board: newBoard,
        currentPlayer: gameState.currentPlayer,
        gameOver: true,
        winner: null,
        message: '🤝 It\'s a Draw!',
      })
      return
    }

    // Switch player
    const nextPlayer = gameState.currentPlayer === 'red' ? 'yellow' : 'red'
    setGameState({
      board: newBoard,
      currentPlayer: nextPlayer,
      gameOver: false,
      winner: null,
      message: `${nextPlayer === 'red' ? '🔴' : '🟡'} ${nextPlayer === 'red' ? 'Red' : 'Yellow'} Player's Turn`,
    })
  }

  const resetGame = () => {
    setGameState({
      board: Array(ROWS).fill(null).map(() => Array(COLS).fill(null)),
      currentPlayer: 'red',
      gameOver: false,
      winner: null,
      message: '🔴 Red Player\'s Turn',
    })
  }

  return (
    <div className="connect-four-container">
      <div className="connect-four-content">
        <h1>Connect Four</h1>
        <p className="subtitle">Get four in a row to win!</p>

        <div className="game-wrapper">
          <div className="status-bar">
            <p className="status">{gameState.message}</p>
          </div>

          <div className="board-container">
            <div className="board">
              {gameState.board.map((row, rowIdx) => (
                <div key={rowIdx} className="board-row">
                  {row.map((cell, colIdx) => (
                    <div
                      key={`${rowIdx}-${colIdx}`}
                      className={`board-cell ${cell ? `filled-${cell}` : ''}`}
                      onClick={() => dropPiece(colIdx)}
                      role="button"
                      tabIndex={0}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          dropPiece(colIdx)
                        }
                      }}
                    >
                      {cell && <div className={`piece ${cell}`} />}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="column-indicators">
              {Array(COLS).fill(null).map((_, idx) => (
                <div key={idx} className="column-indicator">
                  {idx + 1}
                </div>
              ))}
            </div>
          </div>

          <button className="reset-button" onClick={resetGame}>
            🔄 New Game
          </button>
        </div>

        <div className="instructions">
          <h2>How to Play</h2>
          <ul>
            <li>Players take turns dropping pieces into columns</li>
            <li>Pieces fall to the lowest available position</li>
            <li>First player to get 4 pieces in a row wins</li>
            <li>Rows can be horizontal, vertical, or diagonal</li>
            <li>If the board fills up with no winner, it's a draw</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ConnectFour
