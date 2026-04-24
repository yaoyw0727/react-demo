# 开发指南

本文档记录本项目的开发经验和注意事项。

## 页面滚动实现

本项目有三种页面滚动模式，根据实际需求选择合适的实现方式。

### 模式一：整个内容区滚动

面包屑固定，内容区整体滚动。

**实现方式**：
- 页面组件添加 `overflow-y: auto` 样式
- 隐藏滚动条

**参考页面**：`src/pages/Home`、`src/pages/About`

**代码示例**：

```less
.container {
  display: flex;
  flex-direction: column;
  min-height: 0;
  flex: 1;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none !important;
  }
}
```

```tsx
<div className={styles.container}>
  <Title level={2} className={styles.title}>页面标题</Title>
  <div className={styles.content}>
    {/* 内容可滚动 */}
  </div>
</div>
```

### 模式二：面包屑以下部分滚动

面包屑和页面标题固定，页面标题下方内容滚动。

**实现方式**：
- 页面标题设置为 `flex-shrink: 0`
- 内容区设置 `flex: 1` 和 `overflow-y: auto`

**参考页面**：`src/pages/User`、`src/pages/Role`

**代码示例**：

```less
.container {
  display: flex;
  flex-direction: column;
  min-height: 0;
  flex: 1;

  .title {
    margin: 0;
    padding: 16px 0;
    flex-shrink: 0;
  }

  .content {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none !important;
    }
  }
}
```

### 模式三：面包屑、页面标题、工具栏固定，表格 body 滚动

页面标题和工具栏固定，表格内容区独立滚动，分页固定。

**实现方式**：
- 使用 Table 组件的 `scroll={{ y: height }}` 属性
- 动态计算表格高度（避免硬编码）
- 分页组件独立放置在表格下方

**参考页面**：`src/pages/ProductCategory`

**代码示例**：

```tsx
const ProductCategory: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(300);

  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setScrollY(rect.height - 76);
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  return (
    <div className={styles.container}>
      <Title level={3} className={styles.title}>产品分类</Title>
      <div className={styles.toolbar}>{/* 搜索栏等工具 */}</div>
      <div className={styles.tableContainer} ref={containerRef}>
        <Table columns={columns} dataSource={data} pagination={false} scroll={{ y: scrollY }} />
      </div>
      <div className={styles.pagination}>
        <Pagination total={30} showSizeChanger={false} showQuickJumper={false} />
      </div>
    </div>
  );
};
```

```less
.container {
  display: flex;
  flex-direction: column;
  min-height: 0;
  flex: 1;

  .title, .toolbar {
    flex-shrink: 0;
  }

  .tableContainer {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .pagination {
    flex-shrink: 0;
    padding-top: 16px;
    display: flex;
    justify-content: flex-end;
  }
}
```

### 滚动模式对比

| 模式 | 固定部分 | 滚动部分 | 适用场景 |
|------|---------|---------|---------|---------|
| 模式一 | 面包屑 | 整个内容区 | 简单页面，内容不多 |
| 模式二 | 面包屑、页面标题 | 内容区 | 有表格或列表的页面 |
| 模式三 | 面包屑、页面标题、工具栏 | 表格 body | 大数据量表格 |

## 国际化（多语言）支持

### 当前支持的语言

- `zh-CN`：简体中文
- `en-US`：英文

### 添加新语言步骤

#### 1. 添加语言文件

在 `src/locales/` 目录下创建语言文件：

```bash
src/locales/
├── zh-CN.json    # 中文翻译
├── en-US.json   # 英文翻译
└── ja-JP.json  # 新增：日文翻译
```

#### 2. 添加语言标识常量

在 `src/constants/index.ts` 中添加语言选项：

```typescript
export const LANGUAGE_OPTIONS = [
  { value: 'zh-CN', label: '简体���文', flag: '🇨🇳' },
  { value: 'en-US', label: 'English', flag: '🇺🇸' },
  { value: 'ja-JP', label: '日本語', flag: '🇯🇵' }, // 新增
];
```

#### 3. 注册新语言到 i18next

编辑 `src/utils/i18n.ts`：

```typescript
import zhCN from 'antd/locale/zh_CN';
import enUS from 'antd/locale/en_US';
import jaJP from 'antd/locale/ja_JP'; // 新增

const resources = {
  'zh-CN': { translation: require('../locales/zh-CN.json') },
  'en-US': { translation: require('../locales/en-US.json') },
  'ja-JP': { translation: require('../locales/ja-JP.json') }, // 新增
};

// 在 ConfigProvider 中使用
const antLocale = useMemo(() => {
  switch (language) {
    case 'zh-CN': return zhCN;
    case 'en-US': return enUS;
    case 'ja-JP': return jaJP; // 新增
    default: return zhCN;
  }
}, [language]);
```

#### 4. 添加页面翻译 key

编辑语言文件 `src/locales/ja-JP.json`：

```json
{
  "menu.home": "ホーム",
  "menu.about": "について",
  "settings.appearance": "外観設定",
  "settings.language": "言語設定"
}
```

## 路由配置

### 添加新页面

1. 创建页面组件：`src/pages/YourPage/index.tsx`

2. 在 `src/routes/index.tsx` 中注册：

```typescript
{
  path: '/your-page',
  component: YourPage,
  title: '页面标题',
  labelKey: 'menu.yourPage',
}
```

### 添加嵌套路由

```typescript
{
  path: '/parent',
  title: '父级菜单',
  labelKey: 'menu.parent',
  children: [
    { path: '/parent/child1', component: Child1Page, title: '子页面1', labelKey: 'menu.child1' },
    { path: '/parent/child2', component: Child2Page, title: '子页面2', labelKey: 'menu.child2' },
  ],
}
```

父级路由如果不需要独立页面，可以不指定 `component`，系统会自动使用 `Outlet` 渲染子页面。

## 主题配置

### 添加新主题色

在 `src/pages/Settings/AppearancePanel/components/ThemeColorSelector/index.tsx` 的 `THEME_COLORS` 数组中添加：

```typescript
const THEME_COLORS = [
  { value: '#1890ff', label: '拂晓蓝', labelEn: 'Dawn Blue' },
  { value: '#52c41a', label: '极光绿', labelEn: 'Aurora Green' },
  { value: '#722ed1', label: '酱紫', labelEn: 'Violet' },
  { value: '#f5222d', label: '薄暮', labelEn: 'Sunset' },
  { value: '#fa8c16', label: '日暮', labelEn: 'Dusk' },
  { value: '#13c2c2', label: '明青', labelEn: 'Cyan' },
  { value: '#eb2f96', label: '玫瑰', labelEn: 'Rose' }, // 新增
];
```

### 布局模式说明

- `top`：顶部菜单模式
- `side`：侧边栏菜单模式

在 `src/store/appearance.ts` 中设置：

```typescript
const useAppearanceStore = create(
  persist(
    (set) => ({
      layoutMode: 'side', // 或 'top'
    }),
    { name: 'appearance-storage' }
  )
);
```

## 状态管理

使用 Zustand 进行状态管理，状态数据自动持久化到 localStorage。

### appearance store

管理外观相关状态：

- `layoutMode`：布局模式
- `themeMode`：主题模式（light/dark）
- `primaryColor`：主题色

### language store

管理语言偏好：

- `language`：当前语言代码