import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Target, TrendingUp, Users, Globe, Award, ArrowRight, Shield, Heart, Lightbulb, Sparkles, Building2, BarChart3 } from 'lucide-react'

const stats = [
  { value: '+200%', label: 'Conversion rate increased' },
  { value: '+26K', label: 'Happy customers' },
  { value: '+40M', label: 'Amount of investments in 2023' },
]

const cultureHighlights = [
  { value: '15K+', label: 'Customers' },
  { value: '2023', label: 'Acquired' },
]

const coreValues = [
  { icon: TrendingUp, title: 'Continuous Improvement', description: 'Driving excellence through small, incremental changes, fostering continuous growth.' },
  { icon: Target, title: 'Results-Driven Mindset', description: 'Setting clear goals and tracking progress, we approach our work with a determined focus on achieving impactful results.' },
  { icon: Shield, title: 'Ownership and Accountability', description: 'Ownership and accountability are our values. Each member takes pride in their work, contributing to our collective success.' },
  { icon: Users, title: 'Diversity and Inclusion', description: 'Diversity is our strength. We cultivate an inclusive culture, valuing and empowering individuals from diverse backgrounds.' },
  { icon: Sparkles, title: 'Fun and Celebration', description: 'While serious about our work, we know how to have fun. Celebrating milestones and achievements is woven into our positive and enjoyable workplace culture.' },
]

const diversityPoints = [
  { title: 'Equal Opportunities', description: 'We ensure equal opportunities for all to thrive. Merit and talent are the driving forces in our commitment to a level playing field for career advancement.' },
  { title: 'Diverse Leadership', description: 'Our leadership embodies diversity for innovative decision-making. Representing varied backgrounds and experiences, they steer us towards excellence.' },
  { title: 'Open Communication', description: 'Fostering open and honest communication, we value every voice. Actively seeking diverse perspectives enriches our discussions, decision-making, and problem-solving approaches.' },
  { title: 'Celebrating Differences', description: 'Differences aren\'t just tolerated – they\'re celebrated. Recognising and appreciating each individual\'s uniqueness, we cultivate an environment where diversity is a source of strength.' },
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
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">Our <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">Goal</span></h1>
            <p className="text-xl text-gray-300">Building the future of trading.</p>
          </motion.div>
        </div>
      </section>

      {/* Our Goal */}
      <section className="py-20 bg-[#0c0c10]">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Our <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">Goal</span></h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-4">Our main goal is to provide a pleasant experience to our customers by delivering products through a smooth and easy trading process.</p>
              <p className="text-gray-300 text-lg leading-relaxed">With the use of technology and a specialized team, our customers will be able to grow and access new markets around the world.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-[#12121a] border border-white/[0.08] rounded-2xl p-8">
              <div className="grid grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent mb-2">{stat.value}</div>
                    <div className="text-xs text-gray-300">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Culture */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Our <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">Culture</span></h2>
            <p className="text-gray-300 max-w-2xl mx-auto">Our company culture is the heartbeat of our organisation. Rooted in the principles of continuous improvement, teamwork, and excellence.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex flex-wrap justify-center gap-8 mb-12">
            {cultureHighlights.map((item, i) => (
              <div key={item.label} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white">{item.value}</div>
                <div className="text-sm text-gray-300">{item.label}</div>
              </div>
            ))}
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreValues.map((value, i) => (
              <motion.div 
                key={value.title} 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: i * 0.1 }}
                className="bg-[#12121a] border border-white/[0.08] rounded-2xl p-6 hover:border-indigo-500/30 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">{value.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Core Values */}
      <section className="py-20 bg-[#0c0c10]">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Our Core <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">Values</span></h2>
            <p className="text-gray-300 max-w-2xl mx-auto">Our core values are the bedrock of our identity, shaping our culture and defining the way we work.</p>
          </motion.div>
        </div>
      </section>

      {/* Diversity & Inclusion */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Diversity & <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">Inclusion</span></h2>
            <p className="text-gray-300 max-w-2xl mx-auto">Building Strength Through Differences. We recognise that our strength lies in our diversity.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {diversityPoints.map((point, i) => (
              <motion.div 
                key={point.title} 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: i * 0.1 }}
                className="bg-[#12121a] border border-white/[0.08] rounded-2xl p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                    <Award className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-white">{point.title}</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">{point.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#0c0c10] relative overflow-hidden">
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
