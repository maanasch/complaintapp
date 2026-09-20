import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Screen, TopBar, Option, Mascot, Steps, MapMock } from '../components.jsx'
import * as Ic from '../icons.jsx'
import { CATEGORIES, MOCK_LOCATION, catById, nowStamp } from '../data.js'
import { useStore } from '../store.jsx'

/* ---------- Step 0: choose Say it / Type it ---------- */
export function FileStart() {
  const nav = useNavigate()
  const { update } = useStore()
  return (
    <Screen>
      <TopBar back="/report" title="File a report" />
      <div className="content">
        <Mascot q>How would you like to report it?</Mascot>
        <Option
          icon={Ic.Mic}
          title="Say it"
          sub="Talk to me in Marathi, Hindi or English. I will fill the form for you."
          tone="orange"
          onClick={() => { update({ via: 'say' }); nav('/report/new/say') }}
        />
        <Option
          icon={Ic.Keyboard}
          title="Type it"
          sub="Take a photo, pick the problem, confirm the location."
          onClick={() => { update({ via: 'type' }); nav('/report/new/photo') }}
        />
        <p className="small center">Both ways ask for the same three things: a photo, what is wrong, and where.</p>
      </div>
    </Screen>
  )
}

/* ---------- Photo capture (shared) ---------- */
export function usePhotoPicker(onPicked) {
  const ref = useRef(null)
  const open = () => ref.current?.click()
  const input = (
    <input
      ref={ref}
      type="file"
      accept="image/*"
      capture="environment"
      hidden
      onChange={(e) => {
        const f = e.target.files?.[0]
        if (!f) return
        onPicked(URL.createObjectURL(f), nowStamp())
        e.target.value = ''
      }}
    />
  )
  return { open, input }
}

/* ---------- Step 1: Photo ---------- */
export function StepPhoto() {
  const nav = useNavigate()
  const { draft, update } = useStore()
  const { open, input } = usePhotoPicker((photo, photoAt) => update({ photo, photoAt }))

  return (
    <Screen tabs={false}>
      <TopBar back="/report/new" title="Report an issue" />
      <div className="content grow">
        <Steps step={1} />
        <Mascot q>Take a photo of the problem.</Mascot>
        {input}

        <button className={`photo-box ${draft.photo ? 'has' : ''}`} onClick={open}>
          {draft.photo ? (
            <>
              <img src={draft.photo} alt="Your photo" />
              <div className="meta">
                <span className="tag"><Ic.Clock />{draft.photoAt}</span>
                <span className="tag"><Ic.Pin />{MOCK_LOCATION.label}</span>
              </div>
            </>
          ) : (
            <>
              <Ic.Camera />
              <span><b style={{ color: 'var(--ink)' }}>Open camera</b><br />Location and time are added to the photo automatically.</span>
            </>
          )}
        </button>

        {draft.photo && (
          <button className="btn btn-ghost" onClick={open}><Ic.Camera /> Retake photo</button>
        )}

        <div className="footer-cta mt-auto stack">
          <button className="btn btn-primary" disabled={!draft.photo} onClick={() => nav('/report/new/what')}>
            Next <Ic.Chevron />
          </button>
          {!draft.photo && (
            <button className="btn btn-ghost" onClick={() => nav('/report/new/what')}>Continue without a photo</button>
          )}
        </div>
      </div>
    </Screen>
  )
}

