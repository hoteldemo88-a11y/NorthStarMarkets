import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Activity, ArrowRight, Bell, ClipboardList, ShieldCheck, Sparkles, Users, Wallet, X } from 'lucide-react'
import { adminApi } from '../services/adminApi'
import { AdminPanel, LineChart, SectionTitle, StatTile, StatusPill, TinyBars } from '../components/admin/AdminPrimitives'

export default function AdminDashboard() {
  const [users, setUsers] = useState([])
  const [requests, setRequests] = useState([])
  const [logs, setLogs] = useState([])
  const [error, setError] = useState('')

  const [notifications, setNotifications] = useState({ pendingRequests: 0, newTrades: 0 })
  const [lastChecked, setLastChecked] = useState(() => new Date().toISOString())
  const [notificationPopup, setNotificationPopup] = useState({ open: false, title: '', message: '' })
  const notificationCheckRef = useRef(null)
  const notifPopupTimerRef = useRef(null)

  const checkNotifications = async () => {
    try {
      const notifs = await adminApi.getNotifications(lastChecked)
      const totalNew = notifs.pendingRequests + notifs.newTrades
      
      if (totalNew > 0) {
        let message = ''
        if (notifs.pendingRequests > 0) message += `${notifs.pendingRequests} pending request${notifs.pendingRequests > 1 ? 's' : ''} `
        if (notifs.newTrades > 0) message += `${notifs.newTrades} new trade${notifs.newTrades > 1 ? 's' : ''} `
        
        setNotificationPopup({ open: true, title: 'New Activity', message: message.trim() })
        
        if (notifPopupTimerRef.current) clearTimeout(notifPopupTimerRef.current)
        notifPopupTimerRef.current = setTimeout(() => {
          setNotificationPopup((prev) => ({ ...prev, open: false }))
          notifPopupTimerRef.current = null
        }, 4000)
      }
      
      setNotifications(notifs)
      setLastChecked(new Date().toISOString())
    } catch (err) {
      console.error('Notification check failed:', err)
    }
  }

  useEffect(() => {
    Promise.all([adminApi.getUsers(), adminApi.getRequests(), adminApi.getLogs()])
      .then(([usersRes, requestsRes, logsRes]) => {
        setUsers(usersRes)
        setRequests(requestsRes)
        setLogs(logsRes)
      })
      .catch((err) => setError(err.message))

    checkNotifications()
    notificationCheckRef.current = setInterval(checkNotifications, 10000)
    
    return () => {
      if (notificationCheckRef.current) clearInterval(notificationCheckRef.current)
      if (notifPopupTimerRef.current) clearTimeout(notifPopupTimerRef.current)
    }
  }, [])

  const pendingRequests = useMemo(() => requests.filter((request) => request.status === 'pending').length, [requests])
  const totalBalances = useMemo(() => users.reduce((sum, user) => sum + Number(user.balance), 0), [users])

  const statusTotals = useMemo(
    () => ({
      approved: requests.filter((request) => request.status === 'approved').length,
      pending: requests.filter((request) => request.status === 'pending').length,
      rejected: requests.filter((request) => request.status === 'rejected').length,
    }),
    [requests],
  )

  const weeklyFundingFlow = useMemo(() => {
    const now = Date.now()
    const day = 24 * 60 * 60 * 1000
    return Array.from({ length: 7 }).map((_, idx) => {
      const dayStart = now - (6 - idx) * day
      const dayEnd = dayStart + day
      return requests
        .filter((request) => {
          const ts = new Date(request.createdAt || 0).getTime()
          return ts >= dayStart && ts < dayEnd && request.status === 'approved'
        })
        .reduce((sum, request) => sum + Number(request.amount), 0)
    })
  }, [requests])

  const topUserBalances = useMemo(() => {
    return [...users]
      .sort((a, b) => Number(b.balance) - Number(a.balance))
      .slice(0, 6)
  }, [users])

  const latestRequest = requests[0]
  const latestLog = logs[0]

  return (
    <div className="relative space-y-6">
      {notificationPopup.open && (
        <motion.div
          initial={{ opacity: 0, y: -12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8 }}
          className="fixed z-[75] top-4 sm:top-6 left-4 sm:left-auto sm:right-6 sm:w-[380px] rounded-2xl border bg-cyan-500/15 border-cyan-400/35 p-4 shadow-2xl backdrop-blur-xl"
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center bg-cyan-500/20 text-cyan-300">
              <Bell className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">{notificationPopup.title}</p>
              <p className="text-xs text-gray-200 mt-1">{notificationPopup.message}</p>
            </div>
            <button
              onClick={() => setNotificationPopup((prev) => ({ ...prev, open: false }))}
              className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-gray-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      <div className="pointer-events-none absolute -top-20 left-[-6%] w-72 h-72 bg-cyan-500/10 rounded-full blur-[100px]" />
      <div className="pointer-events-none absolute top-80 right-[-6%] w-72 h-72 bg-indigo-500/10 rounded-full blur-[100px]" />

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <section className="relative overflow-hidden rounded-3xl border border-white/[0.1] bg-gradient-to-br from-[#1a1a2a] via-[#121221] to-[#101019] p-5 sm:p-6">
        <div className="absolute -top-24 -right-20 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-16 w-56 h-56 bg-indigo-500/15 rounded-full blur-3xl" />

        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-gray-300 text-sm">Admin Control Center</p>
              {(notifications.pendingRequests > 0 || notifications.newTrades > 0) && (
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse" />
                  New
                </span>
              )}
            </div>
            <p className="text-3xl sm:text-4xl font-bold text-white mt-1">${totalBalances.toLocaleString()}</p>
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 text-emerald-200 text-xs">
              <ShieldCheck className="w-3.5 h-3.5" />
              Platform integrity monitoring active
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-3 min-w-[230px]">
            <HeroMetric label="Users" value={String(users.length)} />
            <HeroMetric label="Pending" value={String(pendingRequests)} />
            <HeroMetric label="Requests" value={String(requests.length)} />
            <HeroMetric label="Logs" value={String(logs.length)} />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-white/[0.08] bg-[#12121a] px-4 sm:px-5 py-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-400/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-cyan-300" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Live Operations Insight</h3>
            <p className="text-sm text-gray-300 mt-0.5">
              {latestRequest ? `Latest request: ${(latestRequest.type === 'deposit' ? 'RECHARGE' : latestRequest.type.toUpperCase())} by User ${latestRequest.userId}.` : 'No request activity yet.'}
              {' '}
              {latestLog ? `Last log: ${latestLog.action}` : ''}
            </p>
          </div>
        </div>
      </section>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatTile icon={Users} label="Total Users" value={String(users.length)} tone="from-cyan-500/25 to-cyan-400/10" />
        <StatTile icon={ClipboardList} label="Pending Requests" value={String(pendingRequests)} tone={pendingRequests > 0 ? "from-amber-500/40 to-amber-400/20" : "from-amber-500/25 to-amber-400/10"} highlight={pendingRequests > 0} />
        <StatTile icon={Wallet} label="Total Balances" value={`$${totalBalances.toLocaleString()}`} tone="from-emerald-500/25 to-emerald-400/10" />
        <StatTile icon={Activity} label="Activity Logs Count" value={String(logs.length)} tone="from-indigo-500/25 to-indigo-400/10" />
      </div>

      <div className="grid xl:grid-cols-3 gap-5">
        <AdminPanel className="p-5 xl:col-span-2">
          <SectionTitle title="Funding Performance" subtitle="Approved funding volume in the last 7 days" />
          <LineChart values={weeklyFundingFlow} stroke="#22d3ee" fill="rgba(34,211,238,0.13)" />
          <div className="grid grid-cols-7 gap-2 mt-2 text-[11px] text-gray-500">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((label) => (
              <span key={label} className="text-center">{label}</span>
            ))}
          </div>
        </AdminPanel>

        <AdminPanel className="p-5">
          <SectionTitle title="Request Outcomes" subtitle="Current status distribution" />
          <div className="space-y-3">
            <Row label="Approved" value={statusTotals.approved} tone="bg-emerald-500/20 text-emerald-300" />
            <Row label="Pending" value={statusTotals.pending} tone="bg-amber-500/20 text-amber-300" />
            <Row label="Rejected" value={statusTotals.rejected} tone="bg-red-500/20 text-red-300" />
          </div>
          <div className="mt-5">
            <TinyBars values={[statusTotals.approved, statusTotals.pending, statusTotals.rejected]} color="from-indigo-500 to-cyan-400" />
          </div>
        </AdminPanel>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <AdminPanel className="p-5">
          <SectionTitle
            title="Top User Balances"
            subtitle="Highest account balances"
            right={<Link to="/admin/users" className="text-sm text-cyan-300 hover:text-cyan-200 inline-flex items-center gap-1">View users <ArrowRight className="w-4 h-4" /></Link>}
          />
          <div className="space-y-2">
            {topUserBalances.map((user) => (
              <div key={user.id} className="rounded-xl border border-white/[0.08] bg-gradient-to-r from-[#0d0d15] to-[#111120] p-3 flex items-center justify-between gap-2">
                <div>
                  <p className="text-sm text-white">{user.username}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
                <p className="text-sm text-cyan-300 font-semibold">${Number(user.balance).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </AdminPanel>

        <AdminPanel className="p-5">
          <SectionTitle
            title="Live Queue"
            subtitle="Latest recharge and withdrawal requests"
            right={<Link to="/admin/deposits" className="text-sm text-cyan-300 hover:text-cyan-200 inline-flex items-center gap-1">Manage <ArrowRight className="w-4 h-4" /></Link>}
          />
          <div className="space-y-2">
            {requests.slice(0, 7).map((request) => (
              <div key={request.id} className="rounded-xl border border-white/[0.08] bg-gradient-to-r from-[#0d0d15] to-[#111120] p-3 flex items-center justify-between gap-2">
                <div>
                  <p className="text-sm text-white">{request.type === 'deposit' ? 'RECHARGE' : request.type.toUpperCase()} • User {request.userId}</p>
                  <p className="text-xs text-gray-400">${Number(request.amount).toLocaleString()}</p>
                </div>
                <StatusPill status={request.status} />
              </div>
            ))}
          </div>
        </AdminPanel>
      </div>
    </div>
  )
}

function HeroMetric({ label, value }) {
  return (
    <div className="rounded-xl border border-white/[0.1] bg-white/[0.03] px-3 py-2">
      <p className="text-[11px] uppercase tracking-wide text-gray-400">{label}</p>
      <p className="text-base font-semibold text-white mt-0.5">{value}</p>
    </div>
  )
}

function Row({ label, value, tone }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-[#0d0d15] px-3 py-2.5">
      <span className="text-sm text-gray-200">{label}</span>
      <span className={`text-xs px-2.5 py-1 rounded-full ${tone}`}>{value}</span>
    </div>
  )
}
