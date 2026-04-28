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
src/pages/
├── About/          # 简单页面（无子目录）
├── Home/          # 简单页面
├── Settings/      # 设置模块（有子页面和公共组件）
│   ├── AppearancePanel/     # 外观设置子页面
│   ├── LanguagePanel/        # 语言设置子页面
│   ├── components/        # Settings 公共组件（如 ActionsBar）
│   └── locales/         # 翻译文件
├── Product/       # 业务模块（父目录仅组织子页面）
│   ├── ProductList/
│   └── ProductCategory/
└── System/       # 业务模块
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

## 国际化

- 语言代码：**小写** `zh-cn`, `en-us`
- 语言文件位置：`src/pages/{PageName}/locales/{语言代码}/{语言代码}.json`
- 示例：`src/pages/Home/locales/zh-cn/zh-cn.json`
- ThemeConfig 中配置 antd locale：
  ```typescript
  const antLocale = useMemo(() => {
    switch (language) {
      case 'zh-cn': return zhCN;
      case 'en-us': return enUS;
      default: return zhCN;
    }
  }, [language]);
  ```

## antd message

- **禁止** `import { message } from 'antd'`
- 必须使用：`const { message } = App.useApp()`
- ThemeConfig 需用 `AntApp` 包裹子组件

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