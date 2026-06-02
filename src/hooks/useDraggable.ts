/**
 * AI 助手 — 弹窗拖动 Hook
 * @param topOffset 顶部最小间距，防止被浏览器工具栏遮挡
 */
import { useRef, useCallback, useEffect } from 'react';

export function useDraggable(
  defaultX: number,
  defaultY: number,
  onChange: (pos: { x: number; y: number }) => void,
  topOffset = 60,
) {
  const dragging = useRef(false);
  const start = useRef({ x: 0, y: 0 });
  const offset = useRef({ x: defaultX, y: defaultY });
  const posRef = useRef({ x: defaultX, y: defaultY });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    dragging.current = true;
    start.current = { x: e.clientX, y: e.clientY };
    offset.current = { ...posRef.current };
    document.body.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      const dx = e.clientX - start.current.x;
      const dy = e.clientY - start.current.y;
      const newX = Math.max(0, Math.min(offset.current.x + dx, window.innerWidth - 100));
      const newY = Math.max(topOffset, Math.min(offset.current.y + dy, window.innerHeight - 60));
      posRef.current = { x: newX, y: newY };
      onChange(posRef.current);
    };
    const onUp = () => {
      if (!dragging.current) return;
      dragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [onChange, topOffset]);

  return { handleMouseDown };
}
