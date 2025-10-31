import { useCallback, useEffect, useState } from 'react';
import {
  InitializeProps,
  UseAgentHandlerChatProps,
  UseAgentHandlerChatResponse,
} from './types';
import useScript from './hooks/useScript';

const isTokenDefined = (
  config: UseAgentHandlerChatProps
): config is InitializeProps => 
  config?.chatToken !== undefined || config?.authToken !== undefined;

/**
 * React hook for Agent Handler Chat widget
 * 
 * Behavior:
 * - Creates iframe on first initialization
 * - Destroys and recreates iframe when config changes (ensures fresh state)
 * - All config properties are considered critical
 * 
 * @param config - Chat configuration
 * @returns { open, close, isReady, error }
 */
export const useAgentHandlerChat = ({
  displayMode = 'modal',
  ...config
}: UseAgentHandlerChatProps): UseAgentHandlerChatResponse => {
  const getCdnUrl = (env: 'local' | 'development' | 'production'): string => {
    switch (env) {
      case 'local':
        return 'http://localhost:3007/initialize.js';
      case 'development':
        return 'https://ah-chat-cdn-develop.merge.dev/initialize.js';
      case 'production':
        return 'https://ah-chat-cdn.merge.dev/initialize.js';
    }
  };

  const initializeSrc = (() => {
    // Priority 1: Use environmentCdn if specified
    if (config?.tenantConfig?.environmentCdn) {
      return getCdnUrl(config.tenantConfig.environmentCdn);
    }
    
    // Priority 2: Use environment if specified
    if (config?.tenantConfig?.environment) {
      return getCdnUrl(config.tenantConfig.environment);
    }
    
    // Priority 3: Allow override via environment variable (useful for build-time testing)
    const envOverride = typeof process !== 'undefined' && process.env?.VITE_CHAT_CDN;
    if (envOverride) {
      switch (envOverride) {
        case 'local':
          return 'http://localhost:3007/initialize.js';
        case 'dev':
        case 'development':
          return 'https://ah-chat-cdn-develop.merge.dev/initialize.js';
        case 'prod':
        case 'production':
          return 'https://ah-chat-cdn.merge.dev/initialize.js';
      }
    }

    // Default: Production
    return 'https://ah-chat-cdn.merge.dev/initialize.js';
  })();

  const [loading, error] = useScript({
    src: initializeSrc,
    checkForExisting: true,
  });
  const [isReady, setIsReady] = useState(false);
  const isServer = typeof window === 'undefined';
  const isReadyForInitialization =
    !isServer &&
    !!window.AgentHandlerChat &&
    !loading &&
    !error &&
    isTokenDefined(config);

  useEffect(() => {
    if (
      isReadyForInitialization &&
      window.AgentHandlerChat &&
      isTokenDefined(config)
    ) {
      window.AgentHandlerChat.initialize({
        ...config,
        displayMode,
        onReady: () => {
          setIsReady(true);
        },
      });
    }

    // Cleanup: Destroy iframe when config changes to ensure fresh state
    return () => {
      if (window.AgentHandlerChat && window.AgentHandlerChat.destroy) {
        window.AgentHandlerChat.destroy();
      }
      setIsReady(false);
    };
  }, [isReadyForInitialization, config, displayMode]);

  const open = useCallback(() => {
    if (window.AgentHandlerChat) {
      window.AgentHandlerChat.open(config);
    }
  }, [config]);

  const close = useCallback(() => {
    if (window.AgentHandlerChat) {
      window.AgentHandlerChat.close();
    }
  }, []);

  return { open, close, isReady, error };
};
