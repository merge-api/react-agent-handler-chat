export interface AgentHandlerChat {
  initialize: (config: InitializeProps) => void;
  openChat: () => void;
  closeChat: () => void;
  destroy: () => void;
}

export interface TenantConfig {
  apiBaseUrl?: string;
}

export interface Customization {
  title?: string;
  blankState?: {
    icon?: React.ReactNode;
    heading?: string;
    subtitle?: string;
  };
  promptSuggestions?: string[];
  initialToolPackId?: string;
}

export interface UseAgentHandlerChatProps {
  authToken: string;
  tenantConfig?: TenantConfig;
  useDummyResponse?: boolean;
  parentContainerID?: string;
  onValidationError?: (error: string) => void;
  onSuccess?: (message: string) => void;
  onReady?: () => void;
  customization?: Customization;
}

export interface InitializeProps extends UseAgentHandlerChatProps {
  authToken: string;
}

export type UseAgentHandlerChatResponse = {
  openChat: () => void;
  closeChat: () => void;
  isReady: boolean;
  error: ErrorEvent | null;
};

declare global {
  interface Window {
    AgentHandlerChat: AgentHandlerChat;
  }
}
