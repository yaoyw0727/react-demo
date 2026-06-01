# feat: AI 助手会话历史侧边栏（增删改查）

## Parent

#13 AI 助手弹窗功能 (docs/PRD-AI-ASSISTANT.md)

## What to build

实现 AI 助手左侧会话历史侧边栏，支持会话的创建、删除、置顶等操作。

- 创建 `ChatSidebar` 组件，包含：
  - 顶部"新会话"按钮（`PlusOutlined`）
  - 会话列表（`SessionList`）
- 完善 `useChatStore`，实现：
  - 会话创建（createSession）
  - 会话切换（setActiveSession）
  - 会话删除（deleteSession，带确认弹窗）
  - 会话置顶/取消置顶（pinSession/unpinSession）
  - 会话按置顶状态和时间排序
- 会话列表项（`SessionItem`）：
  - 显示会话标题（取第一条用户消息或默认"新会话"）
  - 鼠标悬浮时右侧显示操作菜单（`MoreOutlined` 三点图标）
  - 操作菜单包含：置顶/取消置顶、删除
  - 当前活跃会话高亮显示
- 空状态：无任何会话时显示"开始新对话"提示

## Acceptance criteria

- [ ] 点击"新会话"按钮创建新会话并自动切换
- [ ] 会话列表按置顶优先、时间倒序排列
- [ ] 鼠标悬浮在会话上时显示操作菜单
- [ ] 点击置顶将会话固定到列表顶部
- [ ] 点击取消置顶恢复会话正常排序
- [ ] 点击删除弹出确认弹窗，确认后删除会话
- [ ] 当前活跃会话在列表中高亮显示
- [ ] 无任何会话时显示空状态提示
- [ ] Zustand store 正确持久化会话数据

## Blocked by

- #16 AI 助手聊天窗口骨架 + 工具栏
