import { useEffect, useMemo, useState } from 'react'
import { CalendarDays, CandlestickChart, CheckCircle2, CircleDollarSign, TrendingUp, X } from 'lucide-react'
import { adminApi } from '../services/adminApi'
import { AdminPanel, LineChart, SectionTitle, StatTile } from '../components/admin/AdminPrimitives'

const commodityOptions = ['gold', 'silver', 'crude oil', 'natural gas', 'coffee', 'wheat', 'soy beans', 'orange juice', 'us dollar']

const commodityTicketMap = {
  gold: 'XAUUSD',
  silver: 'XAGUSD',
  'crude oil': 'USOIL',
  'natural gas': 'NATGAS',
  coffee: 'COFFEE',
  wheat: 'WHEAT',
  'soy beans': 'SOYBEAN',
  'orange juice': 'OJUSD',
  'us dollar': 'DXY',
}

const defaultTrade = { userEmail: '', commodity: 'gold', amount: '1', tradeDate: '', contractExpiry: '', entryPrice: '', tickerSymbol: '', strikePrice: '', status: 'open' }

export default function AdminTrades() {
  const [formData, setFormData] = useState(defaultTrade)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [users, setUsers] = useState([])
  const [showUserSuggestions, setShowUserSuggestions] = useState(false)
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false)
  const [trades, setTrades] = useState([])
  const [closeStateByTrade, setCloseStateByTrade] = useState({})

  const loadUsers = async () => {
    try {
      const rows = await adminApi.getUsers()
      const clients = rows.filter((user) => user.role === 'client')
      setUsers(clients)
      if (!formData.userEmail && clients[0]?.email) {
        setFormData((prev) => ({ ...prev, userEmail: clients[0].email }))
      }
    } catch {
      setUsers([])
    }
  }

  const loadTrades = async () => {
    try {
      setTrades(await adminApi.getTrades())
    } catch {
      setTrades([])
    }
  }

  useEffect(() => {
    loadUsers()
    loadTrades()
  }, [])

  const totalClientBalance = useMemo(() => users.reduce((sum, user) => sum + Number(user.balance), 0), [users])
  const selectedUser = useMemo(() => users.find((user) => user.email === formData.userEmail), [users, formData.userEmail])

  const filteredUsers = useMemo(() => {
    const q = formData.userEmail.trim().toLowerCase()
    if (!q) return users.slice(0, 8)
    return users.filter((user) => user.email.toLowerCase().includes(q) || user.username.toLowerCase().includes(q)).slice(0, 8)
  }, [users, formData.userEmail])

  const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')
    setSubmitting(true)
    try {
      await adminApi.createTrade({
        userEmail: formData.userEmail,
        symbol: formData.commodity,
        side: 'buy',
        volume: Number(formData.amount),
        status: formData.status,
        tradeDate: formData.tradeDate,
        contractExpiry: formData.contractExpiry,
        entryPrice: formData.entryPrice,
        tickerSymbol: formData.tickerSymbol,
        strikePrice: formData.strikePrice,
      })
      setMessage('Trade created successfully')
      setIsSuccessPopupOpen(true)
      setFormData((prev) => ({ ...defaultTrade, userEmail: prev.userEmail || users[0]?.email || '' }))
      await loadTrades()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const closeTrade = async (tradeId) => {
    const state = closeStateByTrade[tradeId] || {}
    const pnlValue = Number(state.pnl)
    const exitPrice = state.exitPrice

    if (!Number.isFinite(pnlValue)) {
      setError('Enter valid P/L before closing')
      return
    }

    try {
      setError('')
      setMessage('')
      await adminApi.closeTrade(tradeId, pnlValue, exitPrice)
      setMessage('Trade closed and balance settled')
      setCloseStateByTrade((prev) => ({ ...prev, [tradeId]: { pnl: '', exitPrice: '' } }))
      await Promise.all([loadTrades(), loadUsers()])
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <StatTile icon={CandlestickChart} label="Tradable Clients" value={String(users.length)} tone="from-cyan-500/25 to-cyan-400/10" />
        <StatTile icon={CircleDollarSign} label="Total Client Balance" value={`$${totalClientBalance.toLocaleString()}`} tone="from-emerald-500/25 to-emerald-400/10" />
        <AdminPanel className="p-4">
          <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">Commodity Momentum</p>
          <LineChart values={[18, 24, 22, 30, 36, 34, 40, 44, 41, 48]} stroke="#a78bfa" fill="rgba(167,139,250,0.15)" />
        </AdminPanel>
      </div>

      <div className="grid xl:grid-cols-3 gap-5">
        <AdminPanel className="p-5 xl:col-span-2">
          <SectionTitle title="Create and Manage Trades" subtitle="Open a commodity position with investment amount and execution date." />

          <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="relative">
              <label className="text-sm text-gray-300 mb-2 block">User Email</label>
              <input
                name="userEmail"
                value={formData.userEmail}
                onChange={(e) => {
                  handleChange(e)
                  setShowUserSuggestions(true)
                }}
                onFocus={() => setShowUserSuggestions(true)}
                onBlur={() => setTimeout(() => setShowUserSuggestions(false), 150)}
                required
                placeholder="Type user email..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#0c0c14] border border-white/[0.12] text-white"
              />

              {showUserSuggestions && filteredUsers.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 rounded-xl border border-white/[0.12] bg-[#0f0f18] shadow-2xl shadow-black/40 overflow-hidden z-20">
                  {filteredUsers.map((user) => (
                    <button
                      type="button"
                      key={user.id}
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, userEmail: user.email }))
                        setShowUserSuggestions(false)
                      }}
                      className="w-full text-left px-3.5 py-2.5 hover:bg-white/5 transition-colors"
                    >
                      <p className="text-sm text-white">{user.username}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="text-sm text-gray-300 mb-2 block">Commodity</label>
              <select name="commodity" value={formData.commodity} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl bg-[#0c0c14] border border-white/[0.12] text-white capitalize">
                {commodityOptions.map((item) => (
                  <option key={item} value={item} className="capitalize">{item}</option>
                ))}
              </select>
            </div>

            <Field label="Investment Amount" name="amount" value={formData.amount} onChange={handleChange} />

            <div>
              <label className="text-sm text-gray-300 mb-2 block">Ticker Symbol</label>
              <input
                name="tickerSymbol"
                value={formData.tickerSymbol}
                onChange={handleChange}
                placeholder="e.g., XAUUSD, GCJ26"
                className="w-full px-4 py-2.5 rounded-xl bg-[#0c0c14] border border-white/[0.12] text-white uppercase"
              />
            </div>

            <Field label="Strike Price (Optional)" name="strikePrice" value={formData.strikePrice} onChange={handleChange} required={false} />

            <Field label="Entry Price (Optional)" name="entryPrice" value={formData.entryPrice} onChange={handleChange} required={false} />

            <div>
              <label className="text-sm text-gray-300 mb-2 block">Date</label>
              <div className="relative">
                <CalendarDays className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                <input type="date" name="tradeDate" value={formData.tradeDate} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0c0c14] border border-white/[0.12] text-white" required />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-300 mb-2 block">Contract Expiry</label>
              <div className="relative">
                <CalendarDays className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                <input type="date" name="contractExpiry" value={formData.contractExpiry} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0c0c14] border border-white/[0.12] text-white" required />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-300 mb-2 block">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl bg-[#0c0c14] border border-white/[0.12] text-white">
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div className="flex items-end">
              <button type="submit" disabled={submitting} className="w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-semibold hover:from-indigo-500 hover:to-cyan-400 transition-all disabled:opacity-50">
                {submitting ? 'Creating...' : 'Create Trade'}
              </button>
            </div>

            <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-white/[0.08] bg-[#0d0d15] p-3">
              <p className="text-xs text-gray-400">Selected client balance</p>
              <p className="text-base font-semibold text-white mt-0.5">{selectedUser ? `$${Number(selectedUser.balance).toLocaleString()}` : 'Select user email'}</p>
            </div>

            <div className="sm:col-span-2 lg:col-span-3 text-xs text-gray-400">
              Available: Gold, Silver, Crude Oil, Natural Gas, Coffee, Wheat, Soy Beans, Orange Juice, US Dollar
            </div>
          </form>

          {message && <p className="mt-4 text-sm text-emerald-300">{message}</p>}
          {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
        </AdminPanel>

        <AdminPanel className="p-5">
          <SectionTitle title="Market Watch" subtitle="Reference symbols for trade desk" />
          <div className="space-y-2">
            {commodityOptions.map((asset) => (
              <div key={asset} className="rounded-xl border border-white/[0.08] bg-[#0d0d15] p-3 flex items-center justify-between">
                <p className="text-sm text-white capitalize">{asset}</p>
                <p className="text-sm text-cyan-300">{commodityTicketMap[asset]}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-white/[0.08] bg-[#0d0d15] p-3 mt-4">
            <p className="text-sm text-gray-300">Execution Priority</p>
            <div className="flex items-center gap-2 mt-2 text-cyan-300">
              <TrendingUp className="w-4 h-4" />
              Commodity route enabled with managed risk checks
            </div>
          </div>
        </AdminPanel>
      </div>

      <AdminPanel className="p-5">
        <SectionTitle title="All Trades" subtitle="Complete trade list across all client accounts" />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px] text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b border-white/[0.08]">
                <th className="py-3 pr-3">User</th>
                <th className="py-3 pr-3">Email</th>
                <th className="py-3 pr-3">Commodity</th>
                <th className="py-3 pr-3">Ticker</th>
                <th className="py-3 pr-3">Strike</th>
                <th className="py-3 pr-3">Amount</th>
                <th className="py-3 pr-3">Entry</th>
                <th className="py-3 pr-3">Exit</th>
                <th className="py-3 pr-3">Status</th>
                <th className="py-3 pr-3">Trade Date</th>
                <th className="py-3 pr-3">Expiry</th>
                <th className="py-3 pr-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((trade) => (
                <tr key={trade.id} className="border-b border-white/[0.06]">
                  <td className="py-3 pr-3 text-white">{trade.username || `User ${trade.userId}`}</td>
                  <td className="py-3 pr-3 text-gray-300">{trade.userEmail}</td>
                  <td className="py-3 pr-3 text-white capitalize">{String(trade.symbol || '').toLowerCase()}</td>
                  <td className="py-3 pr-3 text-cyan-300 font-semibold">{trade.ticketSymbol || '-'}</td>
                  <td className="py-3 pr-3 text-gray-300">{trade.strikePrice ?? '-'}</td>
                  <td className="py-3 pr-3 text-white">{trade.volume}</td>
                  <td className="py-3 pr-3 text-gray-300">{trade.entryPrice ?? '-'}</td>
                  <td className="py-3 pr-3 text-gray-300">{trade.exitPrice ?? '-'}</td>
                  <td className="py-3 pr-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${trade.status === 'open' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-indigo-500/20 text-indigo-300'}`}>{trade.status}</span>
                  </td>
                  <td className="py-3 pr-3 text-gray-300">{trade.tradeDate || '-'}</td>
                  <td className="py-3 pr-3 text-gray-300">{trade.contractExpiry || '-'}</td>
                  <td className="py-3 pr-3">
                    {trade.status === 'open' ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          step="0.01"
                          placeholder="P/L"
                          value={closeStateByTrade[trade.id]?.pnl ?? ''}
                          onChange={(e) => setCloseStateByTrade((prev) => ({ ...prev, [trade.id]: { ...(prev[trade.id] || {}), pnl: e.target.value } }))}
                          className="w-20 px-2.5 py-1.5 rounded-lg bg-[#0c0c14] border border-white/15 text-white text-xs"
                        />
                        <input
                          type="number"
                          step="0.0001"
                          placeholder="Exit"
                          value={closeStateByTrade[trade.id]?.exitPrice ?? ''}
                          onChange={(e) => setCloseStateByTrade((prev) => ({ ...prev, [trade.id]: { ...(prev[trade.id] || {}), exitPrice: e.target.value } }))}
                          className="w-20 px-2.5 py-1.5 rounded-lg bg-[#0c0c14] border border-white/15 text-white text-xs"
                        />
                        <button onClick={() => closeTrade(trade.id)} className="px-2.5 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs">
                          Close
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-500 text-xs">Settled</span>
                    )}
                  </td>
                </tr>
              ))}
              {!trades.length && (
                <tr>
                  <td colSpan={12} className="py-5 text-center text-gray-400">No trades found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </AdminPanel>

      {isSuccessPopupOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl border border-white/[0.12] bg-gradient-to-br from-[#171726] to-[#101019] p-5 sm:p-6">
            <div className="flex items-center justify-between gap-2 mb-4">
              <h3 className="text-xl font-semibold text-white">Trade Created</h3>
              <button onClick={() => setIsSuccessPopupOpen(false)} className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="rounded-2xl border border-emerald-400/25 bg-emerald-500/10 p-4 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-300 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-emerald-200">Trade created successfully</p>
                <p className="text-xs text-emerald-100/90 mt-1">Commodity position has been added to the selected client account.</p>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button onClick={() => setIsSuccessPopupOpen(false)} className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-semibold hover:from-indigo-500 hover:to-cyan-400 transition-all">
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Field({ label, required = true, ...props }) {
  return (
    <div>
      <label className="text-sm text-gray-300 mb-2 block">{label}</label>
      <input {...props} required={required} className="w-full px-4 py-2.5 rounded-xl bg-[#0c0c14] border border-white/[0.12] text-white" />
    </div>
  )
}
