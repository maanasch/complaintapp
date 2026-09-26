import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Screen, TopBar, ReportRow, Pill, Mascot, MapMock } from '../components.jsx'
import * as Ic from '../icons.jsx'
import { AROUND, AROUND_STATS, catById, MOCK_LOCATION } from '../data.js'
import { useT } from '../i18n.jsx'

export function AroundMe() {
  const nav = useNavigate()
  const t = useT()
  const [filter, setFilter] = useState('all')
  const shown = AROUND.filter((a) =>
    filter === 'all' ? true : filter === 'fixed' ? a.status === 'fixed' : a.status !== 'fixed',
  )

  return (
    <Screen>
      <TopBar brand />
      <div className="content">
        <div>
          <h1 className="h1">{t('aroundTitle')}</h1>
          <p className="sub" style={{ marginTop: 6 }}>
            <Ic.Pin width={15} height={15} style={{ verticalAlign: -2, marginRight: 4 }} />
            {t('aroundSub', { loc: MOCK_LOCATION.label })}
          </p>
        </div>

        <div className="card navy stat">
          <div>
            <span className="eyebrow" style={{ color: 'var(--yellow)' }}>{t('thisWeek')}</span>
            <div className="h3" style={{ marginTop: 4, color: '#fff' }}>{t('aroundStats', { f: AROUND_STATS.fixed, o: AROUND_STATS.open })}</div>
            <span className="small">{t('because')}</span>
          </div>
        </div>

        <div className="chips">
          {[['all', t('all')], ['open', t('inProgress')], ['fixed', t('fixed')]].map(([k, l]) => (
            <button key={k} className={`chip ${filter === k ? 'active' : ''}`} onClick={() => setFilter(k)}>{l}</button>
          ))}
        </div>

        <div className="list">
          {shown.map((a) => (
            <ReportRow key={a.id} r={a} right={t('nReports', { n: a.reports })} onClick={() => nav(`/around/${a.id}`)} />
          ))}
        </div>
      </div>
    </Screen>
  )
}

export function AroundDetail() {
  const nav = useNavigate()
  const t = useT()
  const { id } = useParams()
  const a = AROUND.find((x) => x.id === id)
  if (!a) return <Screen><TopBar back /><div className="content"><p className="sub">{t('notFound')}</p></div></Screen>
  const cat = catById(a.category)
  const Icon = cat.icon
  const fixed = a.status === 'fixed'

  return (
    <Screen>
      <TopBar back="/around" title={t('whatChanged')} />
      <div className="content">
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="eyebrow">{t(cat.key)} · {a.location}</span>
            <Pill status={a.status} />
          </div>
          <h1 className="h2" style={{ marginTop: 6 }}>{a.title}</h1>
          <p className="sub" style={{ marginTop: 4 }}>{t('peopleReported', { n: a.reports, d: a.dist })}</p>
        </div>

        <div className="ba">
          <div className="shot">
            <div className="img">{a.photo ? <img src={a.photo} alt="" /> : <Icon width={36} height={36} style={{ color: 'var(--grey)' }} />}</div>
            <div className="band orange">{t('before')} · {a.before}</div>
          </div>
          <div className="shot">
            <div className="img">{fixed ? (a.afterPhoto ? <img src={a.afterPhoto} alt="" /> : <Ic.Check width={36} height={36} style={{ color: 'var(--green)' }} />) : <span>{t('pending')}</span>}</div>
            <div className={`band ${fixed ? 'green' : ''}`} style={!fixed ? { background: 'var(--line-strong)', color: 'var(--grey)' } : {}}>
              {t('after')}{fixed ? ` · ${a.after}` : ''}
            </div>
          </div>
        </div>

        <MapMock label={a.location} />

        {fixed ? (
          <Mascot mood="happy">{t('fixedIn', { d: daysBetween(a.before, a.after) })}</Mascot>
        ) : (
          <Mascot mood="sad">{t('seeingToo')}</Mascot>
        )}

        {!fixed && (
          <button className="btn btn-primary" onClick={() => nav('/report/new')}>
            <Ic.Plus /> {t('iSeeToo')}
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
