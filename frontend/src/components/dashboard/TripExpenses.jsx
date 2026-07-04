import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Trash2, Wallet, TrendingUp,
  UtensilsCrossed, Plane, Hotel,
  Camera, ShoppingBag, MoreHorizontal,
  PieChart, AlertCircle
} from 'lucide-react'

const CATEGORIES = [
  { id: 'food',        label: 'Food & Dining',  icon: '🍜', emoji: UtensilsCrossed, color: '#f97316', bg: 'rgba(249,115,22,0.2)'  },
  { id: 'transport',   label: 'Transport',       icon: '✈️', emoji: Plane,           color: '#60a5fa', bg: 'rgba(96,165,250,0.2)'  },
  { id: 'stay',        label: 'Accommodation',   icon: '🏨', emoji: Hotel,           color: '#a78bfa', bg: 'rgba(167,139,250,0.2)' },
  { id: 'activities',  label: 'Activities',      icon: '🎯', emoji: Camera,          color: '#34d399', bg: 'rgba(52,211,153,0.2)'  },
  { id: 'shopping',    label: 'Shopping',        icon: '🛍️', emoji: ShoppingBag,     color: '#f472b6', bg: 'rgba(244,114,182,0.2)' },
  { id: 'other',       label: 'Other',           icon: '💫', emoji: MoreHorizontal,  color: '#94a3b8', bg: 'rgba(148,163,184,0.2)' },
]

function fmt(v) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0,
  }).format(v || 0)
}

