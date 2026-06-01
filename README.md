# React App

一个基于 React + Vite + Ant Design 的全栈管理后台系统，配套 Java Spring Boot 后端服务。

## 项目简介

本项目是一个现代化的全栈管理后台系统，前端采用 React 19 技术栈构建，后端采用 Spring Boot 3.2 + MySQL + Redis。提供灵活的主题配置、国际化支持、JWT 认证、RBAC 权限控制、数据可视化、数据导出等功能。前端采用声明式路由配置，通过 Zustand 进行状态管理，已与后端 API 完成对接。

## 功能特性

### 前端
- **双布局模式**：支持顶部菜单和侧边栏菜单两种布局模式，可根据需求自由切换
- **主题定制**：内置深色/浅色模式，支持 6 种主题色选择（拂晓蓝、极光绿、酱紫、薄暮、日暮、明青）
- **国际化**：支持中文和英文双语切换，配置即时生效
- **状态持久化**：外观设置和语言偏好自动保存到 localStorage，刷新页面不丢失
- **JWT 认证**：基于 Token 的登录认证，自动携带 Token 访问后端 API
- **嵌套路由**：支持多级菜单嵌套，完善的路由结构和面包屑导航
- **响应式设计**：适配不同屏幕尺寸，侧边栏模式支持折叠展开
- **内容区滚动**：三种滚动模式（整区滚动/标题下滚动/表格独立滚动）
- **数据可视化**：集成 ECharts，支持折线图、柱状图、饼图、仪表盘
- **数据导出**：支持 Excel/CSV/PDF 三种格式导出概览数据
- **图表详情弹窗**：点击图表查看详细数据

### 后端
- **RESTful API**：覆盖所有业务页面的数据需求，统一返回格式
- **JWT 认证 + RBAC 权限**：3 种角色（admin/user/guest），20 项细粒度权限控制
- **MySQL 持久化**：7 张业务表，Flyway 版本化迁移，含种子数据
- **Redis 缓存**：概览统计数据 5 分钟 TTL，降低数据库压力
- **Excel 导出**：EasyExcel 流式导出概览报表
- **容器化部署**：Docker/Podman 一键部署

## 技术栈

### 前端
- **框架**: React 19 + TypeScript
- **构建工具**: Vite 8
- **UI 组件库**: Ant Design 6
- **路由**: React Router 7
- **状态管理**: Zustand 5
- **国际化**: i18next + react-i18next
- **图表**: ECharts + echarts-for-react
- **样式**: Less + CSS Modules
- **HTTP 客户端**: Axios
- **数据导出**: jsPDF + xlsx + html2canvas
- **测试**: Vitest

### 后端
- **运行时**: Java 17 (Temurin)
- **框架**: Spring Boot 3.2.5
- **ORM**: MyBatis-Plus 3.5.6
- **数据库**: MySQL 8.0+ + Redis 7.x
- **安全**: Spring Security + JWT (jjwt 0.12.5)
- **数据库迁移**: Flyway
- **接口文档**: SpringDoc OpenAPI (Swagger)
- **容器化**: Docker / Podman

## 项目结构

