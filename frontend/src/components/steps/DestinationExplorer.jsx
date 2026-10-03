import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MapPin, Star, ExternalLink, ArrowLeft,
  Camera, UtensilsCrossed, Gem, Calendar,
  Languages, Users2, Clock, Sparkles
} from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } }
}

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35 } }
}

const TABS = [
  { id: 'attractions', label: 'Attractions', icon: MapPin },
  { id: 'food', label: 'Local Food', icon: UtensilsCrossed },
  { id: 'photos', label: 'Photo Spots', icon: Camera },
  { id: 'hidden', label: 'Hidden Gems', icon: Gem },
  { id: 'events', label: 'Events', icon: Calendar },
  { id: 'phrases', label: 'Language', icon: Languages },
]

function CrowdBadge({ level }) {
  const config = {
    low: { color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', label: 'Low Crowd', dot: 'bg-emerald-400' },
    medium: { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', label: 'Moderate', dot: 'bg-yellow-400' },
    high: { color: 'bg-red-500/20 text-red-400 border-red-500/30', label: 'Crowded', dot: 'bg-red-400' },
  }
  const c = config[level] || config.medium
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border ${c.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  )
}

export default function DestinationExplorer({ onNext, onBack, tripData }) {
  const dest = tripData.destination
  const [activeTab, setActiveTab] = useState('attractions')

  if (!dest) return null

  const openMaps = (query) => {
    window.open(`https://www.google.com/maps/search/${encodeURIComponent(query)}`, '_blank')
  }

  return (
    <div className="trip-step-shell explorer-shell">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center step-heading mb-6"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="text-6xl mb-3"
        >
          {dest.emoji}
        </motion.div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-1">
          <span className="bg-gradient-to-r from-violet-300 via-blue-300 to-cyan-300 bg-clip-text text-transparent">
            Explore
          </span>{' '}
          <span className="text-white">{dest.name}</span>
        </h1>
        <p className="text-white/50">{dest.tagline} · {dest.country}</p>

        {/* Quick Stats */}
        <div className="flex flex-wrap justify-center gap-3 mt-4">
          {[
            { icon: '💰', label: dest.avg_budget },
            { icon: '📅', label: `Best: ${dest.best_time}` },
            { icon: '💳', label: dest.currency },
            { icon: '🗣️', label: dest.language },
          ].map((stat) => (
            <span key={stat.label}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.65)' }}>
              {stat.icon} {stat.label}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Crowd Prediction */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass-card p-4 mb-5"
      >
        <div className="flex items-center gap-2 mb-3">
          <Clock size={14} className="text-violet-400" />
          <span className="text-white/60 text-sm font-medium">🕒 Crowd Prediction</span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { time: 'Morning', icon: '🌅', level: dest.crowd?.morning || 'low' },
            { time: 'Afternoon', icon: '☀️', level: dest.crowd?.afternoon || 'high' },
            { time: 'Evening', icon: '🌙', level: dest.crowd?.evening || 'medium' },
          ].map((slot) => (
            <div key={slot.time} className="text-center p-3 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="text-xl mb-1">{slot.icon}</div>
              <div className="text-white/50 text-xs mb-2">{slot.time}</div>
              <CrowdBadge level={slot.level} />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Smart Packing */}
      {dest.packing && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-4 mb-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={14} className="text-violet-400" />
            <span className="text-white/60 text-sm font-medium">🎒 Smart Packing List</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {dest.packing.map((item) => (
              <span key={item}
                className="text-xs px-3 py-1.5 rounded-full font-medium"
                style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', color: 'rgba(196,181,253,0.9)' }}>
                ✓ {item}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-hide"
      >
        {TABS.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0"
              style={activeTab === tab.id ? {
                background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
                color: 'white',
                boxShadow: '0 4px 15px rgba(124,58,237,0.4)'
              } : {
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.5)'
              }}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          )
        })}
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.3 }}
        >

          {/* ATTRACTIONS */}
          {activeTab === 'attractions' && (
            <motion.div variants={containerVariants} initial="hidden" animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {dest.attractions.map((place) => (
                <motion.div key={place.name} variants={cardVariants}
                  whileHover={{ scale: 1.02, y: -3 }}
                  className="p-4 rounded-2xl group cursor-pointer transition-all duration-300"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 30px rgba(124,58,237,0.2)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{place.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-white font-semibold text-sm truncate">{place.name}</span>
                        <div className="flex items-center gap-1 shrink-0">
                          <Star size={11} className="text-amber-400 fill-amber-400" />
                          <span className="text-amber-400 text-xs font-bold">{place.rating}</span>
                        </div>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full mt-1 inline-block"
                        style={{ background: 'rgba(124,58,237,0.2)', color: 'rgba(196,181,253,0.8)' }}>
                        {place.category}
                      </span>
                      <button
                        onClick={() => openMaps(place.maps)}
                        className="flex items-center gap-1 mt-2 text-xs text-violet-400 hover:text-violet-300 transition-colors"
                      >
                        <ExternalLink size={11} />
                        Open in Maps
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* FOOD */}
          {activeTab === 'food' && (
            <motion.div variants={containerVariants} initial="hidden" animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {dest.food?.map((item) => (
                <motion.div key={item.name} variants={cardVariants}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="p-4 rounded-2xl"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">{item.emoji}</div>
                    <div>
                      <div className="text-white font-semibold text-sm">{item.name}</div>
                      <div className="text-white/40 text-xs mt-0.5">{item.type}</div>
                      <div className="text-violet-300 text-xs mt-1 flex items-center gap-1">
                        <UtensilsCrossed size={10} />
                        {item.restaurant}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* PHOTO SPOTS */}
          {activeTab === 'photos' && (
            <motion.div variants={containerVariants} initial="hidden" animate="visible"
              className="space-y-3">
              {dest.photo_spots?.map((spot) => (
                <motion.div key={spot.name} variants={cardVariants}
                  whileHover={{ scale: 1.01, x: 4 }}
                  className="p-4 rounded-2xl flex items-center gap-4"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <div className="text-4xl">{spot.emoji}</div>
                  <div className="flex-1">
                    <div className="text-white font-semibold text-sm">{spot.name}</div>
                    <div className="flex items-center gap-1 text-white/40 text-xs mt-1">
                      <Clock size={10} />
                      Best time: <span className="text-emerald-400 ml-1">{spot.best_time}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white/30 text-xs">Popularity</div>
                    <div className="flex items-center gap-1 mt-1">
                      <div className="h-1.5 w-16 rounded-full overflow-hidden"
                        style={{ background: 'rgba(255,255,255,0.1)' }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${spot.popularity}%` }}
                          transition={{ duration: 1, delay: 0.3 }}
                          className="h-full rounded-full"
                          style={{ background: 'linear-gradient(90deg, #7c3aed, #06b6d4)' }}
                        />
                      </div>
                      <span className="text-violet-300 text-xs font-bold">{spot.popularity}%</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* HIDDEN GEMS */}
          {activeTab === 'hidden' && (
            <motion.div variants={containerVariants} initial="hidden" animate="visible"
              className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {dest.hidden_gems?.map((gem) => (
                <motion.div key={gem.name} variants={cardVariants}
                  whileHover={{ scale: 1.04, y: -4 }}
                  className="p-5 rounded-2xl text-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(37,99,235,0.1))',
                    border: '1px solid rgba(124,58,237,0.25)'
                  }}
                >
                  <div className="text-4xl mb-2">{gem.emoji}</div>
                  <div className="text-white font-semibold text-sm mb-1">{gem.name}</div>
                  <div className="text-xs px-2 py-0.5 rounded-full inline-block mb-2"
                    style={{ background: 'rgba(250,204,21,0.15)', color: 'rgba(250,204,21,0.9)', border: '1px solid rgba(250,204,21,0.2)' }}>
                    ⭐ Hidden Gem
                  </div>
                  <p className="text-white/45 text-xs leading-relaxed">{gem.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* EVENTS */}
          {activeTab === 'events' && (
            <motion.div variants={containerVariants} initial="hidden" animate="visible"
              className="space-y-3">
              {dest.events?.map((event) => (
                <motion.div key={event.name} variants={cardVariants}
                  whileHover={{ scale: 1.01, x: 4 }}
                  className="p-4 rounded-2xl flex items-center gap-4"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <div className="text-4xl">{event.emoji}</div>
                  <div className="flex-1">
                    <div className="text-white font-semibold text-sm">{event.name}</div>
                    <div className="flex items-center gap-1 text-white/40 text-xs mt-1">
                      <Calendar size={10} />
                      <span className="text-amber-400 ml-1">{event.date}</span>
                    </div>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full"
                    style={{ background: 'rgba(250,204,21,0.15)', color: 'rgba(250,204,21,0.85)', border: '1px solid rgba(250,204,21,0.2)' }}>
                    Local Event
                  </span>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* LANGUAGE */}
          {activeTab === 'phrases' && (
            <motion.div variants={containerVariants} initial="hidden" animate="visible"
              className="space-y-3">
              <div className="glass-card p-4 mb-4 text-center">
                <p className="text-white/50 text-sm">
                  🗣️ Language spoken in <span className="text-violet-300">{dest.name}</span>:
                  <span className="text-white font-semibold ml-2">{dest.language}</span>
                </p>
              </div>
              {dest.phrases?.map((p) => (
                <motion.div key={p.phrase} variants={cardVariants}
                  whileHover={{ scale: 1.02 }}
                  className="p-4 rounded-2xl flex items-center justify-between"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{p.emoji}</span>
                    <div>
                      <div className="text-white/50 text-xs">English</div>
                      <div className="text-white font-medium text-sm">{p.phrase}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white/50 text-xs">{dest.language}</div>
                    <div className="text-violet-300 font-semibold text-sm">{p.translation}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex justify-between mt-8"
      >
        <motion.button
          onClick={onBack}
          whileHover={{ scale: 1.03, x: -2 }}
          whileTap={{ scale: 0.97 }}
          className="btn-secondary px-8 py-3 flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Back
        </motion.button>

        <motion.button
          onClick={onNext}
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          className="btn-primary px-10 py-3 text-base flex items-center gap-2"
        >
          Generate My Dashboard
          <Sparkles size={15} />
        </motion.button>
      </motion.div>
    </div>
  )
}