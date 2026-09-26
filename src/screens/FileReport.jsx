import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Screen, TopBar, Option, Mascot, Steps, MapMock } from '../components.jsx'
import { MascotFull } from '../brand.jsx'
import * as Ic from '../icons.jsx'
import { CATEGORIES, MOCK_LOCATION, catById, nowStamp } from '../data.js'
import { useStore } from '../store.jsx'
import { useLang, useT } from '../i18n.jsx'

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
  const t = useT()
  const { draft, update } = useStore()
  const { open, input } = usePhotoPicker((photo, photoAt) => update({ photo, photoAt }))

  return (
    <Screen tabs={false}>
      <TopBar back="/report" title={t('stepTitle')} />
      <div className="content grow">
        <Steps step={1} />
        <Mascot q>{t('photoQ')}</Mascot>
        {input}

        <button className={`photo-box ${draft.photo ? 'has' : ''}`} onClick={open}>
          {draft.photo ? (
            <>
              <img src={draft.photo} alt="" />
              <div className="meta">
                <span className="tag"><Ic.Clock />{draft.photoAt}</span>
                <span className="tag"><Ic.Pin />{MOCK_LOCATION.label}</span>
              </div>
            </>
          ) : (
            <>
              <Ic.Camera />
              <span><b style={{ color: 'var(--ink)' }}>{t('openCamera')}</b><br />{t('photoHint')}</span>
            </>
          )}
        </button>

        {draft.photo && (
          <button className="btn btn-ghost" onClick={open}><Ic.Camera /> {t('retake')}</button>
        )}

        <div className="footer-cta mt-auto stack">
          <button className="btn btn-primary" disabled={!draft.photo} onClick={() => nav('/report/new/what')}>
            {t('next')} <Ic.Chevron />
          </button>
          {!draft.photo && (
            <button className="btn btn-ghost" onClick={() => nav('/report/new/what')}>{t('noPhoto')}</button>
          )}
        </div>
      </div>
    </Screen>
  )
}

/* ---------- Step 2: What ---------- */
export function StepWhat() {
  const nav = useNavigate()
  const t = useT()
  const { meta } = useLang()
  const { draft, update } = useStore()
  const [listening, setListening] = useState(false)
  const recRef = useRef(null)

  const appendDescription = (v) => update({ description: `${draft.description} ${v}`.trim() })

  const toggleVoiceNote = () => {
    if (listening) { recRef.current?.stop?.(); setListening(false); return }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    setListening(true)
    if (SR) {
      const rec = new SR()
      recRef.current = rec
      rec.lang = meta.speech
      rec.interimResults = false
      rec.onresult = (e) => { setListening(false); appendDescription(e.results[0][0].transcript) }
      rec.onerror = () => setListening(false)
      rec.onend = () => setListening(false)
      try { rec.start() } catch { setListening(false) }
    } else {
      // No speech API on this device: simulate a captured voice note
      setTimeout(() => { setListening(false); appendDescription(t('cannedProblem')) }, 1400)
    }
  }

  return (
    <Screen tabs={false}>
      <TopBar back="/report/new/photo" title={t('stepTitle')} />
      <div className="content grow">
        <Steps step={2} />
        <Mascot q>{t('whatQ')}</Mascot>

        <div className="grid3">
          {CATEGORIES.map((c) => {
            const Icon = c.icon
            const sel = draft.category === c.id
            return (
              <button key={c.id} className={`cat ${sel ? 'selected' : ''}`} onClick={() => update({ category: c.id })}>
                <span className="ico"><Icon /></span>
                <span>{t(c.key)}</span>
              </button>
            )
          })}
        </div>

        <div className="field">
          <label className="label" htmlFor="desc">{t('extra')} <span className="small required">{t('required')}</span></label>
          <textarea
            id="desc"
            className="textarea"
            placeholder={t('descPh')}
            value={draft.description}
            onChange={(e) => update({ description: e.target.value })}
          />
        </div>

        <button className={`btn btn-ghost ${listening ? 'recording' : ''}`} onClick={toggleVoiceNote}>
          <Ic.Mic /> {listening ? t('listening') : t('recordVoice')}
        </button>

        <div className="footer-cta mt-auto">
          <button className="btn btn-primary" disabled={!draft.category || !draft.description.trim()} onClick={() => nav('/report/new/where')}>
            {t('next')} <Ic.Chevron />
          </button>
        </div>
      </div>
    </Screen>
  )
}

