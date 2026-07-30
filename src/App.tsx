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
import Sudoku from './pages/Sudoku'
import TowersOfHanoi from './pages/TowersOfHanoi'
import Maze3D from './pages/Maze3D'
import GuessTheNumber from './pages/GuessTheNumber'
import SimonSays from './pages/SimonSays'
import Checkers from './pages/Checkers'
import USStateMap from './pages/USStateMap'
import FlipCard from './pages/FlipCard'
import DonkeyKong from './pages/DonkeyKong'
import ConnectFour from './pages/ConnectFour'
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
            <Route path="/sudoku" element={<Sudoku />} />
            <Route path="/towers-of-hanoi" element={<TowersOfHanoi />} />
            <Route path="/maze-3d" element={<Maze3D />} />
            <Route path="/guess-the-number" element={<GuessTheNumber />} />
            <Route path="/simon-says" element={<SimonSays />} />
            <Route path="/checkers" element={<Checkers />} />
            <Route path="/us-state-map" element={<USStateMap />} />
            <Route path="/flip-card" element={<FlipCard />} />
            <Route path="/donkey-kong" element={<DonkeyKong />} />
            <Route path="/connect-four" element={<ConnectFour />} />
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
