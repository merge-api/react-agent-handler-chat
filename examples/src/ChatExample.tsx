import { useEffect, useMemo } from 'react'
import { useAgentHandlerChat } from '@mergeapi/react-agent-handler-chat'

// TODO: Import these from the package once rebuilt
type DisplayMode = 'inline' | 'modal'
type Environment = 'local' | 'development' | 'production'

interface ChatExampleProps {
  displayMode: DisplayMode
  useDummyResponse: boolean
  cdnOption: Environment
  apiOption: Environment
  onBack: () => void
}

function ChatExample({
  displayMode,
  useDummyResponse,
  apiOption,
  cdnOption,
  onBack,
}: ChatExampleProps) {
  // Memoize config to prevent unnecessary re-initializations
  const chatConfig = useMemo(
    () => {
      const config = {
        authToken: 'dummy-auth-token-for-testing',
        displayMode,
        useDummyResponse,
        tenantConfig: {
          environment: apiOption,
          environmentCdn: cdnOption,
        },
        parentContainerID: displayMode === 'inline' ? 'chat-container' : undefined,
      };
      return config;
    },
    [displayMode, useDummyResponse, apiOption, cdnOption]
  )

  // Using dummy token for testing
  const { open, isReady, error } = useAgentHandlerChat(chatConfig)

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
