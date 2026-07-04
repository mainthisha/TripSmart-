import { motion } from 'framer-motion'
import { Plane, MapPin, Star, Sparkles, ArrowRight, Globe, Compass } from 'lucide-react'
import { getT } from '../../i18n/index.js'

const FLOATING_ICONS = [
  { icon: '✈️', size: '32px', x: '6%',  y: '18%', delay: 0,   duration: 6  },
  { icon: '🗺️', size: '26px', x: '88%', y: '14%', delay: 1,   duration: 7  },
  { icon: '🏔️', size: '30px', x: '4%',  y: '62%', delay: 2,   duration: 8  },
  { icon: '🌴', size: '24px', x: '91%', y: '58%', delay: 0.5, duration: 9  },
  { icon: '⭐', size: '20px', x: '78%', y: '78%', delay: 1.5, duration: 6  },
  { icon: '🧭', size: '24px', x: '14%', y: '82%', delay: 3,   duration: 7  },
  { icon: '📸', size: '20px', x: '50%', y: '86%', delay: 2.5, duration: 8  },
  { icon: '🌊', size: '24px', x: '68%', y: '22%', delay: 1,   duration: 10 },
  { icon: '🏝️', size: '22px', x: '30%', y: '10%', delay: 3.5, duration: 7  },
  { icon: '🎒', size: '20px', x: '95%', y: '35%', delay: 2,   duration: 8  },
]

