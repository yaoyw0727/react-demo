/**
 * AI 助手 — API 服务
 * 流式 SSE 请求 + 会话历史管理
 */
import { get, del } from '@/services/request';

export async function sendMessage(
  message: string,
  sessionId: string,
  onChunk: (content: string) => void,
  onDone: (fullContent: string) => void,
  signal?: AbortSignal,
): Promise<void> {
  const res = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, sessionId }),
    signal,
  });
  if (!res.ok) throw new Error(`AI request failed: ${res.status}`);
  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let content = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const text = decoder.decode(value, { stream: true });
    for (const line of text.split('\n')) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') { onDone(content); return; }
        content += JSON.parse(data);
        onChunk(content);
      }
    }
  }
  onDone(content);
}

export interface AiHistoryItem {
  id: string;
  title: string;
  messages: { role: string; content: string }[];
  createdAt: string;
}

export const aiApi = {
  getHistory: () => get<AiHistoryItem[]>('/ai/history'),
  deleteHistory: () => del('/ai/history'),
};