/* ---------- Step 3: Where ---------- */
export function StepWhere() {
  const nav = useNavigate()
  const t = useT()
  const { draft, update } = useStore()
  const [mode, setMode] = useState(draft.location ? 'set' : 'choose') // choose | detecting | set | manual
  const [manual, setManual] = useState('')

  useEffect(() => {
    if (mode !== 'detecting') return
    const tm = setTimeout(() => { update({ location: MOCK_LOCATION }); setMode('set') }, 1400)
    return () => clearTimeout(tm)
  }, [mode, update])

  const useManual = () => {
    update({ location: { ...MOCK_LOCATION, label: manual.trim(), address: manual.trim() } })
    setMode('set')
  }

  return (
    <Screen tabs={false}>
      <TopBar back="/report/new/what" title={t('stepTitle')} />
      <div className="content grow">
        <Steps step={3} />
        <Mascot q>{t('whereQ')}</Mascot>

        {mode === 'choose' && (
          <>
            <Option icon={Ic.Pin} title={t('detect')} sub={t('detectSub')} onClick={() => setMode('detecting')} />
            <div className="divider">{t('or')}</div>
            <Option icon={Ic.Map} title={t('enterAddr')} sub={t('enterAddrSub')} onClick={() => setMode('manual')} />
          </>
        )}

        {mode === 'detecting' && (
          <>
            <MapMock pulse />
            <p className="sub center">{t('finding')}</p>
          </>
        )}

        {mode === 'manual' && (
          <>
            <div className="field">
              <label className="label" htmlFor="addr">{t('addrLabel')}</label>
              <input
                id="addr"
                className="input"
                autoFocus
                placeholder={t('addrPh')}
                value={manual}
                onChange={(e) => setManual(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && manual.trim() && useManual()}
              />
            </div>
            <button className="btn btn-primary" disabled={!manual.trim()} onClick={useManual}>{t('useAddr')}</button>
            <button className="btn btn-ghost" onClick={() => setMode('detecting')}><Ic.Pin /> {t('detectInstead')}</button>
          </>
        )}

        {mode === 'set' && draft.location && (
          <>
            <MapMock label={draft.location.label} />
            <div className="card">
              <span className="eyebrow">{t('location')}</span>
              <div className="h3" style={{ marginTop: 4 }}>{draft.location.label}</div>
              <span className="small">{draft.location.address} · {draft.location.ward}</span>
            </div>
            <button className="btn btn-ghost" onClick={() => setMode('manual')}><Ic.Edit /> {t('changeLoc')}</button>
          </>
        )}

        <div className="footer-cta mt-auto">
          <button className="btn btn-primary" disabled={mode !== 'set'} onClick={() => nav('/report/new/review')}>
            {t('next')} <Ic.Chevron />
          </button>
        </div>
      </div>
    </Screen>
  )
}

/* ---------- Step 4: Review & submit ---------- */
export function StepReview() {
  const nav = useNavigate()
  const t = useT()
  const { draft, submit } = useStore()
  const cat = catById(draft.category || 'other')
  const [sending, setSending] = useState(false)

  const go = () => {
    setSending(true)
    setTimeout(() => { submit(); nav('/report/new/done', { replace: true }) }, 1200)
  }

  return (
    <Screen tabs={false}>
      <TopBar back="/report/new/where" title={t('stepTitle')} />
      <div className="content grow">
        <Steps step={4} />
        <Mascot q>{t('readyQ')}</Mascot>

        <div className="card" style={{ display: 'flex', gap: 14 }}>
          <div style={{ flex: 1 }}>
            <dl className="kv" style={{ gridTemplateColumns: '64px 1fr' }}>
              <dt>{t('what')}</dt><dd>{t(cat.key)}{draft.description ? <span className="small" style={{ display: 'block', fontWeight: 400 }}>{draft.description}</span> : null}</dd>
              <dt>{t('where')}</dt><dd>{draft.location?.label || '—'}</dd>
              <dt>{t('when')}</dt><dd>{draft.photoAt || nowStamp()}</dd>
            </dl>
            <button className="btn-ghost blue" style={{ fontWeight: 700, marginTop: 12, display: 'inline-flex', gap: 6, alignItems: 'center' }} onClick={() => nav('/report/new/what')}>
              <Ic.Edit width={16} height={16} /> {t('edit')}
            </button>
          </div>
          <div style={{ width: 96, height: 120, borderRadius: 14, overflow: 'hidden', background: 'var(--sand)', flex: 'none', display: 'grid', placeItems: 'center', color: 'var(--grey)' }}>
            {draft.photo ? <img src={draft.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Ic.Camera />}
          </div>
        </div>

        <p className="small">{t('goesTo', { ward: draft.location?.ward || 'A Ward', dept: cat.dept })}</p>

        <div className="footer-cta mt-auto">
          <button className="btn btn-green" disabled={sending} onClick={go}>
            {sending ? t('sending') : <><Ic.Send /> {t('reportIt')}</>}
          </button>
        </div>
      </div>
    </Screen>
  )
}

/* ---------- Done: complaint number ---------- */
export function StepDone() {
  const nav = useNavigate()
  const t = useT()
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
        <div className="center stack" style={{ alignItems: 'center', gap: 10 }}>
          <MascotFull mood="happy" pose="thumbs" size={110} />
          <h1 className="h1">{t('reported')}</h1>
          <p className="sub">{t('withWard', { ward: r.ward })}</p>
        </div>

        <div className="number-hero">
          <span className="eyebrow">{t('cno')}</span>
          <div className="num">{r.id}</div>
          <span className="small">{t('keepNumber')}</span>
          <button className="btn btn-ghost" onClick={copy}>{copied ? <><Ic.Check /> {t('copied')}</> : t('copy')}</button>
        </div>

        <div className="card soft">
          <span className="eyebrow">{t('whatNext')}</span>
          <div className="timeline" style={{ marginTop: 10 }}>
            <div className="tl now"><div className="dot"><i /></div><div className="body"><b>{t('received')}</b><span>{t('justNow')}</span></div></div>
            <div className="tl"><div className="dot"><i /></div><div className="body"><b>{t('assigned')}</b><span>{t('within2')}</span></div></div>
            <div className="tl"><div className="dot"><i /></div><div className="body"><b>{t('fixed')}</b><span>{t('escalateHint')}</span></div></div>
          </div>
        </div>

        <div className="stack mt-auto">
          <button className="btn btn-primary" onClick={() => nav(`/report/my/${r.id}`)}>{t('viewReport')}</button>
          <button className="btn btn-secondary" onClick={() => nav('/report/new')}>{t('anotherIssue')}</button>
          <button className="btn btn-ghost" onClick={() => nav('/')}>{t('backHome')}</button>
        </div>
      </div>
    </Screen>
  )
}
