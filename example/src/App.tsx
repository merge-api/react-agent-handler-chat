import { useState } from 'react';
import { useAgentHandlerChat } from '@mergeapi/react-agent-handler-chat';
import './App.css';

function App() {
  const [authToken] = useState('dummy-chat-token');

  const { open, close, isReady, error } = useAgentHandlerChat({
    authToken,
    tenantConfig: {
      cdnEnvironment: 'local',
      environment: 'development',
    },
    useDummyResponse: true,
    onReady: () => {
      console.log('Chat widget is ready!');
    },
    onClose: () => {
      console.log('Chat widget closed');
    },
  });

  return (
    <div className="app">
      <div className="card">
        <h1>React Agent Handler Chat Example</h1>
        <p className="subtitle">Simple demo of the useAgentHandlerChat hook</p>

        <div className="status">
          {error ? (
            <div className="status-badge error">Error: {error}</div>
          ) : isReady ? (
            <div className="status-badge ready">✓ Chat Ready</div>
          ) : (
            <div className="status-badge loading">Loading...</div>
          )}
        </div>

        <div className="button-group">
          <button
            onClick={open}
            disabled={!isReady}
            className="button primary"
          >
            Open Chat
          </button>
          <button
            onClick={close}
            disabled={!isReady}
            className="button secondary"
          >
            Close Chat
          </button>
        </div>

        <div className="info">
          <h3>Configuration</h3>
          <ul>
            <li><strong>CDN:</strong> Local (localhost:3007)</li>
            <li><strong>Backend:</strong> Development</li>
            <li><strong>Mode:</strong> Dummy Response</li>
            <li><strong>Port:</strong> 3009</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
