// import { Plugin, PluginID } from '@/types/plugin';

export const getEndpoint = (chatMode: string) => {
 
  if (chatMode === 'chat') {
    return 'api/chat';
  }

  if (chatMode === 'rag') { 
    return 'api/rag-chat';
  }

  return 'api/chat';

};