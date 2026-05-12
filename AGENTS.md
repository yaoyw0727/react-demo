# AGENTS.md

## 关键命令

- `npm run dev` - 开发服务器
- `npm run build` - 构建（tsc && vite build）
- `npm run preview` - 预览生产构建

## 技术栈

- React 19 + TypeScript
- Vite 8 + Ant Design 6
- Zustand 5 (状态管理)
- i18next + react-i18next (国际化)

## 核心特性

- **设置可配置**：通过 `SETTINGS_CONFIG` 配置显示哪些设置项
- **主题切换**：支持浅色/深色主题切换（需配置 appearance 项）
- **多语言支持**：支持简体中文、英文（需配置 language 项）
- **布局模式**：支持顶部菜单和侧边栏菜单两种布局

## 项目结构

```
src/
├── assets/              # 静态资源
├── components/          # 全局组件
│   ├── ThemeConfig/    # 主题配置
│   ├── IconFont/       # 图标字体
│   └── CustomButton/  # 自定义按钮
├── layouts/            # 布局组件
│   ├── MainLayout/     # 主布局
│   ├── components/     # 布局子组件
│   │   ├── SiderMenuLayout/
│   │   └── TopMenuLayout/
│   └── hooks/          # 布局相关 Hook
├── pages/              # 页面组件
├── routes/             # 路由配置
├── store/              # Zustand 状态管理
├── utils/              # 工具函数
├── constants/          # 常量定义
│   ├── index.ts        # 项目常量
│   └── settings.tsx    # 设置配置项
└── locales/            # 公共翻译文件

src/pages/
├── About/              # 简单页面
├── Home/               # 首页
├── NotFound/           # 404 页面
├── Settings/           # 设置模块
│   ├── AppearancePanel/
│   ├── LanguagePanel/
│   ├── components/
│   └── locales/
├── Product/            # 产品模块
│   ├── ProductList/
│   └── ProductCategory/
│       └── components/ # 模块公共组件
│           └── CategoryDrawer/
└── System/            # 系统模块
    ├── User/
    │   └── components/ # 模块公共组件
    │       └── UserModal/
    └── Role/
```

## 页面滚动模式

### 模式一：整区滚动
- 面包屑固定，内容区整体滚动
- 适用：简单页面（Home, About）

### 模式二：标题下滚动
- 面包屑+标题固定，内容区滚动
- 适用：有表格/列表的页面（User, Role）

### 模式三：表格独立滚动
- 面包屑+标题+工具栏固定，表格 body 滚动，分页固定
- 适用：大数据量表格（ProductCategory）
- **必须使用** `useTableScrollY` Hook 动态计算高度

## 国际化

- 语言代码：`zh-CN`, `en-US`（首字母大写）
- 语言文件位置（需配置 language 项时）：
  - 页面翻译：`src/pages/{PageName}/locales/{语言代码}/{语言代码}.json`
  - 全局翻译：`src/locales/{语言代码}/{语言代码}.json`
- 如未配置 language 项，页面不需要 locales 文件夹，key 即显示文字
- ThemeConfig 中配置 antd locale：
  ```typescript
  const antLocale = useMemo(() => {
    switch (language) {
      case 'zh-CN': return zhCN;
      case 'en-US': return enUS;
      default: return zhCN;
    }
  }, [language]);
  ```

## antd message

- **禁止** `import { message } from 'antd'`
- 必须使用：`const { message } = App.useApp()`
- ThemeConfig 需用 `AntApp` 包裹子组件

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

## 添加新页面

### 页面结构（根据 SETTINGS_CONFIG 决定）

**无 language 配置项时**：
```
src/pages/NewPage/
├── index.tsx
└── index.module.less
```
直接使用 `t('标题')`，key 即显示文字。

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
{ path: '/new-module', component: NewModule, title: '新模块', labelKey: 'menu.newModule' }
// 或嵌套
{ path: '/new-module', title: '新模块', labelKey: 'menu.newModule', children: [...] }
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
- 路由：catch-all 路由 `{ path: '*', component: NotFound }`

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