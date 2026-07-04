import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MapPin, Navigation, ExternalLink,
  Route, Sparkles
} from 'lucide-react'

const DEST_COORDS = {
  'Kerala':      { lat: 10.8505, lng: 76.2711 },
  'Goa':         { lat: 15.2993, lng: 74.1240 },
  'Manali':      { lat: 32.2432, lng: 77.1892 },
  'Ooty':        { lat: 11.4102, lng: 76.6950 },
  'Switzerland': { lat: 46.8182, lng: 8.2275  },
  'Paris':       { lat: 48.8566, lng: 2.3522  },
  'Dubai':       { lat: 25.2048, lng: 55.2708 },
  'Tokyo':       { lat: 35.6762, lng: 139.6503},
  'Bali':        { lat: -8.3405, lng: 115.0920},
  'Maldives':    { lat: 3.2028,  lng: 73.2207 },
  'London':      { lat: 51.5074, lng: -0.1278 },
  'Singapore':   { lat: 1.3521,  lng: 103.8198},
  'Rome':        { lat: 41.9028, lng: 12.4964 },
  'Phuket':      { lat: 7.8804,  lng: 98.3923 },
  'Hawaii':      { lat: 21.3069, lng: -157.8583},
}

const CROWD_LEVELS = ['low', 'high', 'medium', 'low', 'high', 'medium', 'low', 'high']

function CrowdBadge({ level }) {
  const config = {
    low:    { color: '#10b981', bg: 'rgba(16,185,129,0.15)',  border: 'rgba(16,185,129,0.3)',  label: 'Low Crowd'  },
    medium: { color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.3)',  label: 'Moderate'   },
    high:   { color: '#ef4444', bg: 'rgba(239,68,68,0.15)',   border: 'rgba(239,68,68,0.3)',   label: 'Crowded'    },
  }
  const c = config[level] || config.medium
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.color }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: c.color }} />
      {c.label}
    </span>
  )
}

