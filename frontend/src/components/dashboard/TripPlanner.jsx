import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Trash2, Clock, Sun, Sunset, Moon,
  MapPin, Sparkles, RotateCcw,
  ChevronDown, ChevronUp, GripVertical
} from 'lucide-react'

const buildDefaultItinerary = (destination, activities, duration) => {
  const days = Math.min(duration || 3, 7)
  const attractions = destination?.attractions || []

  const MORNING = [
    { label: 'Hotel Breakfast',        icon: '🍳', type: 'Food'      },
    { label: 'Morning Walk',           icon: '🚶', type: 'Wellness'  },
    { label: 'Local Market Visit',     icon: '🛒', type: 'Shopping'  },
    { label: 'Sunrise Viewpoint',      icon: '🌅', type: 'Nature'    },
    { label: 'Temple / Heritage Site', icon: '🛕', type: 'Heritage'  },
    { label: 'Guided City Tour',       icon: '🗺️', type: 'Cultural'  },
    { label: 'Beach Morning Walk',     icon: '🏖️', type: 'Nature'    },
  ]
  const AFTERNOON = [
    { label: 'Local Restaurant Lunch', icon: '🍜', type: 'Food'      },
    { label: 'Museum / Gallery',       icon: '🏛️', type: 'Cultural'  },
    { label: 'Shopping District',      icon: '🛍️', type: 'Shopping'  },
    { label: 'Adventure Activity',     icon: '🪂', type: 'Adventure' },
    { label: 'Nature Trail Hike',      icon: '🥾', type: 'Nature'    },
    { label: 'Boat / Water Activity',  icon: '⛵', type: 'Adventure' },
    { label: 'Spa & Relaxation',       icon: '🧘', type: 'Wellness'  },
  ]
  const EVENING = [
    { label: 'Sunset Viewpoint',       icon: '🌇', type: 'Nature'    },
    { label: 'Fine Dining Dinner',     icon: '🍽️', type: 'Food'      },
    { label: 'Night Market',           icon: '🌃', type: 'Shopping'  },
    { label: 'Cultural Show',          icon: '🎭', type: 'Cultural'  },
    { label: 'Rooftop Bar',            icon: '🥂', type: 'Nightlife' },
    { label: 'Beach Bonfire',          icon: '🔥', type: 'Leisure'   },
    { label: 'Hotel / Rest',           icon: '🏨', type: 'Rest'      },
  ]

  const result = {}
  for (let d = 1; d <= days; d++) {
    const ai = (d - 1) % Math.max(attractions.length, 1)
    const attr = attractions[ai]
    result[`day-${d}`] = {
      label: `Day ${d}`,
      morning: [
        {
          id: `d${d}-m1`,
          label: MORNING[(d - 1) % MORNING.length].label,
          icon:  MORNING[(d - 1) % MORNING.length].icon,
          type:  MORNING[(d - 1) % MORNING.length].type,
          time:  '8:00 AM', duration: '1.5 hrs',
        },
        attr ? {
          id: `d${d}-m2`,
          label: attr.name,
          icon:  attr.icon || '📍',
          type:  attr.category || 'Attraction',
          time:  '10:00 AM', duration: '2 hrs',
          notes: `Rating: ${attr.rating}⭐`,
        } : null,
      ].filter(Boolean),
      afternoon: [
        {
          id: `d${d}-a1`,
          label: AFTERNOON[(d - 1) % AFTERNOON.length].label,
          icon:  AFTERNOON[(d - 1) % AFTERNOON.length].icon,
          type:  AFTERNOON[(d - 1) % AFTERNOON.length].type,
          time:  '1:00 PM', duration: '2 hrs',
        },
        {
          id: `d${d}-a2`,
          label: attractions[(ai + 1) % Math.max(attractions.length, 1)]?.name || 'Free Exploration',
          icon:  attractions[(ai + 1) % Math.max(attractions.length, 1)]?.icon || '🗺️',
          type:  'Exploration',
          time:  '3:30 PM', duration: '1.5 hrs',
        },
      ],
      evening: [
        {
          id: `d${d}-e1`,
          label: EVENING[(d - 1) % EVENING.length].label,
          icon:  EVENING[(d - 1) % EVENING.length].icon,
          type:  EVENING[(d - 1) % EVENING.length].type,
          time:  '7:00 PM', duration: '2 hrs',
        },
      ],
    }
  }
  return result
}

