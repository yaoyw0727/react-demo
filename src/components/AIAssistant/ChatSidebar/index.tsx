/**
 * AI 助手 — 左侧会话历史侧边栏
 */
import React from 'react';
import { PlusOutlined, MoreOutlined, PushpinOutlined, DeleteOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import { useChatStore, sortedSessions } from '@/store/chat';
import styles from './index.module.less';

const ChatSidebar: React.FC = () => {
  const sessions = useChatStore((s) => s.sessions);
  const activeSessionId = useChatStore((s) => s.activeSessionId);
  const createSession = useChatStore((s) => s.createSession);
  const setActiveSession = useChatStore((s) => s.setActiveSession);
  const deleteSession = useChatStore((s) => s.deleteSession);
  const pinSession = useChatStore((s) => s.pinSession);
  const unpinSession = useChatStore((s) => s.unpinSession);

  const list = sortedSessions(sessions);

  return (
    <div className={styles.sidebar}>
      <button className={styles.newBtn} onClick={() => createSession()}>
        <PlusOutlined /> 新会话
      </button>
      <div className={styles.list}>
        {list.length === 0 && <div className={styles.empty}>暂无会话</div>}
        {list.map((s) => (
          <div
            key={s.id}
            className={`${styles.item} ${s.id === activeSessionId ? styles.active : ''}`}
            onClick={() => setActiveSession(s.id)}
          >
            <div className={styles.title}>{s.title}</div>
            <div className={styles.actions}>
              {s.pinned && <PushpinOutlined className={styles.pinnedIcon} />}
              <span className={styles.more}>
                <MoreOutlined />
                <span className={styles.menu}>
                  <span onClick={(e) => { e.stopPropagation(); s.pinned ? unpinSession(s.id) : pinSession(s.id); }}>
                    <PushpinOutlined /> {s.pinned ? '取消置顶' : '置顶'}
                  </span>
                  <span onClick={(e) => { e.stopPropagation(); Modal.confirm({ title: '删除会话', content: '确定删除该会话？', okText: '删除', okType: 'danger', cancelText: '取消', onOk: () => deleteSession(s.id) }); }}>
                    <DeleteOutlined /> 删除
                  </span>
                </span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatSidebar;
