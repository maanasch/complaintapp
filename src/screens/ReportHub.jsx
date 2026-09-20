import { useNavigate } from 'react-router-dom'
import { Screen, TopBar, Option, Mascot } from '../components.jsx'
import * as Ic from '../icons.jsx'
import { useStore } from '../store.jsx'

// "Report" tab: splits into My Reports and File a Report (per flow diagram)
export default function ReportHub() {
  const nav = useNavigate()
  const { reports, reset } = useStore()
  const open = reports.filter((r) => r.status !== 'fixed').length

  return (
    <Screen>
      <TopBar brand />
      <div className="content">
        <div>
          <h1 className="h1">Report</h1>
          <p className="sub" style={{ marginTop: 6 }}>File a new complaint or check one you already made.</p>
        </div>

        <Option
          icon={Ic.Plus}
          title="File a report"
          sub="Photo, what and where. Takes about a minute."
          onClick={() => { reset(); nav('/report/new') }}
        />
        <Option
          icon={Ic.List}
          title="My reports"
          sub={open ? `${open} in progress · ${reports.length} total` : `${reports.length} total`}
          tone="green"
          onClick={() => nav('/report/my')}
        />
        <Option
          icon={Ic.Search}
          title="Check a complaint number"
          sub="Got a number from SMS or a poster? Look it up."
          tone="yellow"
          onClick={() => nav('/report/check')}
        />

        <Mascot>
          Anonymous by default. Your name or phone is not needed to file a complaint.
        </Mascot>
      </div>
    </Screen>
  )
}
