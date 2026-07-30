import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import TodoList from './TodoList'

describe('TodoList', () => {
  it('renders the todo list component', () => {
    render(<TodoList />)
    expect(screen.getByText('📝 My Todo List')).toBeInTheDocument()
  })

  it('displays empty state when no todos', () => {
    render(<TodoList />)
    expect(screen.getByText(/No tasks yet!/)).toBeInTheDocument()
  })

  it('adds a new todo when add button is clicked', () => {
    render(<TodoList />)
    const input = screen.getByPlaceholderText('Add a new task...')
    const addButton = screen.getByText('➕ Add')

    fireEvent.change(input, { target: { value: 'Test task' } })
    fireEvent.click(addButton)

    expect(screen.getByText('Test task')).toBeInTheDocument()
  })

  it('adds a todo when Enter key is pressed', () => {
    render(<TodoList />)
    const input = screen.getByPlaceholderText('Add a new task...')

    fireEvent.change(input, { target: { value: 'Test task' } })
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 })

    expect(screen.getByText('Test task')).toBeInTheDocument()
  })

  it('toggles todo completion status', () => {
    render(<TodoList />)
    const input = screen.getByPlaceholderText('Add a new task...')
    const addButton = screen.getByText('➕ Add')

    fireEvent.change(input, { target: { value: 'Test task' } })
    fireEvent.click(addButton)

    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)

    const todoText = screen.getByText('Test task')
    expect(todoText).toHaveClass('completed')
  })

  it('deletes a todo when delete button is clicked', () => {
    render(<TodoList />)
    const input = screen.getByPlaceholderText('Add a new task...')
    const addButton = screen.getByText('➕ Add')

    fireEvent.change(input, { target: { value: 'Test task' } })
    fireEvent.click(addButton)

    expect(screen.getByText('Test task')).toBeInTheDocument()

    const deleteButton = screen.getByLabelText('Delete task')
    fireEvent.click(deleteButton)

    expect(screen.queryByText('Test task')).not.toBeInTheDocument()
  })

  it('updates stats correctly', () => {
    render(<TodoList />)
    const input = screen.getByPlaceholderText('Add a new task...')
    const addButton = screen.getByText('➕ Add')

    // Add first task
    fireEvent.change(input, { target: { value: 'Task 1' } })
    fireEvent.click(addButton)

    // Add second task
    fireEvent.change(input, { target: { value: 'Task 2' } })
    fireEvent.click(addButton)

    // Check stats
    const stats = screen.getAllByText(/\d+/)
    expect(stats[0]).toHaveTextContent('2') // Total
    expect(stats[1]).toHaveTextContent('0') // Completed
    expect(stats[2]).toHaveTextContent('2') // Remaining

    // Complete first task
    const checkboxes = screen.getAllByRole('checkbox')
    fireEvent.click(checkboxes[0])

    // Stats should update
    const updatedStats = screen.getAllByText(/\d+/)
    expect(updatedStats[0]).toHaveTextContent('2') // Total
    expect(updatedStats[1]).toHaveTextContent('1') // Completed
    expect(updatedStats[2]).toHaveTextContent('1') // Remaining
  })

  it('clears input after adding a todo', () => {
    render(<TodoList />)
    const input = screen.getByPlaceholderText('Add a new task...') as HTMLInputElement
    const addButton = screen.getByText('➕ Add')

    fireEvent.change(input, { target: { value: 'Test task' } })
    fireEvent.click(addButton)

    expect(input.value).toBe('')
  })

  it('does not add empty todos', () => {
    render(<TodoList />)
    const addButton = screen.getByText('➕ Add')

    fireEvent.click(addButton)

    expect(screen.getByText(/No tasks yet!/)).toBeInTheDocument()
  })

  it('sets default priority to medium when adding a todo', () => {
    render(<TodoList />)
    const input = screen.getByPlaceholderText('Add a new task...')
    const addButton = screen.getByText('➕ Add')

    fireEvent.change(input, { target: { value: 'Test task' } })
    fireEvent.click(addButton)

    // Verify that the default priority is 'medium'
    const prioritySelects = screen.getAllByLabelText('Update priority')
    expect(prioritySelects[0]).toHaveValue('medium')
  })

  it('allows changing priority of existing todos', () => {
    render(<TodoList />)
    const input = screen.getByPlaceholderText('Add a new task...')
    const addButton = screen.getByText('➕ Add')

    fireEvent.change(input, { target: { value: 'Test task' } })
    fireEvent.click(addButton)

    const prioritySelect = screen.getByLabelText('Update priority')
    fireEvent.change(prioritySelect, { target: { value: 'high' } })

    expect(prioritySelect).toHaveValue('high')
  })

  it('displays high priority count in stats', () => {
    render(<TodoList />)
    const input = screen.getByPlaceholderText('Add a new task...')
    const prioritySelect = screen.getByLabelText('Select priority')
    const addButton = screen.getByText('➕ Add')

    // Add a high priority task
    fireEvent.change(input, { target: { value: 'Urgent task' } })
    fireEvent.change(prioritySelect, { target: { value: 'high' } })
    fireEvent.click(addButton)

    // Add a low priority task
    fireEvent.change(input, { target: { value: 'Low priority task' } })
    fireEvent.change(prioritySelect, { target: { value: 'low' } })
    fireEvent.click(addButton)

    const stats = screen.getAllByText(/\d+/)
    expect(stats[3]).toHaveTextContent('1') // High Priority count
  })
})
