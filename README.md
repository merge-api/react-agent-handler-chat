# react-agent-handler-chat

A React hook wrapper for [Agent Handler Chat](https://github.com/merge-api/agent-handler-chat).

## Overview

This package provides a simple React hook to integrate the Agent Handler Chat widget into your React application. It handles script loading, initialization, and provides a clean React API.

**Design Philosophy**: Config is immutable after mount. The hook loads the script once, initializes once, and cleans up on unmount. This eliminates unnecessary complexity and provides optimal performance.

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
- `authToken` (string, optional): The auth token for authentication (alternative to chatToken)
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

The `examples/` directory contains a test application for development and testing.

```bash
cd examples
npm install
```

**Start the development server:**

```bash
npm run dev
# or
npm run start:local   # Same as dev
npm run start:dev     # Same as dev
npm run start:prod    # Same as dev
```

All commands start the same Vite dev server. The backend and CDN environment is controlled through the UI by selecting:
- **Backend API**: local, development, or production
- **CDN**: local, development, or production

This allows you to test any combination of backend and CDN environments without restarting the server.

**Advanced: Override CDN via tenantConfig**

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
