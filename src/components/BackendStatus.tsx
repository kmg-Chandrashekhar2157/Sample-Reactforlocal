import { useEffect, useState } from 'react'
import { api } from '../api/client'

type Status = 'checking' | 'online' | 'offline'

/** Pings /api/health so it's obvious at a glance whether the .NET project is running. */
export function BackendStatus() {
  const [status, setStatus] = useState<Status>('checking')
  const [service, setService] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    api
      .getHealth()
      .then((health) => {
        if (!cancelled) {
          setService(health.service)
          setStatus('online')
        }
      })
      .catch(() => {
        if (!cancelled) {
          setStatus('offline')
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  const label = {
    checking: 'Checking backend…',
    online: `Backend online${service ? ` — ${service}` : ''}`,
    offline: 'Backend offline — run `dotnet run` in the backend project',
  }[status]

  return (
    <p className={`status status--${status}`}>
      <span className="status__dot" aria-hidden="true" />
      {label}
    </p>
  )
}
