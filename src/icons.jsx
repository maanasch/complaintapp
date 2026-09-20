const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24',
}

const I = ({ children, ...p }) => (
  <svg {...base} {...p}>{children}</svg>
)

export const Home = (p) => (
  <I {...p}><path d="M3 11 12 3l9 8" /><path d="M5 10v10h14V10" /><path d="M10 20v-6h4v6" /></I>
)
export const Report = (p) => (
  <I {...p}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5" /><path d="M9 13h6M9 17h4" /></I>
)
export const Around = (p) => (
  <I {...p}><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" /><circle cx="12" cy="12" r="8" /></I>
)
export const Back = (p) => (
  <I {...p}><path d="m15 18-6-6 6-6" /></I>
)
export const Chevron = (p) => (
  <I {...p}><path d="m9 6 6 6-6 6" /></I>
)
export const Camera = (p) => (
  <I {...p}><path d="M4 8h3l2-3h6l2 3h3v11H4z" /><circle cx="12" cy="13" r="3.5" /></I>
)
export const Mic = (p) => (
  <I {...p}><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0" /><path d="M12 18v3" /></I>
)
export const Keyboard = (p) => (
  <I {...p}><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M7 10h.01M11 10h.01M15 10h.01M7 14h10" /></I>
)
export const Pin = (p) => (
  <I {...p}><path d="M12 22s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z" /><circle cx="12" cy="10" r="2.5" /></I>
)
export const PinSolid = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12 22s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z" /><circle cx="12" cy="10" r="2.5" fill="#fff" /></svg>
)
export const Map = (p) => (
  <I {...p}><path d="M3 6v14l6-2 6 2 6-2V4l-6 2-6-2z" /><path d="M9 4v14M15 6v14" /></I>
)
export const Check = (p) => (
  <I {...p}><path d="m5 12 5 5L20 7" /></I>
)
export const Clock = (p) => (
  <I {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></I>
)
export const Search = (p) => (
  <I {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></I>
)
export const Phone = (p) => (
  <I {...p}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /></I>
)
export const Send = (p) => (
  <I {...p}><path d="m3 11 18-8-8 18-2-8z" /></I>
)
export const Bell = (p) => (
  <I {...p}><path d="M6 16V11a6 6 0 1 1 12 0v5l2 2H4z" /><path d="M10 21h4" /></I>
)
export const Edit = (p) => (
  <I {...p}><path d="M4 20h4l10-10-4-4L4 16z" /><path d="m13 7 4 4" /></I>
)
export const List = (p) => (
  <I {...p}><path d="M8 6h13M8 12h13M8 18h13" /><path d="M3 6h.01M3 12h.01M3 18h.01" /></I>
)
export const Plus = (p) => (
  <I {...p}><path d="M12 5v14M5 12h14" /></I>
)
export const Globe = (p) => (
  <I {...p}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></I>
)
export const Chat = (p) => (
  <I {...p}><path d="M4 5h16v11H9l-5 4z" /></I>
)

/* Category icons */
export const Pothole = (p) => (
  <I {...p}><path d="M3 18c3-1 5-1 7 0s5 1 7 0 4-1 4 0" /><path d="M7 14c1-2 3-3 5-3s4 1 5 3" /><path d="M9 11.5 8 8M15 11.5 16 8" /></I>
)
export const Garbage = (p) => (
  <I {...p}><path d="M4 7h16M9 7V4h6v3" /><path d="M6 7l1 13h10l1-13" /><path d="M10 11v6M14 11v6" /></I>
)
export const Streetlight = (p) => (
  <I {...p}><path d="M12 21V8" /><path d="M12 8 7 4h10z" /><path d="M9 21h6" /><path d="M5 9l-1 2M19 9l1 2M12 2v1" /></I>
)
export const Footpath = (p) => (
  <I {...p}><path d="M3 20 9 6h6l6 14" /><path d="M6 16h12M8 12h8" /></I>
)
export const Water = (p) => (
  <I {...p}><path d="M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11z" /><path d="M9 15a3 3 0 0 0 3 3" /></I>
)
export const Other = (p) => (
  <I {...p}><circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16h.01" /></I>
)

