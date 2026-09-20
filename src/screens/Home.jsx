import { useNavigate } from 'react-router-dom'
import { Screen, TopBar, Mascot, ReportRow } from '../components.jsx'
import * as Ic from '../icons.jsx'
import { CATEGORIES, AROUND, AROUND_STATS } from '../data.js'
import { useStore } from '../store.jsx'

export default function Home() {
  const nav = useNavigate()
  const { update, reset, reports } = useStore()

  const startWith = (catId) => {
    reset()
    update({ category: catId, via: 'type' })
    nav('/report/new/photo')
  }

  const open = reports.filter((r) => r.status !== 'fixed')

  return (
    <Screen>
      <TopBar
        brand
        right={<span className="tagline dev">मुंबई आपली आहे</span>}
      />
      <div className="content">
        <section className="hero">
          <span className="dev">तक्रार नोंदवा · Report a problem</span>
          <h1 className="h1">See something broken? Tell BMC.</h1>
          <p style={{ color: 'rgba(255,255,255,.8)', fontSize: 15 }}>
            A photo and a location is enough. You get a complaint number to track it.
          </p>
          <button className="btn" onClick={() => nav('/report/new')}>
            <Ic.Plus /> File a report
          </button>
        </section>

        <section className="stack">
          <h2 className="h3">What do you want to report?</h2>
          <div className="grid3">
            {CATEGORIES.map((c) => {
              const Icon = c.icon
              return (
                <button key={c.id} className="cat" onClick={() => startWith(c.id)}>
                  <span className="ico"><Icon /></span>
                  <span>{c.label}</span>
                </button>
              )
            })}
          </div>
        </section>

        {open.length > 0 && (
          <section className="stack">
            <div className="stat">
              <h2 className="h3">Your open reports</h2>
              <button className="btn-ghost blue" style={{ fontWeight: 700 }} onClick={() => nav('/report/my')}>
                See all
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
            <span className="eyebrow">Around you</span>
            <div className="h3" style={{ marginTop: 4 }}>{AROUND_STATS.fixed} issues fixed this week</div>
            <span className="small">{AROUND.filter((a) => a.status !== 'fixed').length} still in progress · See what changed</span>
          </div>
          <span className="big">{AROUND_STATS.fixed}</span>
        </button>

        <Mascot>
          Not sure what to report or how? Tap <b>File a report</b> and choose <b>Say it</b>. I will ask you step by step.
        </Mascot>

        <button className="btn-ghost" onClick={() => nav('/other-ways')}>
          Other ways to reach BMC →
        </button>
      </div>
    </Screen>
  )
}
