import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Globe, Wheat, Gem, Zap, ArrowRight, TrendingUp, ChevronRight, History, Layers, Settings, BarChart3 } from 'lucide-react'

const marketCategories = [
  { 
    id: 'currencies', 
    icon: Globe, 
    name: 'Currencies', 
    pairs: 'EUR/USD, GBP/USD, USD/JPY, USD/CHF', 
    description: 'CLICK FOR MORE.',
    color: 'from-blue-500 to-cyan-400',
    bgColor: 'from-blue-500/10 to-cyan-500/10'
  },
  { 
    id: 'agricultural', 
    icon: Wheat, 
    name: 'Agricultural Commodities', 
    pairs: 'Cocoa, Cotton, Coffee, Sugar', 
    description: 'CLICK FOR MORE.',
    color: 'from-green-500 to-emerald-400',
    bgColor: 'from-green-500/10 to-emerald-500/10'
  },
  { 
    id: 'metals', 
    icon: Gem, 
    name: 'Metals', 
    pairs: 'Gold, Silver, Copper', 
    description: 'CLICK FOR MORE.',
    color: 'from-amber-500 to-yellow-400',
    bgColor: 'from-amber-500/10 to-yellow-500/10'
  },
  { 
    id: 'energy', 
    icon: Zap, 
    name: 'Energy', 
    pairs: 'Brent Crude, WTI, Natural Gas', 
    description: 'CLICK FOR MORE.',
    color: 'from-orange-500 to-red-400',
    bgColor: 'from-orange-500/10 to-red-500/10'
  },
]

const commoditySections = [
  {
    icon: TrendingUp,
    title: 'What is a Commodity?',
    content: `A commodity is an item which is traded for the purpose of final consumption or usage in the production process of another final product. They can be freely occurring in nature, as a resource item to be mined or as a farm produce to be grown and harvested. Prices of commodities usually play an important role in the pricing of other financial market products. This is because of the role they play as intermediate raw materials in production processes. Therefore, a change in their prices could in fact have an impact on the correlated financial markets and the wider economy of these countries. In fact, some currencies are now referred to as commodity currencies, as their prices are strongly correlated with the commodity that the country depends on heavily. For Instance, the South African Rand, Canadian Dollar, or the Norwegian Krone.`
  },
  {
    icon: History,
    title: 'The History of Commodity Trading on Exchanges',
    content: `The oldest commodity exchange was established in 1848. Known as the Chicago board of trade (CBOT). It dealt mostly on futures and options on commodities like cocoa, sugar, rice, maize, ethanol, and other metals like gold and silver. It was merged with the Chicago Mercantile exchange in 2007, and is now called the CME Group. The CME was established in 1898, as a foremost physical agricultural commodities exchange, for butter and Egg. Following the merger, the CME group was considered the largest 'Paper' (futures and options) exchange for a lot of commodity futures and financial derivatives on currencies. On the other hand, the New York Board of Trade (NYBOT) was created in 1870 and initially known as the Cotton Exchange. It was later merged with the Coffee, Sugar and Cocoa Exchange. As of now, it mostly deals with physical and paper contracts for the above agricultural commodities and orange juice. The New York Mercantile Exchange (NYMEX) was formed in 1872 with a focus on mostly dairy and farm animal products. It merged with the CME group after the global financial crises and the great recession of 2008/2009 to form the biggest paper and physical commodity exchange in the world. Other notable exchanges include the Tokyo Commodity Exchange (TOCOM) founded in 1951, the London International Financial Futures and Options Exchange, founded in 1982 and most recently, the Intercontinental Exchange (ICE) founded in 2000.`
  },
  {
    icon: Layers,
    title: 'Types of Commodities',
    content: `Commodities are broadly categorized into two; soft and hard commodities. Soft commodities refer in general to agricultural farm produce like cocoa, corn, coffee, wheat, livestock, cattle, orange juice, to name a few, mostly considered a renewable resource. On the other hand, hard commodities are generally considered to be non-renewable natural resources extracted or mined from the earth, like crude oil, iron ore, copper, gold, silver and other precious metals.`
  },
  {
    icon: Settings,
    title: 'Sub-Categories of Commodities',
    content: `Commodities can be further sub categorised as follows: Metals: Base/ Non-precious metals like Aluminium, Cobalt, Nickel and Copper. Precious metals like silver, gold, and platinum. Energy: Crude Oil and Refined Petroleum Products (Gasoil, Gasoline, Natural Gas, Heating Oil). Agricultural Commodities: Cattle, Livestock, cocoa, coffee, sugar, orange juice.`
  },
  {
    icon: BarChart3,
    title: 'How Do You Trade Commodities?',
    content: `There are a number of ways to trade commodities. Institutional Investors would usually trade paper commodities on a futures exchange, via future contracts which represents a contractual obligation to sell or buy a fixed volume of a commodity at an agreed price and delivery at a date in the future.`
  },
]

export default function Markets() {
  return (
    <div className="bg-[#0a0a0f] w-full max-w-full overflow-x-hidden">
      {/* Hero */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[150px]" />
          <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[150px]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">North Star Markets <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">Markets</span></h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-4">Join traders across the globe who are growing their portfolio through North Star Markets</p>
            <p className="text-lg text-gray-300">Gain access to more than 160 tradable instruments: Currencies, Agricultural Commodities, Metals, Energy, Stocks/Shares and Options</p>
          </motion.div>
        </div>
      </section>

      {/* Markets Grid */}
      <section className="py-16 bg-[#0c0c10]">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {marketCategories.map((market, i) => (
              <motion.div 
                key={market.id} 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-[#12121a] border border-white/[0.08] rounded-2xl p-6 hover:border-indigo-500/30 transition-all cursor-pointer group"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${market.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <market.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">{market.name}</h3>
                <p className="text-sm text-cyan-400 font-medium mb-1">{market.pairs}</p>
                <p className="text-xs text-gray-300">{market.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Commodity Sections */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 space-y-12">
          {commoditySections.map((section, i) => (
            <motion.div 
              key={section.title} 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }}
              className="bg-[#12121a] border border-white/[0.08] rounded-2xl p-8 md:p-10"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/20">
                  <section.icon className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">{section.title}</h2>
              </div>
              <p className="text-gray-300 leading-relaxed text-base md:text-lg">{section.content}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-indigo-600/15 to-cyan-500/15 rounded-full blur-[100px]" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contact" className="inline-flex items-center gap-2 px-8 sm:px-10 py-4 text-base font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-600 rounded-xl hover:from-indigo-500 hover:to-indigo-500 transition-all duration-300 shadow-lg shadow-indigo-500/25">Get Started <ArrowRight className="w-5 h-5" /></Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
