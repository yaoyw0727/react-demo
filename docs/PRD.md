# 产品需求文档 (PRD)

## React 管理后台系统模板

**版本**: v1.0.0  
**创建日期**: 2026-05-21  
**状态**: 已完成

---

## 1. 产品概述

### 1.1 产品定位

本项目是一个现代化的管理后台系统模板，基于 React 19 技术栈构建，旨在为企业级后台管理系统提供一套开箱即用的解决方案。产品聚焦于**灵活的主题定制**、**完善的国际化支持**和**可扩展的架构设计**，帮助开发团队快速搭建高质量的管理后台。

### 1.2 目标用户

- **前端开发团队**: 需要快速搭建管理后台的项目组
- **企业 IT 部门**: 需要标准化后台系统的企业用户
- **独立开发者**: 寻求高质量模板的开发者

### 1.3 核心价值

| 价值维度 | 说明 |
|---------|------|
| **快速启动** | 开箱即用的完整前后端架构，减少初始配置时间 |
| **高度可配置** | 通过配置项控制功能显示，无需修改核心代码 |
| **国际化就绪** | 内置中英文双语支持，扩展多语言简单 |
| **主题灵活** | 支持多种布局模式和主题色，满足不同品牌需求 |
| **最佳实践** | 遵循 React 19 和 TypeScript 最佳实践 |
| **全栈集成** | 前端已对接 Spring Boot 后端 API，支持 JWT 认证、RBAC 权限 |

---

## 2. 功能需求

### 2.1 功能架构

```
React 管理后台系统
├── 认证系统
│   └── JWT 登录/注册
├── 布局系统
│   ├── 顶部菜单模式
│   └── 侧边栏菜单模式
├── 主题系统
│   ├── 浅色/深色模式
│   └── 主题色定制
├── 国际化系统
│   ├── 中文 (zh-CN)
│   └── 英文 (en-US)
├── 业务模块
│   ├── 首页
│   ├── 关于
│   ├── 系统管理
│   │   ├── 系统概览（含数据导出）
│   │   ├── 用户管理
│   │   └── 角色管理
│   └── 产品管理
│       ├── 产品列表
│       └── 产品分类
└── 设置模块
    ├── 外观设置
    └── 语言设置
```

### 2.2 详细功能说明

#### 2.2.1 布局系统

**功能描述**: 提供两种布局模式，用户可根据需求自由切换。

| 功能项 | 说明 | 优先级 |
|-------|------|--------|
| 顶部菜单模式 | 菜单水平排列在页面顶部导航栏 | P0 |
| 侧边栏菜单模式 | 菜单垂直排列在左侧，支持折叠/展开 | P0 |
| 布局切换 | 通过设置面板实时切换布局模式 | P0 |
| 布局持久化 | 选择的布局模式自动保存到 localStorage | P0 |

**交互说明**:
- 顶部菜单模式: 适用于功能较少的简单系统
- 侧边栏菜单模式: 支持多级菜单嵌套，收起时显示应用简称"RA"

#### 2.2.2 主题系统

**功能描述**: 提供深色/浅色模式切换和主题色定制能力。

