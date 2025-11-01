import { useCallback, useEffect, useRef, useState } from 'react';
import {
  UseAgentHandlerChatProps,
  UseAgentHandlerChatResponse,
} from './types';

/**
 * React hook for Agent Handler Chat widget
 * 
 * Clean, simple implementation:
 * - Loads script once on mount
 * - Initializes widget once when script loads
 * - Cleans up on unmount
 * - Config is immutable after mount (as intended)
 * 
 * @param config - Chat configuration (immutable after mount)
 * @returns { open, close, isReady, error }
 */
export const useAgentHandlerChat = (
  config: UseAgentHandlerChatProps
): UseAgentHandlerChatResponse => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initializingRef = useRef(false);

  // Determine CDN URL once at mount
  const cdnUrl = useRef(getCdnUrl(config)).current;

  useEffect(() => {
    // Skip if already initializing or no token provided
    if (initializingRef.current || (!config.authToken && !config.chatToken)) {
      return;
    }

    initializingRef.current = true;

    // Check if script already exists
    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${cdnUrl}"][data-widget="ah-chat"]`
    );

    if (existingScript) {
      // Script already loaded, initialize immediately
      initializeWidget();
      return;
    }

    // Load script
    const script = document.createElement('script');
    script.src = cdnUrl;
    script.setAttribute('data-widget', 'ah-chat');
    script.async = true;

    script.onload = () => {
      initializeWidget();
    };

    script.onerror = () => {
      setError(`Failed to load chat widget from ${cdnUrl}`);
      initializingRef.current = false;
    };

    document.body.appendChild(script);

    function initializeWidget() {
      if (!window.AgentHandlerChat) {
        setError('Chat widget API not available');
        initializingRef.current = false;
        return;
      }

      window.AgentHandlerChat.initialize({
        ...config,
        onReady: () => {
          setIsReady(true);
          config.onReady?.();
        },
      });
    }

    // Cleanup on unmount
    return () => {
      window.AgentHandlerChat?.destroy();
    };
  }, []); // Empty deps - run once on mount

  const open = useCallback(() => {
    window.AgentHandlerChat?.open();
  }, []);

  const close = useCallback(() => {
    window.AgentHandlerChat?.close();
  }, []);

  return { open, close, isReady, error };
};

/**
 * Determines the CDN URL based on config
 */
function getCdnUrl(config: UseAgentHandlerChatProps): string {
  // Priority 1: cdnEnvironment
  if (config.tenantConfig?.cdnEnvironment) {
    return getUrlForEnvironment(config.tenantConfig.cdnEnvironment);
  }

  // Priority 2: environment
  if (config.tenantConfig?.environment) {
    return getUrlForEnvironment(config.tenantConfig.environment);
  }

  // Priority 3: environment variable (build-time)
  if (typeof process !== 'undefined' && process.env?.VITE_CHAT_CDN) {
    const env = process.env.VITE_CHAT_CDN;
    if (env === 'local') return 'http://localhost:3007/initialize.js';
    if (env === 'dev' || env === 'development') return 'https://ah-chat-cdn-develop.merge.dev/initialize.js';
    if (env === 'prod' || env === 'production') return 'https://ah-chat-cdn.merge.dev/initialize.js';
  }

  // Default: production
  return 'https://ah-chat-cdn.merge.dev/initialize.js';
}

function getUrlForEnvironment(env: 'local' | 'development' | 'production'): string {
  switch (env) {
    case 'local':
      return 'http://localhost:3007/initialize.js';
    case 'development':
      return 'https://ah-chat-cdn-develop.merge.dev/initialize.js';
    case 'production':
      return 'https://ah-chat-cdn.merge.dev/initialize.js';
  }
}
