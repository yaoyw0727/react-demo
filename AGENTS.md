# AGENTS.md

## 关键命令

- `npm run dev` - 开发服务器（Vite）
- `npm run build` - 构建（tsc && vite build）
- `npm run preview` - 预览生产构建
- `npm run build:full` - 完整构建（含翻译合并）
- `npm test` / `npm run test:run` - 运行 Vitest 测试

## 技术栈

- React 19 + TypeScript
- Vite 8 + Ant Design 6
- Zustand 5 (状态管理)
- i18next + react-i18next (国际化)
- ECharts (图表)
- Axios (HTTP 请求)
- jsPDF / xlsx / html2canvas (数据导出)

## 后端技术栈

- Java 17 + Spring Boot 3.2.5
- MyBatis-Plus 3.5.6 + MySQL 8.0
- Spring Security + JWT
- Redis 缓存
- Flyway 数据库迁移
- Docker / Podman 部署

## 核心特性

- **设置可配置**：通过 `SETTINGS_CONFIG` 配置显示哪些设置项
- **主题切换**：支持浅色/深色主题切换（需配置 appearance 项）
- **多语言支持**：支持简体中文、英文（需配置 language 项）
- **布局模式**：支持顶部菜单和侧边栏菜单两种布局
- **JWT 认证**：登录获取 Token，Axios 拦截器自动携带
- **后端集成**：所有业务页面已对接后端 API
- **数据导出**：支持 Excel/CSV/PDF 三种格式
- **图表详情**：点击图表弹窗查看详细数据（ECharts）

## 项目结构

```
src/
├── assets/              # 静态资源
│   ├── images/         # 国旗图标
│   └── styles/         # 全局样式
├── components/          # 全局组件
│   ├── UserDropdown/   # 用户下拉菜单
│   └── ChartDetailModal/ # 图表详情弹窗
├── layouts/            # 布局组件
│   ├── MainLayout/     # 主布局
│   ├── components/     # 布局子组件
│   │   ├── SiderMenuLayout/
│   │   └── TopMenuLayout/
│   └── hooks/          # 布局相关 Hook
│       ├── useMenu.tsx
│       └── useTableScrollY.ts
├── pages/              # 页面组件
│   ├── Login/          # 登录页
│   ├── Home/           # 首页
│   ├── About/          # 关于页
│   ├── NotFound/       # 404 页面
│   ├── Settings/       # 设置模块
│   │   ├── AppearancePanel/
│   │   │   └── components/
│   │   │       ├── LayoutModeSelector/
│   │   │       ├── ThemeModeSelector/
│   │   │       └── ThemeColorSelector/
│   │   ├── LanguagePanel/
│   │   └── components/ActionsBar/
│   ├── Product/        # 产品模块
│   │   ├── ProductList/
│   │   │   └── components/ProductModal/
│   │   └── ProductCategory/
│   │       └── components/CategoryDrawer/
│   ├── System/         # 系统模块
│   │   ├── User/
│   │   │   └── components/UserModal/
│   │   └── Role/
│   │       └── components/RoleModal/
│   ├── SystemOverviewWithExport/ # 系统概览（含导出）
│   └── prototype/      # 原型页面
│       ├── SystemOverviewPrototype/ # 3种概览变体
│       └── AIAssistantPrototype/   # 3种AI助手变体
├── routes/             # 路由配置
│   ├── index.tsx      # 路由定义
│   └── tools.tsx      # 路由工具函数
├── store/              # Zustand 状态管理
│   ├── auth.ts        # 认证状态（Token + 用户信息）
│   ├── appearance.ts  # 外观设置
│   ├── language.ts    # 语言设置
│   └── counter.ts     # 示例计数器
├── services/           # HTTP 请求层
│   ├── request.ts     # Axios 实例（JWT 拦截器）
│   ├── settingsSync.ts # 设置前后端同步
│   └── api/           # API 接口
│       ├── auth.ts, overview.ts, user.ts
│       └── role.ts, product.ts, category.ts, settings.ts
├── utils/             # 工具函数
│   ├── i18n.ts        # 国际化配置
│   ├── exporters.ts   # 导出工具
│   └── __tests__/     # 测试
├── hooks/             # 自定义 Hook
│   └── useExport.ts   # 导出功能
├── locales/           # 公共翻译文件
├── App.tsx            # 根组件（路由 + 认证保护 + 设置同步）
└── main.tsx           # 应用入口
```

