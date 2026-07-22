import { get, del } from '@/services/request';
import type { ProviderItem } from '@/store/aiModel';

export async function sendMessage(
  message: string,
  sessionId: string,
  onChunk: (content: string) => void,
  onDone: (fullContent: string) => void,
  signal?: AbortSignal,
  provider?: string,
  model?: string,
): Promise<void> {
  const res = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, sessionId, provider, model }),
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

export function fetchModels() {
  return get<ProviderItem[]>('/ai/models');
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
