import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText, CheckCircle, XCircle,
  AlertTriangle, Clock, ExternalLink,
  ChevronDown, ChevronUp
} from 'lucide-react'

const VISA_DATA = {
  'Kerala':      { required: false, type: 'No Visa (Domestic)', processing: 'N/A', fee: 'Free', validity: 'N/A',
    documents: ['Aadhaar Card / PAN Card', 'Valid ID Proof'],
    rules: ['Indian citizens travel freely', 'No restrictions'],
    note: 'Domestic travel within India. No visa needed.' },

  'Goa':         { required: false, type: 'No Visa (Domestic)', processing: 'N/A', fee: 'Free', validity: 'N/A',
    documents: ['Aadhaar Card / PAN Card', 'Valid ID Proof'],
    rules: ['Indian citizens travel freely'],
    note: 'Domestic travel within India.' },

  'Manali':      { required: false, type: 'No Visa (Domestic)', processing: 'N/A', fee: 'Free', validity: 'N/A',
    documents: ['Aadhaar Card / PAN Card'],
    rules: ['Indian citizens travel freely', 'Inner Line Permit may be needed for restricted areas'],
    note: 'Some restricted areas near borders require Inner Line Permit.' },

  'Ooty':        { required: false, type: 'No Visa (Domestic)', processing: 'N/A', fee: 'Free', validity: 'N/A',
    documents: ['Aadhaar Card / PAN Card'],
    rules: ['Indian citizens travel freely'],
    note: 'Domestic travel within India.' },

  'Switzerland': { required: true, type: 'Schengen Visa (Type C)', processing: '15–30 days', fee: '€80 (~₹7,200)', validity: '90 days',
    documents: ['Valid Passport (6+ months)', 'Bank Statements (3 months)', 'Travel Insurance', 'Hotel Bookings', 'Flight Tickets', 'ITR / Salary Slips', 'Cover Letter', 'Photos (35x45mm)'],
    rules: ['Stay max 90 days in 180-day period', 'Proof of sufficient funds required', 'Travel insurance mandatory (min €30,000)'],
    applyAt: 'VFS Global or Swiss Embassy',
    note: 'Apply 3–4 weeks before travel. Single/multiple entry options available.' },

  'Paris':       { required: true, type: 'Schengen Visa (Type C)', processing: '15–30 days', fee: '€80 (~₹7,200)', validity: '90 days',
    documents: ['Valid Passport (6+ months)', 'Bank Statements (3 months)', 'Travel Insurance', 'Hotel Bookings', 'Flight Tickets', 'ITR / Salary Slips', 'Cover Letter', 'Recent Photos'],
    rules: ['Stay max 90 days in 180-day period', 'Travel insurance mandatory', 'Proof of accommodation required'],
    applyAt: 'VFS Global France or French Embassy',
    note: 'France is part of the Schengen Area. One visa covers 26 countries.' },

  'Dubai':       { required: true, type: 'UAE Tourist Visa / Visa on Arrival', processing: '3–5 days', fee: 'AED 250–500 (~₹5,500–11,000)', validity: '30–90 days',
    documents: ['Valid Passport (6+ months)', 'Passport Size Photo', 'Bank Statement', 'Hotel Booking', 'Return Flight Ticket', 'Travel Insurance'],
    rules: ['Dress modestly in public areas', 'Alcohol only in licensed places', 'No photography of government buildings'],
    applyAt: 'Emirates Airlines, dnata, or Dubai Tourism Website',
    note: 'Indian passport holders can get Visa on Arrival. Online visa also available.' },

  'Tokyo':       { required: true, type: 'Tourist Visa / Visa-Free (recent)', processing: '5–10 days', fee: '¥3,000 (~₹1,700)', validity: '90 days',
    documents: ['Valid Passport (6+ months)', 'Bank Statements', 'Hotel Bookings', 'Return Flight', 'Employment Letter', 'ITR'],
    rules: ['No drugs strictly', 'Be quiet in public transport', 'Remove shoes when indicated', 'Cash preferred'],
    applyAt: 'Japan Embassy or Consulate',
    note: 'Japan has resumed tourism. Check latest visa-free status for India before travel.' },

  'Bali':        { required: true, type: 'Visa on Arrival (VOA)', processing: 'On arrival', fee: 'IDR 500,000 (~₹2,600)', validity: '30 days',
    documents: ['Valid Passport (6+ months)', 'Return Flight Ticket', 'Hotel Booking', 'Sufficient Funds Proof'],
    rules: ['Respect temple customs', 'Wear sarong at temples', 'No drugs — strict laws', 'Respect local ceremonies'],
    applyAt: 'Bali Ngurah Rai Airport (on arrival)',
    note: 'Extendable once for additional 30 days. E-VOA also available online.' },

  'Maldives':    { required: false, type: 'Visa on Arrival (Free)', processing: 'On arrival', fee: 'Free', validity: '30 days',
    documents: ['Valid Passport (6+ months)', 'Return Flight Ticket', 'Hotel Booking', 'Sufficient Funds'],
    rules: ['No alcohol outside resort islands', 'Modest dress in local islands', 'No pork products'],
    note: 'Indians get free 30-day visa on arrival. No pre-application needed.' },

  'London':      { required: true, type: 'UK Standard Visitor Visa', processing: '15–21 days', fee: '£115 (~₹12,000)', validity: '6 months',
    documents: ['Valid Passport', 'Bank Statements (6 months)', 'Salary Slips / ITR', 'Employment Letter', 'Hotel Bookings', 'Flight Tickets', 'Travel Insurance', 'Photographs'],
    rules: ['No work on visitor visa', 'Must leave before visa expires', 'Biometrics required'],
    applyAt: 'VFS Global UK Visa Application Centre',
    note: 'UK is not part of Schengen. Separate visa needed even with Schengen visa.' },

  'Singapore':   { required: true, type: 'Singapore Tourist Visa / Pre-Approved', processing: '3–5 days', fee: 'SGD 30 (~₹1,900)', validity: '30 days',
    documents: ['Valid Passport (6+ months)', 'Bank Statements', 'Hotel Booking', 'Return Flight', 'ITR / Salary Slips'],
    rules: ['No chewing gum', 'No littering (heavy fine)', 'No jaywalking', 'Drugs = death penalty'],
    applyAt: 'Singapore Embassy or authorized agents',
    note: 'Most Indian passport holders need visa. Apply minimum 2 weeks before travel.' },

  'Rome':        { required: true, type: 'Schengen Visa (Type C)', processing: '15–30 days', fee: '€80 (~₹7,200)', validity: '90 days',
    documents: ['Valid Passport (6+ months)', 'Bank Statements', 'Travel Insurance', 'Hotel Bookings', 'Flight Tickets', 'ITR / Salary Slips', 'Cover Letter'],
    rules: ['Stay max 90 days in 180-day period', 'Travel insurance mandatory', 'No sitting on historic monuments'],
    applyAt: 'VFS Global Italy or Italian Embassy',
    note: 'Italy is part of Schengen. One visa valid for multiple Schengen countries.' },

  'Phuket':      { required: true, type: 'Thailand Tourist Visa / Visa Exemption', processing: 'On arrival', fee: 'THB 2,000 (~₹4,500)', validity: '30 days',
    documents: ['Valid Passport (6+ months)', 'Return Flight Ticket', 'Hotel Booking', 'Sufficient Funds (THB 20,000/person)'],
    rules: ['Respect royal family — strictly', 'Remove shoes at temples', 'No drugs (life imprisonment)', 'Modest dress at temples'],
    applyAt: 'Phuket International Airport (on arrival)',
    note: 'Indians currently get 30-day visa exemption. Verify before travel as policies change.' },

  'Hawaii':      { required: true, type: 'USA B1/B2 Tourist Visa', processing: '45–60+ days', fee: '$185 (~₹15,000)', validity: '10 years (multiple entry)',
    documents: ['Valid Passport (6+ months)', 'DS-160 Form', 'SEVIS Fee (if student)', 'Bank Statements (6 months)', 'Property / Employment Proof', 'Travel Insurance', 'Photographs', 'US Embassy Interview'],
    rules: ['Interview required at US Embassy', 'Proof of strong ties to India needed', 'No working on tourist visa', 'ESTA not applicable for Indian passports'],
    applyAt: 'US Embassy New Delhi, Mumbai, Chennai, Hyderabad, Kolkata',
    note: 'Hawaii is a US state. US B1/B2 visa required. Apply 3–6 months in advance. Interview mandatory.' },
}

