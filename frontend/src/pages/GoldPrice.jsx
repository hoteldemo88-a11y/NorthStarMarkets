import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { TrendingUp, TrendingDown, Shield, Clock, Globe, Star, ChevronRight } from 'lucide-react'

const goldPriceContent = `
## Understanding Gold Prices Today

Gold has been a cornerstone of global financial markets for centuries, serving as both a hedge against inflation and a safe-haven asset during times of economic uncertainty. At North Star Markets, we provide our traders with real-time gold prices, ensuring you have the latest market data at your fingertips.

### What Affects Gold Prices?

Several factors influence gold prices in the global market:

1. **Interest Rates**: When interest rates fall, gold becomes more attractive as it doesn't pay interest or dividends.
2. **Inflation**: Rising inflation often leads to increased gold demand as investors seek to preserve wealth.
3. **Currency Movements**: A weaker US dollar typically boosts gold prices.
4. **Geopolitical Events**: Political instability and conflicts drive investors toward safe-haven assets like gold.
5. **Central Bank Policies**: Central banks' gold buying and selling activities significantly impact prices.

### Why Trade Gold with North Star Markets?

At North Star Markets, we offer competitive spreads starting from 0.50 pips on gold trading. Our platform provides:

- **Lightning-Fast Execution**: Sub-50ms order execution
- **Leverage up to 1:200**: Maximize your trading potential
- **24/7 Trading**: Trade gold markets around the clock
- **Advanced Charting**: Professional-grade technical analysis tools

### Gold Trading Strategies

Whether you're a beginner or experienced trader, consider these strategies:

**Day Trading**: Capitalize on intraday price movements using technical analysis and real-time charts.

**Swing Trading**: Hold positions over several days to weeks, capturing medium-term trends.

**Position Trading**: Long-term strategy focusing on major gold trends driven by macroeconomic factors.

### Start Trading Gold Today

Visit North Star Markets to access live gold prices and start trading with confidence. Our expert team is ready to support your trading journey with competitive pricing and professional tools.
`

const sections = goldPriceContent.split('\n\n')

export default function GoldPrice() {
  return (
    <>
      <Helmet>
        <title>Gold Price Today | Live Gold Rates | North Star Markets</title>
        <meta name="description" content="Check today's gold price per ounce. Get live gold rates, market analysis, and trade gold with competitive spreads at North Star Markets." />
        <meta property="og:title" content="Gold Price Today | Live Gold Rates | North Star Markets" />
        <meta property="og:description" content="Check today's gold price per ounce. Get live gold rates, market analysis, and trade gold with competitive spreads." />
        <meta property="og:image" content="https://northstarmarketsint.com/northstartmarket.png" />
        <meta property="og:url" content="https://northstarmarketsint.com/gold-price-today" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://northstarmarketsint.com/gold-price-today" />
      </Helmet>

      <div className="min-h-screen bg-[#0a0a0f] pt-20">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
            <Link to="/" className="hover:text-white">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">Gold Price Today</span>
          </nav>

          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent mb-6">
            Gold Price Today
          </h1>

          <div className="bg-gradient-to-br from-[#12121a] to-[#0a0a12] border border-white/10 rounded-2xl p-6 mb-8">
            <img 
              src="/northstartmarket.png" 
              alt="Gold market chart showing current gold prices and trends"
              className="w-full h-64 object-cover rounded-xl mb-6"
            />
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2 text-emerald-400">
                <TrendingUp className="w-5 h-5" />
                <span className="text-2xl font-bold">$4,788.76</span>
              </div>
              <span className="text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full text-sm">
                +1.10%
              </span>
            </div>
            <p className="text-gray-400 text-sm">Live gold price per ounce (XAU/USD)</p>
          </div>

          <div className="prose prose-invert max-w-none">
            {sections.map((section, idx) => {
              if (section.startsWith('## ')) {
                return <h2 key={idx} className="text-2xl font-bold text-white mt-8 mb-4">{section.replace('## ', '')}</h2>
              }
              if (section.startsWith('### ')) {
                return <h3 key={idx} className="text-xl font-semibold text-white mt-6 mb-3">{section.replace('### ', '')}</h3>
              }
              if (section.startsWith('- ')) {
                const items = section.split('\n').filter(s => s.startsWith('- '))
                return (
                  <ul key={idx} className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                    {items.map((item, i) => <li key={i}>{item.replace('- ', '')}</li>)}
                  </ul>
                )
              }
              if (section.startsWith('**') && section.endsWith('**')) {
                return <p key={idx} className="text-amber-400 font-semibold mb-4">{section.replace(/\*\*/g, '')}</p>
              }
              return <p key={idx} className="text-gray-300 mb-4 leading-relaxed">{section}</p>
            })}
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {[
              { icon: Shield, title: 'Secure Trading', desc: 'Bank-grade encryption' },
              { icon: Clock, title: '24/7 Support', desc: 'Expert assistance always' },
              { icon: Globe, title: 'Global Access', desc: 'Trade from anywhere' },
            ].map((item, idx) => (
              <div key={idx} className="bg-gradient-to-br from-[#12121a] to-[#0a0a12] border border-white/10 rounded-xl p-6 text-center">
                <item.icon className="w-10 h-10 mx-auto mb-3 text-amber-400" />
                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-gradient-to-r from-indigo-600/20 to-cyan-500/20 border border-indigo-500/30 rounded-xl">
            <h3 className="text-xl font-bold text-white mb-3">Ready to Trade Gold?</h3>
            <p className="text-gray-300 mb-4">Open your account today and start trading gold with competitive spreads.</p>
            <Link 
              to="/open-account" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white rounded-lg font-semibold hover:from-indigo-500 hover:to-cyan-400 transition-all"
            >
              Open Account <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="mt-8 text-center">
            <Link to="/silver-price-today" className="text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-2">
              View Silver Prices <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}