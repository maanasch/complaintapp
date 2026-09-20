import { Screen, TopBar, Option, Mascot } from '../components.jsx'
import { OTHER_WAYS } from '../data.js'
import { useT } from '../i18n.jsx'

export default function OtherWays() {
  const t = useT()
  return (
    <Screen>
      <TopBar back title={t('otherTitle')} />
      <div className="content">
        <div>
          <h1 className="h1">{t('otherH')}</h1>
          <p className="sub" style={{ marginTop: 6 }}>{t('otherSub')}</p>
        </div>
        {OTHER_WAYS.map((w, i) => (
          <Option
            key={i}
            icon={w.icon}
            title={w.titleKey ? t(w.titleKey) : w.title}
            sub={w.subKey ? t(w.subKey) : w.sub}
            chevron={false}
            onClick={() => {}}
          />
        ))}
        <Mascot>{t('otherTip')}</Mascot>
      </div>
    </Screen>
  )
}
