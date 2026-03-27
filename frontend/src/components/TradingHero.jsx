import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { createChart } from 'lightweight-charts'
import { Link } from 'react-router-dom'
import { TrendingUp, TrendingDown, Star, ChevronRight, Activity, Zap, Shield, Clock, CreditCard, Users, Award, Globe, Menu, X } from 'lucide-react'

const markets = [
  { id: 'XAU', name: 'Gold', symbol: 'gold', pair: 'XAU/USD', icon: 'Au', color: '#FFD700' },
  { id: 'XAG', name: 'Silver', symbol: 'silver', pair: 'XAG/USD', icon: 'Ag', color: '#C0C0C0' },
  { id: 'WTI', name: 'Crude Oil', symbol: 'crude', pair: 'WTI/USD', icon: 'Oil', color: '#FF6B35' },
]

const COMMODITY_PRICES = {
  gold: { price: 3012.50, high: 3045.00, low: 2985.25, change: 0.85 },
  silver: { price: 33.45, high: 34.20, low: 32.80, change: 1.25 },
  crude: { price: 78.65, high: 80.20, low: 77.45, change: -0.62 },
}

function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        animate={{ 
          x: [0, 50, 0], 
          y: [0, -30, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-gradient-to-r from-indigo-600/15 via-purple-500/10 to-cyan-500/15 rounded-full blur-[100px]"
      />
      <motion.div
        animate={{ 
          x: [0, -40, 0], 
          y: [0, 40, 0],
          scale: [1, 1.05, 1]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/4 right-1/4 w-[250px] h-[250px] bg-gradient-to-r from-cyan-500/15 via-emerald-500/10 to-indigo-500/15 rounded-full blur-[80px]"
      />
    </div>
  )
}

function GridPattern() {
  return (
    <div className="absolute inset-0 pointer-events-none opacity-[0.015]">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="premium-grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#premium-grid)" />
      </svg>
    </div>
  )
}

function TradingChart({ symbol }) {
  const chartContainerRef = useRef(null)
  const chartRef = useRef(null)
  const [loading, setLoading] = useState(true)

  const getBasePrice = (sym) => {
    const prices = { gold: 3012, silver: 33.45, crude: 78.65 }
    return prices[sym.toLowerCase()] || 1000
  }

  const generateMockData = (basePrice, count = 200) => {
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
      height: 200,
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
    <div className="w-full h-[200px] relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0f]">
          <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <div ref={chartContainerRef} className="w-full h-full" />
    </div>
  )
}

export default function TradingHero() {
  const [activeMarket, setActiveMarket] = useState(markets[0])
  const [price, setPrice] = useState(COMMODITY_PRICES.gold.price)
  const [priceChange, setPriceChange] = useState(COMMODITY_PRICES.gold.change)
  const [high24h, setHigh24h] = useState(COMMODITY_PRICES.gold.high)
  const [low24h, setLow24h] = useState(COMMODITY_PRICES.gold.low)

  useEffect(() => {
    const data = COMMODITY_PRICES[activeMarket.symbol]
    if (data) {
      setPrice(data.price)
      setHigh24h(data.high)
      setLow24h(data.low)
      setPriceChange(data.change)
    }

    const interval = setInterval(() => {
      const data = COMMODITY_PRICES[activeMarket.symbol]
      if (data) {
        const fluctuation = (Math.random() - 0.5) * data.price * 0.001
        setPrice(prev => prev + fluctuation)
      }
    }, 3000)

    return () => clearInterval(interval)
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
    <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-[#050507] pt-20">
      <FloatingOrbs />
      <GridPattern />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Side - Content */}
          <motion.div 
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-center lg:text-left"
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-full mb-4 sm:mb-6"
            >
              <motion.span 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-emerald-400 rounded-full"
              />
              <span className="text-xs sm:text-sm text-gray-300 font-medium">Institutional Grade Trading</span>
              <div className="flex -space-x-2 ml-1 sm:ml-2 hidden sm:flex">
                {[1,2,3,4].map(i => (
                  <img key={i} src={`https://i.pravatar.cc/36?img=${i+15}`} alt="" className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-[#050507]" />
                ))}
              </div>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4 lg:mb-6 leading-tight"
            >
              North Star Markets{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 via-60% to-emerald-400 bg-clip-text text-transparent">
                Global Financial Markets & Trading Insights
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-sm sm:text-base text-gray-400 mb-6 lg:mb-8 max-w-xl mx-auto lg:mx-0"
            >
              Lightning-fast execution with institutional-grade tools and zero compromise on security.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start mb-6 lg:mb-8"
            >
              <Link 
                to="/open-account"
                className="group relative px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-indigo-600 via-purple-500 to-cyan-500 text-white font-semibold rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/25 text-sm sm:text-base"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Open Account <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <Link 
                to="/markets"
                className="px-5 sm:px-6 py-2.5 sm:py-3 bg-white/[0.03] backdrop-blur-sm border border-white/10 text-white font-semibold rounded-xl hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300 flex items-center gap-2 text-sm sm:text-base"
              >
                Explore <TrendingUp className="w-4 h-4" />
              </Link>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 lg:gap-8 text-xs sm:text-sm"
            >
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-white font-semibold">4.9</span>
                <span className="text-gray-500">Rating</span>
              </div>
              <div className="w-px h-6 bg-white/10 hidden sm:block" />
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                <span className="text-white font-semibold">150K+</span>
                <span className="text-gray-500">Traders</span>
              </div>
              <div className="w-px h-6 bg-white/10 hidden lg:block" />
              <div className="flex items-center gap-2 hidden lg:flex">
                <Globe className="w-5 h-5 text-emerald-400" />
                <span className="text-white font-semibold">180+</span>
                <span className="text-gray-500">Countries</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Premium Trading Card */}
          <motion.div 
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="relative"
          >
            {/* Main Card */}
            <div className="relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-2xl rounded-3xl p-1 overflow-hidden">
              {/* Animated Border */}
              <div className="absolute inset-0 rounded-3xl p-[1px] bg-gradient-to-r from-indigo-500/30 via-cyan-500/30 to-emerald-500/30">
                <div className="absolute inset-0 rounded-3xl bg-[#0a0a0f]/95" />
              </div>
              
              {/* Inner Glow */}
              <div className="absolute -inset-[100px] bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-cyan-500/10 blur-3xl" />
              
              <div className="relative z-10 p-5">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="relative w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-bold"
                      style={{ 
                        backgroundColor: `${activeMarket.color}15`,
                        color: activeMarket.color,
                        boxShadow: `0 0 20px ${activeMarket.color}20`
                      }}
                    >
                      {activeMarket.icon}
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#0a0a0f]" />
                    </motion.div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-white font-bold text-lg">{activeMarket.pair}</h3>
                        <motion.span 
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/15 rounded-full"
                        >
                          <motion.span 
                            animate={{ opacity: [1, 0.5, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="w-1.5 h-1.5 bg-emerald-400 rounded-full"
                          />
                          <span className="text-xs text-emerald-400 font-semibold">LIVE</span>
                        </motion.span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{activeMarket.name}</p>
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-4">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={price}
                      initial={{ opacity: 0.5, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0.5, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className={`text-4xl font-bold tracking-tight ${
                        priceDirection === 'up' ? 'text-emerald-400' : priceDirection === 'down' ? 'text-red-400' : 'text-white'
                      }`}
                    >
                      ${price?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '—'}
                    </motion.div>
                  </AnimatePresence>
                  <div className={`flex items-center gap-2 mt-1 ${
                    priceChange >= 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {priceChange >= 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span className="text-base font-semibold">
                      {priceChange >= 0 ? '+' : ''}{priceChange?.toFixed(2)}%
                    </span>
                    <span className="text-gray-500 text-xs font-medium">24h</span>
                  </div>
                </div>

                {/* Chart */}
                <div className="mb-4 rounded-xl overflow-hidden bg-[#0a0a0f] border border-white/5">
                  <TradingChart symbol={activeMarket.symbol} />
                </div>

                {/* Market Stats */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {stats.map((stat, i) => (
                    <motion.div 
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`text-center p-2 rounded-lg ${
                        stat.highlight 
                          ? 'bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20' 
                          : 'bg-white/[0.03] border border-white/5'
                      }`}
                    >
                      <div className="text-[10px] text-gray-500">{stat.label}</div>
                      <div className={`text-xs font-bold ${
                        stat.green ? 'text-emerald-400' : 'text-white'
                      }`}>{stat.value}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Market Selector */}
                <div className="flex gap-2">
                  {markets.map((market, index) => (
                    <motion.button
                      key={market.id}
                      onClick={() => setActiveMarket(market)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex-1 py-2 px-2 rounded-lg text-xs font-bold transition-all duration-300 ${
                        activeMarket.id === market.id
                          ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-500/25'
                          : 'bg-white/[0.05] text-gray-400 hover:bg-white/[0.1] hover:text-white border border-white/5'
                      }`}
                    >
                      {market.id}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating Decorations */}
            <motion.div 
              animate={{ 
                y: [0, -20, 0],
                rotate: [0, 5, 0]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-r from-indigo-600/30 to-cyan-500/30 rounded-3xl blur-2xl"
            />
            <motion.div 
              animate={{ 
                y: [0, 20, 0],
                rotate: [0, -5, 0]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-8 -left-8 w-20 h-20 bg-gradient-to-r from-emerald-600/30 to-purple-500/30 rounded-full blur-2xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
