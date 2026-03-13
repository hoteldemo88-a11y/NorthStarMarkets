import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createChart } from 'lightweight-charts'
import { Link } from 'react-router-dom'
import { TrendingUp, TrendingDown, Star, ChevronRight, Activity, Zap, Shield, Clock, CreditCard, Users, Award, Globe, Menu, X } from 'lucide-react'

const markets = [
  { id: 'BTC', name: 'Bitcoin', symbol: 'btcusdt', pair: 'BTC/USDT', icon: '₿', color: '#F7931A' },
  { id: 'ETH', name: 'Ethereum', symbol: 'ethusdt', pair: 'ETH/USDT', icon: 'Ξ', color: '#627EEA' },
  { id: 'SOL', name: 'Solana', symbol: 'solusdt', pair: 'SOL/USDT', icon: '◎', color: '#00FFA3' },
  { id: 'XAU', name: 'Gold', symbol: 'xaueur', pair: 'XAU/USD', icon: '⬡', color: '#FFD700' },
  { id: 'EUR', name: 'Euro', symbol: 'eurusdt', pair: 'EUR/USD', icon: '€', color: '#003399' },
]

function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        animate={{ 
          x: [0, 100, 0], 
          y: [0, -50, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-r from-indigo-600/20 via-purple-500/15 to-cyan-500/20 rounded-full blur-[150px]"
      />
      <motion.div
        animate={{ 
          x: [0, -80, 0], 
          y: [0, 80, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-gradient-to-r from-cyan-500/20 via-emerald-500/15 to-indigo-500/20 rounded-full blur-[120px]"
      />
      <motion.div
        animate={{ 
          x: [0, 50, 0], 
          y: [0, -30, 0]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-600/10 via-pink-500/10 to-cyan-500/10 rounded-full blur-[180px]"
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

  useEffect(() => {
    if (!chartContainerRef.current) return

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: 'solid', color: 'transparent' },
        textColor: '#6B7280',
      },
      grid: {
        vertLines: { color: 'rgba(255,255,255,0.03)' },
        horzLines: { color: 'rgba(255,255,255,0.03)' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 220,
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

    const fetchHistoricalData = async () => {
      try {
        const response = await fetch(
          `https://api.binance.com/api/v3/klines?symbol=${symbol.toUpperCase()}&interval=15m&limit=200`
        )
        const data = await response.json()
        
        const candleData = data.map(d => ({
          time: d[0] / 1000,
          open: parseFloat(d[1]),
          high: parseFloat(d[2]),
          low: parseFloat(d[3]),
          close: parseFloat(d[4]),
        }))
        
        candleSeries.setData(candleData)
        chart.timeScale().fitContent()
      } catch (error) {
        console.error('Failed to fetch historical data:', error)
      }
    }

    fetchHistoricalData()

    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@kline_15m`)

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      const kline = data.k
      
      const candle = {
        time: kline.t / 1000,
        open: parseFloat(kline.o),
        high: parseFloat(kline.h),
        low: parseFloat(kline.l),
        close: parseFloat(kline.c),
      }
      
      candleSeries.update(candle)
    }

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth })
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      ws.close()
      chart.remove()
    }
  }, [symbol])

  return <div ref={chartContainerRef} className="w-full h-[220px]" />
}

export default function TradingHero() {
  const [activeMarket, setActiveMarket] = useState(markets[0])
  const [price, setPrice] = useState(null)
  const [priceChange, setPriceChange] = useState(0)
  const [priceDirection, setPriceDirection] = useState(null)
  const [high24h, setHigh24h] = useState(0)
  const [low24h, setLow24h] = useState(0)
  const wsRef = useRef(null)

  const fetchMarketData = useCallback(async (market) => {
    try {
      const response = await fetch(
        `https://api.binance.com/api/v3/ticker/24hr?symbol=${market.symbol.toUpperCase()}`
      )
      const data = await response.json()
      setPrice(parseFloat(data.lastPrice))
      setHigh24h(parseFloat(data.highPrice))
      setLow24h(parseFloat(data.lowPrice))
      setPriceChange(parseFloat(data.priceChangePercent))
    } catch (error) {
      console.error('Failed to fetch market data:', error)
    }
  }, [])

  useEffect(() => {
    fetchMarketData(activeMarket)
    
    if (wsRef.current) {
      wsRef.current.close()
    }
    
    wsRef.current = new WebSocket(`wss://stream.binance.com:9443/ws/${activeMarket.symbol.toLowerCase()}@ticker`)
    
    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data)
      const newPrice = parseFloat(data.c)
      
      if (price && newPrice !== price) {
        setPriceDirection(newPrice > price ? 'up' : 'down')
        setTimeout(() => setPriceDirection(null), 500)
      }
      setPrice(newPrice)
      setHigh24h(parseFloat(data.h))
      setLow24h(parseFloat(data.l))
      setPriceChange(parseFloat(data.P))
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [activeMarket, fetchMarketData, price])

  const stats = [
    { label: '24h High', value: high24h ? `$${high24h.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—' },
    { label: '24h Low', value: low24h ? `$${low24h.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—' },
    { label: 'Spread', value: '0.01', highlight: true },
    { label: 'Leverage', value: '1:200', highlight: true },
    { label: 'Exec', value: '<50ms' },
    { label: 'Swap', value: 'Free', green: true },
  ]

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-[#050507]">
      <FloatingOrbs />
      <GridPattern />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Left Side - Content */}
          <motion.div 
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-center lg:text-left"
          >
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-3 px-5 py-2.5 bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-full mb-8"
            >
              <motion.span 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2.5 h-2.5 bg-emerald-400 rounded-full"
              />
              <span className="text-sm text-gray-300 font-medium">Institutional Grade Trading</span>
              <div className="flex -space-x-2 ml-2">
                {[1,2,3,4].map(i => (
                  <img key={i} src={`https://i.pravatar.cc/36?img=${i+15}`} alt="" className="w-7 h-7 rounded-full border-2 border-[#050507]" />
                ))}
              </div>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 leading-tight"
            >
              Trade the Future with{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 via-60% to-emerald-400 bg-clip-text text-transparent">
                North Star
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-base sm:text-lg text-gray-400 mb-8 max-w-xl mx-auto lg:mx-0"
            >
              Experience lightning-fast execution with institutional-grade tools and zero compromise on security.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4 justify-center lg:justify-start mb-8"
            >
              <Link 
                to="/open-account"
                className="group relative px-6 py-3 bg-gradient-to-r from-indigo-600 via-purple-500 to-cyan-500 text-white font-semibold rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/25"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Open Account <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <Link 
                to="/markets"
                className="px-6 py-3 bg-white/[0.03] backdrop-blur-sm border border-white/10 text-white font-semibold rounded-xl hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300 flex items-center gap-2"
              >
                Explore Markets <TrendingUp className="w-4 h-4" />
              </Link>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-8 text-sm"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-white font-semibold">4.9</span>
                <span className="text-gray-500">Rating</span>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="flex items-center gap-2.5">
                <Users className="w-5 h-5 text-cyan-400" />
                <span className="text-white font-semibold">150K+</span>
                <span className="text-gray-500">Traders</span>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="flex items-center gap-2.5">
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
                <div className="mb-4 rounded-xl overflow-hidden bg-white/[0.02] border border-white/5">
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
