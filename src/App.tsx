import { useEffect, useMemo, useState } from 'react'
import { Todo } from './types'
import { health, listTodos, createTodo, toggleTodo, deleteTodo } from './api'

export default function App() {
  const [mode, setMode] = useState<'api'|'local'>('local')
  const [todos, setTodos] = useState<Todo[]>([])
  const [title, setTitle] = useState('')
  const [error, setError] = useState<string | null>(null)

  const remaining = useMemo(() => todos.filter(t => !t.done).length, [todos])

  async function refresh() {
    const m = await health()
    setMode(m)
    const data = await listTodos()
    setTodos(data)
  }

  useEffect(() => {
    refresh().catch(e => setError(String(e)))
  }, [])

  async function onAdd() {
    setError(null)
    const v = title.trim()
    if (!v) return
    try {
      const created = await createTodo(v)
      setTitle('')
      setTodos(prev => [...prev, created])
    } catch (e) {
      setError(String(e))
    }
  }

  async function onToggle(t: Todo) {
    if (!t.id) return
    setError(null)
    try {
      const updated = await toggleTodo(t)
      setTodos(prev => prev.map(x => x.id === updated.id ? updated : x))
    } catch (e) {
      setError(String(e))
    }
  }

  async function onDelete(id?: number) {
    if (!id) return
    setError(null)
    try {
      await deleteTodo(id)
      setTodos(prev => prev.filter(x => x.id !== id))
    } catch (e) {
      setError(String(e))
    }
  }

  return (
    <div className="container">
      <h1>Todo UI</h1>
      <p className="small">
        Mode: <span className="badge">{mode.toUpperCase()}</span> • Remaining: {remaining} • Total: {todos.length}
      </p>

      <div className="card">
        <div className="row">
          <input
            style={{ flex: 1 }}
            value={title}
            placeholder="Add a todo…"
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' ? onAdd() : null}
          />
          <button onClick={onAdd}>Add</button>
          <button onClick={() => refresh()}>Refresh</button>
        </div>

        {error && <p className="small" style={{ color: '#ffb4b4' }}>{error}</p>}

        <div className="list">
          {todos.map(t => (
            <div className="item" key={t.id}>
              <label style={{ display: 'flex', gap: 10, alignItems: 'center', flex: 1 }}>
                <input type="checkbox" checked={t.done} onChange={() => onToggle(t)} />
                <span style={{ textDecoration: t.done ? 'line-through' : 'none' }}>{t.title}</span>
              </label>
              <button onClick={() => onDelete(t.id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>

      <p className="small" style={{ marginTop: 12 }}>
        Tip: Start the Spring Boot API and run with <code>VITE_API_BASE_URL</code> to showcase full-stack integration.
      </p>
    </div>
  )
}
