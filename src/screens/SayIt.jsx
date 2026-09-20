import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Screen, TopBar } from '../components.jsx'
import { MascotHead } from '../brand.jsx'
import * as Ic from '../icons.jsx'
import { CATEGORIES, MOCK_LOCATION, catById } from '../data.js'
import { useStore } from '../store.jsx'
import { useLang } from '../i18n.jsx'
import { usePhotoPicker } from './FileReport.jsx'

// Keyword hints across English, Hindi/Hinglish and Marathi
const KEYWORDS = {
  pothole: ['pothole', 'khadda', 'खड्डा', 'गड्ढा', 'hole', 'road broken', 'crater'],
  garbage: ['garbage', 'kachra', 'कचरा', 'trash', 'waste', 'bin', 'dustbin', 'smell'],
  streetlight: ['light', 'lamp', 'दिवा', 'लाइट', 'batti', 'बत्ती', 'dark', 'streetlight'],
  footpath: ['footpath', 'pavement', 'tiles', 'पदपथ', 'फुटपाथ', 'sidewalk', 'paver'],
  water: ['water', 'pani', 'पाणी', 'पानी', 'leak', 'pipe', 'flood', 'logging', 'drain'],
}

function detectCategory(text) {
  const s = text.toLowerCase()
  for (const [id, words] of Object.entries(KEYWORDS)) if (words.some((w) => s.includes(w))) return id
  return null
}

const YES = /^(y|yes|ho|haan|han|हो|हां|हाँ)/i
const LOC = /location|gps|here|यहाँ|यहां|इथे|जगह|ठिकाण/i
const NO = /skip|no|nahi|नहीं|नाही|छोड़|वगळ/i

const Bot = ({ children, mood = 'friendly' }) => (
  <div className="msg bot fade-in">
    <span className="avatar"><MascotHead mood={mood} /></span>
    <div className="body">{children}</div>
  </div>
)
const User = ({ children, img }) => (
  <div className="msg user fade-in">
    <div className="body">{children}{img && <img src={img} alt="" />}</div>
  </div>
)
const Typing = () => (
  <div className="msg bot"><span className="avatar"><MascotHead mood="focused" /></span><div className="body"><span className="typing"><i /><i /><i /></span></div></div>
)

