import { useCallback, useEffect, useState } from 'react'
import { api, ApiError } from './api/client'
import type { TodoItem } from './types'
import { TodoList } from './components/TodoList'
import { AddTodoForm } from './components/AddTodoForm'
import { BackendStatus } from './components/BackendStatus'

export default function App() {
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadTodos = useCallback(async () => {
    setIsLoading(true)
    try {
      setTodos(await api.getTodos())
      setError(null)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong loading todos.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadTodos()
  }, [loadTodos])

  /** Runs a mutation, then refreshes from the API so the server stays the source of truth. */
  const mutate = async (action: () => Promise<unknown>) => {
    try {
      await action()
      setError(null)
      setTodos(await api.getTodos())
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong.')
    }
  }

  return (
    <div className="page">
      <header className="page__header">
        <h1>React + .NET POC</h1>
        <p className="page__subtitle">
          A Vite/React frontend calling an ASP.NET Core Web API over CORS.
        </p>
        <BackendStatus />
      </header>

      <main className="card">
        <AddTodoForm onAdd={(title) => mutate(() => api.createTodo(title))} />

        {error && (
          <p className="alert" role="alert">
            {error}
            <button type="button" className="alert__retry" onClick={() => void loadTodos()}>
              Retry
            </button>
          </p>
        )}

        {isLoading ? (
          <p className="muted">Loading todos…</p>
        ) : (
          <TodoList
            todos={todos}
            onToggle={(todo) =>
              mutate(() => api.updateTodo(todo.id, todo.title, !todo.isComplete))
            }
            onRename={(todo, title) => mutate(() => api.updateTodo(todo.id, title, todo.isComplete))}
            onDelete={(todo) => mutate(() => api.deleteTodo(todo.id))}
          />
        )}
      </main>

      <footer className="page__footer muted">
        API base URL: <code>{import.meta.env.VITE_API_BASE_URL || '(same origin)'}</code>
      </footer>
    </div>
  )
}