## 页面滚动模式

### 模式一：整区滚动
- 面包屑固定，内容区整体滚动
- 适用：简单页面（Home, About, Login）

### 模式二：标题下滚动
- 面包屑+标题固定，内容区滚动
- 适用：有表格/列表的页面（User, Role, ProductList）

### 模式三：表格独立滚动
- 面包屑+标题+工具栏固定，表格 body 滚动，分页固定
- 适用：大数据量表格（ProductCategory）
- **必须使用** `useTableScrollY` Hook 动态计算高度

## 认证与登录

- 登录页：`src/pages/Login/index.tsx`
- 认证状态：`src/store/auth.ts`（Zustand + persist）
- 请求拦截：`src/services/request.ts` 自动携带 `Authorization: Bearer <token>`
- 401 处理：响应拦截器自动清除 auth 并跳转 `/login`
- ProtectedRoute：`src/App.tsx` 中包裹所有受保护页面，未登录重定向到 `/login`

## HTTP 请求

使用 Axios 封装，所有请求自动携带 Token：

```typescript
import { get, post, put, del, patch } from '@/services/request';

// 定义类型
interface MyData { id: string; name: string; }

// 使用封装方法
const list = await get<MyData[]>('/path');
const detail = await post<MyData>('/path', { body });
```

## 国际化

- 语言代码：`zh-CN`, `en-US`（首字母大写）
- 语言文件使用 Vite glob import 动态加载：`/src/**/locales/zh-cn/*.json`
- 页面翻译：`src/pages/{PageName}/locales/{语言}/{语言}.json`
- 全局翻译：`src/locales/{语言}/{语言}.json`
- 找不到翻译时显示 key 本身（`missingKeyNoValueFallbackToKey: true`）
- antd locale 在 App.tsx 的 ThemeConfig 中配置

```tsx
// 使用方式
const { t } = useTranslation();
t('menu.home')       // 全局 key
t('user.username')   // 页面级 key
```

## antd message

- **禁止** `import { message } from 'antd'`
- 必须使用：`const { message } = App.useApp()`
- App 根节点在 `App.tsx` 中用 `<AntApp>` 包裹

## 自定义 Hook

### useTableScrollY
表格滚动高度计算 Hook，适用于模式三。

```typescript
import { useTableScrollY } from '@/layouts/hooks/useTableScrollY';

const MyComponent: React.FC = () => {
  const { containerRef, scrollY } = useTableScrollY({ offset: 76 });
  // offset: 表格顶部到容器顶部的偏移量，默认 60
  // debounceMs: resize 防抖时间，默认 100ms

  return (
    <div ref={containerRef}>
      <Table scroll={{ y: scrollY }} />
    </div>
  );
};
```

### useExport
导出功能 Hook，支持 Excel/CSV/PDF。

```typescript
import { useExport } from '@/hooks/useExport';
import type { ExportData } from '@/utils/exporters';

const MyComponent: React.FC = () => {
  const data: ExportData = {
    stats: [{ label: '在线用户', value: 100 }],
    charts: {
      visitTrend: [{ label: '2026-01', value: 200 }],
      orderRatio: [{ label: '电子产品', value: 50 }],
      region: [{ label: '广东', value: 100 }],
    },
  };
  const { exporting, handleExport } = useExport({ data });
  // handleExport('excel' | 'csv' | 'pdf')
};
```

## 添加新页面

