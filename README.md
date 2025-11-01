# @mergeapi/react-agent-handler-chat

A React hook wrapper for Agent Handler Chat widget.

## Installation

```bash
npm install @mergeapi/react-agent-handler-chat
```

## Usage

### Basic Example

```tsx
import React from 'react';
import { useAgentHandlerChat } from '@mergeapi/react-agent-handler-chat';

function App() {
  const { openChat, closeChat, isReady, error } = useAgentHandlerChat({
    authToken: 'your-auth-token',
    useDummyResponse: true,
    parentContainerID: 'chat-container',
    onSuccess: (message) => {
      console.log('Message sent:', message);
    },
    onValidationError: (error) => {
      console.error('Validation error:', error);
    },
    onReady: () => {
      console.log('Chat widget is ready!');
    },
  });

  if (error) {
    return <div>Error loading chat widget: {error.message}</div>;
  }

  return (
    <div>
      <h1>My App with Chat</h1>
      <div id="chat-container" style={{ width: '400px', height: '600px' }} />
      
      {isReady && (
        <div>
          <button onClick={openChat}>Open Chat</button>
          <button onClick={closeChat}>Close Chat</button>
        </div>
      )}
    </div>
  );
}

export default App;
```

### With Custom API Base URL

```tsx
import { useAgentHandlerChat } from '@mergeapi/react-agent-handler-chat';

function App() {
  const { openChat, isReady } = useAgentHandlerChat({
    authToken: 'your-auth-token',
    tenantConfig: {
      apiBaseUrl: 'https://your-custom-api.com/api',
    },
    useDummyResponse: false,
    parentContainerID: 'chat-container',
  });

  return (
    <div>
      <div id="chat-container" style={{ width: '100%', height: '100vh' }} />
    </div>
  );
}
```

## API

### `useAgentHandlerChat(config)`

#### Parameters

- **`authToken`** (string, required): Authentication token for API calls
- **`tenantConfig`** (object, optional): Configuration for custom API
  - `apiBaseUrl` (string): Custom API base URL
- **`useDummyResponse`** (boolean, optional): If true, always returns "You're absolutely right" (default: false)
- **`parentContainerID`** (string, optional): ID of the container element to render the chat widget in
- **`onSuccess`** (function, optional): Callback when a message is successfully sent
  - Parameters: `(message: string) => void`
- **`onValidationError`** (function, optional): Callback when validation errors occur
  - Parameters: `(error: string) => void`
- **`onReady`** (function, optional): Callback when the widget is ready

#### Returns

An object with the following properties:

- **`openChat`** (function): Opens the chat widget
- **`closeChat`** (function): Closes the chat widget
- **`isReady`** (boolean): Whether the widget is ready to use
- **`error`** (ErrorEvent | null): Any error that occurred while loading the widget

## Environment Detection

The hook automatically detects the environment based on the `apiBaseUrl`:

- **Local**: `http://localhost:3007/initialize.js`
- **Develop**: `https://ah-chat-cdn-develop.merge.dev/initialize.js`
- **Production**: `https://ah-chat-cdn.merge.dev/initialize.js`

## TypeScript Support

This package includes TypeScript definitions. All types are exported from the package:

```tsx
import { 
  UseAgentHandlerChatProps, 
  UseAgentHandlerChatResponse,
  TenantConfig 
} from '@mergeapi/react-agent-handler-chat';
```

## Examples

### Embedded Chat Widget

```tsx
function EmbeddedChat() {
  const { isReady } = useAgentHandlerChat({
    authToken: 'token',
    parentContainerID: 'chat-widget',
    useDummyResponse: true,
  });

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ flex: 1 }}>
        <h1>My Content</h1>
      </div>
      <div 
        id="chat-widget" 
        style={{ 
          width: '400px', 
          borderLeft: '1px solid #ccc' 
        }}
      >
        {!isReady && <div>Loading chat...</div>}
      </div>
    </div>
  );
}
```

### Modal Chat Widget

```tsx
function ModalChat() {
  const [showChat, setShowChat] = useState(false);
  
  const { openChat, closeChat, isReady } = useAgentHandlerChat({
    authToken: 'token',
    parentContainerID: 'modal-chat',
  });

  useEffect(() => {
    if (showChat && isReady) {
      openChat();
    }
  }, [showChat, isReady, openChat]);

  return (
    <>
      <button onClick={() => setShowChat(true)}>
        Open Chat
      </button>
      
      {showChat && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => {
            closeChat();
            setShowChat(false);
          }}
        >
          <div 
            id="modal-chat"
            style={{
              width: '600px',
              height: '700px',
              background: 'white',
              borderRadius: '8px',
            }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
```

## License

MIT
