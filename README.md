# poc-frontend — React Frontend

React 18 + TypeScript + Vite. This is the **frontend** project; it holds no business
logic and reads/writes everything through the .NET API.

## Run

```powershell
npm install   # first time only
npm run dev
```

Opens on <http://localhost:5173>. Start the backend too, or the page shows
"Backend offline".

## Scripts

| Script              | Does                                     |
| ------------------- | ---------------------------------------- |
| `npm run dev`       | Dev server with HMR on port 5173         |
| `npm run build`     | Typecheck (`tsc -b`) then bundle to `dist/` |
| `npm run preview`   | Serve the built `dist/` locally          |
| `npm run typecheck` | Types only, no emit                      |

## Configuration

`VITE_API_BASE_URL` in `.env.development` points at the backend
(`http://localhost:5147`). Vite only exposes variables prefixed with `VITE_`, and they
are inlined at build time — so a change needs a dev-server restart.

Leaving it empty makes requests same-origin, which is what you want if you switch to
the dev-server proxy instead of CORS: uncomment the `proxy` block in `vite.config.ts`
and clear the variable.

## Layout

| Path                          | Purpose                                                     |
| ----------------------------- | ----------------------------------------------------------- |
| `src/main.tsx`                | Entry point, mounts `<App />`                                |
| `src/App.tsx`                 | Owns todo state, loads and mutates through the API           |
| `src/api/client.ts`           | Single `fetch` wrapper, `ApiError`, typed endpoint functions |
| `src/types.ts`                | TS mirrors of the backend models                             |
| `src/components/`             | `AddTodoForm`, `TodoList`, `TodoRow`, `BackendStatus`        |
| `src/index.css`               | Plain CSS with light/dark variables                          |

## How data flows

`App.tsx` keeps the todo list in `useState` and treats the server as the source of
truth: every mutation calls the API, then re-fetches `/api/todos`. That is deliberately
simple for a POC — the tradeoff is an extra round trip per change. For a real app, reach
for TanStack Query (caching, optimistic updates, retries) instead of growing this
pattern.

Network and HTTP failures both surface as `ApiError`. `client.ts` unwraps ASP.NET
`ProblemDetails` bodies so validation messages from the backend reach the error banner.
