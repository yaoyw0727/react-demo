# 页面需求文档 - 首页 (Home)

**页面路径**: `/`  
**路由配置**: `{ path: '/', component: Home, title: '首页', labelKey: 'menu.home', icon: <HomeOutlined /> }`  
**滚动模式**: 模式一（整区滚动）  
**优先级**: P0

---

## 1. 页面概述

### 1.1 页面定位

首页是用户登录系统后看到的第一个页面，承担以下职责：
- 展示系统欢迎信息和基本介绍
- 演示 Zustand 状态管理的使用方式
- 提供快速导航到其他页面的入口

### 1.2 目标用户

所有访问系统的用户，包括首次访问的新用户和经常使用的老用户。

### 1.3 核心价值

| 价值维度 | 说明 |
|---------|------|
| **信息传达** | 让用户快速了解系统功能 |
| **功能演示** | 通过交互式示例展示状态管理能力 |
| **导航引导** | 提供到其他页面的快捷入口 |

---

## 2. 功能需求

### 2.1 功能列表

| 功能项 | 说明 | 优先级 | 状态 |
|-------|------|--------|------|
| 欢迎标题 | 显示"首页"标题 | P0 | 已实现 |
| 欢迎描述 | 显示欢迎信息 | P0 | 已实现 |
| 状态管理示例 | 计数器功能演示 | P1 | 已实现 |
| 路由导航示例 | 跳转到关于页的链接 | P1 | 已实现 |

### 2.2 详细功能说明

#### 2.2.1 欢迎标题

**功能描述**: 显示页面主标题"首页"

**交互说明**:
- 使用 `Typography.Title` 组件，级别为 `level={2}`
- 标题文字通过国际化 key `menu.home` 获取
- 应用 CSS Module 样式 `styles.title`

**样式要求**:
- 标题居中显示
- 使用全局主题色

#### 2.2.2 欢迎描述

**功能描述**: 显示欢迎信息段落

**交互说明**:
- 使用 `Typography.Paragraph` 组件
- 文字通过国际化 key `home.welcome` 获取
- 支持中英文切换

#### 2.2.3 状态管理示例

**功能描述**: 演示 Zustand 状态管理的计数器功能

**数据模型**:
```typescript
interface CounterState {
  count: number;        // 当前计数值
  increment: () => void;    // 增加计数
  decrement: () => void;    // 减少计数
  reset: () => void;        // 重置计数
}
```

**交互说明**:

| 操作 | 行为 | 按钮样式 |
|-----|------|---------|
| 增加 | 点击后 count + 1 | `type="primary"` 主按钮 |
| 减少 | 点击后 count - 1 | 默认按钮 |
| 重置 | 点击后 count 归零 | `danger` 危险按钮 |

**显示内容**:
- 当前计数值显示格式: `home.currentCount: {count}`
- 三个按钮水平排列在 `Space` 组件中
- 按钮组应用 `styles.buttonGroup` 样式

**状态持久化**: 
- 计数器状态**不**持久化到 localStorage
- 页面刷新后计数器重置为初始值

#### 2.2.4 路由导航示例

**功能描述**: 提供跳转到关于页的链接

**交互说明**:
- 使用 React Router 的 `Link` 组件包裹 `Button`
- 目标路径: `/about`
- 按钮样式: `color="primary" variant="link"` 链接样式按钮
- 按钮文字通过国际化 key `home.goToAbout` 获取

---

## 3. UI/UX 设计

### 3.1 页面布局

```
┌─────────────────────────────────────┐
│           首页 (标题)                │
│                                     │
│  欢迎描述文字段落                     │
│                                     │
│  ┌─ 状态管理示例 ────────────────┐   │
│  │  当前计数: 0                  │   │
│  │  [增加] [减少] [重置]          │   │
│  └──────────────────────────────┘   │
│                                     │
│  ┌─ 路由示例 ────────────────────┐   │
│  │  [前往关于页 →]                │   │
│  └──────────────────────────────┘   │
└─────────────────────────────────────┘
```

### 3.2 组件层次结构

```
Home
├── Title (level=2) - 首页标题
├── Paragraph - 欢迎描述
├── Section (状态管理示例)
│   ├── Title (level=4) - 状态管理示例标题
│   ├── Paragraph - 当前计数显示
│   └── Space - 按钮组
│       ├── Button (primary) - 增加
│       ├── Button - 减少
│       └── Button (danger) - 重置
└── Section (路由示例)
    ├── Title (level=4) - 路由示例标题
    └── Space
        └── Link → Button (link) - 前往关于页
```

### 3.3 样式规范

