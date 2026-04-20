'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ── Pac-Man loading bar canvas ── */
function PacManBar({ onComplete }: { onComplete: () => void }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const W = canvas.width = 480
    const H = canvas.height = 48
    const TRACK_Y = H / 2
    const SPEED = 2.2
    const R = 14

    // dots
    const dots: { x: number; eaten: boolean }[] = []
    for (let x = R * 2 + 8; x < W - R; x += 22) dots.push({ x, eaten: false })

    let pacX = -R
    let mouth = 0.05
    let mDir = 1
    let raf: number
    let done = false

    const draw = () => {
      ctx.clearRect(0, 0, W, H)

      // track line
      ctx.strokeStyle = 'rgba(124,58,237,0.2)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(R, TRACK_Y)
      ctx.lineTo(W - R, TRACK_Y)
      ctx.stroke()

      // dots
      dots.forEach((d, i) => {
        if (d.eaten) return
        const big = i % 5 === 0
        ctx.beginPath()
        ctx.arc(d.x, TRACK_Y, big ? 4 : 2.5, 0, Math.PI * 2)
        ctx.fillStyle = big ? '#fff' : 'rgba(255,255,255,0.4)'
        if (big) { ctx.shadowColor = '#fff'; ctx.shadowBlur = 6 }
        ctx.fill()
        ctx.shadowBlur = 0
      })

      // eat dots
      dots.forEach(d => { if (!d.eaten && Math.abs(d.x - pacX) < R) d.eaten = true })

      // pac-man
      mouth += 0.12 * mDir
      if (mouth > 0.42 || mouth < 0.04) mDir *= -1
      ctx.beginPath()
      ctx.moveTo(pacX, TRACK_Y)
      ctx.arc(pacX, TRACK_Y, R, mouth, Math.PI * 2 - mouth)
      ctx.closePath()
      ctx.fillStyle = '#FFE000'
      ctx.shadowColor = 'rgba(255,224,0,0.5)'
      ctx.shadowBlur = 12
      ctx.fill()
      ctx.shadowBlur = 0

      // eye
      ctx.beginPath()
      ctx.arc(pacX + R * 0.25, TRACK_Y - R * 0.45, R * 0.1, 0, Math.PI * 2)
      ctx.fillStyle = '#111'
      ctx.fill()

      pacX += SPEED
      if (pacX > W + R && !done) {
        done = true
        cancelAnimationFrame(raf)
        onComplete()
        return
      }
      raf = requestAnimationFrame(draw)
    }

    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [onComplete])

  return (
    <canvas
      ref={ref}
      style={{ width: 480, height: 48, maxWidth: '90vw' }}
    />
  )
}

/* ── Pixel-style scanlines ── */
function Scanlines() {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{
      backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.15) 3px, rgba(0,0,0,0.15) 4px)',
      zIndex: 2,
    }} />
  )
}

