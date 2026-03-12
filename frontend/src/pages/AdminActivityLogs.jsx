import { useEffect, useMemo, useState } from 'react'
import { Activity, Search } from 'lucide-react'
import { adminApi } from '../services/adminApi'
import { AdminPanel, SectionTitle, StatTile, TinyBars } from '../components/admin/AdminPrimitives'

export default function AdminActivityLogs() {
  const [logs, setLogs] = useState([])
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')

  useEffect(() => {
    adminApi.getLogs().then(setLogs).catch((err) => setError(err.message))
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return logs
    return logs.filter((log) => log.action.toLowerCase().includes(q) || String(log.userId || '').includes(q))
  }, [logs, query])

  const hourlyDistribution = useMemo(() => {
    const bins = Array(12).fill(0)
    filtered.forEach((log) => {
      const hour = new Date(log.createdAt).getHours()
      const bucket = Math.floor(hour / 2)
      bins[bucket] += 1
    })
    return bins
  }, [filtered])

  const latestTs = filtered[0]?.createdAt ? new Date(filtered[0].createdAt).toLocaleString() : 'N/A'

  return (
    <div className="space-y-5">
      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <StatTile icon={Activity} label="Logs Loaded" value={String(logs.length)} tone="from-indigo-500/25 to-cyan-400/10" />
        <StatTile icon={Activity} label="Filtered Results" value={String(filtered.length)} tone="from-cyan-500/25 to-cyan-400/10" />
        <AdminPanel className="p-4">
          <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">Activity by 2h window</p>
          <TinyBars values={hourlyDistribution.length ? hourlyDistribution : [1]} color="from-indigo-500 to-cyan-400" />
        </AdminPanel>
      </div>

      <AdminPanel className="p-5">
        <SectionTitle
          title="System Activity Logs"
          subtitle={`Latest event: ${latestTs}`}
          right={
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by action or user id"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-white/[0.12] bg-[#0c0c14] text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          }
        />

        <div className="space-y-2 max-h-[68vh] overflow-y-auto pr-1">
          {filtered.map((log) => (
            <div key={log.id} className="rounded-xl border border-white/[0.08] bg-[#0d0d15] p-3 flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-white">{log.action}</p>
                <p className="text-xs text-gray-400 mt-1">User ID: {log.userId || '-'}</p>
              </div>
              <p className="text-xs text-gray-500 whitespace-nowrap">{new Date(log.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </AdminPanel>
    </div>
  )
}
