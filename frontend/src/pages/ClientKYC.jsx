import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Upload, X, CheckCircle, Send, Camera } from 'lucide-react'
import { apiRequest } from '../services/api'

export default function ClientKYC() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [verificationStatus, setVerificationStatus] = useState(null)
  const [idFrontPreview, setIdFrontPreview] = useState('')
  const [idBackPreview, setIdBackPreview] = useState('')
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const frontInputRef = useRef(null)
  const backInputRef = useRef(null)

  const [personalInfo, setPersonalInfo] = useState({
    idType: '',
    idNumber: '',
    dateOfBirth: '',
    firstName: '',
    lastName: '',
    country: '',
  })

  const [existingDocs, setExistingDocs] = useState({ idFront: false, idBack: false })

  useEffect(() => {
    loadVerificationStatus()
  }, [])

  const loadVerificationStatus = async () => {
    try {
      const res = await apiRequest('/client/summary')
      setVerificationStatus(res.verificationStatus)
      setExistingDocs({
        idFront: !!res.idFront,
        idBack: !!res.idBack,
      })
      if (res.profile) {
        setPersonalInfo({
          idType: res.profile.idType || '',
          idNumber: res.profile.idNumber || '',
          dateOfBirth: res.profile.dateOfBirth || '',
          firstName: res.profile.firstName || '',
          lastName: res.profile.lastName || '',
          country: res.profile.country || '',
        })
      }
    } catch (err) {
      console.error('Failed to load status:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = async (e, side) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validTypes = ['image/jpeg', 'image/png', 'image/jpg']
    if (!validTypes.includes(file.type)) {
      setMessage('Please upload a valid image (JPG, PNG)')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage('File size must be less than 5MB')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      if (side === 'front') setIdFrontPreview(reader.result)
      else setIdBackPreview(reader.result)
      setMessage('')
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async () => {
    if (!idFrontPreview || !idBackPreview) {
      setMessage('Please upload both ID front and back images')
      return
    }

    if (!personalInfo.idType || !personalInfo.idNumber || !personalInfo.dateOfBirth) {
      setMessage('Please fill in all required fields: ID Type, ID Number, Date of Birth')
      return
    }

    setUploading(true)
    setMessage('')

    try {
      const uploadFront = async () => {
        await apiRequest('/client/upload-id-front', {
          method: 'POST',
          body: JSON.stringify({ idFront: idFrontPreview }),
        })
      }

      const uploadBack = async () => {
        await apiRequest('/client/upload-id-back', {
          method: 'POST',
          body: JSON.stringify({ idBack: idBackPreview }),
        })
      }

      const updateInfo = async () => {
        await apiRequest('/client/kyc-info', {
          method: 'POST',
          body: JSON.stringify({
            idType: personalInfo.idType,
            idNumber: personalInfo.idNumber,
            dateOfBirth: personalInfo.dateOfBirth,
          }),
        })
      }

      await Promise.all([uploadFront(), uploadBack(), updateInfo()])
      
      setMessage('Documents uploaded successfully!')
      
      await apiRequest('/client/submit-kyc', { method: 'POST' })
      setSubmitted(true)
      
      setTimeout(() => {
        navigate('/dashboard')
      }, 2000)
    } catch (err) {
      setMessage(err.message || 'Failed to submit')
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090910] text-white flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    )
  }

  const isVerified = verificationStatus === 'verified'
  const isPending = verificationStatus === 'pending' && (existingDocs.idFront || existingDocs.idBack)
  const hasBothDocs = idFrontPreview && idBackPreview

  return (
    <div className="min-h-screen bg-[#090910] pt-28 pb-16 px-3 sm:px-4">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-2 text-gray-300 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#141421] via-[#10101a] to-[#0d0d15] p-5 sm:p-7"
        >
          <div className="pointer-events-none absolute -top-28 right-[-80px] w-72 h-72 bg-cyan-500/12 rounded-full blur-[110px]" />
          <div className="pointer-events-none absolute -bottom-24 left-[-90px] w-72 h-72 bg-indigo-500/12 rounded-full blur-[110px]" />

          <div className="relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/15 border border-cyan-400/25 flex items-center justify-center">
                {isVerified ? (
                  <CheckCircle className="w-6 h-6 text-emerald-300" />
                ) : (
                  <Upload className="w-6 h-6 text-cyan-300" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">KYC Verification</h1>
                <p className="text-sm text-gray-400 mt-1">
                  {isVerified 
                    ? 'Your account is verified' 
                    : isPending 
                      ? 'Your documents are under review' 
                      : 'Complete your KYC verification'}
                </p>
              </div>
            </div>

            {verificationStatus === 'rejected' && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/15 border border-red-400/30">
                <p className="text-sm text-red-200">
                  <span className="font-semibold">Your KYC was rejected. </span>
                  Please re-upload your documents for verification.
                </p>
              </div>
            )}

            {verificationStatus === 'documents_requested' && (
              <div className="mb-6 p-4 rounded-xl bg-amber-500/15 border border-amber-400/30">
                <p className="text-sm text-amber-200">
                  <span className="font-semibold">Documents requested. </span>
                  Please upload your identification documents.
                </p>
              </div>
            )}

            {submitted && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-500/15 border border-emerald-400/30">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-emerald-300" />
                  <div>
                    <p className="text-sm font-semibold text-emerald-200">
                      Thanks for submitting your KYC!
                    </p>
                    <p className="text-xs text-emerald-100/70 mt-1">
                      Redirecting to dashboard...
                    </p>
                  </div>
                </div>
              </div>
            )}

            {isVerified ? (
              <div className="text-center py-8">
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-emerald-300" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Account Verified</h3>
                <p className="text-gray-400">Your KYC verification is complete. You have full access to all features.</p>
              </div>
            ) : isPending ? (
              <div className="text-center py-8">
                <div className="w-20 h-20 rounded-full bg-amber-500/20 border border-amber-400/30 flex items-center justify-center mx-auto mb-4">
                  <Send className="w-10 h-10 text-amber-300" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">KYC Submitted</h3>
                <p className="text-gray-400">Thanks for submitting your KYC! Our admin will review and approve your request shortly.</p>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  <h3 className="text-lg font-semibold text-white">Personal Information</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">First Name *</label>
                      <input
                        type="text"
                        value={personalInfo.firstName}
                        onChange={(e) => setPersonalInfo({...personalInfo, firstName: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0a0a0f] border border-white/[0.12] text-white focus:outline-none focus:border-cyan-500"
                        placeholder="First Name"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Last Name *</label>
                      <input
                        type="text"
                        value={personalInfo.lastName}
                        onChange={(e) => setPersonalInfo({...personalInfo, lastName: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0a0a0f] border border-white/[0.12] text-white focus:outline-none focus:border-cyan-500"
                        placeholder="Last Name"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Country *</label>
                      <input
                        type="text"
                        value={personalInfo.country}
                        onChange={(e) => setPersonalInfo({...personalInfo, country: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0a0a0f] border border-white/[0.12] text-white focus:outline-none focus:border-cyan-500"
                        placeholder="Country"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Date of Birth *</label>
                      <input
                        type="date"
                        value={personalInfo.dateOfBirth}
                        onChange={(e) => setPersonalInfo({...personalInfo, dateOfBirth: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0a0a0f] border border-white/[0.12] text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">ID Type *</label>
                      <select
                        value={personalInfo.idType}
                        onChange={(e) => setPersonalInfo({...personalInfo, idType: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0a0a0f] border border-white/[0.12] text-white focus:outline-none focus:border-cyan-500"
                      >
                        <option value="">Select ID Type</option>
                        <option value="passport">Passport</option>
                        <option value="national_id">National ID</option>
                        <option value="drivers_license">Driver's License</option>
                        <option value="voter_id">Voter ID</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">ID Number *</label>
                      <input
                        type="text"
                        value={personalInfo.idNumber}
                        onChange={(e) => setPersonalInfo({...personalInfo, idNumber: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0a0a0f] border border-white/[0.12] text-white focus:outline-none focus:border-cyan-500"
                        placeholder="ID Number"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <h3 className="text-lg font-semibold text-white">ID Document Photos</h3>
                  <p className="text-sm text-gray-400">
                    Upload clear photos of your identification document. You can take a photo with your camera or upload from gallery.
                  </p>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-[#0a0a0f] border border-white/[0.08]">
                      <label className="text-sm text-gray-300 mb-2 block">ID Front *</label>
                      {idFrontPreview ? (
                        <div className="relative">
                          <img src={idFrontPreview} alt="ID Front" className="w-full h-48 object-cover rounded-lg" />
                          <button 
                            onClick={() => { setIdFrontPreview(''); setMessage('') }} 
                            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500/80 text-white flex items-center justify-center"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <div className="mt-2 text-xs text-emerald-400 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> Uploaded successfully
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-white/20 rounded-lg">
                          <Camera className="w-10 h-10 text-gray-500 mb-2" />
                          <span className="text-sm text-gray-400">ID Front</span>
                          <span className="text-xs text-gray-500 mt-1">Take photo or upload</span>
                          <input 
                            ref={frontInputRef}
                            type="file" 
                            accept="image/*"
                            capture="environment"
                            className="hidden" 
                            onChange={(e) => handleFileSelect(e, 'front')} 
                          />
                          <button 
                            onClick={() => frontInputRef.current?.click()}
                            className="mt-3 px-4 py-2 text-sm bg-cyan-500/20 text-cyan-300 rounded-lg border border-cyan-400/30 hover:bg-cyan-500/30"
                          >
                            Camera / Upload
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="p-4 rounded-xl bg-[#0a0a0f] border border-white/[0.08]">
                      <label className="text-sm text-gray-300 mb-2 block">ID Back *</label>
                      {idBackPreview ? (
                        <div className="relative">
                          <img src={idBackPreview} alt="ID Back" className="w-full h-48 object-cover rounded-lg" />
                          <button 
                            onClick={() => { setIdBackPreview(''); setMessage('') }} 
                            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500/80 text-white flex items-center justify-center"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <div className="mt-2 text-xs text-emerald-400 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> Uploaded successfully
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-white/20 rounded-lg">
                          <Camera className="w-10 h-10 text-gray-500 mb-2" />
                          <span className="text-sm text-gray-400">ID Back</span>
                          <span className="text-xs text-gray-500 mt-1">Take photo or upload</span>
                          <input 
                            ref={backInputRef}
                            type="file" 
                            accept="image/*"
                            capture="environment"
                            className="hidden" 
                            onChange={(e) => handleFileSelect(e, 'back')} 
                          />
                          <button 
                            onClick={() => backInputRef.current?.click()}
                            className="mt-3 px-4 py-2 text-sm bg-cyan-500/20 text-cyan-300 rounded-lg border border-cyan-400/30 hover:bg-cyan-500/30"
                          >
                            Camera / Upload
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {message && !submitted && (
                  <p className={`text-sm mt-4 ${message.includes('success') ? 'text-emerald-400' : 'text-red-400'}`}>
                    {message}
                  </p>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={!hasBothDocs || uploading || submitted || !personalInfo.idType || !personalInfo.idNumber || !personalInfo.dateOfBirth}
                  className={`mt-6 w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                    hasBothDocs && !submitted && !uploading && personalInfo.idType && personalInfo.idNumber && personalInfo.dateOfBirth
                      ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white hover:from-indigo-500 hover:to-cyan-400'
                      : 'bg-white/10 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {uploading ? (
                    'Uploading...'
                  ) : submitted ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Submitted Successfully
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Submit KYC
                    </>
                  )}
                </button>

                {!hasBothDocs && !submitted && (
                  <p className="text-xs text-center text-gray-500 mt-3">
                    Please upload both ID front and back images and fill all required fields to submit
                  </p>
                )}
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
