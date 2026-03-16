import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, Twitter, Facebook, Instagram, Linkedin, CheckCircle } from 'lucide-react'

const contactInfo = [
  { icon: Mail, title: 'Email Support', details: 'Info@northstarmarketsint.com', description: 'Response within 24 hours' },
  { icon: Phone, title: 'Phone Support', details: '+1 888 511 0840', description: 'Available during business hours' },
  { icon: MapPin, title: 'Headquarters', details: 'Raffles Place, Singapore', description: 'Asia Pacific' },
]

const socialLinks = [
  { icon: Twitter, href: '#', color: 'hover:text-blue-400' },
  { icon: Facebook, href: '#', color: 'hover:text-blue-600' },
  { icon: Instagram, href: '#', color: 'hover:text-pink-400' },
  { icon: Linkedin, href: '#', color: 'hover:text-blue-500' },
]

export default function Contact() {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '', subject: '', message: '' })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  return (
    <div className="bg-[#0a0a0f] w-full max-w-full overflow-x-hidden">
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] bg-indigo-600/15 rounded-full blur-[120px]" />
          <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-cyan-500/15 rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">Get in <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">Touch</span></h1>
            <p className="text-xl text-gray-300">Have questions? Our support team is here to help.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="grid lg:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="bg-[#12121a] border border-white/[0.08] rounded-2xl p-8">
                <h2 className="text-xl font-bold mb-6 text-white">Send us a message</h2>
                
                {isSubmitted ? (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} className="text-center py-10">
                    <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4"><CheckCircle className="w-7 h-7 text-emerald-400" /></div>
                    <h3 className="text-lg font-semibold mb-2 text-white">Message Sent!</h3>
                    <p className="text-sm text-gray-300">We will get back to you within 24 hours.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium mb-2 text-gray-300">First Name</label>
                        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className="w-full px-4 py-3 bg-[#0a0a0f] border border-white/[0.1] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors text-sm" placeholder="John" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-2 text-gray-300">Last Name</label>
                        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required className="w-full px-4 py-3 bg-[#0a0a0f] border border-white/[0.1] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors text-sm" placeholder="Doe" />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium mb-2 text-gray-300">Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 bg-[#0a0a0f] border border-white/[0.1] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors text-sm" placeholder="john@example.com" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-2 text-gray-300">Phone</label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 bg-[#0a0a0f] border border-white/[0.1] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors text-sm" placeholder="+1 (555) 000-0000" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-2 text-gray-300">Subject</label>
                      <select name="subject" value={formData.subject} onChange={handleChange} required className="w-full px-4 py-3 bg-[#0a0a0f] border border-white/[0.1] rounded-xl text-white focus:outline-none focus:border-indigo-500 transition-colors text-sm">
                        <option value="">Select a topic</option>
                        <option value="general">General Inquiry</option>
                        <option value="account">Account Support</option>
                        <option value="trading">Trading Questions</option>
                        <option value="deposit">Deposits & Withdrawals</option>
                        <option value="technical">Technical Issue</option>
                        <option value="partnership">Partnership</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-2 text-gray-300">Message</label>
                      <textarea name="message" value={formData.message} onChange={handleChange} required rows={4} className="w-full px-4 py-3 bg-[#0a0a0f] border border-white/[0.1] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors text-sm resize-none" placeholder="How can we help?" />
                    </div>
                    <button type="submit" disabled={isSubmitting} className="w-full py-3.5 font-medium text-white bg-gradient-to-r from-indigo-600 to-indigo-600 rounded-xl hover:from-indigo-500 hover:to-indigo-500 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 text-sm shadow-lg shadow-indigo-500/20">
                      {isSubmitting ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending...</> : <>Send Message <Send className="w-4 h-4" /></>}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-4">
              {contactInfo.map((info, i) => (
                <motion.div key={info.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="bg-[#12121a] border border-white/[0.08] rounded-xl p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-lg bg-indigo-500/10 flex items-center justify-center flex-shrink-0"><info.icon className="w-5 h-5 text-indigo-400" /></div>
                    <div>
                      <h3 className="text-sm font-semibold mb-0.5 text-white">{info.title}</h3>
                      <div className="text-xs text-cyan-400 mb-0.5 break-all">{info.details}</div>
                      <p className="text-xs text-gray-300">{info.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}

              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-[#12121a] border border-white/[0.08] rounded-xl p-5">
                <h3 className="text-sm font-semibold mb-4 text-white">Follow Us</h3>
                <div className="flex gap-2">
                  {socialLinks.map((social, i) => (
                    <a key={i} href={social.href} className={`w-10 h-10 rounded-lg bg-white/[0.05] flex items-center justify-center text-gray-300 transition-all hover:bg-white/[0.1] ${social.color}`}><social.icon className="w-4 h-4" /></a>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#0c0c10]">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Our <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">Location</span></h2>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-[#12121a] border border-white/[0.08] rounded-2xl overflow-hidden">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d997.1883571890262!2d103.8504501736225!3d1.2837606977725767!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a1902753571b3f%3A0x3915d73311c9a1a5!2sRaffles%20Place%2C%20Singapore!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus" 
              width="100%" 
              height="450" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full"
            />
          </motion.div>
        </div>
      </section>
    </div>
  )
}
