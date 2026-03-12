import { apiRequest } from './api'

export const adminApi = {
  getUsers: () => apiRequest('/admin/users'),
  getUser: (userId) => apiRequest(`/admin/users/${userId}`),
  getTrades: () => apiRequest('/admin/trades'),
  getRequests: () => apiRequest('/admin/requests'),
  getLogs: () => apiRequest('/admin/activity-logs'),
  login: (payload) => apiRequest('/admin/login', { method: 'POST', body: JSON.stringify(payload) }),
  changePassword: (currentPassword, newPassword) => apiRequest('/admin/change-password', { method: 'POST', body: JSON.stringify({ currentPassword, newPassword }) }),
  updateBalance: (userId, delta) => apiRequest(`/admin/users/${userId}/balance`, { method: 'PATCH', body: JSON.stringify({ delta }) }),
  updateRequestStatus: (requestId, status) => apiRequest(`/admin/requests/${requestId}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  createTrade: (payload) => apiRequest('/admin/trades', { method: 'POST', body: JSON.stringify(payload) }),
  closeTrade: (tradeId, pnl, exitPrice) => apiRequest(`/admin/trades/${tradeId}/close`, { method: 'PATCH', body: JSON.stringify({ pnl, exitPrice }) }),
  suspendUser: (userId) => apiRequest(`/admin/users/${userId}/suspend`, { method: 'PATCH' }),
  deleteUser: (userId) => apiRequest(`/admin/users/${userId}`, { method: 'DELETE' }),
  resetData: () => apiRequest('/admin/reset-data', { method: 'POST' }),
  getNotifications: (since) => apiRequest(`/admin/notifications${since ? `?since=${encodeURIComponent(since)}` : ''}`),
}
