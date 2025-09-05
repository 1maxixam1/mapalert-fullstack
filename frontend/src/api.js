export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'
export async function getMarks(){const r=await fetch(`${API_BASE}/api/marks`); if(!r.ok) throw new Error('err'); return r.json()}
export async function addMark(p){const r=await fetch(`${API_BASE}/api/marks`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(p)}); if(!r.ok) throw new Error('err'); return r.json()}
