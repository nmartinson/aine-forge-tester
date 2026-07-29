import { useState } from 'react'
import './TicTacToe.css'

type Player = 'X' | 'O' | null

interface GameState {
  board: Player[]
  isXNext: boolean
  winner: Player
  isDraw: boolean
}

function TicTacToe() {
  const [gameState, setGameState] = useState<GameState>({
    board: Array(9).fill(null),
    isXNext: true,
    winner: null,
    isDraw: false,
  })

  const calculateWinner = (squares: Player[]): Player => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ]

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i]
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a]
      }
    }
    return null
  }

  const handleClick = (index: number) => {
    // Don't allow moves if game is over
    if (gameState.winner || gameState.isDraw) {
      return
    }

    // Don't allow moves on occupied squares
    if (gameState.board[index]) {
      return
    }

    const newBoard = [...gameState.board]
    newBoard[index] = gameState.isXNext ? 'X' : 'O'

    const winner = calculateWinner(newBoard)
    const isBoardFull = newBoard.every((square) => square !== null)
    const isDraw = isBoardFull && !winner

    setGameState({
      board: newBoard,
      isXNext: !gameState.isXNext,
      winner: winner,
      isDraw: isDraw,
    })
  }

  const resetGame = () => {
    setGameState({
      board: Array(9).fill(null),
      isXNext: true,
      winner: null,
      isDraw: false,
    })
  }

  const getStatus = () => {
    if (gameState.winner) {
      return `🎉 Player ${gameState.winner} wins!`
    }
    if (gameState.isDraw) {
      return "🤝 It's a draw!"
    }
    return `Current Player: ${gameState.isXNext ? 'X' : 'O'}`
  }

  return (
    <div className="tictactoe-container">
      <div className="tictactoe-content">
        <h1>Tic Tac Toe</h1>
        <p className="subtitle">A classic game of strategy and fun!</p>

        <div className="game-wrapper">
          <div className="status-bar">
            <p className="status">{getStatus()}</p>
          </div>

          <div className="board">
            {gameState.board.map((value, index) => (
              <button
                key={index}
                className={`square ${value ? 'filled' : ''} ${
                  value === 'X' ? 'x' : value === 'O' ? 'o' : ''
                }`}
                onClick={() => handleClick(index)}
                disabled={gameState.winner !== null || gameState.isDraw}
              >
                {value}
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
            <li>Players take turns clicking on empty squares</li>
            <li>X always goes first</li>
            <li>Get three in a row (horizontally, vertically, or diagonally) to win</li>
            <li>Click "New Game" to start over</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default TicTacToe
