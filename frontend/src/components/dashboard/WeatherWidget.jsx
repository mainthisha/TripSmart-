import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Wind, Droplets, Eye, Thermometer,
  Sun, Cloud, CloudRain, CloudSnow,
  CloudLightning, Loader2, RefreshCw
} from 'lucide-react'

const CITY_COORDS = {
  'Kerala':      { lat: 10.8505, lon: 76.2711 },
  'Goa':         { lat: 15.2993, lon: 74.1240 },
  'Manali':      { lat: 32.2432, lon: 77.1892 },
  'Ooty':        { lat: 11.4102, lon: 76.6950 },
  'Switzerland': { lat: 46.8182, lon: 8.2275  },
  'Paris':       { lat: 48.8566, lon: 2.3522  },
  'Dubai':       { lat: 25.2048, lon: 55.2708 },
  'Tokyo':       { lat: 35.6762, lon: 139.6503},
  'Bali':        { lat: -8.3405, lon: 115.0920},
  'Maldives':    { lat: 3.2028,  lon: 73.2207 },
  'London':      { lat: 51.5074, lon: -0.1278 },
  'Singapore':   { lat: 1.3521,  lon: 103.8198},
  'Rome':        { lat: 41.9028, lon: 12.4964 },
  'Phuket':      { lat: 7.8804,  lon: 98.3923 },
  'Hawaii':      { lat: 21.3069, lon: -157.8583},
}

