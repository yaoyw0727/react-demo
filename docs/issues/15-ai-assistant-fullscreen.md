# feat: AI 助手全屏模式 + 响应式布局

## Parent

#13 AI 助手弹窗功能 (docs/PRD-AI-ASSISTANT.md)

## What to build

实现 AI 助手弹窗的全屏模式和响应式布局适配。

- 工具栏添加全屏按钮（`FullscreenOutlined` / `FullscreenExitOutlined`）
- 点击全屏按钮后弹窗铺满整个视口（`position: fixed; inset: 0`）
- 全屏模式下 z-index 提升到最顶层
- 按 Esc 键可退出全屏
- 响应式适配：窗口宽度 < 768px 时，侧边栏采用覆盖模式而非挤压模式
- 全屏/窗口切换时平滑过渡动画

## Acceptance criteria

- [ ] 点击全屏按钮后弹窗铺满整个屏幕
- [ ] 全屏模式下点击退出按钮恢复窗口模式
- [ ] 按 Esc 键可退出全屏
- [ ] 窗口宽度 < 768px 时侧边栏以覆盖模式显示
- [ ] 全屏/窗口切换时有平滑过渡动画
- [ ] 全屏模式下内容区域正确填充可用空间

## Blocked by

- #13 AI 助手入口图标 + 基础弹窗
