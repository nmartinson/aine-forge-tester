import { NavLink } from 'react-router-dom'
import { useTheme } from '../utils/useTheme'
import './Navbar.css'

function Navbar() {
  const { theme, toggleTheme } = useTheme()

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
          <NavLink 
            to="/guess-the-number" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            🎯 Guess the Number
          </NavLink>
          <NavLink 
            to="/wordle" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            🎮 Wordle
          </NavLink>
          <NavLink 
            to="/tictactoe" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            🎮 Tic Tac Toe
          </NavLink>
          <NavLink 
            to="/connect-four" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            🔴 Connect Four
          </NavLink>
          <NavLink 
            to="/minesweeper" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            💣 Minesweeper
          </NavLink>
          <NavLink 
            to="/checkers" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            ♟️ Checkers
          </NavLink>
          <NavLink 
            to="/memory" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            🧠 Memory
          </NavLink>
          <NavLink 
            to="/flip-card" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            🃏 Flip Card
          </NavLink>
          <NavLink 
            to="/snake" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            🐍 Snake
          </NavLink>
          <NavLink 
            to="/donkey-kong" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            🦍 Donkey Kong
          </NavLink>
          <NavLink 
            to="/rpsls" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            🖖 RPSLS
          </NavLink>
          <NavLink 
            to="/word-puzzle" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            📚 Word Puzzle
          </NavLink>
          <NavLink 
            to="/hangman" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            💀 Hangman
          </NavLink>
          <NavLink 
            to="/sudoku" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            🔢 Sudoku
          </NavLink>
          <NavLink 
            to="/towers-of-hanoi" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            🗼 Towers of Hanoi
          </NavLink>
          <NavLink 
            to="/maze-3d" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            🧩 Maze 3D
          </NavLink>
          <NavLink 
            to="/simon-says" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            🎵 Simon Says
          </NavLink>
          <NavLink 
            to="/us-state-map" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            🗺️ US States
          </NavLink>
          <NavLink 
            to="/todo" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            📝 Todo
          </NavLink>
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
