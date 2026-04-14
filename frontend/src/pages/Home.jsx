import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { TrendingUp, Shield, Zap, Globe, Users, Award, ChevronRight, ArrowRight, Star, Bitcoin, Activity, Currency, Wheat, Gem, Zap as EnergyIcon, ArrowUpRight, CheckCircle, Quote, Lock, Clock, CreditCard, HeadphonesIcon, TrendingDown, Play } from 'lucide-react'
import TradingCard from '../components/TradingCard'

const stats = [
  { value: 2.5, suffix: 'B+', label: 'Trading Volume', prefix: '$', decimals: 1 },
  { value: 150, suffix: 'K+', label: 'Active Traders', prefix: '', decimals: 0 },
  { value: 99.9, suffix: '%', label: 'Uptime', prefix: '', decimals: 1 },
  { value: 180, suffix: '+', label: 'Countries', prefix: '', decimals: 0 },
]

function Counter({ value, suffix, prefix, decimals, label, delay }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      let start = 0
      const end = value
      const duration = 2000
      const increment = end / (duration / 16)
      
      const timer = setInterval(() => {
        start += increment
        if (start >= end) {
          setCount(end)
          clearInterval(timer)
        } else {
          setCount(start)
        }
      }, 16)
      
      return () => clearInterval(timer)
    }, delay)
    
    return () => clearTimeout(timer)
  }, [value, delay])

  return (
    <div className="bg-gradient-to-br from-[#12121a] to-[#0c0c10] border border-white/10 rounded-3xl p-6 text-center group hover:border-indigo-500/30 transition-all duration-300">
      <div className="flex items-center justify-center mb-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/30 to-cyan-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
          {label.includes('Volume') && <TrendingUp className="w-6 h-6 text-indigo-400" />}
          {label.includes('Traders') && <Users className="w-6 h-6 text-cyan-400" />}
          {label.includes('Uptime') && <Clock className="w-6 h-6 text-emerald-400" />}
          {label.includes('Countries') && <Globe className="w-6 h-6 text-purple-400" />}
        </div>
      </div>
      <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent mb-2">
        {prefix}{count.toFixed(decimals)}{suffix}
      </div>
      <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">{label}</div>
    </div>
  )
}

const markets = [
  { icon: Currency, name: 'Currencies', desc: 'Trade major, minor & exotic pairs', color: 'from-blue-500 to-cyan-400' },
  { icon: Wheat, name: 'Agricultural', desc: 'Wheat, corn, soybeans & more', color: 'from-green-500 to-emerald-400' },
  { icon: Gem, name: 'Metals', desc: 'Gold, silver, platinum', color: 'from-amber-500 to-yellow-400' },
  { icon: EnergyIcon, name: 'Energy', desc: 'Oil, natural gas & energy', color: 'from-orange-500 to-red-400' },
]

const services = [
  { title: 'Advanced Portfolio', desc: 'Products and services ideal for immediate diversification with a single investment.' },
  { title: 'Transparent Structure', desc: 'Our structure is designed to be clear and transparent. You\'ll always know what fees you\'re looking at.' },
  { title: 'No Membership Fees', desc: 'Our fees are based on your assignments, nothing else. We charge a one-time fee.' },
]

const portfolio = [
  { title: 'Venture Portfolio', desc: 'Private equity portfolio contains a curated selection of top-tier venture capital funds.', icon: ArrowUpRight },
  { title: 'Buyout Portfolio', desc: 'Is a core private equity strategy, accounting for the largest share of funds in the market.', icon: TrendingUp },
]

const fees = [
  { title: 'No Membership Dues', desc: 'Our fees are based on your allocations — nothing else.' },
  { title: 'No Hidden Fees', desc: 'Each Key Investor Document clearly lays out fund-specific fees.' },
  { title: 'Professional Consultant', desc: 'We remain fiercely objective in choosing the best opportunities.' },
]

