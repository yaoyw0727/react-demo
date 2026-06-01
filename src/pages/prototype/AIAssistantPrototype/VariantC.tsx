/**
 * PROTOTYPE — Variant C: Notion AI 风格
 * 非弹窗模式 — 页面右侧滑入面板（类似 Drawer），纯文本块消息，无气泡
 */
import React, { useRef, useEffect, useCallback } from 'react';
import {
  RobotOutlined, CloseOutlined, SendOutlined, PlusOutlined, UserOutlined,
  CopyOutlined, CheckOutlined, DeleteOutlined,
} from '@ant-design/icons';
import { useChatStore, sortedSessions } from './useChatStore';
import { getMockReply } from './mockData';
import styles from './VariantC.module.less';

const VariantC: React.FC = () => {
  const {
    isOpen, sessions, activeSessionId,
    toggleOpen, createSession, setActiveSession, deleteSession,
    addMessage, updateSessionTitle,
  } = useChatStore();

  const listRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];
  const list = sortedSessions(sessions);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [activeSession?.messages.length]);

  const triggerMockReply = useCallback((sessionId: string) => {
    setIsLoading(true);
    setTimeout(() => {
      addMessage(sessionId, { id: `m-${Date.now()}`, role: 'assistant', content: getMockReply(), timestamp: Date.now() });
      setIsLoading(false);
    }, 1400);
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

  return (
    <div className={styles.page}>
      {/* Main page */}
      <header className={styles.header}>
        <span className={styles.logo}>LOGO</span>
        <nav className={styles.nav}>
          <a>首页</a><a>系统管理</a><a>产品管理</a>
        </nav>
        <div className={styles.spacer} />
        <button className={`${styles.entryBtn} ${isOpen ? styles.active : ''}`} onClick={toggleOpen}>
          <RobotOutlined /> AI 助手
        </button>
        <span className={styles.avatar}><UserOutlined /></span>
      </header>

      <main className={`${styles.main} ${isOpen ? styles.shifted : ''}`}>
        <div className={styles.placeholder}>
          <p>点击右上角 AI 助手按钮，右侧面板将滑入打开</p>
        </div>
      </main>

      {/* Drawer panel */}
      <div className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ''}`}>
        <div className={styles.drawerHeader}>
          <div className={styles.drawerTitle}>
            <RobotOutlined /> AI 助手
          </div>
          <button className={styles.drawerClose} onClick={toggleOpen}><CloseOutlined /></button>
        </div>

        {/* Session tabs */}
        <div className={styles.sessionBar}>
          <button className={styles.newTab} onClick={createSession}><PlusOutlined /></button>
          <div className={styles.tabList}>
            {list.map((s) => (
              <div key={s.id}
                className={`${styles.tab} ${s.id === activeSessionId ? styles.activeTab : ''}`}
                onClick={() => setActiveSession(s.id)}>
                <span>{s.title}</span>
                <span className={styles.tabClose} onClick={(e) => { e.stopPropagation(); deleteSession(s.id); }}><DeleteOutlined /></span>
              </div>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className={styles.messageArea} ref={listRef}>
          {(!activeSession || activeSession.messages.length === 0) ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}><RobotOutlined /></div>
              <p>有什么想法？开始新的对话吧</p>
              <div className={styles.prompts}>
                <button onClick={() => setInput('如何优化 React 性能？')}>如何优化 React 性能？</button>
                <button onClick={() => setInput('帮我写一个防抖函数')}>帮我写一个防抖函数</button>
              </div>
            </div>
          ) : (
            <>
              {activeSession.messages.map((msg) => (
                <div key={msg.id} className={styles.block}>
                  <div className={styles.blockMeta}>
                    <span className={msg.role === 'assistant' ? styles.aiTag : styles.userTag}>
                      {msg.role === 'assistant' ? 'AI' : '你'}
                    </span>
                    <span className={styles.blockTime}>
                      {new Date(msg.timestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className={styles.blockContent}>{msg.content}</div>
                  <div className={styles.blockActions}>
                    <button onClick={() => handleCopy(msg.content, msg.id)}>
                      {copiedId === msg.id ? <CheckOutlined /> : <CopyOutlined />} 复制
                    </button>
                  </div>
                  <div className={styles.divider} />
                </div>
              ))}
              {isLoading && (
                <div className={styles.block}>
                  <div className={styles.blockMeta}><span className={styles.aiTag}>AI</span></div>
                  <div className={styles.typing}>思考中<span>.</span><span>.</span><span>.</span></div>
                  <div className={styles.divider} />
                </div>
              )}
            </>
          )}
        </div>

        {/* Input */}
        <div className={styles.inputArea}>
          <textarea
            value={input} onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="输入想法…" rows={2}
          />
          <button className={styles.sendBtn} onClick={handleSend} disabled={!input.trim() || isLoading}>
            <SendOutlined />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VariantC;
