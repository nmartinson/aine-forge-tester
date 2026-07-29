// Main App component
// This is the second comment
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './utils/ThemeContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import GettingStarted from './pages/GettingStarted'
import TodoList from './pages/TodoList'
import TicTacToe from './pages/TicTacToe'
import SnakeGame from './pages/SnakeGame'
import './App.css'

function App() {
  return (
    <ThemeProvider>
      <Router basename="/aine-forge-tester/">
        <div className="app">
          <Navbar />
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/getting-started" element={<GettingStarted />} />
            <Route path="/todo" element={<TodoList />} />
            <Route path="/tictactoe" element={<TicTacToe />} />
            <Route path="/snake" element={<SnakeGame />} />
          </Routes>

          <footer className="footer">
            <p>Built for testing agentic coding tools 🛠️</p>
          </footer>
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App
