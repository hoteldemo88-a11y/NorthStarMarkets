import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { createChart } from 'lightweight-charts'

const markets = [
  { id: 'XAU', name: 'Gold', symbol: 'gold', pair: 'XAU/USD', icon: 'Au', color: '#FFD700', type: 'commodity' },
  { id: 'XAG', name: 'Silver', symbol: 'silver', pair: 'XAG/USD', icon: 'Ag', color: '#C0C0C0', type: 'commodity' },
  { id: 'WTI', name: 'Crude Oil', symbol: 'crude', pair: 'WTI/USD', icon: 'Oil', color: '#FF6B35', type: 'commodity' },
  { id: 'BTC', name: 'Bitcoin', symbol: 'bitcoin', pair: 'BTC/USD', icon: '₿', color: '#F7931A', type: 'crypto' },
  { id: 'ETH', name: 'Ethereum', symbol: 'ethereum', pair: 'ETH/USD', icon: 'Ξ', color: '#627EEA', type: 'crypto' },
]

const MOCK_PRICES = {
  gold: { price: 4727.05, high: 4730.42, low: 4726.28, change: 0.02 },
  silver: { price: 76.52, high: 77.00, low: 75.50, change: 0.05 },
  crude: { price: 65.00, high: 70.00, low: 60.00, change: -1.00 },
  bitcoin: { price: 74000.00, high: 75000.00, low: 73000.00, change: 0.50 },
  ethereum: { price: 1650.00, high: 1700.00, low: 1600.00, change: 0.30 },
}

const getBasePrice = (sym) => {
  const prices = { gold: 4727.05, silver: 76.52, crude: 65.00, bitcoin: 74000, ethereum: 1650 }
  return prices[sym.toLowerCase()] || 1000
}

let cachedPrices = null
let lastFetchTime = 0
const CACHE_DURATION = 5000

const fetchRealTimePrices = async () => {
  const now = Date.now()
  if (cachedPrices && (now - lastFetchTime) < CACHE_DURATION) {
    return cachedPrices
  }

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/prices`)
    const data = await res.json()
    
    cachedPrices = data
    lastFetchTime = now
    return data
  } catch (error) {
    console.log('Using fallback prices', error)
    return {
      gold: { price: 4729.33, high: 4750.00, low: 4700.00, change: 0.50 },
      silver: { price: 76.52, high: 77.00, low: 75.50, change: 0.80 },
      crude: { price: 90.24, high: 95.00, low: 88.00, change: -1.10 },
      bitcoin: { price: 74242.52, high: 74814.54, low: 74145.62, change: 0.10 },
      ethereum: { price: 2320.05, high: 2344.10, low: 2318.52, change: -0.15 },
    }
  }
}

function generateMockData(basePrice, count = 100) {
  const data = []
  let price = basePrice
  const now = Math.floor(Date.now() / 1000)
  const interval = 900

  for (let i = count; i > 0; i--) {
    const change = (Math.random() - 0.5) * basePrice * 0.01
    const open = price
    const close = price + change
    const high = Math.max(open, close) + Math.random() * basePrice * 0.002
    const low = Math.min(open, close) - Math.random() * basePrice * 0.002

    data.push({
      time: now - (i * interval),
      open,
      high,
      low,
      close,
    })
    price = close
  }
  return data
}

function TradingChart({ symbol, type }) {
  const chartContainerRef = useRef(null)
  const chartRef = useRef(null)
  const [loading, setLoading] = useState(true)

  const getBasePrice = (sym) => {
    const prices = { gold: 4727.05, silver: 76.52, crude: 65.00, bitcoin: 74000, ethereum: 1650 }
    return prices[sym.toLowerCase()] || 1000
  }

  useEffect(() => {
    if (!chartContainerRef.current) return

    setLoading(true)

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: '#0a0a0f' },
        textColor: '#9CA3AF',
      },
      grid: {
        vertLines: { color: 'rgba(255,255,255,0.03)' },
        horzLines: { color: 'rgba(255,255,255,0.03)' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 180,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: 'rgba(255,255,255,0.05)',
      },
      rightPriceScale: {
        borderColor: 'rgba(255,255,255,0.05)',
      },
      crosshair: {
        mode: 0,
        vertLine: { color: 'rgba(99,102,241,0.4)', width: 1, style: 2 },
        horzLine: { color: 'rgba(99,102,241,0.4)', width: 1, style: 2 },
      },
    })

    const candleSeries = chart.addCandlestickSeries({
      upColor: '#10B981',
      downColor: '#EF4444',
      borderUpColor: '#10B981',
      borderDownColor: '#EF4444',
      wickUpColor: '#10B981',
      wickDownColor: '#EF4444',
    })

    chartRef.current = chart

    // Use mock data for commodities (no free API available)
    const mockData = generateMockData(getBasePrice(symbol))
    candleSeries.setData(mockData)
    chart.timeScale().fitContent()
    setLoading(false)

    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth })
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (chartRef.current) {
        chartRef.current.remove()
        chartRef.current = null
      }
    }
  }, [symbol])

  return (
    <div className="w-full h-[180px] relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0f] z-10">
          <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <div ref={chartContainerRef} className="w-full h-full" />
    </div>
  )
}

export default function TradingCard() {
  const [activeMarket, setActiveMarket] = useState(markets[0])
  const [price, setPrice] = useState(getBasePrice(activeMarket.symbol))
  const [priceChange, setPriceChange] = useState(MOCK_PRICES.gold.change)
  const [high24h, setHigh24h] = useState(MOCK_PRICES.gold.high)
  const [low24h, setLow24h] = useState(MOCK_PRICES.gold.low)
  const realPriceRef = useRef(null)
  const fetchCountRef = useRef(0)

  useEffect(() => {
    fetchCountRef.current = 0
    realPriceRef.current = null
    
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
          realPriceRef.current = apiData.price
          setPrice(apiData.price)
          setHigh24h(apiData.high)
          setLow24h(apiData.low)
          setPriceChange(apiData.change)
        }
      } catch (error) {
        console.log('Price fetch error, using fallback', error)
        const fallback = MOCK_PRICES[activeMarket.symbol]
        if (fallback) {
          realPriceRef.current = fallback.price
          setPrice(fallback.price)
          setHigh24h(fallback.high)
          setLow24h(fallback.low)
          setPriceChange(fallback.change)
        }
      }
    }

    const showDummy = () => {
      if (realPriceRef.current) {
        const basePrice = realPriceRef.current
        const fluctuation = (Math.random() - 0.5) * basePrice * 0.002
        setPrice(basePrice + fluctuation)
      }
    }

    fetchRealPrice()

    const priceInterval = setInterval(() => {
      fetchCountRef.current++
      if (fetchCountRef.current >= 3) {
        fetchCountRef.current = 0
        fetchRealPrice()
      } else {
        showDummy()
      }
    }, 3000)

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
            <TradingChart symbol={activeMarket.symbol} type={activeMarket.type} />
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
