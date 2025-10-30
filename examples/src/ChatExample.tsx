import { useEffect } from 'react'
import { useAgentHandlerChat } from '@mergeapi/react-agent-handler-chat'

type DisplayMode = 'inline' | 'modal'
type CDNOption = 'local' | 'dev' | 'prod'
type APIOption = 'local' | 'dev' | 'prod'

interface ChatExampleProps {
  displayMode: DisplayMode
  useDummyResponse: boolean
  cdnOption: CDNOption
  apiOption: APIOption
  onBack: () => void
}

const getApiBaseURL = (apiOption: APIOption): string => {
  switch (apiOption) {
    case 'local':
      return 'http://localhost:8000'
    case 'dev':
      return 'https://ah-api-develop.merge.dev'
    case 'prod':
      return 'https://ah-api.merge.dev'
  }
}

function ChatExample({
  displayMode,
  useDummyResponse,
  apiOption,
  onBack,
}: ChatExampleProps) {
  const apiBaseURL = getApiBaseURL(apiOption)

  // Using dummy token for testing
  const { open, isReady, error } = useAgentHandlerChat({
    authToken: 'dummy-auth-token-for-testing',
    displayMode,
    useDummyResponse,
    tenantConfig: {
      apiBaseURL,
    },
    parentContainerID: displayMode === 'inline' ? 'chat-container' : undefined,
  })

  useEffect(() => {
    if (isReady && displayMode === 'modal') {
      open()
    }
  }, [isReady, displayMode, open])

  if (error) {
    return (
      <div className="container">
        <div className="error-container">
          <h2>Error Loading Chat</h2>
          <p>{error.message}</p>
          <button className="test-button" onClick={onBack}>
            Back to Configuration
          </button>
        </div>
      </div>
    )
  }

  if (displayMode === 'modal') {
    return (
      <div className="container">
        <div className="modal-info">
          <h2>Modal Chat Active</h2>
          <p>The chat widget should open in a modal overlay.</p>
          <button className="test-button" onClick={onBack}>
            Back to Configuration
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="chat-header">
        <h2>Inline Chat Example</h2>
        <button className="back-button" onClick={onBack}>
          ← Back to Configuration
        </button>
      </div>
      <div id="chat-container" className="chat-container">
        {!isReady && <p>Loading chat...</p>}
      </div>
    </div>
  )
}

export default ChatExample
