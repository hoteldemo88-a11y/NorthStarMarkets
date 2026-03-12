import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { apiRequest } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setLoading(false)
      return
    }

    apiRequest('/auth/me')
      .then((res) => setUser(res.user))
      .catch(() => {
        localStorage.removeItem('token')
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const login = async (payload, role = 'client') => {
    const endpoint = role === 'admin' ? '/admin/login' : '/auth/login'
    const res = await apiRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    localStorage.setItem('token', res.token)
    setUser(res.user)
    return res.user
  }

  const register = async (payload) => {
    const res = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    localStorage.setItem('token', res.token)
    setUser(res.user)
    return res.user
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

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
    [user, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
