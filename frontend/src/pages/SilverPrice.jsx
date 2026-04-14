import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { TrendingUp, TrendingDown, Shield, Clock, Globe, ChevronRight } from 'lucide-react'

const silverPriceContent = `
## Silver Prices Today - Market Analysis

Silver, often called the "poor man's gold," offers excellent trading opportunities for investors seeking exposure to precious metals. At North Star Markets, we provide real-time silver prices to help you make informed trading decisions.

### Current Silver Market Overview

Today's silver market shows strong momentum with prices reflecting both industrial demand and investment interest. Silver's dual role as a precious metal and industrial commodity makes it uniquely positioned in the financial markets.

### Factors Influencing Silver Prices

1. **Industrial Demand**: Silver is widely used in electronics, solar panels, and automotive industries.
2. **Investment Flows**: ETF investments and physical demand from investors.
3. **Gold Ratio**: The gold-to-silver ratio often guides trading decisions.
4. **Currency Movements**: USD strength inversely affects silver prices.
5. **Mining Production**: Supply constraints from major silver-producing regions.

### Why Trade Silver with North Star Markets?

- **Competitive Spreads**: Starting from 0.02 pips on silver trading
- **Leverage Options**: Up to 1:200 for experienced traders
- **Real-Time Prices**: Live silver rates updated continuously
- **Advanced Platform**: Professional charting and analysis tools
- **Secure Environment**: Regulated trading with full fund protection

### Silver Trading Strategies

**Technical Analysis**: Use moving averages, RSI, and MACD to identify entry and exit points.

**Seasonal Patterns**: Silver often shows predictable seasonal trends based on industrial demand cycles.

**Correlation Trading**: Monitor gold-silver ratio for arbitrage opportunities.

**News-Based Trading**: Stay updated on industrial demand news and central bank policies.

### Benefits of Silver Investment

- Portfolio Diversification: Add stability to your investment mix
- Inflation Hedge: Protect against purchasing power erosion
- High Volatility: Greater trading opportunities compared to gold
- Accessibility: Lower entry point than gold per ounce

### Start Trading Silver Today

Join thousands of traders at North Star Markets who trust us for accurate silver pricing and professional trading execution. Our dedicated support team is available around the clock to assist you.
`

const sections = silverPriceContent.split('\n\n')

export default function SilverPrice() {
  return (
    <>
      <Helmet>
        <title>Silver Price Today | Live Silver Rates | North Star Markets</title>
        <meta name="description" content="Check today's silver price per ounce. Get live silver rates, market analysis, and trade silver with competitive spreads at North Star Markets." />
        <meta property="og:title" content="Silver Price Today | Live Silver Rates | North Star Markets" />
        <meta property="og:description" content="Check today's silver price per ounce. Get live silver rates, market analysis, and trade silver with competitive spreads." />
        <meta property="og:image" content="https://northstarmarketsint.com/northstartmarket.png" />
        <meta property="og:url" content="https://northstarmarketsint.com/silver-price-today" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://northstarmarketsint.com/silver-price-today" />
      </Helmet>

      <div className="min-h-screen bg-[#0a0a0f] pt-20">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
            <Link to="/" className="hover:text-white">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">Silver Price Today</span>
          </nav>

          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-300 via-slate-200 to-gray-400 bg-clip-text text-transparent mb-6">
            Silver Price Today
          </h1>

          <div className="bg-gradient-to-br from-[#12121a] to-[#0a0a12] border border-white/10 rounded-2xl p-6 mb-8">
            <img 
              src="/northstartmarket.png" 
              alt="Silver market chart showing current silver prices and trends"
              className="w-full h-64 object-cover rounded-xl mb-6"
            />
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2 text-emerald-400">
                <TrendingUp className="w-5 h-5" />
                <span className="text-2xl font-bold">$77.40</span>
              </div>
              <span className="text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full text-sm">
                +5.08%
              </span>
            </div>
            <p className="text-gray-400 text-sm">Live silver price per ounce (XAG/USD)</p>
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
                return <p key={idx} className="text-gray-300 font-semibold mb-4">{section.replace(/\*\*/g, '')}</p>
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
                <item.icon className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-gradient-to-r from-indigo-600/20 to-cyan-500/20 border border-indigo-500/30 rounded-xl">
            <h3 className="text-xl font-bold text-white mb-3">Ready to Trade Silver?</h3>
            <p className="text-gray-300 mb-4">Open your account today and start trading silver with competitive spreads.</p>
            <Link 
              to="/open-account" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white rounded-lg font-semibold hover:from-indigo-500 hover:to-cyan-400 transition-all"
            >
              Open Account <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="mt-8 text-center">
            <Link to="/forex-trading-guide" className="text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-2">
              Learn Forex Trading <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}