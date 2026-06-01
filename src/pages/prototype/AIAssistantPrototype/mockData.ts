/**
 * PROTOTYPE — AI 助手 Mock 数据
 */
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ChatSession {
  id: string;
  title: string;
  pinned: boolean;
  createdAt: number;
  messages: ChatMessage[];
}

export const mockSessions: ChatSession[] = [
  {
    id: '1',
    title: '如何优化 React 性能？',
    pinned: true,
    createdAt: Date.now() - 1000 * 60 * 30,
    messages: [
      { id: 'm1', role: 'user', content: '如何优化 React 性能？', timestamp: Date.now() - 1000 * 60 * 30 },
      {
        id: 'm2', role: 'assistant',
        content: 'React 性能优化可以从以下几个方面入手：\n\n1. **使用 React.memo** 避免不必要的重渲染\n2. **useMemo / useCallback** 缓存计算结果和函数引用\n3. **虚拟列表** 处理大数据量渲染\n4. **代码分割** 使用 React.lazy 和 Suspense\n\n需要我详细展开某一点吗？',
        timestamp: Date.now() - 1000 * 60 * 29,
      },
    ],
  },
  {
    id: '2',
    title: '请帮我写一个防抖函数',
    pinned: false,
    createdAt: Date.now() - 1000 * 60 * 60,
    messages: [
      { id: 'm3', role: 'user', content: '请帮我写一个防抖函数', timestamp: Date.now() - 1000 * 60 * 60 },
      {
        id: 'm4', role: 'assistant',
        content: '```typescript\nfunction debounce<T extends (...args: any[]) => any>(\n  fn: T,\n  delay: number\n): (...args: Parameters<T>) => void {\n  let timer: ReturnType<typeof setTimeout> | null = null;\n  const debounced = (...args: Parameters<T>) => {\n    if (timer) clearTimeout(timer);\n    timer = setTimeout(() => {\n      fn(...args);\n      timer = null;\n    }, delay);\n  };\n  return debounced;\n}\n```\n\n使用示例：\n```typescript\nconst handleSearch = debounce((query: string) => {\n  fetchResults(query);\n}, 300);\n```',
        timestamp: Date.now() - 1000 * 60 * 59,
      },
    ],
  },
  {
    id: '3',
    title: '设计模式的六大原则',
    pinned: false,
    createdAt: Date.now() - 1000 * 60 * 120,
    messages: [
      { id: 'm5', role: 'user', content: '设计模式的六大原则是什么？', timestamp: Date.now() - 1000 * 60 * 120 },
      {
        id: 'm6', role: 'assistant',
        content: ' SOLID 原则：\n\n1. **单一职责原则 (SRP)** — 一个类只做一件事\n2. **开闭原则 (OCP)** — 对扩展开放，对修改关闭\n3. **里氏替换原则 (LSP)** — 子类必须能替换父类\n4. **接口隔离原则 (ISP)** — 接口要小而专\n5. **依赖倒置原则 (DIP)** — 依赖抽象而非具体实现\n\n另外还有一个 **迪米特法则 (LoD)** — 最少知识原则',
        timestamp: Date.now() - 1000 * 60 * 119,
      },
    ],
  },
  {
    id: '4',
    title: 'CSS Grid 布局教程',
    pinned: false,
    createdAt: Date.now() - 1000 * 60 * 180,
    messages: [
      { id: 'm7', role: 'user', content: 'CSS Grid 布局怎么用？', timestamp: Date.now() - 1000 * 60 * 180 },
      {
        id: 'm8', role: 'assistant',
        content: 'CSS Grid 布局的核心概念：\n\n```css\n.container {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 16px;\n}\n.item {\n  grid-column: span 2;\n}\n```\n\n- `grid-template-columns` 定义列\n- `grid-template-rows` 定义行\n- `gap` 设置间距\n- `grid-column / grid-row` 控制元素位置',
        timestamp: Date.now() - 1000 * 60 * 179,
      },
    ],
  },
  {
    id: '5',
    title: '什么是微前端？',
    pinned: false,
    createdAt: Date.now() - 1000 * 60 * 240,
    messages: [
      { id: 'm9', role: 'user', content: '什么是微前端？', timestamp: Date.now() - 1000 * 60 * 240 },
      {
        id: 'm10', role: 'assistant',
        content: '微前端是一种将前端应用分解为更小、更简单的独立模块的架构模式。\n\n**主要优点：**\n- 独立开发部署\n- 技术栈无关\n- 增量升级\n\n**主流方案：**\n- Module Federation\n- qiankun\n- single-spa',
        timestamp: Date.now() - 1000 * 60 * 239,
      },
    ],
  },
];

export const mockReply = [
  '这是一个很好的问题！让我为你详细解答：\n\n1. **首先**，需要理解问题的核心\n2. **其次**，选择合适的解决方案\n3. **最后**，进行验证和优化\n\n希望这个回答对你有帮助！',
  '我理解你的需求，以下是我的建议：\n\n```javascript\nconst solution = {\n  approach: "循序渐进",\n  steps: ["分析", "设计", "实现", "测试"],\n  priority: "high"\n};\n```\n\n你觉得这个方案怎么样？',
  '关于这个问题，有几点需要注意：\n\n> 重要的不是工具，而是思维方式\n\n- 保持代码简洁\n- 注重可维护性\n- 考虑边界情况\n\n有任何疑问欢迎继续提问！',
];
