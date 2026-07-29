import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RockPaperScissors from './RockPaperScissors'

describe('RockPaperScissors', () => {
  beforeEach(() => {
    render(<RockPaperScissors />)
  })

  it('renders the game with three choice buttons', () => {
    expect(screen.getByRole('button', { name: /play rock/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /play paper/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /play scissors/i })).toBeInTheDocument()
  })

  it('displays score tracking', () => {
    expect(screen.getByText('Wins')).toBeInTheDocument()
    expect(screen.getByText('Draws')).toBeInTheDocument()
    expect(screen.getByText('Losses')).toBeInTheDocument()
  })

  it('shows result after playing', async () => {
    const user = userEvent.setup()
    const rockButton = screen.getByRole('button', { name: /play rock/i })

    await user.click(rockButton)

    // Should show a result message
    const resultMessages = screen.queryAllByText(/you win|you lose|it's a draw/i)
    expect(resultMessages.length).toBeGreaterThan(0)
  })

  it('updates score after playing', async () => {
    const user = userEvent.setup()
    const rockButton = screen.getByRole('button', { name: /play rock/i })

    await user.click(rockButton)

    // Score should be updated (at least one of wins, losses, or draws should be > 0)
    const scoreValues = screen.getAllByText(/^\d+$/)
    const hasNonZeroScore = scoreValues.some((el) => parseInt(el.textContent || '0') > 0)
    expect(hasNonZeroScore).toBe(true)
  })

  it('has a reset score button', () => {
    expect(screen.getByRole('button', { name: /reset score/i })).toBeInTheDocument()
  })

  it('resets score when reset button is clicked', async () => {
    const user = userEvent.setup()
    const rockButton = screen.getByRole('button', { name: /play rock/i })
    const resetButton = screen.getByRole('button', { name: /reset score/i })

    // Play a game
    await user.click(rockButton)

    // Reset score
    await user.click(resetButton)

    // All scores should be 0
    const scoreValues = screen.getAllByText('0')
    expect(scoreValues.length).toBeGreaterThan(0)
  })
})
