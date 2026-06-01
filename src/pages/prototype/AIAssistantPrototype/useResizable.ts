/**
 * PROTOTYPE — 侧边栏宽度拖拽调整 Hook
 */
import { useState, useRef, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'ai-assistant-sidebar-width';

export function useResizable(defaultWidth = 220, minWidth = 120, maxWidth = 400) {
  const loadWidth = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return Math.max(minWidth, Math.min(maxWidth, JSON.parse(saved)));
    } catch { /* ignore */ }
    return defaultWidth;
  };

  const [width, setWidth] = useState(loadWidth);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(width);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dragging.current = true;
    startX.current = e.clientX;
    startWidth.current = width;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, [width]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      const newWidth = Math.max(minWidth, Math.min(maxWidth, startWidth.current + (e.clientX - startX.current)));
      setWidth(newWidth);
    };
    const handleMouseUp = () => {
      if (!dragging.current) return;
      dragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [minWidth, maxWidth]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(width));
  }, [width]);

  return { width, handleMouseDown };
}
