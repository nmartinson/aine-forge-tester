import { useState } from 'react'
import DiceRoller from './DiceRoller'
import ColorMatch from './ColorMatch'
import './Game1Wrapper.css'

function Game1Wrapper() {
  const [activeGame, setActiveGame] = useState<'dice' | 'color'>('dice')

  return (
    <div className="game1-wrapper">
      <div className="game1-selector">
        <button
          className={`game-tab ${activeGame === 'dice' ? 'active' : ''}`}
          onClick={() => setActiveGame('dice')}
        >
          🎲 Dice Roller
        </button>
        <button
          className={`game-tab ${activeGame === 'color' ? 'active' : ''}`}
          onClick={() => setActiveGame('color')}
        >
          🎨 Color Match
        </button>
      </div>

      <div className="game1-content">
        {activeGame === 'dice' && <DiceRoller />}
        {activeGame === 'color' && <ColorMatch />}
      </div>
    </div>
  )
}

export default Game1Wrapper
