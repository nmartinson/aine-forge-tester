import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useTheme } from '../utils/useTheme'
import './Navbar.css'

function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const [isGamesOpen, setIsGamesOpen] = useState(false)

  const games = [
    { path: '/guess-the-number', label: '🎯 Guess the Number' },
    { path: '/wordle', label: '🎮 Wordle' },
    { path: '/tictactoe', label: '🎮 Tic Tac Toe' },
    { path: '/connect-four', label: '🔴 Connect Four' },
    { path: '/minesweeper', label: '💣 Minesweeper' },
    { path: '/checkers', label: '♟️ Checkers' },
    { path: '/memory', label: '🧠 Memory' },
    { path: '/flip-card', label: '🃏 Flip Card' },
    { path: '/snake', label: '🐍 Snake' },
    { path: '/donkey-kong', label: '🦍 Donkey Kong' },
    { path: '/rpsls', label: '🖖 RPSLS' },
    { path: '/word-puzzle', label: '📚 Word Puzzle' },
    { path: '/hangman', label: '💀 Hangman' },
    { path: '/sudoku', label: '🔢 Sudoku' },
    { path: '/towers-of-hanoi', label: '🗼 Towers of Hanoi' },
    { path: '/maze-3d', label: '🧩 Maze 3D' },
    { path: '/simon-says', label: '🎵 Simon Says' },
    { path: '/us-state-map', label: '🗺️ US States' },
    { path: '/todo', label: '📝 Todo' },
    { path: '/mountain-bike-trail', label: '🚴 Mountain Bike Trail' },
    { path: '/bike-components-finder', label: '🔧 Bike Components' },
  ]

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-brand">
          <span className="navbar-logo">🚀</span>
          <span className="navbar-title">Aine Forge Tester</span>
        </div>
        <div className="navbar-links">
          <NavLink 
            to="/" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            🏠 Home
          </NavLink>
          
          <div className="games-dropdown">
            <button 
              className="games-toggle"
              onClick={() => setIsGamesOpen(!isGamesOpen)}
              aria-label="Toggle games menu"
              aria-expanded={isGamesOpen}
            >
              🎮 Games
              <span className={`dropdown-arrow ${isGamesOpen ? 'open' : ''}`}>▼</span>
            </button>
            {isGamesOpen && (
              <div className="games-menu">
                {games.map((game) => (
                  <NavLink
                    key={game.path}
                    to={game.path}
                    className={({ isActive }) => isActive ? 'game-link active' : 'game-link'}
                    onClick={() => setIsGamesOpen(false)}
                  >
                    {game.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          <NavLink 
            to="/getting-started" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            📚 Getting Started
          </NavLink>

          <button 
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
