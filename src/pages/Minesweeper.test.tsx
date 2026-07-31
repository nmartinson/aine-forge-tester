import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Minesweeper from './Minesweeper'

describe('Minesweeper', () => {
  it('renders the game title', () => {
    render(<Minesweeper />)
    expect(screen.getByText('Minesweeper')).toBeInTheDocument()
  })

  it('shows the idle status message before first click', () => {
    render(<Minesweeper />)
    expect(screen.getByText(/Click any cell to start/i)).toBeInTheDocument()
  })

  it('renders a 9x9 grid of cells', () => {
    render(<Minesweeper />)
    const cells = screen.getAllByRole('button', { name: /Cell row/i })
    expect(cells).toHaveLength(81)
  })

  it('starts the game on first cell click', () => {
    render(<Minesweeper />)
    const cells = screen.getAllByRole('button', { name: /Cell row/i })
    fireEvent.click(cells[40]) // centre cell
    // Status should no longer be the idle message
    expect(screen.queryByText(/Click any cell to start/i)).not.toBeInTheDocument()
  })

  it('resets the board when New Game is clicked', () => {
    render(<Minesweeper />)
    const cells = screen.getAllByRole('button', { name: /Cell row/i })
    fireEvent.click(cells[40])
    fireEvent.click(screen.getByText(/New Game/i))
    expect(screen.getByText(/Click any cell to start/i)).toBeInTheDocument()
  })

  it('renders the How to Play instructions', () => {
    render(<Minesweeper />)
    expect(screen.getByText('How to Play')).toBeInTheDocument()
    expect(screen.getByText(/Left-click a cell to reveal it/i)).toBeInTheDocument()
  })
})
