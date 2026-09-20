import { useNavigate } from 'react-router-dom'
import { Screen, TopBar, Mascot, ReportRow } from '../components.jsx'
import { MascotFull } from '../brand.jsx'
import * as Ic from '../icons.jsx'
import { CATEGORIES, AROUND, AROUND_STATS } from '../data.js'
import { useStore } from '../store.jsx'
import { useT } from '../i18n.jsx'

export default function Home() {
  const nav = useNavigate()
  const t = useT()
  const { update, reset, reports } = useStore()

  const startWith = (catId) => {
    reset()
    update({ category: catId, via: 'type' })
    nav('/report/new/photo')
  }

  const open = reports.filter((r) => r.status !== 'fixed')
  const stillOpen = AROUND.filter((a) => a.status !== 'fixed').length

  return (
    <Screen>
      <TopBar brand />
      <div className="content">
        <section className="hero">
          <div className="hero-text">
            <span className="eyebrow">{t('homeEyebrow')}</span>
            <h1 className="h1">{t('homeTitle')}</h1>
            <p style={{ color: 'rgba(255,255,255,.8)', fontSize: 15 }}>{t('homeSub')}</p>
          </div>
          <div className="hero-mascot"><MascotFull pose="phone" size={104} /></div>
          <button className="btn" onClick={() => nav('/report/new')}>
            <Ic.Plus /> {t('fileReport')}
          </button>
        </section>

        <section className="stack">
          <h2 className="h3">{t('homeWhat')}</h2>
          <div className="grid3">
            {CATEGORIES.map((c) => {
              const Icon = c.icon
              return (
                <button key={c.id} className="cat" onClick={() => startWith(c.id)}>
                  <span className="ico"><Icon /></span>
                  <span>{t(c.key)}</span>
                </button>
              )
            })}
          </div>
        </section>

        {open.length > 0 && (
          <section className="stack">
            <div className="stat">
              <h2 className="h3">{t('homeOpen')}</h2>
              <button className="btn-ghost blue" style={{ fontWeight: 700 }} onClick={() => nav('/report/my')}>
                {t('seeAll')}
              </button>
            </div>
            <div className="list">
              {open.slice(0, 2).map((r) => (
                <ReportRow key={r.id} r={r} right={r.id} onClick={() => nav(`/report/my/${r.id}`)} />
              ))}
            </div>
          </section>
        )}

        <button className="card stat" style={{ textAlign: 'left' }} onClick={() => nav('/around')}>
          <div>
            <span className="eyebrow">{t('aroundYou')}</span>
            <div className="h3" style={{ marginTop: 4 }}>{t('fixedThisWeek', { n: AROUND_STATS.fixed })}</div>
            <span className="small">{t('stillOpen', { n: stillOpen })}</span>
          </div>
          <span className="big">{AROUND_STATS.fixed}</span>
        </button>

        <Mascot>{t('homeTip')}</Mascot>

        <button className="btn-ghost" onClick={() => nav('/other-ways')}>{t('otherWaysLink')}</button>
      </div>
    </Screen>
  )
}
