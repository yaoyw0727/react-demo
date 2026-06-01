/**
 * PROTOTYPE — Variant A: 百度文心风格
 * 集成到真实布局上下文中，Zustand 管理状态，完整功能覆盖 #13-#19
 */
import React, { useRef, useEffect, useCallback } from 'react';
import {
  RobotOutlined, CloseOutlined, FullscreenOutlined, FullscreenExitOutlined,
  MenuFoldOutlined, MenuUnfoldOutlined, SendOutlined, MoreOutlined,
  PlusOutlined, PushpinOutlined, DeleteOutlined, UserOutlined,
  CopyOutlined, EditOutlined, BulbOutlined,
  CodeOutlined, QuestionCircleOutlined, CheckOutlined, PaperClipOutlined, StopOutlined,
} from '@ant-design/icons';
import { useChatStore, sortedSessions } from './useChatStore';
import { getMockReply } from './mockData';
import type { ChatMessage } from './mockData';
import { useDraggable } from './useDraggable';
import { useResizable } from './useResizable';
import styles from './VariantA.module.less';

const VariantA: React.FC = () => {
  const {
    isOpen, isFullscreen, isSidebarOpen, position, sessions, activeSessionId,
    toggleOpen, toggleFullscreen, toggleSidebar, setPosition,
    createSession, setActiveSession, deleteSession, pinSession, unpinSession, addMessage,
    updateSessionTitle,
  } = useChatStore();

  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editValue, setEditValue] = React.useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];

  // #14: Draggable
  const { handleMouseDown } = useDraggable(position.x, position.y, (p) => setPosition(p));

  const [windowSize, setWindowSize] = React.useState({ width: 480, height: 600 });
  const { setEl, handleMouseDown: handleResizeDown, activeEdge } = useResizable({
    minWidth: 480, minHeight: 600,
    onResize: (rect) => {
      setPosition({ x: rect.x, y: rect.y });
      setWindowSize({ width: rect.width, height: rect.height });
    },
  });

  // Auto-scroll on new messages
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [activeSession?.messages.length]);

  // #15: Esc to exit fullscreen
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) toggleFullscreen();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isFullscreen, toggleFullscreen]);

  const activeSessions = sortedSessions(sessions);

  // #19: Mock reply
  const triggerMockReply = useCallback((sessionId: string) => {
    setIsLoading(true);
    timerRef.current = setTimeout(() => {
      const reply: ChatMessage = {
        id: `m-${Date.now()}-reply`,
        role: 'assistant',
        content: getMockReply(),
        timestamp: Date.now(),
      };
      addMessage(sessionId, reply);
      setIsLoading(false);
      timerRef.current = null;
    }, 1200 + Math.random() * 800);
  }, [addMessage]);

  const handleStop = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsLoading(false);
  }, []);

  // #18: Send message
  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    let sessionId = activeSessionId;
    if (!sessionId) {
      sessionId = createSession();
    }
    const isFirst = sessions.find((s) => s.id === sessionId)?.messages.length === 0;
    const userMsg: ChatMessage = { id: `m-${Date.now()}`, role: 'user', content: trimmed, timestamp: Date.now() };
    addMessage(sessionId, userMsg);
    if (isFirst) updateSessionTitle(sessionId, trimmed);
    setInput('');
    triggerMockReply(sessionId);
  }, [input, isLoading, activeSessionId, sessions, createSession, addMessage, updateSessionTitle, triggerMockReply]);

  // #18: Enter to send, Shift+Enter to newline
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  // Click preset suggestion → send directly
  const handlePreset = useCallback((text: string) => {
    if (isLoading) return;
    let sessionId = activeSessionId;
    if (!sessionId) {
      sessionId = createSession();
    }
    const isFirst = sessions.find((s) => s.id === sessionId)?.messages.length === 0;
    const msg: ChatMessage = { id: `m-${Date.now()}`, role: 'user', content: text, timestamp: Date.now() };
    addMessage(sessionId, msg);
    if (isFirst) updateSessionTitle(sessionId, text);
    triggerMockReply(sessionId);
  }, [isLoading, activeSessionId, sessions, createSession, addMessage, updateSessionTitle, triggerMockReply]);

  // #18: Copy
  const handleCopy = async (content: string, id: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDeleteMessage = (msgId: string) => {
    if (!activeSession) return;
    const idx = activeSession.messages.findIndex((m) => m.id === msgId);
    if (idx === -1) return;
    const keepCount = idx;
    const hasFollowingAssistant = idx + 1 < activeSession.messages.length && activeSession.messages[idx + 1].role === 'assistant';
    const deleteTotal = hasFollowingAssistant ? 2 : 1;
    const kept = activeSession.messages.slice(0, keepCount);
    const after = activeSession.messages.slice(keepCount + deleteTotal);
    useChatStore.setState((s) => ({
      sessions: s.sessions.map((ses) =>
        ses.id === activeSession.id ? { ...ses, messages: [...kept, ...after] } : ses
      ),
    }));
  };

  if (!isOpen) {
    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <div className={styles.logo}>LOGO</div>
          <nav className={styles.nav}>
            <a>首页</a><a>系统管理</a><a>产品管理</a>
          </nav>
          <div className={styles.userArea}>
            <button className={styles.entryBtn} onClick={toggleOpen}>
              <RobotOutlined /> AI 助手
            </button>
            <span className={styles.avatar}><UserOutlined /></span>
          </div>
        </header>
        <main className={styles.main}>
          <p>点击右上角 <RobotOutlined /> AI 助手 按钮打开聊天窗口</p>
        </main>
      </div>
    );
  }

  return (
    <>
      {/* Mock page with blurred background */}
      <div className={`${styles.page} ${styles.blurred}`}>
        <header className={styles.header}>
          <div className={styles.logo}>LOGO</div>
          <nav className={styles.nav}>
            <a>首页</a><a>系统管理</a><a>产品管理</a>
          </nav>
          <div className={styles.userArea}>
            <button className={styles.entryBtnActive}><RobotOutlined /> AI 助手</button>
            <span className={styles.avatar}><UserOutlined /></span>
          </div>
        </header>
      </div>

      {/* Chat window */}
      <div
        ref={setEl}
        className={`${styles.chatWindow} ${isFullscreen ? styles.fullscreen : ''}`}
        style={isFullscreen ? {} : { left: position.x, top: position.y, width: windowSize.width, height: windowSize.height }}
      >
        {/* Resize handles */}
        <div className={`${styles.resizeTop} ${activeEdge === 'top' ? styles.resizeActive : ''}`} onMouseDown={(e) => handleResizeDown(e, 'top')} />
        <div className={`${styles.resizeBottom} ${activeEdge === 'bottom' ? styles.resizeActive : ''}`} onMouseDown={(e) => handleResizeDown(e, 'bottom')} />
        <div className={`${styles.resizeLeft} ${activeEdge === 'left' ? styles.resizeActive : ''}`} onMouseDown={(e) => handleResizeDown(e, 'left')} />
        <div className={`${styles.resizeRight} ${activeEdge === 'right' ? styles.resizeActive : ''}`} onMouseDown={(e) => handleResizeDown(e, 'right')} />
        <div className={`${styles.resizeCorner} ${activeEdge === 'top-left' ? styles.resizeActive : ''}`} style={{ top: 0, left: 0, cursor: 'nwse-resize' }} onMouseDown={(e) => handleResizeDown(e, 'top-left')} />
        <div className={`${styles.resizeCorner} ${activeEdge === 'top-right' ? styles.resizeActive : ''}`} style={{ top: 0, right: 0, cursor: 'nesw-resize' }} onMouseDown={(e) => handleResizeDown(e, 'top-right')} />
        <div className={`${styles.resizeCorner} ${activeEdge === 'bottom-left' ? styles.resizeActive : ''}`} style={{ bottom: 0, left: 0, cursor: 'nesw-resize' }} onMouseDown={(e) => handleResizeDown(e, 'bottom-left')} />
        <div className={`${styles.resizeCorner} ${activeEdge === 'bottom-right' ? styles.resizeActive : ''}`} style={{ bottom: 0, right: 0, cursor: 'nwse-resize' }} onMouseDown={(e) => handleResizeDown(e, 'bottom-right')} />

        {/* #16: Title bar / Toolbar */}
        <div className={styles.titleBar} onMouseDown={isFullscreen ? undefined : handleMouseDown}>
          <div className={styles.titleLeft}>
            <RobotOutlined className={styles.robotIcon} />
            <span>AI 助手</span>
          </div>
          <div className={styles.titleRight}>
            <button className={styles.toolBtn} onClick={toggleSidebar} title={isSidebarOpen ? '折叠历史' : '展开历史'}>
              {isSidebarOpen ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
            </button>
            <button className={styles.toolBtn} onClick={toggleFullscreen} title={isFullscreen ? '退出全屏' : '全屏'}>
              {isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
            </button>
            <button className={styles.toolBtn} onClick={toggleOpen} title="关闭"><CloseOutlined /></button>
          </div>
        </div>

        <div className={styles.body}>
          {/* #17: Sidebar */}
          {isSidebarOpen && (
            <div className={styles.sidebar}>
              <button className={styles.newChatBtn} onClick={() => { createSession(); toggleSidebar(); }}>
                <PlusOutlined /> 新会话
              </button>
              <div className={styles.sessionList}>
                {activeSessions.length === 0 && <div className={styles.empty}>暂无会话</div>}
                {activeSessions.map((s) => (
                  <div
                    key={s.id}
                    className={`${styles.sessionItem} ${s.id === activeSessionId ? styles.activeSession : ''}`}
                    onClick={() => { setActiveSession(s.id); toggleSidebar(); }}
                  >
                    <div className={styles.sessionTitle}>{s.title}</div>
                    <div className={styles.sessionActions}>
                      {s.pinned && <PushpinOutlined className={styles.pinnedIcon} />}
                      <span className={styles.moreBtn}>
                        <MoreOutlined />
                        <span className={styles.menuPopup}>
                          <span onClick={(e) => { e.stopPropagation(); s.pinned ? unpinSession(s.id) : pinSession(s.id); }}>
                            <PushpinOutlined /> {s.pinned ? '取消置顶' : '置顶'}
                          </span>
                          <span onClick={(e) => { e.stopPropagation(); if (window.confirm('确定删除该会话？')) deleteSession(s.id); }}>
                            <DeleteOutlined /> 删除
                          </span>
                        </span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Chat area */}
          <div className={styles.chatArea}>
            {!activeSession || activeSession.messages.length === 0 ? (
              /* Empty state with suggestions */
              <div className={styles.emptyState}>
                <RobotOutlined className={styles.emptyIcon} />
                <div className={styles.emptyTitle}>AI 助手已准备就绪</div>
                <div className={styles.emptyDesc}>有什么我可以帮你的吗？</div>
                <div className={styles.suggestions}>
                  <button onClick={() => handlePreset('如何优化 React 性能？')}><BulbOutlined /> React 性能优化</button>
                  <button onClick={() => handlePreset('帮我写一个防抖函数')}><CodeOutlined /> 防抖函数</button>
                  <button onClick={() => handlePreset('设计模式的六大原则是什么？')}><QuestionCircleOutlined /> 设计模式六大原则</button>
                </div>
                <div className={styles.emptyInputWrapper}>
                  <div className={styles.emptyInputBox}>
                    <textarea ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="输入消息，Enter 发送" rows={2} />
                    <div className={styles.emptyInputBoxBtns}>
                      <button className={styles.emptyAttachBtn}><PaperClipOutlined /></button>
                      {isLoading ? (
                        <button className={styles.emptyInputInnerBtn} onClick={handleStop} title="停止"><StopOutlined /></button>
                      ) : (
                        <button className={styles.emptyInputInnerBtn} onClick={handleSend} disabled={!input.trim()}><SendOutlined /></button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* #18: Message list */
              <div className={styles.messageList} ref={listRef}>
                {activeSession.messages.map((msg) => (
                  <div key={msg.id} className={`${styles.message} ${msg.role === 'user' ? styles.userMsg : styles.assistantMsg}`}>
                    {msg.role === 'assistant' && <div className={styles.msgAvatar}><RobotOutlined /></div>}
                    <div className={styles.msgBody}>
                      {editingId === msg.id ? (
                        <div className={styles.editBox}>
                          <textarea value={editValue} onChange={(e) => setEditValue(e.target.value)} onKeyDown={(e) => { if (e.key === 'Escape') { setEditingId(null); } }} />
                          <div className={styles.editActions}>
                            <span className={styles.editHint}>Esc 取消</span>
                            <div className={styles.editActionBtns}>
                              <button onClick={() => handleCopy(editValue, 'edit')}>
                                {copiedId === 'edit' ? <><CheckOutlined /> 已复制</> : <><CopyOutlined /> 复制</>}
                              </button>
                              <button onClick={() => handleDeleteMessage(msg.id)}><DeleteOutlined /> 删除</button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className={styles.bubble}>{msg.content}</div>
                      )}
                      {editingId !== msg.id && (
                      <div className={styles.msgActions}>
                        <button onClick={() => handleCopy(msg.content, msg.id)}>
                          {copiedId === msg.id ? <><CheckOutlined /> 已复制</> : <><CopyOutlined /> 复制</>}
                        </button>
                        {msg.role === 'user' && (
                          <button onClick={() => { setEditingId(msg.id); setEditValue(msg.content); }}><EditOutlined /> 编辑</button>
                        )}
                        <button onClick={() => handleDeleteMessage(msg.id)}><DeleteOutlined /> 删除</button>
                      </div>
                      )}
                    </div>
                    {msg.role === 'user' && <div className={styles.userAvatar}><UserOutlined /></div>}
                  </div>
                ))}
                {/* #19: Loading animation */}
                {isLoading && (
                  <div className={`${styles.message} ${styles.assistantMsg}`}>
                    <div className={styles.msgAvatar}><RobotOutlined /></div>
                    <div className={styles.bubble}>
                      <span className={styles.typing}><span>.</span><span>.</span><span>.</span></span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* #18: Input area */}
            {activeSession && activeSession.messages.length > 0 && (
              <div className={styles.inputArea}>
                <div className={styles.inputBox}>
                  <textarea
                    value={input} onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown} placeholder="输入消息，Enter 发送，Shift+Enter 换行" rows={4}
                  />
                  <div className={styles.inputBoxBtns}>
                    <button className={styles.attachBtn}><PaperClipOutlined /></button>
                    {isLoading ? (
                      <button className={styles.sendBtn} onClick={handleStop}><StopOutlined /></button>
                    ) : (
                      <button className={styles.sendBtn} onClick={handleSend} disabled={!input.trim()}><SendOutlined /></button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default VariantA;
