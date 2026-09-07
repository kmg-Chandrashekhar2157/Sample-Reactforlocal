import type { HealthResponse, TodoItem } from '../types'

// Empty base URL means "same origin", which is what you want if you switch
// to the Vite dev-server proxy instead of CORS.
const BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...init?.headers,
      },
    })
  } catch {
    // fetch only rejects on network-level failures — usually the API isn't running.
    throw new ApiError(`Cannot reach the API at ${BASE_URL || 'the current origin'}`, 0)
  }

  if (!response.ok) {
    throw new ApiError(await describeFailure(response), response.status)
  }

  // 204 No Content (DELETE) has no body to parse.
  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}

/** Turns an ASP.NET ProblemDetails / validation payload into a readable message. */
async function describeFailure(response: Response): Promise<string> {
  try {
    const problem = await response.json()
    const validationErrors: string[] = Object.values(problem?.errors ?? {}).flat() as string[]
    if (validationErrors.length > 0) {
      return validationErrors.join(' ')
    }
    if (typeof problem?.title === 'string') {
      return problem.title
    }
  } catch {
    // Non-JSON error body; fall through to the generic message.
  }

  return `Request failed with status ${response.status}`
}

export const api = {
  getHealth: () => request<HealthResponse>('/api/health'),

  getTodos: () => request<TodoItem[]>('/api/todos'),

  createTodo: (title: string) =>
    request<TodoItem>('/api/todos', {
      method: 'POST',
      body: JSON.stringify({ title }),
    }),

  updateTodo: (id: number, title: string, isComplete: boolean) =>
    request<TodoItem>(`/api/todos/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ title, isComplete }),
    }),

  deleteTodo: (id: number) => request<void>(`/api/todos/${id}`, { method: 'DELETE' }),
}
