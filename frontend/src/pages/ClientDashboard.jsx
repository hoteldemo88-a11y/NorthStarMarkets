import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { AlertCircle, Bell, ChartCandlestick, CheckCircle2, Clock3, Download, History, LockKeyhole, Pencil, ShieldCheck, ShieldX, Sparkles, Upload, Wallet, X } from 'lucide-react'
import { apiRequest, getClientNotifications } from '../services/api'

const validSections = new Set(['main', 'trade-history', 'profile', 'recharge', 'withdraw', 'wallet-history'])

const sectionMeta = {
  main: {
    title: 'Portfolio Overview',
    subtitle: 'Live balance intelligence and account momentum in one premium control surface.',
  },
  'trade-history': {
    title: 'Trade Ledger',
    subtitle: 'Review all executed positions with fast P/L scanning and clean readability.',
  },
  profile: {
    title: 'Identity & Security',
    subtitle: 'Manage your profile and protect account access with secure update flows.',
  },
  recharge: {
    title: 'Recharge Wallet',
    subtitle: 'Submit a deposit request and keep trading capital ready without delay.',
  },
  withdraw: {
    title: 'Withdraw Funds',
    subtitle: 'Request withdrawals with transparent status tracking and instant clarity.',
  },
  'wallet-history': {
    title: 'Wallet Timeline',
    subtitle: 'Track every deposit and withdrawal request with approval status updates.',
  },
}