const STATUS_CONFIG = {
  true:  { color: '#f87171', bg: 'rgba(239,68,68,0.15)',   border: 'rgba(239,68,68,0.3)',   icon: XCircle,       label: 'Visa Required'    },
  false: { color: '#34d399', bg: 'rgba(16,185,129,0.15)',  border: 'rgba(16,185,129,0.3)',  icon: CheckCircle,   label: 'No Visa Needed'   },
}

export default function VisaChecker({ tripData }) {
  const dest  = tripData?.destination
  const [open, setOpen] = useState(true)

  if (!dest) return null

  const info   = VISA_DATA[dest.name]
  const status = info ? STATUS_CONFIG[info.required] : null

  if (!info) return (
    <div className="text-center py-8">
      <div className="text-3xl mb-2">🔍</div>
      <p className="text-white/40 text-sm">Visa info not available for {dest.name}</p>
    </div>
  )

  const StatusIcon = status.icon

  return (
    <div className="space-y-4">

      {/* Status Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center justify-between p-5 rounded-2xl"
        style={{ background: status.bg, border: `1.5px solid ${status.border}` }}
      >
        <div className="flex items-center gap-4">
          <StatusIcon size={32} style={{ color: status.color, flexShrink: 0 }} />
          <div>
            <div className="text-white font-bold text-lg">{status.label}</div>
            <div className="font-semibold text-sm" style={{ color: status.color }}>
              {info.type}
            </div>
            <div className="text-white/45 text-xs mt-0.5">
              {dest.name}, {dest.country}
            </div>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          {info.fee !== 'Free' && (
            <div>
              <div className="text-white/35 text-xs">Visa Fee</div>
              <div className="text-white font-bold text-sm">{info.fee}</div>
            </div>
          )}
          {info.validity !== 'N/A' && (
            <div className="mt-1">
              <div className="text-white/35 text-xs">Validity</div>
              <div className="text-white font-semibold text-sm">{info.validity}</div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Quick Stats */}
      {info.required && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Processing Time', value: info.processing, emoji: '⏱️', color: 'rgba(99,102,241,0.15)', border: 'rgba(99,102,241,0.25)' },
            { label: 'Fee',             value: info.fee,        emoji: '💰', color: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.25)' },
            { label: 'Validity',        value: info.validity,   emoji: '📅', color: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.25)' },
          ].map(s => (
            <div key={s.label} className="p-3 rounded-xl text-center"
              style={{ background: s.color, border: `1px solid ${s.border}` }}>
              <div className="text-lg mb-1">{s.emoji}</div>
              <div className="text-white font-bold text-xs">{s.value}</div>
              <div className="text-white/35 text-xs mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Expandable Details */}
      <div className="rounded-2xl overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <button onClick={() => setOpen(o => !o)}
          className="w-full flex items-center justify-between p-4"
          style={{ borderBottom: open ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
          <span className="text-white/65 text-sm font-semibold">
            📋 Required Documents & Rules
          </span>
          {open ? <ChevronUp size={16} className="text-white/30" /> : <ChevronDown size={16} className="text-white/30" />}
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 space-y-4">

                {/* Documents */}
                <div>
                  <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-2">
                    Documents Required
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {info.documents.map((doc, i) => (
                      <motion.div key={doc}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="flex items-center gap-2 p-2 rounded-xl"
                        style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.15)' }}>
                        <CheckCircle size={12} className="text-violet-400 flex-shrink-0" />
                        <span className="text-white/70 text-xs">{doc}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Rules */}
                <div>
                  <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-2">
                    Travel Rules
                  </p>
                  <div className="space-y-1.5">
                    {info.rules.map((rule, i) => (
                      <div key={rule} className="flex items-start gap-2">
                        <AlertTriangle size={11} className="text-amber-400 flex-shrink-0 mt-0.5" />
                        <span className="text-white/60 text-xs">{rule}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Apply at */}
                {info.applyAt && (
                  <div className="p-3 rounded-xl"
                    style={{ background: 'rgba(37,99,235,0.12)', border: '1px solid rgba(37,99,235,0.2)' }}>
                    <p className="text-white/40 text-xs mb-1">Apply At</p>
                    <p className="text-blue-300 text-sm font-semibold">{info.applyAt}</p>
                  </div>
                )}

                {/* Note */}
                <div className="p-3 rounded-xl"
                  style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
                  <p className="text-amber-300 text-xs leading-relaxed">
                    💡 {info.note}
                  </p>
                </div>

                {/* External link */}
                <button
                  onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(dest.name + ' visa requirements for Indian passport 2024')}`, '_blank')}
                  className="w-full flex items-center justify-center gap-2 p-3 rounded-xl text-xs font-medium text-violet-300 transition-all"
                  style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.25)' }}>
                  <ExternalLink size={13} />
                  Check Latest Visa Requirements Online
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}