import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shirt, Smartphone, FileText, Sparkles,
  Heart, Glasses, ShoppingBag, Plus,
  Trash2, Check, Edit3, X, Package
} from 'lucide-react'

const DEFAULT_PACKING = {
  clothing: {
    label: 'Clothing',
    icon: Shirt,
    color: 'from-violet-500 to-purple-600',
    accent: 'rgba(124,58,237,0.2)',
    border: 'rgba(124,58,237,0.3)',
    items: ['T-shirts', 'Jeans', 'Jacket', 'Sleepwear', 'Underwear', 'Socks', 'Comfortable shoes']
  },
  electronics: {
    label: 'Electronics',
    icon: Smartphone,
    color: 'from-blue-500 to-cyan-500',
    accent: 'rgba(37,99,235,0.2)',
    border: 'rgba(37,99,235,0.3)',
    items: ['Phone', 'Phone charger', 'Power bank', 'Camera', 'Laptop', 'Travel adapter', 'Earphones']
  },
  documents: {
    label: 'Documents',
    icon: FileText,
    color: 'from-amber-500 to-orange-500',
    accent: 'rgba(245,158,11,0.2)',
    border: 'rgba(245,158,11,0.3)',
    items: ['Passport', 'Tickets', 'Hotel confirmation', 'Travel insurance', 'ID proof', 'Visa documents']
  },
  toiletries: {
    label: 'Toiletries',
    icon: Sparkles,
    color: 'from-pink-500 to-rose-500',
    accent: 'rgba(236,72,153,0.2)',
    border: 'rgba(236,72,153,0.3)',
    items: ['Toothbrush', 'Toothpaste', 'Shampoo', 'Soap', 'Razor', 'Comb', 'Deodorant']
  },
  essentials: {
    label: 'Travel Essentials',
    icon: ShoppingBag,
    color: 'from-emerald-500 to-teal-500',
    accent: 'rgba(16,185,129,0.2)',
    border: 'rgba(16,185,129,0.3)',
    items: ['Water bottle', 'Travel pillow', 'Neck pillow', 'Eye mask', 'Reusable bag', 'Snacks']
  },
  health: {
    label: 'Health & Safety',
    icon: Heart,
    color: 'from-red-500 to-rose-600',
    accent: 'rgba(239,68,68,0.2)',
    border: 'rgba(239,68,68,0.3)',
    items: ['First aid kit', 'Medicines', 'Sunscreen', 'Hand sanitizer', 'Masks', 'Insect repellent']
  },
  accessories: {
    label: 'Accessories',
    icon: Glasses,
    color: 'from-indigo-500 to-violet-500',
    accent: 'rgba(99,102,241,0.2)',
    border: 'rgba(99,102,241,0.3)',
    items: ['Sunglasses', 'Hat', 'Watch', 'Wallet', 'Backpack', 'Umbrella']
  },
}

function buildInitialState(destination) {
  const state = {}
  Object.entries(DEFAULT_PACKING).forEach(([key, cat]) => {
    // Add destination-specific items
    let extra = []
    if (destination?.packing) {
      if (key === 'clothing') extra = destination.packing.filter(i =>
        ['swimwear','sarong','jacket','thermal','clothes','dress','shorts','outfit','woolen','linen','cotton'].some(k => i.toLowerCase().includes(k))
      )
      if (key === 'essentials') extra = destination.packing.filter(i =>
        ['sunscreen','mosquito','repellent','flip','card','wifi','umbrella','bottle'].some(k => i.toLowerCase().includes(k))
      )
      if (key === 'health') extra = destination.packing.filter(i =>
        ['sunscreen','repellent','medicine'].some(k => i.toLowerCase().includes(k))
      )
    }
    const allItems = [...new Set([...cat.items, ...extra])]
    state[key] = allItems.map((name, i) => ({
      id: `${key}-${i}`,
      name,
      checked: false,
      editing: false,
    }))
  })
  return state
}

