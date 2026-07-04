import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lightbulb, ChevronDown, ChevronUp } from 'lucide-react'

const BASE_TIPS = [
  { emoji: '📵', tip: 'Download offline maps before your trip', category: 'Tech', color: 'from-blue-500 to-cyan-500' },
  { emoji: '💊', tip: 'Carry a basic first-aid kit and any prescription medicines', category: 'Health', color: 'from-red-500 to-rose-500' },
  { emoji: '💳', tip: 'Inform your bank before traveling abroad to avoid card blocks', category: 'Finance', color: 'from-emerald-500 to-teal-500' },
  { emoji: '📄', tip: 'Keep digital and physical copies of all important documents', category: 'Safety', color: 'from-amber-500 to-orange-500' },
  { emoji: '🔋', tip: 'Carry a power bank — long travel days drain your phone fast', category: 'Tech', color: 'from-violet-500 to-purple-500' },
  { emoji: '💧', tip: 'Stay hydrated, especially during flights and hot weather', category: 'Health', color: 'from-cyan-500 to-blue-500' },
  { emoji: '🛡️', tip: 'Get travel insurance — it can save thousands in emergencies', category: 'Safety', color: 'from-indigo-500 to-blue-600' },
  { emoji: '🌐', tip: 'Get a local SIM card or international roaming plan on arrival', category: 'Tech', color: 'from-teal-500 to-emerald-500' },
]

const DESTINATION_TIPS = {
  'Kerala':   [
    { emoji: '🌧️', tip: 'Monsoon season (Jun–Sep) can cause flooding. Check forecasts daily', category: 'Weather', color: 'from-blue-500 to-indigo-500' },
    { emoji: '🦟', tip: 'Use mosquito repellent, especially near backwaters', category: 'Health', color: 'from-green-500 to-emerald-500' },
    { emoji: '👗', tip: 'Dress modestly when visiting temples', category: 'Culture', color: 'from-orange-500 to-amber-500' },
  ],
  'Goa':      [
    { emoji: '🏖️', tip: 'Beware of rip currents. Swim only at lifeguard-patrolled beaches', category: 'Safety', color: 'from-blue-500 to-cyan-500' },
    { emoji: '🛵', tip: 'Rent a scooter for easy travel — but always wear a helmet', category: 'Transport', color: 'from-yellow-500 to-orange-500' },
    { emoji: '🍹', tip: 'Try local feni (cashew liquor) responsibly', category: 'Food', color: 'from-pink-500 to-rose-500' },
  ],
  'Manali':   [
    { emoji: '🏔️', tip: 'Acclimatize for 1 day before going to high altitudes', category: 'Health', color: 'from-blue-500 to-indigo-500' },
    { emoji: '❄️', tip: 'Roads to Rohtang close in heavy snow. Check before going', category: 'Transport', color: 'from-cyan-400 to-blue-500' },
    { emoji: '🧥', tip: 'Even summers are cold at night. Pack layered warm clothing', category: 'Packing', color: 'from-violet-500 to-purple-500' },
  ],
  'Dubai':    [
    { emoji: '👗', tip: 'Dress conservatively in malls and public areas', category: 'Culture', color: 'from-amber-500 to-yellow-500' },
    { emoji: '🌡️', tip: 'Summer temperatures hit 45°C. Stay indoors from 11am–4pm', category: 'Weather', color: 'from-red-500 to-orange-500' },
    { emoji: '📸', tip: 'Ask permission before photographing locals or government buildings', category: 'Culture', color: 'from-purple-500 to-violet-500' },
  ],
  'Tokyo':    [
    { emoji: '🚇', tip: 'Get an IC card (Suica/Pasmo) for seamless metro travel', category: 'Transport', color: 'from-blue-500 to-indigo-500' },
    { emoji: '🗑️', tip: 'Public bins are rare — carry a small bag for your trash', category: 'Culture', color: 'from-green-500 to-teal-500' },
    { emoji: '🙏', tip: 'Remove shoes before entering traditional restaurants and homes', category: 'Culture', color: 'from-rose-500 to-pink-500' },
  ],
  'Paris':    [
    { emoji: '🚇', tip: 'Buy a Paris Visite metro pass for unlimited travel', category: 'Transport', color: 'from-blue-500 to-violet-500' },
    { emoji: '👛', tip: 'Beware of pickpockets at Eiffel Tower and tourist spots', category: 'Safety', color: 'from-red-500 to-rose-500' },
    { emoji: '🥐', tip: 'Skip tourist restaurants near landmarks — walk 2 blocks for authentic food', category: 'Food', color: 'from-amber-500 to-orange-500' },
  ],
  'Bali':     [
    { emoji: '🛕', tip: 'Wear a sarong when entering temples — available at entry points', category: 'Culture', color: 'from-orange-500 to-amber-500' },
    { emoji: '🤿', tip: 'Book diving/snorkeling with licensed operators only', category: 'Safety', color: 'from-cyan-500 to-blue-500' },
    { emoji: '💵', tip: 'Bargain at markets — starting price is usually 3x the fair price', category: 'Finance', color: 'from-emerald-500 to-green-500' },
  ],
  'Maldives': [
    { emoji: '🐠', tip: 'Use reef-safe sunscreen to protect coral ecosystems', category: 'Environment', color: 'from-teal-500 to-cyan-500' },
    { emoji: '🍺', tip: 'Alcohol is only available at resort islands, not local islands', category: 'Culture', color: 'from-amber-500 to-yellow-500' },
    { emoji: '📷', tip: 'Best photography: 7–9am for calm waters and golden light', category: 'Photography', color: 'from-violet-500 to-purple-500' },
  ],
  'Singapore':[
    { emoji: '🌿', tip: 'The city is very walkable — comfortable shoes are a must', category: 'Transport', color: 'from-green-500 to-emerald-500' },
    { emoji: '🍜', tip: 'Eat at hawker centres for the best and cheapest local food', category: 'Food', color: 'from-orange-500 to-red-500' },
    { emoji: '💰', tip: 'Singapore is expensive — budget at least $150 SGD/day', category: 'Finance', color: 'from-blue-500 to-indigo-500' },
  ],
  'London':   [
    { emoji: '🚇', tip: 'Get an Oyster card for the tube — much cheaper than paper tickets', category: 'Transport', color: 'from-red-500 to-rose-500' },
    { emoji: '🌧️', tip: 'Always carry an umbrella — weather changes fast', category: 'Weather', color: 'from-blue-500 to-slate-500' },
    { emoji: '🎭', tip: 'Book West End shows in advance for best prices', category: 'Entertainment', color: 'from-violet-500 to-purple-500' },
  ],
}

