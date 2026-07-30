import { useState } from 'react'
import './TodoList.css'

type Priority = 'low' | 'medium' | 'high'

interface Todo {
  id: number
  text: string
  completed: boolean
  priority: Priority
}

function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [input, setInput] = useState('')
  const [selectedPriority, setSelectedPriority] = useState<Priority>('medium')

  const addTodo = () => {
    if (input.trim() === '') return

    const newTodo: Todo = {
      id: Date.now(),
      text: input,
      completed: false,
      priority: selectedPriority,
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

  const updatePriority = (id: number, priority: Priority) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, priority } : todo
      )
    )
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addTodo()
    }
  }

  const completedCount = todos.filter((todo) => todo.completed).length
  const highPriorityCount = todos.filter((todo) => todo.priority === 'high' && !todo.completed).length

  const getPriorityColor = (priority: Priority): string => {
    switch (priority) {
      case 'high':
        return '#ff6b6b'
      case 'medium':
        return '#ffd93d'
      case 'low':
        return '#6bcf7f'
      default:
        return '#999'
    }
  }

  const sortedTodos = [...todos].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })

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
        <div className="stat">
          <span className="stat-label">High Priority:</span>
          <span className="stat-value">{highPriorityCount}</span>
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
        <select
          value={selectedPriority}
          onChange={(e) => setSelectedPriority(e.target.value as Priority)}
          className="todo-priority-select"
          aria-label="Select priority"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
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
            {sortedTodos.map((todo) => (
              <li key={todo.id} className="todo-item">
                <div
                  className="priority-indicator"
                  style={{ backgroundColor: getPriorityColor(todo.priority) }}
                  title={`Priority: ${todo.priority}`}
                />
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
                <select
                  value={todo.priority}
                  onChange={(e) => updatePriority(todo.id, e.target.value as Priority)}
                  className="todo-priority-badge"
                  aria-label="Update priority"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
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
