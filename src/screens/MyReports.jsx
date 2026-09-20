import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Screen, TopBar, ReportRow, Pill, Mascot } from '../components.jsx'
import * as Ic from '../icons.jsx'
import { catById } from '../data.js'
import { useStore } from '../store.jsx'

export function MyReports() {
  const nav = useNavigate()
  const { reports } = useStore()
  const [filter, setFilter] = useState('all')
  const shown = reports.filter((r) =>
    filter === 'all' ? true : filter === 'fixed' ? r.status === 'fixed' : r.status !== 'fixed',
  )

  return (
    <Screen>
      <TopBar back="/report" title="My reports" />
      <div className="content">
        <div className="chips">
          {[['all', 'All'], ['open', 'In progress'], ['fixed', 'Fixed']].map(([k, l]) => (
            <button key={k} className={`chip ${filter === k ? 'active' : ''}`} onClick={() => setFilter(k)}>{l}</button>
          ))}
        </div>

        <div className="list">
          {shown.map((r) => (
            <ReportRow key={r.id} r={r} right={r.id} onClick={() => nav(`/report/my/${r.id}`)} />
          ))}
          {shown.length === 0 && <p className="sub center" style={{ padding: 30 }}>Nothing here yet.</p>}
        </div>

        <button className="option" onClick={() => nav('/report/check')}>
          <span className="ico" style={{ background: 'var(--yellow-soft)', color: '#9a6a00' }}><Ic.Search /></span>
          <span className="txt"><b>Have a complaint number?</b><span>Check its status without logging in.</span></span>
          <span className="chev"><Ic.Chevron /></span>
        </button>
      </div>
    </Screen>
  )
}

export function ReportDetail() {
  const nav = useNavigate()
  const { id } = useParams()
  const { reports } = useStore()
  const r = reports.find((x) => x.id === id)
  if (!r) return (
    <Screen><TopBar back title="Report" /><div className="content"><p className="sub">Report not found.</p></div></Screen>
  )
  const cat = catById(r.category)
  const Icon = cat.icon
  const doneIdx = r.timeline.reduce((acc, s, i) => (s.t ? i : acc), -1)

  return (
    <Screen>
      <TopBar back title="Your report" />
      <div className="content">
        <div className="card flush">
          {r.photo ? (
            <img src={r.photo} alt="" style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover' }} />
          ) : (
            <div style={{ aspectRatio: '16/9', background: 'var(--sand)', display: 'grid', placeItems: 'center', color: 'var(--blue)' }}>
              <Icon width={40} height={40} />
            </div>
          )}
          <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
              <span className="eyebrow">{r.id}</span>
              <Pill status={r.status} />
            </div>
            <h1 className="h2">{r.title}</h1>
            <p className="sub">{r.description}</p>
            <dl className="kv">
              <dt>Type</dt><dd>{cat.label}</dd>
              <dt>Where</dt><dd>{r.location}</dd>
              <dt>Ward</dt><dd>{r.ward}</dd>
              <dt>Reported</dt><dd>{r.reported}</dd>
              <dt>Dept.</dt><dd>{cat.dept}</dd>
            </dl>
          </div>
        </div>

        <section className="card">
          <h2 className="h3" style={{ marginBottom: 14 }}>Progress</h2>
          <div className="timeline">
            {r.timeline.map((s, i) => (
              <div key={i} className={`tl ${i < doneIdx ? 'done' : i === doneIdx ? (r.status === 'fixed' ? 'done' : 'now') : ''}`}>
                <div className="dot"><i /></div>
                <div className="body">
                  <b>{s.title}</b>
                  <span>{s.t ? `${s.t}${s.note ? ' · ' + s.note : ''}` : s.note || 'Pending'}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {r.status !== 'fixed' && (
          <Mascot>
            No update for 7 days? You can escalate this complaint from here, or call <b>1916</b> with the number.
          </Mascot>
        )}
        {r.status !== 'fixed' && <button className="btn btn-secondary">Escalate complaint</button>}
        <button className="btn btn-ghost" onClick={() => nav('/report/new')}>Report another issue</button>
      </div>
    </Screen>
  )
}

export function CheckStatus() {
  const nav = useNavigate()
  const { reports } = useStore()
  const [val, setVal] = useState('')
  const [err, setErr] = useState('')

  const go = () => {
    const q = val.trim().toUpperCase()
    const hit = reports.find((r) => r.id.toUpperCase() === q || r.id.replace(/\D/g, '') === q.replace(/\D/g, ''))
    if (hit) nav(`/report/my/${hit.id}`)
    else setErr('No complaint found with that number. Check and try again.')
  }

  return (
    <Screen>
      <TopBar back title="Check status" />
      <div className="content">
        <Mascot q>Enter the complaint number you received.</Mascot>
        <div className="field">
          <label className="label" htmlFor="cno">Complaint number</label>
          <input
            id="cno"
            className="input"
            placeholder="e.g. A-2026-4821"
            value={val}
            onChange={(e) => { setVal(e.target.value); setErr('') }}
            onKeyDown={(e) => e.key === 'Enter' && go()}
            inputMode="text"
            autoCapitalize="characters"
          />
          {err && <span className="small" style={{ color: '#b4430b' }}>{err}</span>}
          <span className="small">Try <b>4821</b> to see a sample report.</span>
        </div>
        <button className="btn btn-primary" disabled={!val.trim()} onClick={go}><Ic.Search /> Check</button>
      </div>
    </Screen>
  )
}
