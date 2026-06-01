/**
 * AI 助手 — Mock 数据
 * 初始会话数据 + 预设回复
 */
import type { ChatSession } from './types';

export const mockSessions: ChatSession[] = [
  {
    id: '1', title: '如何优化 React 性能？', pinned: true,
    createdAt: Date.now() - 1000 * 60 * 30, updatedAt: Date.now() - 1000 * 60 * 29,
    messages: [
      { id: 'm1', role: 'user', content: '如何优化 React 性能？', timestamp: Date.now() - 1000 * 60 * 30, status: 'sent' },
      {
        id: 'm2', role: 'assistant',
        content: 'React 性能优化可以从以下几个方面入手：\n\n1. **使用 React.memo** 避免不必要的重渲染\n2. **useMemo / useCallback** 缓存计算结果和函数引用\n3. **虚拟列表** 处理大数据量渲染\n4. **代码分割** 使用 React.lazy 和 Suspense\n\n需要我详细展开某一点吗？',
        timestamp: Date.now() - 1000 * 60 * 29, status: 'sent',
      },
    ],
  },
  {
    id: '2', title: '请帮我写一个防抖函数', pinned: false,
    createdAt: Date.now() - 1000 * 60 * 60, updatedAt: Date.now() - 1000 * 60 * 59,
    messages: [
      { id: 'm3', role: 'user', content: '请帮我写一个防抖函数', timestamp: Date.now() - 1000 * 60 * 60, status: 'sent' },
      {
        id: 'm4', role: 'assistant',
        content: '```typescript\nfunction debounce<T extends (...args: any[]) => any>(\n  fn: T,\n  delay: number\n): (...args: Parameters<T>) => void {\n  let timer: ReturnType<typeof setTimeout> | null = null;\n  const debounced = (...args: Parameters<T>) => {\n    if (timer) clearTimeout(timer);\n    timer = setTimeout(() => {\n      fn(...args);\n      timer = null;\n    }, delay);\n  };\n  return debounced;\n}\n```',
        timestamp: Date.now() - 1000 * 60 * 59, status: 'sent',
      },
    ],
  },
  {
    id: '3', title: '设计模式的六大原则', pinned: false,
    createdAt: Date.now() - 1000 * 60 * 120, updatedAt: Date.now() - 1000 * 60 * 119,
    messages: [
      { id: 'm5', role: 'user', content: '设计模式的六大原则是什么？', timestamp: Date.now() - 1000 * 60 * 120, status: 'sent' },
      {
        id: 'm6', role: 'assistant',
        content: '**SOLID 原则：**\n\n1. **单一职责 (SRP)** — 一个类只做一件事\n2. **开闭原则 (OCP)** — 对扩展开放，对修改关闭\n3. **里氏替换 (LSP)** — 子类必须能替换父类\n4. **接口隔离 (ISP)** — 接口要小而专\n5. **依赖倒置 (DIP)** — 依赖抽象而非具体实现\n\n另外还有**迪米特法则 (LoD)** — 最少知识原则',
        timestamp: Date.now() - 1000 * 60 * 119, status: 'sent',
      },
    ],
  },
];

const REPLIES = [
  '这是一个很好的问题！让我为你详细解答：\n\n1. **首先**，需要理解问题的核心\n2. **其次**，选择合适的解决方案\n3. **最后**，进行验证和优化\n\n希望这个回答对你有帮助！',
  '我理解你的需求，以下是我的建议：\n\n```javascript\nconst solution = {\n  approach: "循序渐进",\n  steps: ["分析", "设计", "实现", "测试"],\n  priority: "high"\n};\n```\n\n你觉得这个方案怎么样？',
  '关于这个问题，有几点需要注意：\n\n> 重要的不是工具，而是思维方式\n\n- 保持代码简洁\n- 注重可维护性\n- 考虑边界情况\n\n有任何疑问欢迎继续提问！',
  '这是一个技术选型问题，我的建议是：\n\n| 方案 | 优点 | 缺点 |\n|------|------|------|\n| 方案 A | 成熟稳定 | 学习成本高 |\n| 方案 B | 上手快 | 生态较小 |\n\n根据你的团队情况做选择。',
  '让我用代码示例来说明：\n\n```python\ndef fibonacci(n):\n    a, b = 0, 1\n    for _ in range(n):\n        yield a\n        a, b = b, a + b\n```\n\n这是生成器实现，内存友好。',
];

export function getMockReply(): string {
  return REPLIES[Math.floor(Math.random() * REPLIES.length)];
}
