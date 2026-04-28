# React App

一个基于 React + Vite + Ant Design 的管理后台模板应用。

## 项目简介

本项目是一个现代化的管理后台系统模板，采用最新的 React 技术栈构建，提供灵活的主题配置和国际化支持。系统采用声明式路由配置，支持菜单嵌套和动态路由。

## 功能特性

- **双布局模式**：支持顶部菜单和侧边栏菜单两种布局模式，可根据需求自由切换
- **主题定制**：内置深色/浅色模式，支持多种主题色选择（拂晓蓝、极光绿、酱紫、薄暮、日暮、明青）
- **国际化**：支持中文和英文双语切换，配置即时生效
- **状态持久化**：外观设置和语言偏好自动保存到 localStorage，刷新页面不丢失
- **嵌套路由**：支持多级菜单嵌套，完善的路由结构和面包屑导航
- **响应式设计**：适配不同屏幕尺寸，侧边栏模式支持折叠展开
- **内容区滚动**：各页面内容区独立滚动，面包屑固定显示

## 技术栈

- **框架**: React 19 + TypeScript
- **构建工具**: Vite 8
- **UI 组件库**: Ant Design 6
- **路由**: React Router 7
- **状态管理**: Zustand 5
- **国际化**: i18next + react-i18next
- **样式**: Less + CSS Modules

## 项目结构

```
src/
├── assets/                 # 静态资源
│   ├── images/            # 图片资源（如国旗图标）
│   └── styles/           # 全局样式
├── components/           # 公共组件
│   ├── ThemeConfig/     # 主题配置组件
│   └── UserDropdown/    # 用户下拉菜单
├── constants/            # 常量定义
├── layouts/             # 布局组件
│   ├── MainLayout/      # 主布局入口
│   ├── components/      # 布局子组件
│   │   ├── TopMenuLayout/       # 顶部菜单布局
│   │   └── SiderMenuLayout/   # 侧边栏菜单布局
│   ├── hooks/           # 布局 Hooks
│   │   └── useMenu.tsx  # 菜单状态管理
│   └── tools.tsx        # 布局工具函数
├── pages/               # 页面组件
│   ├── Settings/       # 设置页面
│   │   ├── AppearancePanel/     # 外观设置面板
│   │   ├── LanguagePanel/        # 语言设置面板
│   │   └── components/           # 设置子组件
│   └── ...              # 其他业务页面
├── routes/              # 路由配置
│   ├── index.tsx       # 路由定义
│   └── tools.ts        # 路由工具函数
├── store/              # 状态管理
│   ├── appearance.ts   # 外观状态（Zustand）
│   └── language.ts    # 语言状态（Zustand）
├── utils/              # 工具函数
│   └── i18n.ts        # 国际化配置
├── App.tsx             # 应用入口组件
├── main.tsx            # 应用启动入口
└── constants/         # 常量定义
```

## 开始使用

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 主要页面说明

| 路径 | 页面 | 说明 |
|------|------|------|
| `/` | 首页 | 系统首页 |
| `/about` | 关于 | 系统介绍 |
| `/system/user` | 用户管理 | 系统用户管理 |
| `/system/role` | 角色管理 | 系统角色管理 |
| `/product/list` | 产品列表 | 产品列表管理 |
| `/product/category` | 产品分类 | 产品分类管理 |
| `/settings` | 设置 | 系统设置（含外观和语言配置） |

## 布局模式说明

### 顶部菜单模式（Top Menu）

- 菜单水平排列在页面顶部
- 适用于页面功能较少的简单系统
- 配置 `layoutMode: 'top'` 启用

### 侧边栏菜单模式（Sider Menu）

- 菜单垂直排列在左侧
- 支持多级菜单嵌套
- 侧边栏可折叠/展开
- 配置 `layoutMode: 'side'` 启用

## 主题配置说明

### 主题模式

- **浅色模式（light）**：白色背景，深色文字
- **深色模式（dark）**：深色背景（如 #001529），浅色文字

### 主题色

系统提供 6 种预设主题色：

| 主题色 | 色值 | 中文名称 | 英文名称 |
|--------|------|----------|----------|
| 拂晓蓝 | #1890ff | 拂晓蓝 | Dawn Blue |
| 极光绿 | #52c41a | 极光绿 | Aurora Green |
| 酱紫 | #722ed1 | 酱紫 | Violet |
| 薄暮 | #f5222d | 薄暮 | Sunset |
| 日暮 | #fa8c16 | 日暮 | Dusk |
| 明青 | #13c2c2 | 明青 | Cyan |

### 语言设置

支持以下语言：

| 语言 | 代码 | 说明 |
|------|------|------|
| 中文 | zh-CN | 简体中文 |
| English | en-US | 英文 |

### 设置入口

进入设置页面的方式：

1. 点击右上角用户名下拉菜单 → 选择「设置」
2. 直接访问 `/settings` 路径

## 路由说明

### 路由配置结构

路由配置定义在 `src/routes/index.tsx`，使用 `RouteConfig` 接口：

```typescript
interface RouteConfig {
  path: string;             // 路由路径
  component?: ComponentType;  // 页面组件（可选，无 component 则使用 Outlet）
  title: string;           // 页面标题
  labelKey: string;       // 国际化 key
  icon?: React.ReactNode;  // 菜单图标
  children?: RouteConfig[]; // 子路由
  hidden?: boolean;       // 是否在菜单隐藏
}
```

### 嵌套路由

父级路由如果没有指定 `component`，会自动使用 `Outlet` 让子路由内容显示在父级页面中。这样可以避免创建无意义的父级页面组件。

## 状态管理

使用 Zustand 进行状态管理：

- **appearance.ts**：管理布局模式、主题模式、主题色等外观设置
- **language.ts**：管理语言偏好设置

状态数据自动持久化到 localStorage。