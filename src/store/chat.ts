/**
 * AI 助手 — Zustand Store
 * 管理弹窗状态、会话列表、消息，支持 persist 持久化
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { ChatSession, ChatMessage } from '@/components/AIAssistant/types';
import { mockSessions } from '@/components/AIAssistant/mockData';

export interface ChatState {
  isOpen: boolean;
  isFullscreen: boolean;
  isSidebarOpen: boolean;
  position: { x: number; y: number };
  windowSize: { width: number; height: number };
  sessions: ChatSession[];
  activeSessionId: string | null;
  isLoading: boolean;

  toggleOpen: () => void;
  toggleFullscreen: () => void;
  toggleSidebar: () => void;
  setPosition: (pos: { x: number; y: number }) => void;
  setWindowSize: (size: { width: number; height: number }) => void;
  setIsLoading: (loading: boolean) => void;
  createSession: () => string;
  setActiveSession: (id: string) => void;
  deleteSession: (id: string) => void;
  pinSession: (id: string) => void;
  unpinSession: (id: string) => void;
  addMessage: (sessionId: string, message: ChatMessage) => void;
  updateMessageContent: (sessionId: string, messageId: string, content: string) => void;
  updateMessageStatus: (sessionId: string, messageId: string, status: ChatMessage['status']) => void;
  updateSessionTitle: (sessionId: string, title: string) => void;
  removeMessagesAfter: (sessionId: string, messageId: string) => void;
}

const defaultPos = { x: typeof window !== 'undefined' ? window.innerWidth - 504 : 600, y: typeof window !== 'undefined' ? window.innerHeight - 664 : 400 };

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      isOpen: false,
      isFullscreen: false,
      isSidebarOpen: false,
      position: defaultPos,
      windowSize: { width: 480, height: 600 },
      sessions: JSON.parse(JSON.stringify(mockSessions)),
      activeSessionId: mockSessions[0]?.id || null,
      isLoading: false,

      toggleOpen: () => set((s) => ({ isOpen: !s.isOpen })),
      toggleFullscreen: () => set((s) => ({ isFullscreen: !s.isFullscreen })),
      toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),
      setPosition: (position) => set({ position }),
      setWindowSize: (windowSize) => set({ windowSize }),
      setIsLoading: (isLoading) => set({ isLoading }),

      createSession: () => {
        const id = `s-${Date.now()}`;
        const newSession: ChatSession = {
          id, title: '新会话', pinned: false, createdAt: Date.now(), updatedAt: Date.now(), messages: [],
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

      updateMessageContent: (sessionId, messageId, content) => set((s) => ({
        sessions: s.sessions.map((ses) =>
          ses.id === sessionId
            ? {
                ...ses,
                messages: ses.messages.map((m) =>
                  m.id === messageId ? { ...m, content } : m
                ),
                updatedAt: Date.now(),
              }
            : ses
        ),
      })),

      updateMessageStatus: (sessionId, messageId, status) => set((s) => ({
        sessions: s.sessions.map((ses) =>
          ses.id === sessionId
            ? {
                ...ses,
                messages: ses.messages.map((m) =>
                  m.id === messageId ? { ...m, status } : m
                ),
              }
            : ses
        ),
      })),

      updateSessionTitle: (sessionId, title) => set((s) => ({
        sessions: s.sessions.map((ses) =>
          ses.id === sessionId ? { ...ses, title: title.slice(0, 20) } : ses
        ),
      })),

      removeMessagesAfter: (sessionId, messageId) => set((s) => ({
        sessions: s.sessions.map((ses) => {
          if (ses.id !== sessionId) return ses;
          const idx = ses.messages.findIndex((m) => m.id === messageId);
          return idx === -1 ? ses : { ...ses, messages: ses.messages.slice(0, idx) };
        }),
      })),
    }),
    {
      name: 'ai-assistant-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        sessions: state.sessions,
        activeSessionId: state.activeSessionId,
        position: state.position,
        windowSize: state.windowSize,
      }),
    }
  )
);

export function sortedSessions(sessions: ChatSession[]): ChatSession[] {
  return [...sessions].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return b.createdAt - a.createdAt;
  });
}
