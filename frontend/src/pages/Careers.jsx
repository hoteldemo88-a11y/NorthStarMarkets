import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Sparkles,
  GraduationCap,
  TrendingUp,
  Users,
  Compass,
  Plane,
  Gift,
  Handshake,
  Trophy,
  Brain,
  Lightbulb,
  Share2,
  Rocket,
} from 'lucide-react'

const approachItems = [
  'Skill Development',
  'Personal Growth',
  'Career Path Planning',
  'Feedback Mechanism',
  'Mentorship and Guidance',
  'Inclusive Work Environment',
  'Recognition and Rewards',
  'Leadership Development',
]

const rewards = [
  { icon: GraduationCap, title: 'Professional Development Programme' },
  { icon: Plane, title: 'Travel Incentives' },
  { icon: TrendingUp, title: 'Career Advancement Opportunities' },
  { icon: Handshake, title: 'Mentorship Programmes' },
  { icon: Users, title: 'Inclusive Work Environment' },
  { icon: Gift, title: 'Performance-Based Bonuses' },
  { icon: Sparkles, title: 'Social Events and Team Building' },
  { icon: Trophy, title: 'Recognition and Awards' },
]

const growthPillars = [
  {
    icon: Brain,
    title: 'Continuous Learning Culture',
    desc: 'Growth is not a buzzword at North Star Markets. We invest in practical learning that improves real outcomes.',
  },
  {
    icon: Compass,
    title: 'Organic Growth Model',
    desc: 'Progress happens through merit, consistency, and measurable impact.',
  },
  {
    icon: Lightbulb,
    title: 'North Star Academy',
    desc: 'Structured training in sales, leadership, and management to unlock your full potential.',
  },
]

const journeySteps = [
  {
    title: 'Become an Agent',
    desc: 'Start with a focused onboarding journey that introduces our culture, values, and standards for excellence.',
  },
  {
    title: 'North Star Academy Immersion',
    desc: 'Join specialized training tracks designed to strengthen your role-specific skills while preparing you for long-term growth.',
  },
  {
    title: 'Hands-On Experience',
    desc: 'Learn by doing. We combine world-class training with live execution so theory turns into confidence and results.',
  },
  {
    title: 'Career Advancement Opportunities',
    desc: 'Your dedication and results open doors to bigger responsibilities, stronger leadership, and faster progression.',
  },
]

export default function Careers() {
  return (
    <div className="bg-[#0a0a0f] w-full max-w-full overflow-x-hidden">
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[10%] left-[-15%] sm:left-[5%] w-[420px] h-[420px] bg-indigo-600/20 rounded-full blur-[140px]" />
          <div className="absolute bottom-[-15%] right-[-15%] sm:right-[5%] w-[420px] h-[420px] bg-cyan-500/20 rounded-full blur-[140px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.1] mb-5">
              <Rocket className="w-4 h-4 text-cyan-300" />
              <span className="text-sm text-gray-200">Careers at North Star Markets</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">Join The Next Revolution</h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              Build a meaningful career with a team that values growth, ownership, mentorship, and real impact.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-[#0c0c10]">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Our 360-Degree Approach</h2>
            <p className="text-gray-300 max-w-4xl mx-auto">
              Unlike traditional career models, our 360-degree framework supports the full spectrum of your professional journey.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {approachItems.map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl bg-gradient-to-br from-[#12121a] to-[#0d0d12] border border-white/[0.08] p-4 sm:p-5"
              >
                <p className="text-sm sm:text-base text-gray-100">{item}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Rewards Beyond the Workplace</h2>
            <p className="text-gray-300 max-w-3xl mx-auto">
              A fulfilling career includes recognition, progression, mentorship, and a culture where people genuinely enjoy building together.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {rewards.map((reward, i) => (
              <motion.div
                key={reward.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl border border-white/[0.08] bg-[#12121a] p-5 hover:border-indigo-500/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-3">
                  <reward.icon className="w-5 h-5 text-indigo-300" />
                </div>
                <h3 className="text-sm text-gray-100 leading-snug">{reward.title}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#0c0c10]">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Think. Create. Share.</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-5">
            {growthPillars.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl bg-[#12121a] border border-white/[0.08] p-6"
              >
                <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 flex items-center justify-center mb-4">
                  <pillar.icon className="w-5 h-5 text-cyan-300" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{pillar.title}</h3>
                <p className="text-sm text-gray-300 leading-relaxed">{pillar.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Your Journey at North Star Markets</h2>
            <p className="text-gray-300 max-w-3xl mx-auto">A practical path designed to help you grow from onboarding to leadership.</p>
          </motion.div>

          <div className="space-y-4">
            {journeySteps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="rounded-2xl bg-[#12121a] border border-white/[0.08] p-5 sm:p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-300 text-sm font-semibold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                    <p className="text-sm sm:text-base text-gray-300 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 relative overflow-hidden bg-[#0c0c10]">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] h-[560px] bg-gradient-to-r from-indigo-600/15 to-cyan-500/15 rounded-full blur-[110px]" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-5">Ready to grow with us?</h2>
            <p className="text-gray-300 mb-8">Join a team where your effort is recognized and your progression is real.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-xl hover:from-indigo-500 hover:to-cyan-400 transition-all duration-300 shadow-lg shadow-indigo-500/25">
                Become an Agent <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-white bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300">
                Contract Agreement <Share2 className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
