import React from 'react';
import { useAgentHandlerChat } from '@mergeapi/react-agent-handler-chat';
import './App.css';

function App() {
  const { openChat, closeChat, isReady, error } = useAgentHandlerChat({
    authToken: 'demo-auth-token-12345',
    useDummyResponse: true,
    parentContainerID: 'chat-container',
    tenantConfig: {
      apiBaseUrl: 'https://ah-api-develop.merge.dev/api',
    },
    onSuccess: (message) => {
      console.log('✅ Message sent:', message);
    },
    onValidationError: (error) => {
      console.error('❌ Validation error:', error);
    },
    onReady: () => {
      console.log('✅ Chat widget is ready!');
    },
  });

  if (error) {
    return (
      <div className="container">
        <div className="error-card">
          <h2>⚠️ Error loading chat widget</h2>
          <p>{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <header className="header">
        <h1>React Agent Handler Chat</h1>
        <p className="subtitle">Simple example using dummy response mode</p>
      </header>

      <div className="info-card">
        <h2>Configuration</h2>
        <div className="config-details">
          <div className="config-item">
            <strong>Mode/Response:</strong> Dummy response - <code>"You're absolutely right"</code>
          </div>
          <div className="config-item">
            <strong>Environment:</strong> Development (ah-api-develop.merge.dev)
          </div>
          <div className="config-item">
            <strong>Status:</strong>{' '}
            <span className={isReady ? 'status-ready' : 'status-loading'}>
              {isReady ? '✓ Ready' : '⏳ Loading...'}
            </span>
          </div>
        </div>
      </div>

      <div className="chat-section">
        <div className="chat-header">
          <h2>Chat Widget</h2>
          {isReady && (
            <div className="button-group">
              <button onClick={openChat} className="btn btn-primary">
                Open chat
              </button>
              <button onClick={closeChat} className="btn btn-secondary">
                Close chat
              </button>
            </div>
          )}
        </div>
        <div id="chat-container" className="chat-container"></div>
      </div>
    </div>
  );
}

export default App;