export default function WelcomePage({ onStartPlanning, onExplore, lang }) {
  const t = (key) => getT(lang || 'en', key)

  const STATS = [
    { value: '500+', label: t('hero.stat1'), icon: Globe    },
    { value: '50K+', label: t('hero.stat2'), icon: Compass  },
    { value: '4.9★', label: t('hero.stat3'), icon: Star     },
    { value: 'AI',   label: t('hero.stat4'), icon: Sparkles },
  ]

  return (
    <div
      className="hero-bg"
      style={{
        width: '100%', minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden', position: 'relative',
        paddingTop: '80px', paddingBottom: '40px',
      }}
    >
      {/* Floating icons */}
      {FLOATING_ICONS.map((item, i) => (
        <motion.div key={i}
          style={{
            position: 'absolute', left: item.x, top: item.y,
            fontSize: item.size, userSelect: 'none',
            pointerEvents: 'none', opacity: 0.18,
          }}
          animate={{ y: [0, -18, 0], rotate: [0, i%2===0?8:-8, 0], opacity: [0.12,0.28,0.12] }}
          transition={{ duration: item.duration, repeat: Infinity, delay: item.delay, ease: 'easeInOut' }}
        >
          {item.icon}
        </motion.div>
      ))}

      {/* Orbs */}
      <div style={{
        position: 'absolute', top: '25%', left: '25%',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,58,237,0.14) 0%, transparent 70%)',
        filter: 'blur(60px)', animation: 'floatOrb 10s ease-in-out infinite',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '25%', right: '25%',
        width: '350px', height: '350px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(37,99,235,0.1) 0%, transparent 70%)',
        filter: 'blur(80px)', animation: 'floatOrb 14s ease-in-out infinite reverse',
        pointerEvents: 'none',
      }} />

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 10, textAlign: 'center',
        padding: '0 20px', maxWidth: '900px', width: '100%', margin: '0 auto',
      }}>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }} style={{ marginBottom: '32px' }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '10px 20px', borderRadius: '50px',
            background: 'rgba(124,58,237,0.14)',
            border: '1px solid rgba(124,58,237,0.28)',
            color: 'rgba(196,181,253,0.95)',
            fontSize: '13px', fontWeight: '500', backdropFilter: 'blur(10px)',
          }}>
            <Sparkles size={14} style={{ color: '#a78bfa' }} />
            <span>{t('hero.badge')}</span>
            <span style={{
              width: '7px', height: '7px', borderRadius: '50%',
              background: '#4ade80', display: 'inline-block',
            }} />
          </div>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }} style={{ marginBottom: '24px' }}
        >
          <h1 style={{
            fontSize: 'clamp(42px,7vw,80px)', fontWeight: '900',
            lineHeight: 1.1, letterSpacing: '-0.02em',
          }}>
            <span style={{ color: '#ffffff', display: 'block' }}>{t('hero.line1')}</span>
            <motion.span
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              style={{
                display: 'block',
                background: 'linear-gradient(135deg,#a78bfa 0%,#60a5fa 50%,#34d399 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {t('hero.line2')}
            </motion.span>
            <motion.span
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45, duration: 0.6 }}
              style={{
                display: 'block',
                background: 'linear-gradient(135deg,#fb923c 0%,#f97316 40%,#ef4444 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {t('hero.line3')}
            </motion.span>
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          style={{
            fontSize: 'clamp(15px,2vw,19px)',
            color: 'rgba(255,255,255,0.52)',
            maxWidth: '580px', margin: '0 auto 40px',
            lineHeight: 1.65, fontWeight: '300',
          }}
        >
          {t('hero.subtitle')}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          style={{
            display: 'flex', flexWrap: 'wrap',
            alignItems: 'center', justifyContent: 'center',
            gap: '14px', marginBottom: '60px',
          }}
        >
          <motion.button
            onClick={onStartPlanning}
            whileHover={{ scale: 1.06, y: -3 }} whileTap={{ scale: 0.97 }}
            className="btn-primary"
            style={{
              padding: '16px 36px', fontSize: '15px', borderRadius: '16px',
              background: 'linear-gradient(135deg,#7c3aed,#2563eb)',
              boxShadow: '0 8px 32px rgba(124,58,237,0.42)',
              display: 'flex', alignItems: 'center', gap: '10px',
            }}
          >
            <Plane size={18} />
            {t('hero.ctaPrimary')}
            <ArrowRight size={16} />
          </motion.button>

          <motion.button
            onClick={onExplore}
            whileHover={{ scale: 1.06, y: -2 }} whileTap={{ scale: 0.97 }}
            className="btn-secondary"
            style={{
              padding: '16px 36px', fontSize: '15px', borderRadius: '16px',
              display: 'flex', alignItems: 'center', gap: '10px',
            }}
          >
            <MapPin size={17} />
            {t('hero.ctaSecond')}
          </motion.button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          style={{
            display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
            gap: '12px', maxWidth: '520px', margin: '0 auto 48px',
          }}
        >
          {STATS.map((stat, i) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.55 + i * 0.08 }}
                whileHover={{ scale: 1.08, y: -3 }}
                className="stat-card"
                style={{ padding: '16px 10px', textAlign: 'center', cursor: 'default' }}
              >
                <Icon size={18} style={{ color: '#a78bfa', margin: '0 auto 8px', display: 'block' }} />
                <div style={{ color: '#fff', fontWeight: '800', fontSize: '18px', lineHeight: 1 }}>
                  {stat.value}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.38)', fontSize: '10px', marginTop: '4px', fontWeight: '500' }}>
                  {stat.label}
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
        >
          <span style={{
            color: 'rgba(255,255,255,0.2)', fontSize: '10px',
            fontWeight: '600', letterSpacing: '0.15em', textTransform: 'uppercase',
          }}>
            {t('hero.scroll')}
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
            style={{
              width: '20px', height: '32px', borderRadius: '10px',
              border: '1.5px solid rgba(255,255,255,0.12)',
              display: 'flex', alignItems: 'flex-start',
              justifyContent: 'center', paddingTop: '6px',
            }}
          >
            <div style={{
              width: '3px', height: '8px', borderRadius: '2px',
              background: 'rgba(167,139,250,0.6)',
            }} />
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '120px',
        background: 'linear-gradient(to bottom, transparent, #08061a)',
        pointerEvents: 'none',
      }} />
    </div>
  )
}