# PRD: AI 助手弹窗功能

**状态**: ✅ 原型已完成 (Prototype)  
**优先级**: P1  
**创建日期**: 2026-05-22  
**关联文件**: `src/pages/prototype/AIAssistantPrototype/` (3 种交互变体)

---

## Problem Statement

当前系统缺乏内置的 AI 辅助能力，用户需要切换到其他工具才能获取智能帮助。希望在应用内集成 AI 助手，让用户在操作过程中随时获得智能问答、内容生成、代码建议等辅助功能，提升工作效率。

## Solution

在应用顶部导航栏的用户信息旁边添加 AI 助手入口图标，点击后弹出可拖动的 AI 聊天窗口。支持全屏模式、会话历史管理、置顶会话等功能，提供类似百度文心的对话式交互体验。

## User Stories

1. 作为登录用户，我希望在用户名旁边看到 AI 小助手图标，以便快速识别并访问 AI 功能
2. 作为用户，我希望点击 AI 图标后弹出聊天窗口，以便开始对话
3. 作为用户，我希望弹窗可以自由拖动，以便将其移动到我方便查看的位置
4. 作为用户，我希望弹窗记住上次拖动的位置，以便下次打开时不需要重新调整
5. 作为用户，我希望点击全屏按钮后弹窗铺满整个屏幕，以便获得更大的聊天区域
6. 作为用户，我希望在全屏模式下能方便地退出全屏，以便恢复窗口模式
7. 作为用户，我希望弹窗顶部有工具栏（全屏、显示/折叠历史等），以便快速切换视图
8. 作为用户，我希望点击工具栏的显示/折叠按钮可以展开/收起左侧会话历史栏，以便在需要时查看历史会话
9. 作为用户，我希望会话历史栏默认隐藏，以便获得更简洁的聊天界面
10. 作为用户，我希望在会话历史列表中看到每条会话的标题/摘要，以便快速识别内容
11. 作为用户，我希望鼠标悬浮在会话记录上时右侧出现操作菜单（3 个点），以便进行置顶、删除等操作
12. 作为用户，我希望可以置顶某条会话，以便将其固定在列表顶部方便快速访问
13. 作为用户，我希望可以取消置顶会话，以便恢复正常的排序
14. 作为用户，我希望可以删除不需要的会话，以便保持历史列表整洁
15. 作为用户，我希望删除会话前有确认提示，以免误删重要内容
16. 作为用户，我希望点击某条会话历史后能加载对应的聊天内容，以便继续之前的对话
17. 作为用户，我希望在聊天输入框中输入消息后能发送，以便与 AI 进行对话
18. 作为用户，我希望发送消息后能看到 AI 的回复，以便获取我需要的信息
19. 作为用户，我希望 AI 回复时有加载状态提示（如打字动画），以便知道 AI 正在处理
20. 作为用户，我希望聊天消息按时间顺序排列，最新的在底部，以便自然阅读
21. 作为用户，我希望用户消息和 AI 消息有明显的视觉区分（如不同背景色、头像），以便快速区分
22. 作为用户，我希望输入区有发送按钮，以便点击发送消息
23. 作为用户，我希望按 Enter 键能发送消息，以便提高输入效率
24. 作为用户，我希望按 Shift+Enter 能在输入框中换行，以便输入多行的内容
25. 作为用户，我希望开始新对话时有明确的入口（如新会话按钮），以便创建新的聊天会话
26. 作为用户，我希望新创建的会话自动成为当前活跃会话，以便立即开始对话
27. 作为用户，我希望聊天内容区域可以独立滚动，以便查看历史消息
28. 作为用户，我希望新消息发送或接收时自动滚动到底部，以便看到最新内容
29. 作为用户，我希望在移动端或窗口缩放时聊天界面能自适应布局，以便在不同设备上正常使用
30. 作为用户，我希望全屏模式下左侧历史栏和右侧聊天区能合理分配空间，以便同时查看历史和聊天
31. 作为用户，我希望窗口模式下聊天区有合适的宽高比，以便获得良好的阅读体验
32. 作为用户，我希望 AI 助手的视觉风格与现有应用保持一致，以便获得统一的体验
33. 作为用户，我希望会话历史有最大数量限制或清理机制，以免列表过长影响性能
34. 作为用户，我希望在没有任何会话时显示空状态提示，以便了解如何开始第一次对话
35. 作为用户，我希望聊天内容支持 Markdown 格式渲染，以便 AI 回复代码块、列表、表格等内容
36. 作为用户，我希望复制 AI 回复的内容，以便在其他地方使用
37. 作为用户，我希望在 AI 回复出错时能重新生成，以便获取正确的回答

## Implementation Decisions

### 模块拆分

| 模块 | 说明 | 类型 |
|------|------|------|
| `AIAssistant` | 入口图标 + 弹窗容器 | 新组件 |
| `ChatWindow` | 聊天窗口主体（含工具栏） | 新组件 |
| `ChatSidebar` | 左侧会话历史栏 | 新组件 |
| `ChatMessageList` | 右侧消息列表区 | 新组件 |
| `ChatInput` | 底部输入区 | 新组件 |
| `useChatStore` | 聊天状态管理（Zustand） | 新 Store |
| `useDraggable` | 弹窗拖动逻辑 | 新 Hook |
| `useChatSession` | 会话管理逻辑 | 新 Hook |

### 组件层次结构

