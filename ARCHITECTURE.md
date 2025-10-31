# Agent Handler Chat Architecture Documentation

> **Last Updated**: 2025-10-31

## Table of Contents
1. [High-Level Overview](#high-level-overview)
2. [agent-handler-chat: The Core Widget](#agent-handler-chat-the-core-widget)
3. [Build Process & Output](#build-process--output)
4. [react-agent-handler-chat: The React Wrapper](#react-agent-handler-chat-the-react-wrapper)
5. [Integration Guide](#integration-guide)
6. [Loading Sequence & Lifecycle](#loading-sequence--lifecycle)

---

## High-Level Overview

The Agent Handler Chat system consists of **two separate packages** that work together to provide an embeddable chat widget:

### 1. **agent-handler-chat** (Standalone Widget)
- **Type**: Vanilla JavaScript/TypeScript application
- **Purpose**: The actual chat UI that runs in an iframe
- **Distribution**: Deployed to CDN as static files (`initialize.js`, `internal_root.js`, `index.html`)
- **Technology**: React app bundled with Webpack
- **Can be used**: Directly via `<script>` tag in any web application

### 2. **react-agent-handler-chat** (React Hook Wrapper)
- **Type**: NPM package providing a React hook
- **Purpose**: Simplifies integration for React applications
- **Distribution**: Published to NPM as `@mergeapi/react-agent-handler-chat`
- **Technology**: TypeScript hook using Rollup for bundling
- **Wraps**: The `window.AgentHandlerChat` API exposed by agent-handler-chat

### The Relationship

```
┌─────────────────────────────────────────────────────────────┐
│                    Web Application                          │
│  ┌───────────────────────────────────────────────────────┐  │
│  │         react-agent-handler-chat (React Hook)         │  │
│  │  - Loads initialize.js from CDN                       │  │
│  │  - Manages lifecycle & configuration                  │  │
│  │  - Provides React-friendly API                        │  │
│  └─────────────────────┬─────────────────────────────────┘  │
│                        │ Loads & Controls                   │
│                        ▼                                     │
│  ┌───────────────────────────────────────────────────────┐  │
│  │    window.AgentHandlerChat (Global API)              │  │
│  │    Exposed by initialize.js from CDN                  │  │
│  └─────────────────────┬─────────────────────────────────┘  │
│                        │ Creates & Manages                  │
│                        ▼                                     │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              <iframe> Element                         │  │
│  │  src: https://ah-chat-cdn.merge.dev/index.html       │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │  agent-handler-chat (Chat UI)                   │  │  │
│  │  │  - Full React chat interface                    │  │  │
│  │  │  - Communicates via postMessage                 │  │  │
│  │  │  - Makes API calls to backend                   │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## agent-handler-chat: The Core Widget

### Architecture

The widget uses an **iframe-based architecture** with two distinct entry points:

1. **initialize.js** - The loader script (parent window)
2. **internal_root.js** - The chat UI (inside iframe)

### Core Files & Their Roles

#### 1. `src/initialize/initialize.tsx` → `dist/initialize.js`
**Role**: Parent window controller - Creates and manages the iframe

**Key Responsibilities**:
- Exposes `window.AgentHandlerChat` global API
- Creates and injects iframe into the DOM
- Manages iframe lifecycle (create, destroy)
- Handles communication with iframe via `postMessage`
- Maintains state (auth token, display mode, configuration)

**Key Functions**:
```typescript
window.AgentHandlerChat = {
  initialize(config)  // Create iframe, set up config
  open(config?)       // Show chat (modal) or send config (inline)
  close()             // Hide chat (modal) or clear state
  destroy()           // Remove iframe from DOM completely
}
```

**State Management**:
```typescript
const state = {
  isChatOpen: boolean           // Is chat currently open?
  isIFrameCreated: boolean      // Has iframe been created?
  isIFrameReady: boolean        // Has iframe loaded and signaled ready?
  authToken: string             // Authentication token
  displayMode: "inline" | "modal"  // How to display chat
  tenantConfig: TenantConfig    // Environment configuration
  toolPackId?: string           // Which tool pack to use
  registeredUserId?: string     // Which registered user
  useDummyResponse?: boolean    // Testing mode
}
```

#### 2. `src/initialize/utils.ts`
**Role**: Helper utilities for iframe management

**Key Functions**:
- `getIFrame()` - Get iframe element by ID
- `getAgentHandlerChatURL()` - Determine iframe src URL based on build-time environment variables
- Uses `REACT_APP_MERGE_ENV` (production/develop/local) and `REACT_APP_USE_LOCAL_CDN` to select CDN URL

#### 3. `src/chat/App.tsx` → Part of `dist/internal_root.js`
**Role**: Root component inside the iframe

**Key Responsibilities**:
- Listens for `postMessage` from parent window
- Receives configuration (auth token, API URL, etc.)
- Signals ready state to parent: `postMessage({ messageType: "CHAT_READY" })`
- Manages chat open/close state
- Renders `ChatInterface` component

**Message Protocol**:
```typescript
// Parent → Iframe
{ messageType: "SEND_INFO_TO_IFRAME", authToken, apiBaseURL, ... }
{ messageType: "CLOSE_CHAT" }

// Iframe → Parent
{ messageType: "CHAT_READY" }
{ messageType: "CLOSE_CHAT" }
```

#### 4. `src/chat/components/ChatInterface.tsx`
**Role**: The actual chat UI implementation

**Key Features**:
- Creates chat session via API: `POST /api/chat/sessions/`
- Sends messages and streams responses via Server-Sent Events (SSE)
- Manages message history
- Handles loading states and errors
- Supports both real API calls and dummy mode (for testing)

**API Integration**:
```typescript
// Create session
POST ${apiBaseURL}/chat/sessions/
Body: { tool_pack: toolPackId, registered_user: registeredUserId }
Response: { id: string, stream_token: string }

// Stream messages
GET ${apiBaseURL}/chat/sessions/${sessionId}/send/
Query: ?userText=...&stream_token=...
Response: SSE stream with text chunks
```

---

## Build Process & Output

### Build Command
```bash
npm run build  # Runs: webpack
```

### Webpack Configuration (`webpack.config.js`)

**Entry Points**:
```javascript
entry: {
  initialize: "./src/initialize/initialize.tsx",  // Parent window script
  internal_root: "./src/chat/index.tsx",          // Iframe application
}
```

**Output**:
```javascript
output: {
  filename: "[name].js",      // Creates initialize.js & internal_root.js
  path: __dirname + "/dist",
  iife: true,                 // Wrap in IIFE for isolation
}
```

### Generated Files in `dist/`

| File | Size | Purpose |
|------|------|---------|
| `initialize.js` | ~8.6 KB | Parent window loader script |
| `initialize.js.map` | ~35 KB | Source map for debugging |
| `internal_root.js` | ~344 KB | Complete chat UI (React + dependencies) |
| `internal_root.js.map` | ~946 KB | Source map for debugging |
| `internal_root.js.LICENSE.txt` | ~1.8 KB | Third-party licenses |
| `index.html` | ~242 bytes | Iframe HTML shell |
| `_headers` | ~239 bytes | CDN headers configuration |

### Deployment

These files are deployed to a CDN with environment-specific URLs:

- **Production**: `https://ah-chat-cdn.merge.dev/`
- **Development**: `https://ah-chat-cdn-develop.merge.dev/`
- **Local**: `http://localhost:3007/`

---

## react-agent-handler-chat: The React Wrapper

### Purpose

Provides a **React hook** that abstracts away the complexity of:
1. Loading the `initialize.js` script from CDN
2. Managing the `window.AgentHandlerChat` lifecycle
3. Handling configuration changes
4. Providing React-friendly API

### Core Files & Their Roles

#### 1. `src/useAgentHandlerChat.tsx`
**Role**: Main React hook implementation

**Key Responsibilities**:
- Loads `initialize.js` script using `useScript` hook
- Determines correct CDN URL based on configuration
- Calls `window.AgentHandlerChat.initialize()` when ready
- Manages iframe lifecycle (destroys on config changes)
- Provides `open()`, `close()`, `isReady`, `error` to consumer

**Hook Signature**:
```typescript
const { open, close, isReady, error } = useAgentHandlerChat({
  authToken: string,
  displayMode?: 'modal' | 'inline',
  tenantConfig?: {
    environment?: 'local' | 'development' | 'production',
    cdnEnvironment?: 'local' | 'development' | 'production',
  },
  parentContainerID?: string,
  toolPackId?: string,
  registeredUserId?: string,
  useDummyResponse?: boolean,
  onReady?: () => void,
  onClose?: () => void,
})
```

**CDN URL Resolution Priority**:
1. `tenantConfig.cdnEnvironment` (if specified)
2. `tenantConfig.environment` (if specified)
3. `process.env.VITE_CHAT_CDN` (build-time override)
4. Default: Production CDN

**Lifecycle Management**:
```typescript
useEffect(() => {
  // Initialize when ready
  if (isReadyForInitialization) {
    window.AgentHandlerChat.initialize({ ...config, displayMode, onReady })
  }
  
  // Cleanup: Destroy iframe on unmount or config change
  return () => {
    window.AgentHandlerChat?.destroy()
    setIsReady(false)
  }
}, [isReadyForInitialization, config, displayMode])
```

#### 2. `src/hooks/useScript.tsx`
**Role**: Generic hook for loading external scripts

**Key Features**:
- Loads script by creating `<script>` tag
- Tracks loading state and errors
- Caches script status globally to avoid duplicates
- Checks for existing scripts with `data-widget` attribute
- Cleans up properly on unmount

**Why custom implementation?**
- Existing `react-script-hook` package had edge case bugs
- Needed better handling of loading/unmounting interaction
- Added support for `data-widget` attribute matching

**Usage**:
```typescript
const [loading, error] = useScript({
  src: 'https://ah-chat-cdn.merge.dev/initialize.js',
  checkForExisting: true,
  'data-widget': 'ah-chat',
})
```

### Build Process

#### Build Command
```bash
npm run build  # Runs: rollup -c
```

#### Rollup Configuration (`rollup.config.js`)

**Output Formats**:
```javascript
output: [
  {
    file: 'dist/index.esm.js',    // ES Module format
    format: 'esm',
  },
  {
    file: 'dist/index.umd.js',    // UMD format (browser)
    format: 'umd',
    name: 'ReactAgentHandlerChat',
  },
]
```

**External Dependencies**:
```javascript
external: ['react', 'react-dom']  // Peer dependencies, not bundled
```

---

## Integration Guide

### Using the React Hook (Recommended for React Apps)

#### Installation
```bash
npm install @mergeapi/react-agent-handler-chat
```

#### Basic Usage (Modal Mode)
```tsx
import { useAgentHandlerChat } from '@mergeapi/react-agent-handler-chat'

function MyComponent() {
  const { open, close, isReady, error } = useAgentHandlerChat({
    authToken: 'your-auth-token',
    displayMode: 'modal',
    tenantConfig: {
      environment: 'production',
    },
  })

  if (error) {
    return <div>Error loading chat: {error.message}</div>
  }

  return (
    <div>
      <button onClick={open} disabled={!isReady}>
        {isReady ? 'Open Chat' : 'Loading...'}
      </button>
    </div>
  )
}
```

#### Advanced Usage (Inline Mode)
```tsx
import { useAgentHandlerChat } from '@mergeapi/react-agent-handler-chat'
import { useMemo } from 'react'

function ChatPage() {
  // Memoize config to prevent unnecessary re-initializations
  const chatConfig = useMemo(() => ({
    authToken: 'your-auth-token',
    displayMode: 'inline' as const,
    parentContainerID: 'chat-container',
    toolPackId: 'your-tool-pack-id',
    registeredUserId: 'your-registered-user-id',
    tenantConfig: {
      environment: 'production' as const,
    },
  }), [])

  const { isReady } = useAgentHandlerChat(chatConfig)

  return (
    <div>
      <div 
        id="chat-container" 
        style={{ height: '600px', width: '100%' }}
      >
        {!isReady && <p>Loading chat...</p>}
      </div>
    </div>
  )
}
```

---

## Loading Sequence & Lifecycle

### Complete Loading Flow

```
1. Application Loads
   - React app renders
   - useAgentHandlerChat hook is called
   ↓
2. useScript Hook Loads initialize.js
   - Checks for existing script with data-widget="ah-chat"
   - Creates <script> tag if not found
   - URL: https://ah-chat-cdn.merge.dev/initialize.js
   ↓
3. initialize.js Executes
   - Exposes window.AgentHandlerChat API
   - Sets up message listener
   ↓
4. useAgentHandlerChat Calls initialize()
   - Passes config (authToken, displayMode, etc.)
   ↓
5. initialize() Creates Iframe
   - Creates <iframe> element
   - Sets src to CDN URL (auto-detected)
   - Appends to parentContainerID or document.body
   ↓
6. Iframe Loads index.html
   - HTML shell loads internal_root.js
   - React app initializes inside iframe
   ↓
7. Chat App Signals Ready
   - Sends: postMessage({ messageType: "CHAT_READY" })
   ↓
8. initialize.js Receives Ready Signal
   - Sets state.isIFrameReady = true
   - Calls config.onReady() callback
   - Sends config to iframe via postMessage
   ↓
9. Iframe Receives Config
   - Extracts: authToken, apiBaseURL, displayMode, etc.
   - Renders ChatInterface with config
   ↓
10. ChatInterface Creates Session
    - POST /api/chat/sessions/
    - Receives: { id, stream_token }
    - Ready to send messages!
```

### Communication Protocol

```
Parent Window (initialize.js) ←→ Iframe (App.tsx)

Parent → Iframe:
  SEND_INFO_TO_IFRAME: {
    authToken, apiBaseURL, isChatOpen, displayMode,
    toolPackId, registeredUserId, useDummyResponse
  }
  CLOSE_CHAT: { messageType: "CLOSE_CHAT" }

Iframe → Parent:
  CHAT_READY: { messageType: "CHAT_READY" }
  CLOSE_CHAT: { messageType: "CLOSE_CHAT" }
```

---

## Key Design Decisions

### 1. Why Iframe Architecture?

**Pros**:
- Complete CSS/JS isolation from parent application
- Sandboxed execution environment
- Independent deployment
- CDN caching

**Cons**:
- Communication overhead via postMessage
- Additional network requests
- More complexity

**Decision**: Pros outweigh cons for a widget that needs to work across many different applications.

### 2. Why Two Separate Packages?

**agent-handler-chat**: Can be used by any web application (React, Vue, vanilla JS)

**react-agent-handler-chat**: Provides React-friendly API with automatic lifecycle management

**Decision**: Separation of concerns - core widget vs. framework-specific wrapper.

### 3. Why Destroy Iframe on Config Change?

**Alternative**: Update iframe state via postMessage

**Chosen approach**: Destroy and recreate

**Reasoning**: Simpler implementation, guarantees fresh state, prevents edge cases with stale data.