const ACTIVITY_TIPS = {
  beaches:     { emoji: '🌊', tip: 'Apply SPF 50+ sunscreen 30 min before sun exposure', category: 'Health', color: 'from-cyan-500 to-blue-500' },
  mountains:   { emoji: '⛰️', tip: 'Never hike alone — always inform someone of your route', category: 'Safety', color: 'from-slate-500 to-blue-600' },
  food:        { emoji: '🍜', tip: 'Eat where locals eat — usually safer and more authentic', category: 'Food', color: 'from-orange-500 to-amber-500' },
  photography: { emoji: '📸', tip: 'Golden hour (1hr after sunrise / before sunset) = best shots', category: 'Photography', color: 'from-violet-500 to-purple-500' },
  adventure:   { emoji: '🪂', tip: 'Always choose licensed, safety-certified adventure operators', category: 'Safety', color: 'from-red-500 to-orange-500' },
  heritage:    { emoji: '🏛️', tip: 'Hire a local guide for richer historical context', category: 'Culture', color: 'from-amber-500 to-yellow-500' },
  shopping:    { emoji: '🛍️', tip: 'Compare prices across 2–3 shops before buying souvenirs', category: 'Finance', color: 'from-pink-500 to-rose-500' },
  wildlife:    { emoji: '🦁', tip: 'Maintain safe distances from wild animals — never feed them', category: 'Safety', color: 'from-emerald-500 to-teal-500' },
}

export default function TravelTips({ tripData }) {
  const destination = tripData?.destination
  const activities  = tripData?.activities || []
  const [expanded, setExpanded] = useState(true)
  const [filter, setFilter]     = useState('All')

  const destTips = destination ? (DESTINATION_TIPS[destination.name] || []) : []
  const actTips  = activities.map(a => ACTIVITY_TIPS[a]).filter(Boolean)
  const allTips  = [...destTips, ...actTips, ...BASE_TIPS]

  const categories = ['All', ...new Set(allTips.map(t => t.category))]
  const filtered   = filter === 'All' ? allTips : allTips.filter(t => t.category === filter)

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
            💡
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Smart Travel Tips</h2>
            <p className="text-white/40 text-xs">
              {destTips.length + actTips.length} personalized · {BASE_TIPS.length} universal
            </p>
          </div>
        </div>
        <button onClick={() => setExpanded(e => !e)}
          className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.08)' }}>
          {expanded
            ? <ChevronUp size={16} className="text-white/50" />
            : <ChevronDown size={16} className="text-white/50" />}
        </button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden space-y-4"
          >
            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap">
              {categories.map(cat => (
                <button key={cat}
                  onClick={() => setFilter(cat)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                  style={filter === cat ? {
                    background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
                    color: 'white'
                  } : {
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: 'rgba(255,255,255,0.45)'
                  }}>
                  {cat}
                </button>
              ))}
            </div>

            {/* Tips Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <AnimatePresence>
                {filtered.map((tip, i) => (
                  <motion.div
                    key={tip.tip}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.04 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="p-4 rounded-2xl flex items-start gap-3"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0 bg-gradient-to-br ${tip.color}`}>
                      {tip.emoji}
                    </div>
                    <div>
                      <span className="text-xs px-2 py-0.5 rounded-full mb-1 inline-block"
                        style={{ background: 'rgba(124,58,237,0.2)', color: 'rgba(196,181,253,0.8)' }}>
                        {tip.category}
                      </span>
                      <p className="text-white/70 text-xs leading-relaxed">{tip.tip}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}