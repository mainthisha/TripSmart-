import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, ChevronDown } from 'lucide-react'

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧', native: 'English' },
  { code: 'ta', label: 'Tamil',   flag: '🇮🇳', native: 'தமிழ்'   },
  { code: 'hi', label: 'Hindi',   flag: '🇮🇳', native: 'हिंदी'   },
]

export default function LangSwitch({ currentLang, onChangeLang }) {
  const [open, setOpen] = useState(false)
  const current = LANGUAGES.find(l => l.code === currentLang) || LANGUAGES[0]

  return (
    <div style={{ position: 'relative', zIndex: 100 }}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: '7px',
          padding: '8px 14px', borderRadius: '12px',
          background: 'rgba(255,255,255,0.07)',
          border: '1px solid rgba(255,255,255,0.12)',
          color: 'rgba(255,255,255,0.75)',
          cursor: 'pointer', fontSize: '13px', fontFamily: 'Poppins, sans-serif',
        }}
      >
        <Globe size={14} style={{ color: '#a78bfa' }} />
        <span style={{ fontSize: '16px' }}>{current.flag}</span>
        <span className="hidden sm:block">{current.native}</span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={12} style={{ color: 'rgba(255,255,255,0.4)' }} />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <div
              style={{ position: 'fixed', inset: 0, zIndex: 98 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.18 }}
              style={{
                position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                minWidth: '160px', zIndex: 99,
                background: 'rgba(14,10,40,0.97)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '16px', overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              }}
            >
              {LANGUAGES.map((lang, i) => (
                <motion.button
                  key={lang.code}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => { onChangeLang(lang.code); setOpen(false) }}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center',
                    gap: '10px', padding: '12px 16px',
                    background: currentLang === lang.code
                      ? 'rgba(124,58,237,0.25)' : 'transparent',
                    color: currentLang === lang.code
                      ? 'rgba(196,181,253,1)' : 'rgba(255,255,255,0.65)',
                    border: 'none',
                    borderBottom: i < LANGUAGES.length - 1
                      ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    cursor: 'pointer', textAlign: 'left',
                    fontFamily: 'Poppins, sans-serif', fontSize: '13px',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => {
                    if (currentLang !== lang.code)
                      e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                  }}
                  onMouseLeave={e => {
                    if (currentLang !== lang.code)
                      e.currentTarget.style.background = 'transparent'
                  }}
                >
                  <span style={{ fontSize: '20px' }}>{lang.flag}</span>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '13px' }}>{lang.native}</div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>{lang.label}</div>
                  </div>
                  {currentLang === lang.code && (
                    <motion.span
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      style={{ marginLeft: 'auto', color: '#a78bfa', fontSize: '14px' }}
                    >
                      ✓
                    </motion.span>
                  )}
                </motion.button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}