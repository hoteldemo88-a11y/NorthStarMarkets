import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ArrowRight, UserCircle2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Markets', path: '/markets' },
  { name: 'Gold Price', path: '/gold-price-today' },
  { name: 'Silver Price', path: '/silver-price-today' },
  { name: 'Forex Guide', path: '/forex-trading-guide' },
  { name: 'Our Mission', path: '/our-goal' },
  { name: 'About Us', path: '/about' },
  { name: 'FAQs', path: '/faq' },
  { name: 'Careers', path: '/careers' },
  { name: 'Contact', path: '/contact' },
  { name: 'Reviews', path: '/clients-reviews' },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()
  const { user, logout } = useAuth()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-[#0a0a0f]/90 backdrop-blur-2xl border-b border-white/10 shadow-2xl shadow-black/20' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 overflow-hidden group-hover:scale-105 transition-transform duration-300">
              <img src="/northstar.png" alt="North Star Markets" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="text-lg font-bold bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">North Star</span>
              <span className="text-lg font-bold text-white block -mt-1">Markets</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                className={`relative px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                  location.pathname === link.path 
                    ? 'text-white bg-white/10' 
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.name}
                {location.pathname === link.path && (
                  <motion.div 
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-indigo-400 rounded-full"
                  />
                )}
              </Link>
            ))}
            
            {!user && (
              <>
                <Link to="/login" className="ml-3 px-5 py-2.5 text-sm font-semibold text-gray-100 border border-white/20 rounded-xl hover:bg-white/5 transition-all">
                  Login
                </Link>
                <Link
                  to="/open-account"
                  className="group relative px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-600 to-cyan-500 rounded-xl hover:from-indigo-500 hover:to-cyan-400 transition-all duration-300 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 flex items-center gap-2"
                >
                  <span>Open Account</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </>
            )}

            {user && (
              <>
                <Link to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'} className="ml-3 px-5 py-2.5 text-sm font-semibold text-gray-100 border border-white/20 rounded-xl hover:bg-white/5 transition-all inline-flex items-center gap-2">
                  <UserCircle2 className="w-4 h-4" />
                  Dashboard
                </Link>
                <button onClick={logout} className="px-5 py-2.5 text-sm font-semibold text-red-300 bg-red-500/15 rounded-xl hover:bg-red-500/20 transition-all">
                  Logout
                </button>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="xl:hidden relative p-3 text-white hover:bg-white/10 rounded-xl transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="xl:hidden bg-[#0a0a0f]/98 backdrop-blur-2xl border-t border-white/10"
          >
            <div className="max-w-7xl mx-auto px-4 py-6 space-y-2">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link 
                    to={link.path} 
                    className={`block px-5 py-4 text-base font-medium rounded-xl transition-all duration-200 ${
                      location.pathname === link.path 
                        ? 'text-white bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 border border-indigo-500/30' 
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: navLinks.length * 0.05 }} className="pt-4 space-y-2">
                {!user && (
                  <>
                    <Link to="/login" className="block w-full px-6 py-3.5 text-center text-base font-semibold text-gray-100 border border-white/20 rounded-xl">
                      Login
                    </Link>
                    <Link to="/open-account" className="block w-full px-6 py-4 text-center text-base font-bold text-white bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-xl shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2">
                      <span>Open Account</span>
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </>
                )}

                {user && (
                  <>
                    <Link to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'} className="block w-full px-6 py-3.5 text-center text-base font-semibold text-gray-100 border border-white/20 rounded-xl">
                      Dashboard
                    </Link>
                    <button onClick={logout} className="block w-full px-6 py-3.5 text-center text-base font-semibold text-red-300 bg-red-500/15 rounded-xl">
                      Logout
                    </button>
                  </>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
