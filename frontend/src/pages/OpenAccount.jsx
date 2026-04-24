import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import {
  FaArrowLeft,
  FaArrowRight,
  FaBriefcase,
  FaChartLine,
  FaCheck,
  FaEnvelope,
  FaFlag,
  FaGlobe,
  FaIdCard,
  FaLock,
  FaPhone,
  FaPiggyBank,
  FaShieldAlt,
  FaSlidersH,
  FaUser,
  FaWallet,
} from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'

const stepConfig = [
  { key: 'account', title: 'Create Account', subtitle: 'Set your secure sign-in details', icon: FaLock },
  { key: 'personal', title: 'Personal Information', subtitle: 'Tell us who you are', icon: FaIdCard },
  { key: 'financial', title: 'Financial Information', subtitle: 'Understand your financial profile', icon: FaWallet },
  { key: 'compliance', title: 'Compliance Questions', subtitle: 'Regulatory identity checks', icon: FaShieldAlt },
  { key: 'risk', title: 'Risk Profile', subtitle: 'Select your risk appetite', icon: FaSlidersH },
  { key: 'experience', title: 'Trading Experience', subtitle: 'Track your market background', icon: FaChartLine },
  { key: 'preferences', title: 'Investment Preferences', subtitle: 'Configure your strategy preferences', icon: FaPiggyBank },
]

  const initialData = {
  username: '',
  email: '',
  confirmEmail: '',
  password: '',
  confirmPassword: '',
  firstName: '',
  lastName: '',
  phone: '',
  idType: '',
  idNumber: '',
  country: 'Canada',
  dateOfBirth: '',
  annualIncome: '',
  netWorth: '',
  employmentStatus: '',
  sourceOfFunds: '',
  usCitizen: '',
  pepStatus: '',
  taxResidency: '',
  riskTolerance: '',
  investmentHorizon: '',
  maxDrawdown: '',
  yearsTrading: '',
  productsTraded: [],
  averageTradesPerMonth: '',
  preferredMarkets: [],
  strategyStyle: '',
  preferredLeverage: '',
  skipIdUpload: false,
}

const idTypeOptions = {
  default: [
    { value: 'passport', label: 'Passport' },
    { value: 'national_id', label: 'National ID' },
    { value: 'drivers_license', label: "Driver's License" },
    { value: 'voter_id', label: 'Voter ID' },
  ],
  US: [
    { value: 'ssn', label: 'Social Security Number (SSN)' },
    { value: 'drivers_license', label: "Driver's License" },
    { value: 'passport', label: 'US Passport' },
  ],
  UK: [
    { value: 'passport', label: 'UK Passport' },
    { value: 'national_id', label: 'National Insurance Number' },
    { value: 'drivers_license', label: "Driver's License" },
  ],
  India: [
    { value: 'aadhaar', label: 'Aadhaar Card' },
    { value: 'pan', label: 'PAN Card' },
    { value: 'passport', label: 'Passport' },
    { value: 'drivers_license', label: "Driver's License" },
    { value: 'voter_id', label: 'Voter ID' },
  ],
}

const getIdOptions = (country) => {
  if (!country) return idTypeOptions.default
  const countryKey = Object.keys(idTypeOptions).find(key => 
    country.toLowerCase().includes(key.toLowerCase())
  )
  return idTypeOptions[countryKey] || idTypeOptions.default
}