| 功能项 | 说明 | 优先级 |
|-------|------|--------|
| 浅色模式 | 白色背景，深色文字 | P0 |
| 深色模式 | 深色背景(#001529)，浅色文字 | P0 |
| 主题色切换 | 支持 6 种预设主题色 | P0 |
| 主题色持久化 | 选择的主题色自动保存 | P0 |
| 主题色 Hover/Active 状态 | 自动生成悬停和激活状态颜色 | P1 |

**预设主题色**:

| 主题色名称 | 色值 | 适用场景 |
|-----------|------|---------|
| 拂晓蓝 (Dawn Blue) | #1890ff | 默认主题，商务风格 |
| 极光绿 (Aurora Green) | #52c41a | 健康、环保类系统 |
| 酱紫 (Violet) | #722ed1 | 创意、设计类系统 |
| 薄暮 (Sunset) | #f5222d | 警示、重要信息系统 |
| 日暮 (Dusk) | #fa8c16 | 温暖、亲和类系统 |
| 明青 (Cyan) | #13c2c2 | 科技、数据类系统 |

#### 2.2.3 国际化系统

**功能描述**: 支持多语言切换，所有界面文字和组件文案均支持国际化。

| 功能项 | 说明 | 优先级 |
|-------|------|--------|
| 中文支持 | 简体中文 (zh-CN) | P0 |
| 英文支持 | 英文 (en-US) | P0 |
| 语言切换 | 通过设置面板实时切换语言 | P0 |
| 语言持久化 | 选择的语言自动保存 | P0 |
| Ant Design 组件本地化 | 日期选择器、分页器等组件跟随语言切换 | P0 |
| 按需加载翻译文件 | 使用 Vite glob import 动态加载 | P1 |

**语言文件结构**:
```
src/
├── pages/{PageName}/locales/
│   ├── zh-cn/zh-cn.json
│   └── en-us/en-us.json
└── locales/
    ├── zh-cn/zh-cn.json
    └── en-us/en-us.json
```

#### 2.2.4 设置模块

**功能描述**: 集中管理系统配置项，支持可扩展的配置结构。

| 功能项 | 说明 | 优先级 |
|-------|------|--------|
| 外观设置面板 | 布局模式、主题模式、主题色选择 | P0 |
| 语言设置面板 | 语言选择，带国旗图标 | P0 |
| 配置驱动显示 | 通过 `SETTINGS_CONFIG` 控制显示哪些设置项 | P0 |
| 设置入口隐藏 | 未配置设置项时，设置入口不显示 | P1 |
| 访问 /settings 显示 404 | 未配置时访问设置页面返回 404 | P1 |

**配置结构**:
```typescript
interface SettingItem {
  key: string;              // 设置项唯一标识
  labelKey: string;         // 国际化 key
  icon: React.ReactNode;    // 设置项图标
  component: React.ComponentType; // 设置面板组件
}
```

#### 2.2.5 业务模块

##### 登录 (Login)

| 功能项 | 说明 | 优先级 |
|-------|------|--------|
| 用户名密码登录 | 通过表单输入用户名和密码登录系统 | P0 |
| JWT Token | 登录成功后获取 Token，自动存储并携带 | P0 |
| 登录状态持久化 | Token 和用户信息保存到 localStorage | P0 |
| 401 自动跳转 | Token 过期或无效时自动跳转到登录页 | P0 |
| 注册功能 | 新用户注册（调用后端 `/api/auth/register`） | P1 |

##### 首页 (Home)

| 功能项 | 说明 | 优先级 |
|-------|------|--------|
| 应用介绍展示 | 展示系统简介和功能说明 | P0 |
| 状态管理示例 | 计数器功能演示 Zustand 状态管理 | P1 |
| 路由跳转示例 | 提供到其他页面的导航链接 | P1 |

##### 系统管理

**系统概览**:

| 功能项 | 说明 | 优先级 |
|-------|------|--------|
| 统计卡片 | 展示在线用户、今日访问、订单总数、营收总额 4 项核心指标 | P0 |
| 趋势分析 | 折线图展示访问趋势，支持日/周/月时间范围切换 | P0 |
| 订单占比 | 柱状图展示各品类订单分布 | P0 |
| 地域分布 | 饼图展示用户地域分布 | P0 |
| 系统健康 | 仪表盘展示 CPU 使用率、内存占用率、磁盘剩余 | P0 |
| 数据导出 | 支持 Excel/CSV/PDF 三种格式导出概览数据 | P0 |
| 图表详情弹窗 | 点击图表查看详细数据 | P1 |
| 自动刷新 | 定时刷新概览数据 | P1 |

**用户管理**:

| 功能项 | 说明 | 优先级 |
|-------|------|--------|
| 用户列表展示 | 表格展示用户信息（用户名、邮箱、角色、状态） | P0 |
| 搜索功能 | 支持按用户名搜索 | P1 |
| 添加用户 | 弹窗表单添加新用户 | P0 |
| 编辑用户 | 编辑现有用户信息 | P1 |
| 删除用户 | 删除用户（带确认） | P1 |
| 表格滚动 | 内容区独立滚动，表头固定 | P0 |
| 分页功能 | 固定分页器在底部 | P1 |

**角色管理**:

| 功能项 | 说明 | 优先级 |
|-------|------|--------|
| 角色列表展示 | 表格展示角色信息 | P0 |
| 添加角色 | 弹窗表单添加新角色 | P0 |
| 编辑/删除角色 | 角色管理操作 | P1 |

##### 产品管理

**产品列表**:

| 功能项 | 说明 | 优先级 |
|-------|------|--------|
| 产品列表展示 | 表格展示产品信息 | P0 |
| 搜索功能 | 支持产品名称搜索 | P1 |
| 添加产品 | 弹窗表单添加新产品 | P0 |

**产品分类**:

| 功能项 | 说明 | 优先级 |
|-------|------|--------|
| 分类列表展示 | 表格展示分类信息（名称、描述、产品数量、排序） | P0 |
| 搜索功能 | 支持分类名称搜索 | P1 |
| 添加分类 | 抽屉表单添加新分类 | P0 |
| 表格独立滚动 | 使用 `useTableScrollY` Hook 动态计算滚动高度 | P0 |

### 2.3 用户权限

当前版本为模板系统，不包含完整的权限管理系统，但预留了以下扩展点：

- 用户角色字段（管理员/普通用户）
- 路由配置支持 `hidden` 属性控制菜单显示
- 可基于现有架构扩展 RBAC 权限系统

---

## 3. 非功能需求

### 3.1 性能要求

| 指标 | 要求 | 说明 |
|-----|------|------|
| 首屏加载时间 | < 2s | 生产环境，标准网络 |
| 页面切换响应 | < 300ms | 路由切换无明显卡顿 |
| 构建产物大小 | < 500KB (gzip) | 主 bundle 大小 |
| 表格滚动性能 | 60fps | 使用虚拟滚动或优化渲染 |

### 3.2 兼容性要求

| 维度 | 要求 |
|-----|------|
| 浏览器 | Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ |
| 屏幕尺寸 | 响应式设计，支持 1280px - 2560px |
| 移动端 | 基础可用（非主要目标） |

### 3.3 可维护性要求

| 维度 | 要求 |
|-----|------|
| 代码规范 | TypeScript 严格模式，ESLint + Prettier |
| 组件化 | 业务模块弹窗/抽屉抽成独立组件 |
| 状态管理 | 使用 Zustand，避免 prop drilling |
| 国际化 | 所有用户可见文字使用 i18n key |
| 样式隔离 | 使用 CSS Modules (`.module.less`) |

### 3.4 安全性要求

| 维度 | 要求 |
|-----|------|
| XSS 防护 | React 默认转义，避免 `dangerouslySetInnerHTML` |
| 数据验证 | 表单输入需验证，防止非法数据 |
| localStorage | 仅存储非敏感配置数据 |

---

## 4. 技术架构

### 4.1 技术栈

| 类别 | 技术 | 版本 | 用途 |
|-----|------|------|------|
| 框架 | React | 19.x | UI 框架 |
| 语言 | TypeScript | 5.9.x | 类型安全 |
| 构建工具 | Vite | 8.x | 快速构建 |
| UI 组件库 | Ant Design | 6.x | 企业级组件 |
| 路由 | React Router | 7.x | 客户端路由 |
| 状态管理 | Zustand | 5.x | 轻量状态管理 |
| 国际化 | i18next + react-i18next | 26.x / 17.x | 多语言支持 |
| 样式 | Less + CSS Modules | 4.x | 样式预处理和隔离 |
| 工具库 | Lodash | 4.x | 工具函数 |

### 4.2 架构设计

#### 4.2.1 目录结构

```
src/
├── assets/              # 静态资源
│   ├── images/         # 图片资源
│   └── styles/         # 全局样式
├── components/         # 全局公共组件
│   ├── ThemeConfig/   # 主题配置（ConfigProvider 封装）
│   ├── IconFont/      # 图标字体
│   ├── CustomButton/  # 自定义按钮
│   └── UserDropdown/  # 用户下拉菜单
├── constants/          # 常量定义
│   ├── index.ts       # 项目常量（主题色、布局模式等）
│   └── settings.tsx   # 设置配置项
├── layouts/           # 布局组件
│   ├── MainLayout/    # 主布局入口
│   ├── components/    # 布局子组件
│   │   ├── TopMenuLayout/    # 顶部菜单布局
│   │   └── SiderMenuLayout/  # 侧边栏菜单布局
│   └── hooks/         # 布局相关 Hook
│       └── useTableScrollY  # 表格滚动高度计算
├── pages/             # 页面组件
│   ├── Home/          # 首页
│   ├── About/         # 关于页
│   ├── NotFound/      # 404 页面
│   ├── Settings/      # 设置模块
│   │   ├── AppearancePanel/  # 外观设置
│   │   ├── LanguagePanel/    # 语言设置
│   │   └── locales/          # 设置模块翻译
│   ├── System/        # 系统管理模块
│   │   ├── User/      # 用户管理
│   │   │   └── components/  # 模块公共组件
│   │   └── Role/      # 角色管理
│   └── Product/       # 产品管理模块
│       ├── ProductList/      # 产品列表
│       └── ProductCategory/  # 产品分类
│           └── components/   # 模块公共组件
├── routes/            # 路由配置
│   ├── index.tsx     # 路由定义
│   └── tools.tsx     # 路由工具函数
├── store/             # Zustand 状态管理
│   ├── appearance.ts # 外观状态
│   ├── language.ts   # 语言状态
│   └── counter.ts    # 计数器示例
├── utils/             # 工具函数
│   ├── i18n.ts       # 国际化配置
│   └── index.ts      # 通用工具
├── App.tsx           # 应用主组件
└── main.tsx          # 应用入口
```

#### 4.2.2 核心流程

**应用启动流程**:
```
main.tsx
  → I18nextProvider (初始化 i18n)
    → ThemeConfig (应用主题和语言)
      → App (路由配置)
        → MainLayout (布局容器)
          → Routes (页面路由)
```

**状态管理架构**:
```
Zustand Stores
├── useAppearanceStore (布局模式、主题模式、主题色)
│   └── persist 中间件 → localStorage
├── useLanguageStore (语言偏好)
│   └── persist 中间件 → localStorage
└── useCounterStore (示例状态)
```

**国际化加载流程**:
```
i18n.ts
  → Vite glob import 扫描所有 locales/**/*.json
  → 合并 zh-CN 和 en-US 翻译资源
  → i18next.init() 初始化
  → useTranslation() Hook 使用
```

#### 4.2.3 路由设计

路由采用**声明式配置**，通过 `routes` 数组定义所有路由和菜单结构：

```typescript
interface RouteConfig {
  path: string;              // 路由路径
  component?: ComponentType; // 页面组件（可选）
  title: string;            // 页面标题
  labelKey: string;         // 国际化 key
  icon?: React.ReactNode;   // 菜单图标
  children?: RouteConfig[]; // 子路由
  hidden?: boolean;         // 是否在菜单隐藏
}
```

**路由特性**:
- 支持嵌套路由，父路由无 component 时自动使用 Outlet
- 支持 `hidden` 属性控制菜单显示（如设置页面、404 页面）
- 设置路由根据 `SETTINGS_CONFIG` 动态生成

### 4.3 关键设计决策

| 决策 | 选择 | 理由 |
|-----|------|------|
| 状态管理 | Zustand | 轻量、API 简洁、TypeScript 友好 |
| 样式方案 | Less + CSS Modules | 作用域隔离、支持嵌套、与 Ant Design 一致 |
| 国际化 | i18next | 生态成熟、支持按需加载、React 集成好 |
| 构建工具 | Vite | 开发体验优秀、HMR 快速 |
| 路由方案 | React Router 7 | 官方推荐、声明式配置 |

---

## 5. 页面设计

### 5.1 页面清单

| 路径 | 页面名称 | 布局模式 | 说明 |
|-----|---------|---------|------|
| `/` | 首页 | 整区滚动 | 应用介绍和功能演示 |
| `/about` | 关于 | 整区滚动 | 系统介绍 |
| `/system/user` | 用户管理 | 标题下滚动 | 用户列表管理 |
| `/system/role` | 角色管理 | 标题下滚动 | 角色列表管理 |
| `/product/list` | 产品列表 | 标题下滚动 | 产品列表管理 |
| `/product/category` | 产品分类 | 表格独立滚动 | 分类列表管理 |
| `/settings` | 设置 | 整区滚动 | 外观和语言设置 |
| `*` | 404 | - | 未找到页面 |

### 5.2 滚动模式规范

系统定义了三种滚动模式，适用于不同场景：

#### 模式一：整区滚动
- **固定元素**: 面包屑导航
- **滚动区域**: 整个内容区
- **适用场景**: 简单页面（首页、关于页）

#### 模式二：标题下滚动
- **固定元素**: 面包屑导航 + 页面标题
- **滚动区域**: 标题下方内容区
- **适用场景**: 有表格/列表的页面（用户管理、角色管理）

#### 模式三：表格独立滚动
- **固定元素**: 面包屑 + 标题 + 工具栏
- **滚动区域**: 表格 body 独立滚动
- **固定元素**: 分页器固定在底部
- **适用场景**: 大数据量表格（产品分类）
- **技术要求**: 必须使用 `useTableScrollY` Hook 动态计算高度

### 5.3 组件规范

#### 弹窗/抽屉组件
- Modal 使用 `destroyOnHidden` 属性确保语言切换时 placeholder 更新
- Drawer 使用 `destroyOnHidden` 属性
- 页面模块的弹窗/抽屉抽成独立组件放在 `components/` 目录下

#### 表格组件
- 使用 `useTableScrollY` Hook 计算滚动高度
- 分页器固定在表格底部
- 工具栏包含搜索框和操作按钮

---

## 6. 数据模型

### 6.1 用户数据模型

```typescript
interface User {
  id: string;           // 唯一标识（UUID）
  username: string;     // 用户名
  email: string;        // 邮箱
  roleId: string;       // 角色 ID
  roleName: string;     // 角色名称（后端 JOIN 填充）
  status: string;       // 状态（enabled/disabled）
  createdAt?: string;   // 创建时间
}
```

### 6.2 角色数据模型

```typescript
interface Role {
  id: string;           // 唯一标识（UUID）
  name: string;         // 角色名称
  description: string;  // 角色描述
  permissionList: string[]; // 权限列表（后端将 JSON 解析为数组）
  status: string;       // 状态（enabled/disabled）
}
```

### 6.3 产品数据模型

```typescript
interface Product {
  id: string;           // 唯一标识（UUID）
  name: string;         // 产品名称
  categoryId: string;   // 所属分类 ID
  categoryName: string; // 分类名称（后端 JOIN 填充）
  price: number;        // 价格
  stock: number;        // 库存
  status: string;       // 状态（onSale/outOfStock）
  createdAt?: string;   // 创建时间
  updatedAt?: string;   // 更新时间
}
```

### 6.4 产品分类数据模型

```typescript
interface Category {
  id: string;           // 唯一标识（UUID）
  name: string;         // 分类名称
  description: string;  // 分类描述
  productCount: number; // 产品数量（后端 COUNT 查询）
  sort: number;         // 排序值
  createdAt?: string;   // 创建时间
  updatedAt?: string;   // 更新时间
}
```

### 6.5 外观设置数据模型

```typescript
interface AppearanceState {
  layoutMode: 'top' | 'side';  // 布局模式
  themeMode: 'light' | 'dark'; // 主题模式
  primaryColor: string;        // 主题色
}
```

### 6.6 语言设置数据模型

```typescript
interface LanguageState {
  language: 'zh-CN' | 'en-US'; // 语言偏好
}
```

### 6.7 登录响应数据模型

```typescript
interface LoginResult {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    roleId: string;
    roleName: string;
    status: string;
  };
}
```

### 6.8 概览统计数据模型

```typescript
interface OverviewStats {
  onlineUsers: number;    // 在线用户
  todayVisits: number;    // 今日访问
  todayOrders: number;    // 今日订单
  todayRevenue: number;   // 今日营收
}

interface TrendData {
  visitTrend: { label: string; value: number }[];
  orderRatio: { module: string; value: number }[];
  regionDistribution: { name: string; value: number }[];
}

interface HealthStatus {
  cpuUsage: number;       // CPU 使用率
  memoryUsage: number;    // 内存占用率
  diskFree: number;       // 磁盘剩余（GB）
}
```

---

## 7. 接口设计

前后端已全面对接，后端基于 Spring Boot 3.2 + MySQL + Redis，所有 API 以 `/api` 为前缀。

### 7.1 认证

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | `/api/auth/login` | 登录 | 公开 |
| POST | `/api/auth/register` | 注册 | 公开 |
| GET | `/api/health` | 健康检查 | 公开 |

### 7.2 系统概览

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/overview/stats` | 4 项实时统计数据 |
| GET | `/api/overview/trends` | 趋势数据（支持 day/week/month） |
| GET | `/api/overview/health` | 系统健康指标 |
| GET | `/api/overview/chart-detail` | 图表详情数据 |
| POST | `/api/overview/export` | 导出 Excel 文件流 |

### 7.3 产品管理

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/products` | 分页产品列表（支持 search/categoryId/status 筛选） |
| POST | `/api/products` | 新增产品 |
| GET | `/api/products/{id}` | 产品详情 |
| PUT | `/api/products/{id}` | 更新产品 |
| DELETE | `/api/products/{id}` | 删除产品 |

### 7.4 产品分类

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/categories` | 分页分类列表（支持 search） |
| POST | `/api/categories` | 新增分类 |
| GET | `/api/categories/{id}` | 分类详情 |
| PUT | `/api/categories/{id}` | 更新分类 |
| DELETE | `/api/categories/{id}` | 删除分类 |

### 7.5 用户管理

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/users` | 分页用户列表（支持 search/roleId） |
| POST | `/api/users` | 新增用户 |
| GET | `/api/users/{id}` | 用户详情 |
| PUT | `/api/users/{id}` | 更新用户 |
| DELETE | `/api/users/{id}` | 删除用户 |
| PATCH | `/api/users/{id}/status` | 启用/禁用用户 |

### 7.6 角色管理

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/roles` | 分页角色列表（支持 search） |
| POST | `/api/roles` | 新增角色 |
| GET | `/api/roles/{id}` | 角色详情 |
| PUT | `/api/roles/{id}` | 更新角色 |
| DELETE | `/api/roles/{id}` | 删除角色 |

### 7.7 用户设置

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/settings` | 获取当前用户设置 |
| PUT | `/api/settings` | 更新当前用户设置 |

### 7.8 统一响应格式

```json
{
  "success": true,
  "data": { ... },
  "message": "success",
  "code": 200
}
```

分页响应使用 `PageResult` 封装：
```json
{
  "data": [...],
  "total": 100,
  "page": 1,
  "limit": 20
}
```

---

## 8. 构建和部署

### 8.1 构建命令

| 命令 | 说明 |
|-----|------|
| `pnpm dev` | 启动前端开发服务器 |
| `pnpm build` | 构建前端生产版本（tsc + vite build） |
| `pnpm preview` | 预览前端生产构建 |
| `pnpm build:translations` | 合并翻译文件 |
| `pnpm build:full` | 完整构建（build + 合并翻译） |
| `pnpm test` | 运行前端测试 |
| `mvn spring-boot:run` | 启动后端（需配置 JDK 17 + MySQL） |
| `mvn clean package -DskipTests` | 构建后端 JAR |
| `mvn test` | 运行后端测试 |

### 8.2 构建产物

```
react-demo/dist/
├── index.html
├── assets/
│   ├── index-{hash}.js      # 主 bundle
│   ├── index-{hash}.css     # 样式文件
│   └── ...                  # 其他静态资源

react-demo-server/server-java/target/
└── admin-server-1.0.0.jar   # Spring Boot 可执行 JAR
```

### 8.3 部署建议

- 前端支持静态托管（Nginx、Vercel、Netlify 等）
- 需要配置 SPA 路由回退（所有路由指向 index.html）
- 后端支持 Docker/Podman 容器化部署
- 开发环境通过 Vite proxy 代理 `/api` 请求到 `http://localhost:3001`
- 生产环境建议 Nginx 反向代理后端 API
- 建议启用 gzip/brotli 压缩，配置 CDN 缓存策略

---

## 9. 扩展规划

### 9.1 短期规划（v1.x）

| 功能 | 说明 | 优先级 |
|-----|------|--------|
| 后端 API 对接 | 所有业务页面已对接后端 API | ✅ 已完成 |
| 权限控制 | JWT 认证 + RBAC 权限注解已实现 | ✅ 已完成 |
| 数据持久化 | MySQL + Redis 持久化 | ✅ 已完成 |
| 登录认证 | JWT 登录/注册已完成 | ✅ 已完成 |
| 数据导出 | Excel/CSV/PDF 导出已完成 | ✅ 已完成 |
| 表单验证增强 | 集成表单验证规则 | P1 |
| 错误边界 | 全局错误处理和错误页面 | P1 |
| 加载状态 | 路由切换和数据加载 Loading | P1 |

### 9.2 中期规划（v2.x）

| 功能 | 说明 | 优先级 |
|-----|------|--------|
| 数据可视化 | ECharts 集成已完成（折线图/柱状图/饼图/仪表盘） | ✅ 已完成 |
| 图表详情弹窗 | 点击图表查看详细数据已完成 | ✅ 已完成 |
| 主题编辑器 | 可视化主题配置工具 | P2 |
| 多标签页 | 支持多标签页导航 | P2 |
| 通知中心 | 消息通知系统 | P2 |
| 操作日志 | 用户操作审计日志 | P1 |
| 文件上传 | 产品图片/头像上传 | P2 |

### 9.3 长期规划（v3.x）

| 功能 | 说明 | 优先级 |
|-----|------|--------|
| 微前端架构 | 支持子应用集成 | P3 |
| 低代码平台 | 可视化页面搭建 | P3 |
| 国际化扩展 | 支持更多语言 | P2 |
| 移动端适配 | 响应式移动端布局 | P2 |

---

## 10. 附录

### 10.1 术语表

| 术语 | 说明 |
|-----|------|
| 布局模式 | 菜单的排列方式（顶部菜单/侧边栏菜单） |
| 主题模式 | 页面的颜色风格（浅色/深色） |
| 主题色 | 系统主色调，影响按钮、链接等交互元素 |
| 国际化 (i18n) | 多语言支持，使应用适配不同语言 |
| 状态持久化 | 将用户设置保存到 localStorage，刷新不丢失 |
| CSS Modules | 样式隔离方案，避免样式冲突 |

### 10.2 参考文档

- [React 官方文档](https://react.dev/)
- [Ant Design 组件库](https://ant.design/)
- [Vite 构建工具](https://vitejs.dev/)
- [Zustand 状态管理](https://github.com/pmndrs/zustand)
- [i18next 国际化](https://www.i18next.com/)
- [React Router 路由](https://reactrouter.com/)

### 10.3 版本历史

| 版本 | 日期 | 说明 |
|-----|------|------|
| v1.0.0 | 2026-05-21 | 初始版本，完成核心前端功能开发 |
| v1.1.0 | 2026-05-28 | 新增后端 Spring Boot 服务，全栈对接完成 |

---

**文档结束**
