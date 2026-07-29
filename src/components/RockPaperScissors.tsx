import { useState } from 'react'
import './RockPaperScissors.css'

type Choice = 'rock' | 'paper' | 'scissors' | null
type Result = 'win' | 'lose' | 'draw' | null

function RockPaperScissors() {
  const [playerChoice, setPlayerChoice] = useState<Choice>(null)
  const [computerChoice, setComputerChoice] = useState<Choice>(null)
  const [result, setResult] = useState<Result>(null)
  const [score, setScore] = useState({ wins: 0, losses: 0, draws: 0 })

  const choices: Choice[] = ['rock', 'paper', 'scissors']
  const choiceEmojis: Record<string, string> = {
    rock: '🪨',
    paper: '📄',
    scissors: '✂️',
  }

  const getComputerChoice = (): Choice => {
    return choices[Math.floor(Math.random() * choices.length)]
  }

  const determineWinner = (player: Choice, computer: Choice): Result => {
    if (player === computer) return 'draw'
    if (
      (player === 'rock' && computer === 'scissors') ||
      (player === 'paper' && computer === 'rock') ||
      (player === 'scissors' && computer === 'paper')
    ) {
      return 'win'
    }
    return 'lose'
  }

  const handlePlay = (choice: Choice) => {
    const computer = getComputerChoice()
    const gameResult = determineWinner(choice, computer)

    setPlayerChoice(choice)
    setComputerChoice(computer)
    setResult(gameResult)

    setScore((prev) => ({
      ...prev,
      wins: gameResult === 'win' ? prev.wins + 1 : prev.wins,
      losses: gameResult === 'lose' ? prev.losses + 1 : prev.losses,
      draws: gameResult === 'draw' ? prev.draws + 1 : prev.draws,
    }))
  }

  const resetGame = () => {
    setPlayerChoice(null)
    setComputerChoice(null)
    setResult(null)
  }

  const resetScore = () => {
    setScore({ wins: 0, losses: 0, draws: 0 })
    resetGame()
  }

  return (
    <div className="rps-container">
      <div className="rps-game">
        <div className="rps-choices">
          {choices.map((choice) => (
            <button
              key={choice}
              className={`choice-button ${playerChoice === choice ? 'active' : ''}`}
              onClick={() => handlePlay(choice)}
              aria-label={`Play ${choice}`}
            >
              <span className="choice-emoji">{choiceEmojis[choice as string]}</span>
              <span className="choice-label">{choice}</span>
            </button>
          ))}
        </div>

        {playerChoice && computerChoice && (
          <div className="rps-result">
            <div className="matchup">
              <div className="player-side">
                <p className="label">You</p>
                <p className="emoji">{choiceEmojis[playerChoice]}</p>
              </div>
              <div className="vs">VS</div>
              <div className="computer-side">
                <p className="label">Computer</p>
                <p className="emoji">{choiceEmojis[computerChoice]}</p>
              </div>
            </div>

            <div className={`result-message ${result}`}>
              {result === 'win' && '🎉 You Win!'}
              {result === 'lose' && '😢 You Lose!'}
              {result === 'draw' && '🤝 It\'s a Draw!'}
            </div>

            <button className="play-again-button" onClick={resetGame}>
              Play Again
            </button>
          </div>
        )}

        <div className="rps-score">
          <div className="score-item wins">
            <span className="score-label">Wins</span>
            <span className="score-value">{score.wins}</span>
          </div>
          <div className="score-item draws">
            <span className="score-label">Draws</span>
            <span className="score-value">{score.draws}</span>
          </div>
          <div className="score-item losses">
            <span className="score-label">Losses</span>
            <span className="score-value">{score.losses}</span>
          </div>
        </div>

        <button className="reset-button" onClick={resetScore}>
          Reset Score
        </button>
      </div>
    </div>
  )
}

export default RockPaperScissors
