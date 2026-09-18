import React, { useState } from 'react'
import { signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '../../utils/firebase'
import api from '../../utils/axios'
import { FcGoogle } from 'react-icons/fc'
import { useDispatch } from 'react-redux'
import { setUserdata } from '../redux/userSlice'
import { useNavigate } from 'react-router-dom'

function GlowOrb({ className }) {
  return <div className={`absolute rounded-full blur-[120px] pointer-events-none ${className}`} />
}

export default function AuthPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleLogin = async (token) => {
    try {
      const { data } = await api.post('/api/auth/login', { token })
      dispatch(setUserdata(data))
      navigate('/app')
    } catch (err) {
      console.error(err)
      setError('Authentication failed. Please try again.')
    }
  }

  const googleLogin = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const token = await result.user.getIdToken()
      await handleLogin(token)
    } catch (err) {
      console.error(err)
      setError('Sign-in was cancelled or failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#07080d]"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Google Font */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

      {/* Background orbs */}
      <GlowOrb className="w-[600px] h-[600px] bg-violet-600/20 -top-40 -left-40" />
      <GlowOrb className="w-[500px] h-[500px] bg-cyan-500/15 -bottom-40 -right-40" />

      {/* Grid */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Back button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 flex items-center gap-2 text-slate-500 hover:text-white text-sm font-medium transition-colors duration-200 cursor-pointer group"
      >
        <svg className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to home
      </button>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Card glow border */}
        <div className="absolute -inset-px rounded-3xl bg-gradient-to-b from-violet-500/30 via-transparent to-cyan-500/20 pointer-events-none" />

        <div className="relative bg-[#0d0e16] border border-white/[0.08] rounded-3xl p-8 shadow-2xl shadow-black/50">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-violet-500/40 mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
                <path d="M2 17l10 5 10-5" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
                <path d="M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Welcome to Cortex<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">AI</span>
            </h1>
            <p className="text-slate-500 text-sm mt-1.5 text-center">
              Sign in to unlock the full power of AI
            </p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="text-slate-600 text-xs font-medium">Continue with</span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          {/* Google button */}
          <button
            id="google-signin-btn"
            onClick={googleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed border border-white/10 bg-white/[0.04] hover:bg-white/[0.07] hover:border-white/20 text-white"
          >
            {loading ? (
              <svg className="w-5 h-5 animate-spin text-violet-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
            ) : (
              <FcGoogle size={20} />
            )}
            {loading ? 'Signing in...' : 'Continue with Google'}
          </button>

          {/* Error */}
          {error && (
            <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">
              {error}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
