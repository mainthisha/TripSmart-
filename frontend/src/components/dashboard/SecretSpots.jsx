import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Gem, MapPin, ExternalLink, Star, ChevronRight } from 'lucide-react'

const EXTRA_GEMS = {
  'Kerala': [
    { name: 'Peruvannamuzhi Dam', desc: 'A hidden reservoir surrounded by lush forests with crocodile sightings', emoji: '🐊', why: 'Off the beaten path — almost no tourists', tip: 'Visit early morning for wildlife spotting' },
    { name: 'Thusharagiri Waterfalls', desc: 'Triple waterfalls in a forest — perfect for trekking', emoji: '💧', why: 'Rarely visited despite being stunning', tip: 'Best during monsoon season' },
  ],
  'Goa': [
    { name: 'Butterfly Beach', desc: 'Only accessible by boat — untouched paradise', emoji: '🦋', why: 'No roads lead here — true seclusion', tip: 'Take a boat from Palolem at dawn' },
    { name: 'Divar Island', desc: 'Portuguese-heritage island with old churches and quiet lanes', emoji: '⛪', why: 'Most tourists miss this slice of old Goa', tip: 'Rent a bicycle on the island' },
  ],
  'Manali': [
    { name: 'Chandratal Lake', desc: 'The Moon Lake at 4,300m — surreal blue waters', emoji: '🌙', why: 'Magical and barely visited compared to Rohtang', tip: 'Accessible only Jun–Sep' },
    { name: 'Prashar Lake', desc: 'Pristine lake with a floating island and ancient temple', emoji: '🏔️', why: 'Most visitors skip it but it is breathtaking', tip: 'Camp overnight for stargazing' },
  ],
}

const RATING_LABELS = {
  1: 'Rarely Known',
  2: 'Secret Spot',
  3: 'Local Favourite',
}

export default function HiddenGems({ tripData }) {
  const dest = tripData?.destination
  const [selected, setSelected] = useState(null)

  if (!dest) return null

  const destGems    = dest.hidden_gems || []
  const extraGems   = EXTRA_GEMS[dest.name] || []
  const allGems     = [
    ...destGems.map(g => ({ ...g, emoji: g.emoji || '💎', why: 'A hidden treasure most visitors miss', tip: 'Ask locals for directions' })),
    ...extraGems,
  ]

  if (allGems.length === 0) return (
    <div className="text-center py-8">
      <div className="text-3xl mb-2">💎</div>
      <p className="text-white/40 text-sm">No hidden gems data for {dest.name}</p>
    </div>
  )

  return (
    <div className="space-y-4">

      {/* Intro */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-2xl flex items-start gap-3"
        style={{ background: 'rgba(236,72,153,0.1)', border: '1px solid rgba(236,72,153,0.2)' }}
      >
        <Gem size={18} className="text-pink-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-white/70 text-sm font-semibold">
            {allGems.length} Hidden Gems in {dest.name}
          </p>
          <p className="text-white/40 text-xs mt-0.5 leading-relaxed">
            These secret spots are loved by locals but rarely visited by tourists. Add them to your itinerary!
          </p>
        </div>
      </motion.div>

      {/* Gems Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {allGems.map((gem, i) => (
          <motion.div
            key={gem.name}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: i * 0.07 }}
            whileHover={{ scale: 1.03, y: -4 }}
            onClick={() => setSelected(selected?.name === gem.name ? null : gem)}
            className="cursor-pointer rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(236,72,153,0.1), rgba(124,58,237,0.1))',
              border: selected?.name === gem.name
                ? '1.5px solid rgba(236,72,153,0.5)'
                : '1px solid rgba(236,72,153,0.2)',
              boxShadow: selected?.name === gem.name
                ? '0 8px 30px rgba(236,72,153,0.2)'
                : 'none',
            }}
          >
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="text-4xl">{gem.emoji}</div>
                <span
                  className="text-xs px-2 py-1 rounded-full font-semibold"
                  style={{
                    background: 'rgba(250,204,21,0.15)',
                    border: '1px solid rgba(250,204,21,0.3)',
                    color: '#fde68a',
                  }}
                >
                  ⭐ Hidden Gem
                </span>
              </div>

              <h4 className="text-white font-bold text-sm mb-1.5">{gem.name}</h4>
              <p className="text-white/50 text-xs leading-relaxed mb-3">{gem.desc}</p>

              <div className="flex items-center gap-1 text-pink-400 text-xs font-medium">
                <ChevronRight size={12} />
                {selected?.name === gem.name ? 'Tap to close' : 'Tap for details'}
              </div>
            </div>

            {/* Expanded Details */}
            <AnimatePresence>
              {selected?.name === gem.name && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 space-y-3"
                    style={{ borderTop: '1px solid rgba(236,72,153,0.15)' }}>
                    <div className="pt-3">
                      <p className="text-white/35 text-xs font-semibold uppercase tracking-wider mb-1">
                        Why Visit?
                      </p>
                      <p className="text-white/65 text-xs leading-relaxed">{gem.why}</p>
                    </div>
                    <div>
                      <p className="text-white/35 text-xs font-semibold uppercase tracking-wider mb-1">
                        💡 Pro Tip
                      </p>
                      <p className="text-pink-300 text-xs leading-relaxed">{gem.tip}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        window.open(`https://www.google.com/maps/search/${encodeURIComponent(gem.name + ' ' + dest.name)}`, '_blank')
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-medium"
                      style={{ background: 'rgba(236,72,153,0.2)', color: '#f9a8d4', border: '1px solid rgba(236,72,153,0.3)' }}
                    >
                      <MapPin size={11} /> Open in Maps
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Footer tip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center p-3 rounded-xl"
        style={{ background: 'rgba(255,255,255,0.03)' }}
      >
        <p className="text-white/25 text-xs">
          💡 These hidden gems are best enjoyed on weekdays early morning for a crowd-free experience
        </p>
      </motion.div>
    </div>
  )
}