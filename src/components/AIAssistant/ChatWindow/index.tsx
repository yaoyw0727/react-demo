/**
 * AI 助手 — 聊天窗口主体
 * 左侧 ChatSidebar + 右侧 ChatContent
 */
import React from 'react';
import { useChatStore } from '@/store/chat';
import ChatSidebar from '../ChatSidebar';
import ChatContent from '../ChatContent';
import styles from './index.module.less';

const ChatWindow: React.FC = () => {
  const isSidebarOpen = useChatStore((s) => s.isSidebarOpen);
  return (
    <div className={styles.body}>
      {isSidebarOpen && <ChatSidebar />}
      <ChatContent />
    </div>
  );
};

export default ChatWindow;
