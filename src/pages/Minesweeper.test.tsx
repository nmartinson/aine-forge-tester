import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Minesweeper from './Minesweeper'

describe('Minesweeper', () => {
  it('renders the title', () => {
    render(<Minesweeper />)
    expect(screen.getByText('Minesweeper')).toBeInTheDocument()
  })

  it('shows idle status message before first click', () => {
    render(<Minesweeper />)
    expect(screen.getByTestId('game-status')).toHaveTextContent('Click any cell to start')
  })

  it('renders a 9x9 board (81 cells)', () => {
    render(<Minesweeper />)
    // All cells have aria-label containing "cell at row"
    const cells = screen.getAllByRole('button', { name: /cell at row/i })
    expect(cells).toHaveLength(81)
  })

  it('shows mine count and grid info', () => {
    render(<Minesweeper />)
    expect(screen.getByText(/10 mines/)).toBeInTheDocument()
    expect(screen.getByText(/9×9/)).toBeInTheDocument()
  })

  it('starts the game on first cell click and updates status', () => {
    render(<Minesweeper />)
    const cells = screen.getAllByRole('button', { name: /cell at row/i })
    fireEvent.click(cells[0])
    // Status should no longer be the idle message
    const status = screen.getByTestId('game-status')
    expect(status).not.toHaveTextContent('Click any cell to start')
  })

  it('places a flag on right-click and increments flag count', () => {
    render(<Minesweeper />)
    const cell = screen.getAllByRole('button', { name: /Hidden cell/i })[0]
    fireEvent.contextMenu(cell)
    expect(screen.getByText(/1 flagged/)).toBeInTheDocument()
  })

  it('removes a flag on second right-click', () => {
    render(<Minesweeper />)
    // Capture the element reference once; reuse it for both right-clicks
    // so the second contextMenu targets the same cell regardless of aria-label change
    const cell = screen.getAllByRole('button', { name: /Hidden cell/i })[0]
    fireEvent.contextMenu(cell)
    expect(screen.getByText(/1 flagged/)).toBeInTheDocument()
    // cell is the same DOM node — its aria-label is now "Flagged cell at row 1 column 1"
    // but the reference is still valid; right-clicking again removes the flag
    fireEvent.contextMenu(cell)
    expect(screen.getByText(/0 flagged/)).toBeInTheDocument()
  })

  it('resets the game when New Game button is clicked', () => {
    render(<Minesweeper />)
    const cells = screen.getAllByRole('button', { name: /cell at row/i })
    fireEvent.click(cells[40])
    const resetButton = screen.getByText('🔄 New Game')
    fireEvent.click(resetButton)
    expect(screen.getByTestId('game-status')).toHaveTextContent('Click any cell to start')
    expect(screen.getByText(/0 flagged/)).toBeInTheDocument()
  })

  it('renders the instructions section', () => {
    render(<Minesweeper />)
    expect(screen.getByText('How to Play')).toBeInTheDocument()
    expect(screen.getByText(/Left-click a cell to reveal it/)).toBeInTheDocument()
  })
})
