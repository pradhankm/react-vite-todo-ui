import { Todo } from './types'

const API = import.meta.env.VITE_API_BASE_URL as string | undefined

function lsKey() { return 'todos_v1' }

function readLocal(): Todo[] {
  const raw = localStorage.getItem(lsKey())
  return raw ? JSON.parse(raw) as Todo[] : []
}
function writeLocal(todos: Todo[]) {
  localStorage.setItem(lsKey(), JSON.stringify(todos))
}

export async function health(): Promise<'api' | 'local'> {
  if (!API) return 'local'
  try {
    const r = await fetch(`${API}/api/health`)
    if (!r.ok) throw new Error('bad')
    return 'api'
  } catch {
    return 'local'
  }
}

export async function listTodos(): Promise<Todo[]> {
  if (!API) return readLocal()
  const r = await fetch(`${API}/api/todos`)
  if (!r.ok) throw new Error('Failed to list')
  return r.json()
}

export async function createTodo(title: string): Promise<Todo> {
  const todo: Todo = { title, done: false }
  if (!API) {
    const todos = readLocal()
    todo.id = (todos.at(-1)?.id ?? 0) + 1
    todo.createdAt = new Date().toISOString()
    todos.push(todo)
    writeLocal(todos)
    return todo
  }
  const r = await fetch(`${API}/api/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(todo),
  })
  if (!r.ok) throw new Error('Failed to create')
  return r.json()
}

export async function toggleTodo(t: Todo): Promise<Todo> {
  const updated: Todo = { ...t, done: !t.done }
  if (!API) {
    const todos = readLocal().map(x => x.id === t.id ? updated : x)
    writeLocal(todos)
    return updated
  }
  const r = await fetch(`${API}/api/todos/${t.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: updated.title, done: updated.done }),
  })
  if (!r.ok) throw new Error('Failed to update')
  return r.json()
}

export async function deleteTodo(id: number): Promise<void> {
  if (!API) {
    writeLocal(readLocal().filter(x => x.id !== id))
    return
  }
  const r = await fetch(`${API}/api/todos/${id}`, { method: 'DELETE' })
  if (!r.ok) throw new Error('Failed to delete')
}
