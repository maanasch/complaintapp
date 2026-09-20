import { NavLink, useNavigate } from 'react-router-dom'
import * as Ic from './icons.jsx'
import { STATUS, catById } from './data.js'

export function Screen({ tabs = true, children, className = '' }) {
  return <div className={`screen fade-in ${tabs ? 'with-tabs' : ''} ${className}`}>{children}</div>
}

export function TopBar({ title, back, right, brand = false, onBack }) {
  const nav = useNavigate()
  const goBack = () => (onBack ? onBack() : back === true ? nav(-1) : nav(back))
  return (
    <header className="topbar">
      {back ? (
        <button className="iconbtn" onClick={goBack} aria-label="Back"><Ic.Back /></button>
      ) : brand ? (
        <span className="brand">MyBMC</span>
      ) : <span className="spacer" />}
      {title && <span className="title">{title}</span>}
      {right ?? <span className="spacer" />}
    </header>
  )
}

export function TabBar() {
  const tabs = [
    { to: '/', label: 'Home', icon: Ic.Home, end: true },
    { to: '/report', label: 'Report', icon: Ic.Report },
    { to: '/around', label: 'Around Me', icon: Ic.Around },
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

export function Mascot({ size, children, q }) {
  return (
    <div className="mascot-row">
      <div className={`mascot ${size === 'lg' ? 'lg' : ''}`}><Ic.MascotFace /></div>
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

export function Pill({ status }) {
  const s = STATUS[status]
  return <span className={`pill ${s.cls}`}>{s.label}</span>
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
        <span className="meta"><Pill status={r.status} />{right && <span className="small">{right}</span>}</span>
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