const countryList = [
  { code: 'af', name: 'Afghanistan', dial: '+93', flag: '🇦🇫' },
  { code: 'al', name: 'Albania', dial: '+355', flag: '🇦🇱' },
  { code: 'dz', name: 'Algeria', dial: '+213', flag: '🇩🇿' },
  { code: 'ad', name: 'Andorra', dial: '+376', flag: '🇦🇩' },
  { code: 'ao', name: 'Angola', dial: '+244', flag: '🇦🇴' },
  { code: 'ar', name: 'Argentina', dial: '+54', flag: '🇦🇷' },
  { code: 'am', name: 'Armenia', dial: '+374', flag: '🇦🇲' },
  { code: 'au', name: 'Australia', dial: '+61', flag: '🇦🇺' },
  { code: 'at', name: 'Austria', dial: '+43', flag: '🇦🇹' },
  { code: 'az', name: 'Azerbaijan', dial: '+994', flag: '🇦🇿' },
  { code: 'bs', name: 'Bahamas', dial: '+1', flag: '🇧🇸' },
  { code: 'bh', name: 'Bahrain', dial: '+973', flag: '🇧🇭' },
  { code: 'bd', name: 'Bangladesh', dial: '+880', flag: '🇧🇩' },
  { code: 'bb', name: 'Barbados', dial: '+1', flag: '🇧🇧' },
  { code: 'by', name: 'Belarus', dial: '+375', flag: '🇧🇾' },
  { code: 'be', name: 'Belgium', dial: '+32', flag: '🇧🇪' },
  { code: 'bz', name: 'Belize', dial: '+501', flag: '🇧🇿' },
  { code: 'bj', name: 'Benin', dial: '+229', flag: '🇧🇯' },
  { code: 'bt', name: 'Bhutan', dial: '+975', flag: '🇧🇹' },
  { code: 'bo', name: 'Bolivia', dial: '+591', flag: '🇧🇴' },
  { code: 'ba', name: 'Bosnia', dial: '+387', flag: '🇧🇦' },
  { code: 'bw', name: 'Botswana', dial: '+267', flag: '🇧🇼' },
  { code: 'br', name: 'Brazil', dial: '+55', flag: '🇧🇷' },
  { code: 'bn', name: 'Brunei', dial: '+673', flag: '🇧🇳' },
  { code: 'bg', name: 'Bulgaria', dial: '+359', flag: '🇧🇬' },
  { code: 'kh', name: 'Cambodia', dial: '+855', flag: '🇰🇭' },
  { code: 'cm', name: 'Cameroon', dial: '+237', flag: '🇨🇲' },
  { code: 'ca', name: 'Canada', dial: '+1', flag: '🇨🇦' },
  { code: 'cl', name: 'Chile', dial: '+56', flag: '🇨🇱' },
  { code: 'cn', name: 'China', dial: '+86', flag: '🇨🇳' },
  { code: 'co', name: 'Colombia', dial: '+57', flag: '🇨🇴' },
  { code: 'cr', name: 'Costa Rica', dial: '+506', flag: '🇨🇷' },
  { code: 'hr', name: 'Croatia', dial: '+385', flag: '🇭🇷' },
  { code: 'cu', name: 'Cuba', dial: '+53', flag: '🇨🇺' },
  { code: 'cy', name: 'Cyprus', dial: '+357', flag: '🇨🇾' },
  { code: 'cz', name: 'Czechia', dial: '+420', flag: '🇨🇿' },
  { code: 'dk', name: 'Denmark', dial: '+45', flag: '🇩🇰' },
  { code: 'do', name: 'Dominican Republic', dial: '+1', flag: '🇩🇴' },
  { code: 'ec', name: 'Ecuador', dial: '+593', flag: '🇪🇨' },
  { code: 'eg', name: 'Egypt', dial: '+20', flag: '🇪🇬' },
  { code: 'sv', name: 'El Salvador', dial: '+503', flag: '🇸🇻' },
  { code: 'ee', name: 'Estonia', dial: '+372', flag: '🇪🇪' },
  { code: 'et', name: 'Ethiopia', dial: '+251', flag: '🇪🇹' },
  { code: 'fi', name: 'Finland', dial: '+358', flag: '🇫🇮' },
  { code: 'fr', name: 'France', dial: '+33', flag: '🇫🇷' },
  { code: 'ge', name: 'Georgia', dial: '+995', flag: '🇬🇪' },
  { code: 'de', name: 'Germany', dial: '+49', flag: '🇩🇪' },
  { code: 'gh', name: 'Ghana', dial: '+233', flag: '🇬🇭' },
  { code: 'gr', name: 'Greece', dial: '+30', flag: '🇬🇷' },
  { code: 'gt', name: 'Guatemala', dial: '+502', flag: '🇬🇹' },
  { code: 'hn', name: 'Honduras', dial: '+504', flag: '🇭🇳' },
  { code: 'hu', name: 'Hungary', dial: '+36', flag: '🇭🇺' },
  { code: 'is', name: 'Iceland', dial: '+354', flag: '🇮🇸' },
  { code: 'in', name: 'India', dial: '+91', flag: '🇮🇳' },
  { code: 'id', name: 'Indonesia', dial: '+62', flag: '🇮🇩' },
  { code: 'ir', name: 'Iran', dial: '+98', flag: '🇮🇷' },
  { code: 'iq', name: 'Iraq', dial: '+964', flag: '🇮🇶' },
  { code: 'ie', name: 'Ireland', dial: '+353', flag: '🇮🇪' },
  { code: 'il', name: 'Israel', dial: '+972', flag: '🇮🇱' },
  { code: 'it', name: 'Italy', dial: '+39', flag: '🇮🇹' },
  { code: 'jm', name: 'Jamaica', dial: '+1', flag: '🇯🇲' },
  { code: 'jp', name: 'Japan', dial: '+81', flag: '🇯🇵' },
  { code: 'jo', name: 'Jordan', dial: '+962', flag: '🇯🇴' },
  { code: 'kz', name: 'Kazakhstan', dial: '+7', flag: '🇰🇿' },
  { code: 'ke', name: 'Kenya', dial: '+254', flag: '🇰🇪' },
  { code: 'kr', name: 'South Korea', dial: '+82', flag: '🇰🇷' },
  { code: 'kw', name: 'Kuwait', dial: '+965', flag: '🇰🇼' },
  { code: 'lb', name: 'Lebanon', dial: '+961', flag: '🇱🇧' },
  { code: 'lt', name: 'Lithuania', dial: '+370', flag: '🇱🇹' },
  { code: 'lu', name: 'Luxembourg', dial: '+352', flag: '🇱🇺' },
  { code: 'my', name: 'Malaysia', dial: '+60', flag: '🇲🇾' },
  { code: 'mv', name: 'Maldives', dial: '+960', flag: '🇲🇻' },
  { code: 'mt', name: 'Malta', dial: '+356', flag: '🇲🇹' },
  { code: 'mx', name: 'Mexico', dial: '+52', flag: '🇲🇽' },
  { code: 'md', name: 'Moldova', dial: '+373', flag: '🇲🇩' },
  { code: 'mc', name: 'Monaco', dial: '+377', flag: '🇲🇨' },
  { code: 'mn', name: 'Mongolia', dial: '+976', flag: '🇲🇳' },
  { code: 'me', name: 'Montenegro', dial: '+382', flag: '🇲🇪' },
  { code: 'ma', name: 'Morocco', dial: '+212', flag: '🇲🇦' },
  { code: 'mz', name: 'Mozambique', dial: '+258', flag: '🇲🇿' },
  { code: 'mm', name: 'Myanmar', dial: '+95', flag: '🇲🇲' },
  { code: 'np', name: 'Nepal', dial: '+977', flag: '🇳🇵' },
  { code: 'nl', name: 'Netherlands', dial: '+31', flag: '🇳🇱' },
  { code: 'nz', name: 'New Zealand', dial: '+64', flag: '🇳🇿' },
  { code: 'ni', name: 'Nicaragua', dial: '+505', flag: '🇳🇮' },
  { code: 'ng', name: 'Nigeria', dial: '+234', flag: '🇳🇬' },
  { code: 'no', name: 'Norway', dial: '+47', flag: '🇳🇴' },
  { code: 'om', name: 'Oman', dial: '+968', flag: '🇴🇲' },
  { code: 'pk', name: 'Pakistan', dial: '+92', flag: '🇵🇰' },
  { code: 'pa', name: 'Panama', dial: '+507', flag: '🇵🇦' },
  { code: 'pe', name: 'Peru', dial: '+51', flag: '🇵🇪' },
  { code: 'ph', name: 'Philippines', dial: '+63', flag: '🇵🇭' },
  { code: 'pl', name: 'Poland', dial: '+48', flag: '🇵🇱' },
  { code: 'pt', name: 'Portugal', dial: '+351', flag: '🇵🇹' },
  { code: 'qa', name: 'Qatar', dial: '+974', flag: '🇶🇦' },
  { code: 'ro', name: 'Romania', dial: '+40', flag: '🇷🇴' },
  { code: 'ru', name: 'Russia', dial: '+7', flag: '🇷🇺' },
  { code: 'sa', name: 'Saudi Arabia', dial: '+966', flag: '🇸🇦' },
  { code: 'rs', name: 'Serbia', dial: '+381', flag: '🇷🇸' },
  { code: 'sg', name: 'Singapore', dial: '+65', flag: '🇸🇬' },
  { code: 'sk', name: 'Slovakia', dial: '+421', flag: '🇸🇰' },
  { code: 'si', name: 'Slovenia', dial: '+386', flag: '🇸🇮' },
  { code: 'za', name: 'South Africa', dial: '+27', flag: '🇿🇦' },
  { code: 'es', name: 'Spain', dial: '+34', flag: '🇪🇸' },
  { code: 'lk', name: 'Sri Lanka', dial: '+94', flag: '🇱🇰' },
  { code: 'se', name: 'Sweden', dial: '+46', flag: '🇸🇪' },
  { code: 'ch', name: 'Switzerland', dial: '+41', flag: '🇨🇭' },
  { code: 'tw', name: 'Taiwan', dial: '+886', flag: '🇹🇼' },
  { code: 'th', name: 'Thailand', dial: '+66', flag: '🇹🇭' },
  { code: 'tr', name: 'Turkey', dial: '+90', flag: '🇹🇷' },
  { code: 'ua', name: 'Ukraine', dial: '+380', flag: '🇺🇦' },
  { code: 'ae', name: 'UAE', dial: '+971', flag: '🇦🇪' },
  { code: 'gb', name: 'United Kingdom', dial: '+44', flag: '🇬🇧' },
  { code: 'us', name: 'United States', dial: '+1', flag: '🇺🇸' },
  { code: 'uy', name: 'Uruguay', dial: '+598', flag: '🇺🇾' },
  { code: 'uz', name: 'Uzbekistan', dial: '+998', flag: '🇺🇿' },
  { code: 've', name: 'Venezuela', dial: '+58', flag: '🇻🇪' },
  { code: 'vn', name: 'Vietnam', dial: '+84', flag: '🇻🇳' },
]

