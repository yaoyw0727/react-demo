# feat: AI 助手聊天窗口骨架 + 工具栏

## Parent

#13 AI 助手弹窗功能 (docs/PRD-AI-ASSISTANT.md)

## What to build

实现 AI 助手聊天窗口的主体布局和顶部工具栏。

- 创建 `ChatWindow` 组件作为聊天窗口容器
- 顶部工具栏（`ChatToolbar`）包含：
  - 全屏按钮（复用 #15 的全屏功能）
  - 显示/折叠历史按钮（`MenuUnfoldOutlined` / `MenuFoldOutlined`）
- 左右分栏布局容器：
  - 左侧：会话历史区域（`ChatSidebar`，初始隐藏）
  - 右侧：聊天内容区域（`ChatContent`）
- 点击显示/折叠按钮时，侧边栏平滑展开/收起
- 侧边栏展开时宽度 280px，聊天区自适应剩余空间
- 使用 CSS transitions 实现展开/收起动画

## Acceptance criteria

- [ ] 聊天窗口显示顶部工具栏
- [ ] 工具栏包含全屏和显示/折叠历史按钮
- [ ] 点击显示/折叠按钮时侧边栏平滑展开/收起
- [ ] 侧边栏展开宽度为 280px
- [ ] 聊天区自适应填充剩余空间
- [ ] 展开/收起动画流畅

## Blocked by

- #13 AI 助手入口图标 + 基础弹窗
