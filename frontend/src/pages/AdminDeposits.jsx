import { useEffect, useMemo, useState } from 'react'
import { CheckCircle2, Clock3, DollarSign } from 'lucide-react'
import { adminApi } from '../services/adminApi'
import { AdminPanel, SectionTitle, StatTile, StatusPill, TinyBars } from '../components/admin/AdminPrimitives'

export default function AdminDeposits() {
  const [requests, setRequests] = useState([])
  const [error, setError] = useState('')

  const loadData = async () => {
    try {
      setRequests(await adminApi.getRequests())
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const deposits = useMemo(() => requests.filter((request) => request.type === 'deposit'), [requests])
  const pending = useMemo(() => deposits.filter((request) => request.status === 'pending').length, [deposits])
  const approvedAmount = useMemo(
    () => deposits.filter((request) => request.status === 'approved').reduce((sum, request) => sum + Number(request.amount), 0),
    [deposits],
  )
  const dailyBars = useMemo(() => {
    const now = Date.now()
    const day = 24 * 60 * 60 * 1000
    return Array.from({ length: 7 }).map((_, idx) => {
      const start = now - (6 - idx) * day
      const end = start + day
      return deposits
        .filter((request) => {
          const ts = new Date(request.createdAt || 0).getTime()
          return ts >= start && ts < end
        })
        .reduce((sum, request) => sum + Number(request.amount), 0)
    })
  }, [deposits])

  const updateStatus = async (requestId, status) => {
    try {
      await adminApi.updateRequestStatus(requestId, status)
      await loadData()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="space-y-5">
      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatTile icon={DollarSign} label="Total Recharges" value={String(deposits.length)} tone="from-cyan-500/25 to-cyan-400/10" />
        <StatTile icon={Clock3} label="Pending" value={String(pending)} tone="from-amber-500/25 to-amber-400/10" />
        <StatTile icon={CheckCircle2} label="Approved Value" value={`$${approvedAmount.toLocaleString()}`} tone="from-emerald-500/25 to-emerald-400/10" />
        <AdminPanel className="p-4">
          <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">7 Day Recharge Volume</p>
          <TinyBars values={dailyBars.length ? dailyBars : [1]} color="from-cyan-400 to-indigo-500" />
        </AdminPanel>
      </div>

      <AdminPanel className="p-5">
        <SectionTitle title="Recharge Requests" subtitle="Approve or reject incoming recharge requests" />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b border-white/[0.08]">
                <th className="py-3 pr-3">User ID</th>
                <th className="py-3 pr-3">Amount</th>
                <th className="py-3 pr-3">Status</th>
                <th className="py-3 pr-3">Created</th>
                <th className="py-3 pr-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {deposits.map((request) => (
                <tr key={request.id} className="border-b border-white/[0.06]">
                  <td className="py-3 pr-3 text-white">{request.userId}</td>
                  <td className="py-3 pr-3 text-cyan-300 font-medium">${Number(request.amount).toLocaleString()}</td>
                  <td className="py-3 pr-3"><StatusPill status={request.status} /></td>
                  <td className="py-3 pr-3 text-gray-300">{request.createdAt ? new Date(request.createdAt).toLocaleString() : 'N/A'}</td>
                  <td className="py-3 pr-3">
                    {request.status === 'pending' ? (
                      <div className="flex gap-2">
                        <button onClick={() => updateStatus(request.id, 'approved')} className="px-2.5 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-400/30 text-emerald-300">Approve</button>
                        <button onClick={() => updateStatus(request.id, 'rejected')} className="px-2.5 py-1.5 rounded-lg bg-red-500/20 border border-red-400/30 text-red-300">Reject</button>
                      </div>
                    ) : (
                      <span className="text-gray-500">Completed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminPanel>
    </div>
  )
}
