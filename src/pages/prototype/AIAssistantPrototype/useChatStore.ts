/**
 * PROTOTYPE — AI 助手 Zustand Store
 * 管理弹窗状态、会话列表、消息，支持 persist 持久化
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { ChatSession, ChatMessage } from './mockData';
import { mockSessions } from './mockData';

export interface ChatState {
  isOpen: boolean;
  isFullscreen: boolean;
  isSidebarOpen: boolean;
  position: { x: number; y: number };
  sessions: ChatSession[];
  activeSessionId: string | null;

  toggleOpen: () => void;
  toggleFullscreen: () => void;
  toggleSidebar: () => void;
  setPosition: (pos: { x: number; y: number }) => void;
  createSession: () => string;
  setActiveSession: (id: string) => void;
  deleteSession: (id: string) => void;
  pinSession: (id: string) => void;
  unpinSession: (id: string) => void;
  addMessage: (sessionId: string, message: ChatMessage) => void;
  updateSessionTitle: (sessionId: string, title: string) => void;
  removeMessagesAfter: (sessionId: string, msgId: string) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      isOpen: false,
      isFullscreen: false,
      isSidebarOpen: false,
      position: { x: window.innerWidth - 504, y: window.innerHeight - 664 },
      sessions: JSON.parse(JSON.stringify(mockSessions)),
      activeSessionId: mockSessions[0]?.id || null,

      toggleOpen: () => set((s) => ({ isOpen: !s.isOpen })),
      toggleFullscreen: () => set((s) => ({ isFullscreen: !s.isFullscreen })),
      toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),
      setPosition: (position) => set({ position }),

      createSession: () => {
        const id = `s-${Date.now()}`;
        const newSession: ChatSession = {
          id, title: '新会话', pinned: false, createdAt: Date.now(), messages: [],
        };
        set((s) => ({ sessions: [newSession, ...s.sessions], activeSessionId: id }));
        return id;
      },

      setActiveSession: (activeSessionId) => set({ activeSessionId }),

      deleteSession: (id) => set((s) => {
        const filtered = s.sessions.filter((ses) => ses.id !== id);
        const nextId = s.activeSessionId === id ? (filtered[0]?.id || null) : s.activeSessionId;
        return { sessions: filtered, activeSessionId: nextId };
      }),

      pinSession: (id) => set((s) => ({
        sessions: s.sessions.map((ses) => ses.id === id ? { ...ses, pinned: true } : ses),
      })),

      unpinSession: (id) => set((s) => ({
        sessions: s.sessions.map((ses) => ses.id === id ? { ...ses, pinned: false } : ses),
      })),

      addMessage: (sessionId, message) => set((s) => ({
        sessions: s.sessions.map((ses) =>
          ses.id === sessionId
            ? { ...ses, messages: [...ses.messages, message], updatedAt: Date.now() }
            : ses
        ),
      })),

      updateSessionTitle: (sessionId, title) => set((s) => ({
        sessions: s.sessions.map((ses) =>
          ses.id === sessionId ? { ...ses, title: title.slice(0, 20), updatedAt: Date.now() } : ses
        ),
      })),

      removeMessagesAfter: (sessionId, msgId) => set((s) => ({
        sessions: s.sessions.map((ses) => {
          if (ses.id !== sessionId) return ses;
          const idx = ses.messages.findIndex((m) => m.id === msgId);
          return idx === -1 ? ses : { ...ses, messages: ses.messages.slice(0, idx) };
        }),
      })),
    }),
    {
      name: 'ai-assistant-prototype',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        sessions: state.sessions,
        activeSessionId: state.activeSessionId,
        position: state.position,
      }),
    }
  )
);

export const sortedSessions = (sessions: ChatSession[]) =>
  [...sessions].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return b.createdAt - a.createdAt;
  });
