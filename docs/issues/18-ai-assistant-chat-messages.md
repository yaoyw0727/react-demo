# feat: AI 助手聊天消息列表 + 输入发送

## Parent

#13 AI 助手弹窗功能 (docs/PRD-AI-ASSISTANT.md)

## What to build

实现 AI 助手右侧聊天区域的消息列表展示和底部输入发送功能。

- 创建 `ChatMessageList` 组件：
  - 消息按时间顺序排列，最新在底部
  - 用户消息气泡靠右显示（蓝色背景）
  - AI 消息气泡靠左显示（白色/灰色背景）
  - 消息内容支持 Markdown 渲染（使用 react-markdown + remark-gfm）
  - 消息列表区域可独立滚动
  - 新消息发送/接收时自动滚动到底部
  - 每条消息支持复制功能（悬浮显示复制按钮）
- 创建 `ChatInput` 组件：
  - 多行文本输入框（TextArea）
  - 右侧发送按钮
  - 按 Enter 键发送消息
  - 按 Shift+Enter 键换行
  - 输入为空时发送按钮禁用
- 完善 `useChatStore`：
  - 添加消息（addMessage）
  - 当前活跃会话关联消息列表

## Acceptance criteria

- [ ] 用户消息显示在右侧，AI 消息显示在左侧
- [ ] 消息气泡有明显的视觉区分（背景色不同）
- [ ] 消息内容正确渲染 Markdown 格式
- [ ] 消息列表可独立滚动
- [ ] 发送新消息后自动滚动到底部
- [ ] 输入框按 Enter 发送消息
- [ ] 输入框按 Shift+Enter 换行
- [ ] 输入为空时发送按钮禁用
- [ ] 悬浮在消息上时显示复制按钮
- [ ] 点击复制按钮将消息内容复制到剪贴板

## Blocked by

- #16 AI 助手聊天窗口骨架 + 工具栏
- #17 AI 助手会话历史侧边栏（增删改查）
