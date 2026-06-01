/**
 * PROTOTYPE — Variant C: 极简笔记风格
 * 无边框、无气泡，纯文本块 + 分割线，大量留白，类似 Notion 风格
 */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { SendOutlined, MoreOutlined, PlusOutlined, PushpinOutlined, UserOutlined, CopyOutlined, ThunderboltOutlined, EditOutlined, ReloadOutlined, DeleteOutlined } from '@ant-design/icons';
import { mockSessions, mockReply } from './mockData';
import type { ChatSession, ChatMessage } from './mockData';
import { useDraggable } from './useDraggable';
import { useResizable } from './useResizable';
import styles from './VariantC.module.less';

const sessionA: ChatSession = JSON.parse(JSON.stringify(mockSessions[0]));
const sessionB: ChatSession = JSON.parse(JSON.stringify(mockSessions[1]));
const initialSessions = [sessionA, sessionB];

const VariantC: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>(initialSessions);
  const [activeId, setActiveId] = useState(sessionA.id);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const listRef = useRef<HTMLDivElement>(null);
  const editRef = useRef<HTMLTextAreaElement>(null);
  const { pos, handleMouseDown } = useDraggable({ x: window.innerWidth - 560, y: window.innerHeight - 680 });
  const { width: sidebarWidth, handleMouseDown: handleResizerDown } = useResizable();

  const activeSession = sessions.find((s) => s.id === activeId) || sessions[0];

  const handleSend = useCallback(() => {
    if (!input.trim() || isLoading) return;
    const userMsg: ChatMessage = { id: `m-${Date.now()}`, role: 'user', content: input, timestamp: Date.now() };
    const updated = sessions.map((s) =>
      s.id === activeId ? { ...s, messages: [...s.messages, userMsg], title: s.messages.length === 0 ? input.slice(0, 20) : s.title, updatedAt: Date.now() } : s
    );
    setSessions(updated);
    setInput('');
    setIsLoading(true);
    setTimeout(() => {
      const reply: ChatMessage = { id: `m-${Date.now()}-reply`, role: 'assistant', content: mockReply[Math.floor(Math.random() * mockReply.length)], timestamp: Date.now() };
      setSessions((prev) => prev.map((s) => s.id === activeId ? { ...s, messages: [...s.messages, reply] } : s));
      setIsLoading(false);
    }, 1500);
  }, [input, isLoading, sessions, activeId]);

  const handleNewSession = () => {
    const newSession: ChatSession = { id: `s-${Date.now()}`, title: '新笔记', pinned: false, createdAt: Date.now(), messages: [] };
    setSessions((prev) => [newSession, ...prev]);
    setActiveId(newSession.id);
    setIsSidebarOpen(true);
  };

  const handleDelete = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  const handlePin = (id: string) => {
    setSessions((prev) => prev.map((s) => s.id === id ? { ...s, pinned: !s.pinned } : s));
  };

  const handleCopy = async (content: string, id: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const startEdit = (msg: ChatMessage) => {
    setEditingId(msg.id);
    setEditValue(msg.content);
    setTimeout(() => editRef.current?.focus(), 50);
  };

  const submitEdit = () => {
    if (!editValue.trim() || !editingId || isLoading) return;
    const msgIndex = activeSession.messages.findIndex((m) => m.id === editingId);
    if (msgIndex === -1) return;
    const updatedMsg: ChatMessage = { ...activeSession.messages[msgIndex], content: editValue, timestamp: Date.now() };
    const kept = activeSession.messages.slice(0, msgIndex);
    const updated = sessions.map((s) =>
      s.id === activeId ? { ...s, messages: [...kept, updatedMsg], updatedAt: Date.now() } : s
    );
    setSessions(updated);
    setEditingId(null);
    setEditValue('');
    setIsLoading(true);
    setTimeout(() => {
      const reply: ChatMessage = { id: `m-${Date.now()}-reply`, role: 'assistant', content: mockReply[Math.floor(Math.random() * mockReply.length)], timestamp: Date.now() };
      setSessions((prev) => prev.map((s) => s.id === activeId ? { ...s, messages: [...s.messages, reply] } : s));
      setIsLoading(false);
    }, 1500);
  };

  const handleDeleteMessage = (msgId: string) => {
    setSessions((prev) => prev.map((s) => {
      if (s.id !== activeId) return s;
      const idx = s.messages.findIndex((m) => m.id === msgId);
      if (idx === -1) return s;
      const deleteCount = (idx + 1 < s.messages.length && s.messages[idx + 1].role === 'assistant') ? 2 : 1;
      return { ...s, messages: [...s.messages.slice(0, idx), ...s.messages.slice(idx + deleteCount)] };
    }));
  };

  const handleRegenerate = () => {
    if (isLoading) return;
    const msgs = activeSession.messages;
    const lastAiIdx = msgs.length - 1;
    if (lastAiIdx < 0 || msgs[lastAiIdx].role !== 'assistant') return;
    const kept = msgs.slice(0, lastAiIdx);
    setSessions((prev) => prev.map((s) =>
      s.id === activeId ? { ...s, messages: kept } : s
    ));
    setIsLoading(true);
    setTimeout(() => {
      const reply: ChatMessage = { id: `m-${Date.now()}-reply`, role: 'assistant', content: mockReply[Math.floor(Math.random() * mockReply.length)], timestamp: Date.now() };
      setSessions((prev) => prev.map((s) => s.id === activeId ? { ...s, messages: [...s.messages, reply] } : s));
      setIsLoading(false);
    }, 1500);
  };

  useEffect(() => { listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' }); }, [activeSession.messages.length, isLoading]);

  useEffect(() => {
    if (!sessions.find((s) => s.id === activeId) && sessions.length > 0) {
      setActiveId(sessions[0].id);
    }
  }, [sessions, activeId]);

  const sortedSessions = [...sessions].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return b.createdAt - a.createdAt;
  });

  if (!isOpen) {
    return (
      <div className={styles.mockPage}>
        <div className={styles.mockHeader}>
          <span className={styles.mockLogo}>N.</span>
          <div>
            <button className={styles.openBtn} onClick={() => setIsOpen(true)}><ThunderboltOutlined /></button>
            <button className={styles.mockIcon}><UserOutlined /></button>
          </div>
        </div>
        <div className={styles.mockBody} />
      </div>
    );
  }

  return (
    <>
      <div className={`${styles.mockPage} ${styles.blurred}`}>
        <div className={styles.mockHeader}>
          <span className={styles.mockLogo}>N.</span>
          <div>
            <button className={styles.openBtnActive}><ThunderboltOutlined /></button>
            <button className={styles.mockIcon}><UserOutlined /></button>
          </div>
        </div>
      </div>

      <div className={`${styles.window} ${isFullscreen ? styles.fullscreen : ''}`} style={isFullscreen ? {} : { left: pos.x, top: pos.y }}>
        <div className={styles.topBar} onMouseDown={handleMouseDown}>
          <div className={styles.topLeft}>
            <ThunderboltOutlined />
            <span>AI 助手</span>
          </div>
          <div className={styles.topRight}>
            <span className={styles.linkBtn} onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              {isSidebarOpen ? '收起历史' : '历史记录'}
            </span>
            <span className={styles.linkBtn} onClick={() => setIsFullscreen(!isFullscreen)}>
              {isFullscreen ? '退出全屏' : '全屏'}
            </span>
            <span className={styles.linkBtn} onClick={() => setIsOpen(false)}>关闭</span>
          </div>
        </div>

        <div className={styles.body}>
          {isSidebarOpen && (
            <div className={styles.sidebar} style={{ width: sidebarWidth }}>
              <div className={styles.sideTitle}>
                <span>历史记录</span>
                <span onClick={handleNewSession}>
                  <PlusOutlined />
                </span>
              </div>
              <div className={styles.sessList}>
                {sortedSessions.length === 0 && <div className={styles.empty}>空</div>}
                {sortedSessions.map((s) => (
                  <div key={s.id} className={`${styles.sessItem} ${s.id === activeId ? styles.activeSess : ''}`} onClick={() => { setActiveId(s.id); setIsSidebarOpen(false); }}>
                    <div className={styles.sessTitle}>{s.title}</div>
                    <div className={styles.sessActions}>
                      {s.pinned && <PushpinOutlined />}
                      <span className={styles.sessMore}>
                        <MoreOutlined />
                        <span className={styles.dropdown}>
                          <span onClick={(e) => { e.stopPropagation(); handlePin(s.id); }}>{s.pinned ? '取消置顶' : '置顶'}</span>
                          <span onClick={(e) => { e.stopPropagation(); handleDelete(s.id); }}>删除</span>
                        </span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className={styles.resizer} onMouseDown={handleResizerDown} />
            </div>
          )}

          <div className={styles.chatArea}>
            {activeSession.messages.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}><ThunderboltOutlined /></div>
                <div className={styles.emptyTitle}>AI 助手已准备就绪</div>
                <div className={styles.suggestions}>
                  <button className={styles.suggestion} onClick={() => { setInput('如何优化 React 性能？'); }}>如何优化 React 性能？</button>
                  <button className={styles.suggestion} onClick={() => { setInput('帮我写一个防抖函数'); }}>帮我写一个防抖函数</button>
                  <button className={styles.suggestion} onClick={() => { setInput('设计模式的六大原则是什么？'); }}>设计模式的六大原则是什么？</button>
                </div>
                <div className={styles.emptyInput}>
                  <textarea
                    className={styles.emptyTextarea}
                    placeholder="输入消息..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
                    }}
                    rows={1}
                  />
                  <button className={styles.sendBtn} onClick={handleSend} disabled={!input.trim() || isLoading}>
                    <SendOutlined />
                  </button>
                </div>
              </div>
            ) : (
            <div className={styles.msgs} ref={listRef}>
              {activeSession.messages.map((msg) => (
                <div key={msg.id} className={`${styles.block} ${msg.role === 'user' ? styles.uBlock : styles.aBlock}`}>
                  <div className={styles.blockLabel}>
                    {msg.role === 'user' ? '你' : 'AI'}
                    <div className={styles.blockActions}>
                      <button className={styles.blockBtn} onClick={() => handleCopy(msg.content, msg.id)}>
                        {copiedId === msg.id ? '已复制' : <><CopyOutlined /> 复制</>}
                      </button>
                      {msg.role === 'user' && editingId !== msg.id && (
                        <>
                          <button className={styles.blockBtn} onClick={() => startEdit(msg)}><EditOutlined /> 编辑</button>
                          <button className={styles.blockBtn} onClick={() => handleDeleteMessage(msg.id)}><DeleteOutlined /> 删除</button>
                        </>
                      )}
                      {msg.role === 'assistant' && msg === activeSession.messages[activeSession.messages.length - 1] && (
                        <button className={styles.blockBtn} onClick={handleRegenerate}><ReloadOutlined /> 重新回答</button>
                      )}
                    </div>
                  </div>
                  {editingId === msg.id ? (
                    <div className={styles.editBox}>
                      <textarea ref={editRef} className={styles.editInput} value={editValue} onChange={(e) => setEditValue(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitEdit(); } if (e.key === 'Escape') setEditingId(null); }} />
                      <div className={styles.editHint}>Enter 发送 · Esc 取消</div>
                    </div>
                  ) : (
                    <div className={styles.blockContent}>{msg.content}</div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className={`${styles.block} ${styles.aBlock}`}>
                  <div className={styles.blockLabel}>AI</div>
                  <div className={styles.typingLine}>
                    <span /><span /><span />
                  </div>
                </div>
              )}
            </div>
            )}

            {activeSession.messages.length > 0 && (
            <div className={styles.inputArea}>
              <textarea
                className={styles.input}
                placeholder="在这里输入..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                rows={1}
              />
              <button className={styles.sendBtn} onClick={handleSend} disabled={!input.trim() || isLoading}>
                <SendOutlined />
              </button>
            </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default VariantC;
