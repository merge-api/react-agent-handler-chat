# React Agent Handler Chat - Example

A simple example demonstrating the `@mergeapi/react-agent-handler-chat` hook.

## Features

- **Dummy response mode**: Always returns "You're absolutely right"
- **Development environment**: Uses `ah-api-develop.merge.dev` backend
- **Simple UI**: Clean interface with open/close chat controls

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the development server

```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000).

## Configuration

The example uses the following configuration:

```javascript
{
  authToken: 'demo-auth-token-12345',
  useDummyResponse: true,
  parentContainerID: 'chat-container',
  tenantConfig: {
    apiBaseUrl: 'https://ah-api-develop.merge.dev/api',
  },
}
```

## Usage

1. Wait for the chat widget to load (status will show "✓ Ready")
2. The chat widget will appear in the container
3. Use the "Open chat" and "Close chat" buttons to control the widget
4. Type any message and receive the dummy response: "You're absolutely right"

## Customization

To use a different environment or configuration, modify the `useAgentHandlerChat` hook parameters in `src/App.js`:

- **Production**: Change `apiBaseUrl` to `https://ah-api.merge.dev/api`
- **Local**: Change `apiBaseUrl` to `http://127.0.0.1:8000/api`
- **Real responses**: Set `useDummyResponse: false`
