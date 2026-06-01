/**
 * AI 助手 — 弹窗四边缩放 Hook
 */
import { useState, useRef, useCallback, useEffect } from 'react';

export type Edge = 'top' | 'bottom' | 'left' | 'right'
  | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | null;

interface ResizeConfig {
  minWidth: number;
  minHeight: number;
  onResize: (rect: { x: number; y: number; width: number; height: number }) => void;
}

export function useResizable(config: ResizeConfig) {
  const { minWidth, minHeight, onResize } = config;
  const [activeEdge, setActiveEdge] = useState<Edge>(null);
  const edge = useRef<Edge>(null);
  const start = useRef({ x: 0, y: 0 });
  const rect = useRef({ x: 0, y: 0, width: 480, height: 600 });
  const elRef = useRef<HTMLDivElement | null>(null);

  const setEl = useCallback((el: HTMLDivElement | null) => { elRef.current = el; }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent, ege: Edge) => {
    if (!ege || !elRef.current) return;
    edge.current = ege;
    setActiveEdge(ege);
    start.current = { x: e.clientX, y: e.clientY };
    const cr = elRef.current.getBoundingClientRect();
    rect.current = { x: cr.left, y: cr.top, width: cr.width, height: cr.height };
    document.body.style.cursor = getEdgeCursor(ege);
    document.body.style.userSelect = 'none';
    e.preventDefault();
    e.stopPropagation();
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const ege = edge.current;
      if (!ege) return;
      const dx = e.clientX - start.current.x;
      const dy = e.clientY - start.current.y;
      let { x, y, width, height } = rect.current;

      if (ege.includes('left')) {
        const newW = Math.max(minWidth, width - dx);
        x += width - newW; width = newW;
      }
      if (ege.includes('right')) width = Math.max(minWidth, width + dx);
      if (ege.includes('top')) {
        const newH = Math.max(minHeight, height - dy);
        y += height - newH; height = newH;
      }
      if (ege.includes('bottom')) height = Math.max(minHeight, height + dy);

      onResize({ x, y, width, height });
    };
    const onUp = () => {
      if (!edge.current) return;
      edge.current = null;
      setActiveEdge(null);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [minWidth, minHeight, onResize]);

  return { setEl, handleMouseDown, activeEdge };
}

function getEdgeCursor(ege: Edge): string {
  switch (ege) {
    case 'top': case 'bottom': return 'ns-resize';
    case 'left': case 'right': return 'ew-resize';
    case 'top-left': case 'bottom-right': return 'nwse-resize';
    case 'top-right': case 'bottom-left': return 'nesw-resize';
    default: return 'default';
  }
}