```
react-demo/
├── src/
│   ├── assets/                 # 静态资源
│   │   ├── images/            # 图片资源（国旗图标等）
│   │   └── styles/           # 全局样式（global.less, variables.less, antd-override.less）
│   ├── components/           # 公共组件
│   │   ├── UserDropdown/     # 用户下拉菜单
│   │   └── ChartDetailModal/ # 图表详情弹窗
│   ├── constants/            # 常量定义
│   │   ├── index.ts          # 项目常量（主题色、布局模式等）
│   │   └── settings.tsx      # 设置配置项（SETTINGS_CONFIG）
│   ├── hooks/                # 自定义 Hook
│   │   └── useExport.ts      # 导出功能 Hook
│   ├── layouts/              # 布局组件
│   │   ├── MainLayout/       # 主布局入口
│   │   ├── components/       # 布局子组件
│   │   │   ├── TopMenuLayout/       # 顶部菜单布局
│   │   │   └── SiderMenuLayout/   # 侧边栏菜单布局
│   │   └── hooks/            # 布局 Hooks
│   │       ├── useMenu.tsx   # 菜单状态管理
│   │       └── useTableScrollY.ts # 表格滚动高度计算
│   ├── pages/                # 页面组件
│   │   ├── Login/            # 登录页
│   │   ├── Home/             # 首页
│   │   ├── About/            # 关于页
│   │   ├── NotFound/         # 404 页面
│   │   ├── Settings/         # 设置（外观+语言）
│   │   ├── Product/          # 产品管理
│   │   │   ├── ProductList/  # 产品列表
│   │   │   └── ProductCategory/ # 产品分类
│   │   ├── System/           # 系统管理
│   │   │   ├── User/         # 用户管理
│   │   │   └── Role/         # 角色管理
│   │   ├── SystemOverviewWithExport/ # 系统概览（含导出）
│   │   └── prototype/        # 原型页面
│   ├── routes/               # 路由配置
│   │   ├── index.tsx         # 路由定义
│   │   └── tools.tsx         # 路由工具函数
│   ├── services/             # HTTP 请求层
│   │   ├── request.ts        # Axios 实例（自动携带 JWT Token）
│   │   ├── settingsSync.ts   # 设置前后端同步
│   │   └── api/              # API 接口封装
│   │       ├── auth.ts       # 认证 API
│   │       ├── overview.ts   # 概览 API
│   │       ├── user.ts       # 用户 API
│   │       ├── role.ts       # 角色 API
│   │       ├── product.ts    # 产品 API
│   │       ├── category.ts   # 分类 API
│   │       └── settings.ts   # 设置 API
│   ├── store/                # Zustand 状态管理
│   │   ├── auth.ts           # 认证状态（token、用户信息）
│   │   ├── appearance.ts     # 外观状态（主题、布局）
│   │   ├── language.ts       # 语言状态
│   │   └── counter.ts        # 示例计数器
│   ├── locales/              # 公共翻译文件
│   │   ├── zh-cn/zh-cn.json
│   │   └── en-us/en-us.json
│   ├── utils/                # 工具函数
│   │   ├── i18n.ts           # 国际化配置（Vite glob import 动态加载翻译）
│   │   ├── exporters.ts      # 导出工具（Excel/CSV/PDF）
│   │   └── __tests__/        # 工具函数测试
│   ├── App.tsx               # 根组件（路由 + 认证保护 + 设置同步）
│   └── main.tsx              # 应用入口

react-demo-server/
├── server-java/              # Java 后端
│   ├── src/main/java/com/example/admin/
│   │   ├── config/           # Security、CORS、MyBatis-Plus、Redis、Swagger 配置
│   │   ├── security/         # JWT 签发/解析/请求过滤器
│   │   ├── common/           # ApiResponse、PageResult、异常处理
│   │   ├── entity/           # 7 个数据库实体
│   │   ├── mapper/           # MyBatis-Plus Mapper
│   │   ├── service/          # 7 个业务 Service（接口+实现）
│   │   ├── controller/       # 8 个 REST 控制器
│   │   └── generator/        # MyBatis-Plus 代码生成器
│   └── src/main/resources/
│       ├── application.yml   # 主配置
│       ├── application-dev.yml
│       └── db/migration/     # Flyway 迁移（3 个版本）
├── docs/                     # 后端文档
│   ├── PRD-BACKEND.md
│   ├── PRD-BACKEND-FULL.md
│   ├── API-INTEGRATION-CHECKLIST.md
│   └── 项目环境搭建指南.md
```

## 开始使用

### 前置要求
- Node.js 18+
- pnpm（推荐）或 npm
- Java 17（后端开发）
- MySQL 8.0+（后端开发）
- Docker/Podman（容器化部署）

### 启动前端

```bash
cd react-demo
pnpm install
pnpm dev
```

开发服务器启动后访问 http://localhost:5173。

### 启动后端

```bash
cd react-demo-server/server-java
# 设置 JDK 17
$env:JAVA_HOME = "C:\path\to\jdk-17"
# 编译并启动（需 MySQL 运行中）
mvn spring-boot:run -Dspring.profiles.active=dev
```

后端启动后访问 http://localhost:3001。

### 测试账号

| 用户名 | 密码 | 角色 |
|--------|------|------|
| admin | admin123 | 管理员（全部权限） |
| user | admin123 | 普通用户（只读权限） |

### 构建生产版本

```bash
pnpm build           # tsc + vite build
pnpm preview         # 预览生产构建
pnpm build:full      # 完整构建（含翻译合并）
```

## 页面路由

