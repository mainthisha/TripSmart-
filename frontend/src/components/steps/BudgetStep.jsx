import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Sparkles,
  MapPin, Users, Moon, Hotel,
  TrendingUp, Wallet, Plane, UtensilsCrossed, Camera
} from 'lucide-react'
import { ACCOMMODATION_TYPES } from '../../data/destinations'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
}

const BUDGET_PRESETS = [
  { label: 'Budget', emoji: '🎒', value: 15000, color: 'from-emerald-500 to-teal-500' },
  { label: 'Standard', emoji: '✈️', value: 50000, color: 'from-blue-500 to-indigo-500' },
  { label: 'Comfort', emoji: '🌟', value: 100000, color: 'from-violet-500 to-purple-500' },
  { label: 'Luxury', emoji: '💎', value: 250000, color: 'from-amber-500 to-orange-500' },
]

const MIN_BUDGET = 10000
const MAX_BUDGET = 500000

function formatINR(value) {
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`
  }
  if (value >= 1000) {
    return `₹${(value / 1000).toFixed(0)}K`
  }
  return `₹${value}`
}

function formatINRFull(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value)
}

function BudgetBar({ label, percent, color, icon: Icon, amount }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon size={13} className="text-white/40" />
          <span className="text-white/55 text-xs font-medium">{label}</span>
        </div>
        <span className="text-white/70 text-xs font-semibold">{formatINRFull(amount)}</span>
      </div>
      <div className="h-2 rounded-full overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.06)' }}>
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        />
      </div>
    </div>
  )
}

export default function BudgetStep({ onNext, onBack, tripData, updateTripData }) {
  const saved = tripData.budget || {}
  const travelers = tripData.tripDetails?.travelers || 1
  const duration = tripData.tripDetails?.duration || 5

  const [budget, setBudget] = useState(saved.total || 50000)
  const [accommodation, setAccommodation] = useState(saved.accommodation || null)
  const [isDragging, setIsDragging] = useState(false)

  const isValid = accommodation !== null

  const breakdown = useMemo(() => {
    const stay = Math.round(budget * 0.35)
    const food = Math.round(budget * 0.25)
    const transport = Math.round(budget * 0.20)
    const activities = Math.round(budget * 0.12)
    const misc = budget - stay - food - transport - activities
    return { stay, food, transport, activities, misc }
  }, [budget])

  const perPerson = Math.round(budget / travelers)
  const perDay = Math.round(budget / duration)

  const getBudgetLabel = () => {
    if (budget < 20000) return { label: 'Budget Trip', emoji: '🎒', color: 'text-emerald-400' }
    if (budget < 75000) return { label: 'Standard Trip', emoji: '✈️', color: 'text-blue-400' }
    if (budget < 150000) return { label: 'Comfortable Trip', emoji: '🌟', color: 'text-violet-400' }
    if (budget < 300000) return { label: 'Premium Trip', emoji: '👑', color: 'text-amber-400' }
    return { label: 'Luxury Trip', emoji: '💎', color: 'text-rose-400' }
  }

  const budgetInfo = getBudgetLabel()

  const handleSliderChange = (e) => {
    const raw = Number(e.target.value)
    setBudget(Math.round(raw / 1000) * 1000)
  }

  const handleNext = () => {
    if (!isValid) return
    updateTripData('budget', {
      total: budget,
      accommodation,
      breakdown,
      perPerson,
      perDay
    })
    onNext()
  }

  const sliderPercent = ((budget - MIN_BUDGET) / (MAX_BUDGET - MIN_BUDGET)) * 100

  return (
    <div className="trip-step-shell">

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
          💳
        </motion.div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">
          <span className="bg-gradient-to-r from-violet-300 via-blue-300 to-cyan-300 bg-clip-text text-transparent">
            Set your travel
          </span>
          <br />
          <span className="text-white">budget</span>
        </h1>
        <p className="text-white/50 text-base mt-2">
          We'll optimize your trip to match your budget perfectly
        </p>

        {tripData.destination && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 mt-3 px-4 py-2 rounded-full text-sm"
            style={{
              background: 'rgba(124,58,237,0.2)',
              border: '1px solid rgba(124,58,237,0.35)'
            }}
          >
            <span className="flex items-center gap-1 text-violet-300">
              <MapPin size={12} />
              {tripData.destination.emoji} {tripData.destination.name}
            </span>
            <span className="text-white/20">·</span>
            <span className="flex items-center gap-1 text-white/50">
              <Users size={12} />
              {travelers} {travelers === 1 ? 'person' : 'people'}
            </span>
            <span className="text-white/20">·</span>
            <span className="flex items-center gap-1 text-white/50">
              <Moon size={12} />
              {duration} nights
            </span>
          </motion.div>
        )}
      </motion.div>

      {/* Main Card */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="glass-card-strong p-6 sm:p-8 space-y-7"
      >
        {/* Budget Display */}
        <motion.div variants={itemVariants} className="text-center">
          <motion.div
            key={budget}
            initial={{ scale: 0.85, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.15 }}
            className="text-5xl sm:text-6xl font-bold mb-2"
            style={{
              background: 'linear-gradient(135deg, #a78bfa, #60a5fa, #34d399)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            {formatINRFull(budget)}
          </motion.div>
          <motion.div
            key={budgetInfo.label}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-sm font-semibold ${budgetInfo.color}`}
          >
            {budgetInfo.emoji} {budgetInfo.label}
          </motion.div>

          <div className="flex justify-center gap-6 mt-4">
            <div className="text-center">
              <div className="text-white/30 text-xs mb-0.5">Per Person</div>
              <div className="text-white/70 text-sm font-semibold">{formatINRFull(perPerson)}</div>
            </div>
            <div className="w-px bg-white/10" />
            <div className="text-center">
              <div className="text-white/30 text-xs mb-0.5">Per Day</div>
              <div className="text-white/70 text-sm font-semibold">{formatINRFull(perDay)}</div>
            </div>
            <div className="w-px bg-white/10" />
            <div className="text-center">
              <div className="text-white/30 text-xs mb-0.5">Total Nights</div>
              <div className="text-white/70 text-sm font-semibold">{duration}</div>
            </div>
          </div>
        </motion.div>

        {/* Slider */}
        <motion.div variants={itemVariants} className="space-y-3">
          <div className="relative px-1">
            <div className="relative h-2 rounded-full"
              style={{ background: 'rgba(255,255,255,0.08)' }}>
              <div
                className="absolute left-0 top-0 h-full rounded-full"
                style={{
                  width: `${sliderPercent}%`,
                  background: 'linear-gradient(90deg, #7c3aed, #2563eb, #06b6d4)'
                }}
              />
            </div>
            <input
              type="range"
              min={MIN_BUDGET}
              max={MAX_BUDGET}
              step={1000}
              value={budget}
              onChange={handleSliderChange}
              onMouseDown={() => setIsDragging(true)}
              onMouseUp={() => setIsDragging(false)}
              onTouchStart={() => setIsDragging(true)}
              onTouchEnd={() => setIsDragging(false)}
              className="absolute inset-0 w-full opacity-0 cursor-pointer h-2"
              style={{ zIndex: 10 }}
            />
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 border-violet-400"
              style={{
                left: `calc(${sliderPercent}% - 10px)`,
                background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
                boxShadow: isDragging
                  ? '0 0 20px rgba(124,58,237,0.8)'
                  : '0 0 10px rgba(124,58,237,0.4)',
                pointerEvents: 'none'
              }}
              animate={{ scale: isDragging ? 1.3 : 1 }}
              transition={{ duration: 0.15 }}
            />
          </div>
          <div className="flex justify-between text-xs text-white/30 px-1">
            <span>₹10K</span>
            <span>₹1L</span>
            <span>₹2L</span>
            <span>₹3L</span>
            <span>₹5L+</span>
          </div>
        </motion.div>

        {/* Budget Presets */}
        <motion.div variants={itemVariants}>
          <p className="text-white/40 text-xs font-medium uppercase tracking-widest mb-3">
            Quick Presets
          </p>
          <div className="grid grid-cols-4 gap-2">
            {BUDGET_PRESETS.map((preset) => (
              <motion.button
                key={preset.label}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setBudget(preset.value)}
                className="p-3 rounded-2xl text-center transition-all duration-200"
                style={budget === preset.value ? {
                  background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(37,99,235,0.3))',
                  border: '1px solid rgba(139,92,246,0.5)'
                } : {
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.07)'
                }}
              >
                <div className="text-xl mb-1">{preset.emoji}</div>
                <div className="text-white/60 text-xs font-semibold">{preset.label}</div>
                <div className="text-white/35 text-xs mt-0.5">{formatINR(preset.value)}</div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Divider */}
        <motion.div variants={itemVariants} className="border-t border-white/5" />

        {/* Accommodation Type */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center gap-2 mb-4">
            <Hotel size={14} className="text-violet-400" />
            <p className="text-white/60 text-sm font-medium">Accommodation Type</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {ACCOMMODATION_TYPES.map((type) => (
              <motion.button
                key={type.id}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setAccommodation(type.id)}
                className="relative p-4 rounded-2xl text-center transition-all duration-300 overflow-hidden"
                style={accommodation === type.id ? {
                  background: 'linear-gradient(135deg, rgba(124,58,237,0.35), rgba(37,99,235,0.35))',
                  border: '1px solid rgba(139,92,246,0.6)',
                  boxShadow: '0 4px 20px rgba(124,58,237,0.2)'
                } : {
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)'
                }}
              >
                <div className="text-2xl mb-1.5">{type.emoji}</div>
                <div className={`text-xs font-semibold transition-colors ${
                  accommodation === type.id ? 'text-violet-200' : 'text-white/55'
                }`}>
                  {type.label}
                </div>
                <div className="text-white/25 text-xs mt-1">{type.desc}</div>
                {accommodation === type.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center text-white text-xs"
                    style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}
                  >
                    ✓
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Budget Breakdown Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="glass-card p-6 mt-4"
      >
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp size={14} className="text-violet-400" />
          <p className="text-white/60 text-sm font-medium">Estimated Budget Breakdown</p>
          <span className="ml-auto text-xs text-white/25">AI-calculated</span>
        </div>
        <div className="space-y-4">
          <BudgetBar
            label="Accommodation (35%)"
            percent={35}
            color="from-violet-500 to-purple-500"
            icon={Hotel}
            amount={breakdown.stay}
          />
          <BudgetBar
            label="Food & Dining (25%)"
            percent={25}
            color="from-orange-500 to-amber-500"
            icon={UtensilsCrossed}
            amount={breakdown.food}
          />
          <BudgetBar
            label="Transport (20%)"
            percent={20}
            color="from-blue-500 to-cyan-500"
            icon={Plane}
            amount={breakdown.transport}
          />
          <BudgetBar
            label="Activities (12%)"
            percent={12}
            color="from-emerald-500 to-teal-500"
            icon={Camera}
            amount={breakdown.activities}
          />
          <BudgetBar
            label="Miscellaneous (8%)"
            percent={8}
            color="from-rose-500 to-pink-500"
            icon={Wallet}
            amount={breakdown.misc}
          />
        </div>

        {tripData.destination?.avg_budget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-5 pt-4 border-t border-white/5 flex items-start gap-2"
          >
            <Sparkles size={13} className="text-violet-400 mt-0.5 shrink-0" />
            <p className="text-white/35 text-xs leading-relaxed">
              Suggested budget for{' '}
              <span className="text-violet-300">{tripData.destination.name}</span>
              {' '}is{' '}
              <span className="text-emerald-400">{tripData.destination.avg_budget}</span>
              {' '}per person. Your current budget is{' '}
              <span className={budget >= perPerson ? 'text-emerald-400' : 'text-amber-400'}>
                {budget >= perPerson ? 'well within range ✓' : 'slightly tight — consider adjusting'}
              </span>
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Validation hint */}
      <AnimatePresence>
        {!accommodation && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center text-white/25 text-sm mt-4"
          >
            Please select an accommodation type to continue
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
          Generate My Trip
          <Sparkles size={15} />
        </motion.button>
      </motion.div>
    </div>
  )
}