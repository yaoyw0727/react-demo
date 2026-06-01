/**
 * PROTOTYPE — Variant B: 深色对话风格
 * 深色主题 + 玻璃拟态效果，卡片式消息，紧凑布局
 */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { RobotOutlined, CloseOutlined, FullscreenOutlined, FullscreenExitOutlined, MenuFoldOutlined, MenuUnfoldOutlined, SendOutlined, MoreOutlined, PlusOutlined, PushpinOutlined, UserOutlined, CopyOutlined, EditOutlined, ReloadOutlined, DeleteOutlined } from '@ant-design/icons';
import { mockSessions, mockReply } from './mockData';
import type { ChatSession, ChatMessage } from './mockData';
import { useDraggable } from './useDraggable';
import { useResizable } from './useResizable';
import styles from './VariantB.module.less';

const sessionA: ChatSession = JSON.parse(JSON.stringify(mockSessions[0]));
const sessionB: ChatSession = JSON.parse(JSON.stringify(mockSessions[1]));
const initialSessions = [sessionA, sessionB];

const VariantB: React.FC = () => {
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
  const { pos, handleMouseDown } = useDraggable({ x: window.innerWidth - 516, y: window.innerHeight - 676 });
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
    const newSession: ChatSession = { id: `s-${Date.now()}`, title: '新对话', pinned: false, createdAt: Date.now(), messages: [] };
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
          <span className={styles.mockTitle}>Dashboard</span>
          <div className={styles.mockUser}>
            <button className={styles.openBtn} onClick={() => setIsOpen(true)}>
              <RobotOutlined />
            </button>
            <div className={styles.mockAvatar}><UserOutlined /></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`${styles.mockPage} ${styles.blurred}`}>
        <div className={styles.mockHeader}>
          <span className={styles.mockTitle}>Dashboard</span>
          <div className={styles.mockUser}>
            <button className={styles.openBtnActive}><RobotOutlined /></button>
            <div className={styles.mockAvatar}><UserOutlined /></div>
          </div>
        </div>
        <div className={styles.mockGrid}>
          <div className={styles.mockCard} />
          <div className={styles.mockCard} />
          <div className={styles.mockCard} />
        </div>
      </div>

      <div className={`${styles.chatWindow} ${isFullscreen ? styles.fullscreen : ''}`} style={isFullscreen ? {} : { left: pos.x, top: pos.y }}>
        <div className={styles.header} onMouseDown={handleMouseDown}>
          <div className={styles.headerLeft}>
            <div className={styles.headerIcon}><RobotOutlined /></div>
            <div>
              <div className={styles.headerTitle}>AI 助手</div>
              <div className={styles.headerStatus}>在线 · 随时为你服务</div>
            </div>
          </div>
          <div className={styles.headerRight}>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={styles.btn} title={isSidebarOpen ? '隐藏历史' : '显示历史'}>
              {isSidebarOpen ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
            </button>
            <button onClick={() => setIsFullscreen(!isFullscreen)} className={styles.btn}>
              {isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
            </button>
            <button onClick={() => setIsOpen(false)} className={styles.btn}><CloseOutlined /></button>
          </div>
        </div>

        <div className={styles.body}>
          {isSidebarOpen && (
            <div className={styles.sidebar} style={{ width: sidebarWidth }}>
              <div className={styles.sidebarHeader}>
                <span>历史记录</span>
                <button className={styles.newBtn} onClick={handleNewSession}><PlusOutlined /></button>
              </div>
              <div className={styles.sessionList}>
                {sortedSessions.length === 0 && <div className={styles.empty}>暂无记录</div>}
                {sortedSessions.map((s) => (
                  <div key={s.id} className={`${styles.sessionItem} ${s.id === activeId ? styles.activeSess : ''}`} onClick={() => { setActiveId(s.id); setIsSidebarOpen(false); }}>
                    <div className={styles.sessTitle}>{s.title}</div>
                    <div className={styles.sessMeta}>
                      {s.pinned && <PushpinOutlined />}
                      <span className={styles.moreMenu}>
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
                <div className={styles.emptyIcon}><RobotOutlined /></div>
                <div className={styles.emptyTitle}>AI 助手已准备就绪</div>
                <div className={styles.emptyDesc}>有什么我可以帮你的吗？</div>
                <div className={styles.suggestions}>
                  <button className={styles.suggestion} onClick={() => { setInput('如何优化 React 性能？'); }}>如何优化 React 性能？</button>
                  <button className={styles.suggestion} onClick={() => { setInput('帮我写一个防抖函数'); }}>帮我写一个防抖函数</button>
                  <button className={styles.suggestion} onClick={() => { setInput('设计模式的六大原则是什么？'); }}>设计模式的六大原则是什么？</button>
                </div>
                <div className={styles.emptyInput}>
                  <textarea
                    className={styles.emptyTextarea}
                    placeholder="输入消息，Enter 发送，Shift+Enter 换行"
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
            <div className={styles.messageList} ref={listRef}>
              {activeSession.messages.map((msg) => (
                <div key={msg.id} className={`${styles.message} ${msg.role === 'user' ? styles.uMsg : styles.aMsg}`}>
                  {msg.role === 'assistant' && <div className={styles.aIcon}><RobotOutlined /></div>}
                  <div className={styles.bubbleWrap}>
                    {editingId === msg.id ? (
                      <div className={styles.editBox}>
                        <textarea ref={editRef} className={styles.editInput} value={editValue} onChange={(e) => setEditValue(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitEdit(); } if (e.key === 'Escape') setEditingId(null); }} />
                        <div className={styles.editHint}>Enter 发送 · Esc 取消</div>
                      </div>
                    ) : (
                      <div className={styles.bubble}>{msg.content}</div>
                    )}
                    <div className={styles.msgActions}>
                      <button className={styles.aBtn} onClick={() => handleCopy(msg.content, msg.id)}>
                        {copiedId === msg.id ? '已复制' : <><CopyOutlined /> 复制</>}
                      </button>
                      {msg.role === 'user' && editingId !== msg.id && (
                        <>
                          <button className={styles.aBtn} onClick={() => startEdit(msg)}><EditOutlined /> 编辑</button>
                          <button className={styles.aBtn} onClick={() => handleDeleteMessage(msg.id)}><DeleteOutlined /> 删除</button>
                        </>
                      )}
                      {msg.role === 'assistant' && msg === activeSession.messages[activeSession.messages.length - 1] && (
                        <button className={styles.aBtn} onClick={handleRegenerate}><ReloadOutlined /> 重新回答</button>
                      )}
                    </div>
                  </div>
                  {msg.role === 'user' && <div className={styles.uIcon}><UserOutlined /></div>}
                </div>
              ))}
              {isLoading && (
                <div className={`${styles.message} ${styles.aMsg}`}>
                  <div className={styles.aIcon}><RobotOutlined /></div>
                  <div className={styles.bubble}>
                    <div className={styles.typingDots}>
                      <span /><span /><span />
                    </div>
                  </div>
                </div>
              )}
            </div>
            )}

            {activeSession.messages.length > 0 && (
            <div className={styles.inputArea}>
              <textarea
                className={styles.input}
                placeholder="输入消息..."
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

export default VariantB;
