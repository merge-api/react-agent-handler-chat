# react-agent-handler-chat

A React hook wrapper for [Agent Handler Chat](https://github.com/merge-api/agent-handler-chat).

## Overview

This package provides a simple React hook to integrate the Agent Handler Chat widget into your React application. It handles script loading, initialization, and provides a clean React API.

**Design Philosophy**: Ultra-simple, no retry logic. The hook:
1. Loads the script once
2. Initializes once
3. Cleans up on unmount
4. Config is immutable after mount

This eliminates complexity, prevents infinite loops, and provides optimal performance.

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
    authToken: 'your-chat-token',
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
    authToken: 'your-chat-token',
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
- `authToken` (string, optional): The auth token for authentication
- `displayMode` ('modal' | 'inline', optional): Display mode. Default: 'modal'
- `tenantConfig` (object, optional): Environment configuration
  - `environment` ('local' | 'development' | 'production', optional): Backend API and CDN environment
  - `cdnEnvironment` ('local' | 'development' | 'production', optional): Override CDN environment separately
- `onReady` (function, optional): Callback when chat is ready
- `onClose` (function, optional): Callback when chat is closed
- `parentContainerID` (string, optional): ID of parent container element for inline mode
- `toolPackId` (string, optional): Tool pack UUID
- `registeredUserId` (string, optional): Registered user UUID
- `useDummyResponse` (boolean, optional): Enable dummy mode for testing

**Returns:**
- `open` (function): Function to open the chat
- `close` (function): Function to close the chat
- `isReady` (boolean): Whether the chat is ready to be opened
- `error` (string | null): Error message if initialization failed

**Important Notes:**
- Config should not change after mount (use `useMemo` to stabilize config objects)
- If you need to change config, unmount and remount the component
- The hook loads the script once and initializes once for optimal performance

## How It Works

This package dynamically loads the Agent Handler Chat widget from the CDN and provides a React-friendly interface. The widget runs in an iframe and exposes a `window.AgentHandlerChat` API that this hook wraps.

For more details on the architecture and the underlying widget, see the [agent-handler-chat repository](https://github.com/merge-api/agent-handler-chat).

## Development

### Running the Example App

The `example/` directory contains a React application demonstrating how to use the hook.

```bash
cd example
npm install
```

**Available Commands:**

```bash
# Local CDN + Local backend
npm start:local

# Local CDN + Dev backend (useful for testing local CDN changes against dev API)
npm start:local-cdn-against-dev

# Dev CDN + Dev backend
npm start:dev

# Prod CDN + Prod backend
npm start:prod
```

All commands run on port `3009`. The example uses environment variables to control which CDN and backend to use:
- `REACT_APP_MERGE_ENV`: Controls the backend environment (`local`, `development`, `production`)
- `REACT_APP_USE_LOCAL_CDN`: When `true`, uses local CDN regardless of `REACT_APP_MERGE_ENV`

**Environment Configuration in Code:**

You can also programmatically control the environment in your code:

```tsx
const { open } = useAgentHandlerChat({
  authToken: 'your-token',
  tenantConfig: {
    environment: 'production',      // Backend API environment
    cdnEnvironment: 'local'          // Override CDN to use local (useful for testing)
  }
});
```

If `cdnEnvironment` is not specified, it defaults to the same value as `environment`.

## Related Repositories

- **[agent-handler-chat](https://github.com/merge-api/agent-handler-chat)**: The main Chat widget application (this package wraps it)

## License

MIT
