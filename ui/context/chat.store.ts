import { create } from 'zustand';

type ChatStore = {
    chatMode: string
    setChatMode: (chatMode: string) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
    chatMode: 'chat',
    setChatMode: (chatMode: string) => set(() => ({ chatMode }))
    
}))