/* ---------- Step 2: What ---------- */
export function StepWhat() {
  const nav = useNavigate()
  const { draft, update } = useStore()

  return (
    <Screen tabs={false}>
      <TopBar back="/report/new/photo" title="Report an issue" />
      <div className="content grow">
        <Steps step={2} />
        <Mascot q>What is the problem?</Mascot>

        <div className="grid3">
          {CATEGORIES.map((c) => {
            const Icon = c.icon
            const sel = draft.category === c.id
            return (
              <button key={c.id} className={`cat ${sel ? 'selected' : ''}`} onClick={() => update({ category: c.id })}>
                <span className="ico"><Icon /></span>
                <span>{c.label}<br /><span className="dev small" style={{ fontWeight: 500 }}>{c.dev}</span></span>
              </button>
            )
          })}
        </div>

        <div className="field">
          <label className="label" htmlFor="desc">Anything else? <span className="small" style={{ fontWeight: 400 }}>(optional)</span></label>
          <textarea
            id="desc"
            className="textarea"
            placeholder="e.g. Near the bus stop, about 2 feet wide. Has been like this for a week."
            value={draft.description}
            onChange={(e) => update({ description: e.target.value })}
          />
        </div>

        <button className="btn btn-ghost" onClick={() => { update({ via: 'say' }); nav('/report/new/say') }}>
          <Ic.Mic /> Prefer to say it instead?
        </button>

        <div className="footer-cta mt-auto">
          <button className="btn btn-primary" disabled={!draft.category} onClick={() => nav('/report/new/where')}>
            Next <Ic.Chevron />
          </button>
        </div>
      </div>
    </Screen>
  )
}

