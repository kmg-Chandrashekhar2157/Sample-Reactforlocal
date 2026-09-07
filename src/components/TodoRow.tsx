import { useState } from 'react'
import type { TodoItem } from '../types'

interface TodoRowProps {
  todo: TodoItem
  onToggle: (todo: TodoItem) => Promise<void>
  onRename: (todo: TodoItem, title: string) => Promise<void>
  onDelete: (todo: TodoItem) => Promise<void>
}

export function TodoRow({ todo, onToggle, onRename, onDelete }: TodoRowProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(todo.title)

  const commitRename = async () => {
    const trimmed = draft.trim()
    setIsEditing(false)

    if (trimmed.length === 0 || trimmed === todo.title) {
      setDraft(todo.title)
      return
    }

    await onRename(todo, trimmed)
  }

  return (
    <li className={`todo${todo.isComplete ? ' todo--done' : ''}`}>
      <input
        type="checkbox"
        checked={todo.isComplete}
        onChange={() => void onToggle(todo)}
        aria-label={`Mark "${todo.title}" as ${todo.isComplete ? 'incomplete' : 'complete'}`}
      />

      {isEditing ? (
        <input
          className="todo__edit"
          value={draft}
          autoFocus
          maxLength={200}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={() => void commitRename()}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              void commitRename()
            } else if (event.key === 'Escape') {
              setDraft(todo.title)
              setIsEditing(false)
            }
          }}
        />
      ) : (
        <button
          type="button"
          className="todo__title"
          onClick={() => {
            setDraft(todo.title)
            setIsEditing(true)
          }}
          title="Click to rename"
        >
          {todo.title}
        </button>
      )}

      <time className="todo__date muted" dateTime={todo.createdAt}>
        {new Date(todo.createdAt).toLocaleDateString()}
      </time>

      <button
        type="button"
        className="todo__delete"
        onClick={() => void onDelete(todo)}
        aria-label={`Delete "${todo.title}"`}
      >
        ×
      </button>
    </li>
  )
}
