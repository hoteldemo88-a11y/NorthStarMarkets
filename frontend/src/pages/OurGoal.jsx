import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Target, Globe, TrendingUp, ArrowRight, Shield, Users, BarChart3, Zap, Award } from 'lucide-react'

const missionContent = `North Star Markets is focused on providing clear access to global financial markets and the economic developments that influence them. Our goal is to highlight key sectors of the global economy including currencies, commodities, metals and energy markets.

Financial markets move in response to macroeconomic data, central bank policy decisions, geopolitical developments and global supply and demand dynamics. By covering these markets and the forces that influence them, North Star Markets aims to provide traders with a structured overview of global market activity.

Through a focus on transparency, market awareness and global financial coverage, our mission is to help traders stay informed about the markets that drive the world economy.`

const stats = [
  { value: 200, suffix: '%', label: 'Platform Growth', prefix: '+' },
  { value: 26, suffix: 'K+', label: 'Global Users', prefix: '' },
  { value: 40, suffix: 'M+', prefix: '$', label: 'Market Activity in 2025', decimals: 0 },
]

function Counter({ value, suffix, prefix, label, delay, decimals = 0 }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) return
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
  }, [value, delay, isVisible])

  return (
    <div ref={ref} className="text-center">
      <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent mb-2">
        {prefix}{count.toFixed(decimals)}{suffix}
      </div>
      <div className="text-xs text-gray-300">{label}</div>
    </div>
  )
}

const highlights = [
  { icon: Globe, title: 'Global Market Coverage', description: 'Access to major currency pairs, commodities, metals, and energy markets worldwide.' },
  { icon: TrendingUp, title: 'Market Insights', description: 'Comprehensive analysis of economic developments and market-moving events.' },
  { icon: Target, title: 'Transparency', description: 'Clear and unbiased coverage of global financial markets and their movements.' },
]

const whyChooseUs = [
  { icon: Shield, title: 'Secure Trading', description: 'Industry-leading security measures to protect your assets and personal information.' },
  { icon: Zap, title: 'Fast Execution', description: 'Lightning-fast order execution with minimal slippage and competitive spreads.' },
  { icon: Users, title: 'Expert Support', description: '24/7 customer support from experienced professionals dedicated to your success.' },
  { icon: Award, title: 'Regulated Platform', description: 'Fully compliant with international financial regulations and standards.' },
]

const tradingFeatures = [
  { title: 'Advanced Charts', description: 'Professional-grade charting tools with technical indicators and drawing tools.' },
  { title: 'Multiple Assets', description: 'Trade currencies, commodities, metals, and energy all from a single platform.' },
  { title: 'Real-Time Data', description: 'Live market prices and news to keep you informed at all times.' },
  { title: 'Risk Management', description: 'Stop-loss, take-profit, and other tools to manage your risk effectively.' },
]

export default function OurGoal() {
  return (
    <div className="bg-[#0a0a0f] w-full max-w-full overflow-x-hidden">
      {/* Hero */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] bg-indigo-600/15 rounded-full blur-[120px]" />
          <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-cyan-500/15 rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">Our <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">Mission</span></h1>
            <p className="text-xl text-gray-300">Empowering traders with global market insights.</p>
          </motion.div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-20 bg-[#0c0c10]">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Our <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">Mission</span></h2>
              {missionContent.split('\n\n').map((paragraph, i) => (
                <p key={i} className="text-gray-300 text-lg leading-relaxed mb-4">{paragraph}</p>
              ))}
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-[#12121a] border border-white/[0.08] rounded-2xl p-8">
              <div className="grid grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                  <Counter key={i} {...stat} delay={i * 200} />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">What We <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">Offer</span></h2>
            <p className="text-gray-300 max-w-2xl mx-auto">Comprehensive coverage of global financial markets.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {highlights.map((item, i) => (
              <motion.div 
                key={item.title} 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: i * 0.1 }}
                className="bg-[#12121a] border border-white/[0.08] rounded-2xl p-6 hover:border-indigo-500/30 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">{item.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-[#0c0c10]">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Why Choose <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">North Star Markets</span></h2>
            <p className="text-gray-300 max-w-2xl mx-auto">Experience the advantages of trading with a leading global platform.</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseUs.map((item, i) => (
              <motion.div 
                key={item.title} 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: i * 0.1 }}
                className="bg-[#12121a] border border-white/[0.08] rounded-2xl p-6 hover:border-indigo-500/30 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">{item.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trading Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Trading <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">Features</span></h2>
            <p className="text-gray-300 max-w-2xl mx-auto">Powerful tools designed for serious traders.</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tradingFeatures.map((feature, i) => (
              <motion.div 
                key={feature.title} 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: i * 0.1 }}
                className="bg-[#12121a] border border-white/[0.08] rounded-2xl p-6 hover:border-indigo-500/30 transition-colors"
              >
                <BarChart3 className="w-8 h-8 text-cyan-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-white">{feature.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Reach */}
      <section className="py-20 bg-[#0c0c10]">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Global <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">Reach</span></h2>
            <p className="text-gray-300 max-w-2xl mx-auto">Serving traders across the globe.</p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { value: '180+', label: 'Countries' },
              { value: '160+', label: 'Trading Instruments' },
              { value: '24/7', label: 'Customer Support' },
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: i * 0.1 }}
                className="bg-[#12121a] border border-white/[0.08] rounded-2xl p-8 text-center"
              >
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent mb-2">{item.value}</div>
                <div className="text-gray-300">{item.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0"><div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-indigo-600/15 to-cyan-500/15 rounded-full blur-[100px]" /></div>
        <div className="relative z-10 max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-5 text-white">Ready to Start Trading?</h2>
            <p className="text-lg text-gray-300 mb-8">Join thousands of traders who trust North Star Markets.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/open-account" className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-xl hover:from-indigo-500 hover:to-cyan-400 transition-all duration-300 shadow-lg shadow-indigo-500/25">Open Account <ArrowRight className="w-5 h-5" /></Link>
              <Link to="/markets" className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-white bg-white/[0.05] border border-white/10 rounded-xl hover:bg-white/[0.1] transition-all">Explore Markets</Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
