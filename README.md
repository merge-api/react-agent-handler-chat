# react-agent-handler-chat

A React hook wrapper for [Agent Handler Chat](https://github.com/merge-api/agent-handler-chat).

## Overview

This package provides a simple React hook to integrate the Agent Handler Chat widget into your React application. It handles script loading, initialization, and provides a clean React API.

For detailed information about the Agent Handler Chat widget architecture and how this package works, please refer to the [agent-handler-chat README](https://github.com/merge-api/agent-handler-chat).

## Installation

```bash
npm install @mergeapi/react-agent-handler-chat
```

or

```bash
yarn add @mergeapi/react-agent-handler-chat
```

## Usage

### Basic Example (Modal Mode)

```tsx
import { useAgentHandlerChat } from '@mergeapi/react-agent-handler-chat';

function App() {
  const { open, close, isReady } = useAgentHandlerChat({
    chatToken: 'your-chat-token',
    displayMode: 'modal', // default
    onReady: () => {
      console.log('Chat is ready!');
    },
    onClose: () => {
      console.log('Chat closed');
    },
  });

  return (
    <div>
      <button onClick={open} disabled={!isReady}>
        {isReady ? 'Open Chat' : 'Loading...'}
      </button>
      <button onClick={close}>
        Close Chat
      </button>
    </div>
  );
}
```

### Inline Mode Example

```tsx
import { useAgentHandlerChat } from '@mergeapi/react-agent-handler-chat';

function App() {
  const { open, isReady } = useAgentHandlerChat({
    chatToken: 'your-chat-token',
    displayMode: 'inline',
    parentContainerID: 'chat-container',
  });

  return (
    <div>
      <button onClick={open} disabled={!isReady}>
        Load Chat
      </button>
      <div id="chat-container" style={{ height: '600px' }} />
    </div>
  );
}
```

### API Reference

#### `useAgentHandlerChat(config)`

**Parameters:**
- `chatToken` (string, optional): The chat token for authentication
- `displayMode` ('modal' | 'inline', optional): Display mode. Default: 'modal'
- `tenantConfig` (object, optional): Custom tenant configuration
  - `apiBaseURL` (string): Custom API base URL
- `onReady` (function, optional): Callback when chat is ready
- `onClose` (function, optional): Callback when chat is closed
- `parentContainerID` (string, optional): ID of parent container element for inline mode

**Returns:**
- `open` (function): Function to open the chat
- `close` (function): Function to close the chat
- `isReady` (boolean): Whether the chat is ready to be opened
- `error` (ErrorEvent | null): Any error that occurred during initialization

## How It Works

This package dynamically loads the Agent Handler Chat widget from the CDN and provides a React-friendly interface. The widget runs in an iframe and exposes a `window.AgentHandlerChat` API that this hook wraps.

For more details on the architecture and the underlying widget, see the [agent-handler-chat repository](https://github.com/merge-api/agent-handler-chat).

## Related Repositories

- **[agent-handler-chat](https://github.com/merge-api/agent-handler-chat)**: The main Chat widget application (this package wraps it)

## TODO

- [ ] Publish as npm package

## License

MIT
