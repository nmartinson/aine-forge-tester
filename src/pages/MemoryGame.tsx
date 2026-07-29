import { useState, useEffect } from 'react'
import './MemoryGame.css'

interface Card {
  id: number
  emoji: string
  isFlipped: boolean
  isMatched: boolean
}

function MemoryGame() {
  const emojis = ['🍎', '🍌', '🍒', '🍊', '🍇', '🍓', '🥝', '🍑']
  const [cards, setCards] = useState<Card[]>([])
  const [flipped, setFlipped] = useState<number[]>([])
  const [matched, setMatched] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [gameWon, setGameWon] = useState(false)

  // Initialize game
  useEffect(() => {
    initializeGame()
  }, [])

  // Check for matches
  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped
      if (cards[first].emoji === cards[second].emoji) {
        setMatched([...matched, first, second])
        setFlipped([])
      } else {
        setTimeout(() => setFlipped([]), 600)
      }
      setMoves(moves + 1)
    }
  }, [flipped])

  // Check for win
  useEffect(() => {
    if (matched.length === cards.length && cards.length > 0) {
      setGameWon(true)
    }
  }, [matched, cards.length])

  const initializeGame = () => {
    const shuffled = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }))
    setCards(shuffled)
    setFlipped([])
    setMatched([])
    setMoves(0)
    setGameWon(false)
  }

  const handleCardClick = (index: number) => {
    if (
      flipped.includes(index) ||
      matched.includes(index) ||
      flipped.length === 2
    ) {
      return
    }
    setFlipped([...flipped, index])
  }

  const isCardFlipped = (index: number) => {
    return flipped.includes(index) || matched.includes(index)
  }

  return (
    <div className="memory-game-container">
      <div className="memory-game-content">
        <h1 className="memory-title">Memory Game</h1>
        <p className="memory-subtitle">Find all matching pairs!</p>

        <div className="memory-stats">
          <div className="stat">
            <span className="stat-label">Moves:</span>
            <span className="stat-value">{moves}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Matched:</span>
            <span className="stat-value">{matched.length / 2} / {cards.length / 2}</span>
          </div>
        </div>

        <div className="memory-board">
          {cards.map((card, index) => (
            <button
              key={card.id}
              className={`memory-card ${isCardFlipped(index) ? 'flipped' : ''} ${
                matched.includes(index) ? 'matched' : ''
              }`}
              onClick={() => handleCardClick(index)}
              disabled={gameWon}
            >
              <div className="memory-card-inner">
                <div className="memory-card-front">?</div>
                <div className="memory-card-back">{card.emoji}</div>
              </div>
            </button>
          ))}
        </div>

        {gameWon && (
          <div className="memory-win-message">
            <h2>🎉 You Won!</h2>
            <p>Completed in {moves} moves</p>
          </div>
        )}

        <button className="memory-reset-btn" onClick={initializeGame}>
          {gameWon ? 'Play Again' : 'Reset Game'}
        </button>
      </div>
    </div>
  )
}

export default MemoryGame
