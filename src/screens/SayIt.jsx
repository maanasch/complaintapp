import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Screen, TopBar } from '../components.jsx'
import * as Ic from '../icons.jsx'
import { CATEGORIES, MOCK_LOCATION, catById } from '../data.js'
import { useStore } from '../store.jsx'
import { usePhotoPicker } from './FileReport.jsx'

const KEYWORDS = {
  pothole: ['pothole', 'khadda', 'खड्डा', 'hole', 'road broken', 'crater'],
  garbage: ['garbage', 'kachra', 'कचरा', 'trash', 'waste', 'bin', 'dustbin', 'smell'],
  streetlight: ['light', 'lamp', 'दिवा', 'batti', 'dark', 'streetlight'],
  footpath: ['footpath', 'pavement', 'tiles', 'पदपथ', 'sidewalk', 'paver'],
  water: ['water', 'pani', 'पाणी', 'leak', 'pipe', 'flood', 'logging', 'drain'],
}

function detectCategory(text) {
  const t = text.toLowerCase()
  for (const [id, words] of Object.entries(KEYWORDS)) if (words.some((w) => t.includes(w))) return id
  return null
}

// Canned "transcripts" used when the mic is tapped and speech recognition is unavailable
const CANNED = {
  problem: 'There is a big pothole on the road near the bus stop. Rickshaws keep swerving around it.',
  extra: 'It has been there for about two weeks.',
}

const Bot = ({ children, img }) => (
  <div className="msg bot fade-in">
    <span className="avatar"><Ic.MascotFace /></span>
    <div className="body">{children}{img && <img src={img} alt="" />}</div>
  </div>
)
const User = ({ children, img }) => (
  <div className="msg user fade-in">
    <div className="body">{children}{img && <img src={img} alt="" />}</div>
  </div>
)
const Typing = () => (
  <div className="msg bot"><span className="avatar"><Ic.MascotFace /></span><div className="body"><span className="typing"><i /><i /><i /></span></div></div>
)

