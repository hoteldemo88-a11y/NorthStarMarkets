import { useEffect, useMemo, useState } from 'react'
import { Search, UserRound, Wallet } from 'lucide-react'
import { adminApi } from '../services/adminApi'
import { AdminPanel, SectionTitle, StatTile, TinyBars } from '../components/admin/AdminPrimitives'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [query, setQuery] = useState('')

  const loadUsers = async () => {
    try {
      setUsers(await adminApi.getUsers())
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const updateBalance = async (userId, delta) => {
    try {
      await adminApi.updateBalance(userId, delta)
      await loadUsers()
    } catch (err) {
      setError(err.message)
    }
  }

  const filteredUsers = useMemo(() => {
    const clients = users.filter((user) => user.role === 'client')
    const q = query.trim().toLowerCase()
    if (!q) return clients
    return clients.filter((user) => user.email.toLowerCase().includes(q) || user.username.toLowerCase().includes(q))
  }, [users, query])

  const userBalances = useMemo(() => filteredUsers.slice(0, 10).map((user) => Number(user.balance)), [filteredUsers])
  const total = useMemo(() => filteredUsers.reduce((sum, user) => sum + Number(user.balance), 0), [filteredUsers])

  return (
    <div className="space-y-5">
      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <StatTile icon={UserRound} label="Visible Users" value={String(filteredUsers.length)} tone="from-indigo-500/25 to-indigo-400/10" />
        <StatTile icon={Wallet} label="Combined Balance" value={`$${total.toLocaleString()}`} tone="from-cyan-500/25 to-cyan-400/10" />
        <AdminPanel className="p-4">
          <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">Balance Distribution</p>
          <TinyBars values={userBalances.length ? userBalances : [1]} color="from-emerald-400 to-cyan-500" />
        </AdminPanel>
      </div>

      <AdminPanel className="p-5">
        <SectionTitle
          title="Manage Users & Balances"
          subtitle="Professional controls for account-level operations"
          right={
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search user or email"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-white/[0.12] bg-[#0c0c14] text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          }
        />

        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b border-white/[0.08]">
                <th className="py-3 pr-3">User</th>
                <th className="py-3 pr-3">Email</th>
                <th className="py-3 pr-3">Role</th>
                <th className="py-3 pr-3">Balance</th>
                <th className="py-3 pr-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-white/[0.06]">
                  <td className="py-3 pr-3 text-white">{user.username}</td>
                  <td className="py-3 pr-3 text-gray-200">{user.email}</td>
                  <td className="py-3 pr-3 text-gray-300">{user.role}</td>
                  <td className="py-3 pr-3 text-cyan-300 font-medium">${Number(user.balance).toLocaleString()}</td>
                  <td className="py-3 pr-3">
                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => updateBalance(user.id, 100)} className="px-2.5 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">+100</button>
                      <button onClick={() => updateBalance(user.id, -100)} className="px-2.5 py-1.5 rounded-lg bg-red-500/20 text-red-300 border border-red-400/30">-100</button>
                      <button onClick={() => setSelectedUser(user)} className="px-2.5 py-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">View</button>
                      <button onClick={() => setSelectedUser(user)} className="px-2.5 py-1.5 rounded-lg bg-white/10 text-gray-100 border border-white/20">Edit</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminPanel>

      {selectedUser && (
        <AdminPanel className="p-5">
          <SectionTitle title="User Details" subtitle="Quick profile insights" right={<button onClick={() => setSelectedUser(null)} className="text-xs text-gray-300">Close</button>} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Info label="Username" value={selectedUser.username} />
            <Info label="Email" value={selectedUser.email} />
            <Info label="Role" value={selectedUser.role} />
            <Info label="Country" value={selectedUser.country || 'N/A'} />
          </div>
        </AdminPanel>
      )}
    </div>
  )
}

function Info({ label, value }) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#0d0d15] p-3">
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-sm text-white mt-1 break-all">{value}</p>
    </div>
  )
}
