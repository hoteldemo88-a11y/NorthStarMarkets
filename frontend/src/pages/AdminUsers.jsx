import { useEffect, useMemo, useState } from 'react'
import { jsPDF } from 'jspdf'
import { Search, UserRound, Wallet, Eye, Edit3, Trash2, X, Download, AlertTriangle, CheckCircle } from 'lucide-react'
import { adminApi } from '../services/adminApi'
import { AdminPanel, SectionTitle, StatTile, TinyBars } from '../components/admin/AdminPrimitives'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [userDetails, setUserDetails] = useState(null)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editAction, setEditAction] = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  const [actionMessage, setActionMessage] = useState('')

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

  const handleViewUser = async (user) => {
    setSelectedUser(user)
    setLoadingDetails(true)
    try {
      const details = await adminApi.getUser(user.id)
      setUserDetails(details)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoadingDetails(false)
    }
  }

  const generatePDF = () => {
    if (!userDetails) return
    
    const doc = new jsPDF()
    
    doc.setFillColor(26, 26, 42)
    doc.rect(0, 0, 210, 40, 'F')
    
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(22)
    doc.text('North Star Markets', 15, 20)
    doc.setFontSize(12)
    doc.text('User Details Report', 15, 30)
    
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(16)
    doc.text('User Profile Information', 15, 55)
    
    doc.setFontSize(11)
    let y = 70
    
    const fields = [
      ['User ID', String(userDetails.id)],
      ['Username', userDetails.username || 'N/A'],
      ['Email', userDetails.email || 'N/A'],
      ['First Name', userDetails.first_name || 'N/A'],
      ['Last Name', userDetails.last_name || 'N/A'],
      ['Phone', userDetails.phone || 'N/A'],
      ['Country', userDetails.country || 'N/A'],
      ['Date of Birth', userDetails.date_of_birth || 'N/A'],
      ['Account Status', userDetails.status || 'active'],
      ['Account Created', userDetails.created_at ? new Date(userDetails.created_at).toLocaleDateString() : 'N/A'],
    ]
    
    fields.forEach(([label, value]) => {
      doc.setFont(undefined, 'bold')
      doc.text(label + ':', 15, y)
      doc.setFont(undefined, 'normal')
      doc.text(value, 70, y)
      y += 8
    })
    
    y += 10
    doc.setFontSize(16)
    doc.setTextColor(200, 150, 0)
    doc.text('ID Proof (For Verification)', 15, y)
    doc.setTextColor(0, 0, 0)
    y += 15
    
    const idFields = [
      ['ID Type', userDetails.id_type ? userDetails.id_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'N/A'],
      ['ID Number', userDetails.id_number || 'N/A'],
    ]
    
    idFields.forEach(([label, value]) => {
      doc.setFont(undefined, 'bold')
      doc.text(label + ':', 15, y)
      doc.setFont(undefined, 'normal')
      doc.text(value, 70, y)
      y += 8
    })
    
    y += 10
    doc.setFontSize(16)
    doc.text('Financial Information', 15, y)
    y += 15
    
    const financialFields = [
      ['Balance', '$' + Number(userDetails.balance || 0).toLocaleString()],
      ['Annual Income', userDetails.annual_income || 'N/A'],
      ['Net Worth', userDetails.net_worth || 'N/A'],
      ['Employment Status', userDetails.employment_status || 'N/A'],
      ['Source of Funds', userDetails.source_of_funds || 'N/A'],
    ]
    
    financialFields.forEach(([label, value]) => {
      doc.setFont(undefined, 'bold')
      doc.text(label + ':', 15, y)
      doc.setFont(undefined, 'normal')
      doc.text(value, 70, y)
      y += 8
    })
    
    y += 10
    doc.setFontSize(16)
    doc.text('Trading Profile', 15, y)
    y += 15
    
    const tradingFields = [
      ['Risk Tolerance', userDetails.risk_tolerance || 'N/A'],
      ['Investment Horizon', userDetails.investment_horizon || 'N/A'],
      ['Max Drawdown', userDetails.max_drawdown || 'N/A'],
      ['Years Trading', userDetails.years_trading || 'N/A'],
      ['Products Traded', userDetails.products_traded || 'N/A'],
      ['Average Trades/Month', userDetails.average_trades_per_month || 'N/A'],
      ['Preferred Markets', userDetails.preferred_markets || 'N/A'],
      ['Strategy Style', userDetails.strategy_style || 'N/A'],
      ['Preferred Leverage', userDetails.preferred_leverage || 'N/A'],
    ]
    
    tradingFields.forEach(([label, value]) => {
      doc.setFont(undefined, 'bold')
      doc.text(label + ':', 15, y)
      doc.setFont(undefined, 'normal')
      doc.text(value, 70, y)
      y += 8
    })
    
    y += 10
    doc.setFontSize(16)
    doc.text('Compliance Information', 15, y)
    y += 15
    
    const complianceFields = [
      ['US Citizen', userDetails.us_citizen || 'N/A'],
      ['PEP Status', userDetails.pep_status || 'N/A'],
      ['Tax Residency', userDetails.tax_residency || 'N/A'],
    ]
    
    complianceFields.forEach(([label, value]) => {
      doc.setFont(undefined, 'bold')
      doc.text(label + ':', 15, y)
      doc.setFont(undefined, 'normal')
      doc.text(value, 70, y)
      y += 8
    })
    
    doc.setFontSize(10)
    doc.setTextColor(128, 128, 128)
    doc.text('Generated on: ' + new Date().toLocaleString(), 15, 280)
    
    doc.save(`user_${userDetails.id}_details.pdf`)
  }

  const handleEditClick = (user) => {
    setSelectedUser(user)
    setShowEditModal(true)
    setEditAction('')
    setActionMessage('')
  }

  const handleEditAction = async () => {
    if (!editAction || !selectedUser) return
    
    setActionLoading(true)
    setActionMessage('')
    
    try {
      if (editAction === 'suspend') {
        const result = await adminApi.suspendUser(selectedUser.id)
        setActionMessage(result.status === 'suspended' ? 'User has been suspended' : 'User has been activated')
      } else if (editAction === 'delete') {
        await adminApi.deleteUser(selectedUser.id)
        setActionMessage('User has been deleted')
        setTimeout(() => {
          setShowEditModal(false)
          setSelectedUser(null)
          loadUsers()
        }, 1500)
      }
      loadUsers()
    } catch (err) {
      setActionMessage(err.message)
    } finally {
      setActionLoading(false)
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
  const suspendedCount = filteredUsers.filter(u => u.status === 'suspended').length

  return (
    <div className="space-y-5">
      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatTile icon={UserRound} label="Total Users" value={String(filteredUsers.length)} tone="from-indigo-500/25 to-indigo-400/10" />
        <StatTile icon={UserRound} label="Active Users" value={String(filteredUsers.length - suspendedCount)} tone="from-emerald-500/25 to-emerald-400/10" />
        <StatTile icon={AlertTriangle} label="Suspended" value={String(suspendedCount)} tone="from-amber-500/25 to-amber-400/10" />
        <StatTile icon={Wallet} label="Combined Balance" value={`$${total.toLocaleString()}`} tone="from-cyan-500/25 to-cyan-400/10" />
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
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b border-white/[0.08]">
                <th className="py-3 pr-3">User</th>
                <th className="py-3 pr-3">Email</th>
                <th className="py-3 pr-3">Status</th>
                <th className="py-3 pr-3">Balance</th>
                <th className="py-3 pr-3">Joined</th>
                <th className="py-3 pr-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-white/[0.06]">
                  <td className="py-3 pr-3 text-white">{user.username}</td>
                  <td className="py-3 pr-3 text-gray-200">{user.email}</td>
                  <td className="py-3 pr-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full ${user.status === 'suspended' ? 'bg-red-500/20 text-red-300 border border-red-400/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'}`}>
                      {user.status === 'suspended' ? 'Suspended' : 'Active'}
                    </span>
                  </td>
                  <td className="py-3 pr-3 text-cyan-300 font-medium">${Number(user.balance).toLocaleString()}</td>
                  <td className="py-3 pr-3 text-gray-400">{user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</td>
                  <td className="py-3 pr-3">
                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => updateBalance(user.id, 100)} className="px-2.5 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs">+100</button>
                      <button onClick={() => updateBalance(user.id, -100)} className="px-2.5 py-1.5 rounded-lg bg-red-500/20 text-red-300 border border-red-400/30 text-xs">-100</button>
                      <button onClick={() => handleViewUser(user)} className="px-2.5 py-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs flex items-center gap-1"><Eye className="w-3 h-3" /> View</button>
                      <button onClick={() => handleEditClick(user)} className="px-2.5 py-1.5 rounded-lg bg-white/10 text-gray-100 border border-white/20 text-xs flex items-center gap-1"><Edit3 className="w-3 h-3" /> Edit</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminPanel>

      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/[0.12] bg-gradient-to-br from-[#171726] to-[#101019] p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h3 className="text-xl font-semibold text-white">User Details</h3>
              <button onClick={() => { setSelectedUser(null); setUserDetails(null) }} className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {loadingDetails ? (
              <div className="text-center py-8 text-gray-400">Loading user details...</div>
            ) : userDetails ? (
              <>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-[#0d0d15] border border-white/[0.08]">
                    <h4 className="text-sm font-semibold text-cyan-300 mb-3">Personal Information</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div><span className="text-gray-400">User ID:</span> <span className="text-white ml-1">{userDetails.id}</span></div>
                      <div><span className="text-gray-400">Username:</span> <span className="text-white ml-1">{userDetails.username}</span></div>
                      <div><span className="text-gray-400">Email:</span> <span className="text-white ml-1">{userDetails.email}</span></div>
                      <div><span className="text-gray-400">First Name:</span> <span className="text-white ml-1">{userDetails.first_name || 'N/A'}</span></div>
                      <div><span className="text-gray-400">Last Name:</span> <span className="text-white ml-1">{userDetails.last_name || 'N/A'}</span></div>
                      <div><span className="text-gray-400">Phone:</span> <span className="text-white ml-1">{userDetails.phone || 'N/A'}</span></div>
                      <div><span className="text-gray-400">Country:</span> <span className="text-white ml-1">{userDetails.country || 'N/A'}</span></div>
                      <div><span className="text-gray-400">Date of Birth:</span> <span className="text-white ml-1">{userDetails.date_of_birth || 'N/A'}</span></div>
                      <div><span className="text-gray-400">Status:</span> <span className={`ml-1 ${userDetails.status === 'suspended' ? 'text-red-300' : 'text-emerald-300'}`}>{userDetails.status === 'suspended' ? 'Suspended' : 'Active'}</span></div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#0d0d15] border border-amber-500/30">
                    <h4 className="text-sm font-semibold text-amber-300 mb-3 flex items-center gap-2">
                      <span>ID Proof (For Verification)</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                        {userDetails.id_type ? userDetails.id_type.replace('_', ' ').toUpperCase() : 'Not Submitted'}
                      </span>
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div><span className="text-gray-400">ID Type:</span> <span className="text-white ml-1 font-medium">{userDetails.id_type ? userDetails.id_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'N/A'}</span></div>
                      <div><span className="text-gray-400">ID Number:</span> <span className="text-white ml-1 font-mono font-medium">{userDetails.id_number || 'N/A'}</span></div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#0d0d15] border border-white/[0.08]">
                    <h4 className="text-sm font-semibold text-cyan-300 mb-3">Financial Information</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div><span className="text-gray-400">Balance:</span> <span className="text-white ml-1 font-semibold">${Number(userDetails.balance || 0).toLocaleString()}</span></div>
                      <div><span className="text-gray-400">Annual Income:</span> <span className="text-white ml-1">{userDetails.annual_income || 'N/A'}</span></div>
                      <div><span className="text-gray-400">Net Worth:</span> <span className="text-white ml-1">{userDetails.net_worth || 'N/A'}</span></div>
                      <div><span className="text-gray-400">Employment:</span> <span className="text-white ml-1">{userDetails.employment_status || 'N/A'}</span></div>
                      <div><span className="text-gray-400">Source of Funds:</span> <span className="text-white ml-1">{userDetails.source_of_funds || 'N/A'}</span></div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#0d0d15] border border-white/[0.08]">
                    <h4 className="text-sm font-semibold text-cyan-300 mb-3">Trading Profile</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div><span className="text-gray-400">Risk Tolerance:</span> <span className="text-white ml-1">{userDetails.risk_tolerance || 'N/A'}</span></div>
                      <div><span className="text-gray-400">Investment Horizon:</span> <span className="text-white ml-1">{userDetails.investment_horizon || 'N/A'}</span></div>
                      <div><span className="text-gray-400">Max Drawdown:</span> <span className="text-white ml-1">{userDetails.max_drawdown || 'N/A'}</span></div>
                      <div><span className="text-gray-400">Years Trading:</span> <span className="text-white ml-1">{userDetails.years_trading || 'N/A'}</span></div>
                      <div><span className="text-gray-400">Products Traded:</span> <span className="text-white ml-1">{userDetails.products_traded || 'N/A'}</span></div>
                      <div><span className="text-gray-400">Avg Trades/Month:</span> <span className="text-white ml-1">{userDetails.average_trades_per_month || 'N/A'}</span></div>
                      <div><span className="text-gray-400">Preferred Markets:</span> <span className="text-white ml-1">{userDetails.preferred_markets || 'N/A'}</span></div>
                      <div><span className="text-gray-400">Strategy Style:</span> <span className="text-white ml-1">{userDetails.strategy_style || 'N/A'}</span></div>
                      <div><span className="text-gray-400">Preferred Leverage:</span> <span className="text-white ml-1">{userDetails.preferred_leverage || 'N/A'}</span></div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#0d0d15] border border-white/[0.08]">
                    <h4 className="text-sm font-semibold text-cyan-300 mb-3">Compliance</h4>
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div><span className="text-gray-400">US Citizen:</span> <span className="text-white ml-1">{userDetails.us_citizen || 'N/A'}</span></div>
                      <div><span className="text-gray-400">PEP Status:</span> <span className="text-white ml-1">{userDetails.pep_status || 'N/A'}</span></div>
                      <div><span className="text-gray-400">Tax Residency:</span> <span className="text-white ml-1">{userDetails.tax_residency || 'N/A'}</span></div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mt-5">
                  <button onClick={generatePDF} className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 inline-flex items-center justify-center gap-2 hover:bg-cyan-500/25 transition-colors">
                    <Download className="w-4 h-4" />
                    Download PDF
                  </button>
                  <button onClick={() => { setSelectedUser(null); setUserDetails(null) }} className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-white/20 text-gray-200 inline-flex items-center justify-center gap-2 hover:bg-white/5 transition-colors">
                    Close
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl border border-white/[0.12] bg-gradient-to-br from-[#171726] to-[#101019] p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h3 className="text-xl font-semibold text-white">Edit User: {selectedUser?.username}</h3>
              <button onClick={() => setShowEditModal(false)} className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <button onClick={() => setEditAction('suspend')} className={`w-full p-4 rounded-xl border text-left flex items-center gap-3 transition-colors ${editAction === 'suspend' ? 'bg-amber-500/20 border-amber-400/40 text-white' : 'border-white/10 text-gray-300 hover:bg-white/5'}`}>
                <AlertTriangle className="w-5 h-5 text-amber-300" />
                <div>
                  <p className="font-medium">{selectedUser?.status === 'suspended' ? 'Activate User' : 'Suspend User'}</p>
                  <p className="text-xs text-gray-400">{selectedUser?.status === 'suspended' ? 'Restore user access to their account' : 'Temporarily block user access'}</p>
                </div>
              </button>

              <button onClick={() => setEditAction('delete')} className={`w-full p-4 rounded-xl border text-left flex items-center gap-3 transition-colors ${editAction === 'delete' ? 'bg-red-500/20 border-red-400/40 text-white' : 'border-white/10 text-gray-300 hover:bg-white/5'}`}>
                <Trash2 className="w-5 h-5 text-red-300" />
                <div>
                  <p className="font-medium">Delete User</p>
                  <p className="text-xs text-gray-400">Permanently remove user and all data</p>
                </div>
              </button>
            </div>

            {actionMessage && (
              <div className={`mt-4 p-3 rounded-xl text-sm ${actionMessage.includes('deleted') || actionMessage.includes('suspended') || actionMessage.includes('activated') ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' : 'bg-red-500/20 text-red-300 border border-red-400/30'}`}>
                {actionMessage}
              </div>
            )}

            <div className="flex flex-wrap gap-3 mt-5">
              <button onClick={handleEditAction} disabled={!editAction || actionLoading} className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-semibold hover:from-indigo-500 hover:to-cyan-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                {actionLoading ? 'Processing...' : 'Confirm Action'}
              </button>
              <button onClick={() => setShowEditModal(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-white/20 text-gray-200 hover:bg-white/5 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
