import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar, Clock, Users, ChevronUp, ChevronDown,
  MapPin, Plane, ArrowLeft
} from 'lucide-react'
import { TRIP_TYPES } from '../../data/destinations'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
}

function Counter({ value, onChange, min = 1, max = 30, label, icon: Icon }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl"
      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(124,58,237,0.2)' }}>
          <Icon size={16} className="text-violet-400" />
        </div>
        <span className="text-white/70 font-medium text-sm">{label}</span>
      </div>
      <div className="flex items-center gap-3">
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 disabled:opacity-30"
          style={{ background: 'rgba(124,58,237,0.25)', border: '1px solid rgba(124,58,237,0.3)' }}
        >
          <ChevronDown size={16} className="text-violet-300" />
        </motion.button>

        <motion.span
          key={value}
          initial={{ scale: 1.3, color: '#a78bfa' }}
          animate={{ scale: 1, color: '#ffffff' }}
          className="text-white font-bold text-lg w-8 text-center"
        >
          {value}
        </motion.span>

        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 disabled:opacity-30"
          style={{ background: 'rgba(124,58,237,0.25)', border: '1px solid rgba(124,58,237,0.3)' }}
        >
          <ChevronUp size={16} className="text-violet-300" />
        </motion.button>
      </div>
    </div>
  )
}

