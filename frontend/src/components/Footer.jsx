import { Link } from 'react-router-dom'
import { X, Linkedin, Mail, MapPin, Phone } from 'lucide-react'
import { motion } from 'framer-motion'

const socialLinks = [
  { icon: X, href: 'https://x.com/INTNorthStar' },
  { icon: Linkedin, href: 'https://www.linkedin.com/company/north-star-int' },
]

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0f] border-t border-white/[0.08] overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-10 sm:py-12">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-6 lg:gap-8">
          <div className="col-span-2 min-w-0">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 overflow-hidden">
                <img src="/nortstar.png" alt="North Star Markets" className="w-full h-full object-contain" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">North Star Markets</span>
            </Link>
            <p className="text-gray-300 text-sm mb-4 max-w-xs leading-relaxed">North Star Markets provides global market insights, trading research, and financial market access to clients worldwide.</p>
            <div className="flex flex-col gap-2 mb-4 max-w-xs">
              <Link to="/open-account" className="w-full text-center px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-lg hover:from-indigo-500 hover:to-cyan-400 transition-all">Open Account</Link>
            </div>
            <div className="flex gap-2.5">
              {socialLinks.map((social, i) => (
                <motion.a key={i} href={social.href} whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.95 }} className="w-9 h-9 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/[0.1] transition-colors">
                  <social.icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          <div className="min-w-0">
            <h4 className="text-white font-semibold mb-3">Company</h4>
            <ul className="space-y-2">
              <li><Link to="/our-goal" className="text-gray-300 text-sm hover:text-white transition-colors">Our Mission</Link></li>
              <li><Link to="/about" className="text-gray-300 text-sm hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/careers" className="text-gray-300 text-sm hover:text-white transition-colors">Careers</Link></li>
              <li><Link to="/contact" className="text-gray-300 text-sm hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div className="min-w-0">
            <h4 className="text-white font-semibold mb-3">Trading</h4>
            <ul className="space-y-2">
              <li><Link to="/markets" className="text-gray-300 text-sm hover:text-white transition-colors">Markets</Link></li>
              <li><Link to="/markets/currencies" className="text-gray-300 text-sm hover:text-white transition-colors">Currencies</Link></li>
              <li><Link to="/markets/agricultural" className="text-gray-300 text-sm hover:text-white transition-colors">Commodities</Link></li>
              <li><Link to="/markets/metals" className="text-gray-300 text-sm hover:text-white transition-colors">Metals</Link></li>
              <li><Link to="/markets/energy" className="text-gray-300 text-sm hover:text-white transition-colors">Energy</Link></li>
            </ul>
          </div>

          <div className="min-w-0">
            <h4 className="text-white font-semibold mb-3">Support</h4>
            <ul className="space-y-2">
              <li><Link to="/faq" className="text-gray-300 text-sm hover:text-white transition-colors">FAQs</Link></li>
              <li><Link to="/clients-reviews" className="text-gray-300 text-sm hover:text-white transition-colors">Client Reviews</Link></li>
              <li><Link to="/contact" className="text-gray-300 text-sm hover:text-white transition-colors">Help Center</Link></li>
            </ul>
          </div>

          <div className="min-w-0">
            <h4 className="text-white font-semibold mb-3">Contact</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-gray-300 text-sm break-all"><Mail className="w-3.5 h-3.5 flex-shrink-0" />Info@northstarmarketsint.com</li>
              <li className="flex items-center gap-2 text-gray-300 text-sm"><Phone className="w-3.5 h-3.5 flex-shrink-0" />+1 888 511 0840</li>
              <li className="flex items-start gap-2 text-gray-300 text-sm"><MapPin className="w-3.5 h-3.5 mt-0.5" />Singapore</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/[0.08] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-300 text-sm">© {new Date().getFullYear()} North Star Markets. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <Link to="/about" onClick={() => window.scrollTo(0, 0)} className="text-gray-300 text-sm hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/about" onClick={() => window.scrollTo(0, 0)} className="text-gray-300 text-sm hover:text-white transition-colors">Cookie Policy</Link>
            <Link to="/about" onClick={() => window.scrollTo(0, 0)} className="text-gray-300 text-sm hover:text-white transition-colors">Risk Disclosure</Link>
            <Link to="/about" onClick={() => window.scrollTo(0, 0)} className="text-gray-300 text-sm hover:text-white transition-colors">Terms & Conditions</Link>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-white/[0.08]">
          <p className="text-gray-400 text-xs text-center">Risk Disclosure: Trading financial markets involves significant risk and may not be suitable for all individuals. Past performance is not indicative of future results.</p>
        </div>
      </div>
    </footer>
  )
}
