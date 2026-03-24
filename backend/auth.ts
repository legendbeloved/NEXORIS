export interface User {
  id: number
  email: string
  role: string
  password?: string
}

// Very small in-memory user store for MVP/auth MVP
export const users: User[] = [
  { id: 1, email: 'admin@example.com', role: 'admin', password: 'admin' },
  { id: 2, email: 'owner@example.com', role: 'owner', password: 'owner' },
  { id: 3, email: 'agent@example.com', role: 'agent', password: 'agent' },
]

export function loginUser(email: string, password: string): User | null {
  const u = users.find((u) => u.email === email)
  if (!u) return null
  if (!u.password || u.password !== password) return null
  // do not expose password
  return { id: u.id, email: u.email, role: u.role }
}

export function getUserByToken(token: string): User | null {
  // Very naive token scheme for MVP: if token equals 'admin-token' then return admin
  if (token === 'admin-token') {
    const u = users.find((u) => u.email === 'admin@example.com')
    return { id: u!.id, email: u!.email, role: u!.role }
  }
  // could extend for more roles
  return null
}
