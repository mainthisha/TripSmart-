import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getT } from './i18n/index.js'
import api from './services/api'

import DestinationStep     from './components/steps/DestinationStep'
import TripDetailsStep     from './components/steps/TripDetailsStep'
import ActivitiesStep      from './components/steps/ActivitiesStep'
import BudgetStep          from './components/steps/BudgetStep'
import DestinationExplorer from './components/steps/DestinationExplorer'
import PackingList         from './components/dashboard/PackingList'
import WeatherWidget       from './components/dashboard/WeatherWidget'
import CurrencyExchange    from './components/dashboard/CurrencyExchange'
import TravelTips          from './components/dashboard/TravelTips'
import DepartureChecklist  from './components/dashboard/DepartureChecklist'
import TripPlanner         from './components/dashboard/TripPlanner'
import RouteMap            from './components/dashboard/RouteMap'
import TripDoc             from './components/dashboard/TripDoc'
import AISuggestions       from './components/dashboard/AISuggestions'
import TripExpenses        from './components/dashboard/TripExpenses'
import VisaInfo            from './components/dashboard/VisaInfo'
import SecretSpots         from './components/dashboard/SecretSpots'
import ShareTrip           from './components/dashboard/ShareTrip'
import BackendStatus       from './components/dashboard/BackendStatus'
import WelcomePage         from './components/ui/WelcomePage'
import NavBar              from './components/ui/NavBar'
import SavedTrips from './components/dashboard/SavedTrips'

/* ─────────────────────────────────────
   CONSTANTS
───────────────────────────────────── */
const STEP_LABELS = ['Destination','Trip Details','Activities','Budget','Explorer','Dashboard']
const TOTAL_STEPS = 6

const fmt = (v) =>
  new Intl.NumberFormat('en-IN', { style:'currency', currency:'INR', maximumFractionDigits:0 }).format(v||0)

/* ─────────────────────────────────────
   BACKGROUND ORBS — position:fixed ONLY
   Never affects document layout
───────────────────────────────────── */
function BgOrbs() {
  return (
    <>
      {/* Teal orb — top left */}
      <div className="orb" style={{
        width:'700px', height:'700px', top:'-220px', left:'-200px',
        background:'radial-gradient(circle, rgba(15,118,110,0.5) 0%, rgba(20,184,166,0.2) 40%, transparent 70%)',
        filter:'blur(60px)', opacity:0.14,
      }}/>
      {/* Violet orb — bottom right */}
      <div className="orb" style={{
        width:'550px', height:'550px', bottom:'-150px', right:'-160px',
        background:'radial-gradient(circle, rgba(99,102,241,0.5) 0%, rgba(129,140,248,0.2) 40%, transparent 70%)',
        filter:'blur(65px)', opacity:0.12,
        animationDelay:'5s',
      }}/>
      {/* Gold orb — mid */}
      <div className="orb-2" style={{
        width:'400px', height:'400px', top:'38%', left:'52%',
        background:'radial-gradient(circle, rgba(251,191,36,0.3) 0%, transparent 65%)',
        filter:'blur(90px)', opacity:0.06,
        animationDelay:'9s',
      }}/>
      {/* Coral orb — upper right */}
      <div className="orb-2" style={{
        width:'350px', height:'350px', top:'12%', right:'10%',
        background:'radial-gradient(circle, rgba(244,63,94,0.2) 0%, transparent 65%)',
        filter:'blur(80px)', opacity:0.07,
        animationDelay:'3s',
      }}/>
    </>
  )
}

/* ─────────────────────────────────────
   PANEL COMPONENT
   Uses .dash-panel CSS class — block layout
   Accent gradient bar on left edge
───────────────────────────────────── */
function Panel({ emoji, title, subtitle, gradient, children, delay = 0 }) {
  return (
    <motion.div
      className="dash-panel"
      initial={{ opacity:0, y:18 }}
      animate={{ opacity:1, y:0 }}
      transition={{ duration:0.38, delay, ease:[0.22,1,0.36,1] }}
    >
      {/* Left accent bar */}
      <div
        className="dash-panel-accent"
        style={{ background: gradient || 'linear-gradient(to bottom, #14b8a6, #6366f1)' }}
      />

      {/* Header row */}
      <div className="dash-panel-header">
        <div
          className="dash-panel-icon"
          style={{ background: gradient || 'linear-gradient(135deg,#0f766e,#6366f1)' }}
        >
          {emoji}
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div className="dash-panel-title">{title}</div>
          {subtitle && <div className="dash-panel-sub">{subtitle}</div>}
        </div>
      </div>

      {/* Content */}
      <div className="dash-panel-body">{children}</div>
    </motion.div>
  )
}

