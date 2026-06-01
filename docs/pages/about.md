# 页面需求文档 - 关于页 (About)

**页面路径**: `/about`  
**路由配置**: `{ path: '/about', component: About, title: '关于', labelKey: 'menu.about', icon: <InfoCircleOutlined /> }`  
**滚动模式**: 模式一（整区滚动）  
**优先级**: P0

---

## 1. 页面概述

### 1.1 页面定位

关于页是系统的信息展示页面，主要职责：
- 介绍系统的基本信息
- 展示项目使用的技术栈
- 提供返回首页的快捷入口

### 1.2 目标用户

所有访问系统的用户，特别是想了解系统技术背景的用户。

### 1.3 核心价值

| 价值维度 | 说明 |
|---------|------|
| **信息透明** | 让用户了解系统使用的技术 |
| **技术展示** | 展示项目的技术栈选择 |
| **导航引导** | 提供返回首页的快捷方式 |

---

## 2. 功能需求

### 2.1 功能列表

| 功能项 | 说明 | 优先级 | 状态 |
|-------|------|--------|------|
| 页面标题 | 显示"关于"标题 | P0 | 已实现 |
| 系统描述 | 显示系统介绍文字 | P0 | 已实现 |
| 技术栈列表 | 展示使用的技术栈 | P0 | 已实现 |
| 返回首页按钮 | 导航回首页 | P1 | 已实现 |

### 2.2 详细功能说明

#### 2.2.1 页面标题

**功能描述**: 显示页面主标题"关于"

**交互说明**:
- 使用 `Typography.Title` 组件，级别为 `level={2}`
- 标题文字通过国际化 key `menu.about` 获取
- 应用 CSS Module 样式 `styles.title`

#### 2.2.2 系统描述

**功能描述**: 显示系统介绍段落

**交互说明**:
- 使用 `Typography.Paragraph` 组件
- 文字通过国际化 key `about.description` 获取
- 支持中英文切换

#### 2.2.3 技术栈列表

**功能描述**: 以列表形式展示系统使用的技术栈

**技术栈清单**:

| 序号 | 技术名称 | 国际化 Key | 说明 |
|-----|---------|-----------|------|
| 1 | React | `about.techStack.react` | UI 框架 |
| 2 | Vite | `about.techStack.vite` | 构建工具 |
| 3 | TypeScript | `about.techStack.typescript` | 类型安全 |
| 4 | Ant Design | `about.techStack.antd` | UI 组件库 |
| 5 | React Router | `about.techStack.router` | 客户端路由 |
| 6 | Zustand | `about.techStack.zustand` | 状态管理 |

**交互说明**:
- 使用 `<ul>` 无序列表渲染
- 应用 `styles.list` 样式类
- 每个技术栈作为 `<li>` 列表项
- 列表项文字通过对应的国际化 key 获取

#### 2.2.4 返回首页按钮

**功能描述**: 提供导航回首页的按钮

**交互说明**:
- 使用 React Router 的 `Link` 组件包裹 `Button`
- 目标路径: `/`
- 按钮样式: `type="primary"` 主按钮
- 按钮文字通过国际化 key `common.backToHome` 获取
- 按钮组使用 `Space` 组件包裹，应用 `styles.buttonGroup` 样式

---

## 3. UI/UX 设计

### 3.1 页面布局

```
┌─────────────────────────────────────┐
│           关于 (标题)                │
│                                     │
│  系统介绍描述文字段落                 │
│                                     │
│  技术栈列表:                         │
│  • React                            │
│  • Vite                             │
│  • TypeScript                       │
│  • Ant Design                       │
│  • React Router                     │
│  • Zustand                          │
│                                     │
│  [← 返回首页]                       │
└─────────────────────────────────────┘
```

### 3.2 组件层次结构

