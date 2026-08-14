import { useState, useEffect, useCallback, useMemo } from 'react'
import './ColorMatch.css'

interface GameScore {
  time: number
  correct: boolean
}

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F']

const COLOR_NAMES: { [key: string]: string } = {
  '#FF6B6B': 'Red',
  '#4ECDC4': 'Teal',
  '#45B7D1': 'Blue',
  '#FFA07A': 'Salmon',
  '#98D8C8': 'Mint',
  '#F7DC6F': 'Yellow',
}

function ColorMatch() {
  const [gameStarted, setGameStarted] = useState(false)
  const [gameActive, setGameActive] = useState(false)
  const [targetColor, setTargetColor] = useState('')
  const [targetColorName, setTargetColorName] = useState('')
  const [displayedColor, setDisplayedColor] = useState('')
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [gameHistory, setGameHistory] = useState<GameScore[]>([])
  const [reactionTime, setReactionTime] = useState(0)
  const [startTime, setStartTime] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [totalGames, setTotalGames] = useState(0)
  const [accuracy, setAccuracy] = useState(0)

  const generateRound = useCallback(() => {
    const randomTarget = COLORS[Math.floor(Math.random() * COLORS.length)]
    const randomDisplay = COLORS[Math.floor(Math.random() * COLORS.length)]
    
    setTargetColor(randomTarget)
    setTargetColorName(COLOR_NAMES[randomTarget])
    setDisplayedColor(randomDisplay)
    setReactionTime(0)
    setFeedback('')
    setStartTime(Date.now())
  }, [])

  const startGame = useCallback(() => {
    setGameStarted(true)
    setGameActive(true)
    setScore(0)
    setStreak(0)
    setGameHistory([])
    setTotalGames(0)
    setAccuracy(0)
    generateRound()
  }, [generateRound])

  useEffect(() => {
    if (gameActive && startTime === 0) {
      generateRound()
    }
  }, [gameActive, startTime, generateRound])

  const handleMatch = () => {
    if (!gameActive) return

    const time = Date.now() - startTime
    const isCorrect = targetColor === displayedColor

    setReactionTime(time)
    setTotalGames(prev => prev + 1)

    if (isCorrect) {
      setScore(prev => prev + 1)
      setStreak(prev => {
        const newStreak = prev + 1
        setBestStreak(current => Math.max(current, newStreak))
        return newStreak
      })
      setFeedback('✓ Correct!')
      setGameHistory(prev => [...prev, { time, correct: true }])
    } else {
      setFeedback('✗ Wrong!')
      setStreak(0)
      setGameHistory(prev => [...prev, { time, correct: false }])
    }

    // Generate next round after delay
    setTimeout(() => {
      setStartTime(0)
    }, 800)
  }

  const handleNoMatch = () => {
    if (!gameActive) return

    const time = Date.now() - startTime
    const isCorrect = targetColor !== displayedColor

    setReactionTime(time)
    setTotalGames(prev => prev + 1)

    if (isCorrect) {
      setScore(prev => prev + 1)
      setStreak(prev => {
        const newStreak = prev + 1
        setBestStreak(current => Math.max(current, newStreak))
        return newStreak
      })
      setFeedback('✓ Correct!')
      setGameHistory(prev => [...prev, { time, correct: true }])
    } else {
      setFeedback('✗ Wrong!')
      setStreak(0)
      setGameHistory(prev => [...prev, { time, correct: false }])
    }

    // Generate next round after delay
    setTimeout(() => {
      setStartTime(0)
    }, 800)
  }

  const endGame = () => {
    setGameActive(false)
    setGameStarted(false)
  }

  const getAverageReactionTime = useMemo(() => {
    if (gameHistory.length === 0) return 0
    const sum = gameHistory.reduce((acc, item) => acc + item.time, 0)
    return Math.round(sum / gameHistory.length)
  }, [gameHistory])

  const getFastestTime = useMemo(() => {
    if (gameHistory.length === 0) return 0
    return Math.min(...gameHistory.map(item => item.time))
  }, [gameHistory])

  const getSlowestTime = useMemo(() => {
    if (gameHistory.length === 0) return 0
    return Math.max(...gameHistory.map(item => item.time))
  }, [gameHistory])

  if (!gameStarted) {
    return (
      <div className="color-match-container">
        <div className="color-match-content">
          <h1>🎨 Color Match</h1>
          <p className="subtitle">Test your reaction time and color matching skills!</p>

          <div className="instructions-box">
            <h2>How to Play</h2>
            <ul>
              <li>You'll see a color name and a colored square</li>
              <li>Click "MATCH" if the color matches the name</li>
              <li>Click "NO MATCH" if the color doesn't match the name</li>
              <li>React as quickly as possible!</li>
              <li>Your accuracy and reaction time will be tracked</li>
            </ul>
          </div>

          <button className="start-button" onClick={startGame}>
            🚀 Start Game
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="color-match-container">
      <div className="color-match-content">
        <h1>🎨 Color Match</h1>

        <div className="game-stats">
          <div className="stat-item">
            <span className="stat-label">Score</span>
            <span className="stat-value">{score}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Streak</span>
            <span className="stat-value">{streak}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Best Streak</span>
            <span className="stat-value">{bestStreak}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Accuracy</span>
            <span className="stat-value">{accuracy}%</span>
          </div>
        </div>

        <div className="game-area">
          <div className="color-name-display">
            {targetColorName}
          </div>

          <div
            className="color-square"
            style={{ backgroundColor: displayedColor }}
          />

          {reactionTime > 0 && (
            <div className={`feedback ${feedback.includes('Correct') ? 'correct' : 'incorrect'}`}>
              {feedback}
              <div className="reaction-time">{reactionTime}ms</div>
            </div>
          )}
        </div>

        <div className="button-group">
          <button
            className="action-button match-button"
            onClick={handleMatch}
            disabled={reactionTime > 0}
          >
            ✓ MATCH
          </button>
          <button
            className="action-button no-match-button"
            onClick={handleNoMatch}
            disabled={reactionTime > 0}
          >
            ✗ NO MATCH
          </button>
        </div>

        <div className="game-info">
          <div className="info-card">
            <span className="info-label">Total Rounds</span>
            <span className="info-value">{totalGames}</span>
          </div>
          <div className="info-card">
            <span className="info-label">Avg Reaction</span>
            <span className="info-value">{getAverageReactionTime}ms</span>
          </div>
          <div className="info-card">
            <span className="info-label">Fastest</span>
            <span className="info-value">{getFastestTime}ms</span>
          </div>
          <div className="info-card">
            <span className="info-label">Slowest</span>
            <span className="info-value">{getSlowestTime}ms</span>
          </div>
        </div>

        <button className="end-button" onClick={endGame}>
          🏁 End Game
        </button>
      </div>
    </div>
  )
}

export default ColorMatch