function PackingCategoryCard({ catKey, category, items, onToggle, onDelete, onEdit, onAdd }) {
  const [newItem, setNewItem] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [editId, setEditId] = useState(null)
  const [editVal, setEditVal] = useState('')
  const Icon = category.icon
  const checked = items.filter(i => i.checked).length
  const total = items.length
  const pct = total ? Math.round((checked / total) * 100) : 0

  const handleAdd = () => {
    if (newItem.trim()) {
      onAdd(catKey, newItem.trim())
      setNewItem('')
      setShowAdd(false)
    }
  }

  const startEdit = (item) => {
    setEditId(item.id)
    setEditVal(item.name)
  }

  const saveEdit = (id) => {
    if (editVal.trim()) {
      onEdit(catKey, id, editVal.trim())
    }
    setEditId(null)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl overflow-hidden"
      style={{ background: category.accent, border: `1px solid ${category.border}` }}
    >
      {/* Card Header */}
      <div className="p-4 pb-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center bg-gradient-to-br ${category.color}`}>
              <Icon size={15} className="text-white" />
            </div>
            <div>
              <span className="text-white font-semibold text-sm">{category.label}</span>
              <div className="text-white/40 text-xs">{checked}/{total} packed</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold ${pct === 100 ? 'text-emerald-400' : 'text-white/50'}`}>
              {pct === 100 ? '✓ Done' : `${pct}%`}
            </span>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowAdd(!showAdd)}
              className="w-6 h-6 rounded-lg flex items-center justify-center transition-all"
              style={{ background: 'rgba(255,255,255,0.1)' }}
            >
              <Plus size={13} className="text-white/60" />
            </motion.button>
          </div>
        </div>

        {/* Mini progress bar */}
        <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <motion.div
            className={`h-full rounded-full bg-gradient-to-r ${category.color}`}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.6 }}
          />
        </div>
      </div>

      {/* Items */}
      <div className="px-3 pb-3 space-y-1 max-h-52 overflow-y-auto">
        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10, height: 0 }}
              className="flex items-center gap-2 p-2 rounded-xl group transition-all"
              style={{ background: item.checked ? 'rgba(255,255,255,0.08)' : 'transparent' }}
            >
              {/* Checkbox */}
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => onToggle(catKey, item.id)}
                className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-all"
                style={item.checked ? {
                  background: 'linear-gradient(135deg, #7c3aed, #2563eb)'
                } : {
                  border: '2px solid rgba(255,255,255,0.2)',
                  background: 'transparent'
                }}
              >
                {item.checked && <Check size={11} className="text-white" />}
              </motion.button>

              {/* Item name / edit input */}
              {editId === item.id ? (
                <input
                  autoFocus
                  value={editVal}
                  onChange={e => setEditVal(e.target.value)}
                  onBlur={() => saveEdit(item.id)}
                  onKeyDown={e => e.key === 'Enter' && saveEdit(item.id)}
                  className="flex-1 bg-transparent text-white text-xs outline-none border-b border-violet-400"
                />
              ) : (
                <span className={`flex-1 text-xs transition-all ${
                  item.checked ? 'line-through text-white/30' : 'text-white/75'
                }`}>
                  {item.name}
                </span>
              )}

              {/* Actions */}
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => startEdit(item)}
                  className="w-5 h-5 rounded flex items-center justify-center hover:bg-white/10">
                  <Edit3 size={9} className="text-white/40" />
                </button>
                <button onClick={() => onDelete(catKey, item.id)}
                  className="w-5 h-5 rounded flex items-center justify-center hover:bg-red-500/20">
                  <Trash2 size={9} className="text-red-400/60" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add item input */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden px-3 pb-3"
          >
            <div className="flex gap-2 mt-1">
              <input
                autoFocus
                value={newItem}
                onChange={e => setNewItem(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAdd()}
                placeholder="Add item..."
                className="flex-1 text-xs px-3 py-2 rounded-xl outline-none text-white placeholder-white/30"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
              />
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleAdd}
                className="px-3 py-2 rounded-xl text-xs font-medium text-white"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}
              >
                Add
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowAdd(false)}
                className="px-2 py-2 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.06)' }}
              >
                <X size={13} className="text-white/40" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function PackingList({ tripData }) {
  const destination = tripData?.destination
  const [packingState, setPackingState] = useState(() => buildInitialState(destination))

  const stats = useMemo(() => {
    let total = 0, checked = 0
    Object.values(packingState).forEach(items => {
      total += items.length
      checked += items.filter(i => i.checked).length
    })
    return { total, checked, pct: total ? Math.round((checked / total) * 100) : 0 }
  }, [packingState])

  const handleToggle = (catKey, itemId) => {
    setPackingState(prev => ({
      ...prev,
      [catKey]: prev[catKey].map(i => i.id === itemId ? { ...i, checked: !i.checked } : i)
    }))
  }

  const handleDelete = (catKey, itemId) => {
    setPackingState(prev => ({
      ...prev,
      [catKey]: prev[catKey].filter(i => i.id !== itemId)
    }))
  }

  const handleEdit = (catKey, itemId, newName) => {
    setPackingState(prev => ({
      ...prev,
      [catKey]: prev[catKey].map(i => i.id === itemId ? { ...i, name: newName } : i)
    }))
  }

  const handleAdd = (catKey, name) => {
    setPackingState(prev => ({
      ...prev,
      [catKey]: [...prev[catKey], {
        id: `${catKey}-${Date.now()}`,
        name,
        checked: false
      }]
    }))
  }

  const handleCheckAll = () => {
    setPackingState(prev => {
      const next = {}
      Object.entries(prev).forEach(([k, items]) => {
        next[k] = items.map(i => ({ ...i, checked: true }))
      })
      return next
    })
  }

  const handleReset = () => {
    setPackingState(prev => {
      const next = {}
      Object.entries(prev).forEach(([k, items]) => {
        next[k] = items.map(i => ({ ...i, checked: false }))
      })
      return next
    })
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}>
            🎒
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Packing List Manager</h2>
            <p className="text-white/40 text-xs">
              {destination?.name ? `Optimized for ${destination.name}` : 'Smart packing list'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleCheckAll}
            className="px-3 py-1.5 rounded-xl text-xs font-medium text-white/70 transition-all"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            ✓ Check All
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleReset}
            className="px-3 py-1.5 rounded-xl text-xs font-medium text-white/70 transition-all"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            ↺ Reset
          </motion.button>
        </div>
      </div>

      {/* Overall Progress */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-5 rounded-2xl"
        style={{
          background: stats.pct === 100
            ? 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(5,150,105,0.15))'
            : 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(37,99,235,0.1))',
          border: stats.pct === 100
            ? '1px solid rgba(16,185,129,0.3)'
            : '1px solid rgba(124,58,237,0.25)'
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Package size={16} className={stats.pct === 100 ? 'text-emerald-400' : 'text-violet-400'} />
            <span className="text-white font-semibold text-sm">Overall Packing Progress</span>
          </div>
          <motion.span
            key={stats.pct}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className={`text-2xl font-bold ${stats.pct === 100 ? 'text-emerald-400' : 'text-violet-300'}`}
          >
            {stats.pct}%
          </motion.span>
        </div>

        <div className="h-3 rounded-full overflow-hidden mb-2"
          style={{ background: 'rgba(255,255,255,0.08)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: stats.pct === 100
              ? 'linear-gradient(90deg, #10b981, #059669)'
              : 'linear-gradient(90deg, #7c3aed, #2563eb, #06b6d4)'
            }}
            initial={{ width: 0 }}
            animate={{ width: `${stats.pct}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>

        <div className="flex justify-between items-center">
          <span className="text-white/40 text-xs">
            {stats.checked} of {stats.total} items packed
          </span>
          {stats.pct === 100 ? (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-emerald-400 text-xs font-semibold flex items-center gap-1"
            >
              🎉 Ready to go!
            </motion.span>
          ) : (
            <span className="text-white/40 text-xs">
              {stats.total - stats.checked} items remaining
            </span>
          )}
        </div>
      </motion.div>

      {/* Category Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(DEFAULT_PACKING).map(([key, category]) => (
          <PackingCategoryCard
            key={key}
            catKey={key}
            category={category}
            items={packingState[key] || []}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onAdd={handleAdd}
          />
        ))}
      </div>
    </div>
  )
}