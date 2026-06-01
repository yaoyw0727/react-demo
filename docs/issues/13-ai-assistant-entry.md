# feat: AI 助手入口图标 + 基础弹窗

## Parent

#13 AI 助手弹窗功能 (docs/PRD-AI-ASSISTANT.md)

## What to build

在应用顶部导航栏的用户信息旁边添加 AI 助手入口图标，点击后弹出基础聊天窗口。

- 在 `TopMenuLayout` 和 `SiderMenuLayout` 的 Header 中，UserDropdown 前添加 AI 图标按钮
- 使用 `RobotOutlined` 或类似图标
- 点击图标打开基础弹窗，显示"AI 助手"标题
- 创建 `useChatStore` 基础结构（isOpen, toggleOpen）
- 弹窗初始位置：右下角偏移 24px
- 弹窗初始尺寸：宽度 480px，高度 600px

## Acceptance criteria

- [ ] 用户名旁边显示 AI 助手图标
- [ ] 点击图标打开弹窗，显示"AI 助手"标题
- [ ] 再次点击图标或关闭按钮可关闭弹窗
- [ ] 弹窗初始位置在右下角
- [ ] Zustand store 正确管理 open 状态
- [ ] 图标按钮有 hover 效果

## Blocked by

None - can start immediately
