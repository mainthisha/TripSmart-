import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeftRight, Loader2, RefreshCw } from 'lucide-react'

const CURRENCIES = [
  { code: 'INR', symbol: '₹', flag: '🇮🇳', name: 'Indian Rupee' },
  { code: 'USD', symbol: '$', flag: '🇺🇸', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', flag: '🇪🇺', name: 'Euro' },
  { code: 'GBP', symbol: '£', flag: '🇬🇧', name: 'British Pound' },
  { code: 'AED', symbol: 'د.إ', flag: '🇦🇪', name: 'UAE Dirham' },
  { code: 'SGD', symbol: 'S$', flag: '🇸🇬', name: 'Singapore Dollar' },
  { code: 'JPY', symbol: '¥', flag: '🇯🇵', name: 'Japanese Yen' },
  { code: 'CHF', symbol: 'Fr', flag: '🇨🇭', name: 'Swiss Franc' },
  { code: 'IDR', symbol: 'Rp', flag: '🇮🇩', name: 'Indonesian Rupiah' },
  { code: 'THB', symbol: '฿', flag: '🇹🇭', name: 'Thai Baht' },
]

// Fallback rates relative to INR (1 INR = X currency)
const FALLBACK_RATES = {
  INR: 1, USD: 0.012, EUR: 0.011, GBP: 0.0095,
  AED: 0.044, SGD: 0.016, JPY: 1.80, CHF: 0.011,
  IDR: 190.5, THB: 0.43
}

export default function CurrencyConverter({ tripData }) {
  const [amount, setAmount]     = useState(tripData?.budget?.total || 10000)
  const [from, setFrom]         = useState('INR')
  const [rates, setRates]       = useState(FALLBACK_RATES)
  const [loading, setLoading]   = useState(false)
  const [lastUpdated, setLastUpdated] = useState(null)

  const fetchRates = async () => {
    setLoading(true)
    try {
      const res  = await fetch(`https://api.exchangerate-api.com/v4/latest/INR`)
      const data = await res.json()
      if (data.rates) {
        const filtered = {}
        CURRENCIES.forEach(c => {
          if (data.rates[c.code]) filtered[c.code] = data.rates[c.code]
        })
        filtered.INR = 1
        setRates(filtered)
        setLastUpdated(new Date().toLocaleTimeString())
      }
    } catch {
      // Use fallback silently
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchRates() }, [])

  const convert = (toCurrency) => {
    if (!rates[from] || !rates[toCurrency]) return 0
    const inINR = amount / rates[from]
    return (inINR * rates[toCurrency]).toFixed(toCurrency === 'JPY' || toCurrency === 'IDR' ? 0 : 2)
  }

  const formatAmount = (val, code) => {
    const cur = CURRENCIES.find(c => c.code === code)
    const num = parseFloat(val)
    if (isNaN(num)) return '—'
    if (num >= 1000000) return `${cur?.symbol}${(num / 1000000).toFixed(2)}M`
    if (num >= 1000) return `${cur?.symbol}${(num / 1000).toFixed(1)}K`
    return `${cur?.symbol}${num.toLocaleString()}`
  }

  const fromCur = CURRENCIES.find(c => c.code === from)

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
            💱
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Currency Converter</h2>
            <p className="text-white/40 text-xs">
              {lastUpdated ? `Updated ${lastUpdated}` : 'Using estimated rates'}
            </p>
          </div>
        </div>
        <motion.button
          whileTap={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
          onClick={fetchRates}
          className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.08)' }}
        >
          {loading
            ? <Loader2 size={14} className="text-white/50 animate-spin" />
            : <RefreshCw size={14} className="text-white/50" />}
        </motion.button>
      </div>

      {/* Input Row */}
      <div className="p-5 rounded-2xl space-y-4"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>

        {/* Amount Input */}
        <div>
          <label className="text-white/40 text-xs font-medium mb-2 block">Amount</label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 font-bold">
                {fromCur?.symbol}
              </span>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(Number(e.target.value))}
                className="input-glass pl-10 w-full"
                placeholder="Enter amount"
              />
            </div>
            {/* From currency selector */}
            <select
              value={from}
              onChange={e => setFrom(e.target.value)}
              className="px-4 py-3 rounded-xl text-white text-sm font-medium outline-none cursor-pointer"
              style={{ background: 'rgba(124,58,237,0.3)', border: '1px solid rgba(124,58,237,0.4)' }}
            >
              {CURRENCIES.map(c => (
                <option key={c.code} value={c.code} style={{ background: '#1a1050' }}>
                  {c.flag} {c.code}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick amount buttons */}
        <div className="flex gap-2 flex-wrap">
          {[1000, 5000, 10000, 50000, 100000].map(v => (
            <button key={v}
              onClick={() => setAmount(v)}
              className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
              style={amount === v ? {
                background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
                color: 'white'
              } : {
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.5)'
              }}>
              {v >= 100000 ? `${v / 100000}L` : v >= 1000 ? `${v / 1000}K` : v}
            </button>
          ))}
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {CURRENCIES.filter(c => c.code !== from).map((cur, i) => {
          const converted = convert(cur.code)
          return (
            <motion.div
              key={cur.code}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.04, y: -2 }}
              className="p-4 rounded-2xl cursor-pointer transition-all"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              onClick={() => { setFrom(cur.code); setAmount(parseFloat(converted)) }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{cur.flag}</span>
                <div>
                  <div className="text-white/40 text-xs">{cur.code}</div>
                </div>
              </div>
              <motion.div
                key={converted}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-white font-bold text-base"
              >
                {formatAmount(converted, cur.code)}
              </motion.div>
              <div className="text-white/25 text-xs mt-0.5">{cur.name}</div>
              <div className="text-violet-400/60 text-xs mt-1">
                1 {from} = {(rates[cur.code] / rates[from]).toFixed(4)} {cur.code}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Trip budget in all currencies */}
      {tripData?.budget?.total && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl"
          style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.2)' }}
        >
          <p className="text-violet-300 text-xs font-semibold mb-2 flex items-center gap-2">
            <ArrowLeftRight size={12} />
            Your Trip Budget ({formatAmount(tripData.budget.total, 'INR')}) in other currencies
          </p>
          <div className="flex flex-wrap gap-2">
            {CURRENCIES.filter(c => c.code !== 'INR').map(cur => {
              const val = ((tripData.budget.total) * (rates[cur.code] || 0)).toFixed(0)
              return (
                <span key={cur.code}
                  className="text-xs px-3 py-1 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.6)' }}>
                  {cur.flag} {cur.symbol}{Number(val).toLocaleString()}
                </span>
              )
            })}
          </div>
        </motion.div>
      )}
    </div>
  )
}