export default function SayIt() {
  const nav = useNavigate()
  const { t, meta } = useLang()
  const { draft, update, submit } = useStore()
  const [msgs, setMsgs] = useState([])
  const [stage, setStage] = useState('intro') // intro | problem | confirm | pick | photo | where | address | review | sending
  const [typing, setTyping] = useState(false)
  const [text, setText] = useState('')
  const [listening, setListening] = useState(false)
  const endRef = useRef(null)
  const recRef = useRef(null)

  const say = (node, delay = 700, mood) =>
    new Promise((res) => {
      setTyping(true)
      setTimeout(() => { setTyping(false); setMsgs((m) => [...m, { who: 'bot', node, mood }]); res() }, delay)
    })
  const mine = (node, img) => setMsgs((m) => [...m, { who: 'user', node, img }])

  // Intro (guarded so StrictMode's double effect run doesn't duplicate messages)
  const started = useRef(false)
  useEffect(() => {
    if (started.current) return
    started.current = true
    ;(async () => {
      await say(t('botHello'), 500)
      await say(t('botTellMe'))
      setStage('problem')
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs, typing, stage])

  const { open: openCamera, input: fileInput } = usePhotoPicker(async (photo, photoAt) => {
    update({ photo, photoAt })
    mine(t('herePhoto'), photo)
    await say(t('botGotPhoto', { t: photoAt }))
    askWhere()
  })

  /* ---- conversation steps ---- */
  const handleProblem = async (v) => {
    mine(v)
    const cat = detectCategory(v)
    update({ description: v })
    if (cat) {
      update({ category: cat })
      await say(t('botSoundsLike', { cat: t(catById(cat).key) }))
      setStage('confirm')
    } else {
      await say(t('botWhichBest'))
      setStage('pick')
    }
  }

  const confirmYes = () => { mine(t('yesRight')); askPhoto() }
  const confirmNo = async () => {
    mine(t('noElse'))
    await say(t('botPickClosest'))
    setStage('pick')
  }
  const pick = (id) => { update({ category: id }); mine(t(catById(id).key)); askPhoto() }

  const askPhoto = async () => {
    await say(t('botAskPhoto'))
    setStage('photo')
  }
  const skipPhoto = async () => {
    mine(t('skipPhoto'))
    await say(t('botOkNoPhoto'))
    askWhere()
  }

  const askWhere = async () => {
    await say(t('botAskWhere'))
    setStage('where')
  }
  const useLocation = async () => {
    mine(t('useLoc'))
    await say(t('finding'), 300, 'focused')
    await new Promise((r) => setTimeout(r, 1200))
    update({ location: MOCK_LOCATION })
    await say(t('botFoundIt', { loc: MOCK_LOCATION.label, ward: MOCK_LOCATION.ward }), 200)
    review()
  }
  const typeAddress = async () => {
    mine(t('tellAddr'))
    await say(t('botGoAhead'))
    setStage('address')
  }
  const handleAddress = async (v) => {
    mine(v)
    update({ location: { ...MOCK_LOCATION, label: v, address: v } })
    await say(t('botNoted', { t: v }))
    review()
  }

  const review = async () => {
    await say(t('botHereIs'), 900)
    setStage('review')
  }
  const reportIt = async () => {
    mine(t('yesReport'))
    setStage('sending')
    await say(t('botSending'), 400, 'focused')
    setTimeout(() => { submit(); nav('/report/new/done', { replace: true }) }, 1200)
  }

  /* ---- input handling ---- */
  const send = (v0) => {
    const v = (v0 ?? text).trim()
    if (!v) return
    setText('')
    if (stage === 'problem') handleProblem(v)
    else if (stage === 'address') handleAddress(v)
    else if (stage === 'confirm') (YES.test(v) ? confirmYes() : confirmNo())
    else if (stage === 'where') (LOC.test(v) ? useLocation() : handleAddress(v))
    else if (stage === 'photo') (NO.test(v) ? skipPhoto() : openCamera())
    else if (stage === 'review') (YES.test(v) ? reportIt() : nav('/report/new/review'))
    else { mine(v); update({ description: `${draft.description} ${v}`.trim() }) }
  }

  const toggleMic = () => {
    if (listening) { recRef.current?.stop?.(); setListening(false); return }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    setListening(true)
    if (SR) {
      const rec = new SR()
      recRef.current = rec
      rec.lang = meta.speech
      rec.interimResults = false
      rec.onresult = (e) => { setListening(false); send(e.results[0][0].transcript) }
      rec.onerror = () => { setListening(false); fallbackVoice() }
      rec.onend = () => setListening(false)
      try { rec.start() } catch { setListening(false); fallbackVoice() }
    } else {
      setTimeout(() => { setListening(false); fallbackVoice() }, 1800)
    }
  }
  // Pretend we heard something sensible for the current stage
  const fallbackVoice = () => {
    if (stage === 'problem') send(t('cannedProblem'))
    else if (stage === 'address') send(t('cannedAddr'))
    else if (stage === 'confirm' || stage === 'review') send(t('yes'))
    else if (stage === 'where') send(t('useLoc'))
    else send(t('yes'))
  }

  const cat = draft.category ? catById(draft.category) : null
  const canType = ['problem', 'address', 'confirm', 'where', 'review'].includes(stage)

  return (
    <Screen tabs={false} className="chat-screen">
      <TopBar back="/report/new" title={t('sayIt')} right={
        <button className="iconbtn" title={t('switchTyping')} onClick={() => nav('/report/new/photo')}><Ic.Keyboard /></button>
      } />
      {fileInput}

      <div className="chat">
        {msgs.map((m, i) => m.who === 'bot' ? <Bot key={i} mood={m.mood}>{m.node}</Bot> : <User key={i} img={m.img}>{m.node}</User>)}
        {typing && <Typing />}

        {stage === 'review' && !typing && (
          <div className="card fade-in" style={{ alignSelf: 'stretch' }}>
            <dl className="kv" style={{ gridTemplateColumns: '64px 1fr' }}>
              <dt>{t('what')}</dt><dd>{cat && t(cat.key)}<span className="small" style={{ display: 'block', fontWeight: 400 }}>{draft.description}</span></dd>
              <dt>{t('where')}</dt><dd>{draft.location?.label}</dd>
              <dt>{t('photo')}</dt><dd>{draft.photo ? t('attached') : t('none')}</dd>
            </dl>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Quick replies */}
      {!typing && (
        <div className="quick">
          {stage === 'problem' && msgs.length >= 2 && (
            <>
              <button className="chip" onClick={() => send(t('quick1'))}>{t('quick1')}</button>
              <button className="chip" onClick={() => send(t('quick2'))}>{t('quick2')}</button>
              <button className="chip" onClick={() => send(t('quick3'))}>{t('quick3')}</button>
            </>
          )}
          {stage === 'confirm' && (
            <>
              <button className="chip active" onClick={confirmYes}>{t('yesRight')}</button>
              <button className="chip" onClick={confirmNo}>{t('noElse')}</button>
            </>
          )}
          {stage === 'pick' && CATEGORIES.map((c) => (
            <button key={c.id} className="chip" onClick={() => pick(c.id)}>{t(c.key)}</button>
          ))}
          {stage === 'photo' && (
            <>
              <button className="chip active" onClick={openCamera}>📷 {t('takePhoto')}</button>
              <button className="chip" onClick={skipPhoto}>{t('skip')}</button>
            </>
          )}
          {stage === 'where' && (
            <>
              <button className="chip active" onClick={useLocation}>{t('useLoc')}</button>
              <button className="chip" onClick={typeAddress}>{t('typeAddr')}</button>
            </>
          )}
          {stage === 'review' && (
            <>
              <button className="chip active" onClick={reportIt}>{t('yesReport')}</button>
              <button className="chip" onClick={() => nav('/report/new/review')}>{t('editDetails')}</button>
            </>
          )}
        </div>
      )}

      <div className="composer">
        <input
          className="input"
          placeholder={listening ? t('listening') : canType ? t('typeHere') : t('useButtons')}
          value={text}
          disabled={!canType || listening}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
        />
        {text.trim() ? (
          <button className="mic" onClick={() => send()} aria-label="Send"><Ic.Send /></button>
        ) : (
          <button className={`mic ${listening ? 'listening' : ''}`} onClick={toggleMic} disabled={!canType && stage !== 'photo'} aria-label="Speak"><Ic.Mic /></button>
        )}
      </div>
    </Screen>
  )
}
