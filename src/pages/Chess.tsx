import { useState, useCallback } from 'react'
import './Chess.css'

type Color = 'red' | 'black'
type PieceType = 'regular' | 'king'

interface Piece {
  color: Color
  type: PieceType
}

interface Position {
  row: number
  col: number
}

type Board = (Piece | null)[][]

const BOARD_SIZE = 8

const createInitialBoard = (): Board => {
  const board: Board = Array(8)
    .fill(null)
    .map(() => Array(8).fill(null))

  // Place red pieces (top)
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 8; col++) {
      if ((row + col) % 2 === 1) {
        board[row][col] = { color: 'red', type: 'regular' }
      }
    }
  }

  // Place black pieces (bottom)
  for (let row = 5; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if ((row + col) % 2 === 1) {
        board[row][col] = { color: 'black', type: 'regular' }
      }
    }
  }

  return board
}

const isValidSquare = (row: number, col: number): boolean => {
  return row >= 0 && row < 8 && col >= 0 && col < 8 && (row + col) % 2 === 1
}

const getValidMoves = (
  board: Board,
  row: number,
  col: number,
  piece: Piece
): Position[] => {
  const moves: Position[] = []
  const directions = piece.type === 'king' 
    ? [[-1, -1], [-1, 1], [1, -1], [1, 1]]
    : piece.color === 'red'
    ? [[1, -1], [1, 1]]
    : [[-1, -1], [-1, 1]]

  // Regular moves
  for (const [dRow, dCol] of directions) {
    const newRow = row + dRow
    const newCol = col + dCol

    if (isValidSquare(newRow, newCol) && !board[newRow][newCol]) {
      moves.push({ row: newRow, col: newCol })
    }
  }

  // Jump moves
  for (const [dRow, dCol] of directions) {
    const jumpRow = row + dRow * 2
    const jumpCol = col + dCol * 2
    const captureRow = row + dRow
    const captureCol = col + dCol

    if (
      isValidSquare(jumpRow, jumpCol) &&
      !board[jumpRow][jumpCol] &&
      board[captureRow][captureCol] &&
      board[captureRow][captureCol]!.color !== piece.color
    ) {
      moves.push({ row: jumpRow, col: jumpCol })
    }
  }

  return moves
}

const isJumpMove = (from: Position, to: Position): boolean => {
  return Math.abs(from.row - to.row) === 2
}

const getJumpCapture = (from: Position, to: Position): Position => {
  return {
    row: (from.row + to.row) / 2,
    col: (from.col + to.col) / 2,
  }
}

