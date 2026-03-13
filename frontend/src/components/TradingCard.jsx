import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createChart } from 'lightweight-charts'

const markets = [
  { id: 'BTC', name: 'Bitcoin', symbol: 'btcusdt', pair: 'BTC/USDT', icon: '₿', color: '#F7931A' },
  { id: 'ETH', name: 'Ethereum', symbol: 'ethusdt', pair: 'ETH/USDT', icon: 'Ξ', color: '#627EEA' },
  { id: 'SOL', name: 'Solana', symbol: 'solusdt', pair: 'SOL/USDT', icon: '◎', color: '#00FFA3' },
  { id: 'XAU', name: 'Gold', symbol: 'xaueur', pair: 'XAU/USD', icon: '⬡', color: '#FFD700' },
  { id: 'EUR', name: 'Euro', symbol: 'eurusdt', pair: 'EUR/USD', icon: '€', color: '#003399' },
]

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

    const fetchHistoricalData = async () => {
      try {
        const response = await fetch(
          `https://api.binance.com/api/v3/klines?symbol=${symbol.toUpperCase()}&interval=15m&limit=100`
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
        chart.applyOptions({ width: chartContainerRef.clientWidth })
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      ws.close()
      chart.remove()
    }
  }, [symbol])

  return <div ref={chartContainerRef} className="w-full h-[180px]" />
}

export default function TradingCard() {
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
            <AnimatePresence mode="wait">
              <motion.div
                key={price}
                initial={{ opacity: 0.5, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0.5, y: 5 }}
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
