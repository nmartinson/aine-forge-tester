import { useState } from 'react'
import ReactionTime from '../components/Game2/ReactionTime'
import WordScramble from '../components/Game2/WordScramble'
import '../components/Game2/Game2.css'

type GameType = 'reaction' | 'wordscramble'

function Game2() {
  const [selectedGame, setSelectedGame] = useState<GameType>('reaction')

  return (
    <div className="game2-container">
      {selectedGame === 'reaction' && <ReactionTime />}
      {selectedGame === 'wordscramble' && <WordScramble />}

      <div className="game-selector">
        <button
          className={`game-tab ${selectedGame === 'reaction' ? 'active' : ''}`}
          onClick={() => setSelectedGame('reaction')}
        >
          ⚡ Reaction Time
        </button>
        <button
          className={`game-tab ${selectedGame === 'wordscramble' ? 'active' : ''}`}
          onClick={() => setSelectedGame('wordscramble')}
        >
          📝 Word Scramble
        </button>
      </div>
    </div>
  )
}

export default Game2