**CSS Module 类名**:

| 类名 | 用途 | 说明 |
|-----|------|------|
| `container` | 页面容器 | 控制页面整体布局和间距 |
| `title` | 标题样式 | 标题对齐和间距 |
| `section` | 区块容器 | 每个功能区块的边距和背景 |
| `buttonGroup` | 按钮组 | 按钮间距和对齐 |

---

## 4. 技术实现

### 4.1 使用的依赖

| 依赖 | 用途 |
|-----|------|
| `react` | UI 框架 |
| `antd` | Button, Space, Typography 组件 |
| `react-router-dom` | Link 组件用于路由跳转 |
| `react-i18next` | useTranslation Hook 用于国际化 |
| `../../store/counter` | useCounterStore 状态管理 |
| `./index.module.less` | CSS Module 样式 |

### 4.2 状态管理

**Store**: `useCounterStore`

**状态结构**:
```typescript
{
  count: number,
  increment: () => void,
  decrement: () => void,
  reset: () => void
}
```

**使用方式**:
```typescript
const { count, increment, decrement, reset } = useCounterStore();
```

### 4.3 国际化 Keys

| Key | 中文 | 英文 |
|-----|------|------|
| `menu.home` | 首页 | Home |
| `home.welcome` | 欢迎使用 React 管理后台系统 | Welcome to React Admin System |
| `home.stateExample` | 状态管理示例 | State Management Example |
| `home.currentCount` | 当前计数 | Current Count |
| `home.routeExample` | 路由示例 | Route Example |
| `home.goToAbout` | 前往关于页 | Go to About Page |
| `common.increment` | 增加 | Increment |
| `common.decrement` | 减少 | Decrement |
| `common.reset` | 重置 | Reset |

### 4.4 文件结构

```
src/pages/Home/
├── index.tsx              # 页面组件
├── index.module.less      # 页面样式
└── locales/               # 国际化文件（如配置 language 项）
    ├── zh-cn/zh-cn.json
    └── en-us/en-us.json
```

---

## 5. 交互流程

### 5.1 计数器操作流程

```
用户点击 [增加] → count + 1 → 页面更新显示新计数
用户点击 [减少] → count - 1 → 页面更新显示新计数
用户点击 [重置] → count = 0 → 页面更新显示 0
```

### 5.2 页面导航流程

```
用户点击 [前往关于页] → React Router 导航 → 渲染 About 页面
```

---

## 6. 性能要求

| 指标 | 要求 | 说明 |
|-----|------|------|
| 首屏渲染 | < 100ms | 页面组件简单，无复杂计算 |
| 状态更新 | < 16ms | Zustand 状态更新应在一帧内完成 |
| 路由跳转 | < 300ms | React Router 客户端路由 |

---

## 7. 测试要点

### 7.1 功能测试

| 测试项 | 预期结果 |
|-------|---------|
| 页面加载显示欢迎标题 | 显示"首页"标题 |
| 计数器初始值为 0 | 显示"当前计数: 0" |
| 点击增加按钮 | 计数 + 1 |
| 点击减少按钮 | 计数 - 1 |
| 点击重置按钮 | 计数归零 |
| 点击前往关于页 | 成功导航到 /about |
| 切换语言 | 所有文字正确切换 |

### 7.2 样式测试

| 测试项 | 预期结果 |
|-------|---------|
| 标题居中对齐 | 标题在页面中央 |
| 按钮组水平排列 | 三个按钮在同一行 |
| 主题色切换 | 主按钮颜色跟随主题色变化 |
| 深色模式 | 背景色和文字色正确切换 |

### 7.3 兼容性测试

| 浏览器 | 测试要点 |
|-------|---------|
| Chrome 90+ | 所有功能正常 |
| Firefox 88+ | 所有功能正常 |
| Safari 14+ | 所有功能正常 |
| Edge 90+ | 所有功能正常 |

---

## 8. 扩展规划

### 8.1 短期优化

| 功能 | 说明 | 优先级 |
|-----|------|--------|
| 数据统计卡片 | 显示系统关键指标（用户数、订单数等） | P1 |
| 快捷操作入口 | 常用功能的快捷按钮 | P1 |
| 最近活动记录 | 显示用户最近的操作记录 | P2 |

### 8.2 中期规划

| 功能 | 说明 | 优先级 |
|-----|------|--------|
| 数据可视化图表 | 集成 ECharts 显示趋势图 | P2 |
| 个性化欢迎语 | 根据用户角色显示不同欢迎语 | P2 |
| 系统公告 | 显示系统通知和更新信息 | P2 |

---

**文档结束**
