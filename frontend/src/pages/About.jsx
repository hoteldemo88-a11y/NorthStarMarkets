import { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, Cookie, AlertTriangle, FileText } from 'lucide-react'

const policies = {
  privacy: {
    title: 'Privacy Policy',
    icon: Shield,
    content: `North Star Markets is committed to protecting the privacy of visitors to this website. This Privacy Policy explains how information may be collected, used, and protected when users access or interact with the website.

Information Collected

The website may collect limited information such as email addresses submitted through contact forms, basic technical data such as IP address, browser type, and usage statistics collected through analytics tools.

Use of Information

Information collected may be used to respond to inquiries, improve website functionality, analyze website traffic, and maintain security of the website.

Data Protection

Reasonable steps are taken to protect information from unauthorized access or disclosure. However, no internet transmission can be guaranteed to be completely secure.

Third-Party Services

The website may use third-party services such as analytics providers or hosting platforms. These services may collect limited technical data in accordance with their own privacy policies.

Changes to this Policy

North Star Markets reserves the right to update this Privacy Policy at any time. Users are encouraged to review the policy periodically for updates.`
  },
  cookie: {
    title: 'Cookie Policy',
    icon: Cookie,
    content: `This website may use cookies to improve user experience and analyze website traffic. Cookies are small text files stored on a user's device when visiting a website.

How Cookies Are Used

Cookies may be used to remember user preferences, analyze website performance, and understand how visitors interact with website content.

Analytics Cookies

Analytics tools may use cookies to collect anonymous statistical data such as pages visited, time spent on the site, and general geographic location of visitors.

Managing Cookies

Users can control or disable cookies through their browser settings. Disabling cookies may affect certain functionality of the website.

Policy Updates

This Cookie Policy may be updated periodically to reflect changes in website functionality or legal requirements.`
  },
  risk: {
    title: 'Risk Disclosure Statement',
    icon: AlertTriangle,
    content: `This Risk Disclosure Statement is provided for informational purposes for visitors accessing market information, analysis, commentary, or educational materials on this website. Financial markets involve substantial risk and may not be suitable for all individuals. Anyone considering participation in financial markets should carefully evaluate their financial situation, experience, and tolerance for risk before making any decisions.

1. General Market Risk

Financial markets can be highly unpredictable. Prices of commodities, currencies, equities, digital assets, and other financial instruments may fluctuate rapidly due to economic developments, geopolitical events, interest-rate changes, government policy decisions, or unexpected global circumstances.

2. Risk of Loss

Participation in financial markets carries the possibility of partial or total loss of capital. Market movements may occur quickly and without warning. Individuals should never commit funds that they cannot afford to lose.

3. Liquidity Risk

Certain markets or instruments may experience reduced liquidity. During periods of low liquidity, it may be difficult to buy or sell positions at expected prices. This may increase the potential for losses or delays in execution.

4. Volatility

Financial markets can experience sudden and substantial price changes within short periods of time. High volatility may increase both potential gains and potential losses.

5. Information and Data Accuracy

Market data, analysis, commentary, or pricing information presented on this website may be delayed, incomplete, or inaccurate. All information is provided for informational purposes only and should not be relied upon as the sole basis for financial decisions.

6. Past Performance

Past performance of any market, instrument, or strategy does not guarantee future results. Historical price movements should not be interpreted as an indication of future performance.

7. Independent Advice

Nothing contained on this website should be interpreted as financial, investment, legal, or tax advice. Visitors should consider obtaining independent professional advice before making any financial decision.

8. Technology and System Risk

Online platforms and digital infrastructure may occasionally experience interruptions, technical issues, or connectivity failures. Such disruptions may affect access to information or the ability to monitor market activity.

By accessing this website, users acknowledge that they understand the risks associated with financial markets. This disclosure is provided as general informational guidance only and does not constitute an offer to buy or sell any financial instrument.`
  },
  terms: {
    title: 'Terms and Conditions',
    icon: FileText,
    content: `1. Introduction

These Terms and Conditions govern the use of the North Star Markets website. By accessing or using this website, visitors agree to comply with these terms. If you do not agree with these terms, you should discontinue use of the website.

2. Website Use

The information provided on this website is for general informational purposes only. Users agree not to misuse the website, attempt unauthorized access, disrupt systems, or use the platform for unlawful purposes.

3. Market Information

Any market data, analysis, or commentary provided on this website is intended for informational purposes only. While reasonable efforts are made to ensure accuracy, North Star Markets does not guarantee the completeness or reliability of such information.

4. No Guarantee of Results

Financial markets involve risk and past performance is not indicative of future results. North Star Markets does not guarantee profits or the success of any strategy.

5. Intellectual Property

All content, design, text, graphics, logos, and materials displayed on this website are the property of North Star Markets unless otherwise stated. Unauthorized reproduction or distribution is prohibited.

6. Limitation of Liability

North Star Markets shall not be liable for any direct, indirect, or consequential losses arising from the use of this website or reliance on any information provided. Users access the website at their own risk.

7. External Links

This website may contain links to third-party websites. North Star Markets does not control or endorse the content of those websites and accepts no responsibility for their content or services.

8. Changes to Terms

North Star Markets reserves the right to update or modify these Terms and Conditions at any time without prior notice. Continued use of the website after changes are posted constitutes acceptance of the revised terms.

9. Governing Law

These Terms and Conditions shall be governed by and interpreted in accordance with applicable laws and regulations. Any disputes arising from the use of this website shall be resolved under the relevant jurisdiction.

If you have any questions regarding these Terms and Conditions, please contact North Star Markets through the contact details provided on the website.`
  }
}

export default function About() {
  const [activeTab, setActiveTab] = useState('privacy')

  const tabs = [
    { id: 'privacy', label: 'Privacy Policy' },
    { id: 'cookie', label: 'Cookie Policy' },
    { id: 'risk', label: 'Risk Disclosure' },
    { id: 'terms', label: 'Terms & Conditions' }
  ]

  const activePolicy = policies[activeTab]
  const Icon = activePolicy.icon

  return (
    <div className="bg-[#0a0a0f] w-full max-w-full overflow-x-hidden">
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] bg-indigo-600/15 rounded-full blur-[120px]" />
          <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-cyan-500/15 rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">Legal <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">Policies</span></h1>
            <p className="text-xl text-gray-300">Important information about our practices and terms</p>
          </motion.div>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white'
                    : 'bg-[#12121a] border border-white/[0.08] text-gray-300 hover:text-white hover:border-indigo-500/30'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#12121a] border border-white/[0.08] rounded-2xl p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center">
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">{activePolicy.title}</h2>
            </div>
            <div className="prose prose-invert max-w-none">
              {activePolicy.content.split('\n\n').map((paragraph, idx) => {
                if (paragraph.match(/^\d+\.\s/)) {
                  const [title, ...rest] = paragraph.split('\n')
                  return (
                    <div key={idx} className="mt-6">
                      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
                      {rest.map((line, i) => (
                        <p key={i} className="text-gray-300 leading-relaxed mb-2">{line}</p>
                      ))}
                    </div>
                  )
                }
                if (paragraph.includes(':')) {
                  const [title, ...rest] = paragraph.split(':')
                  return (
                    <div key={idx} className="mt-4">
                      <h3 className="text-lg font-semibold text-white mb-1">{title}:</h3>
                      {rest.length > 0 && <p className="text-gray-300 leading-relaxed">{rest.join(':')}</p>}
                    </div>
                  )
                }
                return <p key={idx} className="text-gray-300 leading-relaxed mb-4">{paragraph}</p>
              })}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
