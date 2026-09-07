import type { TodoItem } from '../types'
import { TodoRow } from './TodoRow'

interface TodoListProps {
  todos: TodoItem[]
  onToggle: (todo: TodoItem) => Promise<void>
  onRename: (todo: TodoItem, title: string) => Promise<void>
  onDelete: (todo: TodoItem) => Promise<void>
}

export function TodoList({ todos, onToggle, onRename, onDelete }: TodoListProps) {
  if (todos.length === 0) {
    return <p className="muted">Nothing here yet — add the first todo above.</p>
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoRow
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onRename={onRename}
          onDelete={onDelete}
        />
      ))}
    </ul>
  )
}
