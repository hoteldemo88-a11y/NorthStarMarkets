import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Globe, Wheat, Gem, Zap, ArrowLeft, TrendingUp } from 'lucide-react'

const marketData = {
  currencies: {
    title: 'Currencies (Forex)',
    subtitle: 'Global Currency Markets',
    icon: Globe,
    color: 'from-blue-500 to-cyan-400',
    intro: `The foreign exchange market (Forex) is the largest and most liquid financial market in the world, with over $7 trillion traded daily. Currency trading allows investors to speculate on the relative strength of one currency against another, driven by global economic conditions, central bank policies, interest rates, and geopolitical developments.`,
    description: `At North Star Markets we provide access to major global currency pairs including:`,
    items: ['EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF'],
    outro: `Forex markets operate 24 hours a day during the trading week, offering continuous opportunities for traders to react to economic news, market sentiment, and global events.`
  },
  agricultural: {
    title: 'Agricultural Commodities',
    subtitle: 'Global Agricultural Markets',
    icon: Wheat,
    color: 'from-green-500 to-emerald-400',
    intro: `Agricultural commodities represent some of the most essential resources in the global economy. Prices are influenced by factors such as weather patterns, global demand, crop yields, transportation costs, and government policies.`,
    description: `Through North Star Markets, traders can gain exposure to key agricultural products including:`,
    items: ['Cocoa', 'Cotton', 'Coffee', 'Sugar', 'Orange'],
    outro: `These markets are widely used by institutional investors, commodity producers, and traders seeking diversification or hedging against inflation and supply disruptions.`
  },
  metals: {
    title: 'Metals',
    subtitle: 'Precious and Industrial Metals',
    icon: Gem,
    color: 'from-amber-500 to-yellow-400',
    intro: `Metals play a critical role in global financial markets, serving both as industrial resources and stores of value. Precious metals such as gold and silver are widely used as safe-haven assets during periods of economic uncertainty, while industrial metals like copper are closely linked to global economic growth and infrastructure demand.`,
    description: `North Star Markets offers access to key metals including:`,
    items: ['Gold', 'Silver', 'Copper'],
    outro: `These markets are heavily influenced by central bank activity, inflation expectations, currency movements, and global industrial demand.`
  },
  energy: {
    title: 'Energy',
    subtitle: 'Global Energy Markets',
    icon: Zap,
    color: 'from-orange-500 to-red-400',
    intro: `Energy commodities power the global economy and are among the most actively traded markets worldwide. Prices are influenced by geopolitical tensions, supply and demand dynamics, production levels, and economic growth.`,
    description: `At North Star Markets, traders can access key energy markets including:`,
    items: ['Brent Crude Oil', 'WTI Crude Oil', 'Natural Gas'],
    outro: `Energy markets provide significant trading opportunities due to their volatility and sensitivity to global economic and political developments.`
  }
}

export default function MarketDetail() {
  const { id } = useParams()
  const market = marketData[id]
  const Icon = market?.icon

  if (!market) {
    return (
      <div className="bg-[#0a0a0f] min-h-screen pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl text-white mb-4">Market not found</h1>
          <Link to="/markets" className="text-cyan-400 hover:underline">Back to Markets</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#0a0a0f] w-full max-w-full overflow-x-hidden">
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[150px]" />
          <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[150px]" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 text-center">
          <Link to="/markets" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Markets
          </Link>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${market.color} flex items-center justify-center mx-auto mb-6 shadow-lg`}>
              <Icon className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">{market.title}</h1>
            <p className="text-xl text-cyan-400 font-medium">{market.subtitle}</p>
          </motion.div>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.2 }}
            className="bg-[#12121a] border border-white/[0.08] rounded-2xl p-8 md:p-10"
          >
            <div className="flex items-start gap-4 mb-8">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${market.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-300 leading-relaxed text-base md:text-lg mb-6">{market.intro}</p>
                <p className="text-gray-300 leading-relaxed text-base md:text-lg mb-4">{market.description}</p>
                <ul className="space-y-3 mb-6">
                  {market.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${market.color}`} />
                      <span className="text-white font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-gray-300 leading-relaxed text-base md:text-lg">{market.outro}</p>
              </div>
            </div>
          </motion.div>

          <div className="mt-8 text-center">
            <Link to="/open-account" className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-xl hover:from-indigo-500 hover:to-cyan-400 transition-all shadow-lg shadow-indigo-500/25">
              Start Trading Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
