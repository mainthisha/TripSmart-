import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, MapPin, X, TrendingUp, Globe } from 'lucide-react'
import { DESTINATIONS } from '../../data/destinations'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } }
}

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4 } }
}

export default function DestinationStep({ onNext, tripData, updateTripData }) {
  const [query, setQuery] = useState(tripData.destination?.name || '')
  const [selected, setSelected] = useState(tripData.destination || null)
  const [activeCategory, setActiveCategory] = useState('All')

  const categories = ['All', 'Beach', 'Nature', 'Adventure', 'Cultural', 'Luxury', 'Heritage']

  const filtered = useMemo(() => {
    let list = DESTINATIONS
    if (activeCategory !== 'All') {
      list = list.filter(d => d.category === activeCategory)
    }
    if (query.trim()) {
      list = list.filter(d =>
        d.name.toLowerCase().includes(query.toLowerCase()) ||
        d.country.toLowerCase().includes(query.toLowerCase()) ||
        d.tagline.toLowerCase().includes(query.toLowerCase())
      )
    }
    return list
  }, [query, activeCategory])

  const handleSelect = (dest) => {
    setSelected(dest)
    setQuery(dest.name)
    updateTripData('destination', dest)
  }

  const handleClear = () => {
    setSelected(null)
    setQuery('')
    updateTripData('destination', null)
  }

  return (
    <div className="max-w-3xl mx-auto">
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
          🗺️
        </motion.div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">
          <span className="bg-gradient-to-r from-violet-300 via-blue-300 to-cyan-300 bg-clip-text text-transparent">
            Where do you want
          </span>
          <br />
          <span className="text-white">to travel?</span>
        </h1>
        <p className="text-white/50 text-base mt-2">
          Search or pick from our handpicked destinations
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="glass-card-strong p-6 sm:p-8"
      >
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-violet-400" size={20} />
          <input
            type="text"
            placeholder="Search destination, country..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              if (selected && e.target.value !== selected.name) {
                setSelected(null)
                updateTripData('destination', null)
              }
            }}
            className="input-glass pl-12 pr-12"
          />
          {query && (
            <button
              onClick={handleClear}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Selected Banner */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-3 p-4 rounded-2xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(124,58,237,0.25), rgba(37,99,235,0.25))',
                  border: '1px solid rgba(139,92,246,0.4)'
                }}>
                <span className="text-3xl">{selected.emoji}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-lg">{selected.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/30 text-violet-300">
                      {selected.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-white/50 text-sm">
                    <MapPin size={12} />
                    <span>{selected.country} · {selected.tagline}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-white/40">Best Time</div>
                  <div className="text-xs text-emerald-400 font-medium">{selected.best_time}</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300"
              style={activeCategory === cat ? {
                background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
                color: 'white',
                boxShadow: '0 4px 15px rgba(124,58,237,0.4)'
              } : {
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.5)'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Destination Grid */}
        <div className="mb-2">
          <div className="flex items-center gap-2 mb-4">
            {query ? (
              <><Search size={14} className="text-white/40" />
                <span className="text-white/40 text-sm">{filtered.length} results for "{query}"</span></>
            ) : (
              <><TrendingUp size={14} className="text-violet-400" />
                <span className="text-white/40 text-sm">Popular destinations</span></>
            )}
          </div>

          <AnimatePresence mode="wait">
            {filtered.length === 0 ? (
              <motion.div key="no-results" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-center py-12">
                <div className="text-4xl mb-3">🔍</div>
                <p className="text-white/40">No destinations found for "{query}"</p>
              </motion.div>
            ) : (
              <motion.div
                key={activeCategory + query}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-h-72 overflow-y-auto pr-1"
              >
                {filtered.map((dest) => (
                  <motion.button
                    key={dest.id}
                    variants={cardVariants}
                    onClick={() => handleSelect(dest)}
                    whileHover={{ scale: 1.04, y: -3 }}
                    whileTap={{ scale: 0.97 }}
                    className="relative p-4 rounded-2xl text-left overflow-hidden"
                    style={selected?.id === dest.id ? {
                      background: 'linear-gradient(135deg, rgba(124,58,237,0.35), rgba(37,99,235,0.35))',
                      border: '2px solid rgba(139,92,246,0.6)'
                    } : {
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.08)'
                    }}
                  >
                    <div className={`absolute inset-0 opacity-10 bg-gradient-to-br ${dest.gradient}`} />
                    <div className="relative z-10">
                      <div className="text-3xl mb-2">{dest.emoji}</div>
                      <div className="font-semibold text-white text-sm">{dest.name}</div>
                      <div className="flex items-center gap-1 mt-1">
                        <Globe size={10} className="text-white/30" />
                        <span className="text-white/40 text-xs">{dest.country}</span>
                      </div>
                      <div className="mt-2">
                        <span className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}>
                          {dest.category}
                        </span>
                      </div>
                    </div>
                    {selected?.id === dest.id && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                        className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs"
                        style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}>
                        ✓
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Next Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex justify-end mt-6"
      >
        <motion.button
          onClick={() => selected && onNext()}
          disabled={!selected}
          whileHover={selected ? { scale: 1.03, y: -2 } : {}}
          whileTap={selected ? { scale: 0.97 } : {}}
          className="btn-primary px-10 py-3 text-base disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Continue → Trip Details
        </motion.button>
      </motion.div>
    </div>
  )
}