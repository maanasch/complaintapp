/*
  Vector interpretations of the Aapli BMC brand assets (mascot + logo mark).
  Drawn from the brand sheet so they scale and recolour; swap for the final
  illustrations when available.
*/

const Y = '#ffbd19'
const K = '#171717'
const C = '#f7f5ef'
const B = '#17529d'
const N = '#1b3a5c'
const O = '#fe7534'

/* Two orange "notice" sparks used across the brand */
export const Sparks = ({ size = 22, style }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} style={style} aria-hidden>
    <path d="M6 20 10 8" stroke={O} strokeWidth="3.4" strokeLinecap="round" />
    <path d="M14 18 20 8" stroke={O} strokeWidth="3.4" strokeLinecap="round" />
  </svg>
)

/*
  Mascot head. mood 'sad' is for unresolved or escalated problems; everything else uses the happy face.
*/
export function MascotHead({ mood = 'happy', size = 48, style, ...rest }) {
  return (
    <img
      src={mood === 'sad' ? '/mascot/sad.png' : '/mascot/happy.png'}
      alt=""
      width={size}
      height={size}
      style={{ objectFit: 'contain', ...style }}
      {...rest}
    />
  )
}

/* Full-body illustration used on the Home hero */
export const MascotIllustration = ({ width = 104, style }) => (
  <img src="/mascot/full.png" alt="" width={width} height={Math.round(width * 370 / 312)} style={style} />
)

function Face({ mood }) {
  if (mood === 'happy') {
    return (
      <g stroke={K} strokeWidth="3" strokeLinecap="round" fill="none">
        <path d="M22 35c2-4 5-4 7 0" /><path d="M35 35c2-4 5-4 7 0" />
        <path d="M26 42c3 4 9 4 12 0" />
      </g>
    )
  }
  if (mood === 'wink') {
    return (
      <g>
        <rect x="22" y="29" width="6" height="11" rx="3" fill={K} />
        <path d="M35 35c2-4 5-4 7 0" stroke={K} strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M26 43q6 4 12 0" stroke={K} strokeWidth="2.6" strokeLinecap="round" fill="none" />
      </g>
    )
  }
  if (mood === 'focused') {
    return (
      <g>
        <rect x="22" y="31" width="6" height="8" rx="3" fill={K} />
        <rect x="36" y="31" width="6" height="8" rx="3" fill={K} />
        <path d="M27 44h10" stroke={K} strokeWidth="2.6" strokeLinecap="round" />
      </g>
    )
  }
  return (
    <g>
      <rect x="22" y="29" width="6" height="11" rx="3" fill={K} />
      <rect x="36" y="29" width="6" height="11" rx="3" fill={K} />
      <path d="M26 44q6 4 12 0" stroke={K} strokeWidth="2.6" strokeLinecap="round" fill="none" />
    </g>
  )
}

/*
  Full-body mascot: head + rounded body, sling bag, feet.
  pose: 'wave' | 'phone' | 'thumbs'
*/
export function MascotFull({ mood = 'friendly', pose = 'wave', size = 120, sparks = true, style }) {
  return (
    <svg viewBox="0 0 96 120" width={size} height={size * 1.25} style={style} aria-hidden>
      {sparks && (
        <g stroke={O} strokeWidth="4" strokeLinecap="round">
          <path d="M76 18 80 6" /><path d="M86 22 94 12" />
        </g>
      )}
      {/* body */}
      <ellipse cx="46" cy="88" rx="24" ry="22" fill={K} />
      {/* feet */}
      <ellipse cx="34" cy="112" rx="10" ry="5" fill={K} />
      <ellipse cx="60" cy="112" rx="10" ry="5" fill={K} />
      {/* bag strap + bag */}
      <path d="M34 70 60 96" stroke={N} strokeWidth="4" strokeLinecap="round" />
      <rect x="22" y="84" width="22" height="18" rx="4" fill={N} />
      <text x="33" y="92" textAnchor="middle" fontSize="5" fontFamily="Anek Devanagari, sans-serif" fill={C}>मुंबई</text>
      <text x="33" y="98.5" textAnchor="middle" fontSize="4.6" fontFamily="Anek Devanagari, sans-serif" fill={C}>आपली आहे</text>
      {/* arms */}
      {pose === 'wave' && <path d="M68 78c8-4 12-12 14-20" stroke={K} strokeWidth="8" strokeLinecap="round" fill="none" />}
      {pose === 'phone' && (
        <g>
          <path d="M66 82c8 0 12-6 14-10" stroke={K} strokeWidth="8" strokeLinecap="round" fill="none" />
          <rect x="74" y="60" width="12" height="20" rx="3" fill={N} stroke={K} strokeWidth="2" />
        </g>
      )}
      {pose === 'thumbs' && (
        <g>
          <path d="M68 80c8-2 12-8 12-16" stroke={K} strokeWidth="8" strokeLinecap="round" fill="none" />
          <rect x="74" y="52" width="9" height="14" rx="4" fill={K} />
        </g>
      )}
      <path d="M26 82c-6-2-10-8-12-14" stroke={K} strokeWidth="8" strokeLinecap="round" fill="none" />
      {/* head */}
      <g transform="translate(14 8)">
        <rect x="21" y="2" width="22" height="10" rx="3" fill={Y} />
        <text x="32" y="10" textAnchor="middle" fontSize="6.5" fontWeight="800" fontFamily="Anek Latin, sans-serif" fill={K}>BMC</text>
        <rect x="6" y="10" width="52" height="52" rx="22" fill={K} />
        <path d="M8 30c0-12 8-20 24-20s24 8 24 20v2H8z" fill={Y} />
        <rect x="8" y="26" width="7" height="22" rx="3.5" fill={Y} />
        <rect x="49" y="26" width="7" height="22" rx="3.5" fill={Y} />
        <rect x="15" y="20" width="34" height="32" rx="10" fill={C} />
        <Face mood={mood} />
      </g>
    </svg>
  )
}

/* Speech-bubble logo mark */
export function LogoMark({ size = 32, style }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} style={style} aria-hidden>
      <g stroke={O} strokeWidth="4" strokeLinecap="round">
        <path d="M46 14 49 4" /><path d="M54 18 61 10" />
      </g>
      {/* bubble */}
      <path d="M8 26c0-9 7-16 16-16h18c9 0 16 7 16 16v10c0 9-7 16-16 16H24l-10 8V50c-4-2-6-7-6-12z" fill={K} />
      {/* yellow side */}
      <rect x="11" y="22" width="5" height="20" rx="2.5" fill={Y} />
      {/* face */}
      <rect x="18" y="17" width="34" height="26" rx="9" fill={C} />
      <rect x="27" y="24" width="5" height="9" rx="2.5" fill={K} />
      <rect x="38" y="24" width="5" height="9" rx="2.5" fill={K} />
      <path d="M30 37q5 3 10 0" stroke={K} strokeWidth="2.4" strokeLinecap="round" fill="none" />
    </svg>
  )
}

/* Full logo: mark + "Aapli BMC" wordmark with orange underline */
export function Logo({ size = 28 }) {
  return (
    <span className="logo" style={{ '--logo-size': `${size}px` }}>
      <LogoMark size={size * 1.25} />
      <span className="wordmark">
        <span className="aapli">Aapli</span><span className="bmc">BMC</span>
        <i />
      </span>
    </span>
  )
}

export { B as BRAND_BLUE, O as BRAND_ORANGE, Y as BRAND_YELLOW }