const options = {
  employmentStatus: ['Employed', 'Self-Employed', 'Student', 'Retired'],
  sourceOfFunds: ['Salary', 'Business Income', 'Investments', 'Savings'],
  investmentHorizon: ['short', 'medium', 'long'],
  yearsTrading: ['0-1', '1-3', '3-5', '5+'],
  averageTradesPerMonth: ['1-10', '10-30', '30-50', '50+'],
  preferredLeverage: ['1:30', '1:50', '1:100', '1:200'],
}

const riskOptions = [
  { value: 'low', label: 'Low', desc: 'Capital preservation with conservative exposure.' },
  { value: 'moderate', label: 'Moderate', desc: 'Balanced risk and reward profile.' },
  { value: 'high', label: 'High', desc: 'Aggressive growth with higher volatility tolerance.' },
]

const drawdownOptions = [
  { value: '<10%', label: 'Below 10%' },
  { value: '10-20%', label: '10% - 20%' },
  { value: '20-30%', label: '20% - 30%' },
  { value: '30%+', label: 'Above 30%' },
]

const strategyOptions = [
  { value: 'scalping', label: 'Scalping' },
  { value: 'day-trading', label: 'Day Trading' },
  { value: 'swing', label: 'Swing' },
  { value: 'position', label: 'Position' },
]

