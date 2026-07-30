import { useState, useEffect, useCallback } from 'react'
import './FlipCard.css'

interface Card {
  id: number
  value: string
  isFlipped: boolean
  isMatched: boolean
}

const CARD_VALUES = ['🍎', '🍌', '🍒', '🍓', '🍊', '🍋', '🍌', '🍎', '🍒', '🍓', '🍊', '🍋']

function FlipCard() {
  const [cards, setCards] = useState<Card[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [matchedPairs, setMatchedPairs] = useState<number>(0)
  const [moves, setMoves] = useState<number>(0)
  const [gameWon, setGameWon] = useState<boolean>(false)

  // Initialize game
  const initializeGame = useCallback(() => {
    const shuffled = [...CARD_VALUES].sort(() => Math.random() - 0.5)
    const newCards: Card[] = shuffled.map((value, index) => ({
      id: index,
      value,
      isFlipped: false,
      isMatched: false,
    }))
    setCards(newCards)
    setFlippedCards([])
    setMatchedPairs(0)
    setMoves(0)
    setGameWon(false)
  }, [])

  useEffect(() => {
    initializeGame()
  }, [initializeGame])

  // Check for matches
  useEffect(() => {
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards
      if (cards[first].value === cards[second].value) {
        // Match found
        const newCards = [...cards]
        newCards[first].isMatched = true
        newCards[second].isMatched = true
        setCards(newCards)
        setMatchedPairs(matchedPairs + 1)
        setFlippedCards([])
        setMoves(moves + 1)
      } else {
        // No match
        setTimeout(() => {
          setFlippedCards([])
        }, 1000)
        setMoves(moves + 1)
      }
    }
  }, [flippedCards, cards, matchedPairs, moves])

  // Check for win
  useEffect(() => {
    if (matchedPairs === 6 && matchedPairs > 0) {
      setGameWon(true)
    }
  }, [matchedPairs])

  const handleCardClick = (id: number) => {
    if (gameWon || flippedCards.includes(id) || cards[id].isMatched) {
      return
    }

    if (flippedCards.length < 2) {
      setFlippedCards([...flippedCards, id])
    }
  }

  const isCardFlipped = (id: number) => {
    return flippedCards.includes(id) || cards[id].isMatched
  }

  return (
    <div className="flipcard-container">
      <div className="flipcard-content">
        <h1>Flip Card Memory Game</h1>
        <p className="subtitle">Find all the matching pairs!</p>

        <div className="game-stats">
          <div className="stat-item">
            <span className="stat-label">Pairs Found:</span>
            <span className="stat-value">{matchedPairs}/6</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Moves:</span>
            <span className="stat-value">{moves}</span>
          </div>
        </div>

        {gameWon && (
          <div className="win-message">
            🎉 You won! You found all pairs in {moves} moves!
          </div>
        )}

        <div className="cards-grid">
          {cards.map((card) => (
            <button
              key={card.id}
              className={`card ${isCardFlipped(card.id) ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''}`}
              onClick={() => handleCardClick(card.id)}
              disabled={gameWon}
            >
              <div className="card-inner">
                <div className="card-front">?</div>
                <div className="card-back">{card.value}</div>
              </div>
            </button>
          ))}
        </div>

        <button className="reset-button" onClick={initializeGame}>
          🔄 New Game
        </button>

        <div className="instructions">
          <h2>How to Play</h2>
          <ul>
            <li>Click on cards to flip them over</li>
            <li>Try to find matching pairs of emojis</li>
            <li>When you find a match, the cards stay flipped</li>
            <li>Find all 6 pairs to win the game</li>
            <li>Try to complete the game in as few moves as possible!</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default FlipCard
