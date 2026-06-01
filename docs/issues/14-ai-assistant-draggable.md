# feat: AI 助手弹窗拖动 + 位置持久化

## Parent

#13 AI 助手弹窗功能 (docs/PRD-AI-ASSISTANT.md)

## What to build

实现 AI 助手弹窗的拖动功能，并记住用户上次拖动的位置。

- 创建 `useDraggable` Hook，监听 mousedown/mousemove/mouseup 事件
- 弹窗标题栏作为拖动触发区域
- 使用 `transform: translate(x, y)` 实现拖动（性能优化）
- 拖动边界限制：不超出视口边缘
- 使用 Zustand persist 中间件将位置持久化到 localStorage
- 下次打开弹窗时恢复上次位置

## Acceptance criteria

- [ ] 鼠标按住标题栏拖动时弹窗跟随移动
- [ ] 松开鼠标后弹窗停在当前位置
- [ ] 拖动时弹窗不超出视口边界
- [ ] 关闭后重新打开，弹窗出现在上次位置
- [ ] 清除 localStorage 后弹窗回到默认位置
- [ ] 拖动过程流畅无明显卡顿

## Blocked by

- #13 AI 助手入口图标 + 基础弹窗