/* ── Main ── */
export default function IntroScreen() {
  const [phase, setPhase] = useState<'enter' | 'pac' | 'exit'>('enter')
  const [gone, setGone] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    window.scrollTo(0, 0)
    const t = setTimeout(() => setPhase('pac'), 1400)
    return () => {
      clearTimeout(t)
      document.body.style.overflow = ''
    }
  }, [])

  const handlePacDone = () => {
    setPhase('exit')
    document.body.style.overflow = ''
    window.scrollTo(0, 0)
    setTimeout(() => setGone(true), 900)
  }

  if (gone) return null

  return (
    <AnimatePresence>
      <motion.div
        key="intro"
        initial={{ opacity: 1 }}
        animate={phase === 'exit' ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
        className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden select-none"
        style={{ zIndex: 9999, background: '#050508' }}
      >
        {/* Grid */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `linear-gradient(rgba(124,58,237,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(124,58,237,0.05) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }} />

        {/* Radial glow */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 55% 45% at 50% 50%, rgba(124,58,237,0.1) 0%, transparent 70%)',
        }} />

        <Scanlines />

        {/* Corner HUD brackets */}
        {[
          { style: { top: '1.2rem', left: '1.2rem' }, r: 0 },
          { style: { top: '1.2rem', right: '1.2rem' }, r: 90 },
          { style: { bottom: '1.2rem', left: '1.2rem' }, r: 270 },
          { style: { bottom: '1.2rem', right: '1.2rem' }, r: 180 },
        ].map(({ style, r }, i) => (
          <motion.div
            key={i}
            className="absolute w-7 h-7"
            style={{ ...style, zIndex: 10 }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + i * 0.08, type: 'spring', stiffness: 300 }}
          >
            <svg viewBox="0 0 28 28" fill="none" style={{ transform: `rotate(${r}deg)` }}>
              <path d="M2 26 L2 2 L26 2" stroke="rgba(124,58,237,0.55)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </motion.div>
        ))}

        {/* INSERT COIN blink */}
        <motion.p
          className="absolute top-6 text-[10px] font-bold tracking-[0.3em] uppercase"
          style={{ color: 'rgba(124,58,237,0.6)', fontFamily: 'monospace' }}
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          ✦ INSERT COIN ✦
        </motion.p>

        {/* Main content */}
        <div className="relative z-10 flex flex-col items-center gap-6">

          {/* Logo */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotateY: -90 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <motion.div
              animate={{ rotateY: [0, 360] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Rounded square with gradient bg + gamepad icon */}
              <svg width="96" height="96" viewBox="0 0 96 96">
                <defs>
                  <linearGradient id="sqg" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7c3aed" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                  <filter id="cglow">
                    <feGaussianBlur stdDeviation="4" result="b" />
                    <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                </defs>
                {/* Rounded square bg */}
                <rect x="4" y="4" width="88" height="88" rx="22" ry="22"
                  fill="url(#sqg)" />
                {/* Gamepad body */}
                <g filter="url(#cglow)" transform="translate(48,48)">
                  {/* Controller body — grips down */}
                  <path
                    d="M-24,-10 Q-26,-16 -16,-16 L-8,-16 L-6,-12 L6,-12 L8,-16 L16,-16 Q26,-16 24,-10 L20,6 Q18,14 10,15 L6,15 L4,10 L-4,10 L-6,15 L-10,15 Q-18,14 -20,6 Z"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.8"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                  {/* D-pad left side */}
                  <rect x="-21" y="-3" width="9" height="3" rx="1" fill="white" />
                  <rect x="-18" y="-6" width="3" height="9" rx="1" fill="white" />
                  {/* Buttons right side */}
                  <circle cx="15" cy="-5" r="2" fill="white" />
                  <circle cx="9" cy="-2" r="1.5" fill="white" />
                  {/* Center sparkle star */}
                  <path d="M0,-8 L1,-5 L4,-5 L2,-3 L3,0 L0,-2 L-3,0 L-2,-3 L-4,-5 L-1,-5 Z" fill="white" opacity="0.95" />
                </g>
              </svg>
            </motion.div>
            {/* Orbit ring */}
            <motion.div
              className="absolute rounded-full"
              style={{ inset: '-8px', border: '1px solid rgba(124,58,237,0.35)' }}
              animate={{ rotate: 360 }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
            />
            {/* Glow */}
            <div className="absolute inset-0 rounded-3xl blur-2xl pointer-events-none"
              style={{ background: 'rgba(124,58,237,0.35)' }} />
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center"
          >
            <h1
              className="text-5xl font-black tracking-tight leading-none mb-2"
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #a78bfa 40%, #06b6d4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 30px rgba(124,58,237,0.5))',
                fontFamily: 'system-ui',
              }}
            >
              PIXEL VERSE
            </h1>
            <p className="text-[9px] tracking-[0.35em] uppercase font-medium"
              style={{ color: 'rgba(124,58,237,0.6)', fontFamily: 'monospace' }}>
              LEVEL 01 · GAME DISCOVERY
            </p>
          </motion.div>

          {/* Mario bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={phase === 'pac' ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center gap-2"
          >
            {phase === 'pac' && <PacManBar onComplete={handlePacDone} />}
            <p className="text-[8px] tracking-[0.25em] uppercase"
              style={{ color: 'rgba(255,255,255,0.2)', fontFamily: 'monospace' }}>
              LOADING GAME DATA...
            </p>
          </motion.div>
        </div>

        {/* Bottom version */}
        <p className="absolute bottom-5 text-[8px] tracking-widest uppercase"
          style={{ color: 'rgba(255,255,255,0.1)', fontFamily: 'monospace' }}>
          © 2025 PIXEL VERSE · V1.0.0
        </p>
      </motion.div>
    </AnimatePresence>
  )
}
