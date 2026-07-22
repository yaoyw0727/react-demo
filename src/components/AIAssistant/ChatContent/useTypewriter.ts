import { useState, useEffect, useRef } from 'react';

export function useTypewriter(
  fullContent: string,
  isStreaming: boolean,
  speed: number = 25,
): string {
  const posRef = useRef(fullContent.length);
  const fullRef = useRef(fullContent);
  const [displayed, setDisplayed] = useState(() => {
    posRef.current = fullContent.length;
    return fullContent;
  });

  useEffect(() => {
    fullRef.current = fullContent;
  }, [fullContent]);

  useEffect(() => {
    if (!isStreaming) {
      setDisplayed(fullContent);
      posRef.current = fullContent.length;
      return;
    }
  }, [isStreaming, fullContent]);

  useEffect(() => {
    if (!isStreaming) return;

    const id = setInterval(() => {
      if (posRef.current < fullRef.current.length) {
        posRef.current += 1;
        setDisplayed(fullRef.current.slice(0, posRef.current));
      }
    }, speed);

    return () => clearInterval(id);
  }, [isStreaming, speed]);

  return displayed;
}
