import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { TrendingUp, TrendingDown, Shield, Clock, Globe, ChevronRight, BarChart3 } from 'lucide-react'

const forexContent = `
## Complete Guide to Forex Trading

The foreign exchange (forex) market is the largest and most liquid financial market in the world, with daily trading volumes exceeding $6 trillion. This comprehensive guide will help you understand forex trading and how to get started.

### What is Forex Trading?

Forex trading involves buying one currency while simultaneously selling another. Currency pairs are quoted in terms of the base currency versus the quote currency. The goal is to profit from changes in exchange rates between two currencies.

### Major Currency Pairs

The forex market is dominated by major pairs that include the US dollar:

1. **EUR/USD** - Euro/US Dollar (most traded)
2. **GBP/USD** - British Pound/US Dollar
3. **USD/JPY** - US Dollar/Japanese Yen
4. **USD/CHF** - US Dollar/Swiss Franc

### Why Trade Forex?

**High Liquidity**: Enter and exit positions easily without significant price impact.

**24/5 Market**: Trade from Sunday evening to Friday afternoon.

**Leverage Options**: Control larger positions with smaller capital.

**Low Transaction Costs**: Competitive spreads and low commissions.

**Two-Way Trading**: Profit from both rising and falling markets.

### Essential Forex Trading Concepts

**Pips**: Smallest price movement in a currency pair (usually 0.0001).

**Lots**: Standard unit size - typically 100,000 units of base currency.

**Margin**: Collateral required to open leveraged positions.

**Spread**: Difference between bid and ask prices.

**Leverage**: Borrowed capital to increase position size.

### Forex Trading Strategies

**Trend Following**: Identify and trade in the direction of established trends.

**Range Trading**: Buy at support levels and sell at resistance.

**Breakout Trading**: Enter positions when price breaks key levels.

**News Trading**: Capitalize on market reactions to economic events.

**Scalping**: Quick trades capturing small price movements.

### Risk Management

Successful forex traders prioritize risk management:

- Never risk more than 2% of capital on single trade
- Use stop-loss orders to limit potential losses
- Maintain favorable risk-to-reward ratios (minimum 1:2)
- Keep a trading journal to review performance
- Never trade with money you cannot afford to lose

### Technical Analysis for Forex

Master these essential tools:

- **Moving Averages**: Identify trend direction
- **RSI**: Measure momentum and overbought/oversold conditions
- **MACD**: Spot trend changes and momentum
- **Support/Resistance**: Key price levels
- **Fibonacci**: Potential reversal zones

### Fundamental Analysis

Stay informed about:

- Central bank interest rate decisions
- Economic indicators (GDP, inflation, employment)
- Geopolitical events
- Trade balances and capital flows
- Monetary policy announcements

### Getting Started with North Star Markets

At North Star Markets, we provide:

- **Competitive Spreads**: Starting from 0.1 pips on major pairs
- **Fast Execution**: Sub-50ms order processing
- **Advanced Platform**: Professional trading tools and charts
- **Demo Account**: Practice trading risk-free
- **Expert Support**: 24/7 assistance from trading professionals

### Trading Psychology

Develop the right mindset:

- Stick to your trading plan
- Accept losses as part of trading
- Avoid emotional decision-making
- Be patient and wait for quality setups
- Continuous learning and adaptation

### Conclusion

Forex trading offers excellent opportunities for those willing to invest time in learning and developing their skills. Start with a demo account, master the basics, and gradually transition to live trading with proper risk management.
`

const sections = forexContent.split('\n\n')

export default function ForexGuide() {
  return (
    <>
      <Helmet>
        <title>Forex Trading Guide | Learn Forex Trading | North Star Markets</title>
        <meta name="description" content="Complete forex trading guide for beginners. Learn forex trading strategies, technical analysis, and how to trade currency pairs at North Star Markets." />
        <meta property="og:title" content="Forex Trading Guide | Learn Forex Trading | North Star Markets" />
        <meta property="og:description" content="Complete forex trading guide for beginners. Learn forex trading strategies, technical analysis, and how to trade currency pairs." />
        <meta property="og:image" content="https://northstarmarketsint.com/northstartmarket.png" />
        <meta property="og:url" content="https://northstarmarketsint.com/forex-trading-guide" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://northstarmarketsint.com/forex-trading-guide" />
      </Helmet>

      <div className="min-h-screen bg-[#0a0a0f] pt-20">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
            <Link to="/" className="hover:text-white">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">Forex Trading Guide</span>
          </nav>

          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent mb-6">
            Forex Trading Guide
          </h1>

          <div className="bg-gradient-to-br from-[#12121a] to-[#0a0a12] border border-white/10 rounded-2xl p-6 mb-8">
            <img 
              src="/northstartmarket.png" 
              alt="Forex trading chart showing currency pair analysis"
              className="w-full h-64 object-cover rounded-xl mb-6"
            />
            <div className="flex items-center gap-4 mb-4">
              <BarChart3 className="w-10 h-10 text-cyan-400" />
              <div>
                <p className="text-white font-semibold">Start Your Forex Journey</p>
                <p className="text-gray-400 text-sm">Learn to trade with confidence</p>
              </div>
            </div>
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
              if (section.match(/^\d+\.\s/)) {
                const items = section.split('\n').filter(s => s.match(/^\d+\.\s/))
                return (
                  <ol key={idx} className="list-decimal list-inside text-gray-300 space-y-2 mb-4">
                    {items.map((item, i) => <li key={i}>{item.replace(/^\d+\.\s/, '')}</li>)}
                  </ol>
                )
              }
              return <p key={idx} className="text-gray-300 mb-4 leading-relaxed">{section}</p>
            })}
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {[
              { icon: BarChart3, title: 'Expert Analysis', desc: 'Real-time market insights' },
              { icon: Shield, title: 'Secure Platform', desc: 'Protected trading environment' },
              { icon: Clock, title: '24/7 Trading', desc: 'Access markets anytime' },
            ].map((item, idx) => (
              <div key={idx} className="bg-gradient-to-br from-[#12121a] to-[#0a0a12] border border-white/10 rounded-xl p-6 text-center">
                <item.icon className="w-10 h-10 mx-auto mb-3 text-cyan-400" />
                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-gradient-to-r from-indigo-600/20 to-cyan-500/20 border border-indigo-500/30 rounded-xl">
            <h3 className="text-xl font-bold text-white mb-3">Start Forex Trading Today</h3>
            <p className="text-gray-300 mb-4">Open your account and access 50+ currency pairs with competitive spreads.</p>
            <Link 
              to="/open-account" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white rounded-lg font-semibold hover:from-indigo-500 hover:to-cyan-400 transition-all"
            >
              Open Account <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="mt-8 flex justify-center gap-6">
            <Link to="/gold-price-today" className="text-amber-400 hover:text-amber-300 inline-flex items-center gap-2">
              Gold Prices <ChevronRight className="w-4 h-4" />
            </Link>
            <Link to="/silver-price-today" className="text-gray-300 hover:text-white inline-flex items-center gap-2">
              Silver Prices <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}