```
AIAssistant (入口图标 + Modal/FloatPanel)
└── ChatWindow (聊天窗口容器)
    ├── ChatToolbar (顶部工具栏)
    │   ├── 全屏按钮
    │   └── 显示/折叠历史按钮
    ├── ChatSidebar (左侧会话历史，可折叠)
    │   ├── 新会话按钮
    │   └── SessionList (会话列表)
    │       └── SessionItem (单条会话，悬浮显示操作菜单)
    └── ChatContent (右侧聊天区)
        ├── ChatMessageList (消息列表)
        │   └── ChatMessage (单条消息，区分用户/AI)
        └── ChatInput (输入区)
            ├── TextArea
            └── 发送按钮
```

### 状态管理 (Zustand)

```typescript
interface ChatState {
  // 弹窗状态
  isOpen: boolean;
  isFullscreen: boolean;
  isSidebarOpen: boolean;
  position: { x: number; y: number };

  // 会话状态
  sessions: ChatSession[];
  activeSessionId: string | null;

  // 操作
  toggleOpen: () => void;
  toggleFullscreen: () => void;
  toggleSidebar: () => void;
  setPosition: (pos: { x: number; y: number }) => void;
  createSession: () => string;
  setActiveSession: (id: string) => void;
  deleteSession: (id: string) => void;
  pinSession: (id: string) => void;
  unpinSession: (id: string) => void;
  addMessage: (sessionId: string, message: ChatMessage) => void;
}
```

### 数据结构

```typescript
interface ChatSession {
  id: string;
  title: string;
  pinned: boolean;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessage[];
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  status: 'sending' | 'sent' | 'error';
}
```

### 技术决策

| 决策项 | 方案 | 理由 |
|--------|------|------|
| 弹窗实现 | 使用 antd Modal 自定义 + 拖动逻辑 | 复用 antd 样式体系 |
| 拖动实现 | 自定义 `useDraggable` Hook (mousedown/mousemove/mouseup) | 轻量，无额外依赖 |
| 全屏实现 | CSS `position: fixed; inset: 0` + 状态切换 | 简单可靠 |
| 状态管理 | Zustand + persist 中间件 | 与现有项目一致 |
| Markdown 渲染 | react-markdown + remark-gfm | 轻量，支持 GFM |
| 消息动画 | CSS transitions + antd Spin | 与现有体系一致 |
| 位置持久化 | localStorage (通过 Zustand persist) | 简单，无需后端 |

### 样式决策

- 使用 CSS Modules + Less，与现有项目一致
- 弹窗初始尺寸：宽度 480px，高度 600px
- 初始位置：右下角偏移 24px
- 全屏模式：`position: fixed; inset: 0; z-index: 1000`
- 左右分栏比例：侧边栏 280px，聊天区自适应
- 响应式断点：窗口宽度 < 768px 时侧边栏覆盖模式

### 集成点

| 位置 | 修改内容 |
|------|----------|
| `TopMenuLayout` Header | 在 UserDropdown 前添加 AI 助手图标 |
| `SiderMenuLayout` Header | 在 UserDropdown 前添加 AI 助手图标 |
| `ThemeConfig` | 可能需要包裹 AI 助手以获取主题上下文 |

## Testing Decisions

### 测试策略

- 只测试外部行为，不测试实现细节
- 优先测试用户交互流程（打开、关闭、拖动、发送消息）
- 状态管理逻辑单独测试（useChatStore）

### 测试模块

| 模块 | 测试内容 | 优先级 |
|------|----------|--------|
| `AIAssistant` | 图标点击打开/关闭弹窗 | P0 |
| `useDraggable` | 拖动后位置更新 | P0 |
| `useChatStore` | 会话创建、删除、置顶、切换 | P0 |
| `ChatInput` | 输入发送、Enter 发送、Shift+Enter 换行 | P1 |
| `ChatSidebar` | 展开/折叠、会话操作菜单 | P1 |
| `ChatMessageList` | 消息渲染、自动滚动 | P2 |

### 参考测试

- 参考 `src/components/ChartDetailModal/__tests__/` 的测试模式
- 使用 Vitest + Testing Library
- Mock AI 回复接口

## Out of Scope

以下功能不在本次 PRD 范围内，可作为后续迭代：

| 功能 | 说明 | 优先级 |
|------|------|--------|
| AI 接口对接 | 本次使用 Mock 数据，后续对接真实 API | P1 |
| 多轮对话上下文 | 本次仅实现基础会话，后续支持上下文记忆 | P2 |
| 文件上传/图片发送 | 本次仅支持文本消息 | P2 |
| 语音输入 | 后续可扩展 | P3 |
| 会话搜索 | 会话较多时支持搜索过滤 | P2 |
| 会话导出 | 导出聊天记录 | P3 |
| 多语言支持 | AI 助手界面国际化 | P1 |
| 深色模式适配 | 跟随主题切换 | P1 |

## Further Notes

### 百度文心参考

百度文心聊天页的核心特征：
- 左侧会话列表，右侧聊天区
- 消息气泡区分用户（右侧蓝色）和 AI（左侧白色/灰色）
- 输入区固定在底部，支持多行输入
- AI 回复支持代码块高亮、Markdown 渲染
- 打字机效果的加载动画

### 性能考虑

- 消息列表使用虚拟滚动（如消息数量 > 100）
- 会话历史懒加载
- 拖动时使用 `transform` 而非 `top/left` 以提升性能

### 无障碍

- 工具栏按钮添加 aria-label
- 键盘导航支持（Tab 切换焦点）
- 屏幕阅读器友好

---

**文档结束**
