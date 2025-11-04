# @mergeapi/react-agent-handler-chat

A React hook wrapper for Agent Handler Chat widget. For the core module and the main documentation, see [agent-handler-chat](https://github.com/mergeapi/agent-handler-chat).

## Publish

This package is usually only updated when there are breaking changes to the function contract, such as new arguments or return types. Otherwise, the package should remain stable.

1. Make the change
2. Bump the package version in `package.json`
3. Run `npm run build` to build the package
4. Run `npm publish` (Will need to setup credentials through `npm login` or github token)
 - Don't forget to update the package version in the frontend as well

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

### Example with Customization

```tsx
import React from 'react';
import { useAgentHandlerChat } from '@mergeapi/react-agent-handler-chat';

function App() {
  const { openChat, closeChat, isReady } = useAgentHandlerChat({
    authToken: 'your-auth-token',
    parentContainerID: 'chat-container',
    customization: {
      title: 'Customer Support',
      blankState: {
        heading: 'How can we help you today?',
        subtitle: 'Ask us anything about our products and services'
      },
      promptSuggestions: [
        'What are your business hours?',
        'How do I reset my password?',
        'Tell me about pricing'
      ]
    },
    onReady: () => console.log('Chat ready'),
  });

  return (
    <div>
      <h1>Customer Support Chat</h1>
      <div id="chat-container" style={{ width: '400px', height: '600px' }} />
      {isReady && <button onClick={openChat}>Open Chat</button>}
    </div>
  );
}
```

## Configuration Options

### Required
- **`authToken`** (string): Authentication token for backend API calls

### Optional
- **`tenantConfig`** (object): Configuration for custom API base URL
  - **`apiBaseUrl`** (string): Override the default API base URL
- **`useDummyResponse`** (boolean): If true, always returns "You're absolutely right" (default: false)
- **`parentContainerID`** (string): ID of the DOM element to mount the chat widget in
- **`onReady`** (function): Callback when widget is ready
- **`onSuccess`** (function): Callback when a message is successfully sent
- **`onValidationError`** (function): Callback when validation errors occur
- **`customization`** (object): Customize the appearance and behavior of the chat widget
  - **`title`** (string): Title displayed in the header (default: "Playground")
  - **`blankState`** (object): Customize the empty state when no messages exist
    - **`icon`** (React.ReactNode): Custom icon to display (default: Send icon)
    - **`heading`** (string): Main heading text (default: "Start a Conversation")
    - **`subtitle`** (string): Subtitle text (default: "Test your tool packs in a sandbox environment. Type a message below to begin.")
  - **`promptSuggestions`** (string[]): Array of suggested prompts to display as clickable buttons in the blank state
```