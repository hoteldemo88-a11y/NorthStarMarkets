const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem('token')
  const isFormData = options.body instanceof FormData

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const message = data?.message || 'Request failed'
    throw new Error(message)
  }

  return data
}

export async function getClientNotifications(since) {
  const query = since ? `?since=${encodeURIComponent(since)}` : ''
  return apiRequest(`/client/notifications${query}`)
}

export { API_BASE_URL }
