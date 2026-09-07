import { useState } from 'react'

interface AddTodoFormProps {
  onAdd: (title: string) => Promise<void>
}

export function AddTodoForm({ onAdd }: AddTodoFormProps) {
  const [title, setTitle] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const trimmed = title.trim()
    if (trimmed.length === 0) {
      return
    }

    setIsSaving(true)
    try {
      await onAdd(trimmed)
      setTitle('')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <input
        className="add-form__input"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="What needs doing?"
        maxLength={200}
        aria-label="New todo title"
      />
      <button className="button" type="submit" disabled={isSaving || title.trim().length === 0}>
        {isSaving ? 'Adding…' : 'Add'}
      </button>
    </form>
  )
}
