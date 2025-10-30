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

export const useAgentHandlerChat = ({
  displayMode = 'modal',
  ...config
}: UseAgentHandlerChatProps): UseAgentHandlerChatResponse => {
  const initializeSrc = (() => {
    const base = config?.tenantConfig?.apiBaseURL || '';
    // Local dev
    if (/localhost|127\.0\.0\.1/.test(base)) {
      return 'http://localhost:3007/chat.js';
    }
    // Develop
    if (base.includes('-develop.') || base.includes('ah-api-develop.merge.dev')) {
      return 'https://ah-cdn-develop.merge.dev/chat.js';
    }
    // Default: Production
    return 'https://ah-cdn.merge.dev/chat.js';
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
        onReady: () => setIsReady(true),
      });
    }
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
