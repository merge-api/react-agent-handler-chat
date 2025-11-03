import { useCallback, useEffect, useState } from 'react';
import {
  InitializeProps,
  UseAgentHandlerChatProps,
  UseAgentHandlerChatResponse,
} from './types';
import useScript from './hooks/useScript';

export const useAgentHandlerChat = ({
  ...config
}: UseAgentHandlerChatProps): UseAgentHandlerChatResponse => {
  const initializeSrc = (() => {
    const base = config?.tenantConfig?.apiBaseUrl || '';
    // Local dev
    if (/localhost|127\.0\.0\.1/.test(base)) {
      return 'http://localhost:3007/initialize.js';
    }
    // Develop
    if (base.includes('-develop.') || base.includes('ah-api-develop.merge.dev')) {
      return 'https://ah-chat-cdn-develop.merge.dev/initialize.js';
    }
    // Default: Production
    return 'https://ah-chat-cdn.merge.dev/initialize.js';
  })();

  const [loading, error] = useScript({
    src: initializeSrc,
    checkForExisting: true,
    'data-widget': 'ah-chat',
  });
  const [isReady, setIsReady] = useState(false);
  const isServer = typeof window === 'undefined';
  const isReadyForInitialization =
    !isServer &&
    !!window.AgentHandlerChat &&
    !loading &&
    !error &&
    !!config.authToken;

  // Initialize the chat widget when ready
  useEffect(() => {
    console.log('[useAgentHandlerChat] Init effect running, isReadyForInitialization:', isReadyForInitialization);
    if (
      isReadyForInitialization &&
      window.AgentHandlerChat &&
      config.authToken
    ) {
      console.log('[useAgentHandlerChat] Initializing chat widget');
      window.AgentHandlerChat.initialize({
        ...config,
        onReady: () => {
          console.log('[useAgentHandlerChat] Chat widget ready');
          setIsReady(true);
          if (config.onReady) {
            config.onReady();
          }
        },
      });
    }
  }, [isReadyForInitialization, config]);

  // Cleanup: destroy the iframe when component unmounts
  useEffect(() => {
    console.log('[useAgentHandlerChat] Cleanup effect mounted');
    return () => {
      console.log('[useAgentHandlerChat] Cleanup function called - component unmounting');
      if (window.AgentHandlerChat && window.AgentHandlerChat.destroy) {
        console.log('[useAgentHandlerChat] Calling destroy()');
        window.AgentHandlerChat.destroy();
      } else {
        console.log('[useAgentHandlerChat] destroy() not available:', {
          hasAgentHandlerChat: !!window.AgentHandlerChat,
          hasDestroy: !!(window.AgentHandlerChat && window.AgentHandlerChat.destroy)
        });
      }
      setIsReady(false);
    };
  }, []); // Empty deps array ensures cleanup only runs on unmount

  const openChat = useCallback(() => {
    if (window.AgentHandlerChat) {
      window.AgentHandlerChat.openChat();
    }
  }, []);

  const closeChat = useCallback(() => {
    if (window.AgentHandlerChat) {
      window.AgentHandlerChat.closeChat();
    }
  }, []);

  return { openChat, closeChat, isReady, error };
};
