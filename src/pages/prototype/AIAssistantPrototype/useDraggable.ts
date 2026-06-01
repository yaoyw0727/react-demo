/**
 * PROTOTYPE — 弹窗拖动 Hook
 * 鼠标按住标题栏拖动窗口，边界限制，位置持久化
 */
import { useState, useRef, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'ai-assistant-pos';

function loadPosition(defaultPos: { x: number; y: number }) {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch { /* ignore */ }
  return defaultPos;
}

export function useDraggable(defaultPos: { x: number; y: number }) {
  const [pos, setPos] = useState(() => loadPosition(defaultPos));
  const dragging = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const offset = useRef({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    dragging.current = true;
    startPos.current = { x: e.clientX, y: e.clientY };
    offset.current = { x: pos.x, y: pos.y };
    document.body.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';
  }, [pos]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      const dx = e.clientX - startPos.current.x;
      const dy = e.clientY - startPos.current.y;
      const newX = offset.current.x + dx;
      const newY = offset.current.y + dy;
      const maxX = window.innerWidth - 100;
      const maxY = window.innerHeight - 60;
      setPos({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      });
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
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pos));
  }, [pos]);

  return { pos, handleMouseDown };
}
