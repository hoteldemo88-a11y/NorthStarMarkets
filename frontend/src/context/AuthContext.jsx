import { createContext, useContext, useMemo, useState, useCallback, useEffect } from 'react'

const AuthContext = createContext(null)

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token && !localStorage.getItem('demoMode')) {
      setLoading(false)
    } else {
      setLoading(false)
    }
  }, [])

  const login = useCallback(async (credentials, role = 'client') => {
    setLoading(true)
    try {
      const endpoint = role === 'admin' ? '/admin/login' : '/auth/login'
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Login failed')
      setUser(data.user)
      localStorage.setItem('token', data.token)
      return data.user
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const register = useCallback(async (data) => {
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const res = await response.json()
      if (!response.ok) throw new Error(res.message || 'Registration failed')
      setUser(res.user)
      localStorage.setItem('token', res.token)
      return res.user
    } catch (error) {
      if (error.message === 'Failed to fetch' || error.message.includes('NetworkError') || error.message.includes('connection')) {
        const mockUser = { id: Date.now(), email: data.email, username: data.username, role: 'client', name: `${data.firstName} ${data.lastName}` }
        setUser(mockUser)
        localStorage.setItem('token', 'mock-token-' + Date.now())
        localStorage.setItem('demoMode', 'true')
        return mockUser
      }
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('demoMode')
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === 'admin',
      login,
      register,
      logout,
      setUser,
    }),
    [user, loading, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
