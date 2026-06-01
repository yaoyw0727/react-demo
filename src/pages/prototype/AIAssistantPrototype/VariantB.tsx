/**
 * PROTOTYPE — Variant B: ChatGPT 对话风格
 * 单列布局，无固定侧边栏，顶部 Select 切换会话，圆润气泡 + 快捷操作工具栏
 */
import React, { useRef, useEffect, useCallback } from 'react';
import {
  RobotOutlined, CloseOutlined, FullscreenOutlined, FullscreenExitOutlined,
  SendOutlined, PlusOutlined, UserOutlined, CopyOutlined,
  CheckOutlined, CodeOutlined, DownOutlined, HistoryOutlined,
} from '@ant-design/icons';
import { useChatStore, sortedSessions } from './useChatStore';
import { getMockReply } from './mockData';
import styles from './VariantB.module.less';

const VariantB: React.FC = () => {
  const {
    isOpen, isFullscreen, sessions, activeSessionId,
    toggleOpen, toggleFullscreen, createSession, setActiveSession,
    deleteSession, addMessage, updateSessionTitle,
  } = useChatStore();

  const listRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const [showSessionList, setShowSessionList] = React.useState(false);

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];
  const list = sortedSessions(sessions);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [activeSession?.messages.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) toggleFullscreen();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isFullscreen, toggleFullscreen]);

  const triggerMockReply = useCallback((sessionId: string) => {
    setIsLoading(true);
    setTimeout(() => {
      addMessage(sessionId, { id: `m-${Date.now()}`, role: 'assistant', content: getMockReply(), timestamp: Date.now() });
      setIsLoading(false);
    }, 1500);
  }, [addMessage]);

  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    let sid = activeSessionId;
    if (!sid) sid = createSession();
    const isFirst = sessions.find((s) => s.id === sid)?.messages.length === 0;
    addMessage(sid, { id: `m-${Date.now()}`, role: 'user', content: trimmed, timestamp: Date.now() });
    if (isFirst) updateSessionTitle(sid, trimmed);
    setInput('');
    triggerMockReply(sid);
  }, [input, isLoading, activeSessionId, sessions, createSession, addMessage, updateSessionTitle, triggerMockReply]);

  const handleCopy = async (content: string, id: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleNewSession = () => {
    createSession();
    setShowSessionList(false);
  };

  if (!isOpen) {
    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <span className={styles.logo}>LOGO</span>
          <div className={styles.spacer} />
          <button className={styles.entryBtn} onClick={toggleOpen}>
            <RobotOutlined /> AI 助手
          </button>
          <span className={styles.avatar}><UserOutlined /></span>
        </header>
        <main className={styles.main}>
          <p>点击右上角打开 AI 助手</p>
        </main>
      </div>
    );
  }

  return (
    <>
      <div className={`${styles.page} ${styles.blurred}`}>
        <header className={styles.header}>
          <span className={styles.logo}>LOGO</span>
          <div className={styles.spacer} />
          <button className={styles.entryBtnActive} onClick={toggleOpen}><RobotOutlined /> AI 助手</button>
          <span className={styles.avatar}><UserOutlined /></span>
        </header>
      </div>

      <div className={`${styles.chatWindow} ${isFullscreen ? styles.fullscreen : ''}`}>
        {/* Top bar with session switcher */}
        <div className={styles.topBar}>
          <div className={styles.sessionSwitcher} onClick={() => setShowSessionList(!showSessionList)}>
            {activeSession ? <><HistoryOutlined /> {activeSession.title}</> : <><HistoryOutlined /> 选择会话</>}
            <DownOutlined className={styles.arrow} />
            {showSessionList && (
              <div className={styles.dropdown}>
                <div className={styles.dropdownItem} onClick={handleNewSession}><PlusOutlined /> 新会话</div>
                {list.map((s) => (
                  <div key={s.id} className={`${styles.dropdownItem} ${s.id === activeSessionId ? styles.active : ''}`}
                    onClick={() => { setActiveSession(s.id); setShowSessionList(false); }}>
                    {s.title}
                    <span className={styles.delBtn} onClick={(e) => { e.stopPropagation(); deleteSession(s.id); }}>×</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className={styles.topActions}>
            <button onClick={toggleFullscreen} title={isFullscreen ? '退出全屏' : '全屏'}>
              {isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
            </button>
            <button onClick={toggleOpen} title="关闭"><CloseOutlined /></button>
          </div>
        </div>

        {/* Messages */}
        <div className={styles.messages} ref={listRef}>
          {(!activeSession || activeSession.messages.length === 0) ? (
            <div className={styles.emptyState}>
              <RobotOutlined className={styles.emptyIcon} />
              <h3>你好！有什么我可以帮助你的？</h3>
              <div className={styles.chips}>
                <button onClick={() => setInput('如何优化 React 性能？')}>🚀 如何优化 React 性能？</button>
                <button onClick={() => setInput('帮我写一个防抖函数')}>⚡ 写一个防抖函数</button>
                <button onClick={() => setInput('解释 SOLID 原则')}>📐 解释 SOLID 原则</button>
              </div>
            </div>
          ) : (
            <>
              {activeSession.messages.map((msg) => (
                <div key={msg.id} className={`${styles.row} ${msg.role === 'user' ? styles.userRow : styles.aiRow}`}>
                  <div className={styles.avatarCol}>
                    {msg.role === 'assistant' ? <RobotOutlined /> : <UserOutlined />}
                  </div>
                  <div className={styles.contentCol}>
                    <div className={styles.roleLabel}>{msg.role === 'assistant' ? 'AI' : '你'}</div>
                    <div className={styles.bubble}>{msg.content}</div>
                    <div className={styles.actions}>
                      <button onClick={() => handleCopy(msg.content, msg.id)}>
                        {copiedId === msg.id ? <CheckOutlined /> : <CopyOutlined />} 复制
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className={`${styles.row} ${styles.aiRow}`}>
                  <div className={styles.avatarCol}><RobotOutlined /></div>
                  <div className={styles.contentCol}>
                    <div className={styles.roleLabel}>AI</div>
                    <div className={styles.bubble}>
                      <span className={styles.typing}>思考中<span>.</span><span>.</span><span>.</span></span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Input */}
        <div className={styles.inputBar}>
          <div className={styles.toolbar}>
            <button title="插入代码"><CodeOutlined /></button>
          </div>
          <div className={styles.inputRow}>
            <textarea
              value={input} onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="发送消息…" rows={1}
            />
            <button className={styles.sendBtn} onClick={handleSend} disabled={!input.trim() || isLoading}>
              <SendOutlined />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default VariantB;
