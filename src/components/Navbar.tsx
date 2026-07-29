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
            to="/tictactoe" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            🎮 Tic Tac Toe
          </NavLink>
          <NavLink 
            to="/snake" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            🐍 Snake
          </NavLink>
          <NavLink 
            to="/checkers" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            🔴 Checkers
          </NavLink>
          <NavLink 
            to="/word-puzzle" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            📚 Word Puzzle
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
