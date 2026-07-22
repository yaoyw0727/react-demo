import React, { useEffect, useRef } from 'react';
import {
  RobotOutlined, UserOutlined,
  CopyOutlined, CheckOutlined, ReloadOutlined,
} from '@ant-design/icons';
import type { ChatMessage } from '@/components/AIAssistant/types';
import MarkdownRenderer from '@/components/AIAssistant/MarkdownRenderer';
import { useTypewriter } from './useTypewriter';
import styles from './index.module.less';

const TypewriterMessage: React.FC<{ content: string; isStreaming: boolean }> = ({ content, isStreaming }) => {
  const displayed = useTypewriter(content, isStreaming);
  return <MarkdownRenderer content={displayed} />;
};

interface MessageListProps {
  messages: ChatMessage[];
  isStreaming: boolean;
  editingId: string | null;
  editValue: string;
  copiedId: string | null;
  onCopy: (content: string, id: string) => void;
  onEditStart: (id: string, content: string) => void;
  onEditChange: (value: string) => void;
  onEditCancel: () => void;
  onDelete: (msgId: string) => void;
  onRegenerate: () => void;
}

function MessageListBase({
  messages, isStreaming, editingId, editValue, copiedId,
  onCopy, onEditStart, onEditChange, onEditCancel, onDelete, onRegenerate,
}: MessageListProps) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages.length]);

  return (
    <div className={styles.messageList} ref={listRef}>
      {messages.map((msg) => (
        <div key={msg.id} className={`${styles.message} ${msg.role === 'user' ? styles.userMsg : styles.aiMsg} ${msg.status === 'error' ? styles.errorMsg : ''}`}>
          {msg.role === 'assistant' && <div className={styles.msgAvatar}><RobotOutlined /></div>}
          <div className={styles.msgBody}>
            {editingId === msg.id ? (
              <div className={styles.editBox}>
                <textarea value={editValue} onChange={(e) => onEditChange(e.target.value)} onKeyDown={(e) => { if (e.key === 'Escape') onEditCancel(); }} />
                <div className={styles.editRow}>
                  <span className={styles.editHint}>Esc 取消</span>
                  <div className={styles.editActions}>
                    <button onClick={() => onCopy(editValue, 'edit')}>
                      {copiedId === 'edit' ? <><CheckOutlined /> 已复制</> : <><CopyOutlined /> 复制</>}
                    </button>
                    <button onClick={() => onDelete(msg.id)}><ReloadOutlined /> 删除</button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className={`${styles.bubble} ${msg.status === 'streaming' ? styles.streamingCursor : ''} ${msg.role === 'assistant' ? styles.markdownBubble : ''}`}>
                  {msg.role === 'assistant'
                    ? (msg.status === 'streaming'
                      ? <TypewriterMessage content={msg.content} isStreaming />
                      : <MarkdownRenderer content={msg.content} />)
                    : msg.content}
                </div>
                {msg.status !== 'streaming' && (
                  <div className={styles.msgActions}>
                    <button onClick={() => onCopy(msg.content, msg.id)}>
                      {copiedId === msg.id ? <><CheckOutlined /> 已复制</> : <><CopyOutlined /> 复制</>}
                    </button>
                    {msg.role === 'user' && (
                      <button onClick={() => onEditStart(msg.id, msg.content)}>编辑</button>
                    )}
                    <button onClick={() => onDelete(msg.id)}>删除</button>
                    {msg.role === 'assistant' && msg === messages[messages.length - 1] && msg.status === 'sent' && (
                      <button onClick={onRegenerate}><ReloadOutlined /> 重新回答</button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
          {msg.role === 'user' && <div className={styles.userAvatar}><UserOutlined /></div>}
        </div>
      ))}
      {isStreaming && !messages.some((m) => m.status === 'streaming') && (
        <div className={`${styles.message} ${styles.aiMsg}`}>
          <div className={styles.msgAvatar}><RobotOutlined /></div>
          <div className={styles.bubble}>
            <span className={styles.typing}><span>.</span><span>.</span><span>.</span></span>
          </div>
        </div>
      )}
    </div>
  );
}

const MessageList = React.memo(MessageListBase);
export default MessageList;
