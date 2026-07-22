import React, { useRef, useEffect, useCallback, useState } from 'react';
import {
  RobotOutlined, SendOutlined, PaperClipOutlined,
} from '@ant-design/icons';
import { Tooltip, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import IconFont from '@/components/IconFont';
import { useChatStore } from '@/store/chat';
import { useModelStore } from '@/store/aiModel';
import { sendMessage } from '@/services/api/ai';
import { getMockReply } from '@/components/AIAssistant/mockData';
import type { ChatMessage } from '@/components/AIAssistant/types';
import MessageList from './MessageList';
import styles from './index.module.less';

const PRESETS = [
  { icon: '🚀', text: '如何优化 React 性能？' },
  { icon: '⚡', text: '帮我写一个防抖函数' },
  { icon: '📐', text: '解释 SOLID 原则' },
];

const ChatContent: React.FC = () => {
  const sessions = useChatStore((s) => s.sessions);
  const activeSessionId = useChatStore((s) => s.activeSessionId);
  const isLoading = useChatStore((s) => s.isLoading);
  const { availableModels, selectedProvider, selectedModel, fetchModels, setModel } = useModelStore();
  const currentProvider = availableModels.find((p) => p.provider === selectedProvider);
  const currentModel = currentProvider?.models.find((m) => m.id === selectedModel);
  const [switchOpen, setSwitchOpen] = useState(false);
  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];

  const inputARef = useRef<HTMLTextAreaElement>(null);
  const inputBRef = useRef<HTMLTextAreaElement>(null);
  const [input, setInput] = React.useState('');
  const [isStreaming, setIsStreaming] = React.useState(false);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editValue, setEditValue] = React.useState('');
  const controllerRef = useRef<AbortController | null>(null);

  const autoResizeTextarea = useCallback(() => {
    const el = inputARef.current || inputBRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  }, []);

  useEffect(() => { autoResizeTextarea(); }, [input, autoResizeTextarea]);

  useEffect(() => { fetchModels(); }, [fetchModels]);

  const handleCopy = useCallback(async (content: string, id: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  const doSend = useCallback(async (text: string, sessionId: string) => {
    const { addMessage, updateMessageContent, updateMessageStatus, updateSessionTitle, setIsLoading } = useChatStore.getState();
    const userMsg: ChatMessage = {
      id: `m-${Date.now()}`, role: 'user', content: text, timestamp: Date.now(), status: 'sending',
    };
    addMessage(sessionId, userMsg);
    updateMessageStatus(sessionId, userMsg.id, 'sent');
    const { sessions: latestSessions } = useChatStore.getState();
    const isFirst = latestSessions.find((s) => s.id === sessionId)?.messages.length === 1;
    if (isFirst) updateSessionTitle(sessionId, text);

    const assistantMsg: ChatMessage = {
      id: `m-${Date.now()}-reply`, role: 'assistant', content: '', timestamp: Date.now(), status: 'streaming',
    };
    addMessage(sessionId, assistantMsg);
    setIsLoading(true);
    setIsStreaming(true);

    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      const { selectedProvider: sp, selectedModel: sm } = useModelStore.getState();
      await sendMessage(
        text,
        sessionId,
        (content) => updateMessageContent(sessionId, assistantMsg.id, content),
        (_content) => { updateMessageStatus(sessionId, assistantMsg.id, 'sent'); },
        controller.signal,
        sp,
        sm,
      );
    } catch {
      if (!controllerRef.current) return;
      const mockContent = getMockReply();
      updateMessageContent(sessionId, assistantMsg.id, mockContent);
      updateMessageStatus(sessionId, assistantMsg.id, 'sent');
    }
    setIsLoading(false);
    setIsStreaming(false);
    controllerRef.current = null;
  }, []);

  const menuItems: MenuProps['items'] = availableModels.flatMap((group) => [
    { type: 'group', label: group.providerName, key: `g-${group.provider}` },
    ...group.models.map((m) => ({
      key: `${group.provider}/${m.id}`,
      label: m.name,
      onClick: () => setModel(group.provider, m.id),
    })),
  ]);

  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || isLoading || isStreaming) return;
    let sid = activeSessionId;
    if (!sid) sid = useChatStore.getState().createSession();
    setInput('');
    doSend(trimmed, sid);
  }, [input, isLoading, isStreaming, activeSessionId, doSend]);

  const handleStop = useCallback(() => {
    if (controllerRef.current) {
      controllerRef.current.abort();
      controllerRef.current = null;
    }
    if (activeSession) {
      const lastMsg = activeSession.messages[activeSession.messages.length - 1];
      if (lastMsg?.status === 'streaming') {
        useChatStore.getState().updateMessageStatus(activeSession.id, lastMsg.id, 'sent');
      }
    }
    useChatStore.getState().setIsLoading(false);
    setIsStreaming(false);
  }, [activeSession]);

  const handlePreset = useCallback((text: string) => {
    if (isLoading || isStreaming) return;
    let sid = activeSessionId;
    if (!sid) sid = useChatStore.getState().createSession();
    doSend(text, sid);
  }, [isLoading, isStreaming, activeSessionId, doSend]);

  const handleRegenerate = useCallback(() => {
    if (isLoading || isStreaming) return;
    const { sessions: curSessions, activeSessionId: curId, removeMessagesAfter } = useChatStore.getState();
    const curSession = curSessions.find((s) => s.id === curId);
    if (!curSession) return;
    const msgs = curSession.messages;
    const lastAi = msgs[msgs.length - 1];
    if (lastAi?.role !== 'assistant') return;
    const lastUser = [...msgs].reverse().find((m) => m.role === 'user');
    if (!lastUser) return;
    removeMessagesAfter(curSession.id, lastUser.id);
    doSend(lastUser.content, curSession.id);
  }, [isLoading, isStreaming, doSend]);

  const handleDeleteMessage = useCallback((msgId: string) => {
    const { sessions: curSessions, activeSessionId: curId } = useChatStore.getState();
    const session = curSessions.find((s) => s.id === curId);
    if (!session) return;
    const idx = session.messages.findIndex((m) => m.id === msgId);
    if (idx === -1) return;
    const hasFollowingAssistant = idx + 1 < session.messages.length && session.messages[idx + 1].role === 'assistant';
    const deleteTotal = hasFollowingAssistant ? 2 : 1;
    const kept = session.messages.slice(0, idx);
    const after = session.messages.slice(idx + deleteTotal);
    useChatStore.setState((s) => ({
      sessions: s.sessions.map((ses) =>
        ses.id === session.id ? { ...ses, messages: [...kept, ...after] } : ses
      ),
    }));
  }, []);

  const handleEditStart = useCallback((id: string, content: string) => {
    setEditingId(id);
    setEditValue(content);
  }, []);

  const handleEditCancel = useCallback(() => {
    setEditingId(null);
  }, []);

  const hasMessages = activeSession && activeSession.messages.length > 0;

  return (
    <div className={styles.chatArea}>
      {!hasMessages ? (
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
          <div className={styles.inputBox}>
            <textarea
              ref={inputARef}
              value={input} onChange={(e) => setInput(e.target.value)}
              onInput={autoResizeTextarea}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="输入消息，Enter 发送" rows={2}
            />
            <div className={styles.inputBoxActions}>
              <div className={styles.inputLeft}>
                <div className={styles.modelSwitch}>
                  <span className={styles.modelDisplay}>
                    <span className={styles.modelIcon} style={{ color: currentProvider?.color }}>{currentProvider?.icon}</span>
                    <span className={styles.modelName}>{currentModel?.name || '选择模型'}</span>
                  </span>
                  <span className={styles.modelSep}>|</span>
                  <Dropdown menu={{ items: menuItems }} open={switchOpen} onOpenChange={setSwitchOpen} trigger={['click']}>
                    <Tooltip title="切换模型">
                      <button className={styles.modelToggleBtn}><IconFont type="icon-change" /></button>
                    </Tooltip>
                  </Dropdown>
                </div>
                <button className={styles.attachBtn}><PaperClipOutlined /></button>
              </div>
              {isStreaming ? (
                <button className={styles.sendBtn} onClick={handleStop}>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><rect x="3" y="3" width="18" height="18" rx="3" /></svg>
                </button>
              ) : (
                <button className={styles.sendBtn} onClick={handleSend} disabled={!input.trim()}><SendOutlined /></button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          <MessageList
            messages={activeSession.messages}
            isStreaming={isStreaming}
            editingId={editingId}
            editValue={editValue}
            copiedId={copiedId}
            onCopy={handleCopy}
            onEditStart={handleEditStart}
            onEditChange={setEditValue}
            onEditCancel={handleEditCancel}
            onDelete={handleDeleteMessage}
            onRegenerate={handleRegenerate}
          />
          <div className={styles.inputArea}>
            <div className={styles.inputWrap}>
              <textarea
                ref={inputBRef}
                value={input} onChange={(e) => setInput(e.target.value)}
                onInput={autoResizeTextarea}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="输入消息，Enter 发送，Shift+Enter 换行" rows={2}
              />
              <div className={styles.inputActions}>
                <div className={styles.inputLeft}>
                  <div className={styles.modelSwitch}>
                    <span className={styles.modelDisplay}>
                      <span className={styles.modelIcon} style={{ color: currentProvider?.color }}>{currentProvider?.icon}</span>
                      <span className={styles.modelName}>{currentModel?.name || '选择模型'}</span>
                    </span>
                    <span className={styles.modelSep}>|</span>
                    <Dropdown menu={{ items: menuItems }} open={switchOpen} onOpenChange={setSwitchOpen} trigger={['click']}>
                      <Tooltip title="切换模型">
                        <button className={styles.modelToggleBtn}><IconFont type="icon-change" /></button>
                      </Tooltip>
                    </Dropdown>
                  </div>
                  <button className={styles.attachBtn}><PaperClipOutlined /></button>
                </div>
                {isStreaming ? (
                  <button className={styles.sendBtn} onClick={handleStop}>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><rect x="3" y="3" width="18" height="18" rx="3" /></svg>
                  </button>
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
