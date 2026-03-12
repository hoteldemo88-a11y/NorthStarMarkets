import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, Outlet, useLocation } from 'react-router-dom'
import { LayoutDashboard, Shield, LogOut, Users, Download, Upload, CandlestickChart, Activity, Settings, Sparkles, Menu, X, Bell } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { apiRequest } from '../services/api'
import { adminApi } from '../services/adminApi'

export default function DashboardLayout() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [notifications, setNotifications] = useState({ pendingRequests: 0, newTrades: 0, newDepositRequests: 0, newWithdrawRequests: 0 })
  const [lastChecked, setLastChecked] = useState(() => new Date().toISOString())
  const notificationCheckRef = useRef(null)

  const checkNotifications = async () => {
    if (!user) return
    try {
      let notifs
      if (user.role === 'admin') {
        notifs = await adminApi.getNotifications(lastChecked)
      } else {
        notifs = await apiRequest(`/client/notifications${lastChecked ? `?since=${encodeURIComponent(lastChecked)}` : ''}`)
      }
      setNotifications(notifs)
      setLastChecked(new Date().toISOString())
    } catch (err) {
      console.error('Notification check failed:', err)
    }
  }

  useEffect(() => {
    checkNotifications()
    notificationCheckRef.current = setInterval(checkNotifications, 10000)
    return () => {
      if (notificationCheckRef.current) clearInterval(notificationCheckRef.current)
    }
  }, [user])

  if (!user) return <Navigate to="/login" replace />

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/users', label: 'Users', icon: Users },
    { to: '/admin/deposits', label: 'Recharges', icon: Download },
    { to: '/admin/withdrawals', label: 'Withdrawals', icon: Upload },
    { to: '/admin/trades', label: 'Trades', icon: CandlestickChart },
    { to: '/admin/activity-logs', label: 'Activity Logs', icon: Activity },
    { to: '/admin/settings', label: 'Settings', icon: Settings },
  ]

  const clientLinks = [
    { to: '/dashboard?section=main', label: 'Main Page', icon: LayoutDashboard },
    { to: '/dashboard?section=trade-history', label: 'Trade History', icon: CandlestickChart },
    { to: '/dashboard?section=profile', label: 'User Profile', icon: Users },
    { to: '/dashboard?section=recharge', label: 'Recharge', icon: Download },
    { to: '/dashboard?section=withdraw', label: 'Withdraw', icon: Upload },
    { to: '/dashboard?section=wallet-history', label: 'Wallet History', icon: Activity },
  ]
  const links = user.role === 'admin' ? adminLinks : clientLinks

  const activeNav = (to) => {
    if (to.includes('?')) return `${location.pathname}${location.search}` === to
    return location.pathname === to || location.pathname.startsWith(`${to}/`)
  }

  const pageTitle = links.find((link) => activeNav(link.to))?.label || (user.role === 'admin' ? 'Admin' : 'Client Dashboard')
  const headerIdentity = user.role === 'admin' ? 'Admin Session' : user.email

  const totalNotifications = user.role === 'admin' 
    ? notifications.pendingRequests + notifications.newTrades 
    : notifications.newTrades + notifications.newDepositRequests + notifications.newWithdrawRequests

  useEffect(() => {
    setIsSidebarOpen(false)
  }, [location.pathname, location.search])

  return (
    <div className="min-h-screen bg-[#090910] text-white overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute top-[-160px] left-[-140px] w-[420px] h-[420px] bg-cyan-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-160px] right-[-140px] w-[420px] h-[420px] bg-indigo-500/10 rounded-full blur-[120px]" />
      </div>
      {isSidebarOpen && <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm" aria-label="Close sidebar overlay" />}

      <div className="flex flex-col lg:block">
        <aside className={`fixed top-0 left-0 z-40 w-72 h-screen border-r border-white/[0.08] bg-[#0f0f18]/95 p-4 sm:p-5 backdrop-blur-xl flex flex-col transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between gap-2">
          <Link to="/" className="inline-flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
            North Star Markets
          </Link>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-white" aria-label="Close sidebar">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-3 flex items-center gap-2 text-sm text-gray-400">
            <Shield className="w-4 h-4" />
            {user.role === 'admin' ? 'Administrator' : 'Client Portal'}
          </div>

          <div className="mt-5 rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-3">
            <p className="text-xs text-cyan-200 flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> Admin Workspace</p>
            <p className="text-xs text-cyan-100/90 mt-1">Manage platform operations, funds, and risk in one place.</p>
          </div>

<nav className="mt-6 space-y-2 lg:flex-1 lg:overflow-y-auto lg:pr-1">
            {links.map((link) => {
              let showBadge = false
              if (user.role === 'admin' && link.to.includes('deposits') && notifications.pendingRequests > 0) {
                showBadge = true
              }
              if (user.role === 'admin' && link.to.includes('trades') && notifications.newTrades > 0) {
                showBadge = true
              }
              if (user.role === 'client' && link.to.includes('trade-history') && notifications.newTrades > 0) {
                showBadge = true
              }
              if (user.role === 'client' && link.to.includes('recharge') && notifications.newDepositRequests > 0) {
                showBadge = true
              }
              if (user.role === 'client' && link.to.includes('withdraw') && notifications.newWithdrawRequests > 0) {
                showBadge = true
              }
              
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl transition-colors ${activeNav(link.to) ? 'bg-gradient-to-r from-indigo-500/25 to-cyan-500/20 text-white border border-indigo-400/30 shadow-lg shadow-indigo-500/10' : 'text-gray-300 hover:bg-white/5'}`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                  {showBadge && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  )}
                </Link>
              )
            })}
          </nav>

          <button
            onClick={logout}
            className="mt-4 w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-red-300 bg-red-500/15 hover:bg-red-500/20 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </aside>

        <main className="relative flex-1 min-w-0 lg:ml-72">
          <header className="sticky top-0 z-20 border-b border-white/[0.08] bg-[#090910]/85 backdrop-blur-xl px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden w-10 h-10 rounded-xl border border-white/15 bg-white/5 text-white flex items-center justify-center" aria-label="Open sidebar">
                  <Menu className="w-5 h-5" />
                </button>
                <h1 className="text-xl sm:text-2xl font-bold text-white truncate">{pageTitle}</h1>
              </div>
              <div className="flex items-center gap-3">
                {totalNotifications > 0 && (
                  <div className="relative">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center">
                      <Bell className="w-4 h-4 text-cyan-300" />
                    </div>
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-400 text-[10px] font-bold text-black flex items-center justify-center">{totalNotifications > 9 ? '9+' : totalNotifications}</span>
                  </div>
                )}
                <div className="px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs sm:text-sm text-gray-300">{headerIdentity}</div>
              </div>
            </div>
          </header>

          <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