export default function TripDetailsStep({ onNext, onBack, tripData, updateTripData }) {
  const saved = tripData.tripDetails || {}

  const [startDate, setStartDate] = useState(saved.startDate || '')
  const [duration, setDuration] = useState(saved.duration || 5)
  const [travelers, setTravelers] = useState(saved.travelers || 2)
  const [tripType, setTripType] = useState(saved.tripType || null)

  const today = new Date().toISOString().split('T')[0]

  const getEndDate = () => {
    if (!startDate) return null
    const end = new Date(startDate)
    end.setDate(end.getDate() + duration)
    return end.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const isValid = startDate && tripType

  const handleNext = () => {
    if (!isValid) return
    updateTripData('tripDetails', { startDate, duration, travelers, tripType })
    onNext()
  }

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
          📅
        </motion.div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">
          <span className="bg-gradient-to-r from-violet-300 via-blue-300 to-cyan-300 bg-clip-text text-transparent">
            Plan your trip
          </span>
          <br />
          <span className="text-white">details</span>
        </h1>

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
              {tripData.destination.emoji} {tripData.destination.name}, {tripData.destination.country}
            </span>
          </motion.div>
        )}
      </motion.div>

      {/* Main Glass Card */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="glass-card-strong p-6 sm:p-8 space-y-6"
      >
        {/* Date & Duration Row */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Start Date */}
          <div>
            <label className="flex items-center gap-2 text-white/60 text-sm font-medium mb-2">
              <Calendar size={14} className="text-violet-400" />
              Start Date
            </label>
            <div className="relative">
              <input
                type="date"
                min={today}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="input-glass w-full"
                style={{ colorScheme: 'dark' }}
              />
            </div>
            {startDate && getEndDate() && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-emerald-400 mt-1.5 flex items-center gap-1"
              >
                <Plane size={11} />
                Returns: {getEndDate()}
              </motion.p>
            )}
          </div>

          {/* Duration */}
          <div>
            <label className="flex items-center gap-2 text-white/60 text-sm font-medium mb-2">
              <Clock size={14} className="text-violet-400" />
              Trip Duration
            </label>
            <div className="flex items-center gap-3">
              {[3, 5, 7, 10, 14].map((d) => (
                <motion.button
                  key={d}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setDuration(d)}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-200"
                  style={duration === d ? {
                    background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
                    color: 'white',
                    boxShadow: '0 4px 15px rgba(124,58,237,0.4)'
                  } : {
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: 'rgba(255,255,255,0.5)'
                  }}
                >
                  {d}d
                </motion.button>
              ))}
            </div>
            <div className="mt-3">
              <Counter
                value={duration}
                onChange={setDuration}
                min={1}
                max={60}
                label={`${duration} ${duration === 1 ? 'Night' : 'Nights'}`}
                icon={Clock}
              />
            </div>
          </div>
        </motion.div>

        {/* Divider */}
        <motion.div
          variants={itemVariants}
          className="border-t border-white/5"
        />

        {/* Travelers Counter */}
        <motion.div variants={itemVariants}>
          <label className="flex items-center gap-2 text-white/60 text-sm font-medium mb-3">
            <Users size={14} className="text-violet-400" />
            Number of Travelers
          </label>
          <Counter
            value={travelers}
            onChange={setTravelers}
            min={1}
            max={20}
            label={`${travelers} ${travelers === 1 ? 'Traveler' : 'Travelers'}`}
            icon={Users}
          />
          {/* Quick select */}
          <div className="flex gap-2 mt-3 flex-wrap">
            {[
              { label: 'Solo', value: 1, emoji: '🧳' },
              { label: 'Couple', value: 2, emoji: '💑' },
              { label: 'Family', value: 4, emoji: '👨‍👩‍👧‍👦' },
              { label: 'Group', value: 8, emoji: '👯' },
            ].map((opt) => (
              <motion.button
                key={opt.label}
                whileTap={{ scale: 0.93 }}
                onClick={() => setTravelers(opt.value)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
                style={travelers === opt.value ? {
                  background: 'linear-gradient(135deg, rgba(124,58,237,0.4), rgba(37,99,235,0.4))',
                  border: '1px solid rgba(124,58,237,0.5)',
                  color: 'rgba(196,181,253,1)'
                } : {
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: 'rgba(255,255,255,0.45)'
                }}
              >
                <span>{opt.emoji}</span>
                <span>{opt.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Divider */}
        <motion.div variants={itemVariants} className="border-t border-white/5" />

        {/* Trip Type */}
        <motion.div variants={itemVariants}>
          <label className="flex items-center gap-2 text-white/60 text-sm font-medium mb-3">
            <Plane size={14} className="text-violet-400" />
            Trip Type
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {TRIP_TYPES.map((type) => (
              <motion.button
                key={type.id}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setTripType(type.id)}
                className="relative p-4 rounded-2xl text-center transition-all duration-300 overflow-hidden"
                style={tripType === type.id ? {
                  background: 'linear-gradient(135deg, rgba(124,58,237,0.35), rgba(37,99,235,0.35))',
                  border: '1px solid rgba(139,92,246,0.6)',
                  boxShadow: '0 4px 20px rgba(124,58,237,0.25)'
                } : {
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)'
                }}
              >
                <div className="text-2xl mb-1.5">{type.emoji}</div>
                <div className={`text-xs font-semibold transition-colors ${
                  tripType === type.id ? 'text-violet-200' : 'text-white/55'
                }`}>
                  {type.label}
                </div>
                {tripType === type.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center text-white text-[9px]"
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

      {/* Trip Summary Card */}
      <AnimatePresence>
        {startDate && tripType && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4 }}
            className="glass-card p-5 mt-4"
          >
            <p className="text-white/40 text-xs font-medium uppercase tracking-widest mb-3">
              Trip Summary
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                {
                  label: 'Destination',
                  value: tripData.destination?.name || '—',
                  emoji: tripData.destination?.emoji || '📍'
                },
                {
                  label: 'Start Date',
                  value: new Date(startDate).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'short', year: 'numeric'
                  }),
                  emoji: '📅'
                },
                {
                  label: 'Duration',
                  value: `${duration} Nights`,
                  emoji: '🌙'
                },
                {
                  label: 'Travelers',
                  value: `${travelers} ${travelers === 1 ? 'Person' : 'People'}`,
                  emoji: '👥'
                },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <div className="text-xl mb-1">{item.emoji}</div>
                  <div className="text-white font-semibold text-sm">{item.value}</div>
                  <div className="text-white/35 text-xs mt-0.5">{item.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
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
          className="btn-primary px-10 py-3 text-base disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Continue → Activities
        </motion.button>
      </motion.div>
    </div>
  )
}