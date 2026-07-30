import { useState, useEffect } from 'react'
import './TowersOfHanoi.css'

type Disk = {
  id: number
  size: number
}

type Tower = Disk[]

interface GameState {
  towers: [Tower, Tower, Tower]
  moves: number
  selectedTower: number | null
  isWon: boolean
  numDisks: number
}

function TowersOfHanoi() {
  const [gameState, setGameState] = useState<GameState>(() => ({
    towers: [
      Array.from({ length: 3 }, (_, i) => ({ id: i, size: 3 - i })),
      [],
      [],
    ],
    moves: 0,
    selectedTower: null,
    isWon: false,
    numDisks: 3,
  }))

  const [minMoves, setMinMoves] = useState(7)

  useEffect(() => {
    const min = Math.pow(2, gameState.numDisks) - 1
    setMinMoves(min)
  }, [gameState.numDisks])

  const isValidMove = (fromTower: Tower, toTower: Tower): boolean => {
    if (fromTower.length === 0) return false
    if (toTower.length === 0) return true
    return fromTower[fromTower.length - 1].size < toTower[toTower.length - 1].size
  }

  const handleTowerClick = (towerIndex: number) => {
    const { towers, selectedTower } = gameState

    if (selectedTower === null) {
      // Select a tower if it has disks
      if (towers[towerIndex].length > 0) {
        setGameState((prev) => ({
          ...prev,
          selectedTower: towerIndex,
        }))
      }
    } else if (selectedTower === towerIndex) {
      // Deselect if clicking the same tower
      setGameState((prev) => ({
        ...prev,
        selectedTower: null,
      }))
    } else {
      // Try to move disk
      const fromTower = towers[selectedTower]
      const toTower = towers[towerIndex]

      if (isValidMove(fromTower, toTower)) {
        const newTowers = towers.map((t) => [...t]) as [Tower, Tower, Tower]
        const disk = newTowers[selectedTower].pop()
        if (disk) {
          newTowers[towerIndex].push(disk)
        }

        const newMoves = gameState.moves + 1
        const isWon =
          newTowers[2].length === gameState.numDisks &&
          newTowers[0].length === 0 &&
          newTowers[1].length === 0

        setGameState((prev) => ({
          ...prev,
          towers: newTowers,
          moves: newMoves,
          selectedTower: null,
          isWon: isWon,
        }))
      } else {
        // Invalid move, deselect
        setGameState((prev) => ({
          ...prev,
          selectedTower: null,
        }))
      }
    }
  }

  const resetGame = (numDisks: number) => {
    setGameState({
      towers: [
        Array.from({ length: numDisks }, (_, i) => ({ id: i, size: numDisks - i })),
        [],
        [],
      ],
      moves: 0,
      selectedTower: null,
      isWon: false,
      numDisks: numDisks,
    })
  }

  const getDiskColor = (size: number): string => {
    const colors = [
      'var(--primary-color)',
      'var(--secondary-color)',
      'var(--accent-color)',
      '#10b981',
      '#f59e0b',
      '#ef4444',
      '#8b5cf6',
    ]
    return colors[(size - 1) % colors.length]
  }

  const getStatus = () => {
    if (gameState.isWon) {
      return `🎉 You won in ${gameState.moves} moves!`
    }
    return `Moves: ${gameState.moves} / Optimal: ${minMoves}`
  }

  return (
    <div className="hanoi-container">
      <div className="hanoi-content">
        <h1>Towers of Hanoi</h1>
        <p className="subtitle">Move all disks from the left tower to the right tower</p>

        <div className="game-wrapper">
          <div className="status-bar">
            <p className="status">{getStatus()}</p>
          </div>

          <div className="difficulty-selector">
            <label htmlFor="disk-count">Number of Disks:</label>
            <select
              id="disk-count"
              value={gameState.numDisks}
              onChange={(e) => resetGame(parseInt(e.target.value))}
              disabled={gameState.moves > 0 && !gameState.isWon}
            >
              <option value={3}>3 Disks (Easy)</option>
              <option value={4}>4 Disks (Medium)</option>
              <option value={5}>5 Disks (Hard)</option>
              <option value={6}>6 Disks (Very Hard)</option>
            </select>
          </div>

          <div className="towers-container">
            {gameState.towers.map((tower, towerIndex) => (
              <div
                key={towerIndex}
                className={`tower-column ${
                  gameState.selectedTower === towerIndex ? 'selected' : ''
                }`}
                onClick={() => handleTowerClick(towerIndex)}
              >
                <div className="tower-label">
                  {towerIndex === 0 ? 'Source' : towerIndex === 1 ? 'Auxiliary' : 'Destination'}
                </div>
                <div className="tower-base">
                  <div className="tower-pole"></div>
                  <div className="disks-stack">
                    {tower.map((disk, diskIndex) => (
                      <div
                        key={disk.id}
                        className="disk"
                        style={{
                          width: `${30 + disk.size * 40}px`,
                          backgroundColor: getDiskColor(disk.size),
                          bottom: `${diskIndex * 35}px`,
                        }}
                      >
                        <span className="disk-label">{disk.size}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            className="reset-button"
            onClick={() => resetGame(gameState.numDisks)}
          >
            🔄 New Game
          </button>
        </div>

        <div className="instructions">
          <h2>How to Play</h2>
          <ul>
            <li>Click on a tower to select a disk from the top</li>
            <li>Click on another tower to move the disk there</li>
            <li>You can only place a smaller disk on top of a larger disk</li>
            <li>Move all disks from the left tower to the right tower</li>
            <li>The minimum number of moves is 2^n - 1 (where n is the number of disks)</li>
          </ul>
          <h3>Legend</h3>
          <p>
            The three towers are: <strong>Source</strong> (left), <strong>Auxiliary</strong> (middle),
            and <strong>Destination</strong> (right). Your goal is to move all disks from Source to
            Destination.
          </p>
        </div>
      </div>
    </div>
  )
}

export default TowersOfHanoi
