/**
 * PROTOTYPE — 底部浮动切换器
 * 用于在多个 UI 变体之间切换，仅在开发环境显示
 */
import React, { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import styles from './PrototypeSwitcher.module.less';

interface PrototypeSwitcherProps {
  variants: { key: string; label: string }[];
  current: string;
}

export const PrototypeSwitcher: React.FC<PrototypeSwitcherProps> = ({ variants, current }) => {
  const navigate = useNavigate();

  const currentIndex = variants.findIndex((v) => v.key === current);

  const cycle = useCallback(
    (direction: -1 | 1) => {
      const nextIndex = (currentIndex + direction + variants.length) % variants.length;
      const nextVariant = variants[nextIndex].key;
      const url = new URL(window.location.href);
      url.searchParams.set('variant', nextVariant);
      navigate(url.pathname + url.search, { replace: true });
    },
    [currentIndex, variants, navigate]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement).isContentEditable) return;
      if (e.key === 'ArrowLeft') cycle(-1);
      if (e.key === 'ArrowRight') cycle(1);
    },
    [cycle]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (import.meta.env.PROD) return null;

  const currentLabel = variants[currentIndex]?.label || current;

  return (
    <div className={styles.switcher}>
      <button className={styles.arrow} onClick={() => cycle(-1)}>
        <LeftOutlined />
      </button>
      <span className={styles.label}>
        {current} — {currentLabel}
      </span>
      <button className={styles.arrow} onClick={() => cycle(1)}>
        <RightOutlined />
      </button>
    </div>
  );
};