const testimonials = [
  { name: 'Sarah Chen', role: 'Professional Trader', content: 'North Star Markets has completely transformed my trading experience. The execution speed is unmatched.', rating: 5, image: 'https://i.pravatar.cc/150?img=1' },
  { name: 'Michael Rodriguez', role: 'Fund Manager', content: 'Best platform I have ever used. Institutional-grade tools and security.', rating: 5, image: 'https://i.pravatar.cc/150?img=3' },
  { name: 'Emily Watson', role: 'Day Trader', content: 'Everything exceeds my expectations. Highly recommended!', rating: 5, image: 'https://i.pravatar.cc/150?img=5' },
  { name: 'David Kim', role: 'Algo Trader', content: 'The API is lightning fast and the spreads are incredibly tight.', rating: 5, image: 'https://i.pravatar.cc/150?img=8' },
  { name: 'Lisa Anderson', role: 'Crypto Trader', content: 'Best broker I have worked with. Professional, reliable, and trustworthy.', rating: 5, image: 'https://i.pravatar.cc/150?img=9' },
  { name: 'James Wilson', role: 'Forex Trader', content: 'Great customer service and competitive spreads. Highly recommend!', rating: 5, image: 'https://i.pravatar.cc/150?img=11' },
  { name: 'Anna Martinez', role: 'Stock Trader', content: 'Excellent platform with great tools for technical analysis.', rating: 5, image: 'https://i.pravatar.cc/150?img=16' },
  { name: 'Robert Taylor', role: 'Portfolio Manager', content: 'Outstanding execution and transparent pricing. Very satisfied!', rating: 5, image: 'https://i.pravatar.cc/150?img=12' },
  { name: 'John Smith', role: 'Institutional Trader', content: 'The best liquidity and execution quality in the industry.', rating: 5, image: 'https://i.pravatar.cc/150?img=14' },
  { name: 'Maria Santos', role: 'Retail Trader', content: 'Finally a broker that truly cares about their customers.', rating: 5, image: 'https://i.pravatar.cc/150?img=20' },
  { name: 'Kevin Brown', role: 'Scalper', content: 'Ultra-fast execution and no requotes. Perfect for scalping!', rating: 5, image: 'https://i.pravatar.cc/150?img=15' },
  { name: 'Jennifer Lee', role: 'Swing Trader', content: 'Great analytical tools and educational resources.', rating: 5, image: 'https://i.pravatar.cc/150?img=23' },
]

const liveMarkets = [
  { pair: 'BTC/USD', price: '84,250', change: '+1.85%', up: true },
  { pair: 'EUR/USD', price: '1.0785', change: '+0.08%', up: true },
  { pair: 'GOLD', price: '4,747', change: '-0.37%', up: false },
  { pair: 'AAPL', price: '198.42', change: '+0.65%', up: true },
]

