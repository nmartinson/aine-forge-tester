import { useState, useEffect, useRef } from 'react'
import './Maze3D.css'

interface Cell {
  x: number
  y: number
  visited: boolean
  walls: {
    top: boolean
    right: boolean
    bottom: boolean
    left: boolean
  }
}

interface Point {
  x: number
  y: number
}

interface PathNode {
  x: number
  y: number
  g: number
  h: number
  f: number
  parent: PathNode | null
}

const GRID_SIZE = 15
const CELL_SIZE = 40
const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 600

export default function Maze3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [maze, setMaze] = useState<Cell[][]>([])
  const [solving, setSolving] = useState(false)
  const [path, setPath] = useState<Point[]>([])
  const [generating, setGenerating] = useState(false)
  const [stats, setStats] = useState({ generationTime: 0, solvingTime: 0, pathLength: 0 })

  // Initialize maze with all walls
  const initializeMaze = (): Cell[][] => {
    const newMaze: Cell[][] = []
    for (let y = 0; y < GRID_SIZE; y++) {
      newMaze[y] = []
      for (let x = 0; x < GRID_SIZE; x++) {
        newMaze[y][x] = {
          x,
          y,
          visited: false,
          walls: { top: true, right: true, bottom: true, left: true },
        }
      }
    }
    return newMaze
  }

  // Recursive backtracking maze generation
  const generateMaze = async () => {
    setGenerating(true)
    setPath([])
    const startTime = performance.now()

    const newMaze = initializeMaze()
    const stack: Cell[] = []
    const startCell = newMaze[0][0]
    startCell.visited = true
    stack.push(startCell)

    const directions = [
      { dx: 0, dy: -1, wall: 'top', opposite: 'bottom' },
      { dx: 1, dy: 0, wall: 'right', opposite: 'left' },
      { dx: 0, dy: 1, wall: 'bottom', opposite: 'top' },
      { dx: -1, dy: 0, wall: 'left', opposite: 'right' },
    ]

    let iterations = 0
    while (stack.length > 0) {
      const current = stack[stack.length - 1]
      const neighbors: Array<{ cell: Cell; dir: typeof directions[0] }> = []

      for (const dir of directions) {
        const nx = current.x + dir.dx
        const ny = current.y + dir.dy
        if (nx >= 0 && nx < GRID_SIZE && ny >= 0 && ny < GRID_SIZE && !newMaze[ny][nx].visited) {
          neighbors.push({ cell: newMaze[ny][nx], dir })
        }
      }

      if (neighbors.length > 0) {
        const chosen = neighbors[Math.floor(Math.random() * neighbors.length)]
        const next = chosen.cell
        const dir = chosen.dir

        current.walls[dir.wall as keyof typeof current.walls] = false
        next.walls[dir.opposite as keyof typeof next.walls] = false
        next.visited = true
        stack.push(next)
      } else {
        stack.pop()
      }

      iterations++
      if (iterations % 50 === 0) {
        setMaze([...newMaze])
        await new Promise((resolve) => setTimeout(resolve, 0))
      }
    }

    setMaze(newMaze)
    const endTime = performance.now()
    setStats((prev) => ({ ...prev, generationTime: Math.round(endTime - startTime) }))
    setGenerating(false)
  }

  // A* pathfinding algorithm
  const solveMaze = async () => {
    if (maze.length === 0) return

    setSolving(true)
    const startTime = performance.now()

    const start: PathNode = { x: 0, y: 0, g: 0, h: 0, f: 0, parent: null }
    const goal = { x: GRID_SIZE - 1, y: GRID_SIZE - 1 }

    const heuristic = (a: Point, b: Point) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y)

    const openSet: PathNode[] = [start]
    const closedSet = new Set<string>()
    const nodeMap = new Map<string, PathNode>()
    nodeMap.set('0,0', start)

    const directions = [
      { dx: 0, dy: -1, wall: 'top' },
      { dx: 1, dy: 0, wall: 'right' },
      { dx: 0, dy: 1, wall: 'bottom' },
      { dx: -1, dy: 0, wall: 'left' },
    ]

    let iterations = 0
    while (openSet.length > 0) {
      let current = openSet[0]
      let currentIndex = 0

      for (let i = 1; i < openSet.length; i++) {
        if (openSet[i].f < current.f) {
          current = openSet[i]
          currentIndex = i
        }
      }

      if (current.x === goal.x && current.y === goal.y) {
        const finalPath: Point[] = []
        let node: PathNode | null = current
        while (node) {
          finalPath.unshift({ x: node.x, y: node.y })
          node = node.parent
        }
        setPath(finalPath)
        const endTime = performance.now()
        setStats((prev) => ({
          ...prev,
          solvingTime: Math.round(endTime - startTime),
          pathLength: finalPath.length,
        }))
        setSolving(false)
        return
      }

      openSet.splice(currentIndex, 1)
      closedSet.add(`${current.x},${current.y}`)

      const cell = maze[current.y][current.x]

      for (const dir of directions) {
        if (cell.walls[dir.wall as keyof typeof cell.walls]) continue

        const nx = current.x + dir.dx
        const ny = current.y + dir.dy

        if (nx < 0 || nx >= GRID_SIZE || ny < 0 || ny >= GRID_SIZE) continue
        if (closedSet.has(`${nx},${ny}`)) continue

        const g = current.g + 1
        const h = heuristic({ x: nx, y: ny }, goal)
        const f = g + h
        const key = `${nx},${ny}`

        const existing = nodeMap.get(key)
        if (existing && g >= existing.g) continue

        const neighbor: PathNode = { x: nx, y: ny, g, h, f, parent: current }
        nodeMap.set(key, neighbor)

        if (!existing) {
          openSet.push(neighbor)
        }
      }

      iterations++
      if (iterations % 100 === 0) {
        await new Promise((resolve) => setTimeout(resolve, 0))
      }
    }

    setSolving(false)
  }

  // Draw maze with 3D isometric perspective
  useEffect(() => {
    if (!canvasRef.current || maze.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--background-color')
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const offsetX = (canvas.width - GRID_SIZE * CELL_SIZE) / 2
    const offsetY = (canvas.height - GRID_SIZE * CELL_SIZE) / 2

    // Draw cells with 3D effect
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const cell = maze[y][x]
        const px = offsetX + x * CELL_SIZE
        const py = offsetY + y * CELL_SIZE

        // Draw cell background with gradient for 3D effect
        const gradient = ctx.createLinearGradient(px, py, px + CELL_SIZE, py + CELL_SIZE)
        gradient.addColorStop(0, getComputedStyle(document.documentElement).getPropertyValue('--card-bg'))
        gradient.addColorStop(1, getComputedStyle(document.documentElement).getPropertyValue('--surface-color'))
        ctx.fillStyle = gradient
        ctx.fillRect(px, py, CELL_SIZE, CELL_SIZE)

        // Draw walls
        ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--border-color')
        ctx.lineWidth = 2

        if (cell.walls.top) {
          ctx.beginPath()
          ctx.moveTo(px, py)
          ctx.lineTo(px + CELL_SIZE, py)
          ctx.stroke()
        }
        if (cell.walls.right) {
          ctx.beginPath()
          ctx.moveTo(px + CELL_SIZE, py)
          ctx.lineTo(px + CELL_SIZE, py + CELL_SIZE)
          ctx.stroke()
        }
        if (cell.walls.bottom) {
          ctx.beginPath()
          ctx.moveTo(px, py + CELL_SIZE)
          ctx.lineTo(px + CELL_SIZE, py + CELL_SIZE)
          ctx.stroke()
        }
        if (cell.walls.left) {
          ctx.beginPath()
          ctx.moveTo(px, py)
          ctx.lineTo(px, py + CELL_SIZE)
          ctx.stroke()
        }
      }
    }

    // Draw path if solved
    if (path.length > 0) {
      ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--success-color')
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(offsetX + path[0].x * CELL_SIZE + CELL_SIZE / 2, offsetY + path[0].y * CELL_SIZE + CELL_SIZE / 2)
      for (let i = 1; i < path.length; i++) {
        ctx.lineTo(offsetX + path[i].x * CELL_SIZE + CELL_SIZE / 2, offsetY + path[i].y * CELL_SIZE + CELL_SIZE / 2)
      }
      ctx.stroke()

      // Draw start and end markers
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary-color')
      ctx.beginPath()
      ctx.arc(offsetX + CELL_SIZE / 2, offsetY + CELL_SIZE / 2, 6, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent-color')
      ctx.beginPath()
      ctx.arc(
        offsetX + (GRID_SIZE - 1) * CELL_SIZE + CELL_SIZE / 2,
        offsetY + (GRID_SIZE - 1) * CELL_SIZE + CELL_SIZE / 2,
        6,
        0,
        Math.PI * 2
      )
      ctx.fill()
    }
  }, [maze, path])

  return (
    <div className="maze3d-container">
      <h1>🧩 3D Maze Generator & Solver</h1>
      <p className="subtitle">Recursive backtracking generation with A* pathfinding</p>

      <div className="controls">
        <button onClick={generateMaze} disabled={generating || solving} className="btn-primary">
          {generating ? '⏳ Generating...' : '🎲 Generate Maze'}
        </button>
        <button onClick={solveMaze} disabled={maze.length === 0 || solving || generating} className="btn-secondary">
          {solving ? '⏳ Solving...' : '🔍 Solve Maze'}
        </button>
      </div>

      <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="maze-canvas" />

      <div className="stats">
        <div className="stat-item">
          <span className="stat-label">Generation Time:</span>
          <span className="stat-value">{stats.generationTime}ms</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Solving Time:</span>
          <span className="stat-value">{stats.solvingTime}ms</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Path Length:</span>
          <span className="stat-value">{stats.pathLength} cells</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Maze Size:</span>
          <span className="stat-value">{GRID_SIZE}×{GRID_SIZE}</span>
        </div>
      </div>

      <div className="info">
        <h3>How it works:</h3>
        <ul>
          <li>
            <strong>Generation:</strong> Uses recursive backtracking algorithm to create a perfect maze (one solution path)
          </li>
          <li>
            <strong>Solving:</strong> Uses A* pathfinding algorithm to find the optimal path from start (top-left) to goal
            (bottom-right)
          </li>
          <li>
            <strong>Complexity:</strong> Generation is O(n²), solving is O(n² log n) with heuristic optimization
          </li>
        </ul>
      </div>
    </div>
  )
}
