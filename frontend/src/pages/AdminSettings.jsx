import { useState } from 'react'
import { AlertTriangle, BellRing, Key, LockKeyhole, ShieldCheck, SlidersHorizontal, Trash2, X } from 'lucide-react'
import { adminApi } from '../services/adminApi'
import { AdminPanel, LineChart, SectionTitle } from '../components/admin/AdminPrimitives'

const SETTINGS_STORAGE_KEY = 'northstar_admin_settings'

const defaultSettings = {
  autoApproveDeposits: false,
  autoApproveWithdrawals: false,
  notifyOnLargeRequests: true,
  enforceTwoFactor: true,
  loginAlerts: true,
}

export default function AdminSettings() {
  const [settings, setSettings] = useState(() => {
    try {
      const raw = localStorage.getItem(SETTINGS_STORAGE_KEY)
      if (!raw) return defaultSettings
      const parsed = JSON.parse(raw)
      return { ...defaultSettings, ...parsed }
    } catch {
      return defaultSettings
    }
  })

  const [showResetModal, setShowResetModal] = useState(false)
  const [resetConfirm, setResetConfirm] = useState('')
  const [resetPassword, setResetPassword] = useState('')
  const [resetLoading, setResetLoading] = useState(false)
  const [resetMessage, setResetMessage] = useState('')

  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState('')

  const updateSettings = (next) => {
    setSettings(next)
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(next))
    } catch {
      // ignore storage errors silently
    }
  }

  const toggle = (key) => {
    const next = { ...settings, [key]: !settings[key] }
    updateSettings(next)
  }

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      setPasswordMessage('Please fill in all fields')
      return
    }
    if (newPassword.length < 8) {
      setPasswordMessage('New password must be at least 8 characters')
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage('New passwords do not match')
      return
    }

    setPasswordLoading(true)
    setPasswordMessage('')

    try {
      await adminApi.changePassword(currentPassword, newPassword)
      setPasswordMessage('Password changed successfully!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => {
        setShowPasswordModal(false)
        setPasswordMessage('')
      }, 2000)
    } catch (err) {
      setPasswordMessage(err.message)
    } finally {
      setPasswordLoading(false)
    }
  }

  const handleResetData = async () => {
    if (resetConfirm !== 'RESET') return
    
    setResetLoading(true)
    setResetMessage('')
    
    try {
      const result = await adminApi.resetData()
      setResetMessage(result.message || 'Data reset successfully')
      setResetConfirm('')
      setTimeout(() => {
        setShowResetModal(false)
        setResetMessage('')
      }, 2000)
    } catch (err) {
      setResetMessage(err.message)
    } finally {
      setResetLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="grid lg:grid-cols-3 gap-5">
        <AdminPanel className="p-5 lg:col-span-2">
          <SectionTitle title="Operational Controls" subtitle="Configure admin workflow behavior" />
          <div className="space-y-3">
            <ToggleRow icon={SlidersHorizontal} label="Auto-approve deposit requests" checked={settings.autoApproveDeposits} onToggle={() => toggle('autoApproveDeposits')} />
            <ToggleRow icon={SlidersHorizontal} label="Auto-approve withdrawal requests" checked={settings.autoApproveWithdrawals} onToggle={() => toggle('autoApproveWithdrawals')} />
            <ToggleRow icon={BellRing} label="Notify on large funding requests" checked={settings.notifyOnLargeRequests} onToggle={() => toggle('notifyOnLargeRequests')} />
          </div>
        </AdminPanel>

        <AdminPanel className="p-5">
          <SectionTitle title="Security Layer" subtitle="Admin protection controls" />
          <div className="space-y-3">
            <ToggleRow icon={ShieldCheck} label="Enforce two-factor for admins" checked={settings.enforceTwoFactor} onToggle={() => toggle('enforceTwoFactor')} />
            <ToggleRow icon={LockKeyhole} label="Send login anomaly alerts" checked={settings.loginAlerts} onToggle={() => toggle('loginAlerts')} />
          </div>
          <button onClick={() => setShowPasswordModal(true)} className="mt-4 w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-semibold hover:from-indigo-500 hover:to-cyan-400 transition-all flex items-center justify-center gap-2">
            <Key className="w-4 h-4" />
            Change Password
          </button>
        </AdminPanel>
      </div>

      <AdminPanel className="p-5">
        <SectionTitle title="Security Health Trend" subtitle="Illustrative security score over time" />
        <LineChart values={[68, 72, 74, 71, 78, 80, 82, 79, 84, 88, 90, 92]} stroke="#34d399" fill="rgba(52,211,153,0.14)" />
        <p className="text-xs text-gray-400 mt-2">This panel is UI-focused and keeps backend behavior unchanged, as requested.</p>
      </AdminPanel>

      <AdminPanel className="p-5 border-red-500/20">
        <SectionTitle title="Danger Zone" subtitle="Irreversible actions - proceed with caution" />
        <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h4 className="text-white font-medium">Reset All Client Data</h4>
              <p className="text-sm text-gray-400 mt-1">This will permanently delete all clients, trades, fund requests, and activity logs. Only admin accounts will remain.</p>
            </div>
            <button onClick={() => setShowResetModal(true)} className="px-4 py-2 rounded-lg bg-red-500/20 text-red-300 border border-red-400/30 hover:bg-red-500/30 transition-colors flex items-center gap-2">
              <Trash2 className="w-4 h-4" />
              Reset Data
            </button>
          </div>
        </div>
      </AdminPanel>

      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl border border-red-500/30 bg-gradient-to-br from-[#171726] to-[#101019] p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                Reset All Data
              </h3>
              <button onClick={() => { setShowResetModal(false); setResetConfirm(''); setResetMessage('') }} className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 mb-4">
              <p className="text-sm text-gray-200">This action will permanently delete:</p>
              <ul className="mt-2 text-sm text-gray-300 space-y-1">
                <li>• All client accounts</li>
                <li>• All trades (open and closed)</li>
                <li>• All deposit/withdrawal requests</li>
                <li>• All activity logs</li>
              </ul>
              <p className="mt-3 text-sm text-red-300 font-medium">Only admin accounts will remain.</p>
            </div>

            <div className="mb-4">
              <label className="text-sm text-gray-300 mb-2 block">Type <span className="text-red-400 font-mono">RESET</span> to confirm</label>
              <input
                type="text"
                value={resetConfirm}
                onChange={(e) => setResetConfirm(e.target.value)}
                placeholder="RESET"
                className="w-full px-4 py-2.5 rounded-xl bg-[#0a0a0f] border border-white/[0.12] text-white focus:outline-none focus:border-red-500"
              />
            </div>

            {resetMessage && (
              <div className={`mb-4 p-3 rounded-xl text-sm ${resetMessage.includes('success') || resetMessage.includes('removed') ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' : 'bg-red-500/20 text-red-300 border border-red-400/30'}`}>
                {resetMessage}
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={handleResetData} disabled={resetConfirm !== 'RESET' || resetLoading} className="flex-1 px-4 py-2.5 rounded-xl bg-red-500/20 text-red-300 border border-red-400/30 hover:bg-red-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {resetLoading ? 'Resetting...' : 'Confirm Reset'}
              </button>
              <button onClick={() => { setShowResetModal(false); setResetConfirm(''); setResetMessage('') }} className="flex-1 px-4 py-2.5 rounded-xl border border-white/20 text-gray-200 hover:bg-white/5 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    {showPasswordModal && (
      <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-3xl border border-white/[0.12] bg-gradient-to-br from-[#171726] to-[#101019] p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-cyan-400" />
              Change Password
            </h3>
            <button onClick={() => { setShowPasswordModal(false); setCurrentPassword(''); setNewPassword(''); setConfirmPassword(''); setPasswordMessage('') }} className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-300 mb-2 block">Current Password</label>
              <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-[#0a0a0f] border border-white/[0.12] text-white focus:outline-none focus:border-cyan-500" placeholder="Enter current password" />
            </div>

            <div>
              <label className="text-sm text-gray-300 mb-2 block">New Password</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-[#0a0a0f] border border-white/[0.12] text-white focus:outline-none focus:border-cyan-500" placeholder="Enter new password (min 8 chars)" />
            </div>

            <div>
              <label className="text-sm text-gray-300 mb-2 block">Confirm New Password</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-[#0a0a0f] border border-white/[0.12] text-white focus:outline-none focus:border-cyan-500" placeholder="Confirm new password" />
            </div>

            {passwordMessage && (
              <div className={`p-3 rounded-xl text-sm ${passwordMessage.includes('success') ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' : 'bg-red-500/20 text-red-300 border border-red-400/30'}`}>
                {passwordMessage}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button onClick={handleChangePassword} disabled={passwordLoading} className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-semibold hover:from-indigo-500 hover:to-cyan-400 transition-all disabled:opacity-50">
                {passwordLoading ? 'Changing...' : 'Change Password'}
              </button>
              <button onClick={() => { setShowPasswordModal(false); setCurrentPassword(''); setNewPassword(''); setConfirmPassword(''); setPasswordMessage('') }} className="flex-1 px-4 py-2.5 rounded-xl border border-white/20 text-gray-200 hover:bg-white/5 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
  )
}

function ToggleRow({ icon: Icon, label, checked, onToggle }) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#0d0d15] p-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
          <Icon className="w-4 h-4 text-cyan-300" />
        </div>
        <p className="text-sm text-white">{label}</p>
      </div>
      <button onClick={onToggle} className={`w-11 h-6 rounded-full p-0.5 transition-colors ${checked ? 'bg-emerald-500' : 'bg-white/20'}`}>
        <span className={`block w-5 h-5 rounded-full bg-white transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  )
}