const productOptions = ['forex', 'stocks', 'crypto', 'commodities', 'indices']
const marketOptions = ['forex', 'commodities', 'metals', 'crypto', 'stocks', 'indices']

function getCountryFromLocale() {
  if (typeof navigator === 'undefined') return 'us'
  const locale = navigator.language?.split('-')[1]?.toLowerCase()
  return locale || 'us'
}

export default function OpenAccount() {
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState(initialData)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')
  const [countryIso, setCountryIso] = useState('ca')
  const [selectedCountry, setSelectedCountry] = useState('')
  const { user, loading: authLoading, register } = useAuth()
  const navigate = useNavigate()

  const progress = useMemo(() => Math.round(((step + 1) / stepConfig.length) * 100), [step])

  if (authLoading) {
    return <div className="min-h-screen bg-[#090910] text-white flex items-center justify-center">Loading...</div>
  }

  if (user) {
    navigate(user.role === 'admin' ? '/admin/dashboard' : '/dashboard', { replace: true })
    return null
  }
  const currentStep = stepConfig[step]

  const setField = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const toggleMulti = (name, value) => {
    const current = formData[name]
    const next = current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
    setField(name, next)
  }

  const validateStep = () => {
    const nextErrors = {}

    if (step === 0) {
      if (!formData.username.trim()) nextErrors.username = 'Username is required'
      if (!/^\S+@\S+\.\S+$/.test(formData.email)) nextErrors.email = 'Enter a valid email'
      if (formData.email !== formData.confirmEmail) nextErrors.confirmEmail = 'Emails do not match'
      if ((formData.password || '').length < 8) nextErrors.password = 'Password must be at least 8 characters'
      if (formData.password !== formData.confirmPassword) nextErrors.confirmPassword = 'Passwords do not match'
    }

    if (step === 1) {
      if (!formData.firstName.trim()) nextErrors.firstName = 'First name is required'
      if (!formData.lastName.trim()) nextErrors.lastName = 'Last name is required'
      if (!formData.phone.trim() || formData.phone.length < 8) nextErrors.phone = 'Valid phone number is required'
      if (!formData.country.trim()) nextErrors.country = 'Country is required'
      if (!formData.dateOfBirth) nextErrors.dateOfBirth = 'Date of birth is required'
      
      if (!formData.skipIdUpload) {
        if (!formData.idType) nextErrors.idType = 'Select ID type or skip'
        if (!formData.idNumber.trim()) nextErrors.idNumber = 'ID number is required or skip'
      }
    }

    if (step === 2) {
      if (!formData.annualIncome) nextErrors.annualIncome = 'Annual income is required'
      if (!formData.netWorth) nextErrors.netWorth = 'Net worth is required'
      if (!formData.employmentStatus) nextErrors.employmentStatus = 'Select employment status'
      if (!formData.sourceOfFunds) nextErrors.sourceOfFunds = 'Select source of funds'
    }

    if (step === 3) {
      if (!formData.usCitizen) nextErrors.usCitizen = 'Please select an option'
      if (!formData.pepStatus) nextErrors.pepStatus = 'Please select an option'
      if (!formData.taxResidency.trim()) nextErrors.taxResidency = 'Tax residency is required'
    }

    if (step === 4) {
      if (!formData.riskTolerance) nextErrors.riskTolerance = 'Select risk tolerance'
      if (!formData.investmentHorizon) nextErrors.investmentHorizon = 'Select investment horizon'
      if (!formData.maxDrawdown) nextErrors.maxDrawdown = 'Select drawdown comfort'
    }

    if (step === 5) {
      if (!formData.yearsTrading) nextErrors.yearsTrading = 'Select trading years'
      if (!formData.averageTradesPerMonth) nextErrors.averageTradesPerMonth = 'Select monthly trade frequency'
      if (!formData.productsTraded.length) nextErrors.productsTraded = 'Select at least one traded product'
    }

    if (step === 6) {
      if (!formData.preferredMarkets.length) nextErrors.preferredMarkets = 'Select at least one preferred market'
      if (!formData.strategyStyle) nextErrors.strategyStyle = 'Select strategy style'
      if (!formData.preferredLeverage) nextErrors.preferredLeverage = 'Select leverage'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const nextStep = () => {
    if (!validateStep()) return
    setStep((prev) => Math.min(prev + 1, stepConfig.length - 1))
  }

  const backStep = () => setStep((prev) => Math.max(prev - 1, 0))

  const submit = async () => {
    if (!validateStep()) return

    setApiError('')
    setLoading(true)

    try {
      await register({
        ...formData,
        productsTraded: formData.productsTraded.join(','),
        preferredMarkets: formData.preferredMarkets.join(','),
      })
      navigate('/dashboard?section=main')
    } catch (err) {
      setApiError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#08080d] pt-28 pb-16 px-3 sm:px-4 lg:px-6 overflow-x-hidden">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#141421] via-[#10101a] to-[#0d0d15] p-5 sm:p-7 lg:p-8">
          <div className="pointer-events-none absolute -top-28 right-[-80px] w-72 h-72 bg-cyan-500/12 rounded-full blur-[110px]" />
          <div className="pointer-events-none absolute -bottom-24 left-[-90px] w-72 h-72 bg-indigo-500/12 rounded-full blur-[110px]" />

          <div className="relative">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Open Your Trading Account</h1>
              <span className="text-sm text-gray-300">{progress}% completed</span>
            </div>

            <div className="mb-6 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-xl bg-cyan-500/15 border border-cyan-400/25 flex items-center justify-center text-cyan-300">
                  <currentStep.icon />
                </div>
                <div>
                  <p className="text-white font-semibold">{currentStep.title}</p>
                  <p className="text-sm text-gray-400 mt-1">{currentStep.subtitle}</p>
                </div>
              </div>

              <div className="w-full h-2 rounded-full bg-white/10 mt-4 overflow-hidden">
                <motion.div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400" initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -18 }}
                transition={{ duration: 0.22 }}
                className="space-y-4"
              >
                {step === 0 && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    <InputField icon={FaUser} label="Username" value={formData.username} onChange={(v) => setField('username', v)} error={errors.username} />
                    <InputField icon={FaEnvelope} label="Email" type="email" value={formData.email} onChange={(v) => setField('email', v)} error={errors.email} />
                    <InputField icon={FaEnvelope} label="Confirm Email" type="email" value={formData.confirmEmail} onChange={(v) => setField('confirmEmail', v)} error={errors.confirmEmail} />
                    <InputField icon={FaLock} label="Password" type="password" value={formData.password} onChange={(v) => setField('password', v)} error={errors.password} className="sm:col-span-2" />
                    <InputField icon={FaLock} label="Confirm Password" type="password" value={formData.confirmPassword} onChange={(v) => setField('confirmPassword', v)} error={errors.confirmPassword} className="sm:col-span-2" />
                  </div>
                )}

                {step === 1 && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    <InputField icon={FaUser} label="First Name" value={formData.firstName} onChange={(v) => setField('firstName', v)} error={errors.firstName} />
                    <InputField icon={FaUser} label="Last Name" value={formData.lastName} onChange={(v) => setField('lastName', v)} error={errors.lastName} />

                    <div className="sm:col-span-2">
                      <label className="text-sm text-gray-300 mb-2 block">Phone Number</label>
                      <div className="rounded-xl border border-white/[0.12] bg-[#0a0a0f] p-1.5">
                        <div className="flex flex-col sm:flex-row items-stretch gap-2">
                          <select
                            value={countryIso}
                            onChange={(e) => {
                              const selected = countryList.find(c => c.code === e.target.value)
                              setCountryIso(e.target.value)
                              setSelectedCountry(selected?.name || '')
                              setField('country', selected?.name || '')
                            }}
                            className="w-full sm:w-auto bg-[#0a0a0f] text-white text-sm min-h-[44px] px-2 rounded-lg"
                          >
                            {countryList.map((c) => (
                              <option key={c.code} value={c.code} className="bg-[#141421]">
                                {c.flag} {c.name} {c.dial}
                              </option>
                            ))}
                          </select>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setField('phone', e.target.value)}
                            placeholder="Enter phone number"
                            className="flex-1 bg-transparent border border-white/20 rounded-lg text-white outline-none px-3 py-2.5 min-h-[44px]"
                          />
                        </div>
                      </div>
                      {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone}</p>}
                    </div>

                    <InputField icon={FaGlobe} label="Country" value={formData.country || selectedCountry || ''} onChange={(v) => setField('country', v)} error={errors.country} readOnly />
                    <InputField icon={FaIdCard} label="Date of Birth" type="date" value={formData.dateOfBirth} onChange={(v) => setField('dateOfBirth', v)} error={errors.dateOfBirth} />

                    <div className="sm:col-span-2 mt-2 p-4 rounded-xl bg-amber-500/10 border border-amber-400/25">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-amber-200 font-medium">ID Verification (Optional)</p>
                          <p className="text-xs text-amber-100/70 mt-1">You can skip this and upload your ID later from your dashboard for faster verification.</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setField('skipIdUpload', !formData.skipIdUpload)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${formData.skipIdUpload ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' : 'bg-white/10 text-gray-300 border border-white/20'}`}
                        >
                          {formData.skipIdUpload ? 'Skip Selected' : 'Skip for Now'}
                        </button>
                      </div>
                    </div>

                    {!formData.skipIdUpload && (
                      <>
                        <InputField icon={FaIdCard} label="ID Number (Passport/National ID)" value={formData.idNumber} onChange={(v) => setField('idNumber', v)} error={errors.idNumber} />

                        <div className="sm:col-span-2">
                          <label className="text-sm text-gray-300 mb-2 block">ID Type</label>
                          <select
                            value={formData.idType}
                            onChange={(e) => { setField('idType', e.target.value); setField('idNumber', '') }}
                            className="w-full px-4 py-2.5 rounded-xl bg-[#0a0a0f] border border-white/[0.12] text-white focus:outline-none focus:border-cyan-500"
                          >
                            <option value="">Select ID type</option>
                            {getIdOptions(formData.country).map(opt => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                          {errors.idType && <p className="text-xs text-red-400 mt-1">{errors.idType}</p>}
                        </div>
                      </>
                    )}
                  </div>
                )}

                {step === 2 && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    <SelectField icon={FaWallet} label="Annual Income" value={formData.annualIncome} onChange={(v) => setField('annualIncome', v)} options={['<25k', '25k-50k', '50k-100k', '100k+']} error={errors.annualIncome} />
                    <SelectField icon={FaWallet} label="Net Worth" value={formData.netWorth} onChange={(v) => setField('netWorth', v)} options={['<50k', '50k-100k', '100k-250k', '250k+']} error={errors.netWorth} />
                    <SelectField icon={FaBriefcase} label="Employment Status" value={formData.employmentStatus} onChange={(v) => setField('employmentStatus', v)} options={options.employmentStatus} error={errors.employmentStatus} />
                    <SelectField icon={FaPiggyBank} label="Source of Funds" value={formData.sourceOfFunds} onChange={(v) => setField('sourceOfFunds', v)} options={options.sourceOfFunds} error={errors.sourceOfFunds} />
                  </div>
                )}

                {step === 3 && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    <RadioGroup
                      icon={FaFlag}
                      label="Are you a US citizen?"
                      value={formData.usCitizen}
                      onChange={(v) => setField('usCitizen', v)}
                      options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]}
                      error={errors.usCitizen}
                    />
                    <RadioGroup
                      icon={FaShieldAlt}
                      label="Politically Exposed Person (PEP)?"
                      value={formData.pepStatus}
                      onChange={(v) => setField('pepStatus', v)}
                      options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]}
                      error={errors.pepStatus}
                    />
                    <InputField icon={FaGlobe} label="Tax Residency" value={formData.taxResidency} onChange={(v) => setField('taxResidency', v)} error={errors.taxResidency} className="sm:col-span-2" />
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-4">
                    <CardRadioGroup icon={FaSlidersH} label="Risk Tolerance" value={formData.riskTolerance} onChange={(v) => setField('riskTolerance', v)} options={riskOptions} error={errors.riskTolerance} />

                    <div className="grid sm:grid-cols-2 gap-4">
                      <SelectField icon={FaChartLine} label="Investment Horizon" value={formData.investmentHorizon} onChange={(v) => setField('investmentHorizon', v)} options={options.investmentHorizon} error={errors.investmentHorizon} />
                      <RadioGroup
                        icon={FaChartLine}
                        label="Maximum Drawdown"
                        value={formData.maxDrawdown}
                        onChange={(v) => setField('maxDrawdown', v)}
                        options={drawdownOptions.map((item) => ({ value: item.value, label: item.label }))}
                        error={errors.maxDrawdown}
                      />
                    </div>
                  </div>
                )}

                {step === 5 && (
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <SelectField icon={FaChartLine} label="Years Trading" value={formData.yearsTrading} onChange={(v) => setField('yearsTrading', v)} options={options.yearsTrading} error={errors.yearsTrading} />
                      <SelectField icon={FaChartLine} label="Average Trades / Month" value={formData.averageTradesPerMonth} onChange={(v) => setField('averageTradesPerMonth', v)} options={options.averageTradesPerMonth} error={errors.averageTradesPerMonth} />
                    </div>

                    <CheckboxGroup
                      icon={FaChartLine}
                      label="Products Traded"
                      values={formData.productsTraded}
                      onToggle={(value) => toggleMulti('productsTraded', value)}
                      options={productOptions}
                      error={errors.productsTraded}
                    />
                  </div>
                )}

                {step === 6 && (
                  <div className="space-y-4">
                    <CheckboxGroup
                      icon={FaGlobe}
                      label="Preferred Markets"
                      values={formData.preferredMarkets}
                      onToggle={(value) => toggleMulti('preferredMarkets', value)}
                      options={marketOptions}
                      error={errors.preferredMarkets}
                    />

                    <RadioGroup
                      icon={FaChartLine}
                      label="Strategy Style"
                      value={formData.strategyStyle}
                      onChange={(v) => setField('strategyStyle', v)}
                      options={strategyOptions}
                      error={errors.strategyStyle}
                    />

                    <SelectField icon={FaWallet} label="Preferred Leverage" value={formData.preferredLeverage} onChange={(v) => setField('preferredLeverage', v)} options={options.preferredLeverage} error={errors.preferredLeverage} />

                    <div className="rounded-xl border border-emerald-400/25 bg-emerald-500/10 p-4 flex items-start gap-3">
                      <FaCheck className="text-emerald-300 mt-0.5" />
                      <p className="text-sm text-emerald-100">By submitting, you confirm information accuracy and agree to onboarding, compliance, and risk disclosures.</p>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {apiError && <p className="text-sm text-red-400 mt-4">{apiError}</p>}

            <div className="mt-7 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={backStep}
                disabled={step === 0 || loading}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/20 text-gray-200 disabled:opacity-40"
              >
                <FaArrowLeft className="text-xs" />
                Back
              </button>

              {step < stepConfig.length - 1 ? (
                <button type="button" onClick={nextStep} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-semibold">
                  Next
                  <FaArrowRight className="text-xs" />
                </button>
              ) : (
                <button type="button" onClick={submit} disabled={loading} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-semibold disabled:opacity-50">
                  {loading ? 'Submitting...' : 'Create Account'}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function InputField({ icon: Icon, label, value, onChange, type = 'text', className = '', error, readOnly = false }) {
  return (
    <div className={className}>
      <label className="text-sm text-gray-300 mb-2 block">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          readOnly={readOnly}
          className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#0a0a0f] border border-white/[0.12] text-white focus:outline-none focus:border-cyan-500"
        />
      </div>
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  )
}

function SelectField({ icon: Icon, label, value, onChange, options = [], error }) {
  return (
    <div>
      <label className="text-sm text-gray-300 mb-2 block">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#0a0a0f] border border-white/[0.12] text-white focus:outline-none focus:border-cyan-500"
        >
          <option value="">Select option</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  )
}

function RadioGroup({ icon: Icon, label, value, onChange, options = [], error }) {
  return (
    <div>
      <label className="text-sm text-gray-300 mb-2 flex items-center gap-2">
        <Icon className="text-gray-500" />
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`px-4 py-2 rounded-xl border text-sm capitalize transition-all ${value === option.value ? 'border-cyan-400 bg-cyan-500/15 text-cyan-200' : 'border-white/15 bg-white/[0.03] text-gray-300 hover:bg-white/10'}`}
          >
            {option.label}
          </button>
        ))}
      </div>
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  )
}

