import client from './client'
import type { AuthResponse, LoginRequest, RegisterRequest, User } from '@/types'

const DEMO_USER: User = {
  id: 'demo',
  name: 'Demo Chef',
  email: 'demo@ucook.app',
  createdAt: new Date().toISOString(),
}

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    try {
      const res = await client.post<AuthResponse>('/auth/login', data)
      return res.data
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Invalid email or password.')
      }
      // Offline demo fallback
      if (data.email === 'demo@ucook.app' && data.password === 'demo123') {
        return { user: DEMO_USER, token: 'demo-token' }
      }
      throw new Error('Backend offline. Use demo@ucook.app / demo123 to try the app.')
    }
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    try {
      const res = await client.post<AuthResponse>('/auth/register', data)
      return res.data
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      }
      // Offline fallback — create local session
      const user: User = {
        id: `local-${Date.now()}`,
        name: data.name,
        email: data.email,
        createdAt: new Date().toISOString(),
      }
      return { user, token: `local-token-${Date.now()}` }
    }
  },

  me: () =>
    client.get<User>('/auth/me').then((r) => r.data),
}
