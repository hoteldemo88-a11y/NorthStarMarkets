import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Target, TrendingUp, Users, Globe, Award, ArrowRight, Shield, Clock, CreditCard, HeadphonesIcon, Zap } from 'lucide-react'

const features = [
  { icon: Target, title: 'Our Mission', description: 'Our main goal is to provide a pleasant experience to our customers by delivering products through a smooth and easy trading process.' },
  { icon: Globe, title: 'Global Reach', description: 'With the use of technology and a specialized team, our customers will be able to grow and access new markets around the world.' },
  { icon: Shield, title: 'Trust & Security', description: 'We prioritize the security of your funds and data above all else.' },
  { icon: Clock, title: 'Innovation', description: 'Continuously pushing boundaries to provide the best trading experience.' },
  { icon: Users, title: 'Customer Focus', description: 'Every decision we make is focused on trader success.' },
]

const team = [
  { name: 'Ana Ericsson', role: 'Chief Compliance Officer', initial: 'AE' },
  { name: 'Magnus Björk', role: 'Marketing Director', initial: 'MB' },
  { name: 'Oskar Bergström', role: 'Legal Director', initial: 'OB' },
]

const whyChooseUs = [
  'Raw market spreads from 0.0 pips',
  'No-Commission Deposits',
  'Industry leading execution',
  'Hassle-free withdrawals in 24 hours',
  'Segregated client funds',
]

export default function About() {
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
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">About <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">Us</span></h1>
            <p className="text-xl text-gray-300">Take your trading to the next level with us!</p>
          </motion.div>
        </div>
      </section>

      {/* Why Trade With Us */}
      <section className="py-20 bg-[#0c0c10]">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Why Trade With <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">Us</span></h2>
            <p className="text-gray-300 max-w-2xl mx-auto">Experience the advantages of trading with a platform built for serious traders.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div key={feature.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-[#12121a] border border-white/[0.08] rounded-2xl p-8 hover:border-indigo-500/30 transition-colors">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center mb-5 shadow-lg shadow-indigo-500/20">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us List */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl md:text-4xl font-bold mb-5 text-white">Why Choose <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">North Star Markets</span></h2>
              <p className="text-gray-300 mb-7">Built for serious traders with the best features and security.</p>
              <div className="space-y-3">
                {whyChooseUs.map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <Award className="w-3 h-3 text-emerald-400" />
                    </div>
                    <span className="text-gray-200 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-[#12121a] border border-white/[0.08] rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#0a0a0f] rounded-xl p-5 text-center">
                  <TrendingUp className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
                  <div className="text-xl font-bold text-white">0.0</div>
                  <div className="text-xs text-gray-300">Pips Spread</div>
                </div>
                <div className="bg-[#0a0a0f] rounded-xl p-5 text-center">
                  <Shield className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <div className="text-xl font-bold text-white">100%</div>
                  <div className="text-xs text-gray-300">Secured</div>
                </div>
                <div className="bg-[#0a0a0f] rounded-xl p-5 text-center">
                  <Clock className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                  <div className="text-xl font-bold text-white">&lt;50ms</div>
                  <div className="text-xs text-gray-300">Execution</div>
                </div>
                <div className="bg-[#0a0a0f] rounded-xl p-5 text-center">
                  <Award className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                  <div className="text-xl font-bold text-white">50+</div>
                  <div className="text-xs text-gray-300">Awards</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-[#0c0c10]">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Meet Our <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">Leadership</span></h2>
            <p className="text-gray-300 max-w-2xl mx-auto">The experienced team behind North Star Markets.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <motion.div key={member.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-[#12121a] border border-white/[0.08] rounded-2xl p-8 text-center hover:border-indigo-500/30 transition-colors">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-indigo-500/20">
                  <span className="text-3xl font-bold text-white">{member.initial}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">{member.name}</h3>
                <p className="text-gray-300">{member.role}</p>
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
              <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-600 rounded-xl hover:from-indigo-500 hover:to-indigo-500 transition-all duration-300 shadow-lg shadow-indigo-500/25">Get Started <ArrowRight className="w-5 h-5" /></Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