```
About
├── Title (level=2) - 关于标题
└── div.content
    ├── Paragraph - 系统描述
    ├── ul.list - 技术栈列表
    │   ├── li - React
    │   ├── li - Vite
    │   ├── li - TypeScript
    │   ├── li - Ant Design
    │   ├── li - React Router
    │   └── li - Zustand
    └── Space.buttonGroup
        └── Link → Button (primary) - 返回首页
```

### 3.3 样式规范

**CSS Module 类名**:

| 类名 | 用途 | 说明 |
|-----|------|------|
| `container` | 页面容器 | 控制页面整体布局和间距 |
| `title` | 标题样式 | 标题对齐和间距 |
| `content` | 内容容器 | 内容区域的内边距 |
| `list` | 列表样式 | 技术栈列表的样式 |
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
| `./index.module.less` | CSS Module 样式 |

### 4.2 状态管理

本页面**不使用**全局状态管理，为纯展示页面。

### 4.3 国际化 Keys

| Key | 中文 | 英文 |
|-----|------|------|
| `menu.about` | 关于 | About |
| `about.description` | 本项目是一个基于 React 的技术演示项目... | This is a technical demo project based on React... |
| `about.techStack.react` | React - UI 框架 | React - UI Framework |
| `about.techStack.vite` | Vite - 构建工具 | Vite - Build Tool |
| `about.techStack.typescript` | TypeScript - 类型安全 | TypeScript - Type Safety |
| `about.techStack.antd` | Ant Design - UI 组件库 | Ant Design - UI Component Library |
| `about.techStack.router` | React Router - 客户端路由 | React Router - Client Routing |
| `about.techStack.zustand` | Zustand - 状态管理 | Zustand - State Management |
| `common.backToHome` | 返回首页 | Back to Home |

### 4.4 文件结构

```
src/pages/About/
├── index.tsx              # 页面组件
├── index.module.less      # 页面样式
└── locales/               # 国际化文件（如配置 language 项）
    ├── zh-cn/zh-cn.json
    └── en-us/en-us.json
```

---

## 5. 交互流程

### 5.1 页面导航流程

```
从其他页面点击关于菜单 → React Router 导航 → 渲染 About 页面
用户点击 [返回首页] → React Router 导航 → 渲染 Home 页面
```

### 5.2 语言切换流程

```
用户切换语言 → i18n 更新 → 页面文字自动切换（无需刷新）
```

---

## 6. 性能要求

| 指标 | 要求 | 说明 |
|-----|------|------|
| 首屏渲染 | < 100ms | 纯展示页面，无复杂逻辑 |
| 语言切换 | < 50ms | i18n 资源已预加载 |
| 路由跳转 | < 300ms | React Router 客户端路由 |

---

## 7. 测试要点

### 7.1 功能测试

| 测试项 | 预期结果 |
|-------|---------|
| 页面加载显示关于标题 | 显示"关于"标题 |
| 显示系统描述文字 | 显示介绍文字段落 |
| 显示 6 个技术栈 | 列表包含 6 个技术项 |
| 点击返回首页按钮 | 成功导航到 / |
| 切换语言 | 所有文字正确切换 |

### 7.2 样式测试

| 测试项 | 预期结果 |
|-------|---------|
| 标题居中对齐 | 标题在页面中央 |
| 列表样式正确 | 技术栈列表有缩进和项目符号 |
| 主题色切换 | 返回按钮颜色跟随主题色变化 |
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
| 版本号显示 | 显示当前系统版本 | P2 |
| 技术栈图标 | 为每个技术栈添加官方图标 | P2 |
| 团队信息 | 显示开发团队成员 | P2 |

### 8.2 中期规划

| 功能 | 说明 | 优先级 |
|-----|------|--------|
| 依赖版本详情 | 显示各依赖的具体版本号 | P2 |
| 开源协议 | 显示项目使用的开源协议 | P2 |
| 更新日志链接 | 链接到系统更新日志页面 | P2 |

---

**文档结束**