### 页面结构（根据 SETTINGS_CONFIG 决定）

**无 language 配置项时**：
```
src/pages/NewPage/
├── index.tsx
└── index.module.less
```

**有 language 配置项时**：
```
src/pages/NewPage/
├── index.tsx
├── index.module.less
└── locales/
    ├── zh-cn/zh-cn.json
    └── en-us/en-us.json
```

### 业务模块（有子页面）
```
src/pages/NewModule/
├── index.tsx              # 可选，仅用作菜单分组
├── ChildPage1/
│   ├── index.tsx
│   └── locales/...
├── ChildPage2/
│   └── index.tsx
└── components/            # 模块公共组件（可选）
    └── SomeComponent/
        └── index.tsx
```

### 注册路由
在 `src/routes/index.tsx` 添加：

```typescript
import NewPage from '@/pages/NewPage';

{ path: '/new-page', component: NewPage, title: '新页面', labelKey: 'menu.newPage' }
// 或嵌套
{
  path: '/new-module',
  title: '新模块',
  labelKey: 'menu.newModule',
  icon: <SomeIcon />,
  children: [
    { path: '/new-module/child', component: ChildPage, title: '子页面', labelKey: 'menu.child' },
  ],
}
```

### 添加 API 服务
```typescript
// src/services/api/myEntity.ts
import { get, post, put, del } from '@/services/request';

export interface MyEntity { id: string; name: string; }

export const myApi = {
  list: (params?: { search?: string; page?: number; limit?: number }) =>
    get<PageResult<MyEntity>>('/my-entities', params as Record<string, unknown>),
  create: (data: Partial<MyEntity>) => post<MyEntity>('/my-entities', data),
  update: (id: string, data: Partial<MyEntity>) => put<MyEntity>(`/my-entities/${id}`, data),
  delete: (id: string) => del(`/my-entities/${id}`),
};

// 在 src/services/api/index.ts 导出
export { myApi } from './myEntity';
```

## 主题配置

- 添加主题色：`src/pages/Settings/AppearancePanel/components/ThemeColorSelector/index.tsx` 的 `THEME_COLORS` 数组

## 设置配置项

- 配置文件：`src/constants/settings.tsx`
- 通过修改 `SETTINGS_CONFIG` 数组配置显示哪些设置项
- 配置为空时：设置入口不显示、访问 /settings 显示 404、不设置主题色 CSS 变量

```typescript
export const SETTINGS_CONFIG: SettingItem[] = [
  {
    key: 'appearance',
    labelKey: 'settings.appearance',
    icon: <SkinOutlined />,
    component: AppearancePanel,
  },
  {
    key: 'language',
    labelKey: 'settings.language',
    icon: <GlobalOutlined />,
    component: LanguagePanel,
  },
];
```

## 弹窗/抽屉组件

- Modal 使用 `destroyOnHidden` 属性确保语言切换时 placeholder 更新
- Drawer 使用 `destroyOnHidden` 属性
- 页面模块的弹窗/抽屉抽成独立组件放在 `components/` 目录下

## 404 页面

- 页面文件：`src/pages/NotFound/index.tsx`
- 路由：catch-all 路由 `{ path: '*', component: NotFound, title: '404', labelKey: 'common.notFound', hidden: true }`

## 代码提交规则

- **没有明确要求提交代码时，不要执行 git commit**

## 代码规范

### 导入路径
- 优先使用路径别名 `@/`
- 保持导入风格一致

### 类型安全
- 避免使用 `any`，必要时使用类型断言
- 事件处理函数使用 `useCallback` 稳定引用
- 计算结果使用 `useMemo` 缓存

### 性能优化
- resize 事件添加防抖
- 合理使用 React Hooks 依赖项

### API 服务层
- API 接口定义放在 `src/services/api/` 下，按模块拆分为单个文件
- 请求/响应类型定义放在对应 API 文件中
- 使用 `@/services/request` 中的 `get/post/put/del/patch` 方法