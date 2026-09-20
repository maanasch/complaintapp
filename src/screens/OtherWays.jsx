import { Screen, TopBar, Option, Mascot } from '../components.jsx'
import { OTHER_WAYS } from '../data.js'

export default function OtherWays() {
  return (
    <Screen>
      <TopBar back title="Other ways" />
      <div className="content">
        <div>
          <h1 className="h1">Prefer another way?</h1>
          <p className="sub" style={{ marginTop: 6 }}>All of these reach the same BMC complaint system and give you the same kind of number.</p>
        </div>
        {OTHER_WAYS.map((w) => (
          <Option key={w.title} icon={w.icon} title={w.title} sub={w.sub} chevron={false} onClick={() => {}} />
        ))}
        <Mascot>Whichever way you use, keep the complaint number. It is how you follow up.</Mascot>
      </div>
    </Screen>
  )
}
