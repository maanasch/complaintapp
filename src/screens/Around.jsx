import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Screen, TopBar, ReportRow, Pill, Mascot, MapMock } from '../components.jsx'
import * as Ic from '../icons.jsx'
import { AROUND, AROUND_STATS, catById, MOCK_LOCATION } from '../data.js'

export function AroundMe() {
  const nav = useNavigate()
  const [filter, setFilter] = useState('all')
  const shown = AROUND.filter((a) =>
    filter === 'all' ? true : filter === 'fixed' ? a.status === 'fixed' : a.status !== 'fixed',
  )

  return (
    <Screen>
      <TopBar brand right={<span className="tagline"><Ic.Pin width={16} height={16} style={{ verticalAlign: -3 }} /> {MOCK_LOCATION.label}</span>} />
      <div className="content">
        <div>
          <h1 className="h1">Around me</h1>
          <p className="sub" style={{ marginTop: 6 }}>Issues reported within 1 km of you.</p>
        </div>

        <div className="card navy stat">
          <div>
            <span className="eyebrow" style={{ color: 'var(--yellow)' }}>This week</span>
            <div className="h3" style={{ marginTop: 4, color: '#fff' }}>{AROUND_STATS.fixed} fixed · {AROUND_STATS.open} in progress</div>
            <span className="small">Because people around you reported them.</span>
          </div>
        </div>

        <div className="chips">
          {[['all', 'All'], ['open', 'In progress'], ['fixed', 'Fixed']].map(([k, l]) => (
            <button key={k} className={`chip ${filter === k ? 'active' : ''}`} onClick={() => setFilter(k)}>{l}</button>
          ))}
        </div>

        <div className="list">
          {shown.map((a) => (
            <ReportRow key={a.id} r={a} right={`${a.reports} reports`} onClick={() => nav(`/around/${a.id}`)} />
          ))}
        </div>
      </div>
    </Screen>
  )
}

export function AroundDetail() {
  const nav = useNavigate()
  const { id } = useParams()
  const a = AROUND.find((x) => x.id === id)
  if (!a) return <Screen><TopBar back /><div className="content"><p className="sub">Not found.</p></div></Screen>
  const cat = catById(a.category)
  const Icon = cat.icon
  const fixed = a.status === 'fixed'

  return (
    <Screen>
      <TopBar back="/around" title="What changed?" />
      <div className="content">
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="eyebrow">{cat.label} · {a.location}</span>
            <Pill status={a.status} />
          </div>
          <h1 className="h2" style={{ marginTop: 6 }}>{a.title}</h1>
          <p className="sub" style={{ marginTop: 4 }}>{a.reports} people reported this · {a.dist} from you</p>
        </div>

        <div className="ba">
          <div className="shot">
            <div className="img"><Icon width={36} height={36} style={{ color: 'var(--grey)' }} /></div>
            <div className="band orange"><span className="dev">आधी</span> · Before · {a.before}</div>
          </div>
          <div className="shot">
            <div className="img">{fixed ? <Ic.Check width={36} height={36} style={{ color: 'var(--green)' }} /> : <span>Pending</span>}</div>
            <div className={`band ${fixed ? 'green' : ''}`} style={!fixed ? { background: 'var(--line-strong)', color: 'var(--grey)' } : {}}>
              <span className="dev">नंतर</span> · After{fixed ? ` · ${a.after}` : ''}
            </div>
          </div>
        </div>

        <MapMock label={a.location} />

        {fixed ? (
          <Mascot>Fixed in {daysBetween(a.before, a.after)} days after the first complaint. Thanks to the people who reported it.</Mascot>
        ) : (
          <Mascot>Seeing this too? Adding your report helps BMC prioritise it.</Mascot>
        )}

        {!fixed && (
          <button className="btn btn-primary" onClick={() => nav('/report/new')}>
            <Ic.Plus /> I see this too
          </button>
        )}
      </div>
    </Screen>
  )
}

function daysBetween(a, b) {
  const p = (s) => new Date(`${s} 2026`)
  const d = Math.round((p(b) - p(a)) / 86400000)
  return Number.isFinite(d) && d > 0 ? d : 1
}
