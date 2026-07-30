import { useState } from 'react'
import './Checkers.css'

type Piece = 'red' | 'black' | 'red-king' | 'black-king' | null

interface GameState {
  board: Piece[]
  selectedSquare: number | null
  validMoves: number[]
  isRedTurn: boolean
  gameOver: boolean
  winner: 'red' | 'black' | null
}

function Checkers() {
  const [gameState, setGameState] = useState<GameState>({
    board: initializeBoard(),
    selectedSquare: null,
    validMoves: [],
    isRedTurn: true,
    gameOver: false,
    winner: null,
  })

  function initializeBoard(): Piece[] {
    const board: Piece[] = Array(64).fill(null)
    // Red pieces (top)
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 8; j++) {
        if ((i + j) % 2 === 1) {
          board[i * 8 + j] = 'red'
        }
      }
    }
    // Black pieces (bottom)
    for (let i = 5; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if ((i + j) % 2 === 1) {
          board[i * 8 + j] = 'black'
        }
      }
    }
    return board
  }

  const getValidMoves = (index: number, board: Piece[]): number[] => {
    const piece = board[index]
    if (!piece) return []

    const row = Math.floor(index / 8)
    const col = index % 8
    const moves: number[] = []

    const isRed = piece.includes('red')
    const isKing = piece.includes('king')

    // Regular moves (one square diagonally)
    const directions = isKing
      ? [[-1, -1], [-1, 1], [1, -1], [1, 1]]
      : isRed
        ? [[1, -1], [1, 1]]
        : [[-1, -1], [-1, 1]]

    for (const [dRow, dCol] of directions) {
      const newRow = row + dRow
      const newCol = col + dCol

      if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
        const newIndex = newRow * 8 + newCol
        if (!board[newIndex]) {
          moves.push(newIndex)
        }
      }
    }

    // Capture moves (two squares diagonally)
    const captureDirections = isKing
      ? [[-2, -2], [-2, 2], [2, -2], [2, 2]]
      : isRed
        ? [[2, -2], [2, 2]]
        : [[-2, -2], [-2, 2]]

    for (const [dRow, dCol] of captureDirections) {
      const newRow = row + dRow
      const newCol = col + dCol

      if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
        const newIndex = newRow * 8 + newCol
        const capturedIndex = (row + dRow / 2) * 8 + (col + dCol / 2)
        const capturedPiece = board[capturedIndex]

        if (
          !board[newIndex] &&
          capturedPiece &&
          capturedPiece.includes(isRed ? 'black' : 'red')
        ) {
          moves.push(newIndex)
        }
      }
    }

    return moves
  }

  const handleSquareClick = (index: number) => {
    if (gameState.gameOver) return

    const piece = gameState.board[index]
    const isRedPiece = piece?.includes('red')

    // If clicking on own piece, select it
    if (piece && isRedPiece === gameState.isRedTurn) {
      const validMoves = getValidMoves(index, gameState.board)
      setGameState({
        ...gameState,
        selectedSquare: index,
        validMoves: validMoves,
      })
      return
    }

    // If clicking on a valid move, make the move
    if (gameState.validMoves.includes(index)) {
      const newBoard = [...gameState.board]
      const selectedPiece = newBoard[gameState.selectedSquare!]

      // Move piece
      newBoard[index] = selectedPiece
      newBoard[gameState.selectedSquare!] = null

      // Handle capture
      const selectedRow = Math.floor(gameState.selectedSquare! / 8)
      const selectedCol = gameState.selectedSquare! % 8
      const newRow = Math.floor(index / 8)
      const newCol = index % 8

      if (Math.abs(newRow - selectedRow) === 2) {
        const capturedIndex =
          ((selectedRow + newRow) / 2) * 8 + ((selectedCol + newCol) / 2)
        newBoard[capturedIndex] = null
      }

      // Promote to king
      if (
        (gameState.isRedTurn && newRow === 7) ||
        (!gameState.isRedTurn && newRow === 0)
      ) {
        newBoard[index] = gameState.isRedTurn ? 'red-king' : 'black-king'
      }

      // Check for game over
      const redPieces = newBoard.filter((p) => p?.includes('red')).length
      const blackPieces = newBoard.filter((p) => p?.includes('black')).length

      let gameOver = false
      let winner: 'red' | 'black' | null = null

      if (redPieces === 0) {
        gameOver = true
        winner = 'black'
      } else if (blackPieces === 0) {
        gameOver = true
        winner = 'red'
      }

      setGameState({
        board: newBoard,
        selectedSquare: null,
        validMoves: [],
        isRedTurn: !gameState.isRedTurn,
        gameOver: gameOver,
        winner: winner,
      })
    }
  }

  const resetGame = () => {
    setGameState({
      board: initializeBoard(),
      selectedSquare: null,
      validMoves: [],
      isRedTurn: true,
      gameOver: false,
      winner: null,
    })
  }

  const getStatus = () => {
    if (gameState.gameOver && gameState.winner) {
      return `🎉 ${gameState.winner.toUpperCase()} wins!`
    }
    if (gameState.gameOver) {
      return "🤝 Game Over!"
    }
    return `Current Player: ${gameState.isRedTurn ? '🔴 Red' : '⚫ Black'}`
  }

  return (
    <div className="checkers-container">
      <div className="checkers-content">
        <h1>Checkers</h1>
        <p className="subtitle">A timeless strategy game!</p>

        <div className="game-wrapper">
          <div className="status-bar">
            <p className="status">{getStatus()}</p>
          </div>

          <div className="board">
            {gameState.board.map((piece, index) => {
              const row = Math.floor(index / 8)
              const col = index % 8
              const isBlackSquare = (row + col) % 2 === 1
              const isSelected = gameState.selectedSquare === index
              const isValidMove = gameState.validMoves.includes(index)

              return (
                <button
                  key={index}
                  className={`square ${isBlackSquare ? 'black-square' : 'white-square'} ${
                    isSelected ? 'selected' : ''
                  } ${isValidMove ? 'valid-move' : ''}`}
                  onClick={() => handleSquareClick(index)}
                  disabled={gameState.gameOver}
                >
                  {piece && (
                    <div className={`piece ${piece}`}>
                      {piece.includes('king') && '👑'}
                    </div>
                  )}
                  {isValidMove && <div className="move-indicator"></div>}
                </button>
              )
            })}
          </div>

          <button className="reset-button" onClick={resetGame}>
            🔄 New Game
          </button>
        </div>

        <div className="instructions">
          <h2>How to Play</h2>
          <ul>
            <li>Red moves first</li>
            <li>Click a piece to select it and see valid moves</li>
            <li>Click a highlighted square to move there</li>
            <li>Capture opponent pieces by jumping over them</li>
            <li>Reach the opposite end to become a king (👑)</li>
            <li>Kings can move diagonally in any direction</li>
            <li>Last player with pieces wins!</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Checkers