const TYPE_COLORS = {
  Food:        { bg: 'rgba(245,158,11,0.2)',  border: 'rgba(245,158,11,0.4)',  text: '#fbbf24' },
  Cultural:    { bg: 'rgba(124,58,237,0.2)',  border: 'rgba(124,58,237,0.4)',  text: '#a78bfa' },
  Nature:      { bg: 'rgba(16,185,129,0.2)',  border: 'rgba(16,185,129,0.4)',  text: '#34d399' },
  Shopping:    { bg: 'rgba(236,72,153,0.2)',  border: 'rgba(236,72,153,0.4)',  text: '#f472b6' },
  Adventure:   { bg: 'rgba(239,68,68,0.2)',   border: 'rgba(239,68,68,0.4)',   text: '#f87171' },
  Heritage:    { bg: 'rgba(180,130,50,0.2)',  border: 'rgba(180,130,50,0.4)',  text: '#fcd34d' },
  Wellness:    { bg: 'rgba(6,182,212,0.2)',   border: 'rgba(6,182,212,0.4)',   text: '#67e8f9' },
  Nightlife:   { bg: 'rgba(99,102,241,0.2)',  border: 'rgba(99,102,241,0.4)',  text: '#818cf8' },
  Attraction:  { bg: 'rgba(37,99,235,0.2)',   border: 'rgba(37,99,235,0.4)',   text: '#60a5fa' },
  Exploration: { bg: 'rgba(20,184,166,0.2)',  border: 'rgba(20,184,166,0.4)',  text: '#2dd4bf' },
  Rest:        { bg: 'rgba(107,114,128,0.2)', border: 'rgba(107,114,128,0.4)', text: '#9ca3af' },
  Leisure:     { bg: 'rgba(251,191,36,0.2)',  border: 'rgba(251,191,36,0.4)',  text: '#fde68a' },
  Custom:      { bg: 'rgba(124,58,237,0.2)',  border: 'rgba(124,58,237,0.4)',  text: '#a78bfa' },
}

function getTypeStyle(type) {
  return TYPE_COLORS[type] || TYPE_COLORS.Exploration
}

// ── Activity Card with drag ──
function ActivityCard({ item, dayKey, slot, onDelete, onDragStart, onDragOver, onDrop, isDragOver }) {
  const ts = getTypeStyle(item.type)
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      draggable
      onDragStart={() => onDragStart(item, dayKey, slot)}
      onDragOver={e => { e.preventDefault(); onDragOver(item.id) }}
      onDrop={() => onDrop(item.id, dayKey, slot)}
      className="group flex items-start gap-2 p-3 rounded-xl cursor-grab active:cursor-grabbing transition-all"
      style={{
        background: isDragOver ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.04)',
        border: isDragOver
          ? '1px solid rgba(124,58,237,0.5)'
          : '1px solid rgba(255,255,255,0.07)',
        userSelect: 'none',
      }}
    >
      <GripVertical size={14} className="text-white/20 flex-shrink-0 mt-1" />
      <span className="text-lg flex-shrink-0">{item.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-1">
          <span className="text-white/85 text-xs font-semibold leading-tight truncate">
            {item.label}
          </span>
          <button
            onPointerDown={e => e.stopPropagation()}
            onClick={() => onDelete(dayKey, slot, item.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity w-5 h-5 rounded flex items-center justify-center hover:bg-red-500/20 flex-shrink-0"
          >
            <Trash2 size={10} className="text-red-400/70" />
          </button>
        </div>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ background: ts.bg, border: `1px solid ${ts.border}`, color: ts.text }}
          >
            {item.type}
          </span>
          <span className="text-white/30 text-xs flex items-center gap-1">
            <Clock size={9} />{item.time}
          </span>
          <span className="text-white/20 text-xs">{item.duration}</span>
        </div>
        {item.notes && (
          <p className="text-white/30 text-xs mt-1 truncate">{item.notes}</p>
        )}
      </div>
    </motion.div>
  )
}