| 路径 | 页面 | 说明 |
|------|------|------|
| `/login` | 登录 | 用户名密码登录 |
| `/` | 首页 | 系统首页 + Zustand 示例 |
| `/about` | 关于 | 技术栈介绍 |
| `/system/overview` | 系统概览 | 统计卡片 + 趋势图表 + 健康监控 + 数据导出 |
| `/system/user` | 用户管理 | 用户 CRUD + 搜索 + 分页 |
| `/system/role` | 角色管理 | 角色 CRUD + 权限配置 |
| `/product/list` | 产品列表 | 产品 CRUD + 多维筛选 + 分页 |
| `/product/category` | 产品分类 | 分类 CRUD + 产品数量统计 |
| `/settings` | 设置 | 外观设置（布局/主题/主题色）+ 语言设置 |
| `*` | 404 | 友好错误提示 |

## 布局模式

### 顶部菜单模式（Top Menu）
- 菜单水平排列在页面顶部
- 适用于页面功能较少的简单系统

### 侧边栏菜单模式（Sider Menu）
- 菜单垂直排列在左侧
- 支持多级菜单嵌套
- 侧边栏可折叠/展开，收起时显示应用简称"RA"

## 主题配置

### 主题模式
- **浅色模式（light）**：白色背景，深色文字
- **深色模式（dark）**：深色背景（#001529），浅色文字

### 主题色
| 主题色 | 色值 | 中文名 | 英文名 |
|--------|------|--------|--------|
| 拂晓蓝 | #1890ff | 拂晓蓝 | Dawn Blue |
| 极光绿 | #52c41a | 极光绿 | Aurora Green |
| 酱紫 | #722ed1 | 酱紫 | Violet |
| 薄暮 | #f5222d | 薄暮 | Sunset |
| 日暮 | #fa8c16 | 日暮 | Dusk |
| 明青 | #13c2c2 | 明青 | Cyan |

## 页面滚动模式

| 模式 | 固定元素 | 滚动区域 | 适用页面 |
|------|---------|---------|---------|
| 整区滚动 | 面包屑固定 | 内容区整体滚动 | 首页、关于页 |
| 标题下滚动 | 面包屑+标题固定 | 内容区滚动 | 用户管理、角色管理 |
| 表格独立滚动 | 面包屑+标题+工具栏固定 | 表格 body 滚动 | 产品分类 |

## API 接口

应用通过 Axios 实例（已自动携带 JWT Token）与后端交互，接口路径以 `/api` 为前缀，开发环境通过 Vite proxy 代理到 `http://localhost:3001`。

### 认证
| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | `/api/auth/login` | 登录 | 公开 |
| POST | `/api/auth/register` | 注册 | 公开 |
| GET | `/api/health` | 健康检查 | 公开 |

### 系统概览
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/overview/stats` | 统计指标 |
| GET | `/api/overview/trends` | 趋势数据 |
| GET | `/api/overview/health` | 系统健康 |
| GET | `/api/overview/chart-detail` | 图表详情 |
| POST | `/api/overview/export` | 导出 Excel |

### 业务 CRUD
| 方法 | 路径 | 说明 |
|------|------|------|
| GET/POST | `/api/products` | 产品列表/新增 |
| GET/PUT/DELETE | `/api/products/{id}` | 产品详情/更新/删除 |
| GET/POST | `/api/categories` | 分类列表/新增 |
| GET/PUT/DELETE | `/api/categories/{id}` | 分类详情/更新/删除 |
| GET/POST | `/api/users` | 用户列表/新增 |
| GET/PUT/DELETE | `/api/users/{id}` | 用户详情/更新/删除 |
| PATCH | `/api/users/{id}/status` | 启用/禁用用户 |
| GET/POST | `/api/roles` | 角色列表/新增 |
| GET/PUT/DELETE | `/api/roles/{id}` | 角色详情/更新/删除 |
| GET/PUT | `/api/settings` | 用户偏好设置 |

## 状态管理

使用 Zustand 进行状态管理：

| Store | 用途 | 持久化 |
|-------|------|--------|
| `auth.ts` | 认证状态（Token、用户信息） | localStorage |
| `appearance.ts` | 布局模式、主题模式、主题色 | localStorage |
| `language.ts` | 语言偏好 | localStorage |
| `counter.ts` | 示例计数器 | 否 |