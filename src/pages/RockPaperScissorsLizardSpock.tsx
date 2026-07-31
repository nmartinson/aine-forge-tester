import { useState } from 'react'
import './RockPaperScissorsLizardSpock.css'

type Choice = 'rock' | 'paper' | 'scissors' | 'lizard' | 'spock'
type ChoiceOrNull = Choice | null
type Result = 'win' | 'lose' | 'draw' | null

interface GameState {
  playerChoice: ChoiceOrNull
  computerChoice: ChoiceOrNull
  result: Result
  playerScore: number
  computerScore: number
  message: string
}

function RockPaperScissorsLizardSpock() {
  const choices: Choice[] = ['rock', 'paper', 'scissors', 'lizard', 'spock']
  const emojis: Record<Choice, string> = {
    rock: '🪨',
    paper: '📄',
    scissors: '✂️',
    lizard: '🦎',
    spock: '🖖',
  }

  const [gameState, setGameState] = useState<GameState>({
    playerChoice: null,
    computerChoice: null,
    result: null,
    playerScore: 0,
    computerScore: 0,
    message: 'Make your choice!',
  })

  const getWinner = (player: Choice, computer: Choice): Result => {
    if (player === computer) return 'draw'

    const winConditions: Record<Choice, Choice[]> = {
      rock: ['scissors', 'lizard'],
      paper: ['rock', 'spock'],
      scissors: ['paper', 'lizard'],
      lizard: ['spock', 'paper'],
      spock: ['scissors', 'rock'],
    }

    if (winConditions[player].includes(computer)) {
      return 'win'
    }
    return 'lose'
  }

  const getResultMessage = (player: Choice, computer: Choice, result: Result): string => {
    const playerEmoji = emojis[player]
    const computerEmoji = emojis[computer]

    if (result === 'draw') {
      return `${playerEmoji} vs ${computerEmoji} — It's a tie!`
    }

    const winMessages: Record<Choice, Record<Choice, string>> = {
      rock: {
        scissors: 'Rock crushes Scissors!',
        lizard: 'Rock crushes Lizard!',
        rock: 'Rock vs Rock!',
        paper: 'Paper covers Rock!',
        spock: 'Spock vaporizes Rock!',
      },
      paper: {
        rock: 'Paper covers Rock!',
        spock: 'Paper disproves Spock!',
        paper: 'Paper vs Paper!',
        scissors: 'Scissors cuts Paper!',
        lizard: 'Lizard eats Paper!',
      },
      scissors: {
        paper: 'Scissors cuts Paper!',
        lizard: 'Scissors decapitates Lizard!',
        scissors: 'Scissors vs Scissors!',
        rock: 'Rock crushes Scissors!',
        spock: 'Spock smashes Scissors!',
      },
      lizard: {
        spock: 'Lizard poisons Spock!',
        paper: 'Lizard eats Paper!',
        lizard: 'Lizard vs Lizard!',
        rock: 'Rock crushes Lizard!',
        scissors: 'Scissors decapitates Lizard!',
      },
      spock: {
        scissors: 'Spock smashes Scissors!',
        rock: 'Spock vaporizes Rock!',
        spock: 'Spock vs Spock!',
        paper: 'Paper disproves Spock!',
        lizard: 'Lizard poisons Spock!',
      },
    }

    const message = winMessages[player][computer]
    return `${playerEmoji} vs ${computerEmoji} — ${message}`
  }

  const handlePlay = (playerChoice: Choice) => {
    const computerChoice = choices[Math.floor(Math.random() * choices.length)]
    const result = getWinner(playerChoice, computerChoice)
    const message = getResultMessage(playerChoice, computerChoice, result)

    const newPlayerScore = gameState.playerScore + (result === 'win' ? 1 : 0)
    const newComputerScore = gameState.computerScore + (result === 'lose' ? 1 : 0)

    setGameState({
      playerChoice,
      computerChoice,
      result,
      playerScore: newPlayerScore,
      computerScore: newComputerScore,
      message,
    })
  }

  const resetGame = () => {
    setGameState({
      playerChoice: null,
      computerChoice: null,
      result: null,
      playerScore: 0,
      computerScore: 0,
      message: 'Make your choice!',
    })
  }

  return (
    <div className="rpsls-container">
      <div className="rpsls-content">
        <h1>Rock Paper Scissors Lizard Spock</h1>
        <p className="subtitle">The ultimate strategy game!</p>

        <div className="game-wrapper">
          <div className="score-board">
            <div className="score-item">
              <span className="score-label">You</span>
              <span className="score-value">{gameState.playerScore}</span>
            </div>
            <div className="score-divider">vs</div>
            <div className="score-item">
              <span className="score-label">Computer</span>
              <span className="score-value">{gameState.computerScore}</span>
            </div>
          </div>

          <div className="result-display">
            <p className="result-message">{gameState.message}</p>
          </div>

          <div className="choices-display">
            <div className="choice-box">
              <div className="choice-label">Your Choice</div>
              <div className="choice-emoji">
                {gameState.playerChoice ? emojis[gameState.playerChoice] : '❓'}
              </div>
            </div>
            <div className="vs-text">VS</div>
            <div className="choice-box">
              <div className="choice-label">Computer</div>
              <div className="choice-emoji">
                {gameState.computerChoice ? emojis[gameState.computerChoice] : '❓'}
              </div>
            </div>
          </div>

          <div className="buttons-grid">
            {choices.map((choice) => (
              <button
                key={choice}
                className="choice-button"
                onClick={() => handlePlay(choice)}
                title={choice.charAt(0).toUpperCase() + choice.slice(1)}
              >
                <span className="button-emoji">{emojis[choice]}</span>
                <span className="button-text">{choice}</span>
              </button>
            ))}
          </div>

          <button className="reset-button" onClick={resetGame}>
            🔄 Reset Game
          </button>
        </div>

        <div className="instructions">
          <h2>How to Play</h2>
          <ul>
            <li>Choose one of the five options: Rock, Paper, Scissors, Lizard, or Spock</li>
            <li>The computer will make its choice</li>
            <li>The winner is determined by these rules:</li>
          </ul>
          <div className="rules">
            <div className="rule">
              <strong>Rock</strong> crushes Scissors and Lizard
            </div>
            <div className="rule">
              <strong>Paper</strong> covers Rock and disproves Spock
            </div>
            <div className="rule">
              <strong>Scissors</strong> cuts Paper and decapitates Lizard
            </div>
            <div className="rule">
              <strong>Lizard</strong> eats Paper and poisons Spock
            </div>
            <div className="rule">
              <strong>Spock</strong> vaporizes Rock and smashes Scissors
            </div>
          </div>
          <p className="tip">💡 Each choice beats exactly two others and loses to exactly two others!</p>
        </div>
      </div>
    </div>
  )
}

export default RockPaperScissorsLizardSpock