// ── Slot column ──
function SlotColumn({ slot, items, dayKey, label, icon: Icon, color, accentBg,
  onDelete, onAdd, onDragStart, onDragOver, onDrop, dragOverId }) {
  const [showAdd, setShowAdd] = useState(false)
  const [newLabel, setNewLabel] = useState('')
  const [newTime,  setNewTime]  = useState('')

  const handleAdd = () => {
    if (!newLabel.trim()) return
    onAdd(dayKey, slot, {
      id: `${dayKey}-${slot}-${Date.now()}`,
      label: newLabel.trim(),
      icon: '📌', type: 'Custom',
      time: newTime || (slot === 'morning' ? '9:00 AM' : slot === 'afternoon' ? '2:00 PM' : '7:00 PM'),
      duration: '1 hr', notes: '',
    })
    setNewLabel('')
    setNewTime('')
    setShowAdd(false)
  }

  return (
    <div
      className="flex-1 rounded-2xl overflow-hidden"
      style={{ background: accentBg, border: '1px solid rgba(255,255,255,0.06)' }}
      onDragOver={e => e.preventDefault()}
      onDrop={() => onDrop(null, dayKey, slot)}
    >
      {/* Slot header */}
      <div className="px-3 py-2.5 flex items-center gap-2"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <Icon size={14} style={{ color }} />
        <span className="text-xs font-bold uppercase tracking-wider" style={{ color }}>
          {label}
        </span>
        <span className="ml-auto text-xs px-2 py-0.5 rounded-full"
          style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.35)' }}>
          {items.length}
        </span>
      </div>

      {/* Items */}
      <div className="p-2 space-y-1.5 min-h-20">
        <AnimatePresence>
          {items.map(item => (
            <ActivityCard
              key={item.id}
              item={item}
              dayKey={dayKey}
              slot={slot}
              onDelete={onDelete}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDrop={onDrop}
              isDragOver={dragOverId === item.id}
            />
          ))}
        </AnimatePresence>
        {items.length === 0 && (
          <div
            className="text-center py-4 text-white/20 text-xs rounded-xl border border-dashed"
            style={{ borderColor: 'rgba(255,255,255,0.08)' }}
          >
            Drop here
          </div>
        )}
      </div>

      {/* Add */}
      <div className="px-2 pb-2">
        <AnimatePresence>
          {showAdd ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden space-y-2"
            >
              <input
                autoFocus
                value={newLabel}
                onChange={e => setNewLabel(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAdd()}
                placeholder="Activity name..."
                className="w-full text-xs px-3 py-2 rounded-xl outline-none text-white placeholder-white/25"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
              />
              <input
                value={newTime}
                onChange={e => setNewTime(e.target.value)}
                placeholder="Time e.g. 9:00 AM"
                className="w-full text-xs px-3 py-2 rounded-xl outline-none text-white placeholder-white/25"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
              />
              <div className="flex gap-2">
                <button onClick={handleAdd}
                  className="flex-1 py-1.5 rounded-xl text-xs font-medium text-white"
                  style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)' }}>
                  Add
                </button>
                <button onClick={() => setShowAdd(false)}
                  className="px-3 py-1.5 rounded-xl text-xs text-white/40"
                  style={{ background: 'rgba(255,255,255,0.06)' }}>
                  ✕
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setShowAdd(true)}
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs text-white/25 hover:text-white/50 transition-colors"
              style={{ background: 'rgba(255,255,255,0.03)' }}
            >
              <Plus size={12} /> Add activity
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ── Day Card ──
function DayCard({ dayKey, day, dayIndex, startDate, onDelete, onAdd,
  onDragStart, onDragOver, onDrop, dragOverId }) {
  const [collapsed, setCollapsed] = useState(false)

  const dateLabel = (() => {
    if (!startDate) return ''
    const d = new Date(startDate)
    d.setDate(d.getDate() + dayIndex)
    return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
  })()

  const total =
    (day.morning?.length || 0) +
    (day.afternoon?.length || 0) +
    (day.evening?.length || 0)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card-strong overflow-hidden"
    >
      <button
        onClick={() => setCollapsed(c => !c)}
        className="w-full flex items-center justify-between p-4"
        style={{ background: 'rgba(255,255,255,0.01)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black text-white"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)' }}
          >
            {dayIndex + 1}
          </div>
          <div className="text-left">
            <div className="text-white font-bold text-sm">{day.label}</div>
            <div className="text-white/40 text-xs">
              {dateLabel || `Day ${dayIndex + 1}`} · {total} activities
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {['morning','afternoon','evening'].map(slot => (
            <span key={slot}
              className="text-xs px-2 py-0.5 rounded-full hidden sm:block"
              style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.3)' }}>
              {day[slot]?.length || 0}
            </span>
          ))}
          {collapsed
            ? <ChevronDown size={15} className="text-white/30" />
            : <ChevronUp size={15} className="text-white/30" />}
        </div>
      </button>

      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <SlotColumn
                slot="morning" items={day.morning || []} dayKey={dayKey}
                label="Morning" icon={Sun} color="#fbbf24"
                accentBg="rgba(245,158,11,0.05)"
                onDelete={onDelete} onAdd={onAdd}
                onDragStart={onDragStart} onDragOver={onDragOver}
                onDrop={onDrop} dragOverId={dragOverId}
              />
              <SlotColumn
                slot="afternoon" items={day.afternoon || []} dayKey={dayKey}
                label="Afternoon" icon={Sunset} color="#f97316"
                accentBg="rgba(249,115,22,0.05)"
                onDelete={onDelete} onAdd={onAdd}
                onDragStart={onDragStart} onDragOver={onDragOver}
                onDrop={onDrop} dragOverId={dragOverId}
              />
              <SlotColumn
                slot="evening" items={day.evening || []} dayKey={dayKey}
                label="Evening" icon={Moon} color="#818cf8"
                accentBg="rgba(99,102,241,0.05)"
                onDelete={onDelete} onAdd={onAdd}
                onDragStart={onDragStart} onDragOver={onDragOver}
                onDrop={onDrop} dragOverId={dragOverId}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ── Main Component ──
export default function TripPlanner({ tripData }) {
  const destination = tripData?.destination
  const duration    = tripData?.tripDetails?.duration || 3
  const startDate   = tripData?.tripDetails?.startDate || ''
  const activities  = tripData?.activities || []

  const [itinerary, setItinerary] = useState(() =>
    buildDefaultItinerary(destination, activities, duration)
  )

  // Drag state — plain React, no library
  const [dragItem,    setDragItem]    = useState(null) // { item, fromDay, fromSlot }
  const [dragOverId,  setDragOverId]  = useState(null)

  const handleDragStart = (item, fromDay, fromSlot) => {
    setDragItem({ item, fromDay, fromSlot })
  }

  const handleDragOver = (overId) => {
    setDragOverId(overId)
  }

  const handleDrop = (targetId, targetDay, targetSlot) => {
    if (!dragItem) return
    const { item, fromDay, fromSlot } = dragItem

    setItinerary(prev => {
      const next = JSON.parse(JSON.stringify(prev))

      // Remove from source
      next[fromDay][fromSlot] = next[fromDay][fromSlot].filter(i => i.id !== item.id)

      // Insert into target
      if (targetId && targetId !== item.id) {
        const targetItems = next[targetDay][targetSlot]
        const idx = targetItems.findIndex(i => i.id === targetId)
        if (idx !== -1) {
          targetItems.splice(idx, 0, item)
        } else {
          targetItems.push(item)
        }
      } else {
        next[targetDay][targetSlot].push(item)
      }

      return next
    })

    setDragItem(null)
    setDragOverId(null)
  }

  const handleDelete = (dayKey, slot, itemId) => {
    setItinerary(prev => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        [slot]: prev[dayKey][slot].filter(i => i.id !== itemId),
      },
    }))
  }

  const handleAdd = (dayKey, slot, item) => {
    setItinerary(prev => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        [slot]: [...(prev[dayKey][slot] || []), item],
      },
    }))
  }

  const handleReset = () => {
    setItinerary(buildDefaultItinerary(destination, activities, duration))
  }

  const totalActivities = Object.values(itinerary).reduce(
    (sum, day) =>
      sum +
      (day.morning?.length || 0) +
      (day.afternoon?.length || 0) +
      (day.evening?.length || 0),
    0
  )

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#06b6d4)' }}>
            🗓️
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Itinerary Builder</h2>
            <p className="text-white/40 text-xs">
              {destination?.name} · {duration} days · {totalActivities} activities
            </p>
          </div>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleReset}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-white/60"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <RotateCcw size={13} /> Reset
        </motion.button>
      </div>

      {/* Tip */}
      <div className="flex items-center gap-3 p-3 rounded-xl"
        style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)' }}>
        <Sparkles size={15} className="text-violet-400 flex-shrink-0" />
        <p className="text-white/50 text-xs leading-relaxed">
          <span className="text-violet-300 font-semibold">Drag & drop</span> activity
          cards to reorder or move between Morning → Afternoon → Evening.
          Click <span className="text-violet-300 font-semibold">+ Add activity</span> to
          insert custom plans.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Morning',   icon: Sun,    color: '#fbbf24',
            count: Object.values(itinerary).reduce((s,d) => s+(d.morning?.length||0),0) },
          { label: 'Afternoon', icon: Sunset, color: '#f97316',
            count: Object.values(itinerary).reduce((s,d) => s+(d.afternoon?.length||0),0) },
          { label: 'Evening',   icon: Moon,   color: '#818cf8',
            count: Object.values(itinerary).reduce((s,d) => s+(d.evening?.length||0),0) },
        ].map(stat => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="p-3 rounded-xl text-center"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <Icon size={16} style={{ color: stat.color }} className="mx-auto mb-1" />
              <div className="text-white font-bold text-lg">{stat.count}</div>
              <div className="text-white/35 text-xs">{stat.label}</div>
            </div>
          )
        })}
      </div>

      {/* Day Cards */}
      <div className="space-y-4">
        {Object.entries(itinerary).map(([dayKey, day], index) => (
          <DayCard
            key={dayKey}
            dayKey={dayKey}
            day={day}
            dayIndex={index}
            startDate={startDate}
            onDelete={handleDelete}
            onAdd={handleAdd}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            dragOverId={dragOverId}
          />
        ))}
      </div>

      {/* Summary */}
      <div className="p-4 rounded-2xl"
        style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
        <div className="flex items-center gap-2 mb-3">
          <MapPin size={14} className="text-emerald-400" />
          <span className="text-emerald-400 text-sm font-semibold">Trip Summary</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total Days',        value: duration },
            { label: 'Total Activities',  value: totalActivities },
            { label: 'Destination',       value: destination?.name || 'N/A' },
            { label: 'Start Date',        value: startDate
                ? new Date(startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
                : 'N/A' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className="text-white font-bold text-sm">{s.value}</div>
              <div className="text-white/35 text-xs">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}