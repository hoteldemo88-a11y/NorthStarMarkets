import { motion } from 'framer-motion'

export function AdminPanel({ children, className = '' }) {
  return <div className={`rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#151522] to-[#0e0e16] ${className}`}>{children}</div>
}

export function SectionTitle({ title, subtitle, right }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white">{title}</h2>
        {subtitle && <p className="text-sm text-gray-400 mt-1">{subtitle}</p>}
      </div>
      {right}
    </div>
  )
}

export function StatTile({ icon: Icon, label, value, tone = 'from-indigo-500/25 to-cyan-400/10', highlight }) {
  return (
    <motion.div whileHover={{ y: -4 }} className={`rounded-2xl border bg-[#10101a] p-4 sm:p-5 ${highlight ? 'border-cyan-400/30 bg-cyan-500/10' : 'border-white/[0.08]'}`}>
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tone} flex items-center justify-center mb-3`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <p className="text-xs uppercase tracking-wide text-gray-400">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${highlight ? 'text-cyan-300' : 'text-white'}`}>{value}</p>
    </motion.div>
  )
}

export function StatusPill({ status }) {
  const cls =
    status === 'approved'
      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
      : status === 'rejected'
      ? 'bg-red-500/20 text-red-300 border-red-400/30'
      : 'bg-amber-500/20 text-amber-300 border-amber-400/30'
  return <span className={`text-xs px-2.5 py-1 rounded-full border ${cls}`}>{status}</span>
}

export function TinyBars({ values = [], color = 'from-cyan-400 to-indigo-500' }) {
  const max = Math.max(...values, 1)
  return (
    <div className="h-24 flex items-end gap-1">
      {values.map((value, index) => (
        <div key={index} className="flex-1 rounded-t-md bg-white/10 overflow-hidden">
          <div className={`w-full bg-gradient-to-t ${color}`} style={{ height: `${Math.max((value / max) * 100, 6)}%` }} />
        </div>
      ))}
    </div>
  )
}

export function LineChart({ values = [], stroke = '#22d3ee', fill = 'rgba(34,211,238,0.15)' }) {
  const width = 320
  const height = 120
  const max = Math.max(...values, 1)
  const min = Math.min(...values, 0)
  const span = Math.max(max - min, 1)

  const points = values
    .map((value, index) => {
      const x = (index / Math.max(values.length - 1, 1)) * width
      const y = height - ((value - min) / span) * (height - 12) - 6
      return `${x},${y}`
    })
    .join(' ')

  const area = `${points} ${width},${height} 0,${height}`

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-32">
      <polyline points={area} fill={fill} stroke="none" />
      <polyline points={points} fill="none" stroke={stroke} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
