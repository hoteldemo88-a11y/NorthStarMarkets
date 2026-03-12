import { useState } from 'react'
import { BellRing, LockKeyhole, ShieldCheck, SlidersHorizontal } from 'lucide-react'
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
        </AdminPanel>
      </div>

      <AdminPanel className="p-5">
        <SectionTitle title="Security Health Trend" subtitle="Illustrative security score over time" />
        <LineChart values={[68, 72, 74, 71, 78, 80, 82, 79, 84, 88, 90, 92]} stroke="#34d399" fill="rgba(52,211,153,0.14)" />
        <p className="text-xs text-gray-400 mt-2">This panel is UI-focused and keeps backend behavior unchanged, as requested.</p>
      </AdminPanel>
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