function CardRadioGroup({ icon: Icon, label, value, onChange, options = [], error }) {
  return (
    <div>
      <label className="text-sm text-gray-300 mb-2 flex items-center gap-2">
        <Icon className="text-gray-500" />
        {label}
      </label>
      <div className="grid sm:grid-cols-3 gap-3">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`text-left rounded-xl border p-3 transition-all ${value === option.value ? 'border-cyan-400 bg-cyan-500/10' : 'border-white/12 bg-[#0b0b13] hover:bg-[#10101a]'}`}
          >
            <p className="text-sm font-semibold text-white">{option.label}</p>
            <p className="text-xs text-gray-400 mt-1">{option.desc}</p>
          </button>
        ))}
      </div>
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  )
}

function CheckboxGroup({ icon: Icon, label, values, onToggle, options = [], error }) {
  return (
    <div>
      <label className="text-sm text-gray-300 mb-2 flex items-center gap-2">
        <Icon className="text-gray-500" />
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = values.includes(option)
          return (
            <button
              key={option}
              type="button"
              onClick={() => onToggle(option)}
              className={`px-3.5 py-2 rounded-xl border text-sm capitalize transition-all ${selected ? 'border-cyan-400 bg-cyan-500/15 text-cyan-200' : 'border-white/15 bg-white/[0.03] text-gray-300 hover:bg-white/10'}`}
            >
              {option}
            </button>
          )
        })}
      </div>
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  )
}
