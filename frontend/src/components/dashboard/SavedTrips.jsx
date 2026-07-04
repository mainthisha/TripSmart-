import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bookmark, Trash2, ExternalLink,
  RefreshCw, MapPin, Calendar,
  Users, Wallet, ChevronDown,
  ChevronUp, Clock, Eye
} from 'lucide-react'
import api from '../../services/api'

const fmt = (v) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0,
  }).format(v || 0)

function TripCard({ trip, onDelete, index }) {
  const [expanded, setExpanded] = useState(false)

  const dest    = trip.destination
  const details = trip.tripDetails || {}
  const budget  = trip.budget || {}
  const acts    = trip.activities || []
  const date    = trip.createdAt
    ? new Date(trip.createdAt).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric',
      })
    : 'Just now'

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, height: 0 }}
      transition={{ delay: index * 0.06 }}
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px',
        overflow: 'hidden',
        marginBottom: '12px',
        transition: 'border-color 0.3s ease',
      }}
      whileHover={{ borderColor: 'rgba(20,184,166,0.3)' }}
    >
      {/* Card Header */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px',
        flexWrap: 'wrap', gap: '10px',
        cursor: 'pointer',
      }}
        onClick={() => setExpanded(e => !e)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Destination emoji */}
          <div style={{
            width: '46px', height: '46px', borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(20,184,166,0.25), rgba(99,102,241,0.25))',
            border: '1px solid rgba(20,184,166,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '22px', flexShrink: 0,
          }}>
            {dest?.emoji || '🌍'}
          </div>

          <div>
            <div style={{
              color: 'rgba(240,242,255,0.9)', fontWeight: '700',
              fontSize: '15px', fontFamily: 'Syne,sans-serif',
            }}>
              {dest?.name || 'Unknown Destination'}
            </div>
            <div style={{
              color: 'rgba(160,168,200,0.5)', fontSize: '12px',
              marginTop: '2px', fontFamily: 'Plus Jakarta Sans,sans-serif',
              display: 'flex', alignItems: 'center', gap: '12px',
            }}>
              <span>📅 {date}</span>
              <span>🌙 {details.duration || 0} nights</span>
              <span>👥 {details.travelers || 1} travelers</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Budget pill */}
          <span style={{
            padding: '4px 12px', borderRadius: '50px',
            background: 'rgba(20,184,166,0.1)',
            border: '1px solid rgba(20,184,166,0.25)',
            color: 'rgba(45,212,191,0.9)', fontSize: '13px',
            fontWeight: '600', fontFamily: 'Syne,sans-serif',
            whiteSpace: 'nowrap',
          }}>
            {fmt(budget.total)}
          </span>

          {/* Share code */}
          {trip.shareCode && (
            <span style={{
              padding: '4px 10px', borderRadius: '6px',
              background: 'rgba(99,102,241,0.1)',
              border: '1px solid rgba(129,140,248,0.2)',
              color: 'rgba(165,180,252,0.8)',
              fontSize: '11px', fontFamily: 'monospace',
              letterSpacing: '0.08em',
            }}>
              {trip.shareCode}
            </span>
          )}

          {/* Delete */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); onDelete(trip.id || trip.shareCode) }}
            style={{
              width: '32px', height: '32px', borderRadius: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(244,63,94,0.1)',
              border: '1px solid rgba(244,63,94,0.2)',
              cursor: 'pointer', color: 'rgba(251,113,133,0.7)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(244,63,94,0.2)'
              e.currentTarget.style.color = '#fb7185'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(244,63,94,0.1)'
              e.currentTarget.style.color = 'rgba(251,113,133,0.7)'
            }}
          >
            <Trash2 size={13} />
          </motion.button>

          {/* Expand toggle */}
          <div style={{ color: 'rgba(255,255,255,0.25)', cursor: 'pointer' }}>
            {expanded
              ? <ChevronUp size={16} />
              : <ChevronDown size={16} />}
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              padding: '16px 20px 20px',
              borderTop: '1px solid rgba(255,255,255,0.05)',
              background: 'rgba(0,0,0,0.15)',
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '10px', marginBottom: '14px',
              }}>
                {[
                  { label: 'Destination', value: `${dest?.name}, ${dest?.country}`, icon: '🗺️' },
                  { label: 'Start Date',  value: details.startDate || 'Not set',    icon: '📅' },
                  { label: 'Duration',    value: `${details.duration || 0} nights`, icon: '🌙' },
                  { label: 'Travelers',   value: `${details.travelers || 1} people`, icon: '👥' },
                  { label: 'Trip Type',   value: details.tripType || 'N/A',          icon: '✈️' },
                  { label: 'Budget/Day',  value: fmt(budget.perDay || 0),            icon: '💳' },
                ].map(item => (
                  <div key={item.label} style={{
                    padding: '10px 12px', borderRadius: '10px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.05)',
                  }}>
                    <div style={{ fontSize: '11px', color: 'rgba(160,168,200,0.4)', marginBottom: '4px', fontFamily: 'Plus Jakarta Sans,sans-serif' }}>
                      {item.icon} {item.label}
                    </div>
                    <div style={{ fontSize: '13px', color: 'rgba(240,242,255,0.75)', fontWeight: '600', fontFamily: 'Syne,sans-serif' }}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Activities */}
              {acts.length > 0 && (
                <div>
                  <p style={{ color: 'rgba(160,168,200,0.4)', fontSize: '11px', marginBottom: '8px', fontFamily: 'Plus Jakarta Sans,sans-serif', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Activities
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {acts.map(act => (
                      <span key={act} style={{
                        padding: '3px 10px', borderRadius: '50px',
                        background: 'rgba(20,184,166,0.08)',
                        border: '1px solid rgba(20,184,166,0.18)',
                        color: 'rgba(45,212,191,0.8)',
                        fontSize: '11px', fontWeight: '500',
                        fontFamily: 'Plus Jakarta Sans,sans-serif',
                        textTransform: 'capitalize',
                      }}>
                        {act}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function SavedTrips() {
  const [trips,    setTrips]    = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)
  const [deleting, setDeleting] = useState(null)

  const fetchTrips = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.getAllTrips()
      if (res.success) {
        setTrips(res.trips || [])
      } else {
        setError('Failed to load trips')
      }
    } catch (e) {
      setError('Backend offline — start with: python main.py')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTrips() }, [])

  const handleDelete = async (id) => {
    setDeleting(id)
    try {
      const res = await api.deleteTrip(id)
      if (res.success) {
        setTrips(prev => prev.filter(t => (t.id || t.shareCode) !== id))
      }
    } catch (e) {
      console.error('Delete failed:', e)
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="space-y-4">

      {/* Header row */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px',
      }}>
        <div>
          <p style={{
            color: 'rgba(160,168,200,0.4)', fontSize: '12px',
            fontFamily: 'Plus Jakarta Sans,sans-serif',
            textTransform: 'uppercase', letterSpacing: '0.1em',
          }}>
            {loading ? 'Loading...' : `${trips.length} saved trip${trips.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <motion.button
          whileTap={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
          onClick={fetchTrips}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '7px 14px', borderRadius: '10px', cursor: 'pointer',
            background: 'rgba(20,184,166,0.1)',
            border: '1px solid rgba(20,184,166,0.25)',
            color: 'rgba(45,212,191,0.85)',
            fontSize: '12px', fontWeight: '600',
            fontFamily: 'Plus Jakarta Sans,sans-serif',
          }}
        >
          <RefreshCw size={13} />
          Refresh
        </motion.button>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
            style={{ display: 'inline-block', marginBottom: '12px' }}
          >
            <RefreshCw size={24} style={{ color: 'rgba(20,184,166,0.6)' }} />
          </motion.div>
          <p style={{ color: 'rgba(160,168,200,0.4)', fontSize: '14px', fontFamily: 'Plus Jakarta Sans,sans-serif' }}>
            Loading saved trips...
          </p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            padding: '20px', borderRadius: '16px', textAlign: 'center',
            background: 'rgba(244,63,94,0.08)',
            border: '1px solid rgba(244,63,94,0.2)',
          }}
        >
          <div style={{ fontSize: '32px', marginBottom: '10px' }}>⚠️</div>
          <p style={{ color: 'rgba(251,113,133,0.85)', fontSize: '14px', fontWeight: '600', fontFamily: 'Plus Jakarta Sans,sans-serif' }}>
            {error}
          </p>
          <p style={{ color: 'rgba(160,168,200,0.35)', fontSize: '12px', marginTop: '6px' }}>
            Make sure the backend is running on port 8000
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={fetchTrips}
            style={{
              marginTop: '14px', padding: '9px 22px', borderRadius: '10px',
              background: 'rgba(244,63,94,0.15)',
              border: '1px solid rgba(244,63,94,0.3)',
              color: '#fb7185', fontSize: '13px', fontWeight: '600',
              cursor: 'pointer', fontFamily: 'Plus Jakarta Sans,sans-serif',
            }}
          >
            Try Again
          </motion.button>
        </motion.div>
      )}

      {/* Empty state */}
      {!loading && !error && trips.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ textAlign: 'center', padding: '48px 20px' }}
        >
          <div style={{ fontSize: '52px', marginBottom: '16px' }}>🗂️</div>
          <p style={{
            color: 'rgba(240,242,255,0.6)', fontSize: '16px',
            fontWeight: '700', marginBottom: '8px',
            fontFamily: 'Syne,sans-serif',
          }}>
            No saved trips yet
          </p>
          <p style={{
            color: 'rgba(160,168,200,0.38)', fontSize: '13px',
            fontFamily: 'Plus Jakarta Sans,sans-serif',
            maxWidth: '300px', margin: '0 auto',
          }}>
            Complete your trip planning and click{' '}
            <strong style={{ color: 'rgba(45,212,191,0.7)' }}>💾 Save Trip</strong>{' '}
            at the bottom of the dashboard to save it here.
          </p>
        </motion.div>
      )}

      {/* Trip list */}
      {!loading && !error && trips.length > 0 && (
        <AnimatePresence>
          {trips.map((trip, i) => (
            <TripCard
              key={trip.id || trip.shareCode || i}
              trip={trip}
              index={i}
              onDelete={handleDelete}
            />
          ))}
        </AnimatePresence>
      )}

      {/* Info box */}
      {!loading && !error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{
            padding: '14px 18px', borderRadius: '14px',
            background: 'rgba(20,184,166,0.06)',
            border: '1px solid rgba(20,184,166,0.14)',
            display: 'flex', alignItems: 'flex-start', gap: '10px',
          }}
        >
          <span style={{ fontSize: '16px', flexShrink: 0 }}>💡</span>
          <p style={{
            color: 'rgba(160,168,200,0.5)', fontSize: '12px',
            lineHeight: '1.6', fontFamily: 'Plus Jakarta Sans,sans-serif',
          }}>
            Trips are saved to the FastAPI backend (in-memory storage).
            They will be cleared when the backend restarts.
            Install MongoDB for permanent storage.
          </p>
        </motion.div>
      )}
    </div>
  )
}