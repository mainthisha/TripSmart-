import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Share2, Copy, Check, Link, Users,
  QrCode, Mail, MessageSquare, Twitter,
  Facebook, Download, Eye, Lock,
  Unlock, RefreshCw, Clock, Globe
} from 'lucide-react'

function generateTripCode(tripData) {
  const dest   = tripData?.destination?.name || 'TRIP'
  const prefix = dest.substring(0, 3).toUpperCase()
  const rand   = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `${prefix}-${rand}`
}

function generateShareLink(code) {
  return `https://tripsmart.app/trip/${code}`
}

function encodeTripData(tripData) {
  try {
    const minimal = {
      d:  tripData?.destination?.name,
      dt: tripData?.tripDetails,
      a:  tripData?.activities,
      b:  tripData?.budget?.total,
    }
    return btoa(JSON.stringify(minimal))
  } catch {
    return ''
  }
}

const SHARE_PLATFORMS = [
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    emoji: '💬',
    color: '#25d366',
    bg: 'rgba(37,211,102,0.15)',
    border: 'rgba(37,211,102,0.3)',
    getUrl: (link, text) =>
      `https://wa.me/?text=${encodeURIComponent(text + '\n' + link)}`,
  },
  {
    id: 'telegram',
    label: 'Telegram',
    emoji: '✈️',
    color: '#0088cc',
    bg: 'rgba(0,136,204,0.15)',
    border: 'rgba(0,136,204,0.3)',
    getUrl: (link, text) =>
      `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(text)}`,
  },
  {
    id: 'twitter',
    label: 'Twitter',
    emoji: '🐦',
    color: '#1da1f2',
    bg: 'rgba(29,161,242,0.15)',
    border: 'rgba(29,161,242,0.3)',
    getUrl: (link, text) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(link)}`,
  },
  {
    id: 'email',
    label: 'Email',
    emoji: '📧',
    color: '#a78bfa',
    bg: 'rgba(167,139,250,0.15)',
    border: 'rgba(167,139,250,0.3)',
    getUrl: (link, text) =>
      `mailto:?subject=${encodeURIComponent('Check out my TripSmart trip!')}&body=${encodeURIComponent(text + '\n\n' + link)}`,
  },
]

function QRCodeDisplay({ value }) {
  const size = 160
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}&bgcolor=08061a&color=a78bfa&qzone=2`

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-3 p-5 rounded-2xl"
      style={{
        background: 'rgba(124,58,237,0.1)',
        border: '1px solid rgba(124,58,237,0.25)',
      }}
    >
      <div
        className="rounded-xl overflow-hidden"
        style={{ border: '2px solid rgba(124,58,237,0.3)' }}
      >
        <img
          src={qrUrl}
          alt="QR Code"
          width={size}
          height={size}
          style={{ display: 'block' }}
        />
      </div>
      <p className="text-white/40 text-xs text-center">
        Scan to open trip on any device
      </p>
    </motion.div>
  )
}

