import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Plane, Map, LayoutDashboard } from 'lucide-react'
import LangSwitch from './LangSwitch'
import { getT } from '../../i18n/index.js'

export default function NavBar({ currentStep, onNavigate, lang, onChangeLang }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const t = (key) => getT(lang || 'en', key)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const navLinks = [
    { label: t('nav.planTrip'),  icon: Plane,           action: () => onNavigate(1) },
    { label: t('nav.explore'),   icon: Map,             action: () => onNavigate(5) },
    { label: t('nav.dashboard'), icon: LayoutDashboard, action: () => onNavigate(6) },
  ]

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        transition: 'all 0.5s ease',
      }}
      className={scrolled ? 'navbar-glass shadow-lg shadow-black/20' : ''}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', height: '64px',
        }}>

          {/* Logo */}
          <motion.button
            onClick={() => onNavigate(1)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              background: 'none', border: 'none', cursor: 'pointer',
            }}
          >
            <div
              className="animate-pulse-glow"
              style={{
                width: '36px', height: '36px', borderRadius: '12px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '18px',
                background: 'linear-gradient(135deg,#7c3aed,#2563eb)',
              }}
            >
              🌍
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
              <span style={{
                fontSize: '16px', fontWeight: '800',
                background: 'linear-gradient(135deg,#a78bfa,#60a5fa)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                {t('nav.brand')}
              </span>
              <span
                className="hidden sm:block"
                style={{
                  fontSize: '8px', color: 'rgba(255,255,255,0.3)',
                  fontWeight: '600', letterSpacing: '0.08em',
                }}
              >
                {t('nav.tagline')}
              </span>
            </div>
          </motion.button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex" style={{ alignItems: 'center', gap: '4px' }}>
            {navLinks.map(link => {
              const Icon = link.icon
              return (
                <motion.button
                  key={link.label}
                  onClick={link.action}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '7px',
                    padding: '8px 16px', borderRadius: '12px',
                    fontSize: '13px', fontWeight: '500',
                    color: 'rgba(255,255,255,0.58)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontFamily: 'Poppins, sans-serif',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                >
                  <Icon size={14} />
                  {link.label}
                </motion.button>
              )
            })}
          </nav>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>

            {/* Language Switcher */}
            <LangSwitch
              currentLang={lang || 'en'}
              onChangeLang={onChangeLang}
            />

            {/* CTA */}
            <motion.button
              onClick={() => onNavigate(1)}
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary hidden sm:flex"
              style={{ padding: '9px 20px', fontSize: '13px' }}
            >
              <Plane size={13} />
              {t('nav.startBtn')}
            </motion.button>

            {/* Mobile toggle */}
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="md:hidden"
              style={{
                width: '36px', height: '36px', borderRadius: '12px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(255,255,255,0.07)',
                border: 'none', cursor: 'pointer',
              }}
            >
              {menuOpen
                ? <X size={17} style={{ color: 'rgba(255,255,255,0.7)' }} />
                : <Menu size={17} style={{ color: 'rgba(255,255,255,0.7)' }} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden navbar-glass"
            style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
          >
            <div style={{ padding: '12px 16px 16px' }}>
              {navLinks.map(link => {
                const Icon = link.icon
                return (
                  <button
                    key={link.label}
                    onClick={() => { link.action(); setMenuOpen(false) }}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center',
                      gap: '12px', padding: '12px 16px', borderRadius: '12px',
                      fontSize: '14px', fontWeight: '500',
                      color: 'rgba(255,255,255,0.65)',
                      background: 'none', border: 'none', cursor: 'pointer',
                      textAlign: 'left', fontFamily: 'Poppins, sans-serif',
                      marginBottom: '4px',
                    }}
                  >
                    <Icon size={15} />
                    {link.label}
                  </button>
                )
              })}
              <motion.button
                onClick={() => { onNavigate(1); setMenuOpen(false) }}
                className="btn-primary w-full"
                style={{ marginTop: '8px', padding: '12px', justifyContent: 'center' }}
              >
                <Plane size={14} />
                {t('nav.startBtn')}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}