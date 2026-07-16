import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Eye, Clock, User, Mail, Phone, Globe, Briefcase, Shield } from 'lucide-react'
import { adminApi } from '../services/adminApi'
import { AdminPanel } from '../components/admin/AdminPrimitives'

export default function AdminPendingAccounts() {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [actionLoading, setActionLoading] = useState(null)

  const fetchAccounts = async () => {
    try {
      const data = await adminApi.getPendingAccounts()
      setAccounts(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAccounts() }, [])

  const handleApprove = async (userId) => {
    setActionLoading(userId)
    try {
      await adminApi.approveAccount(userId)
      setAccounts((prev) => prev.filter((u) => u.id !== userId))
      setSelectedUser(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (userId) => {
    const reason = prompt('Reason for rejection (optional):')
    setActionLoading(userId)
    try {
      await adminApi.rejectAccount(userId, reason || '')
      setAccounts((prev) => prev.filter((u) => u.id !== userId))
      setSelectedUser(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) return <div className="text-gray-400 text-sm">Loading pending accounts...</div>

  return (
    <div className="relative space-y-6">
      <div className="pointer-events-none absolute -top-20 left-[-6%] w-72 h-72 bg-amber-500/10 rounded-full blur-[100px]" />

      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white">Pending Accounts</h2>
          <p className="text-sm text-gray-400 mt-1">Review and approve new user registrations</p>
        </div>
        <span className="px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-sm font-medium">
          {accounts.length} pending
        </span>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      {accounts.length === 0 ? (
        <AdminPanel className="p-8 text-center">
          <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
          <p className="text-white font-semibold">All caught up!</p>
          <p className="text-sm text-gray-400 mt-1">No pending account registrations.</p>
        </AdminPanel>
      ) : (
        <div className="space-y-3">
          {accounts.map((account) => (
            <motion.div
              key={account.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#141421] via-[#10101a] to-[#0d0d15] p-4 sm:p-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-400/25 flex items-center justify-center text-amber-300">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">{account.firstName} {account.lastName}</p>
                    <p className="text-xs text-gray-400">{account.email} &bull; {account.username}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedUser(selectedUser?.id === account.id ? null : account)}
                    className="px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-gray-300 hover:bg-white/10 transition-colors text-sm flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" /> Details
                  </button>
                  <button
                    onClick={() => handleApprove(account.id)}
                    disabled={actionLoading === account.id}
                    className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 hover:bg-emerald-500/30 transition-colors text-sm font-medium flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> Approve
                  </button>
                  <button
                    onClick={() => handleReject(account.id)}
                    disabled={actionLoading === account.id}
                    className="px-4 py-2 rounded-xl bg-red-500/20 border border-red-400/30 text-red-300 hover:bg-red-500/30 transition-colors text-sm font-medium flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Reject
                  </button>
                </div>
              </div>

              {selectedUser?.id === account.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 pt-4 border-t border-white/[0.08] grid sm:grid-cols-2 lg:grid-cols-3 gap-3"
                >
                  <InfoRow icon={Phone} label="Phone" value={account.phone} />
                  <InfoRow icon={Globe} label="Country" value={account.country} />
                  <InfoRow icon={Clock} label="Registered" value={new Date(account.created_at).toLocaleString()} />
                  <InfoRow icon={Briefcase} label="Employment" value={account.employmentStatus} />
                  <InfoRow icon={Shield} label="Annual Income" value={account.annualIncome} />
                  <InfoRow icon={Shield} label="Net Worth" value={account.netWorth} />
                  <InfoRow icon={Shield} label="Source of Funds" value={account.sourceOfFunds} />
                  <InfoRow icon={Shield} label="Risk Tolerance" value={account.riskTolerance} />
                  <InfoRow icon={Shield} label="Trading Experience" value={account.yearsTrading} />
                  <InfoRow icon={Shield} label="US Citizen" value={account.usCitizen} />
                  <InfoRow icon={Shield} label="PEP Status" value={account.pepStatus} />
                  <InfoRow icon={Shield} label="Tax Residency" value={account.taxResidency} />
                  <InfoRow icon={Shield} label="Investment Horizon" value={account.investmentHorizon} />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <Icon className="w-3.5 h-3.5 text-gray-500" />
      <span className="text-gray-400">{label}:</span>
      <span className="text-white">{value || 'N/A'}</span>
    </div>
  )
}