const WX_ICONS = {
  0: { icon: '☀️', label: 'Clear Sky', component: Sun },
  1: { icon: '🌤️', label: 'Mainly Clear', component: Sun },
  2: { icon: '⛅', label: 'Partly Cloudy', component: Cloud },
  3: { icon: '☁️', label: 'Overcast', component: Cloud },
  45: { icon: '🌫️', label: 'Foggy', component: Cloud },
  48: { icon: '🌫️', label: 'Icy Fog', component: Cloud },
  51: { icon: '🌦️', label: 'Light Drizzle', component: CloudRain },
  61: { icon: '🌧️', label: 'Rain', component: CloudRain },
  71: { icon: '❄️', label: 'Snow', component: CloudSnow },
  80: { icon: '🌦️', label: 'Showers', component: CloudRain },
  95: { icon: '⛈️', label: 'Thunderstorm', component: CloudLightning },
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function getWeatherIcon(code) {
  const keys = Object.keys(WX_ICONS).map(Number).sort((a, b) => b - a)
  for (const k of keys) {
    if (code >= k) return WX_ICONS[k]
  }
  return WX_ICONS[0]
}

function getBgGradient(code) {
  if (code <= 1)  return 'from-amber-500/20 to-orange-500/10'
  if (code <= 3)  return 'from-slate-500/20 to-blue-500/10'
  if (code <= 48) return 'from-slate-600/20 to-slate-500/10'
  if (code <= 67) return 'from-blue-600/20 to-cyan-500/10'
  if (code <= 77) return 'from-blue-300/20 to-indigo-400/10'
  return 'from-purple-600/20 to-indigo-500/10'
}

export default function WeatherPanel({ destination }) {
  const [weather, setWeather]   = useState(null)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)
  const [unit, setUnit]         = useState('C')

  const coords = destination
    ? CITY_COORDS[destination.name] || { lat: destination.lat, lon: destination.lon }
    : null

  const fetchWeather = async () => {
    if (!coords) return
    setLoading(true)
    setError(null)
    try {
      const url =
        `https://api.open-meteo.com/v1/forecast` +
        `?latitude=${coords.lat}&longitude=${coords.lon}` +
        `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weathercode,apparent_temperature,visibility` +
        `&daily=temperature_2m_max,temperature_2m_min,weathercode,precipitation_probability_max` +
        `&timezone=auto&forecast_days=6`
      const res  = await fetch(url)
      const data = await res.json()
      setWeather(data)
    } catch (e) {
      setError('Could not fetch weather. Check your connection.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchWeather() }, [destination?.name])

  const toF = (c) => Math.round((c * 9) / 5 + 32)
  const temp = (c) => unit === 'C' ? `${Math.round(c)}°C` : `${toF(c)}°F`

  if (!destination) return null

  const current  = weather?.current
  const daily    = weather?.daily
  const wxInfo   = current ? getWeatherIcon(current.weathercode) : null
  const bgClass  = current ? getBgGradient(current.weathercode) : ''

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{ background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)' }}>
            🌤️
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Live Weather</h2>
            <p className="text-white/40 text-xs">{destination.name}, {destination.country}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Unit toggle */}
          <button
            onClick={() => setUnit(u => u === 'C' ? 'F' : 'C')}
            className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
            style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            °{unit === 'C' ? 'F' : 'C'}
          </button>
          <motion.button
            whileTap={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            onClick={fetchWeather}
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.08)' }}
          >
            <RefreshCw size={14} className="text-white/50" />
          </motion.button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={32} className="text-violet-400 animate-spin" />
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="text-center py-8">
          <div className="text-3xl mb-2">⚠️</div>
          <p className="text-white/50 text-sm">{error}</p>
          <button onClick={fetchWeather}
            className="mt-3 px-4 py-2 rounded-xl text-xs text-violet-300"
            style={{ background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.3)' }}>
            Try Again
          </button>
        </div>
      )}

      {/* Current Weather */}
      {current && !loading && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-6 rounded-2xl bg-gradient-to-br ${bgClass}`}
            style={{ border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="text-6xl mb-2"
                >
                  {wxInfo?.icon}
                </motion.div>
                <div className="text-white/60 text-sm font-medium">{wxInfo?.label}</div>
              </div>
              <div className="text-right">
                <motion.div
                  key={current.temperature_2m}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-5xl font-bold text-white"
                >
                  {temp(current.temperature_2m)}
                </motion.div>
                <div className="text-white/40 text-sm mt-1">
                  Feels like {temp(current.apparent_temperature)}
                </div>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Droplets, label: 'Humidity', value: `${current.relative_humidity_2m}%`, color: 'text-cyan-400' },
                { icon: Wind, label: 'Wind', value: `${Math.round(current.wind_speed_10m)} km/h`, color: 'text-blue-400' },
                { icon: Eye, label: 'Visibility', value: `${Math.round((current.visibility || 10000) / 1000)} km`, color: 'text-violet-400' },
              ].map((stat) => (
                <div key={stat.label}
                  className="text-center p-3 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <stat.icon size={16} className={`${stat.color} mx-auto mb-1`} />
                  <div className="text-white font-semibold text-sm">{stat.value}</div>
                  <div className="text-white/35 text-xs">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* 5-Day Forecast */}
          {daily && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-white/40 text-xs font-medium uppercase tracking-widest mb-3">
                5-Day Forecast
              </p>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((i) => {
                  const date = new Date()
                  date.setDate(date.getDate() + i)
                  const wx = getWeatherIcon(daily.weathercode[i])
                  const rainPct = daily.precipitation_probability_max[i]
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * i }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      className="p-3 rounded-2xl text-center"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                    >
                      <div className="text-white/40 text-xs mb-2 font-medium">
                        {DAYS[date.getDay()]}
                      </div>
                      <div className="text-2xl mb-2">{wx.icon}</div>
                      <div className="text-white text-xs font-bold">
                        {temp(daily.temperature_2m_max[i])}
                      </div>
                      <div className="text-white/35 text-xs">
                        {temp(daily.temperature_2m_min[i])}
                      </div>
                      {rainPct > 20 && (
                        <div className="text-cyan-400 text-xs mt-1">💧{rainPct}%</div>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* Weather Advisory */}
          {current && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="p-4 rounded-2xl flex items-start gap-3"
              style={{
                background: 'rgba(124,58,237,0.12)',
                border: '1px solid rgba(124,58,237,0.2)'
              }}
            >
              <span className="text-2xl">💡</span>
              <div>
                <div className="text-white/70 text-xs font-semibold mb-1">Weather Advisory</div>
                <p className="text-white/45 text-xs leading-relaxed">
                  {current.weathercode >= 80
                    ? '🌧️ Rain expected. Carry an umbrella and plan indoor activities.'
                    : current.weathercode >= 51
                    ? '🌦️ Light showers possible. Keep a light raincoat handy.'
                    : current.weathercode >= 3
                    ? '☁️ Overcast skies. Great for sightseeing without harsh sun.'
                    : current.temperature_2m > 35
                    ? '🌡️ Very hot. Stay hydrated and avoid outdoor activity at noon.'
                    : current.temperature_2m < 10
                    ? '🧥 Cold weather. Pack warm layers and thermal wear.'
                    : '✅ Perfect weather for sightseeing and outdoor activities!'}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  )
}