export default function ClientDashboard() {
  const [summary, setSummary] = useState(null)
  const [error, setError] = useState('')
  const [searchParams] = useSearchParams()

  const [rechargeAmount, setRechargeAmount] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [submitPopup, setSubmitPopup] = useState({ open: false, title: '', message: '', tone: 'success' })
  const popupTimerRef = useRef(null)

  const [notifications, setNotifications] = useState({ newTrades: 0, newDepositRequests: 0, newWithdrawRequests: 0 })
  const [lastChecked, setLastChecked] = useState(() => new Date().toISOString())
  const [notificationPopup, setNotificationPopup] = useState({ open: false, title: '', message: '' })
  const notificationCheckRef = useRef(null)
  const notifPopupTimerRef = useRef(null)

  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '' })
  const [passwordMessage, setPasswordMessage] = useState('')
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [profileForm, setProfileForm] = useState({ username: '', email: '', phone: '', country: '', riskTolerance: 'moderate' })
  const [profileMessage, setProfileMessage] = useState('')
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isProfileSaving, setIsProfileSaving] = useState(false)
  const navigate = useNavigate()

  const showSubmitPopup = (title, message, tone = 'success') => {
    if (popupTimerRef.current) clearTimeout(popupTimerRef.current)
    setSubmitPopup({ open: true, title, message, tone })
    popupTimerRef.current = setTimeout(() => {
      setSubmitPopup((prev) => ({ ...prev, open: false }))
      popupTimerRef.current = null
    }, 2800)
  }

  const checkNotifications = async () => {
    try {
      const notifs = await getClientNotifications(lastChecked)
      const totalNew = notifs.newTrades + notifs.newDepositRequests + notifs.newWithdrawRequests
      
      if (totalNew > 0) {
        let message = ''
        if (notifs.newTrades > 0) message += `${notifs.newTrades} new trade${notifs.newTrades > 1 ? 's' : ''} `
        if (notifs.newDepositRequests > 0) message += `${notifs.newDepositRequests} deposit request${notifs.newDepositRequests > 1 ? 's' : ''} `
        if (notifs.newWithdrawRequests > 0) message += `${notifs.newWithdrawRequests} withdrawal request${notifs.newWithdrawRequests > 1 ? 's' : ''} `
        
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

  const loadSummary = async () => {
    try {
      setSummary(await apiRequest('/client/summary'))
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    loadSummary()
    checkNotifications()
    notificationCheckRef.current = setInterval(checkNotifications, 10000)
    return () => {
      if (notificationCheckRef.current) clearInterval(notificationCheckRef.current)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (popupTimerRef.current) clearTimeout(popupTimerRef.current)
      if (notifPopupTimerRef.current) clearTimeout(notifPopupTimerRef.current)
    }
  }, [])

  useEffect(() => {
    if (!summary?.profile) return
    setProfileForm({
      username: summary.profile.username || '',
      email: summary.profile.email || '',
      phone: summary.profile.phone || '',
      country: summary.profile.country || '',
      riskTolerance: summary.profile.riskTolerance || 'moderate',
    })
  }, [summary])

  const isVerified = summary?.verificationStatus === 'verified'
  const isPending = summary?.verificationStatus === 'pending'
  const isRejected = summary?.verificationStatus === 'rejected'
  const isDocumentsRequested = summary?.verificationStatus === 'documents_requested'
  const hasKycDocuments = summary?.idFront && summary?.idBack
  const kycComplete = isVerified || hasKycDocuments
  const canTrade = isVerified || isPending

  const active = validSections.has(searchParams.get('section')) ? searchParams.get('section') : 'main'

  const allTrades = useMemo(() => {
    if (!summary) return []
    return [...summary.openTrades, ...summary.tradeHistory]
  }, [summary])

  const walletHistory = useMemo(() => {
    if (!summary) return []
    const deposits = summary.depositRequests.map((item) => ({ ...item, type: 'deposit' }))
    const withdrawals = summary.withdrawRequests.map((item) => ({ ...item, type: 'withdraw' }))
    return [...deposits, ...withdrawals]
  }, [summary])

  const pnlSeries = useMemo(() => {
    const values = allTrades.slice(0, 18).map((trade) => Number(trade.pnl || 0))
    return values.length ? values : [0]
  }, [allTrades])

  const openTradesPnl = useMemo(
    () => Number(summary?.openTrades?.reduce((sum, trade) => sum + Number(trade.pnl || 0), 0) || 0),
    [summary],
  )

  const pendingWalletRequests = useMemo(() => walletHistory.filter((item) => item.status === 'pending').length, [walletHistory])

  const submitWallet = async (type) => {
    const amount = Number(type === 'deposit' ? rechargeAmount : withdrawAmount)
    if (!amount || amount <= 0) {
      showSubmitPopup('Invalid amount', 'Enter a valid amount greater than 0.', 'error')
      return
    }

    try {
      const endpoint = type === 'deposit' ? '/client/deposits' : '/client/withdrawals'
      await apiRequest(endpoint, { method: 'POST', body: JSON.stringify({ amount }) })
      if (type === 'deposit') setRechargeAmount('')
      if (type === 'withdraw') setWithdrawAmount('')
      showSubmitPopup(
        type === 'deposit' ? 'Recharge submitted' : 'Withdrawal submitted',
        type === 'deposit' ? 'Your recharge request has been sent for admin approval.' : 'Your withdrawal request has been sent for admin review.',
        'success',
      )
      await loadSummary()
    } catch (err) {
      showSubmitPopup('Submission failed', err.message || 'Something went wrong.', 'error')
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setPasswordMessage('')
    try {
      await apiRequest('/client/change-password', { method: 'PUT', body: JSON.stringify(passwordData) })
      setPasswordData({ currentPassword: '', newPassword: '' })
      setPasswordMessage('Password changed successfully')
      setIsPasswordModalOpen(false)
      showSubmitPopup('Password updated', 'Your password has been changed successfully.', 'success')
    } catch (err) {
      setPasswordMessage(err.message)
      showSubmitPopup('Password update failed', err.message || 'Unable to update password.', 'error')
    }
  }


  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setProfileMessage('')
    setIsProfileSaving(true)
    try {
      await apiRequest('/client/profile', {
        method: 'PUT',
        body: JSON.stringify({
          username: profileForm.username,
          phone: profileForm.phone,
          country: profileForm.country,
          riskTolerance: profileForm.riskTolerance,
        }),
      })
      setProfileMessage('Profile updated successfully')
      await loadSummary()
      setIsProfileModalOpen(false)
      showSubmitPopup('Profile updated', 'Your profile details were saved successfully.', 'success')
    } catch (err) {
      setProfileMessage(err.message)
      showSubmitPopup('Profile update failed', err.message || 'Unable to save profile.', 'error')
    } finally {
      setIsProfileSaving(false)
    }
  }

  if (error) return <div className="p-6 text-red-400">{error}</div>
  if (!summary) return <div className="p-6 text-gray-300">Loading dashboard...</div>

  return (
<div className="relative space-y-6">
      {submitPopup.open && (
        <motion.div
          initial={{ opacity: 0, y: -12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8 }}
          className={`fixed z-[70] top-4 sm:top-6 left-4 sm:left-auto sm:right-6 sm:w-[380px] rounded-2xl border p-4 shadow-2xl backdrop-blur-xl ${submitPopup.tone === 'success' ? 'bg-emerald-500/15 border-emerald-400/35' : 'bg-red-500/15 border-red-400/35'}`}
        >
          <div className="flex items-start gap-3">
            <div className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center ${submitPopup.tone === 'success' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
              {submitPopup.tone === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">{submitPopup.title}</p>
              <p className="text-xs text-gray-200 mt-1">{submitPopup.message}</p>
            </div>
            <button
              onClick={() => setSubmitPopup((prev) => ({ ...prev, open: false }))}
              className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-gray-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

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
              onClick={() => {
                setNotificationPopup((prev) => ({ ...prev, open: false }))
              }}
              className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-gray-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      <div className="pointer-events-none absolute -top-24 left-[-8%] w-72 h-72 bg-cyan-500/10 rounded-full blur-[100px]" />
      <div className="pointer-events-none absolute top-60 right-[-8%] w-72 h-72 bg-indigo-500/10 rounded-full blur-[100px]" />

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-white/[0.1] bg-gradient-to-br from-[#1a1a2a] via-[#121221] to-[#101019] p-5 sm:p-6"
      >
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-indigo-500/15 rounded-full blur-3xl" />

        {!isVerified && (isPending || isDocumentsRequested || isRejected) && (
          <div className="relative mb-4 p-3 rounded-xl bg-amber-500/15 border border-amber-400/30">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-300 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-amber-200">
                  {isDocumentsRequested 
                    ? 'Verification Required: Please upload your ID documents' 
                    : isRejected 
                      ? 'Verification Rejected: Please contact support or re-upload documents'
                      : 'Account Verification Under Review'}
                </p>
                <p className="text-xs text-amber-100/70 mt-1">
                  {isDocumentsRequested 
                    ? 'Upload your ID to get faster verification. You can still trade while verification is pending.'
                    : isRejected 
                      ? 'Contact support for more information or re-submit your documents.'
                      : 'You can trade while your verification is being processed. Upload ID for faster approval.'}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-gray-300 text-sm">Primary Wallet Balance</p>
              {(notifications.newTrades > 0 || notifications.newDepositRequests > 0 || notifications.newWithdrawRequests > 0) && (
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse" />
                  New
                </span>
              )}
            </div>
            <p className="text-3xl sm:text-4xl font-bold text-white mt-1">${Number(summary.balance).toLocaleString()}</p>
            {isVerified ? (
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 text-emerald-200 text-xs">
                <ShieldCheck className="w-3.5 h-3.5" />
                Account Verified
              </div>
            ) : isPending ? (
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-400/30 bg-amber-500/10 text-amber-200 text-xs">
                <Clock3 className="w-3.5 h-3.5" />
                Verification Under Review
              </div>
            ) : isDocumentsRequested ? (
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-red-400/30 bg-red-500/10 text-red-200 text-xs">
                <ShieldX className="w-3.5 h-3.5" />
                Documents Requested - Please Upload ID
              </div>
            ) : isRejected ? (
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-red-400/30 bg-red-500/10 text-red-200 text-xs">
                <ShieldX className="w-3.5 h-3.5" />
                Verification Rejected
              </div>
            ) : (
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-400/30 bg-amber-500/10 text-amber-200 text-xs">
                <Clock3 className="w-3.5 h-3.5" />
                Pending Verification
              </div>
            )}

            {(isRejected || !hasKycDocuments) && (
              <button
                onClick={() => navigate('/dashboard/kyc')}
                className="mt-3 ml-2 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-red-400/30 bg-red-500/20 text-red-200 text-xs hover:bg-red-500/30 transition-colors"
              >
                {isRejected ? 'Resubmit KYC' : 'Submit KYC'}
              </button>
            )}
          </div>

          {!kycComplete && (
            <div className="mt-4 p-4 rounded-xl bg-red-500/15 border border-red-400/30">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <ShieldX className="w-5 h-5 text-red-300 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-200">Please complete KYC to get access to trades, recharge, and withdraw</p>
                    <p className="text-xs text-red-100/70 mt-1">Upload your ID documents to verify your account</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/dashboard/kyc')}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white text-sm font-semibold hover:from-indigo-500 hover:to-cyan-400 transition-all whitespace-nowrap"
                >
                  Submit KYC
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 min-w-[280px]">
            <Metric label="Open Trades" value={String(summary.openTrades.length)} />
            <Metric label="Trade History" value={String(summary.tradeHistory.length)} />
            <Metric label="Open P/L" value={`${openTradesPnl >= 0 ? '+' : ''}$${openTradesPnl.toFixed(2)}`} />
            <Metric label="Pending Reqs" value={String(pendingWalletRequests)} highlight={pendingWalletRequests > 0} />
          </div>
        </div>
      </motion.section>

      <SectionSpotlight title={sectionMeta[active].title} subtitle={sectionMeta[active].subtitle} />

      {active === 'main' && (
        <div className="space-y-5">
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            <Kpi icon={History} label="Trade History" value={String(summary.tradeHistory.length)} tone="text-indigo-300" />
            <Kpi icon={ChartCandlestick} label="Open Trades" value={String(summary.openTrades.length)} tone="text-emerald-300" />
            <Kpi icon={Wallet} label="Wallet Actions" value={String(walletHistory.length)} tone="text-cyan-300" />
          </div>

          <GlassPanel title="Profit / Loss Momentum">
            <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#10101a] via-[#0d1220] to-[#101018] p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <p className="text-sm text-gray-300">Performance Snapshot</p>
                  <p className="text-xs text-gray-500 mt-0.5">Latest {Math.min(pnlSeries.length, 18)} trade outcomes</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 text-xs text-emerald-300 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/25">
                    <span className="w-2 h-2 rounded-full bg-emerald-300" />
                    Profit
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs text-red-300 px-2.5 py-1 rounded-full bg-red-500/15 border border-red-400/25">
                    <span className="w-2 h-2 rounded-full bg-red-300" />
                    Loss
                  </span>
                </div>
              </div>

              <PnlChart values={pnlSeries} />

              <div className="mt-4 grid grid-cols-3 gap-2">
                <ChartMetric label="Win Trades" value={String(pnlSeries.filter((n) => n > 0).length)} tone="text-emerald-300" />
                <ChartMetric label="Loss Trades" value={String(pnlSeries.filter((n) => n < 0).length)} tone="text-red-300" />
                <ChartMetric label="Net" value={`${pnlSeries.reduce((a, b) => a + b, 0) >= 0 ? '+' : ''}$${pnlSeries.reduce((a, b) => a + b, 0).toFixed(2)}`} tone="text-cyan-300" />
              </div>
            </div>
          </GlassPanel>
        </div>
      )}


      {active === 'trade-history' && (
          <GlassPanel title="All Trades with Realized / Unrealized P&L">
            <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
            {allTrades.length === 0 ? (
              <p className="text-sm text-gray-400">No trades available</p>
            ) : (
              allTrades.map((trade) => (
                <div key={`${trade.id}-${trade.symbol}-${trade.side}`} className="rounded-xl bg-gradient-to-r from-[#0b0b13] to-[#111120] border border-white/[0.08] px-3 py-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-white">{trade.symbol}</p>
                    <p className="text-xs text-gray-400">{trade.side.toUpperCase()} • {trade.volume} lots • {trade.ticketSymbol || 'N/A'}</p>
                    {trade.contractExpiry && <p className="text-[11px] text-gray-500 mt-0.5">Contract Expiry: {trade.contractExpiry}</p>}
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${Number(trade.pnl) >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>
                      {Number(trade.pnl) >= 0 ? '+' : ''}${Number(trade.pnl).toFixed(2)}
                    </p>
                    <p className="text-[11px] text-gray-500">Trade #{trade.id}{trade.tradeDate ? ` • ${trade.tradeDate}` : ''}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </GlassPanel>
      )}

      {active === 'profile' && (
        <GlassPanel title="User Profile">
          <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#0b0b13] to-[#111123] p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h4 className="text-white font-semibold text-lg">{summary.profile.username}</h4>
                <p className="text-sm text-gray-300 mt-1">{summary.profile.email}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setProfileMessage('')
                    setIsProfileModalOpen(true)
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white text-sm font-semibold hover:from-indigo-500 hover:to-cyan-400 transition-all"
                >
                  <Pencil className="w-4 h-4" />
                  Edit Profile
                </button>
                <button
                  onClick={() => {
                    setPasswordMessage('')
                    setIsPasswordModalOpen(true)
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm font-semibold hover:bg-white/20 transition-all"
                >
                  <LockKeyhole className="w-4 h-4" />
                  Change Password
                </button>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
              <ProfileInfo label="Phone" value={summary.profile.phone || 'N/A'} />
              <ProfileInfo label="Country" value={summary.profile.country || 'N/A'} />
              <ProfileInfo label="Risk Profile" value={summary.profile.riskTolerance || 'N/A'} />
              <ProfileInfo label="Verification" value={isVerified ? 'Verified' : summary.verificationStatus || 'Pending'} />
            </div>
          </div>
          {profileMessage && <p className="text-sm text-gray-300 mt-3">{profileMessage}</p>}
        </GlassPanel>
      )}

      {active === 'recharge' && (
        <GlassPanel title="Recharge Wallet" icon={Download}>
          {!kycComplete ? (
            <div className="text-center py-8">
              <ShieldX className="w-12 h-12 text-red-400 mx-auto mb-3" />
              <p className="text-white font-medium mb-2">KYC Required</p>
              <p className="text-sm text-gray-400 mb-4">Please complete your KYC verification to access recharge</p>
              <button
                onClick={() => navigate('/dashboard/kyc')}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white text-sm font-semibold"
              >
                Submit KYC
              </button>
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-[1fr_auto] gap-3 items-end">
                <Field label="Recharge Amount" type="number" min="0" value={rechargeAmount} onChange={(e) => setRechargeAmount(e.target.value)} />
                <button onClick={() => submitWallet('deposit')} className="px-4 py-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 inline-flex items-center gap-2 hover:bg-emerald-500/25 transition-colors">
                  <Download className="w-4 h-4" />
                  Recharge
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {[100, 500, 1000].map((value) => (
                  <button key={value} onClick={() => setRechargeAmount(String(value))} className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/15 text-gray-200 text-xs hover:bg-white/15">
                    +${value}
                  </button>
                ))}
              </div>
            </>
          )}
        </GlassPanel>
      )}

      {active === 'withdraw' && (
        <GlassPanel title="Withdraw from Wallet" icon={Upload}>
          {!kycComplete ? (
            <div className="text-center py-8">
              <ShieldX className="w-12 h-12 text-red-400 mx-auto mb-3" />
              <p className="text-white font-medium mb-2">KYC Required</p>
              <p className="text-sm text-gray-400 mb-4">Please complete your KYC verification to access withdrawals</p>
              <button
                onClick={() => navigate('/dashboard/kyc')}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white text-sm font-semibold"
              >
                Submit KYC
              </button>
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-[1fr_auto] gap-3 items-end">
                <Field label="Withdraw Amount" type="number" min="0" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} />
                <button onClick={() => submitWallet('withdraw')} className="px-4 py-2.5 rounded-xl bg-red-500/20 text-red-300 border border-red-400/30 inline-flex items-center gap-2 hover:bg-red-500/25 transition-colors">
                  <Upload className="w-4 h-4" />
                  Withdraw
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {[100, 250, 500].map((value) => (
                  <button key={value} onClick={() => setWithdrawAmount(String(value))} className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/15 text-gray-200 text-xs hover:bg-white/15">
                    ${value}
                  </button>
                ))}
              </div>
            </>
          )}
        </GlassPanel>
      )}

      {active === 'wallet-history' && (
        <GlassPanel title="Wallet Request History" icon={Clock3}>
          <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
            {walletHistory.length === 0 ? (
              <p className="text-sm text-gray-400">No wallet history</p>
            ) : (
              walletHistory.map((item) => (
                <div key={`${item.type}-${item.id}`} className="rounded-xl bg-gradient-to-r from-[#0b0b13] to-[#111120] border border-white/[0.08] px-3 py-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-white capitalize">{item.type}</p>
                    <p className="text-xs text-gray-400">Request #{item.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-cyan-300">${Number(item.amount).toLocaleString()}</p>
                    <p className={`text-xs ${item.status === 'approved' ? 'text-emerald-300' : item.status === 'rejected' ? 'text-red-300' : 'text-amber-300'}`}>{item.status}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </GlassPanel>
      )}

      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded-3xl border border-white/[0.12] bg-gradient-to-br from-[#171726] to-[#101019] p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h3 className="text-xl font-semibold text-white">Edit Profile</h3>
              <button onClick={() => setIsProfileModalOpen(false)} className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleProfileUpdate} className="grid sm:grid-cols-2 gap-3">
              <Field
                label="Name"
                value={profileForm.username}
                onChange={(e) => setProfileForm((prev) => ({ ...prev, username: e.target.value }))}
              />
              <Field
                label="Number"
                value={profileForm.phone}
                onChange={(e) => setProfileForm((prev) => ({ ...prev, phone: e.target.value }))}
              />
              <ReadOnlyField label="Email (Read Only)" value={profileForm.email} />
              <Field
                label="Country"
                value={profileForm.country}
                onChange={(e) => setProfileForm((prev) => ({ ...prev, country: e.target.value }))}
              />
              <div className="sm:col-span-2">
                <label className="text-sm text-gray-300 mb-2 block">Risk Profile</label>
                <select
                  value={profileForm.riskTolerance}
                  onChange={(e) => setProfileForm((prev) => ({ ...prev, riskTolerance: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0a0a0f] border border-white/[0.12] text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="low">Low</option>
                  <option value="moderate">Moderate</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="sm:col-span-2 flex flex-wrap justify-end gap-2 pt-1">
                <button type="button" onClick={() => setIsProfileModalOpen(false)} className="px-4 py-2.5 rounded-xl border border-white/20 text-gray-200 hover:bg-white/5 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isProfileSaving} className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-semibold hover:from-indigo-500 hover:to-cyan-400 transition-all disabled:opacity-50">
                  {isProfileSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded-3xl border border-white/[0.12] bg-gradient-to-br from-[#171726] to-[#101019] p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h3 className="text-xl font-semibold text-white">Change Password</h3>
              <button onClick={() => setIsPasswordModalOpen(false)} className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePasswordChange} className="grid sm:grid-cols-2 gap-3">
              <Field
                label="Current Password"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData((prev) => ({ ...prev, currentPassword: e.target.value }))}
              />
              <Field
                label="New Password"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))}
              />
              <div className="sm:col-span-2 flex flex-wrap justify-end gap-2 pt-1">
                <button type="button" onClick={() => setIsPasswordModalOpen(false)} className="px-4 py-2.5 rounded-xl border border-white/20 text-gray-200 hover:bg-white/5 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-semibold hover:from-indigo-500 hover:to-cyan-400 transition-all">
                  Update Password
                </button>
              </div>
            </form>

            {passwordMessage && <p className="text-sm text-gray-300 mt-3">{passwordMessage}</p>}
          </div>
        </div>
      )}
    </div>
  )
}

function GlassPanel({ title, icon: Icon, children }) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#141421] to-[#0f0f17] p-5">
      <div className="pointer-events-none absolute -top-16 -right-10 w-44 h-44 bg-cyan-500/10 rounded-full blur-3xl" />
      <div className="flex items-center gap-2 mb-4">
        {Icon && <Icon className="w-4 h-4 text-cyan-300" />}
        <h3 className="text-white font-semibold">{title}</h3>
      </div>
      {children}
    </section>
  )
}

function SectionSpotlight({ title, subtitle }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/[0.08] bg-[#12121a] px-4 sm:px-5 py-4"
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-400/20 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-cyan-300" />
        </div>
        <div>
          <h3 className="text-white font-semibold">{title}</h3>
          <p className="text-sm text-gray-300 mt-0.5">{subtitle}</p>
        </div>
      </div>
    </motion.section>
  )
}

function Kpi({ icon: Icon, label, value, tone }) {
  return (
    <motion.div whileHover={{ y: -3 }} className="rounded-2xl border border-white/[0.08] bg-[#12121a] p-4">
      <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center mb-2">
        <Icon className={`w-4 h-4 ${tone}`} />
      </div>
      <p className="text-sm text-gray-300">{label}</p>
      <p className="text-2xl font-bold text-white mt-1">{value}</p>
    </motion.div>
  )
}

function Metric({ label, value, highlight }) {
  return (
    <div className={`rounded-xl border bg-white/[0.03] px-3 py-2 ${highlight ? 'border-cyan-400/30 bg-cyan-500/10' : 'border-white/[0.1]'}`}>
      <p className="text-[11px] uppercase tracking-wide text-gray-400">{label}</p>
      <p className={`text-base font-semibold mt-0.5 ${highlight ? 'text-cyan-300' : 'text-white'}`}>{value}</p>
    </div>
  )
}

function ProfileInfo({ label, value }) {
  return (
    <div className="rounded-xl bg-[#0f0f17] border border-white/[0.08] px-3 py-2.5">
      <p className="text-[11px] uppercase tracking-wide text-gray-500">{label}</p>
      <p className="text-sm text-white mt-0.5 break-all">{value}</p>
    </div>
  )
}

function Field({ label, ...props }) {
  return (
    <div>
      <label className="text-sm text-gray-300 mb-2 block">{label}</label>
      <input {...props} required className="w-full px-4 py-2.5 rounded-xl bg-[#0a0a0f] border border-white/[0.12] text-white focus:outline-none focus:border-cyan-500" />
    </div>
  )
}

function ReadOnlyField({ label, value }) {
  return (
    <div>
      <label className="text-sm text-gray-300 mb-2 block">{label}</label>
      <div className="w-full px-4 py-2.5 rounded-xl bg-[#0a0a0f] border border-white/[0.12] text-gray-300">
        {value || 'N/A'}
      </div>
    </div>
  )
}

function ChartMetric({ label, value, tone }) {
  return (
    <div className="rounded-lg border border-white/[0.08] bg-[#0b0f16] px-3 py-2">
      <p className="text-[11px] text-gray-500 uppercase tracking-wide">{label}</p>
      <p className={`text-sm font-semibold mt-0.5 ${tone}`}>{value}</p>
    </div>
  )
}

function PnlChart({ values }) {
  const maxAbs = Math.max(...values.map((value) => Math.abs(value)), 1)
  const avg = values.reduce((a, b) => a + b, 0) / Math.max(values.length, 1)

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:100%_24px] rounded-xl pointer-events-none" />
      <div className="h-52 flex items-end gap-2 rounded-xl px-2 py-3">
        {values.map((value, index) => (
          <div key={index} className="flex-1 h-full flex items-end justify-center">
            <div className="w-full h-full rounded-md bg-white/[0.03] flex items-end">
              <div
                className={`w-full rounded-t-md shadow-[0_0_20px_rgba(0,0,0,0.25)] ${value >= 0 ? 'bg-gradient-to-t from-emerald-500/60 via-emerald-400/70 to-emerald-200' : 'bg-gradient-to-t from-red-500/60 via-red-400/70 to-red-200'}`}
                style={{ height: `${Math.max((Math.abs(value) / maxAbs) * 100, 4)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-2 flex items-center justify-between text-[11px] text-gray-500 px-1">
        <span>Older</span>
        <span>Average P/L: {avg >= 0 ? '+' : ''}${avg.toFixed(2)}</span>
        <span>Latest</span>
      </div>
    </div>
  )
}
