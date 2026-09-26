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

const YES = /^(y|yes|ok|ho|haan|han|हो|हां|हाँ)/i
const LOC = /location|gps|here|यहाँ|यहां|इथे|जगह|ठिकाण/i

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

export default function ChatReport() {
  const nav = useNavigate()
  const { t, meta } = useLang()
  const { draft, update, reset, submit } = useStore()
  const [msgs, setMsgs] = useState([])
  // intro | problem | confirm | pick | photo | where | address | review | sending | done
  const [stage, setStage] = useState('intro')
  const [typing, setTyping] = useState(false)
  const [text, setText] = useState('')
  const [listening, setListening] = useState(false)
  const [voiceOn, setVoiceOn] = useState(false)
  const [filed, setFiled] = useState(null)
  const [pickerOpen, setPickerOpen] = useState(true)
  const endRef = useRef(null)
  const recRef = useRef(null)
  const voiceRef = useRef(false)
  voiceRef.current = voiceOn

  const speak = (s) => {
    if (!voiceRef.current || typeof s !== 'string' || !window.speechSynthesis) return
    const u = new SpeechSynthesisUtterance(s)
    u.lang = meta.speech
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(u)
  }

  const say = (node, delay = 700, mood) =>
    new Promise((res) => {
      setTyping(true)
      setTimeout(() => {
        setTyping(false)
        setMsgs((m) => [...m, { who: 'bot', node, mood }])
        speak(node)
        res()
      }, delay)
    })
  const mine = (node, img) => setMsgs((m) => [...m, { who: 'user', node, img }])

  // Intro (guarded so StrictMode's double effect run doesn't duplicate messages)
  const started = useRef(false)
  useEffect(() => {
    if (started.current) return
    started.current = true
    reset()
    ;(async () => {
      await say(t('botHello'), 500)
      await say(t('botTellMe'))
      setStage('problem')
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs, typing, stage])
  useEffect(() => () => window.speechSynthesis?.cancel(), [])

  const { open: openCamera, input: fileInput } = usePhotoPicker(async (photo, photoAt) => {
    update({ photo, photoAt })
    mine(t('herePhoto'), photo)
    await say(t('botGotPhoto', { t: photoAt }))
    askWhere()
  })

  /* ---- conversation steps ---- */
  const ACK = { pothole: 'ackPothole', garbage: 'ackGarbage', streetlight: 'ackStreetlight', footpath: 'ackFootpath', water: 'ackWater', other: 'ackOther' }

  const handleProblem = async (v) => {
    mine(v)
    update({ description: v })
    const cat = draft.category || detectCategory(v)
    if (cat) {
      update({ category: cat })
      setPickerOpen(false)
      await say(t(ACK[cat]))
      askPhoto()
    } else {
      await say(t('botWhichBest'))
      setPickerOpen(true)
      setStage('pick')
    }
  }

  // Category tile tapped. At the start it just sets the label; when the bot asked for it, it answers the question.
  const chooseType = async (id) => {
    update({ category: id })
    setPickerOpen(false)
    if (stage === 'pick') {
      mine(t(catById(id).key))
      await say(t(ACK[id]))
      askPhoto()
    }
  }
  const handlePick = async (v) => {
    const cat = detectCategory(v)
    mine(v)
    if (cat) { chooseType(cat); return }
    await say(t('botWhichBest'))
  }

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
  const detectLocation = async () => {
    mine(t('useLoc'))
    setStage('locating')
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
  const startOver = async () => {
    mine(t('startOver'))
    reset()
    setPickerOpen(true)
    await say(t('botStartOver'))
    setStage('problem')
  }
  const reportIt = async () => {
    mine(t('yesReport'))
    setStage('sending')
    await say(t('botSending'), 400, 'focused')
    await new Promise((r) => setTimeout(r, 1200))
    const r = submit()
    setFiled(r)
    await say(t('botDone', { ward: r.ward }), 300, 'happy')
    setMsgs((m) => [...m, { who: 'card', id: r.id }])
    await say(t('botWhatNext'), 900, 'happy')
    setStage('done')
  }

  /* ---- input handling ---- */
  const send = (v0) => {
    const v = (v0 ?? text).trim()
    if (!v) return
    setText('')
    if (stage === 'problem') handleProblem(v)
    else if (stage === 'pick') handlePick(v)
    else if (stage === 'where') { if (LOC.test(v)) detectLocation(); else handleAddress(v) }
    else if (stage === 'address') handleAddress(v)
    else if (stage === 'review') { if (YES.test(v)) reportIt(); else startOver() }
  }

  const toggleMic = () => {
    if (listening) { recRef.current?.stop?.(); setListening(false); return }
    setVoiceOn(true)
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
  // No speech recognition on this device: pretend we heard something sensible for the current stage
  const fallbackVoice = () => {
    if (stage === 'problem') send(t('cannedProblem'))
    else if (stage === 'address') send(t('cannedAddr'))
    else if (stage === 'where') send(t('useLoc'))
    else send(t('yes'))
  }

  const cat = draft.category ? catById(draft.category) : null
  const canTalk = ['problem', 'pick', 'where', 'address', 'review'].includes(stage)
  const showPicker = pickerOpen && ['problem', 'pick', 'photo', 'where', 'address', 'review'].includes(stage) && !typing

  return (
    <Screen tabs={false} className="chat-screen">
      <TopBar back="/report" title={t('chatTitle')} right={
        <button
          className={`iconbtn ${voiceOn ? 'on' : ''}`}
          onClick={() => { if (voiceOn) window.speechSynthesis?.cancel(); setVoiceOn(!voiceOn) }}
          aria-pressed={voiceOn}
          aria-label={t('readAloud')}
          title={t('readAloud')}
        ><Ic.Speaker /></button>
      } />
      {fileInput}

      <div className="chat">
        {msgs.map((m, i) => {
          if (m.who === 'bot') return <Bot key={i} mood={m.mood}>{m.node}</Bot>
          if (m.who === 'user') return <User key={i} img={m.img}>{m.node}</User>
          return (
            <div key={i} className="card center fade-in">
              <span className="eyebrow">{t('cno')}</span>
              <div className="cno">{m.id}</div>
            </div>
          )
        })}
        {typing && <Typing />}

        {stage === 'review' && !typing && (
          <div className="card fade-in">
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
          {stage === 'photo' && (
            <>
              <button className="chip active" onClick={openCamera}><Ic.Camera /> {t('takePhoto')}</button>
              <button className="chip" onClick={skipPhoto}>{t('skip')}</button>
            </>
          )}
          {stage === 'where' && (
            <>
              <button className="chip active" onClick={detectLocation}><Ic.Pin /> {t('useLoc')}</button>
              <button className="chip" onClick={typeAddress}>{t('typeAddr')}</button>
            </>
          )}
          {stage === 'review' && (
            <>
              <button className="chip active" onClick={reportIt}>{t('yesReport')}</button>
              <button className="chip" onClick={startOver}>{t('startOver')}</button>
            </>
          )}
          {stage === 'done' && filed && (
            <>
              <button className="chip active" onClick={() => nav(`/report/my/${filed.id}`)}>{t('viewReport')}</button>
              <button className="chip" onClick={() => nav('/')}>{t('backHome')}</button>
            </>
          )}
        </div>
      )}

      {showPicker && stage !== 'intro' && (
        <div className="type-carousel" role="listbox" aria-label={t('whatQ')}>
          {CATEGORIES.map((c) => {
            const Icon = c.icon
            return (
              <button key={c.id} className={`cat ${draft.category === c.id ? 'selected' : ''}`} onClick={() => chooseType(c.id)}>
                <span className="ico"><Icon /></span>
                <span>{t(c.key)}</span>
              </button>
            )
          })}
        </div>
      )}
      {cat && !pickerOpen && !['sending', 'done'].includes(stage) && (
        <div className="type-label-row">
          <button className="type-label" onClick={() => setPickerOpen(true)}>
            <cat.icon /> {t(cat.key)} <span className="change">{t('change')}</span>
          </button>
        </div>
      )}
      {stage !== 'done' && (
        <div className="composer">
          <input
            className="input"
            placeholder={listening ? t('listening') : canTalk ? t('typeHere') : t('useButtons')}
            value={text}
            disabled={!canTalk || listening}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
          />
          {text.trim() ? (
            <button className="mic" onClick={() => send()} aria-label="Send"><Ic.Send /></button>
          ) : (
            <button className={`mic ${listening ? 'listening' : ''}`} onClick={toggleMic} disabled={!canTalk} aria-label="Speak"><Ic.Mic /></button>
          )}
        </div>
      )}
    </Screen>
  )
}
