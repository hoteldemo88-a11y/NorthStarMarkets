import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shield, Lock, Mail } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function AdminLogin() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(formData, 'admin')
      if (user.role !== 'admin') throw new Error('Admin access required')
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-3 sm:px-4 lg:px-6">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#12121a] to-[#0d0d12] p-8">
        <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-4">
          <Shield className="w-6 h-6 text-indigo-300" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-1">Admin Access</h1>
        <p className="text-gray-300 mb-6">Sign in to manage users, balances, and requests.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="admin@northstarmarkets.com"
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#0a0a0f] border border-white/[0.12] text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter password"
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#0a0a0f] border border-white/[0.12] text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-semibold hover:from-indigo-500 hover:to-cyan-400 transition-all disabled:opacity-50">
            {loading ? 'Signing in...' : 'Login as Admin'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}