export default function SayIt() {
  const nav = useNavigate()
  const { draft, update, submit } = useStore()
  const [msgs, setMsgs] = useState([])
  const [stage, setStage] = useState('intro') // intro | problem | confirm | pick | photo | where | address | review | sending
  const [typing, setTyping] = useState(false)
  const [text, setText] = useState('')
  const [listening, setListening] = useState(false)
  const endRef = useRef(null)
  const recRef = useRef(null)

  const say = (node, delay = 700) =>
    new Promise((res) => {
      setTyping(true)
      setTimeout(() => { setTyping(false); setMsgs((m) => [...m, { who: 'bot', node }]); res() }, delay)
    })
  const mine = (node, img) => setMsgs((m) => [...m, { who: 'user', node, img }])

  // Intro (guarded so StrictMode's double effect run doesn't duplicate messages)
  const started = useRef(false)
  useEffect(() => {
    if (started.current) return
    started.current = true
    ;(async () => {
      await say('Hello. I can file the complaint for you.', 500)
      await say('Tell me what the problem is. You can speak, or type below.')
      setStage('problem')
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs, typing, stage])

  const { open: openCamera, input: fileInput } = usePhotoPicker(async (photo, photoAt) => {
    update({ photo, photoAt })
    mine('Here is the photo.', photo)
    await say(`Got it. The photo has the time (${photoAt}) and location attached.`)
    askWhere()
  })

  /* ---- conversation steps ---- */
  const handleProblem = async (t) => {
    mine(t)
    const cat = detectCategory(t)
    update({ description: t })
    if (cat) {
      update({ category: cat })
      await say(<>That sounds like a <b>{catById(cat).label}</b> problem. Is that right?</>)
      setStage('confirm')
    } else {
      await say('Thanks. Which of these describes it best?')
      setStage('pick')
    }
  }

  const confirmYes = async () => {
    mine('Yes, that is right')
    askPhoto()
  }
  const confirmNo = async () => {
    mine('No, something else')
    await say('No problem. Pick the closest one:')
    setStage('pick')
  }
  const pick = async (id) => {
    update({ category: id })
    mine(catById(id).label)
    askPhoto()
  }

  const askPhoto = async () => {
    await say('Can you take a photo of it? It helps the team find the exact spot.')
    setStage('photo')
  }
  const skipPhoto = async () => {
    mine('Skip the photo')
    await say('Okay, we can continue without one.')
    askWhere()
  }

  const askWhere = async () => {
    await say('Where is it? I can use your phone location, or you can tell me the address.')
    setStage('where')
  }
  const useLocation = async () => {
    mine('Use my location')
    await say('Finding your location…', 300)
    await new Promise((r) => setTimeout(r, 1200))
    update({ location: MOCK_LOCATION })
    await say(<>Found it: <b>{MOCK_LOCATION.label}</b>, {MOCK_LOCATION.ward}.</>, 200)
    review()
  }
  const typeAddress = async () => {
    mine('I will tell you the address')
    await say('Go ahead, type or say the landmark or road.')
    setStage('address')
  }
  const handleAddress = async (t) => {
    mine(t)
    update({ location: { ...MOCK_LOCATION, label: t, address: t } })
    await say(<>Noted: <b>{t}</b>.</>)
    review()
  }

  const review = async () => {
    await say('Here is what I have. Shall I report it?', 900)
    setStage('review')
  }
  const reportIt = async () => {
    mine('Yes, report it')
    setStage('sending')
    await say('Sending to BMC…', 400)
    setTimeout(() => { submit(); nav('/report/new/done', { replace: true }) }, 1200)
  }

  /* ---- input handling ---- */
  const send = (t) => {
    const v = (t ?? text).trim()
    if (!v) return
    setText('')
    if (stage === 'problem') handleProblem(v)
    else if (stage === 'address') handleAddress(v)
    else if (stage === 'confirm') (/^(y|yes|ho|haan|हो|हाँ)/i.test(v) ? confirmYes() : confirmNo())
    else if (stage === 'where') (/location|gps|here|यहाँ|इथे/i.test(v) ? useLocation() : handleAddress(v))
    else if (stage === 'photo') (/skip|no|nahi|नाही/i.test(v) ? skipPhoto() : openCamera())
    else if (stage === 'review') (/^(y|yes|ho|haan|हो|हाँ)/i.test(v) ? reportIt() : nav('/report/new/review'))
    else { mine(v); update({ description: `${draft.description} ${v}`.trim() }) }
  }

  const toggleMic = () => {
    if (listening) { recRef.current?.stop?.(); setListening(false); return }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    setListening(true)
    if (SR) {
      const rec = new SR()
      recRef.current = rec
      rec.lang = 'en-IN'
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
    if (stage === 'problem') send(CANNED.problem)
    else if (stage === 'address') send('Opposite Jehangir Art Gallery, Kala Ghoda')
    else if (stage === 'confirm' || stage === 'review') send('Yes')
    else if (stage === 'where') send('Use my location')
    else send(CANNED.extra)
  }

  const cat = draft.category ? catById(draft.category) : null
  const canType = ['problem', 'address', 'confirm', 'where', 'review'].includes(stage)

  return (
    <Screen tabs={false} className="chat-screen">
      <TopBar back="/report/new" title="Say it" right={
        <button className="iconbtn" title="Switch to typing" onClick={() => nav('/report/new/photo')}><Ic.Keyboard /></button>
      } />
      {fileInput}

      <div className="chat">
        {msgs.map((m, i) => m.who === 'bot' ? <Bot key={i}>{m.node}</Bot> : <User key={i} img={m.img}>{m.node}</User>)}
        {typing && <Typing />}

        {stage === 'review' && !typing && (
          <div className="card fade-in" style={{ alignSelf: 'stretch' }}>
            <dl className="kv" style={{ gridTemplateColumns: '64px 1fr' }}>
              <dt>What</dt><dd>{cat?.label}<span className="small" style={{ display: 'block', fontWeight: 400 }}>{draft.description}</span></dd>
              <dt>Where</dt><dd>{draft.location?.label}</dd>
              <dt>Photo</dt><dd>{draft.photo ? 'Attached' : 'None'}</dd>
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
              <button className="chip" onClick={() => send('There is a pothole near the bus stop')}>Pothole near bus stop</button>
              <button className="chip" onClick={() => send('Garbage has not been collected for 3 days')}>Garbage not collected</button>
              <button className="chip" onClick={() => send('The streetlight outside is not working')}>Streetlight off</button>
            </>
          )}
          {stage === 'confirm' && (
            <>
              <button className="chip active" onClick={confirmYes}>Yes, that is right</button>
              <button className="chip" onClick={confirmNo}>No, something else</button>
            </>
          )}
          {stage === 'pick' && CATEGORIES.map((c) => (
            <button key={c.id} className="chip" onClick={() => pick(c.id)}>{c.label}</button>
          ))}
          {stage === 'photo' && (
            <>
              <button className="chip active" onClick={openCamera}>📷 Take photo</button>
              <button className="chip" onClick={skipPhoto}>Skip</button>
            </>
          )}
          {stage === 'where' && (
            <>
              <button className="chip active" onClick={useLocation}>Use my location</button>
              <button className="chip" onClick={typeAddress}>Type the address</button>
            </>
          )}
          {stage === 'review' && (
            <>
              <button className="chip active" onClick={reportIt}>Yes, report it</button>
              <button className="chip" onClick={() => nav('/report/new/review')}>Edit details</button>
            </>
          )}
        </div>
      )}

      <div className="composer">
        <input
          className="input"
          placeholder={listening ? 'Listening…' : canType ? 'Type here…' : 'Use the buttons above'}
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
