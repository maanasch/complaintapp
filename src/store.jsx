import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { MY_REPORTS, newComplaintId, nowStamp, catById } from './data.js'

const EMPTY_DRAFT = {
  photo: null, // object URL
  photoAt: null, // timestamp string
  category: null,
  description: '',
  location: null, // { label, address, lat, lng, ward }
  via: 'type', // 'type' | 'say'
}

const Ctx = createContext(null)

export function StoreProvider({ children }) {
  const [draft, setDraft] = useState(EMPTY_DRAFT)
  const [reports, setReports] = useState(MY_REPORTS)
  const [lastSubmitted, setLastSubmitted] = useState(null)

  const update = useCallback((patch) => setDraft((d) => ({ ...d, ...patch })), [])
  const reset = useCallback(() => setDraft(EMPTY_DRAFT), [])

  const submit = useCallback(() => {
    const id = newComplaintId()
    const cat = catById(draft.category || 'other')
    const report = {
      id,
      category: cat.id,
      title: draft.description?.trim() ? draft.description.trim().split(/[.\n]/)[0].slice(0, 48) : cat.label,
      description: draft.description || `${cat.label} reported via app`,
      location: draft.location?.label || 'Location not set',
      ward: draft.location?.ward || 'A Ward',
      status: 'submitted',
      reported: nowStamp(),
      updated: 'Just now',
      photo: draft.photo,
      timeline: [
        { t: 'Just now', title: 'Complaint received', note: `Sent to ${draft.location?.ward || 'A Ward'} · ${cat.dept}` },
        { t: null, title: 'Assigned to engineer', note: '' },
        { t: null, title: 'Work in progress', note: '' },
        { t: null, title: 'Fixed', note: '' },
      ],
    }
    setReports((r) => [report, ...r])
    setLastSubmitted(report)
    setDraft(EMPTY_DRAFT)
    return report
  }, [draft])

  const value = useMemo(
    () => ({ draft, update, reset, submit, reports, lastSubmitted }),
    [draft, update, reset, submit, reports, lastSubmitted],
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useStore = () => useContext(Ctx)
