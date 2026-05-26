import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const markets = [
  { id: 'XAU', name: 'Gold', symbol: 'gold', pair: 'XAU/USD', icon: 'Au', color: '#FFD700', type: 'commodity' },
  { id: 'XAG', name: 'Silver', symbol: 'silver', pair: 'XAG/USD', icon: 'Ag', color: '#C0C0C0', type: 'commodity' },
  { id: 'WTI', name: 'Crude Oil', symbol: 'crude', pair: 'WTI/USD', icon: 'Oil', color: '#FF6B35', type: 'commodity' },
  { id: 'BTC', name: 'Bitcoin', symbol: 'bitcoin', pair: 'BTC/USD', icon: '₿', color: '#F7931A', type: 'crypto' },
  { id: 'ETH', name: 'Ethereum', symbol: 'ethereum', pair: 'ETH/USD', icon: 'Ξ', color: '#627EEA', type: 'crypto' },
]

const MOCK_PRICES = {
  gold: { price: 4564.00, high: 4630.00, low: 4560.00, change: 0.25 },
  silver: { price: 73.50, high: 74.50, low: 72.50, change: -0.85 },
  crude: { price: 105.00, high: 106.00, low: 99.00, change: 1.20 },
  bitcoin: { price: 78975.00, high: 80000.00, low: 78000.00, change: 0.35 },
  ethereum: { price: 2340.00, high: 2400.00, low: 2308.00, change: 0.55 },
}

const getBasePrice = (sym) => {
  const prices = { gold: 4564.00, silver: 73.50, crude: 105.00, bitcoin: 78975.00, ethereum: 2340.00 }
  return prices[sym.toLowerCase()] || 1000
}

function TradingChart({ symbol }) {
  const containerId = `tv-chart-card-${symbol}`

  const tvSymbolMap = {
    gold: 'OANDA:XAUUSD',
    silver: 'OANDA:XAGUSD',
    crude: 'OANDA:WTICOUSD',
    bitcoin: 'COINBASE:BTCUSD',
    ethereum: 'COINBASE:ETHUSD'
  }

  const tvSymbol = tvSymbolMap[symbol.toLowerCase()] || `TVC:${symbol.toUpperCase()}`

  useEffect(() => {
    const container = document.getElementById(containerId)
    if (!container) return

    // Clear previous widget
    container.innerHTML = '<div class="tradingview-widget-container__widget"></div>'

    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/tv.js'
    script.async = true
    script.onload = () => {
      if (window.TradingView && window.TradingView.widget) {
        new window.TradingView.widget({
          container_id: containerId,
          autosize: true,
          symbol: tvSymbol,
          interval: 'D',
          timezone: 'Etc/UTC',
          theme: 'dark',
          style: '2',
          locale: 'en',
          toolbar_bg: '#0a0a0f',
          enable_publishing: false,
          hide_top_toolbar: true,
          hide_side_toolbar: true,
          allow_symbol_change: false,
          save_image: false,
          studies: [],
          hide_legend: true,
          withdateranges: false,
          shownav: false,
          height: 180,
        })
      }
    }
    document.head.appendChild(script)

    return () => {
      if (container) container.innerHTML = '<div class="tradingview-widget-container__widget"></div>'
    }
  }, [symbol, tvSymbol, containerId])

  return (
    <div className="w-full h-[180px] relative">
      <div id={containerId} className="tradingview-widget-container" style={{ width: '100%', height: '100%' }} />
    </div>
  )
}

