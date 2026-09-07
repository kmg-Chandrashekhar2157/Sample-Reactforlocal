/** Mirrors Poc.Api.Models.TodoItem on the backend. */
export interface TodoItem {
  id: number
  title: string
  isComplete: boolean
  createdAt: string
}

export interface HealthResponse {
  status: string
  service: string
  timestamp: string
}
