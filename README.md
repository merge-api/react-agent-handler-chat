# @mergeapi/react-agent-handler-chat

A React hook wrapper for Agent Handler Chat widget. For the core module and the main documentation, see [agent-handler-chat](https://github.com/mergeapi/agent-handler-chat).

## Publish

This package is usually only updated when there are breaking changes to the function contract, such as new arguments or return types. Otherwise, the package should remain stable.

1. Make the change
2. Bump the package version in `package.json`
3. Run `npm publish` (Will need to setup credentials through `npm login` or github token)

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