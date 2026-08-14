import { useState } from 'react'
import './Battleship.css'

interface Ship {
  id: number
  size: number
  positions: number[]
  hits: number
}

interface GameState {
  playerShips: Ship[]
  computerShips: Ship[]
  playerBoard: number[] // 0: empty, 1: ship, 2: hit, 3: miss
  computerBoard: number[] // 0: empty, 1: unknown, 2: hit, 3: miss
  playerTurn: boolean
  gameOver: boolean
  winner: 'player' | 'computer' | null
  message: string
  gamePhase: 'setup' | 'playing' | 'over'
}

const BOARD_SIZE = 10
const TOTAL_CELLS = BOARD_SIZE * BOARD_SIZE

function Battleship() {
  const [gameState, setGameState] = useState<GameState>(() => ({
    playerShips: [],
    computerShips: [],
    playerBoard: Array(TOTAL_CELLS).fill(0),
    computerBoard: Array(TOTAL_CELLS).fill(1),
    playerTurn: true,
    gameOver: false,
    winner: null,
    message: 'Click "Start Game" to begin!',
    gamePhase: 'setup',
  }))

  const generateShips = (): Ship[] => {
    const ships: Ship[] = []
    const shipSizes = [5, 4, 3, 3, 2]
    const occupied = new Set<number>()

    for (let shipId = 0; shipId < shipSizes.length; shipId++) {
      const size = shipSizes[shipId]
      let placed = false

      while (!placed) {
        const isHorizontal = Math.random() > 0.5
        const row = Math.floor(Math.random() * BOARD_SIZE)
        const col = Math.floor(Math.random() * BOARD_SIZE)

        if (isHorizontal) {
          if (col + size > BOARD_SIZE) continue

          const positions = Array.from({ length: size }, (_, i) => row * BOARD_SIZE + col + i)
          if (positions.some(p => occupied.has(p))) continue

          positions.forEach(p => occupied.add(p))
          ships.push({ id: shipId, size, positions, hits: 0 })
          placed = true
        } else {
          if (row + size > BOARD_SIZE) continue

          const positions = Array.from({ length: size }, (_, i) => (row + i) * BOARD_SIZE + col)
          if (positions.some(p => occupied.has(p))) continue

          positions.forEach(p => occupied.add(p))
          ships.push({ id: shipId, size, positions, hits: 0 })
          placed = true
        }
      }
    }

    return ships
  }

  const initializeBoard = (ships: Ship[]): number[] => {
    const board = Array(TOTAL_CELLS).fill(0)
    ships.forEach(ship => {
      ship.positions.forEach(pos => {
        board[pos] = 1
      })
    })
    return board
  }

  const startGame = () => {
    const playerShips = generateShips()
    const computerShips = generateShips()

    setGameState({
      playerShips,
      computerShips,
      playerBoard: initializeBoard(playerShips),
      computerBoard: Array(TOTAL_CELLS).fill(1),
      playerTurn: true,
      gameOver: false,
      winner: null,
      message: 'Your turn! Click on the computer board to attack.',
      gamePhase: 'playing',
    })
  }

  const checkGameOver = (playerShips: Ship[], computerShips: Ship[]): { gameOver: boolean; winner: 'player' | 'computer' | null } => {
    const playerAllSunk = playerShips.every(ship => ship.hits === ship.size)
    const computerAllSunk = computerShips.every(ship => ship.hits === ship.size)

    if (playerAllSunk) return { gameOver: true, winner: 'computer' }
    if (computerAllSunk) return { gameOver: true, winner: 'player' }

    return { gameOver: false, winner: null }
  }

  const handlePlayerAttack = (cellIndex: number) => {
    if (!gameState.playerTurn || gameState.gamePhase !== 'playing') return
    if (gameState.computerBoard[cellIndex] === 2 || gameState.computerBoard[cellIndex] === 3) return

    const newComputerBoard = [...gameState.computerBoard]
    const newComputerShips = gameState.computerShips.map(ship => ({ ...ship }))

    let hit = false
    for (const ship of newComputerShips) {
      if (ship.positions.includes(cellIndex)) {
        ship.hits++
        hit = true
        newComputerBoard[cellIndex] = 2
        break
      }
    }

    if (!hit) {
      newComputerBoard[cellIndex] = 3
    }

    const { gameOver, winner } = checkGameOver(gameState.playerShips, newComputerShips)

    if (gameOver) {
      setGameState({
        ...gameState,
        computerBoard: newComputerBoard,
        computerShips: newComputerShips,
        gameOver: true,
        winner,
        message: winner === 'player' ? '🎉 You won! All enemy ships destroyed!' : '💥 Game Over! All your ships were destroyed!',
        gamePhase: 'over',
      })
      return
    }

    setGameState({
      ...gameState,
      computerBoard: newComputerBoard,
      computerShips: newComputerShips,
      playerTurn: false,
      message: hit ? '💥 Hit! Computer is attacking...' : '💧 Miss! Computer is attacking...',
    })

    setTimeout(() => {
      computerAttack(gameState.playerBoard, gameState.playerShips, newComputerShips)
    }, 1000)
  }

  const computerAttack = (playerBoard: number[], playerShips: Ship[], computerShips: Ship[]) => {
    const newPlayerBoard = [...playerBoard]
    const newPlayerShips = playerShips.map(ship => ({ ...ship }))

    const validMoves = Array.from({ length: TOTAL_CELLS }, (_, i) => i).filter(
      i => newPlayerBoard[i] !== 2 && newPlayerBoard[i] !== 3
    )

    if (validMoves.length === 0) return

    const cellIndex = validMoves[Math.floor(Math.random() * validMoves.length)]
    let hit = false

    for (const ship of newPlayerShips) {
      if (ship.positions.includes(cellIndex)) {
        ship.hits++
        hit = true
        newPlayerBoard[cellIndex] = 2
        break
      }
    }

    if (!hit) {
      newPlayerBoard[cellIndex] = 3
    }

    const { gameOver, winner } = checkGameOver(newPlayerShips, computerShips)

    if (gameOver) {
      setGameState(prev => ({
        ...prev,
        playerBoard: newPlayerBoard,
        playerShips: newPlayerShips,
        gameOver: true,
        winner,
        message: winner === 'player' ? '🎉 You won! All enemy ships destroyed!' : '💥 Game Over! All your ships were destroyed!',
        gamePhase: 'over',
      }))
      return
    }

    setGameState(prev => ({
      ...prev,
      playerBoard: newPlayerBoard,
      playerShips: newPlayerShips,
      playerTurn: true,
      message: hit ? '💥 Computer hit your ship! Your turn.' : '💧 Computer missed! Your turn.',
    }))
  }

  const resetGame = () => {
    setGameState({
      playerShips: [],
      computerShips: [],
      playerBoard: Array(TOTAL_CELLS).fill(0),
      computerBoard: Array(TOTAL_CELLS).fill(1),
      playerTurn: true,
      gameOver: false,
      winner: null,
      message: 'Click "Start Game" to begin!',
      gamePhase: 'setup',
    })
  }

  const renderBoard = (board: number[], isPlayerBoard: boolean) => {
    return (
      <div className="board">
        {board.map((cell, index) => {
          let cellClass = 'cell'
          let cellContent = ''

          if (isPlayerBoard) {
            if (cell === 1) cellClass += ' ship'
            if (cell === 2) cellClass += ' hit'
            if (cell === 3) cellClass += ' miss'
          } else {
            if (cell === 2) {
              cellClass += ' hit'
              cellContent = '💥'
            }
            if (cell === 3) {
              cellClass += ' miss'
              cellContent = '💧'
            }
            if (cell === 1 || cell === 0) {
              cellClass += ' unknown'
            }
          }

          return (
            <div
              key={index}
              className={cellClass}
              onClick={() => !isPlayerBoard && handlePlayerAttack(index)}
              title={isPlayerBoard ? `Your board` : `Attack (${Math.floor(index / BOARD_SIZE)}, ${index % BOARD_SIZE})`}
            >
              {cellContent}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="battleship-container">
      <div className="battleship-content">
        <h1>⚓ Battleship</h1>
        <p className="subtitle">Sink all enemy ships before they sink yours!</p>

        <div className="game-wrapper">
          <div className="status-bar">
            <p className="status">{gameState.message}</p>
          </div>

          {gameState.gamePhase === 'setup' && (
            <button className="start-button" onClick={startGame}>
              🎮 Start Game
            </button>
          )}

          {gameState.gamePhase === 'playing' && (
            <div className="boards-container">
              <div className="board-section">
                <h3>Your Board</h3>
                {renderBoard(gameState.playerBoard, true)}
              </div>
              <div className="board-section">
                <h3>Enemy Board</h3>
                {renderBoard(gameState.computerBoard, false)}
              </div>
            </div>
          )}

          {gameState.gamePhase === 'over' && (
            <div className="game-over-section">
              <div className="boards-container">
                <div className="board-section">
                  <h3>Your Board</h3>
                  {renderBoard(gameState.playerBoard, true)}
                </div>
                <div className="board-section">
                  <h3>Enemy Board</h3>
                  {renderBoard(gameState.computerBoard, false)}
                </div>
              </div>
              <button className="reset-button" onClick={resetGame}>
                🔄 Play Again
              </button>
            </div>
          )}
        </div>

        <div className="instructions">
          <h2>How to Play</h2>
          <ul>
            <li>Click "Start Game" to place ships randomly on both boards</li>
            <li>Click on the enemy board to attack a cell</li>
            <li>💥 indicates a hit, 💧 indicates a miss</li>
            <li>Sink all 5 enemy ships before they sink yours</li>
            <li>Ships: Battleship (5), Cruiser (4), Destroyer (3), Submarine (3), Patrol Boat (2)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Battleship