export default function ExpenseTracker({ tripData }) {
  const totalBudget = tripData?.budget?.total || 0

  const [expenses, setExpenses] = useState([
    { id: 1, label: 'Hotel Check-in',   category: 'stay',      amount: 3500,  date: new Date().toISOString().split('T')[0] },
    { id: 2, label: 'Airport Taxi',     category: 'transport', amount: 850,   date: new Date().toISOString().split('T')[0] },
    { id: 3, label: 'Dinner at Resort', category: 'food',      amount: 1200,  date: new Date().toISOString().split('T')[0] },
  ])

  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ label: '', category: 'food', amount: '', date: new Date().toISOString().split('T')[0] })

  const totalSpent    = useMemo(() => expenses.reduce((s, e) => s + Number(e.amount), 0), [expenses])
  const remaining     = totalBudget - totalSpent
  const spentPct      = totalBudget ? Math.min((totalSpent / totalBudget) * 100, 100) : 0
  const isOverBudget  = remaining < 0

  const byCategory = useMemo(() => {
    const map = {}
    CATEGORIES.forEach(c => { map[c.id] = 0 })
    expenses.forEach(e => { map[e.category] = (map[e.category] || 0) + Number(e.amount) })
    return map
  }, [expenses])

  const addExpense = () => {
    if (!form.label.trim() || !form.amount) return
    setExpenses(p => [...p, { ...form, id: Date.now(), amount: Number(form.amount) }])
    setForm({ label: '', category: 'food', amount: '', date: new Date().toISOString().split('T')[0] })
    setShowForm(false)
  }

  const deleteExpense = (id) => setExpenses(p => p.filter(e => e.id !== id))

  return (
    <div className="space-y-5">

      {/* Summary Row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Budget',  value: fmt(totalBudget), color: '#a78bfa', bg: 'rgba(124,58,237,0.15)', border: 'rgba(124,58,237,0.25)' },
          { label: 'Total Spent',   value: fmt(totalSpent),  color: '#f87171', bg: 'rgba(239,68,68,0.15)',   border: 'rgba(239,68,68,0.25)'   },
          { label: 'Remaining',     value: fmt(Math.abs(remaining)),
            color: isOverBudget ? '#f87171' : '#34d399',
            bg:    isOverBudget ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)',
            border:isOverBudget ? 'rgba(239,68,68,0.25)' : 'rgba(16,185,129,0.25)' },
        ].map(s => (
          <div key={s.label} className="p-4 rounded-2xl text-center"
            style={{ background: s.bg, border: `1px solid ${s.border}` }}>
            <div className="font-bold text-sm" style={{ color: s.color }}>{s.value}</div>
            <div className="text-white/35 text-xs mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Progress */}
      <div>
        <div className="flex justify-between mb-2">
          <span className="text-white/50 text-xs font-medium">Budget Used</span>
          <span className={`text-xs font-bold ${isOverBudget ? 'text-red-400' : 'text-white/70'}`}>
            {isOverBudget ? '⚠️ Over Budget!' : `${Math.round(spentPct)}%`}
          </span>
        </div>
        <div className="h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: isOverBudget
              ? 'linear-gradient(90deg,#ef4444,#dc2626)'
              : spentPct > 75
              ? 'linear-gradient(90deg,#f59e0b,#ef4444)'
              : 'linear-gradient(90deg,#7c3aed,#2563eb,#06b6d4)',
            }}
            initial={{ width: 0 }}
            animate={{ width: `${spentPct}%` }}
            transition={{ duration: 0.8 }}
          />
        </div>
        {isOverBudget && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex items-center gap-2 mt-2 p-2 rounded-xl"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <AlertCircle size={13} className="text-red-400 flex-shrink-0" />
            <p className="text-red-400 text-xs">
              You are over budget by {fmt(Math.abs(remaining))}. Consider reducing expenses.
            </p>
          </motion.div>
        )}
      </div>

      {/* Category Breakdown */}
      <div>
        <p className="text-white/40 text-xs font-medium uppercase tracking-widest mb-3">
          By Category
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {CATEGORIES.map(cat => {
            const amt = byCategory[cat.id] || 0
            const pct = totalSpent ? Math.round((amt / totalSpent) * 100) : 0
            if (amt === 0) return null
            return (
              <motion.div key={cat.id}
                whileHover={{ scale: 1.03 }}
                className="p-3 rounded-xl flex items-center gap-3"
                style={{ background: cat.bg, border: `1px solid ${cat.color}30` }}>
                <span className="text-xl flex-shrink-0">{cat.icon}</span>
                <div className="min-w-0">
                  <div className="text-white/70 text-xs font-semibold truncate">{cat.label}</div>
                  <div className="font-bold text-sm" style={{ color: cat.color }}>{fmt(amt)}</div>
                  <div className="text-white/30 text-xs">{pct}% of spent</div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Add Expense Button */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-white/40 text-xs font-medium uppercase tracking-widest">
            Expenses ({expenses.length})
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(s => !s)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)', color: '#fff' }}
          >
            <Plus size={13} /> Add Expense
          </motion.button>
        </div>

        {/* Add Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-4"
            >
              <div className="p-4 rounded-2xl space-y-3"
                style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)' }}>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    value={form.label}
                    onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
                    placeholder="Expense name..."
                    className="input-glass col-span-2"
                    style={{ padding: '10px 14px', fontSize: '13px' }}
                  />
                  <select
                    value={form.category}
                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="input-glass"
                    style={{ padding: '10px 14px', fontSize: '13px' }}
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.id} value={c.id} style={{ background: '#1a1050' }}>
                        {c.icon} {c.label}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={form.amount}
                    onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                    placeholder="Amount ₹"
                    className="input-glass"
                    style={{ padding: '10px 14px', fontSize: '13px' }}
                  />
                  <input
                    type="date"
                    value={form.date}
                    onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                    className="input-glass"
                    style={{ padding: '10px 14px', fontSize: '13px', colorScheme: 'dark' }}
                  />
                  <div className="flex gap-2 col-span-2">
                    <button onClick={addExpense}
                      className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white"
                      style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)' }}>
                      ✓ Add
                    </button>
                    <button onClick={() => setShowForm(false)}
                      className="px-4 py-2.5 rounded-xl text-xs text-white/50"
                      style={{ background: 'rgba(255,255,255,0.07)' }}>
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Expense List */}
        <div className="space-y-2">
          <AnimatePresence>
            {expenses.map((exp, i) => {
              const cat = CATEGORIES.find(c => c.id === exp.category) || CATEGORIES[5]
              return (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16, height: 0 }}
                  transition={{ delay: i * 0.04 }}
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-3 p-3 rounded-xl group"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <div className="text-xl flex-shrink-0">{cat.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white/80 text-sm font-semibold truncate">{exp.label}</div>
                    <div className="text-white/35 text-xs">{cat.label} · {exp.date}</div>
                  </div>
                  <div className="font-bold text-sm flex-shrink-0" style={{ color: cat.color }}>
                    {fmt(exp.amount)}
                  </div>
                  <button onClick={() => deleteExpense(exp.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 rounded flex items-center justify-center hover:bg-red-500/20">
                    <Trash2 size={12} className="text-red-400/60" />
                  </button>
                </motion.div>
              )
            })}
          </AnimatePresence>
          {expenses.length === 0 && (
            <div className="text-center py-8">
              <div className="text-3xl mb-2">💳</div>
              <p className="text-white/30 text-sm">No expenses yet. Add your first expense!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}