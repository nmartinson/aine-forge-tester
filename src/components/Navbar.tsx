import { NavLink } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
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
        </div>
      </div>
    </nav>
  )
}

export default Navbar