export default function TradingCard() {
  const [activeMarket, setActiveMarket] = useState(markets[0])
  const [price, setPrice] = useState(getBasePrice(activeMarket.symbol))
  const [priceChange, setPriceChange] = useState(MOCK_PRICES.gold.change)
  const [high24h, setHigh24h] = useState(MOCK_PRICES.gold.high)
  const [low24h, setLow24h] = useState(MOCK_PRICES.gold.low)

  useEffect(() => {
    let isActive = true

    const fetchRealPrice = async () => {
      if (!isActive) return

      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/prices`)
        if (!res.ok) throw new Error('API error')
        const data = await res.json()
        if (!isActive) return

        if (data && data[activeMarket.symbol]) {
          const apiData = data[activeMarket.symbol]
          setPrice(apiData.price)
          setHigh24h(apiData.high)
          setLow24h(apiData.low)
          setPriceChange(apiData.change)
        }
      } catch (error) {
        console.log('Price fetch error, using fallback', error)
        const fallback = MOCK_PRICES[activeMarket.symbol]
        if (fallback) {
          setPrice(fallback.price)
          setHigh24h(fallback.high)
          setLow24h(fallback.low)
          setPriceChange(fallback.change)
        }
      }
    }

    fetchRealPrice()

    const priceInterval = setInterval(fetchRealPrice, 3600000)

    return () => {
      isActive = false
      clearInterval(priceInterval)
    }
  }, [activeMarket])

  const stats = [
    { label: '24h High', value: high24h ? `$${high24h.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—' },
    { label: '24h Low', value: low24h ? `$${low24h.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—' },
    { label: 'Spread', value: activeMarket.symbol === 'gold' ? '0.50' : activeMarket.symbol === 'silver' ? '0.02' : '0.05', highlight: true },
    { label: 'Leverage', value: '1:200', highlight: true },
    { label: 'Exec', value: '<50ms' },
    { label: 'Swap', value: 'Free', green: true },
  ]

  return (
    <motion.div 
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="relative"
    >
      {/* Glow effect behind card */}
      <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 via-cyan-500 to-emerald-500 rounded-3xl blur-xl opacity-30" />
      
      <div className="relative bg-gradient-to-br from-[#0f0f18] to-[#0a0a12] border border-white/10 rounded-3xl p-5 overflow-hidden">
        {/* Animated gradient border effect */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-indigo-500/10 via-cyan-500/10 to-emerald-500/10 p-[1px]">
          <div className="absolute inset-0 rounded-3xl bg-[#0a0a12]/95" />
        </div>
        
        {/* Subtle inner glow */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div 
                className="relative w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-bold"
                style={{ 
                  background: `linear-gradient(135deg, ${activeMarket.color}25, ${activeMarket.color}10)`,
                  color: activeMarket.color,
                  boxShadow: `0 0 20px ${activeMarket.color}30`
                }}
              >
                {activeMarket.icon}
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0a0a12]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-white font-bold text-lg">{activeMarket.pair}</h3>
                  <span className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-xs text-emerald-400 font-semibold">LIVE</span>
                  </span>
                </div>
                <p className="text-sm text-gray-400">{activeMarket.name}</p>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="mb-4">
            <div className="text-4xl font-bold tracking-tight text-white">
              ${price?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className={`flex items-center gap-2 mt-1 ${
              priceChange >= 0 ? 'text-emerald-400' : 'text-red-400'
            }`}>
              {priceChange >= 0 ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
              )}
              <span className="font-semibold">{priceChange >= 0 ? '+' : ''}{priceChange?.toFixed(2)}%</span>
              <span className="text-gray-500 text-sm">24h</span>
            </div>
          </div>

          {/* Chart */}
          <div className="mb-4 rounded-xl overflow-hidden bg-white/[0.02] border border-white/5">
            <TradingChart symbol={activeMarket.symbol} />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {stats.map((stat, i) => (
              <div 
                key={i} 
                className={`text-center p-2 rounded-lg ${
                  stat.highlight 
                    ? 'bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20' 
                    : 'bg-white/5 border border-white/5'
                }`}
              >
                <div className="text-[10px] text-gray-500 uppercase tracking-wide">{stat.label}</div>
                <div className={`text-sm font-bold ${
                  stat.green ? 'text-emerald-400' : stat.highlight ? 'text-cyan-400' : 'text-white'
                }`}>{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Market Selector */}
          <div className="flex gap-2">
            {markets.map((market) => (
              <button
                key={market.id}
                onClick={() => setActiveMarket(market)}
                className={`flex-1 py-2 px-2 rounded-lg text-xs font-bold transition-all duration-300 ${
                  activeMarket.id === market.id
                    ? 'bg-gradient-to-r from-indigo-600 via-purple-500 to-cyan-500 text-white shadow-lg shadow-indigo-500/25'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5'
                }`}
              >
                {market.id}
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
