import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { StoreProvider } from './store.jsx'
import { LangProvider } from './i18n.jsx'
import { TabBar } from './components.jsx'
import Home from './screens/Home.jsx'
import ReportHub from './screens/ReportHub.jsx'
import { MyReports, ReportDetail, EscalateComplaint, CheckStatus } from './screens/MyReports.jsx'
import { AroundMe, AroundDetail } from './screens/Around.jsx'
import { StepPhoto, StepWhat, StepWhere, StepReview, StepDone } from './screens/FileReport.jsx'
import OtherWays from './screens/OtherWays.jsx'

// Tab bar is hidden inside the step-by-step filing flow and the escalation flow
// so the primary CTA in each stays reachable and isn't covered by the tab bar
const HIDE_TABS = /^\/report\/new\/(photo|what|where|review|done)|^\/report\/my\/[^/]+\/escalate$/

export default function App() {
  const { pathname } = useLocation()
  const showTabs = !HIDE_TABS.test(pathname)

  return (
    <LangProvider>
    <StoreProvider>
      <div className="frame">
        <div className="device">
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/report" element={<ReportHub />} />
            <Route path="/report/my" element={<MyReports />} />
            <Route path="/report/my/:id" element={<ReportDetail />} />
            <Route path="/report/my/:id/escalate" element={<EscalateComplaint />} />
            <Route path="/report/check" element={<CheckStatus />} />

            <Route path="/report/new" element={<Navigate to="/report/new/photo" replace />} />
            <Route path="/report/new/photo" element={<StepPhoto />} />
            <Route path="/report/new/what" element={<StepWhat />} />
            <Route path="/report/new/where" element={<StepWhere />} />
            <Route path="/report/new/review" element={<StepReview />} />
            <Route path="/report/new/done" element={<StepDone />} />

            <Route path="/around" element={<AroundMe />} />
            <Route path="/around/:id" element={<AroundDetail />} />

            <Route path="/other-ways" element={<OtherWays />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          {showTabs && <TabBar />}
        </div>
      </div>
    </StoreProvider>
    </LangProvider>
  )
}