function Checkers() {
  const [board, setBoard] = useState<Board>(createInitialBoard())
  const [selectedSquare, setSelectedSquare] = useState<Position | null>(null)
  const [validMoves, setValidMoves] = useState<Position[]>([])
  const [currentPlayer, setCurrentPlayer] = useState<Color>('red')
  const [moveCount, setMoveCount] = useState(0)
  const [gameHistory, setGameHistory] = useState<string[]>([])
  const [redPieces, setRedPieces] = useState(12)
  const [blackPieces, setBlackPieces] = useState(12)
  const [gameOver, setGameOver] = useState(false)
  const [winner, setWinner] = useState<Color | null>(null)

  const handleSquareClick = useCallback(
    (row: number, col: number) => {
      if (gameOver) return

      const piece = board[row][col]

      // If clicking on a valid move, make the move
      if (selectedSquare && validMoves.some((m) => m.row === row && m.col === col)) {
        const newBoard = board.map((r) => [...r])
        const movingPiece = newBoard[selectedSquare.row][selectedSquare.col]!

        // Check if this is a jump move
        if (isJumpMove(selectedSquare, { row, col })) {
          const capturePos = getJumpCapture(selectedSquare, { row, col })
          const capturedPiece = newBoard[capturePos.row][capturePos.col]

          // Remove captured piece
          newBoard[capturePos.row][capturePos.col] = null

          if (capturedPiece?.color === 'red') {
            setRedPieces(redPieces - 1)
          } else {
            setBlackPieces(blackPieces - 1)
          }
        }

        // Move piece
        newBoard[row][col] = movingPiece
        newBoard[selectedSquare.row][selectedSquare.col] = null

        // Check for king promotion
        if ((movingPiece.color === 'red' && row === 7) || (movingPiece.color === 'black' && row === 0)) {
          movingPiece.type = 'king'
        }

        setBoard(newBoard)
        setSelectedSquare(null)
        setValidMoves([])

        // Check for game over
        const newRedCount = redPieces - (currentPlayer === 'red' && isJumpMove(selectedSquare, { row, col }) ? 1 : 0)
        const newBlackCount = blackPieces - (currentPlayer === 'black' && isJumpMove(selectedSquare, { row, col }) ? 1 : 0)

        if (newRedCount === 0) {
          setGameOver(true)
          setWinner('black')
        } else if (newBlackCount === 0) {
          setGameOver(true)
          setWinner('red')
        }

        const moveNotation = `${String.fromCharCode(65 + selectedSquare.col)}${8 - selectedSquare.row} → ${String.fromCharCode(65 + col)}${8 - row}`
        setGameHistory([...gameHistory, moveNotation])
        setMoveCount(moveCount + 1)
        setCurrentPlayer(currentPlayer === 'red' ? 'black' : 'red')

        return
      }

      // If clicking on own piece, select it
      if (piece && piece.color === currentPlayer) {
        setSelectedSquare({ row, col })
        const moves = getValidMoves(board, row, col, piece)
        setValidMoves(moves)
      } else {
        setSelectedSquare(null)
        setValidMoves([])
      }
    },
    [board, selectedSquare, validMoves, currentPlayer, moveCount, gameHistory, gameOver, redPieces, blackPieces]
  )

  const resetGame = () => {
    setBoard(createInitialBoard())
    setSelectedSquare(null)
    setValidMoves([])
    setCurrentPlayer('red')
    setMoveCount(0)
    setGameHistory([])
    setRedPieces(12)
    setBlackPieces(12)
    setGameOver(false)
    setWinner(null)
  }

  const isSquareSelected = (row: number, col: number): boolean => {
    return selectedSquare?.row === row && selectedSquare?.col === col
  }

  const isValidMoveSquare = (row: number, col: number): boolean => {
    return validMoves.some((m) => m.row === row && m.col === col)
  }

  const isLightSquare = (row: number, col: number): boolean => {
    return (row + col) % 2 === 0
  }

  return (
    <div className="chess-container">
      <div className="chess-content">
        <h1>🔴 Checkers</h1>
        <p className="subtitle">Jump your way to victory!</p>

        <div className="game-wrapper">
          {gameOver && (
            <div className="game-over-message">
              <p>🎉 Game Over!</p>
              <p className="winner-text">{winner === 'red' ? '🔴 Red' : '⚫ Black'} wins!</p>
            </div>
          )}

          <div className="game-info">
            <div className="info-item">
              <span className="info-label">Current Player:</span>
              <span className={`info-value ${currentPlayer}`}>
                {currentPlayer === 'red' ? '🔴 Red' : '⚫ Black'}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Red Pieces:</span>
              <span className="info-value red">{redPieces}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Black Pieces:</span>
              <span className="info-value black">{blackPieces}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Moves:</span>
              <span className="info-value">{moveCount}</span>
            </div>
          </div>

          <div className="board-container">
            <div className="checkers-board">
              {board.map((row, rowIndex) =>
                row.map((piece, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`square ${isLightSquare(rowIndex, colIndex) ? 'light' : 'dark'} ${
                      isSquareSelected(rowIndex, colIndex) ? 'selected' : ''
                    } ${isValidMoveSquare(rowIndex, colIndex) ? 'valid-move' : ''}`}
                    onClick={() => handleSquareClick(rowIndex, colIndex)}
                  >
                    {piece && (
                      <div className={`checker-piece ${piece.color} ${piece.type}`}>
                        {piece.color === 'red' ? '🔴' : '⚫'}
                        {piece.type === 'king' && <span className="king-crown">👑</span>}
                      </div>
                    )}
                    {isValidMoveSquare(rowIndex, colIndex) && (
                      <div className="move-indicator">
                        {piece ? '●' : '○'}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          <button className="reset-button" onClick={resetGame}>
            🔄 New Game
          </button>
        </div>

        <div className="game-stats">
          <div className="stats-section">
            <h3>Move History</h3>
            <div className="move-history">
              {gameHistory.length === 0 ? (
                <p className="no-moves">No moves yet</p>
              ) : (
                <div className="moves-list">
                  {gameHistory.map((move, index) => (
                    <span key={index} className="move-item">
                      {index + 1}. {move}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="instructions">
          <h2>How to Play</h2>
          <ul>
            <li>Click on a piece to select it and see valid moves</li>
            <li>Click on a highlighted square to move the piece</li>
            <li>Red moves first</li>
            <li>Regular pieces move diagonally forward one square</li>
            <li>Jump over opponent pieces to capture them</li>
            <li>Reach the opposite end to become a King (👑)</li>
            <li>Kings can move diagonally in any direction</li>
            <li>Capture all opponent pieces to win!</li>
            <li>Click "New Game" to start over</li>
          </ul>

          <h2>Game Rules</h2>
          <ul>
            <li><strong>Regular Pieces:</strong> Move diagonally forward one square on dark squares</li>
            <li><strong>Capturing:</strong> Jump over an opponent piece to capture it (must land on empty square)</li>
            <li><strong>King Promotion:</strong> Reach the opposite end to become a King</li>
            <li><strong>Kings:</strong> Can move diagonally in any direction (forward or backward)</li>
            <li><strong>Winning:</strong> Capture all opponent pieces to win the game</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Checkers
