import { useState, useEffect } from 'react'
import { Cookie } from 'lucide-react'

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const consent = localStorage.getItem('cookieConsent')
      if (!consent) {
        setShowBanner(true)
      }
    } catch (e) {
      console.error('localStorage error:', e)
      setShowBanner(true)
    }
  }, [])

  const handleAccept = () => {
    try {
      localStorage.setItem('cookieConsent', 'accepted')
    } catch (e) {}
    setShowBanner(false)
  }

  const handleDecline = () => {
    try {
      localStorage.setItem('cookieConsent', 'declined')
    } catch (e) {}
    setShowBanner(false)
  }

  if (!mounted || !showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-[#12121a] border-t border-white/[0.08]">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Cookie className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
          <p className="text-gray-300 text-sm">
            We use cookies to improve your experience. By continuing to visit this site you agree to our use of cookies.
          </p>
        </div>
        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={handleDecline}
            className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-lg hover:from-indigo-500 hover:to-cyan-400 transition-all"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}
