import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, ArrowLeft, CheckCircle2, MapPin } from 'lucide-react'
import { ACTIVITY_OPTIONS } from '../../data/destinations'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 }
  }
}

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.93 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35 } }
}

const SUGGESTED_COMBOS = [
  {
    label: 'Beach Lover',
    emoji: '🌊',
    activities: ['beaches', 'relaxation', 'photography', 'food'],
    gradient: 'from-cyan-500 to-blue-500'
  },
  {
    label: 'Adventure Seeker',
    emoji: '⚡',
    activities: ['adventure', 'mountains', 'photography', 'nature'],
    gradient: 'from-orange-500 to-red-500'
  },
  {
    label: 'Culture Explorer',
    emoji: '🏛️',
    activities: ['heritage', 'food', 'photography', 'shopping'],
    gradient: 'from-violet-500 to-purple-600'
  },
  {
    label: 'Wellness Retreat',
    emoji: '🧘',
    activities: ['relaxation', 'wellness', 'nature', 'beaches'],
    gradient: 'from-emerald-500 to-teal-500'
  },
]

export default function ActivitiesStep({ onNext, onBack, tripData, updateTripData }) {
  const [selected, setSelected] = useState(tripData.activities || [])
  const [hoveredCombo, setHoveredCombo] = useState(null)

  const toggleActivity = (id) => {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(a => a !== id)
        : [...prev, id]
    )
  }

  const applyCombo = (combo) => {
    setSelected(combo.activities)
  }

  const isValid = selected.length >= 1

  const handleNext = () => {
    if (!isValid) return
    updateTripData('activities', selected)
    onNext()
  }

  const getActivityLabel = (id) => {
    return ACTIVITY_OPTIONS.find(a => a.id === id)?.label || id
  }

  return (
    <div className="max-w-3xl mx-auto">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
          className="text-5xl mb-4"
        >
          🎯
        </motion.div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">
          <span className="bg-gradient-to-r from-violet-300 via-blue-300 to-cyan-300 bg-clip-text text-transparent">
            What excites
          </span>
          <br />
          <span className="text-white">you the most?</span>
        </h1>
        <p className="text-white/50 text-base mt-2">
          Pick your interests — we'll tailor the perfect itinerary
        </p>

        {/* Destination badge */}
        {tripData.destination && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-full text-sm"
            style={{
              background: 'rgba(124,58,237,0.2)',
              border: '1px solid rgba(124,58,237,0.35)'
            }}
          >
            <MapPin size={13} className="text-violet-400" />
            <span className="text-violet-300 font-medium">
              {tripData.destination.emoji} {tripData.destination.name}
            </span>
            {tripData.tripDetails?.tripType && (
              <>
                <span className="text-white/20">·</span>
                <span className="text-white/50 capitalize">
                  {tripData.tripDetails.tripType} Trip
                </span>
              </>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Quick Combos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mb-5"
      >
        <p className="text-white/40 text-xs font-medium uppercase tracking-widest mb-3 px-1">
          ⚡ Quick Presets
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {SUGGESTED_COMBOS.map((combo) => (
            <motion.button
              key={combo.label}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              onHoverStart={() => setHoveredCombo(combo.label)}
              onHoverEnd={() => setHoveredCombo(null)}
              onClick={() => applyCombo(combo)}
              className="relative p-3 rounded-2xl text-left overflow-hidden transition-all duration-300"
              style={{
                background: combo.activities.every(a => selected.includes(a))
                  ? 'rgba(124,58,237,0.25)'
                  : 'rgba(255,255,255,0.04)',
                border: combo.activities.every(a => selected.includes(a))
                  ? '1px solid rgba(139,92,246,0.5)'
                  : '1px solid rgba(255,255,255,0.08)'
              }}
            >
              {/* Gradient bg */}
              <div className={`absolute inset-0 bg-gradient-to-br ${combo.gradient} opacity-0 transition-opacity duration-300 ${
                hoveredCombo === combo.label ? 'opacity-10' : ''
              }`} />
              <div className="relative z-10">
                <div className="text-2xl mb-1">{combo.emoji}</div>
                <div className="text-white/70 text-xs font-semibold">{combo.label}</div>
                <div className="text-white/30 text-[10px] mt-1">
                  {combo.activities.length} activities
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Activities Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="glass-card-strong p-6 sm:p-8"
      >
        <div className="flex items-center justify-between mb-5">
          <p className="text-white/60 text-sm font-medium flex items-center gap-2">
            <Sparkles size={14} className="text-violet-400" />
            Select all that interest you
          </p>
          <div className="flex items-center gap-2">
            <AnimatePresence>
              {selected.length > 0 && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-xs px-3 py-1 rounded-full font-semibold"
                  style={{
                    background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(37,99,235,0.3))',
                    border: '1px solid rgba(124,58,237,0.4)',
                    color: 'rgba(196,181,253,1)'
                  }}
                >
                  {selected.length} selected
                </motion.span>
              )}
            </AnimatePresence>
            {selected.length > 0 && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setSelected([])}
                className="text-xs text-white/30 hover:text-white/60 transition-colors"
              >
                Clear all
              </motion.button>
            )}
          </div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
        >
          {ACTIVITY_OPTIONS.map((activity) => {
            const isSelected = selected.includes(activity.id)
            return (
              <motion.button
                key={activity.id}
                variants={cardVariants}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleActivity(activity.id)}
                className="relative p-4 rounded-2xl text-center transition-all duration-300 overflow-hidden"
                style={isSelected ? {
                  background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(37,99,235,0.3))',
                  border: '1px solid rgba(139,92,246,0.6)',
                  boxShadow: '0 4px 20px rgba(124,58,237,0.2)'
                } : {
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)'
                }}
              >
                {/* Glow bg when selected */}
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 rounded-2xl"
                    style={{
                      background: 'radial-gradient(circle at center, rgba(124,58,237,0.15), transparent 70%)'
                    }}
                  />
                )}

                <div className="relative z-10">
                  <motion.div
                    animate={isSelected ? {
                      scale: [1, 1.3, 1],
                      rotate: [0, -10, 10, 0]
                    } : { scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="text-3xl mb-2"
                  >
                    {activity.emoji}
                  </motion.div>
                  <div className={`text-xs font-semibold transition-colors duration-200 ${
                    isSelected ? 'text-violet-200' : 'text-white/55'
                  }`}>
                    {activity.label}
                  </div>
                </div>

                {/* Check icon */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                      className="absolute top-2 right-2"
                    >
                      <CheckCircle2
                        size={16}
                        className="text-violet-400"
                        fill="rgba(124,58,237,0.3)"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            )
          })}
        </motion.div>
      </motion.div>

      {/* Selected Activities Preview */}
      <AnimatePresence>
        {selected.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.35 }}
            className="glass-card p-5 mt-4"
          >
            <p className="text-white/40 text-xs font-medium uppercase tracking-widest mb-3">
              Your Interests
            </p>
            <div className="flex flex-wrap gap-2">
              {selected.map((id, i) => {
                const act = ACTIVITY_OPTIONS.find(a => a.id === id)
                return (
                  <motion.button
                    key={id}
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => toggleActivity(id)}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                    style={{
                      background: 'rgba(124,58,237,0.2)',
                      border: '1px solid rgba(124,58,237,0.4)',
                      color: 'rgba(196,181,253,0.95)'
                    }}
                  >
                    <span>{act?.emoji}</span>
                    <span>{act?.label}</span>
                    <span className="text-violet-400/60 ml-0.5">×</span>
                  </motion.button>
                )
              })}
            </div>

            {/* Tip */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-white/25 text-xs mt-3 flex items-center gap-1"
            >
              <Sparkles size={10} className="text-violet-400/50" />
              AI will use these to craft your personalized itinerary
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Validation hint */}
      <AnimatePresence>
        {selected.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center text-white/25 text-sm mt-4"
          >
            Select at least 1 activity to continue
          </motion.p>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="flex justify-between mt-6"
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
          onClick={handleNext}
          disabled={!isValid}
          whileHover={isValid ? { scale: 1.03, y: -2 } : {}}
          whileTap={isValid ? { scale: 0.97 } : {}}
          className="btn-primary px-10 py-3 text-base disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
        >
          Continue → Budget
          <Sparkles size={15} />
        </motion.button>
      </motion.div>
    </div>
  )
}