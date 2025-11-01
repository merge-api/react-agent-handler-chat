# React Agent Handler Chat Example

Simple example demonstrating how to use the `@mergeapi/react-agent-handler-chat` hook.

## Setup

```bash
npm install
```

## Run

```bash
npm run dev
```

The app will run on http://localhost:3009

## Configuration

This example uses:
- **Local CDN**: `http://localhost:3007/initialize.js`
- **Development Backend**: Development environment
- **Dummy Response Mode**: No real backend calls
- **Port**: 3009

## Usage

The example shows:
1. How to import and use the `useAgentHandlerChat` hook
2. How to configure CDN and backend environments
3. How to handle ready state and errors
4. How to open/close the chat widget
5. How to use callbacks (onReady, onClose)

## Code

Check `src/App.tsx` for the implementation. It's intentionally simple to demonstrate the core functionality.
