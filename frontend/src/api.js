export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export async function api(path, options={}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  })
  if (!res.ok) throw new Error(`API error ${res.status}`)
  return res.json()
}