/* ─────────────────────────────────────
   BUDGET BAR
───────────────────────────────────── */
function BudgetBar({ label, pct, color, amount }) {
  return (
    <div style={{ marginBottom:'16px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'8px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
          <div style={{ width:'8px', height:'8px', borderRadius:'50%', background:color, boxShadow:`0 0 7px ${color}` }}/>
          <span style={{ color:'rgba(200,205,230,0.68)', fontSize:'13px', fontFamily:'Plus Jakarta Sans,sans-serif' }}>
            {label}
          </span>
          <span style={{ color:'rgba(160,168,200,0.3)', fontSize:'11px' }}>({pct}%)</span>
        </div>
        <span style={{ color:'rgba(240,242,255,0.9)', fontSize:'13px', fontWeight:'700', fontFamily:'Syne,sans-serif' }}>
          {fmt(amount)}
        </span>
      </div>
      <div style={{ height:'5px', borderRadius:'50px', overflow:'hidden', background:'rgba(255,255,255,0.05)', boxShadow:'inset 0 1px 3px rgba(0,0,0,0.3)' }}>
        <motion.div
          initial={{ width:0 }}
          animate={{ width:`${pct}%` }}
          transition={{ duration:1.1, delay:0.4, ease:[0.22,1,0.36,1] }}
          style={{ height:'100%', borderRadius:'50px', background:color, boxShadow:`0 0 10px ${color}70` }}
        />
      </div>
    </div>
  )
}

/* ─────────────────────────────────────
   STAT CARD
───────────────────────────────────── */
function StatCard({ emoji, label, value, sub, gradient, accentColor, delay }) {
  return (
    <motion.div
      className="stat-card"
      initial={{ opacity:0, y:14 }}
      animate={{ opacity:1, y:0 }}
      transition={{ delay, duration:0.38, ease:[0.22,1,0.36,1] }}
      whileHover={{ y:-6, scale:1.02 }}
      style={{ padding:'20px 16px', textAlign:'center', cursor:'default' }}
    >
      <div style={{
        width:'48px', height:'48px', borderRadius:'14px',
        background: gradient, margin:'0 auto 12px',
        display:'flex', alignItems:'center', justifyContent:'center',
        fontSize:'22px', position:'relative',
        boxShadow: `0 6px 24px rgba(0,0,0,0.5), 0 0 16px ${accentColor||'rgba(20,184,166,0.3)'}`,
      }}>
        <div style={{
          position:'absolute', inset:0, borderRadius:'14px',
          background:'linear-gradient(145deg, rgba(255,255,255,0.22) 0%, transparent 55%)',
          pointerEvents:'none',
        }}/>
        {emoji}
      </div>
      <div style={{ color:'rgba(240,242,255,0.92)', fontWeight:'800', fontSize:'14px', fontFamily:'Syne,sans-serif', letterSpacing:'-0.01em' }}>
        {value}
      </div>
      <div style={{ color:'rgba(160,168,200,0.45)', fontSize:'11px', marginTop:'3px', fontFamily:'Plus Jakarta Sans,sans-serif' }}>
        {label}
      </div>
      {sub && (
        <div style={{ color:'rgba(130,140,175,0.28)', fontSize:'10px', marginTop:'4px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
          {sub}
        </div>
      )}
    </motion.div>
  )
}

/* ─────────────────────────────────────
   DASHBOARD
───────────────────────────────────── */
function Dashboard({ tripData, goBack, resetApp, t }) {
  const dest    = tripData.destination
  const details = tripData.tripDetails || {}
  const budget  = tripData.budget || {}
  const acts    = tripData.activities || []

  const [savedTripId, setSavedTripId] = useState(null)
  const [savingTrip,  setSavingTrip]  = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError,   setSaveError]   = useState(false)

  const handleSaveTrip = async () => {
    setSavingTrip(true); setSaveError(false)
    try {
      const res = await api.saveTrip(tripData)
      if (res.success) {
        setSavedTripId(res.id); setSaveSuccess(true)
        setTimeout(() => setSaveSuccess(false), 4000)
      } else { setSaveError(true); setTimeout(() => setSaveError(false), 3000) }
    } catch { setSaveError(true); setTimeout(() => setSaveError(false), 3000) }
    finally { setSavingTrip(false) }
  }

  const pills = [
    { emoji:'📍', label: dest?.name||'N/A' },
    { emoji:'💰', label: fmt(budget.total) },
    { emoji:'👥', label: `${details.travelers||0} ${t('common.travelers')}` },
    { emoji:'🌙', label: `${details.duration||0} ${t('common.nights')}` },
    { emoji:'🏨', label: (budget.accommodation||'N/A').replace(/_/g,' ') },
    { emoji:'✈️', label: details.tripType
        ? details.tripType[0].toUpperCase()+details.tripType.slice(1)+' Trip'
        : 'Trip' },
  ]

  return (
    <div style={{ width:'100%' }}>

      {/* ══ HERO HEADER ══ */}
      <motion.div
        initial={{ opacity:0, y:-16 }}
        animate={{ opacity:1, y:0 }}
        transition={{ duration:0.5, ease:[0.22,1,0.36,1] }}
        style={{
          textAlign:'center',
          padding:'40px 24px 32px',
          marginBottom:'20px',
          /* Teal radial glow — different from before */
          background:`
            radial-gradient(ellipse 80% 60% at 50% 0%, rgba(15,118,110,0.15) 0%, transparent 65%),
            linear-gradient(180deg, rgba(13,15,28,0.6) 0%, transparent 100%)
          `,
          borderRadius:'28px',
          border:'1px solid rgba(20,184,166,0.08)',
          position:'relative',
          overflow:'hidden',
        }}
      >
        {/* Teal sweep line */}
        <div style={{
          position:'absolute', top:0, left:'10%', right:'10%', height:'1px',
          background:'linear-gradient(90deg, transparent, rgba(20,184,166,0.6), rgba(129,140,248,0.5), transparent)',
          pointerEvents:'none',
        }}/>

        {/* Destination chip */}
        {dest && (
          <motion.div
            initial={{ opacity:0, scale:0.88 }}
            animate={{ opacity:1, scale:1 }}
            transition={{ delay:0.1 }}
            style={{ marginBottom:'18px' }}
          >
            <span style={{
              display:'inline-flex', alignItems:'center', gap:'10px',
              padding:'7px 20px', borderRadius:'50px',
              /* Teal accent chip */
              background:'rgba(20,184,166,0.1)',
              border:'1px solid rgba(20,184,166,0.3)',
              fontSize:'13px', fontWeight:'600',
              color:'rgba(45,212,191,0.95)',
              fontFamily:'Plus Jakarta Sans,sans-serif',
              boxShadow:'0 2px 14px rgba(20,184,166,0.2)',
            }}>
              <span style={{ fontSize:'16px' }}>{dest.emoji}</span>
              {dest.name}, {dest.country}
              <span style={{
                width:'7px', height:'7px', borderRadius:'50%',
                background:'#2dd4bf',
                boxShadow:'0 0 10px rgba(45,212,191,0.9)',
                display:'inline-block',
              }}/>
            </span>
          </motion.div>
        )}

        <motion.h1
          initial={{ opacity:0, y:18 }}
          animate={{ opacity:1, y:0 }}
          transition={{ delay:0.15 }}
          style={{
            fontFamily:'Syne,sans-serif',
            fontSize:'clamp(28px,5.5vw,56px)',
            fontWeight:'800',
            lineHeight:1.08,
            marginBottom:'14px',
            letterSpacing:'-0.03em',
          }}
        >
          {/* Teal-violet gradient text */}
          <span style={{
            background:'linear-gradient(135deg, #2dd4bf 0%, #818cf8 50%, #c4b5fd 100%)',
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
            display:'block',
          }}>
            {t('dash.title1')}
          </span>
          <span style={{ color:'rgba(240,242,255,0.96)', display:'block' }}>
            {t('dash.title2')}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity:0 }}
          animate={{ opacity:1 }}
          transition={{ delay:0.22 }}
          style={{ color:'rgba(160,168,200,0.5)', fontSize:'15px', marginBottom:'24px', fontFamily:'Plus Jakarta Sans,sans-serif' }}
        >
          Your dream trip {t('dash.allSet')} — ready to explore every detail 🎉
        </motion.p>

        {/* Pills */}
        <motion.div
          initial={{ opacity:0, y:8 }}
          animate={{ opacity:1, y:0 }}
          transition={{ delay:0.28 }}
          style={{ display:'flex', flexWrap:'wrap', justifyContent:'center', gap:'8px' }}
        >
          {pills.map((p,i) => (
            <motion.span key={p.label}
              initial={{ opacity:0, scale:0.8 }}
              animate={{ opacity:1, scale:1 }}
              transition={{ delay:0.32+i*0.05 }}
              className="badge capitalize">
              {p.emoji} {p.label}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>

      {/* ══ STATS GRID ══ */}
      <div style={{
        display:'grid',
        gridTemplateColumns:'repeat(auto-fit, minmax(148px, 1fr))',
        gap:'12px', marginBottom:'20px', width:'100%',
      }}>
        <StatCard emoji="🗺️" label="Destination"
          value={dest?.name||'N/A'} sub={dest?.country||''}
          gradient="linear-gradient(135deg,#0f766e,#14b8a6)"
          accentColor="rgba(20,184,166,0.4)" delay={0.20}/>
        <StatCard emoji="📅" label="Start Date"
          value={details.startDate
            ? new Date(details.startDate).toLocaleDateString('en-IN',{day:'numeric',month:'short'})
            : 'N/A'}
          sub={`${details.duration||0} nights`}
          gradient="linear-gradient(135deg,#1e3a5f,#2563eb)"
          accentColor="rgba(37,99,235,0.4)" delay={0.26}/>
        <StatCard emoji="🎯" label="Activities"
          value={`${acts.length} Selected`}
          sub={acts.slice(0,2).join(', ')||'—'}
          gradient="linear-gradient(135deg,#4c1d95,#6366f1)"
          accentColor="rgba(99,102,241,0.4)" delay={0.32}/>
        <StatCard emoji="💳" label="Budget/Day"
          value={fmt(budget.perDay||0)} sub="Per day estimate"
          gradient="linear-gradient(135deg,#78350f,#d97706)"
          accentColor="rgba(251,191,36,0.4)" delay={0.38}/>
      </div>

      {/* ══ ALL PANELS ══ */}

      <Panel emoji="🖥️"
        title="Backend API Status"
        subtitle="FastAPI server health — all endpoints live"
        gradient="linear-gradient(180deg,#1e293b,#0f172a)"
        delay={0.10}>
        <BackendStatus />
      </Panel>

      <Panel emoji="🗂️"
        title="Saved Trips"
        subtitle="All your previously saved trip plans"
        gradient="linear-gradient(180deg,#0f766e,#14b8a6)"
        delay={0.11}>
        <SavedTrips />
      </Panel>

      <Panel emoji="🧠"
        title={t('dash.sections.suggestions')}
        subtitle={t('dash.sections.suggSub')}
        gradient="linear-gradient(180deg,#14b8a6,#6366f1)"
        delay={0.12}>
        <AISuggestions tripData={tripData} />
      </Panel>

      {budget.breakdown && (
        <Panel emoji="💰"
          title={t('dash.sections.budgetBreak')}
          subtitle={t('dash.sections.budgetSub')}
          gradient="linear-gradient(180deg,#d97706,#c2410c)"
          delay={0.14}>
          <BudgetBar label="Accommodation" pct={35} color="#8b5cf6" amount={budget.breakdown.stay}/>
          <BudgetBar label="Food & Dining" pct={25} color="#14b8a6" amount={budget.breakdown.food}/>
          <BudgetBar label="Transport"     pct={20} color="#38bdf8" amount={budget.breakdown.transport}/>
          <BudgetBar label="Activities"    pct={12} color="#fbbf24" amount={budget.breakdown.activities}/>
          <BudgetBar label="Miscellaneous" pct={8}  color="#fb7185" amount={budget.breakdown.misc}/>
        </Panel>
      )}

      {acts.length > 0 && (
        <Panel emoji="🎯"
          title={t('dash.sections.activities')}
          subtitle={t('dash.sections.actSub')}
          gradient="linear-gradient(180deg,#4f46e5,#0891b2)"
          delay={0.15}>
          <div style={{ display:'flex', flexWrap:'wrap', gap:'8px' }}>
            {acts.map((act,i) => (
              <motion.span key={act}
                initial={{ opacity:0, scale:0.85 }}
                animate={{ opacity:1, scale:1 }}
                transition={{ delay:i*0.04 }}
                className="badge capitalize">{act}
              </motion.span>
            ))}
          </div>
        </Panel>
      )}

      <Panel emoji="🛂"
        title={t('dash.sections.visa')}
        subtitle={t('dash.sections.visaSub')}
        gradient="linear-gradient(180deg,#be123c,#e11d48)"
        delay={0.16}>
        <VisaInfo tripData={tripData} />
      </Panel>

      <Panel emoji="💎"
        title={t('dash.sections.hiddenGems')}
        subtitle={t('dash.sections.gemsSub')}
        gradient="linear-gradient(180deg,#0f766e,#0d9488)"
        delay={0.17}>
        <SecretSpots tripData={tripData} />
      </Panel>

      <Panel emoji="💸"
        title={t('dash.sections.expenses')}
        subtitle={t('dash.sections.expSub')}
        gradient="linear-gradient(180deg,#059669,#047857)"
        delay={0.18}>
        <TripExpenses tripData={tripData} />
      </Panel>

      <Panel emoji="🗓️"
        title={t('dash.sections.itinerary')}
        subtitle={t('dash.sections.itiSub')}
        gradient="linear-gradient(180deg,#6366f1,#0891b2)"
        delay={0.19}>
        <TripPlanner tripData={tripData} />
      </Panel>

      <Panel emoji="🗺️"
        title={t('dash.sections.routeMap')}
        subtitle={t('dash.sections.routeSub')}
        gradient="linear-gradient(180deg,#0284c7,#0369a1)"
        delay={0.20}>
        <RouteMap tripData={tripData} />
      </Panel>

      <Panel emoji="📄"
        title={t('dash.sections.tripSummary')}
        subtitle={t('dash.sections.sumSub')}
        gradient="linear-gradient(180deg,#b45309,#92400e)"
        delay={0.21}>
        <TripDoc tripData={tripData} />
      </Panel>

      <Panel emoji="🌤️"
        title={t('dash.sections.weather')}
        subtitle={t('dash.sections.weatherSub')}
        gradient="linear-gradient(180deg,#0e7490,#06b6d4)"
        delay={0.22}>
        <WeatherWidget destination={dest} />
      </Panel>

      <Panel emoji="💱"
        title={t('dash.sections.currency')}
        subtitle={t('dash.sections.currSub')}
        gradient="linear-gradient(180deg,#166534,#15803d)"
        delay={0.23}>
        <CurrencyExchange tripData={tripData} />
      </Panel>

      <Panel emoji="💡"
        title={t('dash.sections.tips')}
        subtitle={t('dash.sections.tipsSub')}
        gradient="linear-gradient(180deg,#a16207,#ca8a04)"
        delay={0.24}>
        <TravelTips tripData={tripData} />
      </Panel>

      <Panel emoji="🎒"
        title={t('dash.sections.packing')}
        subtitle={t('dash.sections.packSub')}
        gradient="linear-gradient(180deg,#5b21b6,#7c3aed)"
        delay={0.25}>
        <PackingList tripData={tripData} />
      </Panel>

      <Panel emoji="✅"
        title={t('dash.sections.checklist')}
        subtitle={t('dash.sections.checkSub')}
        gradient="linear-gradient(180deg,#065f46,#059669)"
        delay={0.26}>
        <DepartureChecklist tripData={tripData} />
      </Panel>

      <Panel emoji="🔗"
        title="Share & Collaborate"
        subtitle="Invite friends to plan this trip together"
        gradient="linear-gradient(180deg,#0f766e,#4f46e5)"
        delay={0.27}>
        <ShareTrip tripData={tripData} />
      </Panel>

      {/* ══ BOTTOM NAV ══ */}
      <motion.div
        initial={{ opacity:0 }}
        animate={{ opacity:1 }}
        transition={{ delay:0.42 }}
        style={{
          display:'flex', justifyContent:'space-between', alignItems:'center',
          flexWrap:'wrap', gap:'12px',
          padding:'20px 0 44px',
          borderTop:'1px solid rgba(20,184,166,0.08)',
          marginTop:'4px',
        }}
      >
        <motion.button
          onClick={goBack}
          whileHover={{ scale:1.03, x:-3 }} whileTap={{ scale:0.97 }}
          className="btn-secondary"
          style={{ padding:'13px 28px' }}
        >
          ← {t('dash.backBtn')}
        </motion.button>

        <div style={{ display:'flex', gap:'10px', flexWrap:'wrap', alignItems:'center' }}>
          <motion.button
            onClick={handleSaveTrip}
            disabled={savingTrip}
            whileHover={{ scale:savingTrip?1:1.03, y:savingTrip?0:-2 }}
            whileTap={{ scale:0.97 }}
            style={{
              padding:'13px 24px', borderRadius:'13px', border:'none',
              cursor:savingTrip?'wait':'pointer',
              fontFamily:'Syne,sans-serif', fontSize:'14px', fontWeight:'700',
              display:'flex', alignItems:'center', gap:'8px',
              color:'white', opacity:savingTrip?0.7:1,
              transition:'all 0.3s ease',
              background: saveError
                ? 'linear-gradient(135deg,#dc2626,#b91c1c)'
                : saveSuccess
                ? 'linear-gradient(135deg,#059669,#047857)'
                : 'linear-gradient(135deg,#0f766e,#14b8a6)',
              boxShadow: saveSuccess
                ? '0 6px 24px rgba(5,150,105,0.5)'
                : saveError
                ? '0 6px 24px rgba(220,38,38,0.5)'
                : '0 6px 24px rgba(20,184,166,0.45)',
            }}
          >
            {savingTrip?'⏳ Saving...'
              :saveSuccess?'✅ Saved!'
              :saveError?'❌ Failed'
              :'💾 Save Trip'}
          </motion.button>

          <motion.button
            onClick={resetApp}
            whileHover={{ scale:1.03, y:-2 }} whileTap={{ scale:0.97 }}
            className="btn-primary"
            style={{ padding:'13px 26px' }}
          >
            🌍 {t('dash.newTrip')}
          </motion.button>
        </div>
      </motion.div>

      <AnimatePresence>
        {savedTripId && saveSuccess && (
          <motion.div
            initial={{ opacity:0, y:10, scale:0.96 }}
            animate={{ opacity:1, y:0, scale:1 }}
            exit={{ opacity:0, y:-10 }}
            style={{
              padding:'18px 24px', borderRadius:'18px', textAlign:'center',
              marginBottom:'32px',
              background:'rgba(20,184,166,0.08)',
              border:'1px solid rgba(20,184,166,0.28)',
              boxShadow:'0 8px 32px rgba(20,184,166,0.12)',
            }}
          >
            <p style={{ color:'#2dd4bf', fontSize:'15px', fontWeight:'700', marginBottom:'5px', fontFamily:'Syne,sans-serif' }}>
              🎉 Trip saved to backend!
            </p>
            <p style={{ color:'rgba(160,168,200,0.4)', fontSize:'12px', fontFamily:'Plus Jakarta Sans,sans-serif' }}>
              ID: <code style={{ color:'#818cf8', fontWeight:'600' }}>{savedTripId}</code>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─────────────────────────────────────
   STEP PROGRESS
───────────────────────────────────── */
function StepProgress({ currentStep, onStepClick }) {
  const pct = ((currentStep-1) / (TOTAL_STEPS-1)) * 100
  return (
    <div className="content-layer" style={{ paddingTop:'68px' }}>
      <div style={{ maxWidth:'700px', margin:'0 auto', padding:'16px 20px 12px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'14px' }}>
          {STEP_LABELS.map((label,i) => {
            const id=i+1, done=id<currentStep, act=id===currentStep
            return (
              <div key={id} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'5px' }}>
                <div
                  className={`step-dot ${done?'step-dot-done':act?'step-dot-active':'step-dot-pending'}`}
                  onClick={() => done && onStepClick(id)}
                  style={{ cursor:done?'pointer':'default' }}
                >
                  {done?'✓':id}
                </div>
                <span className="hidden sm:block" style={{
                  fontSize:'9px', fontWeight:'600', textTransform:'uppercase',
                  letterSpacing:'0.06em', fontFamily:'Plus Jakarta Sans,sans-serif',
                  color: act?'rgba(45,212,191,1)' : done?'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.16)',
                  transition:'color 0.3s',
                }}>
                  {label}
                </span>
              </div>
            )
          })}
        </div>
        <div className="progress-bar">
          <motion.div
            className="progress-fill"
            initial={{ width:0 }}
            animate={{ width:`${pct}%` }}
            transition={{ duration:0.6, ease:'easeInOut' }}
          />
        </div>
        <div style={{ textAlign:'center', marginTop:'9px' }}>
          <span style={{ color:'rgba(160,168,200,0.22)', fontSize:'10px', fontWeight:'500', letterSpacing:'0.14em', textTransform:'uppercase', fontFamily:'Plus Jakarta Sans,sans-serif' }}>
            Step {currentStep} of {TOTAL_STEPS} — {STEP_LABELS[currentStep-1]}
          </span>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────
   MAIN APP
───────────────────────────────────── */
export default function App() {
  const [lang,        setLang]        = useState('en')
  const [showHero,    setShowHero]    = useState(true)
  const [currentStep, setCurrentStep] = useState(1)
  const [tripData,    setTripData]    = useState({
    destination:null, tripDetails:{}, activities:[], budget:{},
  })

  const t = (key) => getT(lang, key)

  const updateTripData = (key,val) => setTripData(p => ({ ...p, [key]:val }))
  const goNext    = () => setCurrentStep(p => Math.min(p+1, TOTAL_STEPS))
  const goBack    = () => setCurrentStep(p => Math.max(p-1, 1))
  const handleNav = (s) => { setShowHero(false); setCurrentStep(s) }
  const startPlanning = () => { setShowHero(false); setCurrentStep(1) }
  const resetApp  = () => {
    setShowHero(true); setCurrentStep(1)
    setTripData({ destination:null, tripDetails:{}, activities:[], budget:{} })
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <DestinationStep    onNext={goNext} tripData={tripData} updateTripData={updateTripData}/>
      case 2: return <TripDetailsStep    onNext={goNext} onBack={goBack} tripData={tripData} updateTripData={updateTripData}/>
      case 3: return <ActivitiesStep     onNext={goNext} onBack={goBack} tripData={tripData} updateTripData={updateTripData}/>
      case 4: return <BudgetStep         onNext={goNext} onBack={goBack} tripData={tripData} updateTripData={updateTripData}/>
      case 5: return <DestinationExplorer onNext={goNext} onBack={goBack} tripData={tripData}/>
      case 6: return <Dashboard tripData={tripData} goBack={goBack} resetApp={resetApp} t={t}/>
      default: return null
    }
  }

  /* ── HERO ── */
  if (showHero) return (
    <div style={{ width:'100vw', minHeight:'100vh', background:'#07080f', overflow:'hidden', margin:0, padding:0, position:'relative' }}>
      <BgOrbs />
      <div className="content-layer">
        <NavBar currentStep={0} onNavigate={handleNav} lang={lang} onChangeLang={setLang}/>
        <WelcomePage
          onStartPlanning={startPlanning}
          onExplore={() => { setShowHero(false); setCurrentStep(1) }}
          lang={lang}
        />
      </div>
    </div>
  )

  /* ── WIZARD ── */
  return (
    <div style={{
      width:'100vw', minHeight:'100vh', margin:0, padding:0, overflowX:'hidden',
      position:'relative',
      /* New obsidian + teal background — NOT the old purple */
      background:`
        radial-gradient(ellipse 75% 45% at 10% 5%,  rgba(15,118,110,0.16) 0%, transparent 55%),
        radial-gradient(ellipse 65% 40% at 90% 85%, rgba(99,102,241,0.12) 0%, transparent 50%),
        radial-gradient(ellipse 50% 35% at 85% 5%,  rgba(251,191,36,0.06) 0%, transparent 45%),
        linear-gradient(175deg, #07080f 0%, #0b0d1c 55%, #07080f 100%)
      `,
    }}>

      {/* Orbs — always position:fixed z-index:0 */}
      <BgOrbs />

      {/* Navbar */}
      <div style={{ position:'relative', zIndex:10 }}>
        <NavBar currentStep={currentStep} onNavigate={handleNav} lang={lang} onChangeLang={setLang}/>
      </div>

      {/* Progress */}
      <StepProgress currentStep={currentStep} onStepClick={setCurrentStep}/>

      {/* Step content */}
      <div className="content-layer" style={{ padding:'0 16px 60px' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity:0, x:32, scale:0.99 }}
            animate={{ opacity:1, x:0, scale:1 }}
            exit={{ opacity:0, x:-32, scale:0.99 }}
            transition={{ duration:0.28, ease:[0.22,1,0.36,1] }}
            style={{
              maxWidth: currentStep===6 ? '1080px' : '720px',
              margin:'0 auto', width:'100%',
            }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
