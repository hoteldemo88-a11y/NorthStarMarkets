import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Search, Shield, FileText, Wallet, CheckCircle, TrendingUp, AlertTriangle, BarChart3, Lightbulb, Globe, Building2, Clock, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const faqCategories = [
  {
    title: 'About North Star Markets',
    icon: Building2,
    faqs: [
      { question: 'What is North Star Markets?', answer: 'North Star Markets provides lightning speed access to the financial markets (Currencies, Agricultural Commodities, Metals, Energy and Stocks/Shares) through regulated Tier-1 liquidity providers, for a seamless trading experience!' },
      { question: 'Is North Star Markets Legit?', answer: 'Yes. North Star Markets is a legit registered company. Kindly see objective reviews from real clients on "Client Reviews" page. We have been in the market for over 15 years, doing mostly private portfolio and wealth management. We opened up to the public in 2020 with our brokerage services, starting with a registered company in Europe. We are in the process of expanding into other major financial regulatory jurisdictions. North Star Markets is a Foreign Money Service Business (FMSB) in Regulatory Compliance with the Financial Transactions and Reports Analysis Centre of Canada (FINTRAC) for Foreign Exchange Dealing and Dealing in Currencies.' },
    ],
  },
  {
    title: 'Registration',
    icon: FileText,
    faqs: [
      { question: 'What documents are required for registration?', answer: 'Applicants are required to provide a copy of a valid means of identification like an international passport and a utility bill or any other document as proof of address. The proof of address document must not be older than 3 months old and must clearly show the name and address of the applicant.' },
    ],
  },
  {
    title: 'Making a Withdrawal',
    icon: Wallet,
    faqs: [
      { question: 'How do I withdraw funds?', answer: 'Submit the online Withdrawal form found in the Secure Client Area of the broker web. Withdrawals are processed within 24 hours (1 business day or less).' },
    ],
  },
  {
    title: 'Risk Management',
    icon: Shield,
    faqs: [
      { question: 'How does risk management work?', answer: 'Typically, the risk management process involves five steps: setting objectives, identifying risks, risk assessment, defining responses, and monitoring. Depending on the context, however, these steps may change significantly.' },
      { question: 'Setting objectives', answer: 'The first step is to define what are the main goals. It is often related to the risk tolerance of the company or individual. In other words, how much risk they are willing to take to move toward their goals.' },
      { question: 'Identifying risks', answer: 'The second step involves detecting and defining the potential risks. It aims to reveal all sorts of events that may cause negative effects. In the business environment, this step may also provide insightful information that isn\'t directly related to financial risks.' },
      { question: 'Risk assessment', answer: 'After identifying the risks, the next step is to evaluate their expected frequency and severity. The risks are then ranked in order of importance, which facilitates the creation or adoption of an appropriate response.' },
      { question: 'Defining responses', answer: 'The fourth step consists of defining responses for each type of risk according to their level of importance. It establishes the action to be taken in case an unfortunate event occurs.' },
      { question: 'Monitoring', answer: 'The final step of a risk management strategy is to monitor its efficiency in response to events. This often requires a continuous collection and analysis of data.' },
    ],
  },
  {
    title: 'Managing Financial Risks',
    icon: TrendingUp,
    faqs: [
      { question: 'Why do strategies fail?', answer: 'There are several reasons why a strategy or a trade setup may be unsuccessful. For example, a trader can lose money because the market moves against their futures contract position or because they get emotional and end up selling out of panic. Emotional reactions often cause traders to ignore or give up their initial strategy. This is particularly noticeable during bear markets and periods of capitulation.' },
      { question: 'How important is risk management in trading?', answer: 'In financial markets, most people agree that having a proper risk management strategy contributes drastically to their success. In practice, this could be as simple as setting Stop-Loss or Take-Profit orders. A robust trading strategy should provide a clear set of possible actions, meaning that traders can be more prepared to deal with all sorts of situations.' },
      { question: 'What is Market Risk?', answer: 'Market risk can be minimized by setting Stop-Loss orders on each trade so that positions are automatically closed before incurring bigger losses.' },
      { question: 'What is Liquidity Risk?', answer: 'Liquidity risk can be mitigated by trading on high-volume markets. Usually, assets with a high market capitalization value tend to be more liquid.' },
      { question: 'What is Systemic Risk?', answer: 'Systemic risk can also be reduced by portfolio diversification. But in this case, the diversification should involve projects with distinct proposals or companies from different industries.' },
    ],
  },
]

export default function Faq() {
  const [searchQuery, setSearchQuery] = useState('')
  const [openFaq, setOpenFaq] = useState(null)

  const filteredFaqs = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq => faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || faq.answer.toLowerCase().includes(searchQuery.toLowerCase()))
  })).filter(category => category.faqs.length > 0)

  return (
    <div className="bg-[#0a0a0f] w-full max-w-full overflow-x-hidden">
      {/* Hero */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] bg-indigo-600/15 rounded-full blur-[120px]" />
          <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-cyan-500/15 rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">Frequently Asked <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">Questions</span></h1>
            <p className="text-xl text-gray-300 mb-8">Find answers to common questions about North Star Markets.</p>
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
              <input 
                type="text" 
                placeholder="Search questions..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                className="w-full pl-12 pr-4 py-3.5 bg-[#12121a] border border-white/[0.1] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors" 
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          {filteredFaqs.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} className="text-center py-16">
              <p className="text-gray-300 text-lg">No results found. Contact support for assistance.</p>
            </motion.div>
          ) : (
            <div className="space-y-8">
              {filteredFaqs.map((category, categoryIndex) => (
                <motion.div key={category.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center">
                      <category.icon className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-white">{category.title}</h2>
                  </div>
                  <div className="space-y-3">
                    {category.faqs.map((faq, faqIndex) => (
                      <motion.div 
                        key={faq.question} 
                        initial={{ opacity: 0, y: 10 }} 
                        whileInView={{ opacity: 1, y: 0 }} 
                        viewport={{ once: true }}
                        className="bg-[#12121a] border border-white/[0.08] rounded-xl overflow-hidden"
                      >
                        <button 
                          onClick={() => setOpenFaq(openFaq === `${categoryIndex}-${faqIndex}` ? null : `${categoryIndex}-${faqIndex}`)} 
                          className="w-full flex items-center justify-between p-5 hover:bg-white/[0.02] transition-colors"
                        >
                          <span className="text-sm font-medium pr-4 text-left text-gray-100">{faq.question}</span>
                          <ChevronDown className={`w-4 h-4 text-gray-300 transition-transform duration-200 flex-shrink-0 ${openFaq === `${categoryIndex}-${faqIndex}` ? 'rotate-180 text-indigo-400' : ''}`} />
                        </button>
                        <AnimatePresence>
                          {openFaq === `${categoryIndex}-${faqIndex}` && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }} 
                              animate={{ height: 'auto', opacity: 1 }} 
                              exit={{ height: 0, opacity: 0 }} 
                              className="overflow-hidden"
                            >
                              <div className="px-5 pb-5 text-sm text-gray-300 leading-relaxed">{faq.answer}</div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#0c0c10]">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            className="text-center"
          >
            <div className="bg-[#12121a] border border-white/[0.08] rounded-2xl p-10">
              <h2 className="text-2xl font-bold mb-4 text-white">Still have questions?</h2>
              <p className="text-gray-300 mb-8">Our support team is here to help you.</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-600 rounded-xl hover:from-indigo-500 hover:to-indigo-500 transition-all duration-300 shadow-lg shadow-indigo-500/25">Contact Support <ArrowRight className="w-5 h-5" /></Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
