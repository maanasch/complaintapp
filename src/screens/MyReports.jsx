import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Screen, TopBar, ReportRow, Pill, Mascot } from '../components.jsx'
import { MascotFull } from '../brand.jsx'
import * as Ic from '../icons.jsx'
import { catById } from '../data.js'
import { useStore } from '../store.jsx'
import { useT } from '../i18n.jsx'

function Filters({ value, onChange }) {
  const t = useT()
  return (
    <div className="chips">
      {[['all', t('all')], ['open', t('inProgress')], ['fixed', t('fixed')]].map(([k, l]) => (
        <button key={k} className={`chip ${value === k ? 'active' : ''}`} onClick={() => onChange(k)}>{l}</button>
      ))}
    </div>
  )
}

export function MyReports() {
  const nav = useNavigate()
  const t = useT()
  const { reports } = useStore()
  const [filter, setFilter] = useState('all')
  const shown = reports.filter((r) =>
    filter === 'all' ? true : filter === 'fixed' ? r.status === 'fixed' : r.status !== 'fixed',
  )

  return (
    <Screen>
      <TopBar back="/report" title={t('myReports')} />
      <div className="content">
        <Filters value={filter} onChange={setFilter} />

        <div className="list">
          {shown.map((r) => (
            <ReportRow key={r.id} r={r} right={r.id} onClick={() => nav(`/report/my/${r.id}`)} />
          ))}
          {shown.length === 0 && <p className="sub center" style={{ padding: 30 }}>{t('nothingYet')}</p>}
        </div>

        <button className="option" onClick={() => nav('/report/check')}>
          <span className="ico" style={{ background: 'var(--yellow-soft)', color: '#9a6a00' }}><Ic.Search /></span>
          <span className="txt"><b>{t('haveNumber')}</b><span>{t('haveNumberSub')}</span></span>
          <span className="chev"><Ic.Chevron /></span>
        </button>
      </div>
    </Screen>
  )
}

export function ReportDetail() {
  const nav = useNavigate()
  const t = useT()
  const { id } = useParams()
  const { reports } = useStore()
  const r = reports.find((x) => x.id === id)
  if (!r) return (
    <Screen><TopBar back title={t('yourReport')} /><div className="content"><p className="sub">{t('notFound')}</p></div></Screen>
  )
  const cat = catById(r.category)
  const Icon = cat.icon
  const doneIdx = r.timeline.reduce((acc, s, i) => (s.t ? i : acc), -1)

  return (
    <Screen>
      <TopBar back title={t('yourReport')} />
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
              <dt>{t('type')}</dt><dd>{t(cat.key)}</dd>
              <dt>{t('where')}</dt><dd>{r.location}</dd>
              <dt>{t('ward')}</dt><dd>{r.ward}</dd>
              <dt>{t('reportedOn')}</dt><dd>{r.reported}</dd>
              <dt>{t('dept')}</dt><dd>{cat.dept}</dd>
            </dl>
          </div>
        </div>

        <section className="card">
          <h2 className="h3" style={{ marginBottom: 14 }}>{t('progress')}</h2>
          <div className="timeline">
            {r.timeline.map((s, i) => {
              const isNow = i === doneIdx && r.status !== 'fixed'
              return (
                <div key={i} className={`tl ${i < doneIdx ? 'done' : isNow ? 'now' : ''}`}>
                  <div className="dot"><i /></div>
                  <div className="body">
                    <b>{s.title}{isNow && <span className="here-badge">{t('youAreHere')}</span>}</b>
                    <span>{s.t ? `${s.t}${s.note ? ' · ' + s.note : ''}` : s.note || t('pending')}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {r.status !== 'fixed' && (
          r.escalated ? (
            <p className="small center">{t('escalatedOn', { t: r.escalatedAt })}</p>
          ) : (
            <>
              <Mascot mood="focused">{t('escalateTip')}</Mascot>
              <button className="btn btn-secondary" onClick={() => nav(`/report/my/${r.id}/escalate`)}>{t('escalate')}</button>
            </>
          )
        )}
        <button className="btn btn-ghost" onClick={() => nav('/report/new')}>{t('anotherIssue')}</button>
      </div>
    </Screen>
  )
}

export function EscalateComplaint() {
  const nav = useNavigate()
  const t = useT()
  const { id } = useParams()
  const { reports, escalate } = useStore()
  const r = reports.find((x) => x.id === id)
  const [done, setDone] = useState(false)
  if (!r) return (
    <Screen><TopBar back title={t('yourReport')} /><div className="content"><p className="sub">{t('notFound')}</p></div></Screen>
  )

  const confirm = () => { escalate(r.id); setDone(true) }

  if (done || r.escalated) {
    return (
      <Screen tabs={false}>
        <TopBar />
        <div className="content grow">
          <div className="center stack" style={{ alignItems: 'center', gap: 10 }}>
            <MascotFull mood="happy" pose="thumbs" size={110} />
            <h1 className="h1">{t('escalatedTitle')}</h1>
            <p className="sub">{t('escalatedNote')}</p>
          </div>
          <div className="stack mt-auto">
            <button className="btn btn-primary" onClick={() => nav(`/report/my/${r.id}`)}>{t('backToReport')}</button>
          </div>
        </div>
      </Screen>
    )
  }

  return (
    <Screen tabs={false}>
      <TopBar back={`/report/my/${r.id}`} title={t('escalate')} />
      <div className="content grow">
        <Mascot q>{t('escalateConfirmQ')}</Mascot>
        <p className="sub">{t('escalateConfirmNote')}</p>
        <div className="stack mt-auto">
          <button className="btn btn-secondary" onClick={confirm}>{t('escalateYes')}</button>
          <button className="btn btn-ghost" onClick={() => nav(`/report/my/${r.id}`)}>{t('escalateCancel')}</button>
        </div>
      </div>
    </Screen>
  )
}

export function CheckStatus() {
  const nav = useNavigate()
  const t = useT()
  const { reports } = useStore()
  const [val, setVal] = useState('')
  const [err, setErr] = useState('')

  const go = () => {
    const q = val.trim().toUpperCase()
    const hit = reports.find((r) => r.id.toUpperCase() === q || r.id.replace(/\D/g, '') === q.replace(/\D/g, ''))
    if (hit) nav(`/report/my/${hit.id}`)
    else setErr(t('checkErr'))
  }

  return (
    <Screen>
      <TopBar back title={t('checkTitle')} />
      <div className="content">
        <Mascot q>{t('enterQ')}</Mascot>
        <div className="field">
          <label className="label" htmlFor="cno">{t('cno')}</label>
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
          <span className="small">{t('trySample', { n: '4821' })}</span>
        </div>
        <button className="btn btn-primary" disabled={!val.trim()} onClick={go}><Ic.Search /> {t('check')}</button>
      </div>
    </Screen>
  )
}
