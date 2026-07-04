import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react'

const DEFAULT_CHECKLIST = {
  before: {
    label: 'Before Trip',
    emoji: '📋',
    color: 'from-violet-500 to-purple-600',
    accent: 'rgba(124,58,237,0.15)',
    border: 'rgba(124,58,237,0.25)',
    items: [
      'Book flight tickets',
      'Reserve hotel / accommodation',
      'Apply for visa (if required)',
      'Get travel insurance',
      'Check passport validity (6+ months)',
      'Exchange currency / load forex card',
      'Download offline maps',
      'Inform bank about travel',
      'Pack all medicines',
      'Print hotel & ticket confirmations',
    ]
  },
  during: {
    label: 'During Trip',
    emoji: '✈️',
    color: 'from-blue-500 to-cyan-500',
    accent: 'rgba(37,99,235,0.15)',
    border: 'rgba(37,99,235,0.25)',
    items: [
      'Check in to hotel on arrival',
      'Buy local SIM card',
      'Note emergency numbers',
      'Keep cash for tips and local vendors',
      'Stay hydrated daily',
      'Take photos and back them up',
      'Check weather daily',
      'Keep documents in hotel safe',
      'Explore local food spots',
      'Respect local customs',
    ]
  },
  after: {
    label: 'After Trip',
    emoji: '🏠',
    color: 'from-emerald-500 to-teal-500',
    accent: 'rgba(16,185,129,0.15)',
    border: 'rgba(16,185,129,0.25)',
    items: [
      'Upload and back up all photos',
      'Write a travel review / journal',
      'Claim travel insurance if needed',
      'Return borrowed items',
      'Sort and wash clothes',
      'Share trip highlights with friends',
      'Note lessons for next trip',
      'Check for any pending bills',
    ]
  }
}

