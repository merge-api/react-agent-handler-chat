import { useCallback, useEffect, useRef, useState } from 'react';
import {
  UseAgentHandlerChatProps,
  UseAgentHandlerChatResponse,
} from './types';

/**
 * React hook for Agent Handler Chat widget
 * 
 * Ultra-simple implementation:
 * - Load script once
 * - Initialize once
 * - Clean up on unmount
 * - NO RETRY LOGIC
 * 
 * @param config - Chat configuration (immutable after mount)
 * @returns { open, close, isReady, error }
 */
export const useAgentHandlerChat = (
  config: UseAgentHandlerChatProps
): UseAgentHandlerChatResponse => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasInitialized = useRef(false);

  // Determine CDN URL once at mount
  const cdnUrl = useRef(getCdnUrl(config)).current;

  useEffect(() => {
    // Only run once
    if (hasInitialized.current) {
      return;
    }

    // Require token
    if (!config.authToken) {
      return;
    }

    hasInitialized.current = true;

    // Check if script already loaded
    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${cdnUrl}"]`
    );

    if (existingScript && window.AgentHandlerChat) {
      // Script loaded, API available - just initialize
      initializeWidget();
    } else if (existingScript) {
      // Script tag exists but API not ready yet - wait for it
      existingScript.addEventListener('load', initializeWidget);
    } else {
      // Load script for first time
      const script = document.createElement('script');
      script.src = cdnUrl;
      script.async = true;
      script.onload = initializeWidget;
      script.onerror = () => {
        setError(`Failed to load chat widget from ${cdnUrl}`);
      };
      document.body.appendChild(script);
    }

    function initializeWidget() {
      if (!window.AgentHandlerChat) {
        setError('Chat widget API not available');
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

    // Cleanup
    return () => {
      window.AgentHandlerChat?.destroy();
    };
  }, []); // Empty deps - truly run once

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