const traderCards = [
  { name: 'Alex Thompson', country: 'USA', profit: '+245%', trades: '12.5K+', winRate: '89%', badge: 'Top Trader', image: 'https://i.pravatar.cc/150?img=60' },
  { name: 'Maria Garcia', country: 'Spain', profit: '+189%', trades: '8.2K+', winRate: '85%', badge: 'Pro', image: 'https://i.pravatar.cc/150?img=45' },
  { name: 'James Wilson', country: 'UK', profit: '+312%', trades: '15K+', winRate: '92%', badge: 'Elite', image: 'https://i.pravatar.cc/150?img=52' },
  { name: 'Sophie Martin', country: 'France', profit: '+156%', trades: '6.8K+', winRate: '82%', badge: 'Pro', image: 'https://i.pravatar.cc/150?img=44' },
  { name: 'Chen Wei', country: 'China', profit: '+278%', trades: '11K+', winRate: '88%', badge: 'Top Trader', image: 'https://i.pravatar.cc/150?img=68' },
  { name: 'Ahmed Hassan', country: 'UAE', profit: '+198%', trades: '9.5K+', winRate: '86%', badge: 'Pro', image: 'https://i.pravatar.cc/150?img=57' },
  { name: 'Emma Brown', country: 'Australia', profit: '+167%', trades: '7.2K+', winRate: '84%', badge: 'Rising Star', image: 'https://i.pravatar.cc/150?img=41' },
  { name: 'Lucas Silva', country: 'Brazil', profit: '+234%', trades: '10.8K+', winRate: '87%', badge: 'Top Trader', image: 'https://i.pravatar.cc/150?img=50' },
  { name: 'Anna Mueller', country: 'Germany', profit: '+145%', trades: '5.6K+', winRate: '81%', badge: 'Pro', image: 'https://i.pravatar.cc/150?img=47' },
  { name: 'Raj Patel', country: 'India', profit: '+289%', trades: '13.2K+', winRate: '91%', badge: 'Elite', image: 'https://i.pravatar.cc/150?img=65' },
  { name: 'Yuki Tanaka', country: 'Japan', profit: '+176%', trades: '8.9K+', winRate: '83%', badge: 'Pro', image: 'https://i.pravatar.cc/150?img=53' },
  { name: 'Oliver Smith', country: 'Canada', profit: '+223%', trades: '10.1K+', winRate: '90%', badge: 'Top Trader', image: 'https://i.pravatar.cc/150?img=55' },
]

const features = [
  { icon: Zap, title: 'Lightning Fast', desc: 'Sub-50ms execution' },
  { icon: Shield, title: 'Secure', desc: 'Bank-grade encryption' },
  { icon: CreditCard, title: 'No Fees', desc: 'Zero deposits' },
]

const liveMarketsData = [
  { id: 'BTC', name: 'Bitcoin', pair: 'BTC/USD', price: 67234, change: 2.45, icon: Bitcoin },
  { id: 'ETH', name: 'Ethereum', pair: 'ETH/USD', price: 3456, change: 3.21, icon: Activity },
  { id: 'EUR', name: 'Euro', pair: 'EUR/USD', price: 1.0892, change: 0.12, icon: Currency },
  { id: 'GOLD', name: 'Gold', pair: 'XAU/USD', price: 4747, change: -0.37, icon: Gem },
]