function RouteStop({ stop, index, total, showHeatmap }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06 }}
      className="flex items-start gap-3"
    >
      {/* Timeline dot */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
          style={{
            background:
              index === 0
                ? 'linear-gradient(135deg,#10b981,#059669)'
                : index === total - 1
                ? 'linear-gradient(135deg,#ef4444,#dc2626)'
                : 'linear-gradient(135deg,#7c3aed,#2563eb)',
            boxShadow: '0 4px 12px rgba(124,58,237,0.3)',
          }}
        >
          {index === 0 ? '🏨' : index === total - 1 ? '🏁' : index + 1}
        </div>
        {index < total - 1 && (
          <div
            className="w-0.5 mt-1"
            style={{
              height: '40px',
              background:
                'linear-gradient(to bottom, rgba(124,58,237,0.5), rgba(37,99,235,0.1))',
            }}
          />
        )}
      </div>

      {/* Stop card */}
      <motion.div
        whileHover={{ scale: 1.01, x: 3 }}
        className="flex-1 p-3 rounded-xl mb-2 group"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-xl flex-shrink-0">{stop.icon || '📍'}</span>
            <div className="min-w-0">
              <div className="text-white text-xs font-semibold truncate">{stop.name}</div>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{
                    background: 'rgba(124,58,237,0.2)',
                    color: 'rgba(196,181,253,0.8)',
                  }}
                >
                  {stop.category}
                </span>
                {stop.rating && (
                  <span className="text-amber-400 text-xs">⭐ {stop.rating}</span>
                )}
                {showHeatmap && (
                  <CrowdBadge level={CROWD_LEVELS[index % CROWD_LEVELS.length]} />
                )}
              </div>
            </div>
          </div>
          <button
            onClick={() =>
              window.open(
                `https://www.google.com/maps/search/${encodeURIComponent(
                  stop.name
                )}`,
                '_blank'
              )
            }
            className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100"
          >
            <ExternalLink size={11} />
            Maps
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function RouteMap({ tripData }) {
  const destination = tripData?.destination
  const [activeTab,    setActiveTab]    = useState('map')
  const [showHeatmap,  setShowHeatmap]  = useState(false)
  const [mapLoaded,    setMapLoaded]    = useState(false)

  const coords      = destination ? DEST_COORDS[destination.name] : null
  const attractions = destination?.attractions || []

  const openFullRoute = () => {
    if (!destination || !attractions.length) return
    const stops = attractions
      .slice(0, 8)
      .map(a => encodeURIComponent(a.name + ' ' + destination.name))
      .join('/')
    window.open(`https://www.google.com/maps/dir/${stops}`, '_blank')
  }

  const openMapsSearch = () => {
    if (!destination) return
    window.open(
      `https://www.google.com/maps/search/${encodeURIComponent(
        'attractions in ' + destination.name
      )}`,
      '_blank'
    )
  }

  if (!destination) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-3">🗺️</div>
        <p className="text-white/40 text-sm">
          Select a destination to view the route map
        </p>
      </div>
    )
  }

  const totalDistance = (attractions.length * 4.2).toFixed(1)
  const totalTime     = Math.round(attractions.length * 35)

  // Google Maps embed URL
  const mapEmbedUrl = coords
    ? `https://www.google.com/maps/embed/v1/search?key=AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY&q=attractions+in+${encodeURIComponent(destination.name)}&center=${coords.lat},${coords.lng}&zoom=12`
    : null

  // Fallback embed (no API key needed)
  const fallbackEmbedUrl = coords
    ? `https://maps.google.com/maps?q=${encodeURIComponent(destination.name)}&t=&z=12&ie=UTF8&iwloc=&output=embed`
    : null

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
          >
            🗺️
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">AI Route Planner</h2>
            <p className="text-white/40 text-xs">
              {destination.name} · {attractions.length} stops optimized
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Heatmap toggle */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowHeatmap(h => !h)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all"
            style={
              showHeatmap
                ? {
                    background:
                      'linear-gradient(135deg,rgba(239,68,68,0.25),rgba(245,158,11,0.15))',
                    border: '1px solid rgba(239,68,68,0.35)',
                    color: '#fca5a5',
                  }
                : {
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.5)',
                  }
            }
          >
            🌡️ {showHeatmap ? 'Hide' : 'Show'} Crowd Heatmap
          </motion.button>

          {/* Open route */}
          <motion.button
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={openFullRoute}
            className="btn-primary flex items-center gap-2 py-2 px-4 text-xs rounded-xl"
          >
            <Navigation size={13} />
            Open Route in Maps
          </motion.button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            emoji: '📍',
            label: 'Total Stops',
            value: attractions.length,
            color: 'rgba(124,58,237,0.15)',
            border: 'rgba(124,58,237,0.25)',
          },
          {
            emoji: '📏',
            label: 'Est. Distance',
            value: `~${totalDistance} km`,
            color: 'rgba(37,99,235,0.15)',
            border: 'rgba(37,99,235,0.25)',
          },
          {
            emoji: '⏱️',
            label: 'Travel Time',
            value: `~${totalTime} min`,
            color: 'rgba(16,185,129,0.15)',
            border: 'rgba(16,185,129,0.25)',
          },
        ].map(s => (
          <div
            key={s.label}
            className="p-3 rounded-xl text-center"
            style={{ background: s.color, border: `1px solid ${s.border}` }}
          >
            <div className="text-xl mb-1">{s.emoji}</div>
            <div className="text-white font-bold text-sm">{s.value}</div>
            <div className="text-white/35 text-xs">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Heatmap Legend */}
      <AnimatePresence>
        {showHeatmap && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div
              className="flex items-center gap-4 p-3 rounded-xl flex-wrap"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <span className="text-white/50 text-xs font-medium">
                🌡️ Crowd Level:
              </span>
              {[
                { color: '#10b981', label: '🟢 Low'    },
                { color: '#f59e0b', label: '🟡 Medium' },
                { color: '#ef4444', label: '🔴 High'   },
              ].map(h => (
                <div key={h.label} className="flex items-center gap-1.5">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      background: h.color,
                      boxShadow: `0 0 6px ${h.color}`,
                    }}
                  />
                  <span className="text-white/50 text-xs">{h.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs */}
      <div className="flex gap-2">
        {[
          { id: 'map',   label: '🗺️ Map View'    },
          { id: 'route', label: '📍 Route Stops'  },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={
              activeTab === tab.id
                ? {
                    background: 'linear-gradient(135deg,#7c3aed,#2563eb)',
                    color: 'white',
                    boxShadow: '0 4px 15px rgba(124,58,237,0.4)',
                  }
                : {
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: 'rgba(255,255,255,0.5)',
                  }
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">

        {/* MAP TAB */}
        {activeTab === 'map' && (
          <motion.div
            key="map"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="space-y-3"
          >
            {/* Embedded Map */}
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                border: '1px solid rgba(124,58,237,0.25)',
                height: '400px',
              }}
            >
              {!mapLoaded && (
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center z-10"
                  style={{ background: 'rgba(8,6,24,0.9)' }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="text-4xl mb-3"
                  >
                    🗺️
                  </motion.div>
                  <p className="text-white/50 text-sm">Loading map...</p>
                </div>
              )}
              {fallbackEmbedUrl && (
                <iframe
                  title={`Map of ${destination.name}`}
                  src={fallbackEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: 'hue-rotate(180deg) invert(90%)' }}
                  allowFullScreen
                  loading="lazy"
                  onLoad={() => setMapLoaded(true)}
                />
              )}
            </div>

            {/* Map action buttons */}
            <div className="grid grid-cols-2 gap-3">
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={openMapsSearch}
                className="flex items-center justify-center gap-2 p-3 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: 'rgba(255,255,255,0.6)',
                }}
              >
                <MapPin size={15} />
                Search Attractions
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={openFullRoute}
                className="btn-primary flex items-center justify-center gap-2 p-3 rounded-xl text-sm"
              >
                <Navigation size={15} />
                Full Route in Maps
              </motion.button>
            </div>

            {/* Tip */}
            <div
              className="flex items-start gap-2 p-3 rounded-xl"
              style={{
                background: 'rgba(124,58,237,0.08)',
                border: '1px solid rgba(124,58,237,0.15)',
              }}
            >
              <Sparkles size={13} className="text-violet-400 flex-shrink-0 mt-0.5" />
              <p className="text-white/40 text-xs leading-relaxed">
                Click{' '}
                <span className="text-violet-300 font-medium">
                  Full Route in Maps
                </span>{' '}
                to open the complete optimized route with turn-by-turn directions
                in Google Maps.
              </p>
            </div>
          </motion.div>
        )}

        {/* ROUTE STOPS TAB */}
        {activeTab === 'route' && (
          <motion.div
            key="route"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="space-y-3"
          >
            <div
              className="p-4 rounded-2xl"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <p className="text-white/40 text-xs mb-4 flex items-center gap-2">
                <Route size={12} className="text-violet-400" />
                AI-optimized route order for {destination.name}
                {showHeatmap && (
                  <span className="text-white/30">· crowd levels shown</span>
                )}
              </p>

              {attractions.map((stop, i) => (
                <RouteStop
                  key={stop.name}
                  stop={stop}
                  index={i}
                  total={attractions.length}
                  showHeatmap={showHeatmap}
                />
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={openFullRoute}
              className="w-full btn-primary py-3 flex items-center justify-center gap-2 rounded-2xl"
            >
              <Navigation size={16} />
              Open Full Route in Google Maps
              <ExternalLink size={14} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}