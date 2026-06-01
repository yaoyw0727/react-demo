/**
 * AI 助手 — 入口组件
 * 顶部导航栏入口图标 + 弹窗容器（拖动 + 四边缩放）
 */
import React from 'react';
import {
  RobotOutlined, CloseOutlined, FullscreenOutlined, FullscreenExitOutlined,
  MenuFoldOutlined, MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useChatStore } from '@/store/chat';
import { useDraggable } from '@/hooks/useDraggable';
import { useResizable } from '@/hooks/useResizable';
import ChatWindow from './ChatWindow';
import styles from './index.module.less';

const AIAssistant: React.FC = () => {
  const store = useChatStore();
  const { handleMouseDown } = useDraggable(store.position.x, store.position.y, (p) => store.setPosition(p));
  const { setEl, handleMouseDown: handleResizeDown, activeEdge } = useResizable({
    minWidth: 480, minHeight: 600,
    onResize: (rect) => { store.setPosition({ x: rect.x, y: rect.y }); store.setWindowSize({ width: rect.width, height: rect.height }); },
  });

  return (
    <>
      <button className={styles.entryBtn} onClick={() => store.toggleOpen()} title="AI 助手">
        <RobotOutlined />
      </button>

      {store.isOpen && (
        <div
          ref={setEl}
          className={`${styles.chatWindow} ${store.isFullscreen ? styles.fullscreen : ''}`}
          style={store.isFullscreen ? {} : { left: store.position.x, top: store.position.y, width: store.windowSize.width, height: store.windowSize.height }}
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

          {/* Title bar — drag handle */}
          <div className={styles.titleBar} onMouseDown={store.isFullscreen ? undefined : handleMouseDown}>
            <div className={styles.titleLeft}>
              <RobotOutlined className={styles.robotIcon} />
              <span>AI 助手</span>
            </div>
            <div className={styles.titleRight}>
              <button className={styles.toolBtn} onClick={() => store.toggleSidebar()} title={store.isSidebarOpen ? '折叠历史' : '展开历史'}>
                {store.isSidebarOpen ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
              </button>
              <button className={styles.toolBtn} onClick={() => store.toggleFullscreen()} title={store.isFullscreen ? '退出全屏' : '全屏'}>
                {store.isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
              </button>
              <button className={styles.toolBtn} onClick={() => store.toggleOpen()} title="关闭"><CloseOutlined /></button>
            </div>
          </div>

          <ChatWindow />
        </div>
      )}
    </>
  );
};

export default AIAssistant;
