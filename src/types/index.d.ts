export interface AgentHandlerChat {
  initialize: (config: InitializeProps) => void;
  open: (config?: OpenProps) => void;
  close: () => void;
  destroy: () => void;
}

export interface TenantConfig {
  apiBaseURL?: string;
}

export type DisplayMode = 'modal' | 'inline';

export interface UseAgentHandlerChatProps {
  chatToken?: string | undefined;
  authToken?: string | undefined;
  tenantConfig?: TenantConfig;
  displayMode?: DisplayMode;
  onReady?: () => void;
  onClose?: () => void;
  /**
   * Passing this allows users to target a specific element in their page to embed chat under (eg for modals)
   */
  parentContainerID?: string;
  toolPackId?: string;
  registeredUserId?: string;
  useDummyResponse?: boolean;
}

export interface InitializeProps extends UseAgentHandlerChatProps {
  chatToken?: string;
  authToken?: string;
}

export interface OpenProps {
  chatToken?: string;
}

export type UseAgentHandlerChatResponse = {
  open: () => void;
  close: () => void;
  isReady: boolean;
  error: ErrorEvent | null;
};

declare global {
  interface Window {
    AgentHandlerChat: AgentHandlerChat;
  }
}
