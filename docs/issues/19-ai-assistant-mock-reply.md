# feat: AI 助手 Mock 回复 + 加载动画

## Parent

#13 AI 助手弹窗功能 (docs/PRD-AI-ASSISTANT.md)

## What to build

实现 AI 助手的 Mock 回复逻辑和加载状态展示。

- 创建 `useChatSession` Hook 处理会话逻辑：
  - 用户发送消息后，自动触发 Mock AI 回复
  - Mock 回复延迟 1-2 秒模拟网络请求
  - 回复内容使用预设的 Mock 文本（可包含 Markdown 格式）
- 消息状态管理：
  - `sending`：消息发送中（显示加载状态）
  - `sent`：消息已发送
  - `error`：发送失败（显示错误提示）
- AI 回复加载动画：
  - 打字机效果（逐字显示）
  - 或使用 antd Spin 组件显示加载中
- 错误处理：
  - Mock 随机失败场景（可配置）
  - 失败消息显示"重新生成"按钮
  - 点击重新生成重新触发 Mock 回复
- 会话标题自动更新：
  - 新会话的第一条用户消息自动成为会话标题
  - 标题截取前 20 个字符

## Acceptance criteria

- [ ] 用户发送消息后 1-2 秒内收到 AI Mock 回复
- [ ] AI 回复期间显示加载动画（打字机效果或 Spin）
- [ ] 消息状态正确切换（sending → sent）
- [ ] Mock 失败时消息显示错误状态
- [ ] 错误消息旁显示"重新生成"按钮
- [ ] 点击重新生成后重新触发 Mock 回复
- [ ] 新会话的第一条消息自动成为会话标题
- [ ] 会话标题不超过 20 个字符

## Blocked by

- #18 AI 助手聊天消息列表 + 输入发送