function CollaboratorCard({ collab, onRemove }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 12 }}
      className="flex items-center gap-3 p-3 rounded-xl group"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
        style={{ background: `linear-gradient(135deg, ${collab.color1}, ${collab.color2})` }}
      >
        {collab.avatar}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-white/80 text-sm font-semibold truncate">
          {collab.name}
        </div>
        <div className="text-white/35 text-xs">{collab.role}</div>
      </div>
      <div className="flex items-center gap-2">
        <span
          className="text-xs px-2 py-0.5 rounded-full"
          style={{
            background: collab.isOnline
              ? 'rgba(16,185,129,0.2)'
              : 'rgba(255,255,255,0.06)',
            color: collab.isOnline
              ? '#34d399'
              : 'rgba(255,255,255,0.3)',
            border: collab.isOnline
              ? '1px solid rgba(16,185,129,0.3)'
              : '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {collab.isOnline ? '● Online' : '○ Offline'}
        </span>
        {collab.canRemove && (
          <button
            onClick={() => onRemove(collab.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-red-400/60 hover:text-red-400 px-2 py-1 rounded-lg hover:bg-red-500/10"
          >
            Remove
          </button>
        )}
      </div>
    </motion.div>
  )
}

export default function ShareTrip({ tripData }) {
  const [tripCode,     setTripCode]     = useState(() => generateTripCode(tripData))
  const [shareLink,    setShareLink]    = useState(() => generateShareLink(generateTripCode(tripData)))
  const [copied,       setCopied]       = useState(false)
  const [copiedCode,   setCopiedCode]   = useState(false)
  const [showQR,       setShowQR]       = useState(false)
  const [isPublic,     setIsPublic]     = useState(true)
  const [activeTab,    setActiveTab]    = useState('share')
  const [inviteEmail,  setInviteEmail]  = useState('')
  const [inviteSent,   setInviteSent]   = useState(false)
  const [collaborators, setCollaborators] = useState([
    {
      id: 1, name: 'You (Owner)', avatar: '👑',
      role: 'Trip Owner', isOnline: true,
      color1: '#7c3aed', color2: '#2563eb', canRemove: false,
    },
  ])

  const dest     = tripData?.destination
  const details  = tripData?.tripDetails || {}
  const budget   = tripData?.budget || {}
  const shareText = `🌍 Check out my trip to ${dest?.name || 'this destination'} planned with TripSmart!\n✈️ ${details.travelers || 1} travelers · ${details.duration || 0} nights · Budget: ₹${(budget.total || 0).toLocaleString('en-IN')}\n\nJoin my trip planning:`

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      setCopied(false)
    }
  }

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(tripCode)
      setCopiedCode(true)
      setTimeout(() => setCopiedCode(false), 2500)
    } catch {
      setCopiedCode(false)
    }
  }

  const regenerateCode = () => {
    const newCode = generateTripCode(tripData)
    setTripCode(newCode)
    setShareLink(generateShareLink(newCode))
    setCopied(false)
  }

  const sendInvite = () => {
    if (!inviteEmail.trim() || !inviteEmail.includes('@')) return
    const names    = ['Alex', 'Jordan', 'Sam', 'Riley', 'Casey', 'Morgan']
    const avatars  = ['😊', '🎯', '✨', '🌟', '🚀', '💫']
    const colors   = [
      ['#f59e0b', '#ea580c'],
      ['#10b981', '#059669'],
      ['#ec4899', '#db2777'],
      ['#06b6d4', '#0284c7'],
      ['#8b5cf6', '#7c3aed'],
    ]
    const idx    = Math.floor(Math.random() * names.length)
    const colIdx = Math.floor(Math.random() * colors.length)
    setCollaborators(prev => [
      ...prev,
      {
        id: Date.now(),
        name: inviteEmail.split('@')[0],
        avatar: avatars[idx],
        role: 'Collaborator',
        isOnline: false,
        color1: colors[colIdx][0],
        color2: colors[colIdx][1],
        canRemove: true,
      },
    ])
    setInviteEmail('')
    setInviteSent(true)
    setTimeout(() => setInviteSent(false), 3000)
  }

  const removeCollaborator = (id) => {
    setCollaborators(prev => prev.filter(c => c.id !== id))
  }

  const TABS = [
    { id: 'share',  label: '🔗 Share Link'     },
    { id: 'invite', label: '👥 Invite People'  },
    { id: 'qr',     label: '📱 QR Code'        },
  ]

  if (!dest) {
    return (
      <div className="text-center py-10">
        <div className="text-4xl mb-3">🔗</div>
        <p className="text-white/40 text-sm">
          Complete your trip first to share it
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-5">

      {/* Trip Code Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-5 rounded-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(37,99,235,0.15))',
          border: '1px solid rgba(124,58,237,0.35)',
        }}
      >
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-white/40 text-xs font-medium uppercase tracking-widest mb-1">
              Your Trip Code
            </p>
            <div className="flex items-center gap-3">
              <span
                className="font-black text-2xl tracking-widest"
                style={{
                  background: 'linear-gradient(135deg,#a78bfa,#60a5fa)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontFamily: 'monospace',
                }}
              >
                {tripCode}
              </span>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={copyCode}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
                style={{
                  background: copiedCode
                    ? 'rgba(16,185,129,0.2)'
                    : 'rgba(255,255,255,0.08)',
                  border: copiedCode
                    ? '1px solid rgba(16,185,129,0.3)'
                    : '1px solid rgba(255,255,255,0.12)',
                  color: copiedCode ? '#34d399' : 'rgba(255,255,255,0.6)',
                }}
              >
                {copiedCode ? <Check size={12} /> : <Copy size={12} />}
                {copiedCode ? 'Copied!' : 'Copy'}
              </motion.button>
            </div>
            <p className="text-white/35 text-xs mt-1">
              Share this code with friends to join your trip
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Public/Private toggle */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsPublic(p => !p)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all"
              style={
                isPublic
                  ? {
                      background: 'rgba(16,185,129,0.2)',
                      border: '1px solid rgba(16,185,129,0.3)',
                      color: '#34d399',
                    }
                  : {
                      background: 'rgba(239,68,68,0.15)',
                      border: '1px solid rgba(239,68,68,0.3)',
                      color: '#f87171',
                    }
              }
            >
              {isPublic ? <Globe size={13} /> : <Lock size={13} />}
              {isPublic ? 'Public' : 'Private'}
            </motion.button>

            {/* Regenerate */}
            <motion.button
              whileTap={{ rotate: 360, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              onClick={regenerateCode}
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <RefreshCw size={14} className="text-white/50" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Trip Summary Pills */}
      <div className="flex flex-wrap gap-2">
        {[
          { emoji: '📍', label: dest.name },
          { emoji: '👥', label: `${details.travelers || 1} travelers` },
          { emoji: '🌙', label: `${details.duration || 0} nights` },
          { emoji: '💰', label: `₹${(budget.total || 0).toLocaleString('en-IN')}` },
        ].map(p => (
          <span key={p.label} className="badge">
            {p.emoji} {p.label}
          </span>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {TABS.map(tab => (
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

        {/* SHARE LINK TAB */}
        {activeTab === 'share' && (
          <motion.div
            key="share"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-4"
          >
            {/* Link display */}
            <div
              className="flex items-center gap-3 p-4 rounded-2xl"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <Link size={16} className="text-violet-400 flex-shrink-0" />
              <span
                className="flex-1 text-sm truncate"
                style={{
                  color: 'rgba(255,255,255,0.55)',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                }}
              >
                {shareLink}
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={copyLink}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold flex-shrink-0"
                style={{
                  background: copied
                    ? 'linear-gradient(135deg,#10b981,#059669)'
                    : 'linear-gradient(135deg,#7c3aed,#2563eb)',
                  color: 'white',
                }}
              >
                {copied ? <Check size={13} /> : <Copy size={13} />}
                {copied ? 'Copied!' : 'Copy Link'}
              </motion.button>
            </div>

            {/* Share platforms */}
            <div>
              <p className="text-white/40 text-xs font-medium uppercase tracking-widest mb-3">
                Share On
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {SHARE_PLATFORMS.map((platform, i) => (
                  <motion.button
                    key={platform.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      window.open(
                        platform.getUrl(shareLink, shareText),
                        '_blank'
                      )
                    }
                    className="flex items-center justify-center gap-2 p-3 rounded-2xl transition-all"
                    style={{
                      background: platform.bg,
                      border: `1px solid ${platform.border}`,
                    }}
                  >
                    <span className="text-xl">{platform.emoji}</span>
                    <span
                      className="text-sm font-semibold"
                      style={{ color: platform.color }}
                    >
                      {platform.label}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Share message preview */}
            <div
              className="p-4 rounded-2xl"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <p className="text-white/35 text-xs font-medium uppercase tracking-widest mb-2">
                Share Message Preview
              </p>
              <p
                className="text-white/55 text-sm leading-relaxed"
                style={{ whiteSpace: 'pre-line' }}
              >
                {shareText}
              </p>
            </div>
          </motion.div>
        )}

        {/* INVITE TAB */}
        {activeTab === 'invite' && (
          <motion.div
            key="invite"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-4"
          >
            {/* Invite form */}
            <div
              className="p-4 rounded-2xl space-y-3"
              style={{
                background: 'rgba(124,58,237,0.1)',
                border: '1px solid rgba(124,58,237,0.2)',
              }}
            >
              <p className="text-white/60 text-sm font-semibold">
                Invite by Email
              </p>
              <div className="flex gap-3">
                <input
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendInvite()}
                  placeholder="friend@example.com"
                  className="input-glass flex-1"
                  style={{ padding: '11px 16px', fontSize: '13px' }}
                />
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={sendInvite}
                  className="btn-primary px-5 py-2 text-sm rounded-xl flex-shrink-0"
                >
                  {inviteSent ? '✓ Sent!' : 'Invite'}
                </motion.button>
              </div>
              <AnimatePresence>
                {inviteSent && (
                  <motion.p
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-emerald-400 text-xs flex items-center gap-2"
                  >
                    <Check size={12} />
                    Invite sent successfully!
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Collaborators list */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-white/40 text-xs font-medium uppercase tracking-widest">
                  Collaborators ({collaborators.length})
                </p>
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full bg-emerald-400"
                    style={{ animation: 'pulse 2s infinite' }}
                  />
                  <span className="text-white/35 text-xs">
                    {collaborators.filter(c => c.isOnline).length} online
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <AnimatePresence>
                  {collaborators.map(collab => (
                    <CollaboratorCard
                      key={collab.id}
                      collab={collab}
                      onRemove={removeCollaborator}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Permissions info */}
            <div
              className="p-4 rounded-2xl space-y-2"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <p className="text-white/40 text-xs font-medium uppercase tracking-widest mb-3">
                Collaborator Permissions
              </p>
              {[
                { icon: '✅', text: 'View full itinerary & budget' },
                { icon: '✅', text: 'Suggest changes to activities' },
                { icon: '✅', text: 'Add to packing list' },
                { icon: '✅', text: 'View expense tracker' },
                { icon: '❌', text: 'Cannot change destination' },
                { icon: '❌', text: 'Cannot modify budget' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-sm">{item.icon}</span>
                  <span className="text-white/50 text-xs">{item.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* QR TAB */}
        {activeTab === 'qr' && (
          <motion.div
            key="qr"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-4"
          >
            <div className="flex flex-col items-center">
              <QRCodeDisplay value={shareLink} />
            </div>

            <div
              className="p-4 rounded-2xl text-center"
              style={{
                background: 'rgba(124,58,237,0.08)',
                border: '1px solid rgba(124,58,237,0.18)',
              }}
            >
              <p className="text-white/50 text-sm mb-1 font-medium">
                Trip Code
              </p>
              <p
                className="text-2xl font-black tracking-widest mb-2"
                style={{
                  background: 'linear-gradient(135deg,#a78bfa,#60a5fa)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontFamily: 'monospace',
                }}
              >
                {tripCode}
              </p>
              <p className="text-white/35 text-xs">
                Point camera at QR code or enter trip code at tripsmart.app
              </p>
            </div>

            {/* Download QR button */}
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(shareLink)}&bgcolor=08061a&color=a78bfa&qzone=2`
                window.open(qrUrl, '_blank')
              }}
              className="w-full btn-primary py-3 flex items-center justify-center gap-2 rounded-2xl"
            >
              <Download size={16} />
              Download QR Code
            </motion.button>
          </motion.div>
        )}

      </AnimatePresence>

      {/* Activity Log */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="p-4 rounded-2xl"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Clock size={13} className="text-white/30" />
          <p className="text-white/35 text-xs font-medium uppercase tracking-widest">
            Recent Activity
          </p>
        </div>
        <div className="space-y-2">
          {[
            {
              icon: '👑',
              text: 'You created this trip',
              time: 'Just now',
              color: '#a78bfa',
            },
            {
              icon: '🔗',
              text: 'Share link generated',
              time: 'Just now',
              color: '#60a5fa',
            },
            {
              icon: '🌍',
              text: `Destination set to ${dest.name}`,
              time: 'Just now',
              color: '#34d399',
            },
          ].map((log, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.08 }}
              className="flex items-center gap-3"
            >
              <div
                className="w-7 h-7 rounded-xl flex items-center justify-center text-sm flex-shrink-0"
                style={{ background: 'rgba(255,255,255,0.06)' }}
              >
                {log.icon}
              </div>
              <span className="text-white/45 text-xs flex-1">{log.text}</span>
              <span className="text-white/25 text-xs flex-shrink-0">
                {log.time}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}