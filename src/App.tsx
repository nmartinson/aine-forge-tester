// Main App component
// This is the second comment
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './utils/ThemeContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import GettingStarted from './pages/GettingStarted'
import TodoList from './pages/TodoList'
import TicTacToe from './pages/TicTacToe'
import MemoryGame from './pages/MemoryGame'
import SnakeGame from './pages/SnakeGame'
import WordPuzzle from './pages/WordPuzzle'
import Wordle from './pages/Wordle'
import Hangman from './pages/Hangman'
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
            <Route path="/memory" element={<MemoryGame />} />
            <Route path="/snake" element={<SnakeGame />} />
            <Route path="/word-puzzle" element={<WordPuzzle />} />
            <Route path="/wordle" element={<Wordle />} />
            <Route path="/hangman" element={<Hangman />} />
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
