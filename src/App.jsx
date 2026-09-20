import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { StoreProvider } from './store.jsx'
import { LangProvider } from './i18n.jsx'
import { TabBar } from './components.jsx'
import Home from './screens/Home.jsx'
import ReportHub from './screens/ReportHub.jsx'
import { MyReports, ReportDetail, CheckStatus } from './screens/MyReports.jsx'
import { AroundMe, AroundDetail } from './screens/Around.jsx'
import { FileStart, StepPhoto, StepWhat, StepWhere, StepReview, StepDone } from './screens/FileReport.jsx'
import SayIt from './screens/SayIt.jsx'
import OtherWays from './screens/OtherWays.jsx'

// Tab bar is hidden inside the step-by-step filing flow so the CTA stays in reach
const HIDE_TABS = /^\/report\/new\/(say|photo|what|where|review|done)/

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
            <Route path="/report/check" element={<CheckStatus />} />

            <Route path="/report/new" element={<FileStart />} />
            <Route path="/report/new/say" element={<SayIt />} />
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
