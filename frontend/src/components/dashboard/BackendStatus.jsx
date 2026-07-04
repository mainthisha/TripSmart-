import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Server, Wifi, WifiOff, Database,
  CheckCircle, XCircle, RefreshCw,
  Activity, Zap
} from 'lucide-react'
import api from '../../services/api'

export default function BackendStatus() {
  const [status,    setStatus]    = useState('checking')
  const [details,   setDetails]   = useState(null)
  const [expanded,  setExpanded]  = useState(false)
  const [lastCheck, setLastCheck] = useState(null)
  const [endpoints, setEndpoints] = useState([
    { name: 'Trips API',        path: '/trips/',           status: 'pending' },
    { name: 'Destinations API', path: '/destinations/',    status: 'pending' },
    { name: 'Weather API',      path: '/weather/Kerala',   status: 'pending' },
    { name: 'Currency API',     path: '/currency/rates',   status: 'pending' },
    { name: 'Visa API',         path: '/visa/Kerala',      status: 'pending' },
  ])

  const checkHealth = async () => {
    setStatus('checking')
    try {
      const res = await api.health()
      if (res.status === 'healthy') {
        setStatus('online')
        setDetails(res)
      } else {
        setStatus('offline')
      }
    } catch {
      setStatus('offline')
    }
    setLastCheck(new Date().toLocaleTimeString())
  }

  const checkEndpoints = async () => {
    const checks = [
      api.getAllTrips(),
      api.getDestinations(),
      api.getWeather('Kerala'),
      api.getCurrencyRates(),
      api.getVisaInfo('Kerala'),
    ]
    const results = await Promise.allSettled(checks)
    setEndpoints(prev =>
      prev.map((ep, i) => ({
        ...ep,
        status: results[i].status === 'fulfilled' &&
                results[i].value?.success !== false
          ? 'online' : 'offline',
      }))
    )
  }

  useEffect(() => {
    checkHealth()
    const interval = setInterval(checkHealth, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (status === 'online') checkEndpoints()
  }, [status])

  const STATUS_CONFIG = {
    checking: {
      color:  '#fbbf24', bg:  'rgba(251,191,36,0.15)',
      border: 'rgba(251,191,36,0.3)',
      label:  'Checking...', icon: RefreshCw,
    },
    online: {
      color:  '#34d399', bg:  'rgba(16,185,129,0.15)',
      border: 'rgba(16,185,129,0.3)',
      label:  'Backend Online', icon: CheckCircle,
    },
    offline: {
      color:  '#f87171', bg:  'rgba(239,68,68,0.15)',
      border: 'rgba(239,68,68,0.3)',
      label:  'Backend Offline', icon: XCircle,
    },
  }

  const cfg = STATUS_CONFIG[status]
  const Icon = cfg.icon

  return (
    <div className="space-y-4">

      {/* Main Status Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-5 rounded-2xl"
        style={{ background: cfg.bg, border: `1.5px solid ${cfg.border}` }}
      >
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: `${cfg.color}25` }}
            >
              <Icon
                size={24}
                style={{ color: cfg.color }}
                className={status === 'checking' ? 'animate-spin' : ''}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-base">
                  {cfg.label}
                </span>
                <span
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: cfg.color,
                    animation: status === 'online' ? 'pulse 2s infinite' : 'none',
                  }}
                />
              </div>
              <div className="text-white/40 text-xs mt-0.5">
                FastAPI Backend · Port 8000
                {lastCheck && ` · Last checked ${lastCheck}`}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {status === 'offline' && (
              <div
                className="px-3 py-2 rounded-xl text-xs"
                style={{
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.2)',
                  color: '#fca5a5',
                }}
              >
                Run: <code>python main.py</code>
              </div>
            )}
            <motion.button
              whileTap={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              onClick={() => { checkHealth(); checkEndpoints() }}
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <RefreshCw size={14} className="text-white/50" />
            </motion.button>
            <button
              onClick={() => setExpanded(e => !e)}
              className="px-3 py-2 rounded-xl text-xs font-medium"
              style={{
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.55)',
              }}
            >
              {expanded ? 'Hide' : 'Details'}
            </button>
          </div>
        </div>

        {/* Quick stats */}
        {status === 'online' && details && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-3 gap-3 mt-4"
          >
            {[
              { icon: Server,   label: 'API',      value: 'Running'  },
              { icon: Database, label: 'Database',  value: details.database?.includes('connected') ? 'MongoDB' : 'Memory' },
              { icon: Zap,      label: 'Version',   value: '1.0.0'    },
            ].map(s => {
              const SIcon = s.icon
              return (
                <div
                  key={s.label}
                  className="text-center p-2 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                >
                  <SIcon size={14} className="mx-auto mb-1" style={{ color: cfg.color }} />
                  <div className="text-white/80 text-xs font-semibold">{s.value}</div>
                  <div className="text-white/35 text-xs">{s.label}</div>
                </div>
              )
            })}
          </motion.div>
        )}
      </motion.div>

      {/* Expanded Endpoints */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div
              className="p-4 rounded-2xl space-y-2"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <p className="text-white/40 text-xs font-medium uppercase tracking-widest mb-3">
                API Endpoints Status
              </p>
              {endpoints.map((ep, i) => (
                <motion.div
                  key={ep.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-center justify-between p-2.5 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.03)' }}
                >
                  <div className="flex items-center gap-2">
                    <Activity size={12} className="text-white/30" />
                    <span className="text-white/65 text-xs font-medium">{ep.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <code
                      className="text-xs px-2 py-0.5 rounded"
                      style={{
                        background: 'rgba(255,255,255,0.06)',
                        color: 'rgba(255,255,255,0.3)',
                        fontSize: '10px',
                      }}
                    >
                      {ep.path}
                    </code>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={
                        ep.status === 'online'
                          ? {
                              background: 'rgba(16,185,129,0.2)',
                              color: '#34d399',
                              border: '1px solid rgba(16,185,129,0.3)',
                            }
                          : ep.status === 'offline'
                          ? {
                              background: 'rgba(239,68,68,0.2)',
                              color: '#f87171',
                              border: '1px solid rgba(239,68,68,0.3)',
                            }
                          : {
                              background: 'rgba(251,191,36,0.2)',
                              color: '#fbbf24',
                              border: '1px solid rgba(251,191,36,0.3)',
                            }
                      }
                    >
                      {ep.status === 'online'
                        ? '✓ OK'
                        : ep.status === 'offline'
                        ? '✗ Down'
                        : '... Checking'}
                    </span>
                  </div>
                </motion.div>
              ))}

              {/* Open Docs link */}
              <motion.a
                href="http://127.0.0.1:8000/docs"
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.02 }}
                className="flex items-center justify-center gap-2 p-3 rounded-xl text-xs font-medium mt-3"
                style={{
                  background: 'rgba(124,58,237,0.15)',
                  border: '1px solid rgba(124,58,237,0.25)',
                  color: '#a78bfa',
                  textDecoration: 'none',
                }}
              >
                <Server size={13} />
                Open Swagger API Docs →
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}