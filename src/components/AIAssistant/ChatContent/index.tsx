/**
 * AI 助手 — 右侧聊天内容区
 * 空状态 / 消息列表 + 输入框
 */
import React, { useRef, useEffect, useCallback } from 'react';
import {
  RobotOutlined, SendOutlined, StopOutlined, PaperClipOutlined,
  CopyOutlined, CheckOutlined, ReloadOutlined,
} from '@ant-design/icons';
import { useChatStore } from '@/store/chat';
import { sendMessage } from '@/services/api/ai';
import { getMockReply } from '@/components/AIAssistant/mockData';
import type { ChatMessage } from '@/components/AIAssistant/types';
import styles from './index.module.less';

const PRESETS = [
  { icon: '🚀', text: '如何优化 React 性能？' },
  { icon: '⚡', text: '帮我写一个防抖函数' },
  { icon: '📐', text: '解释 SOLID 原则' },
];

const ChatContent: React.FC = () => {
  const store = useChatStore();
  const sessions = useChatStore((s) => s.sessions);
  const activeSessionId = useChatStore((s) => s.activeSessionId);
  const isLoading = useChatStore((s) => s.isLoading);
  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];

  const listRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = React.useState('');
  const [isStreaming, setIsStreaming] = React.useState(false);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editValue, setEditValue] = React.useState('');
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [activeSession?.messages.length]);

  const handleCopy = async (content: string, id: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Send message — uses backend AI API, falls back to Mock
  const doSend = useCallback(async (text: string, sessionId: string) => {
    const userMsg: ChatMessage = {
      id: `m-${Date.now()}`, role: 'user', content: text, timestamp: Date.now(), status: 'sending',
    };
    store.addMessage(sessionId, userMsg);
    store.updateMessageStatus(sessionId, userMsg.id, 'sent');
    const isFirst = sessions.find((s) => s.id === sessionId)?.messages.length === 1;
    if (isFirst) store.updateSessionTitle(sessionId, text);

    const assistantMsg: ChatMessage = {
      id: `m-${Date.now()}-reply`, role: 'assistant', content: '', timestamp: Date.now(), status: 'streaming',
    };
    store.addMessage(sessionId, assistantMsg);
    store.setIsLoading(true);
    setIsStreaming(true);

    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      await sendMessage(
        text,
        sessionId,
        (content) => store.updateMessageContent(sessionId, assistantMsg.id, content),
        (_content) => { store.updateMessageStatus(sessionId, assistantMsg.id, 'sent'); },
        controller.signal,
      );
    } catch {
      // Fallback to mock reply when AI backend is unavailable
      const mockContent = getMockReply();
      store.updateMessageContent(sessionId, assistantMsg.id, mockContent);
      store.updateMessageStatus(sessionId, assistantMsg.id, 'sent');
    }
    store.setIsLoading(false);
    setIsStreaming(false);
    controllerRef.current = null;
  }, [sessions, store]);

  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || isLoading || isStreaming) return;
    let sid = activeSessionId;
    if (!sid) sid = store.createSession();
    setInput('');
    doSend(trimmed, sid);
  }, [input, isLoading, isStreaming, activeSessionId, store, doSend]);

  const handleStop = useCallback(() => {
    if (controllerRef.current) {
      controllerRef.current.abort();
      controllerRef.current = null;
    }
    if (activeSession) {
      const lastMsg = activeSession.messages[activeSession.messages.length - 1];
      if (lastMsg?.status === 'streaming') {
        store.updateMessageStatus(activeSession.id, lastMsg.id, 'sent');
      }
    }
    store.setIsLoading(false);
    setIsStreaming(false);
  }, [activeSession, store]);

  // Preset click → send directly
  const handlePreset = useCallback((text: string) => {
    if (isLoading || isStreaming) return;
    let sid = activeSessionId;
    if (!sid) sid = store.createSession();
    doSend(text, sid);
  }, [isLoading, isStreaming, activeSessionId, store, doSend]);

  // Regenerate last AI reply
  const handleRegenerate = useCallback(() => {
    if (!activeSession || isLoading || isStreaming) return;
    const msgs = activeSession.messages;
    const lastAi = msgs[msgs.length - 1];
    if (lastAi?.role !== 'assistant') return;
    store.removeMessagesAfter(activeSession.id, lastAi.id);
    const lastUser = [...msgs].reverse().find((m) => m.role === 'user');
    if (lastUser) doSend(lastUser.content, activeSession.id);
  }, [activeSession, isLoading, isStreaming, store, doSend]);

  // Delete message (pair: user msg + following AI reply)
  const handleDeleteMessage = (msgId: string) => {
    if (!activeSession) return;
    const idx = activeSession.messages.findIndex((m) => m.id === msgId);
    if (idx === -1) return;
    const hasFollowingAssistant = idx + 1 < activeSession.messages.length && activeSession.messages[idx + 1].role === 'assistant';
    const deleteTotal = hasFollowingAssistant ? 2 : 1;
    const kept = activeSession.messages.slice(0, idx);
    const after = activeSession.messages.slice(idx + deleteTotal);
    useChatStore.setState((s) => ({
      sessions: s.sessions.map((ses) =>
        ses.id === activeSession.id ? { ...ses, messages: [...kept, ...after] } : ses
      ),
    }));
  };

  const hasMessages = activeSession && activeSession.messages.length > 0;

  return (
    <div className={styles.chatArea}>
      {!hasMessages ? (
        /* Empty state */
        <div className={styles.emptyState}>
          <RobotOutlined className={styles.emptyIcon} />
          <div className={styles.emptyTitle}>AI 助手已准备就绪</div>
          <div className={styles.emptyDesc}>有什么我可以帮你的吗？</div>
          <div className={styles.suggestions}>
            {PRESETS.map((p) => (
              <button key={p.text} onClick={() => handlePreset(p.text)}>
                {p.icon} {p.text}
              </button>
            ))}
          </div>
          <div className={styles.inputBox} style={{ position: 'relative' }}>
            <textarea
              value={input} onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="输入消息，Enter 发送" rows={2}
            />
            <div className={styles.inputBoxActions}>
              <button className={styles.attachBtn}><PaperClipOutlined /></button>
              {isStreaming ? (
                <button className={styles.sendBtn} onClick={handleStop}><StopOutlined /></button>
              ) : (
                <button className={styles.sendBtn} onClick={handleSend} disabled={!input.trim()}><SendOutlined /></button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Messages + Input */
        <>
          <div className={styles.messageList} ref={listRef}>
            {activeSession.messages.map((msg) => (
              <div key={msg.id} className={`${styles.message} ${msg.role === 'user' ? styles.userMsg : styles.aiMsg} ${msg.status === 'error' ? styles.errorMsg : ''}`}>
                {msg.role === 'assistant' && <div className={styles.msgAvatar}><RobotOutlined /></div>}
                <div className={styles.msgBody}>
                  {editingId === msg.id ? (
                    <div className={styles.editBox}>
                      <textarea value={editValue} onChange={(e) => setEditValue(e.target.value)} onKeyDown={(e) => { if (e.key === 'Escape') setEditingId(null); }} />
                      <div className={styles.editRow}>
                        <span className={styles.editHint}>Esc 取消</span>
                        <div className={styles.editActions}>
                          <button onClick={() => handleCopy(editValue, 'edit')}>
                            {copiedId === 'edit' ? <><CheckOutlined /> 已复制</> : <><CopyOutlined /> 复制</>}
                          </button>
                          <button onClick={() => handleDeleteMessage(msg.id)}><ReloadOutlined /> 删除</button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className={`${styles.bubble} ${msg.status === 'streaming' ? styles.streamingCursor : ''}`}>
                        {msg.content}
                      </div>
                      {msg.status !== 'streaming' && (
                        <div className={styles.msgActions}>
                          <button onClick={() => handleCopy(msg.content, msg.id)}>
                            {copiedId === msg.id ? <><CheckOutlined /> 已复制</> : <><CopyOutlined /> 复制</>}
                          </button>
                          {msg.role === 'user' && (
                            <button onClick={() => { setEditingId(msg.id); setEditValue(msg.content); }}>编辑</button>
                          )}
                          <button onClick={() => handleDeleteMessage(msg.id)}>删除</button>
                          {msg.role === 'assistant' && msg === activeSession.messages[activeSession.messages.length - 1] && msg.status === 'sent' && (
                            <button onClick={handleRegenerate}><ReloadOutlined /> 重新回答</button>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
                {msg.role === 'user' && <div className={styles.userAvatar}><RobotOutlined /></div>}
              </div>
            ))}
            {isStreaming && !activeSession.messages.some((m) => m.status === 'streaming') && (
              <div className={`${styles.message} ${styles.aiMsg}`}>
                <div className={styles.msgAvatar}><RobotOutlined /></div>
                <div className={styles.bubble}>
                  <span className={styles.typing}><span>.</span><span>.</span><span>.</span></span>
                </div>
              </div>
            )}
          </div>

          <div className={styles.inputArea}>
            <div className={styles.inputWrap}>
              <textarea
                value={input} onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="输入消息，Enter 发送，Shift+Enter 换行" rows={2}
              />
              <div className={styles.inputActions}>
                <button className={styles.attachBtn}><PaperClipOutlined /></button>
                {isStreaming ? (
                  <button className={styles.sendBtn} onClick={handleStop}><StopOutlined /></button>
                ) : (
                  <button className={styles.sendBtn} onClick={handleSend} disabled={!input.trim()}><SendOutlined /></button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatContent;