export default function Home() {
  return (
    <div className="bg-[#0a0a0f] w-full max-w-full overflow-x-hidden">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[-20%] left-[-30%] sm:left-[-10%] w-[150%] sm:w-[700px] h-[400px] sm:h-[700px] bg-indigo-600/20 rounded-full blur-[100px] sm:blur-[150px]" />
          <div className="absolute bottom-[-20%] right-[-30%] sm:right-[-10%] w-[150%] sm:w-[700px] h-[400px] sm:h-[700px] bg-cyan-500/20 rounded-full blur-[100px] sm:blur-[150px]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-[#12121a] border border-white/[0.1] rounded-full">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-sm text-gray-200">Trusted by 150,000+ traders</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white">
                North Star Markets<br />
                <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">Global Financial Markets & Trading Insights</span>
              </h1>

              <p className="text-lg text-gray-300 mb-8 max-w-lg">Experience next-generation trading with institutional-grade tools, lightning-fast execution, and unmatched security.</p>

              <div className="flex flex-wrap gap-4 mb-8">
                <Link to="/open-account" className="px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-600 rounded-xl hover:from-indigo-500 hover:to-indigo-500 transition-all duration-300 shadow-lg shadow-indigo-500/25 flex items-center gap-2">
                  Open Account <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/markets" className="px-8 py-4 text-base font-semibold text-white bg-[#12121a] border border-white/[0.15] rounded-xl hover:bg-white/[0.05] transition-all flex items-center gap-2">
                  <Play className="w-4 h-4" /> Learn More
                </Link>
              </div>

              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-3">
                    {[
                      'https://i.pravatar.cc/150?img=60',
                      'https://i.pravatar.cc/150?img=45',
                      'https://i.pravatar.cc/150?img=52',
                      'https://i.pravatar.cc/150?img=44',
                      'https://i.pravatar.cc/150?img=68'
                    ].map((img, i) => (
                      <img 
                        key={i}
                        src={img} 
                        alt="Reviewer"
                        className="w-10 h-10 rounded-full border-2 border-[#0a0a0f] object-cover"
                      />
                    ))}
                  </div>
                  <div>
                    <div className="flex items-center gap-1 mb-0.5">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
                    </div>
                    <span className="text-xs text-gray-400">5.0 rating from 10,000+ reviews</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="hidden lg:block">
              <TradingCard />
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
            {stats.map((stat, i) => (
              <Counter key={stat.label} {...stat} delay={i * 200} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Trusted By Traders - Auto Sliding Cards */}
      <section className="py-24 bg-[#0a0a0f] overflow-hidden">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">Trusted By Traders <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">Worldwide</span></h2>
            <p className="text-gray-400 text-lg">Join thousands of successful traders achieving their financial goals</p>
          </motion.div>
        </div>

        <div className="relative">
          {/* Gradient fade left */}
          <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-[#0a0a0f] to-transparent z-10" />
          {/* Gradient fade right */}
          <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-[#0a0a0f] to-transparent z-10" />
          
          {/* Sliding cards container */}
          <div className="overflow-hidden py-4">
            <motion.div 
              className="flex gap-6"
              animate={{ x: [0, -100 * (traderCards.length / 2)] }}
              transition={{ 
                x: { 
                  repeat: Infinity, 
                  repeatType: "loop",
                  duration: 40,
                  ease: "linear"
                }
              }}
            >
              {[...traderCards, ...traderCards].map((trader, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="flex-shrink-0 w-72 sm:w-80 bg-gradient-to-br from-[#12121a] to-[#0c0c10] border border-white/10 rounded-3xl p-5 sm:p-6 shadow-2xl shadow-black/30"
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img 
                          src={trader.image} 
                          alt={trader.name}
                          className="w-14 h-14 rounded-2xl object-cover shadow-lg"
                        />
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-[#0a0a0f]" />
                      </div>
                      <div>
                        <div className="font-bold text-white text-lg">{trader.name}</div>
                        <div className="flex items-center gap-1 text-gray-400 text-sm">
                          <Globe className="w-3 h-3" />
                          {trader.country}
                        </div>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      trader.badge === 'Elite' ? 'bg-amber-500/20 text-amber-400' :
                      trader.badge === 'Top Trader' ? 'bg-purple-500/20 text-purple-400' :
                      'bg-indigo-500/20 text-indigo-400'
                    }`}>
                      {trader.badge}
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-3 mb-5">
                    <div className="bg-white/5 rounded-2xl p-3 text-center">
                      <div className="text-xl font-bold text-emerald-400">{trader.profit}</div>
                      <div className="text-xs text-gray-500">Profit</div>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-3 text-center">
                      <div className="text-xl font-bold text-white">{trader.trades}</div>
                      <div className="text-xs text-gray-500">Trades</div>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-3 text-center">
                      <div className="text-xl font-bold text-cyan-400">{trader.winRate}</div>
                      <div className="text-xs text-gray-500">Win Rate</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="bg-white/5 rounded-full h-2 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${parseInt(trader.winRate)}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className="h-full bg-gradient-to-r from-indigo-500 via-cyan-500 to-emerald-500 rounded-full"
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Markets */}
      <section className="py-20 bg-[#0c0c10]">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Our <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">Markets</span></h2>
            <p className="text-gray-300 max-w-xl mx-auto">Trade diverse financial instruments across global markets.</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {markets.map((m, i) => (
              <motion.div key={m.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -4 }} className="bg-[#12121a] border border-white/[0.08] rounded-2xl p-6 hover:border-indigo-500/30 transition-all cursor-pointer group">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <m.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-1 text-white">{m.name}</h3>
                <p className="text-sm text-gray-300 mb-4">{m.desc}</p>
                <Link to="/markets" className="inline-flex items-center gap-1 text-sm text-indigo-400 hover:text-indigo-300">Learn More <ChevronRight className="w-4 h-4" /></Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Why <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">Portfolio</span>?</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">Advanced portfolio products and services are ideal for immediate diversification.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-[#12121a] border border-white/[0.08] rounded-2xl p-7">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">{s.title}</h3>
                <p className="text-sm text-gray-300">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio */}
      <section className="py-20 bg-[#0c0c10]">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Portfolio <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">Styles</span></h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {portfolio.map((p, i) => (
              <motion.div key={p.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-[#12121a] border border-white/[0.08] rounded-2xl p-8">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 flex items-center justify-center">
                    <p.icon className="w-6 h-6 text-indigo-400" />
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-gray-300" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">{p.title}</h3>
                <p className="text-gray-300">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Crystal Clear Fees */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Crystal Clear <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">Fees</span></h2>
            <p className="text-gray-300 max-w-xl mx-auto">No hidden commissions. We guarantee transparency in every process.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {fees.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-[#12121a] border border-white/[0.08] rounded-2xl p-7 text-center">
                <h3 className="text-lg font-semibold mb-2 text-white">{f.title}</h3>
                <p className="text-sm text-gray-300">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials - Auto Sliding */}
      <section className="py-24 bg-[#0a0a0f] overflow-hidden">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">Trusted Around The <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">World</span></h2>
            <p className="text-gray-400 text-lg">What our traders say about us</p>
          </motion.div>
        </div>

        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-[#0a0a0f] to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-[#0a0a0f] to-transparent z-10" />
          
          <div className="overflow-hidden py-4">
            <motion.div 
              className="flex gap-6"
              animate={{ x: [0, -100 * (testimonials.length / 2)] }}
              transition={{ 
                x: { repeat: Infinity, repeatType: "loop", duration: 50, ease: "linear" }
              }}
            >
              {[...testimonials, ...testimonials].map((t, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="flex-shrink-0 w-80 sm:w-96 bg-gradient-to-br from-[#12121a] to-[#0c0c10] border border-white/10 rounded-3xl p-6 sm:p-7 shadow-2xl"
                >
                  <div className="flex items-center justify-between mb-5">
                    <Quote className="w-10 h-10 text-indigo-400/30" />
                    <div className="flex gap-1">
                      {[...Array(t.rating)].map((_, j) => <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                    </div>
                  </div>
                  <p className="text-gray-300 mb-6 text-base leading-relaxed">"{t.content}"</p>
                  <div className="flex items-center gap-4">
                    <img 
                      src={t.image} 
                      alt={t.name}
                      className="w-14 h-14 rounded-2xl object-cover shadow-lg"
                    />
                    <div>
                      <div className="font-bold text-white text-lg">{t.name}</div>
                      <div className="text-sm text-gray-500">{t.role}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/15 to-cyan-500/15" />
        <div className="absolute top-1/3 left-0 sm:left-1/4 w-48 sm:w-72 h-48 sm:h-72 bg-indigo-600/25 rounded-full blur-[60px] sm:blur-[100px]" />
        <div className="absolute bottom-1/3 right-0 sm:right-1/4 w-48 sm:w-72 h-48 sm:h-72 bg-cyan-500/25 rounded-full blur-[60px] sm:blur-[100px]" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-5xl font-bold mb-5 text-white">Ready to Start Trading?</h2>
            <p className="text-lg text-gray-300 mb-8">Join over 150,000 traders today.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/open-account" className="px-10 py-4 text-base font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-600 rounded-xl hover:from-indigo-500 hover:to-indigo-500 transition-all duration-300 shadow-lg shadow-indigo-500/25">Open Free Account</Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
