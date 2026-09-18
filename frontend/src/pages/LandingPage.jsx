import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

/* ──────────────────────────────────────────────
   Respect the user's motion preference everywhere
────────────────────────────────────────────── */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const onChange = e => setReduced(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduced
}

/* Inject the Google Font once, in <head> — not as a <link> inside the body */
function useGoogleFont() {
  useEffect(() => {
    if (document.getElementById('cortexai-inter-font')) return
    const pre1 = document.createElement('link')
    pre1.rel = 'preconnect'
    pre1.href = 'https://fonts.googleapis.com'

    const pre2 = document.createElement('link')
    pre2.rel = 'preconnect'
    pre2.href = 'https://fonts.gstatic.com'
    pre2.crossOrigin = 'anonymous'

    const sheet = document.createElement('link')
    sheet.id = 'cortexai-inter-font'
    sheet.rel = 'stylesheet'
    sheet.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap'

    document.head.append(pre1, pre2, sheet)
  }, [])
}

/* ──────────────────────────────────────────────
   Logo mark — your original violet→cyan badge
────────────────────────────────────────────── */
function LogoMark({ size = 28 }) {
  return (
    <div
      aria-hidden="true"
      className="rounded-lg flex items-center justify-center flex-shrink-0"
      style={{
        width: size,
        height: size,
        background: 'linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)',
      }}
    >
      <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none">
        <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="white" strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M2 17l10 5 10-5"           stroke="white" strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M2 12l10 5 10-5"           stroke="white" strokeWidth="2.2" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

const NAV_LINKS = [
  { label: 'Features',     href: '#features'    },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Pricing',      href: '#pricing'      },
]

/* ──────────────────────────────────────────────
   NAVBAR
────────────────────────────────────────────── */
function Navbar({ onGetStarted }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    // Hysteresis (different on/off thresholds) stops the state from
    // flipping back and forth when the scroll position hovers near one value.
    const onScroll = () => {
      setScrolled(prev => {
        if (window.scrollY > 24) return true
        if (window.scrollY < 8) return false
        return prev
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = e => { if (e.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [menuOpen])

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 border-b backdrop-blur-md transition-colors duration-300 ${
        scrolled
          ? 'bg-[#080a10]/80 border-white/[0.06]'
          : 'bg-transparent border-transparent'
      }`}
    >
      <nav aria-label="Primary" className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 select-none rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400">
          <LogoMark size={28} />
          <span className="text-white font-semibold text-[15px] tracking-tight">
            Cortex<span className="text-violet-400">AI</span>
          </span>
        </a>

        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="px-3 py-1.5 rounded-md text-[13px] text-slate-400 hover:text-white hover:bg-white/[0.05] transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
            >
              {label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={onGetStarted}
            className="px-3 py-1.5 text-[13px] text-slate-400 hover:text-white transition-colors duration-150 cursor-pointer rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
          >
            Sign In
          </button>
          <button
            id="navbar-get-started"
            onClick={onGetStarted}
            className="px-3.5 py-1.5 rounded-lg text-[13px] font-medium text-white bg-violet-600 hover:bg-violet-500 transition-colors duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
          >
            Get Started
          </button>
        </div>

        <button
          className="md:hidden p-1.5 text-slate-400 hover:text-white cursor-pointer rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
          onClick={() => setMenuOpen(v => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </nav>

      {menuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden bg-[#0d0f18]/95 backdrop-blur-xl border-t border-white/[0.06] px-5 py-4 flex flex-col gap-1"
        >
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="py-2 text-sm text-slate-400 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 rounded-md"
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </a>
          ))}
          <div className="border-t border-white/[0.06] mt-3 pt-3 flex flex-col gap-2">
            <button
              onClick={() => { setMenuOpen(false); onGetStarted() }}
              className="py-2 text-sm text-slate-400 hover:text-white text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 rounded-md"
            >
              Sign In
            </button>
            <button
              onClick={() => { setMenuOpen(false); onGetStarted() }}
              className="py-2.5 rounded-lg text-sm font-medium text-white bg-violet-600 hover:bg-violet-500 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
            >
              Get Started Free
            </button>
          </div>
        </div>
      )}
    </header>
  )
}

/* ──────────────────────────────────────────────
   Live "thinking" panel — the hero's one bold moment
────────────────────────────────────────────── */
const THOUGHT_LINES = [
  'reading the question',
  'checking the relevant files',
  'drafting a response',
  'done — 1.2s',
]

function ThinkingPanel() {
  const reducedMotion = usePrefersReducedMotion()
  const [visible, setVisible] = useState(reducedMotion ? THOUGHT_LINES.length : 1)

  useEffect(() => {
    if (reducedMotion) { setVisible(THOUGHT_LINES.length); return }
    let i = 1
    const id = setInterval(() => {
      i = i >= THOUGHT_LINES.length ? 1 : i + 1
      setVisible(i)
    }, 950)
    return () => clearInterval(id)
  }, [reducedMotion])

  return (
    <div
      className="rounded-xl border border-white/[0.08] bg-[#0d0e18] p-5 w-full max-w-sm font-mono"
      aria-hidden="true"
    >
      <div className="flex items-center gap-1.5 mb-4">
        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-2 text-[11px] text-slate-500">CortexAI — thinking</span>
      </div>
      <div className="space-y-2 text-[13px] leading-relaxed" style={{ minHeight: 104 }}>
        {THOUGHT_LINES.slice(0, visible).map((line, i) => {
          const isLast = i === visible - 1
          return (
            <p key={line} className="text-slate-300">
              <span className="text-cyan-400">&gt;</span> {line}
              {isLast && !reducedMotion && (
                <span className="inline-block w-[6px] h-[13px] bg-violet-400 ml-1 align-middle animate-pulse" />
              )}
            </p>
          )
        })}
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────
   HERO
────────────────────────────────────────────── */
function Hero({ onGetStarted }) {
  const reducedMotion = usePrefersReducedMotion()
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    if (reducedMotion) { setMounted(true); return }
    const t = setTimeout(() => setMounted(true), 60)
    return () => clearTimeout(t)
  }, [reducedMotion])

  return (
    <section className="relative min-h-screen flex items-center px-5 pt-14 overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute -top-24 left-1/4 w-[600px] h-[420px] rounded-full blur-[140px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(124,58,237,0.14) 0%, transparent 70%)' }}
      />

      <div
        className="relative z-10 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-14 items-center transition-all duration-700"
        style={{ opacity: mounted ? 1 : 0, transform: mounted || reducedMotion ? 'translateY(0)' : 'translateY(16px)' }}
      >
        <div>
          <h1 className="text-[2.75rem] sm:text-6xl md:text-[4.5rem] font-bold text-white tracking-[-0.03em] leading-[1.05] mb-6 max-w-xl">
            Think Faster<br />
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(90deg, #a78bfa 0%, #67e8f9 100%)' }}
            >
              with CortexAI
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-md leading-relaxed mb-9">
            The AI workspace for thinking, building, and getting more done.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 items-start">
            <button
              id="hero-get-started"
              onClick={onGetStarted}
              className="group flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-violet-600 hover:bg-violet-500 transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
            >
              Start for Free
              <svg className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>

            <a
              href="#how-it-works"
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-slate-300 hover:text-white border border-white/[0.1] hover:border-white/[0.18] bg-white/[0.03] hover:bg-white/[0.05] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
            >
              See How It Works
            </a>
          </div>
        </div>

        <div className="flex justify-start lg:justify-end">
          <ThinkingPanel />
        </div>
      </div>
    </section>
  )
}

/* ──────────────────────────────────────────────
   PRODUCT PREVIEW
────────────────────────────────────────────── */
function CodeSnippet() {
  return (
    <div className="mt-3 rounded-md border border-white/[0.08] bg-[#0d0e18] overflow-hidden text-[11px] font-mono">
      <div className="flex items-center gap-1.5 px-3 py-1.5 border-b border-white/[0.06] bg-white/[0.02]">
        <span className="text-slate-500 text-[10px]">python</span>
      </div>
      <pre className="px-3 py-2.5 text-slate-300 leading-relaxed overflow-x-auto whitespace-pre">{`# Node A sends a message to Node B
def send_message(node_a, node_b, msg):
    envelope = {
        "from": node_a.id,
        "to": node_b.id,
        "data": msg,
        "ts": time.time(),
    }
    node_b.inbox.append(envelope)`}
      </pre>
    </div>
  )
}

const SIDEBAR_CHATS = [
  { label: 'Distributed Systems',    active: true  },
  { label: 'React performance tips', active: false },
  { label: 'SQL query optimizer',    active: false },
  { label: 'API design review',      active: false },
]

function ProductPreview() {
  const reducedMotion = usePrefersReducedMotion()
  const [mounted, setMounted] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (reducedMotion) { setMounted(true); return }
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setMounted(true); observer.disconnect() } },
      { threshold: 0.2 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [reducedMotion])

  return (
    <section className="relative py-20 px-5" ref={ref}>
      <div className="max-w-5xl mx-auto">
        <p className="text-center text-[11px] font-medium text-slate-500 tracking-widest uppercase mb-6">
          The Workspace
        </p>

        <div
          className="rounded-2xl overflow-hidden border border-white/[0.09] transition-all duration-700"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.98)',
            boxShadow: '0 40px 100px -20px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.05)',
          }}
        >
          <div className="flex items-center gap-2 px-4 h-9 bg-[#0c0d17] border-b border-white/[0.06]">
            <span aria-hidden="true" className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
            <span aria-hidden="true" className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
            <span aria-hidden="true" className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
            <div className="flex-1 flex justify-center">
              <div className="px-4 py-0.5 rounded-md bg-[#161826] border border-white/[0.06] text-[10px] text-slate-500 w-48 text-center truncate">
                app.cortexai.io
              </div>
            </div>
          </div>

          <div className="flex bg-[#0a0b13]" style={{ height: 460 }}>
            <aside className="hidden sm:flex flex-col w-52 flex-shrink-0 border-r border-white/[0.06] bg-[#0c0d18]">
              <div className="flex items-center justify-between px-3 h-11 border-b border-white/[0.06]">
                <div className="flex items-center gap-1.5">
                  <LogoMark size={18} />
                  <span className="text-white text-xs font-semibold">CortexAI</span>
                </div>
                <button
                  className="w-6 h-6 rounded-md flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/[0.06] transition-colors"
                  aria-label="New chat"
                  tabIndex={-1}
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
                <p className="px-2 pt-1 pb-1.5 text-[9px] font-semibold text-slate-600 uppercase tracking-wider">Recent</p>
                {SIDEBAR_CHATS.map(({ label, active }) => (
                  <div
                    key={label}
                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md cursor-pointer transition-colors duration-100 ${
                      active
                        ? 'bg-violet-600/20 text-slate-200'
                        : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.04]'
                    }`}
                  >
                    <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span className="text-[11px] truncate">{label}</span>
                  </div>
                ))}
              </div>

              <div className="p-2 border-t border-white/[0.06]">
                <div className="flex items-center gap-2 px-2 py-1.5 rounded-md">
                  <div aria-hidden="true" className="w-5 h-5 rounded-full bg-violet-600 flex items-center justify-center text-[8px] font-bold text-white">U</div>
                  <span className="text-[11px] text-slate-400 truncate">user@example.com</span>
                </div>
              </div>
            </aside>

            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex items-center justify-between px-4 h-11 border-b border-white/[0.06] bg-[#0a0b13]">
                <span className="text-white text-xs font-medium">Distributed Systems</span>
                <div className="px-2 py-0.5 rounded-md border border-white/[0.08] text-[10px] text-slate-500 flex items-center gap-1">
                  <span aria-hidden="true" className="w-1 h-1 rounded-full bg-emerald-400" />
                  CortexAI
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
                <div className="flex justify-end">
                  <div className="max-w-[75%] px-3 py-2 rounded-xl rounded-br-sm bg-violet-600/30 border border-violet-500/20 text-xs text-slate-200 leading-relaxed">
                    Can you explain how distributed systems handle node communication?
                  </div>
                </div>

                <div className="flex gap-2.5">
                  <div
                    aria-hidden="true"
                    className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5"
                    style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="white" strokeWidth="2.5" strokeLinejoin="round"/>
                      <path d="M2 12l10 5 10-5" stroke="white" strokeWidth="2.5" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-medium text-slate-500 mb-1">CortexAI</p>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      In distributed systems, nodes communicate through message-passing. Each node has an inbox and an outbox. Messages include sender ID, receiver ID, data payload, and a timestamp for ordering.
                    </p>
                    <CodeSnippet />
                    <p className="text-xs text-slate-400 leading-relaxed mt-2">
                      This ensures reliable delivery even when nodes temporarily disconnect. Want me to walk through consensus algorithms like Raft or Paxos next?
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-4 pb-4 pt-2">
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-white/[0.08] bg-[#0d0e18]">
                  <span className="flex-1 text-xs text-slate-600">Ask CortexAI anything…</span>
                  <button className="w-6 h-6 rounded-lg bg-violet-600/80 flex items-center justify-center flex-shrink-0" aria-label="Send message" tabIndex={-1}>
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ──────────────────────────────────────────────
   FEATURES  — a spec list, not a card grid
────────────────────────────────────────────── */
const FEATURES = [
  {
    title: 'Contextual Intelligence',
    desc:  'Understands conversation context and keeps interactions coherent across long sessions.',
  },
  {
    title: 'Code Generation',
    desc:  'Generate, explain, debug, and improve code. Get working solutions with clear explanations.',
  },
  {
    title: 'Data Analysis',
    desc:  'Work with structured data, ask questions in plain language, and extract useful insights.',
  },
  {
    title: 'Seamless Workflow',
    desc:  'Keep your work, conversations, and AI assistance together in one unified workspace.',
  },
]

function Features() {
  return (
    <section id="features" className="py-20 px-5" aria-labelledby="features-heading">
      <div className="max-w-3xl mx-auto">
        <div className="mb-12">
          <h2 id="features-heading" className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-3">
            Built for how you actually work
          </h2>
          <p className="text-slate-400 text-base max-w-lg">
            A focused set of capabilities designed around real workflows, not feature lists.
          </p>
        </div>

        <div className="border-t border-white/[0.08]">
          {FEATURES.map(({ title, desc }) => (
            <div
              key={title}
              className="grid grid-cols-1 sm:grid-cols-[1fr_1.6fr] gap-2 sm:gap-8 py-6 border-b border-white/[0.08]"
            >
              <h3 className="text-white font-semibold text-lg">{title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ──────────────────────────────────────────────
   HOW IT WORKS — a real sequence, so numbering earns its place
────────────────────────────────────────────── */
const STEPS = [
  { num: '01', title: 'Ask',        desc: 'Describe what you need in plain language.' },
  { num: '02', title: 'Understand', desc: 'CortexAI analyzes your context and intent.' },
  { num: '03', title: 'Create',     desc: 'Get answers, code, analysis, and ideas instantly.' },
]

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-5 border-t border-white/[0.05]" aria-labelledby="how-it-works-heading">
      <div className="max-w-5xl mx-auto">
        <div className="mb-14">
          <h2 id="how-it-works-heading" className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-3">
            How it works
          </h2>
          <p className="text-slate-400 text-base">Simple by design. Powerful in practice.</p>
        </div>

        <ol className="relative grid grid-cols-1 md:grid-cols-3 gap-10 list-none">
          <div aria-hidden="true" className="hidden md:block absolute top-3 left-0 right-0 h-px bg-violet-500/25" />
          {STEPS.map(({ num, title, desc }) => (
            <li key={num} className="relative flex flex-col gap-3">
              <span className="relative z-10 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono bg-[#080a11] border border-violet-500 text-violet-300">
                {num}
              </span>
              <h3 className="text-white font-semibold text-xl">{title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ──────────────────────────────────────────────
   PRICING
────────────────────────────────────────────── */
const PLANS = [
  {
    name:     'Free',
    price:    '$0',
    period:   '',
    desc:     'Get started at no cost.',
    features: ['Basic AI access', 'Limited daily usage', 'Core features'],
    cta:      'Get Started',
    highlight: false,
  },
  {
    name:     'Pro',
    price:    '$19',
    period:   '/month',
    desc:     'For individuals who want more.',
    features: ['Higher usage limits', 'Advanced features', 'Priority access'],
    cta:      'Start Pro',
    highlight: true,
  },
  {
    name:     'Enterprise',
    price:    'Custom',
    period:   '',
    desc:     'For teams and organisations.',
    features: ['Custom plans', 'Team collaboration', 'Contact sales'],
    cta:      'Contact Us',
    highlight: false,
  },
]

function Pricing({ onGetStarted }) {
  return (
    <section id="pricing" className="py-20 px-5 border-t border-white/[0.05]" aria-labelledby="pricing-heading">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h2 id="pricing-heading" className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-3">
            Simple pricing
          </h2>
          <p className="text-slate-400 text-base">No hidden fees. Cancel anytime.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PLANS.map(({ name, price, period, desc, features, cta, highlight }) => (
            <div
              key={name}
              className={`relative flex flex-col p-6 rounded-xl border transition-all duration-200 ${
                highlight
                  ? 'border-violet-500/40 bg-violet-500/[0.06]'
                  : 'border-white/[0.07] bg-white/[0.02] hover:border-white/[0.1]'
              }`}
            >
              {highlight && (
                <span className="absolute -top-3 left-6 px-2 py-0.5 rounded-full text-[10px] font-mono border border-violet-500/50 text-violet-300 bg-[#080a11]">
                  recommended
                </span>
              )}

              <div className="mb-5">
                <p className="text-xs font-semibold text-slate-400 mb-2">{name}</p>
                <div className="flex items-baseline gap-1 mb-1.5">
                  <span className="text-3xl font-bold text-white">{price}</span>
                  {period && <span className="text-slate-500 text-sm">{period}</span>}
                </div>
                <p className="text-slate-500 text-xs">{desc}</p>
              </div>

              <ul className="space-y-2.5 mb-6 flex-1">
                {features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-xs text-slate-400">
                    <svg className="w-3.5 h-3.5 text-violet-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={onGetStarted}
                className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 ${
                  highlight
                    ? 'bg-violet-600 hover:bg-violet-500 text-white'
                    : 'border border-white/[0.1] hover:border-white/[0.18] text-slate-300 hover:text-white bg-white/[0.03] hover:bg-white/[0.06]'
                }`}
              >
                {cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ──────────────────────────────────────────────
   FOOTER
────────────────────────────────────────────── */
const FOOTER_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing',  href: '#pricing'  },
  { label: 'GitHub',   href: '#'         },
  { label: 'Privacy',  href: '#'         },
]

function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-white/[0.05] py-10 px-5">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <LogoMark size={22} />
            <span className="text-white font-semibold text-sm">
              Cortex<span className="text-violet-400">AI</span>
            </span>
          </div>
          <p className="text-slate-600 text-xs leading-relaxed max-w-[220px]">
            An AI workspace for thinking and building faster.
          </p>
        </div>

        <nav aria-label="Footer" className="flex flex-col sm:flex-row sm:items-center gap-x-6 gap-y-2">
          {FOOTER_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="text-slate-500 hover:text-slate-300 text-xs transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 rounded-md"
            >
              {label}
            </a>
          ))}
        </nav>
      </div>

      <div className="max-w-5xl mx-auto mt-8 pt-6 border-t border-white/[0.04]">
        <p className="text-slate-700 text-xs">© {year} CortexAI</p>
      </div>
    </footer>
  )
}

/* ──────────────────────────────────────────────
   ROOT EXPORT
────────────────────────────────────────────── */
export default function LandingPage() {
  const navigate = useNavigate()
  const goToAuth = useCallback(() => navigate('/auth'), [navigate])

  useGoogleFont()

  return (
    <div
      className="bg-[#080a11] min-h-screen text-white"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <Navbar onGetStarted={goToAuth} />
      <main>
        <Hero onGetStarted={goToAuth} />
        <ProductPreview />
        <Features />
        <HowItWorks />
        <Pricing onGetStarted={goToAuth} />
      </main>
      <Footer />
    </div>
  )
}