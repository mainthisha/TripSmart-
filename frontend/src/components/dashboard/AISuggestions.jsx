import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles, AlertTriangle, CheckCircle,
  TrendingDown, Cloud, Map, Clock,
  ChevronRight, RefreshCw, X
} from 'lucide-react'

function generateSuggestions(tripData) {
  const suggestions = []
  const dest    = tripData?.destination
  const details = tripData?.tripDetails || {}
  const budget  = tripData?.budget || {}
  const acts    = tripData?.activities || []

  // Budget analysis
  if (budget.total && budget.perDay) {
    if (budget.perDay < 2000) {
      suggestions.push({
        id: 'budget-low',
        type: 'warning',
        icon: '💸',
        title: 'Budget Might Be Tight',
        desc: `₹${Math.round(budget.perDay).toLocaleString('en-IN')} per day is quite low. Consider increasing by ₹${(3000 - budget.perDay).toLocaleString('en-IN')} for a comfortable trip.`,
        action: 'Adjust Budget',
        color: 'rgba(245,158,11,0.15)',
        border: 'rgba(245,158,11,0.3)',
        iconBg: 'linear-gradient(135deg,#f59e0b,#d97706)',
        textColor: '#fbbf24',
      })
    }
    if (budget.perPerson && budget.perPerson > 150000) {
      suggestions.push({
        id: 'budget-high',
        type: 'success',
        icon: '💎',
        title: 'Premium Budget Detected',
        desc: 'Your budget allows for luxury experiences. Consider upgrading to 5-star stays or private tours.',
        action: 'Explore Luxury Options',
        color: 'rgba(124,58,237,0.15)',
        border: 'rgba(124,58,237,0.3)',
        iconBg: 'linear-gradient(135deg,#7c3aed,#2563eb)',
        textColor: '#a78bfa',
      })
    }
  }

  // Activities
  if (acts.length < 3) {
    suggestions.push({
      id: 'more-activities',
      type: 'tip',
      icon: '🎯',
      title: 'Add More Activity Preferences',
      desc: 'You selected fewer than 3 activities. Add more to get a richer, more personalized itinerary.',
      action: 'Add Activities',
      color: 'rgba(37,99,235,0.15)',
      border: 'rgba(37,99,235,0.3)',
      iconBg: 'linear-gradient(135deg,#2563eb,#06b6d4)',
      textColor: '#60a5fa',
    })
  }

  if (acts.length >= 5) {
    suggestions.push({
      id: 'activities-good',
      type: 'success',
      icon: '✅',
      title: 'Great Activity Mix!',
      desc: `You have ${acts.length} diverse activities. Your itinerary will be well-balanced and exciting.`,
      action: null,
      color: 'rgba(16,185,129,0.15)',
      border: 'rgba(16,185,129,0.3)',
      iconBg: 'linear-gradient(135deg,#10b981,#059669)',
      textColor: '#34d399',
    })
  }

  // Duration
  if (details.duration && details.duration > 10) {
    suggestions.push({
      id: 'long-trip',
      type: 'tip',
      icon: '📅',
      title: 'Long Trip Detected',
      desc: `${details.duration} nights is a long trip! Consider splitting into multiple destinations for variety.`,
      action: 'Plan Multi-city',
      color: 'rgba(99,102,241,0.15)',
      border: 'rgba(99,102,241,0.3)',
      iconBg: 'linear-gradient(135deg,#6366f1,#4f46e5)',
      textColor: '#818cf8',
    })
  }

  if (details.duration && details.duration <= 3) {
    suggestions.push({
      id: 'short-trip',
      type: 'warning',
      icon: '⏰',
      title: 'Short Trip — Prioritize!',
      desc: `Only ${details.duration} nights means limited time. Focus on the top 3–4 attractions to avoid rushing.`,
      action: 'Optimize Itinerary',
      color: 'rgba(239,68,68,0.15)',
      border: 'rgba(239,68,68,0.3)',
      iconBg: 'linear-gradient(135deg,#ef4444,#dc2626)',
      textColor: '#f87171',
    })
  }

  // Destination-specific
  if (dest) {
    // Weather suggestions
    if (['Goa','Bali','Maldives','Phuket','Hawaii'].includes(dest.name)) {
      suggestions.push({
        id: 'beach-weather',
        type: 'tip',
        icon: '☀️',
        title: 'Beach Destination Tips',
        desc: 'Pack reef-safe sunscreen, light breathable clothes, and check monsoon season before booking.',
        action: null,
        color: 'rgba(6,182,212,0.15)',
        border: 'rgba(6,182,212,0.3)',
        iconBg: 'linear-gradient(135deg,#06b6d4,#0284c7)',
        textColor: '#67e8f9',
      })
    }
    if (['Manali','Switzerland','Ooty'].includes(dest.name)) {
      suggestions.push({
        id: 'mountain-weather',
        type: 'warning',
        icon: '🧥',
        title: 'Cold Weather Alert',
        desc: 'Mountain destinations require thermal wear. Pack layers and check road conditions before travel.',
        action: 'View Packing List',
        color: 'rgba(148,163,184,0.15)',
        border: 'rgba(148,163,184,0.3)',
        iconBg: 'linear-gradient(135deg,#94a3b8,#64748b)',
        textColor: '#cbd5e1',
      })
    }
    if (['Dubai','Singapore','Paris','London','Tokyo'].includes(dest.name)) {
      suggestions.push({
        id: 'international-docs',
        type: 'warning',
        icon: '📄',
        title: 'Check Visa Requirements',
        desc: `International travel to ${dest.name} may require a visa. Check your visa status well in advance.`,
        action: 'Check Visa Info',
        color: 'rgba(251,191,36,0.15)',
        border: 'rgba(251,191,36,0.3)',
        iconBg: 'linear-gradient(135deg,#fbbf24,#f59e0b)',
        textColor: '#fde68a',
      })
    }

    // Hidden gems suggestion
    if (dest.hidden_gems?.length > 0) {
      suggestions.push({
        id: 'hidden-gems',
        type: 'tip',
        icon: '💎',
        title: `${dest.hidden_gems.length} Hidden Gems Found!`,
        desc: `Discover secret spots in ${dest.name} that most tourists miss. Check the Hidden Gems section below.`,
        action: null,
        color: 'rgba(236,72,153,0.15)',
        border: 'rgba(236,72,153,0.3)',
        iconBg: 'linear-gradient(135deg,#ec4899,#db2777)',
        textColor: '#f9a8d4',
      })
    }
  }

  // Traveler count
  if (details.travelers >= 6) {
    suggestions.push({
      id: 'group-booking',
      type: 'tip',
      icon: '👥',
      title: 'Group Discount Available',
      desc: `Traveling with ${details.travelers} people? Many hotels & tours offer group discounts of 10–20%.`,
      action: null,
      color: 'rgba(16,185,129,0.15)',
      border: 'rgba(16,185,129,0.3)',
      iconBg: 'linear-gradient(135deg,#10b981,#059669)',
      textColor: '#34d399',
    })
  }

  // General always-show tip
  suggestions.push({
    id: 'offline-maps',
    type: 'tip',
    icon: '📱',
    title: 'Download Offline Maps',
    desc: 'Save Google Maps offline for your destination before leaving. Works without internet abroad.',
    action: null,
    color: 'rgba(124,58,237,0.1)',
    border: 'rgba(124,58,237,0.2)',
    iconBg: 'linear-gradient(135deg,#7c3aed,#2563eb)',
    textColor: '#a78bfa',
  })

  return suggestions
}