/* ---------- Step 3: Where ---------- */
export function StepWhere() {
  const nav = useNavigate()
  const { draft, update } = useStore()
  const [mode, setMode] = useState(draft.location ? 'set' : 'choose') // choose | detecting | set | manual
  const [manual, setManual] = useState('')

  useEffect(() => {
    if (mode !== 'detecting') return
    const t = setTimeout(() => { update({ location: MOCK_LOCATION }); setMode('set') }, 1400)
    return () => clearTimeout(t)
  }, [mode, update])

  const useManual = () => {
    update({ location: { ...MOCK_LOCATION, label: manual.trim(), address: manual.trim() } })
    setMode('set')
  }

  return (
    <Screen tabs={false}>
      <TopBar back="/report/new/what" title="Report an issue" />
      <div className="content grow">
        <Steps step={3} />
        <Mascot q>Where is it?</Mascot>

        {mode === 'choose' && (
          <>
            <Option icon={Ic.Pin} title="Detect my location" sub="Uses your phone's GPS" onClick={() => setMode('detecting')} />
            <div className="divider">or</div>
            <Option icon={Ic.Map} title="Enter the address" sub="Type a landmark, road or area" onClick={() => setMode('manual')} />
          </>
        )}

        {mode === 'detecting' && (
          <>
            <MapMock pulse />
            <p className="sub center">Finding your location…</p>
          </>
        )}

        {mode === 'manual' && (
          <>
            <div className="field">
              <label className="label" htmlFor="addr">Address or landmark</label>
              <input
                id="addr"
                className="input"
                autoFocus
                placeholder="e.g. Opposite Jehangir Art Gallery, Fort"
                value={manual}
                onChange={(e) => setManual(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && manual.trim() && useManual()}
              />
            </div>
            <button className="btn btn-primary" disabled={!manual.trim()} onClick={useManual}>Use this address</button>
            <button className="btn btn-ghost" onClick={() => setMode('detecting')}><Ic.Pin /> Detect instead</button>
          </>
        )}

        {mode === 'set' && draft.location && (
          <>
            <MapMock label={draft.location.label} />
            <div className="card">
              <span className="eyebrow">Location</span>
              <div className="h3" style={{ marginTop: 4 }}>{draft.location.label}</div>
              <span className="small">{draft.location.address} · {draft.location.ward}</span>
            </div>
            <button className="btn btn-ghost" onClick={() => setMode('manual')}><Ic.Edit /> Change location</button>
          </>
        )}

        <div className="footer-cta mt-auto">
          <button className="btn btn-primary" disabled={mode !== 'set'} onClick={() => nav('/report/new/review')}>
            Next <Ic.Chevron />
          </button>
        </div>
      </div>
    </Screen>
  )
}

/* ---------- Step 4: Review & submit ---------- */
export function StepReview() {
  const nav = useNavigate()
  const { draft, submit } = useStore()
  const cat = catById(draft.category || 'other')
  const [sending, setSending] = useState(false)

  const go = () => {
    setSending(true)
    setTimeout(() => { submit(); nav('/report/new/done', { replace: true }) }, 1200)
  }

  return (
    <Screen tabs={false}>
      <TopBar back="/report/new/where" title="Report an issue" />
      <div className="content grow">
        <Steps step={4} />
        <Mascot q>Ready to report?</Mascot>

        <div className="card" style={{ display: 'flex', gap: 14 }}>
          <div style={{ flex: 1 }}>
            <dl className="kv" style={{ gridTemplateColumns: '64px 1fr' }}>
              <dt>What</dt><dd>{cat.label}{draft.description ? <span className="small" style={{ display: 'block', fontWeight: 400 }}>{draft.description}</span> : null}</dd>
              <dt>Where</dt><dd>{draft.location?.label || '—'}</dd>
              <dt>When</dt><dd>{draft.photoAt || nowStamp()}</dd>
            </dl>
            <button className="btn-ghost blue" style={{ fontWeight: 700, marginTop: 12, display: 'inline-flex', gap: 6, alignItems: 'center' }} onClick={() => nav('/report/new/what')}>
              <Ic.Edit width={16} height={16} /> Edit
            </button>
          </div>
          <div style={{ width: 96, height: 120, borderRadius: 14, overflow: 'hidden', background: 'var(--sand)', flex: 'none', display: 'grid', placeItems: 'center', color: 'var(--grey)' }}>
            {draft.photo ? <img src={draft.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Ic.Camera />}
          </div>
        </div>

        <p className="small">
          This goes to <b>{draft.location?.ward || 'A Ward'} · {cat.dept}</b>. You will get a complaint number to track it. No name or phone required.
        </p>

        <div className="footer-cta mt-auto">
          <button className="btn btn-green" disabled={sending} onClick={go}>
            {sending ? 'Sending…' : <><Ic.Send /> Report it</>}
          </button>
        </div>
      </div>
    </Screen>
  )
}

/* ---------- Done: complaint number ---------- */
export function StepDone() {
  const nav = useNavigate()
  const { lastSubmitted } = useStore()
  const [copied, setCopied] = useState(false)
  const r = lastSubmitted

  useEffect(() => { if (!r) nav('/report', { replace: true }) }, [r, nav])
  if (!r) return null

  const copy = async () => {
    try { await navigator.clipboard.writeText(r.id); setCopied(true); setTimeout(() => setCopied(false), 1500) } catch { /* ignore */ }
  }

  return (
    <Screen tabs={false}>
      <TopBar />
      <div className="content grow">
        <div className="center stack" style={{ alignItems: 'center', gap: 14 }}>
          <div className="mascot lg"><Ic.MascotFace /></div>
          <h1 className="h1">Reported.</h1>
          <p className="sub">Your complaint is with <b>{r.ward}</b>.</p>
        </div>

        <div className="number-hero">
          <span className="eyebrow">Complaint number</span>
          <div className="num">{r.id}</div>
          <span className="small">Keep this to check status later. It also works on 1916.</span>
          <button className="btn btn-ghost" onClick={copy}>{copied ? <><Ic.Check /> Copied</> : 'Copy number'}</button>
        </div>

        <div className="card soft">
          <span className="eyebrow">What happens next</span>
          <div className="timeline" style={{ marginTop: 10 }}>
            <div className="tl now"><div className="dot"><i /></div><div className="body"><b>Received</b><span>Just now</span></div></div>
            <div className="tl"><div className="dot"><i /></div><div className="body"><b>Assigned to an engineer</b><span>Usually within 2 days</span></div></div>
            <div className="tl"><div className="dot"><i /></div><div className="body"><b>Fixed</b><span>You can escalate if nothing happens in 7 days</span></div></div>
          </div>
        </div>

        <div className="stack mt-auto">
          <button className="btn btn-primary" onClick={() => nav(`/report/my/${r.id}`)}>View my report</button>
          <button className="btn btn-secondary" onClick={() => nav('/report/new')}>Report another issue</button>
          <button className="btn btn-ghost" onClick={() => nav('/')}>Back to home</button>
        </div>
      </div>
    </Screen>
  )
}
