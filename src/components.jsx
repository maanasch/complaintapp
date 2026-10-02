import { NavLink, useNavigate } from 'react-router-dom'
import * as Ic from './icons.jsx'
import { catById } from './data.js'
import { Logo, MascotHead } from './brand.jsx'
import { LANGS, useLang } from './i18n.jsx'

export function Screen({ tabs = true, children, className = '' }) {
  return (
    <div className={`screen fade-in ${tabs ? 'with-tabs' : ''} ${className}`}>
      {children}
      <AppFooter />
    </div>
  )
}

/* Institutional footer, shown at the bottom of every screen */
const STUDENTS = ['Parisha Mehta', 'Maanas Chaudhari', 'Koutilya Karamala', 'Manan Gupta', 'Mansi.']
const FACULTY = ['Jitender Arora']
const FELLOWS = ['Zarqa Khan']

export function AppFooter() {
  const { t } = useLang()
  return (
    <footer className="appfoot">
      <img className="appfoot-logo" src="/BITSlogo.svg" alt="BITS Design School" width="39" height="52" />
      <div className="appfoot-text">
        <span className="appfoot-title">{t('studentProject')}</span>
        <span className="appfoot-credit"><b>{t('students')}:</b> {STUDENTS.join(' | ')}</span>
        <span className="appfoot-credit"><b>{t('faculty')}:</b> {FACULTY.join(' | ')}</span>
        <span className="appfoot-credit"><b>{t('academicFellow')}:</b> {FELLOWS.join(' | ')}</span>
        <span className="appfoot-copy">
          © BITS Design School, BITS Pilani Mumbai Campus. All Rights Reserved.
        </span>
      </div>
    </footer>
  )
}

/* EN / हिं / मरा segmented toggle, present on every screen */
export function LangToggle() {
  const { lang, setLang } = useLang()
  return (
    <div className="lang" role="group" aria-label="Language">
      {LANGS.map((l) => (
        <button
          key={l.id}
          className={`lang-btn ${l.id === lang ? 'active' : ''} ${l.id !== 'en' ? 'dev' : ''}`}
          onClick={() => setLang(l.id)}
          aria-pressed={l.id === lang}
          title={l.name}
        >
          {l.label}
        </button>
      ))}
    </div>
  )
}

export function TopBar({ title, back, right, brand = false, onBack }) {
  const nav = useNavigate()
  const goBack = () => (onBack ? onBack() : back === true ? nav(-1) : nav(back))
  return (
    <header className="topbar">
      {back ? (
        <button className="iconbtn" onClick={goBack} aria-label="Back"><Ic.Back /></button>
      ) : brand ? (
        <Logo size={22} />
      ) : <span className="spacer" />}
      {title && <span className="title">{title}</span>}
      <span className="topbar-right">
        {right}
        <LangToggle />
      </span>
    </header>
  )
}

export function TabBar() {
  const { t } = useLang()
  const tabs = [
    { to: '/', label: t('tabHome'), icon: Ic.Home, end: true },
    { to: '/report', label: t('tabReport'), icon: Ic.Report },
    { to: '/around', label: t('tabAround'), icon: Ic.Around },
  ]
  return (
    <nav className="tabbar">
      {tabs.map(({ to, label, icon: Icon, end }) => (
        <NavLink key={to} to={to} end={end} className={({ isActive }) => `tab ${isActive ? 'active' : ''}`}>
          <Icon />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

export function Option({ icon: Icon, title, sub, onClick, tone = '', selected, chevron = true }) {
  return (
    <button className={`option ${tone} ${selected ? 'selected' : ''}`} onClick={onClick}>
      <span className="ico"><Icon /></span>
      <span className="txt"><b>{title}</b>{sub && <span>{sub}</span>}</span>
      {chevron && <span className="chev"><Ic.Chevron /></span>}
    </button>
  )
}

/* Mascot head + speech bubble */
export function Mascot({ size, children, q, mood = 'happy' }) {
  return (
    <div className="mascot-row">
      <div className={`mascot ${size === 'lg' ? 'lg' : ''}`}><MascotHead mood={mood} size={size === 'lg' ? 84 : 56} /></div>
      {children && <div className={`bubble ${q ? 'q' : ''}`}>{children}</div>}
    </div>
  )
}

export function Steps({ step, total = 4 }) {
  return (
    <div className="steps" aria-label={`Step ${step} of ${total}`}>
      {Array.from({ length: total }, (_, i) => <i key={i} className={i < step ? 'done' : ''} />)}
    </div>
  )
}

const STATUS_KEY = { submitted: 'submitted', progress: 'inProgress', fixed: 'fixed' }
export function Pill({ status }) {
  const { t } = useLang()
  return <span className={`pill ${status}`}>{t(STATUS_KEY[status])}</span>
}

/* Compact 4-dot version of the complaint timeline, for list rows */
export function MiniProgress({ timeline, status }) {
  const doneIdx = timeline.reduce((acc, s, i) => (s.t ? i : acc), -1)
  return (
    <span className="mini-steps" aria-hidden>
      {timeline.map((s, i) => (
        <i key={i} className={i < doneIdx ? 'done' : i === doneIdx && status !== 'fixed' ? 'now' : i <= doneIdx ? 'done' : ''} />
      ))}
    </span>
  )
}

export function ReportRow({ r, onClick, right }) {
  const cat = catById(r.category)
  const Icon = cat.icon
  return (
    <button className="row" onClick={onClick}>
      <span className="thumb">{r.photo ? <img src={r.photo} alt="" /> : <Icon />}</span>
      <span className="txt">
        <b>{r.title}</b>
        <span className="small">{r.location}{r.dist ? ` · ${r.dist}` : ''}</span>
        <span className="meta">
          <Pill status={r.status} />
          {r.timeline && <MiniProgress timeline={r.timeline} status={r.status} />}
        </span>
        {right && <span className="small">{right}</span>}
      </span>
      <span className="chev"><Ic.Chevron /></span>
    </button>
  )
}

export function MapMock({ label, pulse = false }) {
  return (
    <div className="map" aria-hidden>
      <div className="park" style={{ left: 14, top: 18, width: 90, height: 60 }} />
      <div className="park" style={{ right: 20, bottom: 24, width: 70, height: 50 }} />
      <div className="road h" style={{ top: '48%' }} />
      <div className="road h" style={{ top: '12%', height: 8 }} />
      <div className="road v" style={{ left: '38%' }} />
      <div className="road v" style={{ left: '76%', width: 8 }} />
      {pulse && <div className="pulse" />}
      <div className="pin"><Ic.PinSolid /></div>
      {label && (
        <div style={{ position: 'absolute', left: 10, bottom: 10 }}>
          <span className="tag"><Ic.Pin />{label}</span>
        </div>
      )}
    </div>
  )
}