const TYPE_ICONS = {
  warning: AlertTriangle,
  success: CheckCircle,
  tip:     Sparkles,
}

export default function SmartSuggestions({ tripData }) {
  const [dismissed, setDismissed] = useState([])
  const [refreshKey, setRefreshKey] = useState(0)

  const all         = generateSuggestions(tripData)
  const visible     = all.filter(s => !dismissed.includes(s.id))
  const dismiss     = (id) => setDismissed(p => [...p, id])
  const resetAll    = () => { setDismissed([]); setRefreshKey(k => k+1) }

  if (!tripData?.destination) return null

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <p className="text-white/40 text-xs font-medium uppercase tracking-widest">
            {visible.length} active suggestion{visible.length !== 1 ? 's' : ''}
          </p>
        </div>
        {dismissed.length > 0 && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={resetAll}
            className="flex items-center gap-1.5 text-xs text-white/35 hover:text-white/60 transition-colors"
          >
            <RefreshCw size={11} /> Reset
          </motion.button>
        )}
      </div>

      {/* Cards */}
      <AnimatePresence>
        {visible.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-10"
          >
            <div className="text-4xl mb-3">🎉</div>
            <p className="text-white/40 text-sm font-medium">
              Your trip looks great! No suggestions right now.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {visible.map((s, i) => {
              const TypeIcon = TYPE_ICONS[s.type] || Sparkles
              return (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 16, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, height: 0 }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="relative p-4 rounded-2xl"
                  style={{
                    background: s.color,
                    border: `1px solid ${s.border}`,
                  }}
                >
                  {/* Dismiss */}
                  <button
                    onClick={() => dismiss(s.id)}
                    className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center text-white/25 hover:text-white/60 hover:bg-white/10 transition-all"
                  >
                    <X size={11} />
                  </button>

                  <div className="flex items-start gap-3 pr-5">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                      style={{ background: s.iconBg, boxShadow: `0 4px 12px ${s.border}` }}
                    >
                      {s.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white/85 font-semibold text-sm mb-1 leading-tight">
                        {s.title}
                      </div>
                      <p className="text-white/45 text-xs leading-relaxed">{s.desc}</p>
                      {s.action && (
                        <button
                          className="mt-2 flex items-center gap-1 text-xs font-semibold transition-colors"
                          style={{ color: s.textColor }}
                        >
                          {s.action} <ChevronRight size={11} />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}