function Section({ sectionKey, section, items, onToggle, onAdd, onDelete }) {
  const [open, setOpen]       = useState(true)
  const [newItem, setNewItem] = useState('')
  const [adding, setAdding]   = useState(false)

  const checked = items.filter(i => i.checked).length
  const total   = items.length
  const pct     = total ? Math.round((checked / total) * 100) : 0

  const handleAdd = () => {
    if (newItem.trim()) {
      onAdd(sectionKey, newItem.trim())
      setNewItem('')
      setAdding(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl overflow-hidden"
      style={{ background: section.accent, border: `1px solid ${section.border}` }}
    >
      {/* Section Header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full p-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg bg-gradient-to-br ${section.color}`}>
            {section.emoji}
          </div>
          <div className="text-left">
            <div className="text-white font-semibold text-sm">{section.label}</div>
            <div className="text-white/40 text-xs">{checked}/{total} completed · {pct}%</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {pct === 100 && (
            <span className="text-xs text-emerald-400 font-semibold">✓ Done</span>
          )}
          {open
            ? <ChevronUp size={16} className="text-white/40" />
            : <ChevronDown size={16} className="text-white/40" />}
        </div>
      </button>

      {/* Progress bar */}
      <div className="h-1 w-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <motion.div
          className={`h-full bg-gradient-to-r ${section.color}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6 }}
        />
      </div>

      {/* Items */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-3 space-y-2">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  className="flex items-center gap-3 group"
                >
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={() => onToggle(sectionKey, item.id)}
                    className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-all"
                    style={item.checked ? {
                      background: 'linear-gradient(135deg, #7c3aed, #2563eb)'
                    } : {
                      border: '2px solid rgba(255,255,255,0.2)'
                    }}
                  >
                    {item.checked && <Check size={11} className="text-white" />}
                  </motion.button>
                  <span className={`flex-1 text-xs transition-all ${
                    item.checked ? 'line-through text-white/25' : 'text-white/70'
                  }`}>
                    {item.name}
                  </span>
                  <button
                    onClick={() => onDelete(sectionKey, item.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity w-5 h-5 rounded flex items-center justify-center hover:bg-red-500/20"
                  >
                    <Trash2 size={9} className="text-red-400/60" />
                  </button>
                </motion.div>
              ))}

              {/* Add Item */}
              <AnimatePresence>
                {adding ? (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex gap-2 mt-2"
                  >
                    <input
                      autoFocus
                      value={newItem}
                      onChange={e => setNewItem(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleAdd()}
                      placeholder="Add item..."
                      className="flex-1 text-xs px-3 py-2 rounded-xl outline-none text-white placeholder-white/30"
                      style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
                    />
                    <button onClick={handleAdd}
                      className="px-3 py-2 rounded-xl text-xs text-white font-medium"
                      style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}>
                      Add
                    </button>
                    <button onClick={() => setAdding(false)}
                      className="px-2 py-2 rounded-xl text-white/40"
                      style={{ background: 'rgba(255,255,255,0.06)' }}>
                      ✕
                    </button>
                  </motion.div>
                ) : (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => setAdding(true)}
                    className="flex items-center gap-2 text-xs text-white/30 hover:text-white/60 transition-colors mt-2 w-full"
                  >
                    <Plus size={12} /> Add custom item
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function PreDepartureChecklist({ tripData }) {
  const [checklist, setChecklist] = useState(() => {
    const state = {}
    Object.entries(DEFAULT_CHECKLIST).forEach(([key, section]) => {
      state[key] = section.items.map((name, i) => ({
        id: `${key}-${i}`,
        name,
        checked: false
      }))
    })
    return state
  })

  const totalItems   = Object.values(checklist).flat().length
  const checkedItems = Object.values(checklist).flat().filter(i => i.checked).length
  const overallPct   = totalItems ? Math.round((checkedItems / totalItems) * 100) : 0

  const handleToggle = (sectionKey, itemId) => {
    setChecklist(prev => ({
      ...prev,
      [sectionKey]: prev[sectionKey].map(i =>
        i.id === itemId ? { ...i, checked: !i.checked } : i
      )
    }))
  }

  const handleAdd = (sectionKey, name) => {
    setChecklist(prev => ({
      ...prev,
      [sectionKey]: [...prev[sectionKey], {
        id: `${sectionKey}-${Date.now()}`,
        name,
        checked: false
      }]
    }))
  }

  const handleDelete = (sectionKey, itemId) => {
    setChecklist(prev => ({
      ...prev,
      [sectionKey]: prev[sectionKey].filter(i => i.id !== itemId)
    }))
  }

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
          style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
          ✅
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Pre-Departure Checklist</h2>
          <p className="text-white/40 text-xs">Track everything before, during & after</p>
        </div>
      </div>

      {/* Overall Progress */}
      <motion.div
        className="p-4 rounded-2xl"
        style={{
          background: overallPct === 100
            ? 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(5,150,105,0.15))'
            : 'rgba(255,255,255,0.04)',
          border: overallPct === 100
            ? '1px solid rgba(16,185,129,0.3)'
            : '1px solid rgba(255,255,255,0.07)'
        }}
      >
        <div className="flex justify-between items-center mb-2">
          <span className="text-white/60 text-sm font-medium">Overall Progress</span>
          <motion.span
            key={overallPct}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className={`text-xl font-bold ${overallPct === 100 ? 'text-emerald-400' : 'text-violet-300'}`}
          >
            {overallPct}%
          </motion.span>
        </div>
        <div className="h-2.5 rounded-full overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.08)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: overallPct === 100
              ? 'linear-gradient(90deg, #10b981, #059669)'
              : 'linear-gradient(90deg, #7c3aed, #2563eb, #06b6d4)'
            }}
            initial={{ width: 0 }}
            animate={{ width: `${overallPct}%` }}
            transition={{ duration: 0.8 }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-white/30 text-xs">{checkedItems} of {totalItems} tasks done</span>
          {overallPct === 100
            ? <span className="text-emerald-400 text-xs font-semibold">🎉 All set!</span>
            : <span className="text-white/30 text-xs">{totalItems - checkedItems} remaining</span>}
        </div>
      </motion.div>

      {/* Three Sections */}
      <div className="space-y-4">
        {Object.entries(DEFAULT_CHECKLIST).map(([key, section]) => (
          <Section
            key={key}
            sectionKey={key}
            section={section}
            items={checklist[key] || []}
            onToggle={handleToggle}
            onAdd={handleAdd}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  )
}