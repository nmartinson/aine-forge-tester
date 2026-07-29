import { useState } from 'react'
import './TodoList.css'

interface Todo {
  id: number
  text: string
  completed: boolean
}

function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [input, setInput] = useState('')

  const addTodo = () => {
    if (input.trim() === '') return

    const newTodo: Todo = {
      id: Date.now(),
      text: input,
      completed: false,
    }

    setTodos([...todos, newTodo])
    setInput('')
  }

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addTodo()
    }
  }

  const completedCount = todos.filter((todo) => todo.completed).length

  return (
    <main className="todo-container">
      <div className="todo-header">
        <h1>📝 My Todo List</h1>
        <p className="todo-subtitle">
          Keep track of your tasks and stay organized
        </p>
      </div>

      <div className="todo-stats">
        <div className="stat">
          <span className="stat-label">Total:</span>
          <span className="stat-value">{todos.length}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Completed:</span>
          <span className="stat-value">{completedCount}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Remaining:</span>
          <span className="stat-value">{todos.length - completedCount}</span>
        </div>
      </div>

      <div className="todo-input-section">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a new task..."
          className="todo-input"
        />
        <button onClick={addTodo} className="todo-add-btn">
          ➕ Add
        </button>
      </div>

      <div className="todo-list">
        {todos.length === 0 ? (
          <div className="todo-empty">
            <p>No tasks yet! Add one to get started. 🎯</p>
          </div>
        ) : (
          <ul className="todo-items">
            {todos.map((todo) => (
              <li key={todo.id} className="todo-item">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className="todo-checkbox"
                />
                <span
                  className={`todo-text ${
                    todo.completed ? 'completed' : ''
                  }`}
                >
                  {todo.text}
                </span>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="todo-delete-btn"
                  aria-label="Delete task"
                >
                  🗑️
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}

export default TodoList
