import { useNavigate } from 'react-router-dom'
import { Screen, TopBar, Option, Mascot } from '../components.jsx'
import * as Ic from '../icons.jsx'
import { useStore } from '../store.jsx'
import { useT } from '../i18n.jsx'

// "Report" tab: splits into My Reports and File a Report (per flow diagram)
export default function ReportHub() {
  const nav = useNavigate()
  const t = useT()
  const { reports, reset } = useStore()
  const open = reports.filter((r) => r.status !== 'fixed').length

  return (
    <Screen>
      <TopBar brand />
      <div className="content">
        <div>
          <h1 className="h1">{t('hubTitle')}</h1>
          <p className="sub" style={{ marginTop: 6 }}>{t('hubSub')}</p>
        </div>

        <Option
          icon={Ic.Plus}
          title={t('fileReport')}
          sub={t('hubFileSub')}
          onClick={() => { reset(); nav('/report/new') }}
        />
        <Option
          icon={Ic.Chat}
          title={t('fileViaChat')}
          sub={t('fileViaChatSub')}
          tone="orange"
          onClick={() => nav('/report/new/chat')}
        />
        <Option
          icon={Ic.List}
          title={t('myReports')}
          sub={open ? `${open} ${t('inProgress').toLowerCase()} · ${reports.length} ${t('total')}` : `${reports.length} ${t('total')}`}
          tone="green"
          onClick={() => nav('/report/my')}
        />
        <Option
          icon={Ic.Search}
          title={t('checkNumber')}
          sub={t('hubCheckSub')}
          tone="yellow"
          onClick={() => nav('/report/check')}
        />

        <Mascot>{t('hubAnon')}</Mascot>
      </div>
    </Screen>
  )
}
