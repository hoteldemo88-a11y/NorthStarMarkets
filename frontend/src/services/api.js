const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

export async function apiRequest(path, options = {}) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 10000)

  const token = localStorage.getItem('token')
  const isFormData = options.body instanceof FormData

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    })

    clearTimeout(timeoutId)

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      const message = data?.message || 'Request failed'
      throw new Error(message)
    }

    return data
  } catch (error) {
    clearTimeout(timeoutId)
    if (error.name === 'AbortError') {
      throw new Error('Request timeout')
    }
    throw error
  }
}

export async function getClientNotifications(since) {
  const query = since ? `?since=${encodeURIComponent(since)}` : ''
  return apiRequest(`/client/notifications${query}`)
}

export { API_BASE_URL }
