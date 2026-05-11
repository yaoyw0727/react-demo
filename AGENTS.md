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
└── locales/            # 公共翻译文件

src/pages/
├── About/              # 简单页面
├── Home/               # 首页
├── Settings/           # 设置模块
│   ├── AppearancePanel/
│   ├── LanguagePanel/
│   ├── components/
│   └── locales/
├── Product/            # 产品模块
│   ├── ProductList/
│   └── ProductCategory/
└── System/            # 系统模块
    ├── User/
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
- 语言文件位置：`src/pages/{PageName}/locales/{语言代码}/{语言代码}.json`
- 示例：`src/pages/Home/locales/zh-cn/zh-cn.json`
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

### 简单页面（无子页面）
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