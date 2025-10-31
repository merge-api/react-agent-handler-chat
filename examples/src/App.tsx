import { useState } from 'react'
import ChatExample from './ChatExample'
import './App.css'

type DisplayMode = 'inline' | 'modal'
type Environment = 'local' | 'development' | 'production'

function App() {
  const [showChat, setShowChat] = useState(false)
  const [displayMode, setDisplayMode] = useState<DisplayMode>('inline')
  const [useDummyResponse, setUseDummyResponse] = useState(false)
  const [cdnOption, setCdnOption] = useState<Environment>('development')
  const [apiOption, setApiOption] = useState<Environment>('development')

  const handleGoClick = () => {
    setShowChat(true)
  }

  const handleBackClick = () => {
    setShowChat(false)
  }

  if (showChat) {
    return (
      <ChatExample
        displayMode={displayMode}
        useDummyResponse={useDummyResponse}
        cdnOption={cdnOption}
        apiOption={apiOption}
        onBack={handleBackClick}
      />
    )
  }

  return (
    <div className="container">
      <h1>🤖 Agent Handler Chat Test</h1>
      <p className="subtitle">Configure and test the chat widget</p>

      <div className="config-section">
        <h3>Display Mode</h3>
        <div className="radio-group">
          <label className="radio-option">
            <input
              type="radio"
              name="mode"
              value="inline"
              checked={displayMode === 'inline'}
              onChange={(e) => setDisplayMode(e.target.value as DisplayMode)}
            />
            <span>Inline - Embedded in container</span>
          </label>
          <label className="radio-option">
            <input
              type="radio"
              name="mode"
              value="modal"
              checked={displayMode === 'modal'}
              onChange={(e) => setDisplayMode(e.target.value as DisplayMode)}
            />
            <span>Modal - Full-screen overlay</span>
          </label>
        </div>
      </div>

      <div className="config-section">
        <h3>Response Mode</h3>
        <div className="radio-group">
          <label className="radio-option">
            <input
              type="radio"
              name="dummy"
              value="false"
              checked={!useDummyResponse}
              onChange={() => setUseDummyResponse(false)}
            />
            <span>Real - Connect to backend API</span>
          </label>
          <label className="radio-option">
            <input
              type="radio"
              name="dummy"
              value="true"
              checked={useDummyResponse}
              onChange={() => setUseDummyResponse(true)}
            />
            <span>Dummy - Test mode (responds "You're absolutely right!")</span>
          </label>
        </div>
      </div>

      <div className="config-section">
        <h3>Chat Widget CDN</h3>
        <div className="radio-group">
          <label className="radio-option">
            <input
              type="radio"
              name="cdn"
              value="local"
              checked={cdnOption === 'local'}
              onChange={(e) => setCdnOption(e.target.value as Environment)}
            />
            <span>Local - http://localhost:3007</span>
          </label>
          <label className="radio-option">
            <input
              type="radio"
              name="cdn"
              value="development"
              checked={cdnOption === 'development'}
              onChange={(e) => setCdnOption(e.target.value as Environment)}
            />
            <span>Dev - https://ah-chat-cdn-develop.merge.dev</span>
          </label>
          <label className="radio-option">
            <input
              type="radio"
              name="cdn"
              value="production"
              checked={cdnOption === 'production'}
              onChange={(e) => setCdnOption(e.target.value as Environment)}
            />
            <span>Prod - https://ah-chat-cdn.merge.dev</span>
          </label>
        </div>
      </div>

      <div className="config-section">
        <h3>Backend API</h3>
        <div className="radio-group">
          <label className="radio-option">
            <input
              type="radio"
              name="api"
              value="local"
              checked={apiOption === 'local'}
              onChange={(e) => setApiOption(e.target.value as Environment)}
            />
            <span>Local - http://localhost:8000</span>
          </label>
          <label className="radio-option">
            <input
              type="radio"
              name="api"
              value="development"
              checked={apiOption === 'development'}
              onChange={(e) => setApiOption(e.target.value as Environment)}
            />
            <span>Dev - https://ah-api-develop.merge.dev</span>
          </label>
          <label className="radio-option">
            <input
              type="radio"
              name="api"
              value="production"
              checked={apiOption === 'production'}
              onChange={(e) => setApiOption(e.target.value as Environment)}
            />
            <span>Prod - https://ah-api.merge.dev</span>
          </label>
        </div>
      </div>

      <button className="test-button" onClick={handleGoClick}>
        Go
      </button>
    </div>
  )
}

export default App
