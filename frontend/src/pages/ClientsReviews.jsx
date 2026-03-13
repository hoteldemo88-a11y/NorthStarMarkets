import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Star, Quote, ArrowRight, CheckCircle, TrendingUp, Shield, Sparkles } from 'lucide-react'

const reviews = [
  {
    name: 'Michael Thompson',
    role: 'Professional Trader',
    location: 'London, UK',
    pnl: '+184%',
    content: 'North Star Markets changed my execution quality overnight. Slippage is lower, fills are cleaner, and the dashboard is incredibly sharp.',
    rating: 5,
    image: 'https://i.pravatar.cc/200?img=12',
  },
  {
    name: 'Sarah Williams',
    role: 'Investment Manager',
    location: 'Toronto, CA',
    pnl: '+142%',
    content: 'The platform feels institutional but still intuitive. Risk tools, portfolio view, and support quality are top tier.',
    rating: 5,
    image: 'https://i.pravatar.cc/200?img=5',
  },
  {
    name: 'David Chen',
    role: 'Day Trader',
    location: 'Singapore',
    pnl: '+211%',
    content: 'Ultra-fast order routing with transparent fees. This is one of the few brokers where performance and trust align.',
    rating: 5,
    image: 'https://i.pravatar.cc/200?img=8',
  },
  {
    name: 'Emma Rodriguez',
    role: 'Portfolio Manager',
    location: 'Madrid, ES',
    pnl: '+126%',
    content: 'The analytics are clean and meaningful. I can track strategy behavior quickly without digging through clutter.',
    rating: 5,
    image: 'https://i.pravatar.cc/200?img=32',
  },
  {
    name: 'James Wilson',
    role: 'Forex Trader',
    location: 'Sydney, AU',
    pnl: '+169%',
    content: 'Spreads remain competitive even during volatile sessions. Withdrawals are also fast and smooth.',
    rating: 5,
    image: 'https://i.pravatar.cc/200?img=52',
  },
  {
    name: 'Lisa Anderson',
    role: 'Crypto Trader',
    location: 'Dubai, UAE',
    pnl: '+237%',
    content: 'Beautiful interface, serious liquidity, and responsive support. It feels premium from onboarding to execution.',
    rating: 5,
    image: 'https://i.pravatar.cc/200?img=47',
  },
]

const trustBadges = ['Verified Traders', 'Tier-1 Liquidity', 'Fast Withdrawals', 'Transparent Fees', 'Data Security']

const stats = [
  { label: 'Client Satisfaction', value: '98.9%' },
  { label: 'Average Rating', value: '4.9/5' },
  { label: 'Active Reviewers', value: '12,000+' },
]

export default function ClientsReviews() {
  return (
    <div className="bg-[#0a0a0f] w-full max-w-full overflow-x-hidden">
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[-15%] left-[-20%] sm:left-[5%] w-[420px] h-[420px] bg-indigo-600/20 rounded-full blur-[130px]" />
          <div className="absolute bottom-[-20%] right-[-20%] sm:right-[5%] w-[420px] h-[420px] bg-cyan-500/20 rounded-full blur-[130px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.1] mb-5">
              <Sparkles className="w-4 h-4 text-cyan-300" />
              <span className="text-sm text-gray-200">Trusted feedback from real traders</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
              Client <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">Reviews</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              Transparent, verified experiences from traders using North Star Markets across global sessions and strategies.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-8 bg-[#0c0c10] border-y border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {trustBadges.map((badge, i) => (
              <motion.div
                key={badge}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/[0.03] border border-white/[0.1]"
              >
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-gray-200">{badge}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {stats.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl bg-gradient-to-br from-[#12121a] to-[#0d0d12] border border-white/[0.08] p-5 text-center"
              >
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">{item.value}</div>
                <div className="text-sm text-gray-300">{item.label}</div>
              </motion.div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {reviews.map((review, i) => (
              <motion.div
                key={review.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ y: -6 }}
                className="relative rounded-3xl overflow-hidden border border-white/[0.1] bg-gradient-to-br from-[#12121a] via-[#111119] to-[#0c0c11] p-6 shadow-2xl shadow-black/20"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.18),transparent_45%)] pointer-events-none" />

                <div className="relative flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={review.image} alt={review.name} className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white/10" />
                    <div className="min-w-0">
                      <div className="font-semibold text-white truncate">{review.name}</div>
                      <div className="text-xs text-gray-300 truncate">{review.role}</div>
                      <div className="text-xs text-gray-400 truncate">{review.location}</div>
                    </div>
                  </div>
                  <Quote className="w-8 h-8 text-indigo-300/30 flex-shrink-0" />
                </div>

                <div className="relative flex items-center justify-between mb-4">
                  <div className="flex gap-1">
                    {[...Array(review.rating)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
                    <TrendingUp className="w-3.5 h-3.5" />
                    {review.pnl}
                  </div>
                </div>

                <p className="relative text-gray-200 text-sm leading-relaxed">"{review.content}"</p>

                <div className="relative mt-5 pt-4 border-t border-white/[0.08] flex items-center gap-2 text-xs text-gray-300">
                  <Shield className="w-3.5 h-3.5 text-cyan-300" />
                  Verified account holder
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#0c0c10] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-gradient-to-r from-indigo-600/15 to-cyan-500/15 rounded-full blur-[100px]" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-5 text-white">Ready to join these traders?</h2>
            <p className="text-lg text-gray-300 mb-8">Open your account and trade with confidence on North Star Markets.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-xl hover:from-indigo-500 hover:to-cyan-400 transition-all duration-300 shadow-lg shadow-indigo-500/25">Get Started <ArrowRight className="w-5 h-5" /></Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
