# 开发指南

本文档面向初次接触本项目的开发者，详细说明日常开发工作的各个环节。阅读本文档后，你应该能够独立完成添加新页面、新主题色、新语言、新设置项等开发任务。

---

## 目录

1. [项目概述](#一项目概述)
2. [环境准备](#二环境准备)
3. [项目结构详解](#三项目结构详解)
4. [代码规范](#四代码规范)
5. [添加新页面](#五添加新页面)
6. [添加新主题色](#六添加新主题色)
7. [添加新布局模式](#七添加新布局模式)
8. [添加新语言](#八添加新语言)
9. [添加新设置项](#九添加新设置项)
10. [状态管理](#十状态管理)
11. [路由配置](#十一路由配置)
12. [常见问题](#十二常见问题)

---

## 一、项目概述

### 1.1 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| React | 19 | UI 框架 |
| TypeScript | - | 类型系统 |
| Vite | 8 | 构建工具 |
| Ant Design | 6 | UI 组件库 |
| Zustand | 5 | 状态管理 |
| react-router-dom | - | 路由管理 |
| i18next | - | 国际化 |
| less | - | 样式预处理 |

### 1.2 核心特性

- **主题切换**：支持浅色/深色主题切换
- **多语言支持**：支持简体中文、英文
- **布局模式**：支持顶部菜单和侧边栏菜单两种布局
- **响应式设计**：适配不同屏幕尺寸

### 1.3 关键命令

```bash
# 安装依赖（首次或添加新依赖后执行）
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview
```

---

## 二、环境准备

### 2.1 前置要求

确保本地已安装：

1. **Node.js**（推荐 v18+）
   - 检查命令：`node -v`

2. **pnpm**（推荐）
   - 安装命令：`npm install -g pnpm`

### 2.2 启动项目

```bash
# 进入项目目录
cd path/to/project

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

启动成功后，访问终端显示的地址（通常是 http://localhost:5173）。

---

## 三、项目结构详解

### 3.1 完整目录结构

```
src/
├── assets/                      # 静态资源
│   ├── images/                  # 图片资源
│   │   ├── flag_zh-CN.svg      # 语言切换图标
│   │   └── flag_en-US.svg
│   └── styles/                  # 全局样式
│       ├── global.less          # 全局样式
│       └── antd-override.less   # antd 样式覆盖
│
├── components/                  # 全局可复用组件（整个项目都能用）
│   ├── ThemeConfig/            # 主题配置（重要，理解主题原理）
│   │   ├── index.tsx           # 主题配置组件
│   │   └── tools.ts            # 主题相关工具函数
│   ├── IconFont/               # 图标字体组件
│   └── CustomButton/           # 自定义按钮组件
│
├── layouts/                     # 布局组件（页面的整体框架）
│   ├── MainLayout/             # 主布局入口
│   │   ├── index.tsx           # 主布局组件
│   │   ├── tools.tsx           # 布局工具函数
│   │   └── global.css          # 布局全局样式
│   ├── components/             # 具体布局实现
│   │   ├── SiderMenuLayout/    # 侧边栏菜单布局
│   │   │   ├── index.tsx
│   │   │   └── index.module.less
│   │   └── TopMenuLayout/      # 顶部菜单布局
│   │       ├── index.tsx
│   │       └── index.module.less
│   └── hooks/                  # 布局相关自定义 Hook
│       ├── useMenu.tsx         # 菜单相关逻辑（菜单高亮、面包屑等）
│       └── useTableScrollY.ts  # 表格滚动高度计算
│
├── pages/                       # 页面组件（每个页面一个目录）
│   ├── Home/                   # 首页
│   │   ├── index.tsx           # 页面主组件
│   │   ├── index.module.less   # 样式文件
│   │   └── locales/            # 翻译文件
│   │       ├── zh-cn/zh-cn.json
│   │       └── en-us/en-us.json
│   ├── About/                  # 关于页
│   ├── Settings/               # 设置模块（复杂模块示例）
│   │   ├── index.tsx           # 设置主页（包含子页面切换）
│   │   ├── index.module.less
│   │   ├── AppearancePanel/    # 外观设置子页面
│   │   │   ├── index.tsx
│   │   │   ├── index.module.less
│   │   │   └── components/     # 外观设置子组件
│   │   │       ├── LayoutModeSelector/
│   │   │       ├── ThemeModeSelector/
│   │   │       └── ThemeColorSelector/
│   │   ├── LanguagePanel/      # 语言设置子页面
│   │   ├── components/         # Settings 公共组件
│   │   │   └── ActionsBar/     # 操作栏（保存、取消、重置）
│   │   └── locales/            # Settings 公共翻译
│   ├── Product/                # 产品模块（父目录仅组织子页面）
│   │   ├── ProductList/        # 产品列表
│   │   └── ProductCategory/    # 产品分类
│   └── System/                 # 系统模块
│       ├── User/               # 用户管理
│       └── Role/               # 角色管理
│
├── routes/                      # 路由配置
│   ├── index.tsx               # 路由定义（主要配置在这里）
│   └── tools.tsx               # 路由工具函数
│
├── store/                       # Zustand 状态管理
│   ├── appearance.ts           # 外观状态（主题、布局）
│   ├── language.ts             # 语言状态
│   └── counter.ts              # 示例状态
│
├── utils/                       # 工具函数
│   └── i18n.ts                 # 国际化初始化配置
│
├── constants/                  # 常量定义
│   └── index.ts                # 项目常量（主题色、布局模式等）
│
├── locales/                    # 公共翻译文件（所有页面都能用）
│   ├── zh-cn/zh-cn.json
│   └── en-us/en-us.json
│
├── App.tsx                     # 应用根组件（路由配置在这里）
└── main.tsx                    # 入口文件
```

### 3.2 命名规范

| 类型 | 命名规则 | 示例 |
|------|----------|------|
| 目录 | PascalCase | `ProductList`, `ThemeConfig`, `ActionsBar` |
| 组件文件 | `index.tsx` 或 `ComponentName.tsx` | `index.tsx`、`ThemeConfig.tsx` |
| 样式文件 | `index.module.less` | `index.module.less` |
| Hook 文件 | `useXXX.tsx` | `useMenu.tsx`、`useTableScrollY.tsx` |
| 语言文件 | `{语言代码}.json` | `zh-cn.json`、`en-us.json` |
| Store 文件 | `{name}.ts` | `appearance.ts`、`language.ts` |

**组件文件命名规则**：
- **`index.tsx`** - 目录作为单一组件使用
  - 目录本身就是一个完整的功能单元
  - 目录只包含一个主要组件
  - 示例：
    - `src/components/UserDropdown/index.tsx` - 用户下拉菜单组件
    - `src/pages/Settings/components/ActionsBar/index.tsx` - 操作栏组件

- **`ComponentName.tsx`** - 目录包含多个相关组件
  - 目录是一个组件库，包含多个子组件
  - 子组件较简单（单文件即可实现）
  - 需要在外部通过文件名导入具体组件
  - 示例：
    - `src/components/Buttons/PrimaryButton.tsx` - 主按钮
    - `src/components/Buttons/SecondaryButton.tsx` - 次按钮

**建议**：优先使用 `index.tsx`，目录即组件，结构更清晰。

### 3.3 页面目录结构规范

每个页面必须按照以下结构创建：

```
pages/YourPage/           # 页面目录，目录名使用 PascalCase（如 ProductList）
├── index.tsx             # 必选，页面主组件
├── index.module.less     # 必选，样式文件（使用 CSS Modules）
└── locales/              # 必选，翻译文件目录
    ├── zh-cn/           # 必选，中文翻译
    │   └── zh-cn.json   # 必选，文件名必须是 {语言代码}.json
    └── en-us/           # 必选，英文翻译
        └── en-us.json
```

### 3.3 语言代码规范

| 语言 | 代码（目录名） | 代码（代码中） |
|------|---------------|---------------|
| 简体中文 | `zh-cn` | `zh-CN` |
| 英文 | `en-us` | `en-US` |

**注意**：
- 翻译文件目录使用**小写**（如 `zh-cn`）
- 代码中语言代码使用**首字母大写**（如 `zh-CN`）
- 这是为了与 i18next 和 antd 的约定保持一致

---

## 四、代码规范

### 4.1 导入路径规范

**优先使用路径别名 `@/`**，避免使用相对路径 `../`。

```tsx
// ✅ 推荐
import { useState } from 'react';
import { useAppearanceStore } from '@/store/appearance';
import { useTableScrollY } from '@/layouts/hooks/useTableScrollY';

// ❌ 避免
import { useState } from '../../../../components/...';
```

### 4.2 组件注释规范

每个组件文件头部应有 JSDoc 注释：

```tsx
/**
 * 组件名称或功能描述
 * 更详细的说明（可选）
 */
import React from 'react';

const MyComponent: React.FC = () => {
  // ...
};

export default MyComponent;
```

### 4.3 antd Message 使用规范

**禁止**直接从 antd 导入 message：

```tsx
// ❌ 错误
import { message } from 'antd';
message.success('成功');
```

**必须**使用 `App.useApp()` 获取：

```tsx
// ✅ 正确
const MyComponent: React.FC = () => {
  const { message } = App.useApp();
  message.success('成功');
  // ...
};
```

**原因**：`App.useApp()` 是 Ant Design 6 推荐的方式，可以确保 message 的位置和样式正确。

### 4.4 类型安全规范

- 避免使用 `any`，必要时使用类型断言
- 事件处理函数使用 `useCallback` 稳定引用
- 计算结果使用 `useMemo` 缓存

```tsx
// ✅ 推荐：明确类型
const handleClick = useCallback((e: React.MouseEvent) => {
  console.log(e.target);
}, []);

// ❌ 避免：使用 any
const handleClick = (e: any) => { ... };
```

### 4.5 样式文件规范

- 使用 less 预处理器
- 使用 CSS Modules（`*.module.less`）避免样式污染
- 隐藏滚动条时使用标准方式：

```less
.container {
  overflow-y: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */

  &::-webkit-scrollbar {
    display: none; /* Chrome/Safari/Opera */
  }
}
```

---

## 五、添加新页面

本项目有三种页面滚动模式，根据页面类型选择。

### 5.1 模式一：整区滚动（简单页面）

**适用场景**：页面内容不多，不需要表格，如首页、关于页。

**特点**：面包屑固定，整个内容区一起滚动。

#### 步骤一：创建页面文件

```tsx
// src/pages/About/index.tsx
import React from 'react';
import { Typography, Card } from 'antd';
import { useTranslation } from 'react-i18next';
import styles from './index.module.less';

const { Title, Paragraph } = Typography;

/**
 * 关于页面
 * 展示项目介绍信息
 */
const About: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <Title level={2} className={styles.title}>{t('about.title')}</Title>
      <Card>
        <Paragraph>{t('about.content')}</Paragraph>
      </Card>
    </div>
  );
};

export default About;
```

```less
// src/pages/About/index.module.less
.container {
  padding: 24px;
  height: 100%;
  overflow-y: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.title {
  margin-bottom: 16px;
}
```

#### 步骤二：创建翻译文件

```json
// src/pages/About/locales/zh-cn/zh-cn.json
{
  "about.title": "关于",
  "about.content": "这是一个基于 React + Ant Design 的后台管理系统。"
}
```

```json
// src/pages/About/locales/en-us/en-us.json
{
  "about.title": "About",
  "about.content": "This is a React + Ant Design based admin system."
}
```

#### 步骤三：注册路由

编辑 `src/routes/index.tsx`：

```tsx
import About from '@/pages/About';

// 在 routes 数组中添加
{ path: '/about', component: About, title: '关于', labelKey: 'menu.about' }
```

#### 步骤四：添加菜单翻译

编辑 `src/locales/zh-cn/zh-cn.json`：

```json
{
  "menu.about": "关于"
}
```

### 5.2 模式二：标题下滚动（有表格/列表的页面）

**适用场景**：有表格或列表的页面，如用户管理、角色管理。

**特点**：面包屑和页面标题固定，内容区域滚动。

#### 步骤一：创建页面文件

```tsx
// src/pages/System/User/index.tsx
import React from 'react';
import { Table, Typography, Button, Space, Input, Pagination } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import styles from './index.module.less';

const { Title } = Typography;

/**
 * 用户管理页面
 * 展示用户列表，支持搜索和分页
 */
const User: React.FC = () => {
  const { t } = useTranslation();

  const columns = [
    { title: t('user.username'), dataIndex: 'username', key: 'username' },
    { title: t('user.email'), dataIndex: 'email', key: 'email' },
    { title: t('user.role'), dataIndex: 'role', key: 'role' },
    {
      title: t('user.action'),
      key: 'action',
      render: () => (
        <Space>
          <Button type="link" size="small">{t('common.edit')}</Button>
          <Button type="link" size="small" danger>{t('common.delete')}</Button>
        </Space>
      ),
    },
  ];

  // 模拟数据
  const data = Array.from({ length: 20 }, (_, i) => ({
    key: String(i + 1),
    username: `user${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: t('user.normalUser'),
  }));

  return (
    <div className={styles.container}>
      <Title level={3} className={styles.title}>{t('user.title')}</Title>
      <div className={styles.toolbar}>
        <Input
          placeholder={t('user.searchPlaceholder')}
          prefix={<SearchOutlined />}
          style={{ width: 240 }}
        />
        <Button type="primary" icon={<PlusOutlined />}>
          {t('user.addUser')}
        </Button>
      </div>
      <div className={styles.tableWrapper}>
        <Table columns={columns} dataSource={data} pagination={false} />
      </div>
      <div className={styles.pagination}>
        <Pagination total={20} showSizeChanger={false} />
      </div>
    </div>
  );
};

export default User;
```

```less
// src/pages/System/User/index.module.less
.container {
  display: flex;
  flex-direction: column;
  min-height: 0;
  flex: 1;
  padding: 24px;
  overflow: hidden;
}

.title {
  margin: 0;
  padding: 16px 0;
  flex-shrink: 0;
}

.toolbar {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  flex-shrink: 0;
}

.tableWrapper {
  flex: 1;
  min-height: 0;
  overflow: auto;
}

.pagination {
  flex-shrink: 0;
  padding-top: 16px;
  display: flex;
  justify-content: flex-end;
}
```

#### 步骤二：创建翻译文件

```json
// src/pages/System/User/locales/zh-cn/zh-cn.json
{
  "user.title": "用户管理",
  "user.username": "用户名",
  "user.email": "邮箱",
  "user.role": "角色",
  "user.action": "操作",
  "user.searchPlaceholder": "搜索用户名...",
  "user.addUser": "新增用户",
  "user.normalUser": "普通用户"
}
```

#### 步骤三：注册路由

编辑 `src/routes/index.tsx`：

```tsx
import User from '@/pages/System/User';

// 添加路由
{ path: '/system/user', component: User, title: '用户管理', labelKey: 'menu.systemUser' }
```

### 5.3 模式三：表格独立滚动（大数据量表格）

**适用场景**：大数据量表格，需要固定表头和工具栏。

**特点**：面包屑、页面标题、工具栏都固定，只有表格 body 滚动。

**关键**：必须使用 `useTableScrollY` Hook 动态计算高度。

#### 步骤一：创建页面文件

```tsx
// src/pages/Product/ProductCategory/index.tsx
import React from 'react';
import { Table, Button, Input, Typography, Pagination } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useTableScrollY } from '@/layouts/hooks/useTableScrollY';
import styles from './index.module.less';

const { Title } = Typography;

/**
 * 产品分类页面
 * 展示产品分类列表，表格独立滚动
 */
const ProductCategory: React.FC = () => {
  const { t } = useTranslation();
  
  // 使用 useTableScrollY 计算表格高度
  // offset 参数根据实际布局调整：有标题+工具栏时用 76
  const { containerRef, scrollY } = useTableScrollY({ offset: 76 });

  const columns = [
    { title: t('product.categoryName'), dataIndex: 'name', key: 'name' },
    { title: t('product.categoryDescription'), dataIndex: 'description', key: 'description' },
    { title: t('product.productCount'), dataIndex: 'productCount', key: 'productCount' },
    { title: t('product.sort'), dataIndex: 'sort', key: 'sort' },
  ];

  // 模拟数据
  const data = Array.from({ length: 30 }, (_, i) => ({
    key: String(i + 1),
    name: `${t('product.product')} ${i + 1}`,
    description: `${t('product.categoryDescriptionPrefix')} ${i + 1}`,
    productCount: Math.floor(Math.random() * 100),
    sort: i + 1,
  }));

  return (
    <div className={styles.container}>
      <Title level={3} className={styles.title}>{t('product.categoryTitle')}</Title>
      <div className={styles.toolbar}>
        <Input
          placeholder={t('product.categorySearchPlaceholder')}
          prefix={<SearchOutlined />}
          style={{ width: 240 }}
        />
        <Button type="primary" icon={<PlusOutlined />}>
          {t('product.addCategory')}
        </Button>
      </div>
      {/* 将 containerRef 绑定到表格容器 */}
      <div className={styles.tableContainer} ref={containerRef}>
        <Table 
          columns={columns} 
          dataSource={data} 
          pagination={false} 
          scroll={{ y: scrollY }}  // 使用计算出的高度
        />
      </div>
      <div className={styles.pagination}>
        <Pagination total={30} showSizeChanger={false} />
      </div>
    </div>
  );
};

export default ProductCategory;
```

```less
// src/pages/Product/ProductCategory/index.module.less
.container {
  display: flex;
  flex-direction: column;
  min-height: 0;
  flex: 1;
  padding: 24px;
  overflow: hidden;
}

.title {
  margin: 0;
  padding: 16px 0;
  flex-shrink: 0;
}

.toolbar {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
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
```

#### useTableScrollY Hook 参数说明

```tsx
const { containerRef, scrollY } = useTableScrollY({ 
  offset: 76,      // 表格顶部到容器顶部的偏移量（像素）
  debounceMs: 100  // resize 事件防抖时间（毫秒）
});
```

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| offset | number | 60 | 表格顶部到容器顶部的偏移量 |
| debounceMs | number | 100 | resize 防抖时间 |

**如何确定 offset 值**：
- 只有标题：`offset: 60`
- 标题 + 工具栏：`offset: 76`
- 实际使用时先设一个值，观察表格是否填满可用空间，灵活调整

### 5.4 添加嵌套路由（子页面）

如果需要创建一组相关的页面（如"系统管理"包含"用户管理"和"角色管理"），按以下步骤：

#### 步骤一：创建模块目录结构

```
src/pages/System/
├── User/                  # 用户管理
│   ├── index.tsx
│   ├── index.module.less
│   └── locales/...
├── Role/                  # 角色管理
│   ├── index.tsx
│   ├── index.module.less
│   └── locales/...
└── index.tsx              # 可选，仅用于菜单分组
```

#### 步骤二：注册嵌套路由

编辑 `src/routes/index.tsx`：

```tsx
import User from '@/pages/System/User';
import Role from '@/pages/System/Role';

// 添加嵌套路由
{
  path: '/system',
  title: '系统管理',
  labelKey: 'menu.system',
  icon: <SettingOutlined />,
  children: [
    { path: '/system/user', component: User, title: '用户管理', labelKey: 'menu.systemUser' },
    { path: '/system/role', component: Role, title: '角色管理', labelKey: 'menu.systemRole' },
  ],
}
```

#### 步骤三：添加菜单翻译

编辑 `src/locales/zh-cn/zh-cn.json`：

```json
{
  "menu.system": "系统管理",
  "menu.systemUser": "用户管理",
  "menu.systemRole": "角色管理"
}
```

**注意**：子路由路径是相对路径，写 `user` 而不是 `/system/user`。

---

## 六、添加新主题色

### 6.1 主题色配置位置

主题色在 `src/pages/Settings/AppearancePanel/components/ThemeColorSelector/index.tsx` 文件中定义。

### 6.2 添加新主题色步骤

#### 步骤一：打开主题色配置文件

文件路径：`src/pages/Settings/AppearancePanel/components/ThemeColorSelector/index.tsx`

找到 `THEME_COLORS` 数组。

#### 步骤二：添加新颜色

```typescript
const THEME_COLORS = [
  { key: 'blue', value: '#1890ff', label: '拂晓蓝', labelEn: 'Dawn Blue' },
  { key: 'green', value: '#52c41a', label: '极光绿', labelEn: 'Aurora Green' },
  { key: 'purple', value: '#722ed1', label: '酱紫', labelEn: 'Violet' },
  { key: 'red', value: '#f5222d', label: '薄暮', labelEn: 'Sunset' },
  { key: 'orange', value: '#fa8c16', label: '日暮', labelEn: 'Dusk' },
  { key: 'cyan', value: '#13c2c2', label: '明青', labelEn: 'Cyan' },
  // 添加新颜色
  { key: 'pink', value: '#eb2f96', label: '玫瑰', labelEn: 'Rose' },
];
```

**参数说明**：
- `key`：颜色标识（用于内部识别）
- `value`：颜色的十六进制值
- `label`：中文名称（用于中文界面显示）
- `labelEn`：英文名称（用于英文界面显示）

### 6.3 主题色生效原理

1. 用户在设置页面选择主题色
2. `appearance` store 更新 `primaryColor` 状态
3. `ThemeConfig` 组件监听 store 变化
4. 使用 Ant Design 的 `ConfigProvider` 的 `theme.token.colorPrimary` 应用主题色

---

## 七、添加新布局模式

### 7.1 布局模式类型

本项目支持两种布局模式：
- `top`：顶部菜单模式
- `side`：侧边栏菜单模式

### 7.2 布局模式配置位置

- **类型定义**：`src/constants/index.ts`
- **状态管理**：`src/store/appearance.ts`

### 7.3 添加新布局模式步骤

#### 步骤一：更新类型定义

编辑 `src/constants/index.ts`：

```typescript
// 添加新的布局模式类型
export type LayoutMode = 'top' | 'side' | 'mix'; // 新增 'mix' 模式

// 更新默认配置
export const DEFAULT_APPEARANCE = {
  layoutMode: 'top' as LayoutMode,
  themeMode: 'light' as ThemeMode,
  primaryColor: '#1890ff',
};
```

#### 步骤二：更新 Store

编辑 `src/store/appearance.ts`：

```typescript
interface AppearanceState {
  layoutMode: LayoutMode;  // 类型已自动更新
  setLayoutMode: (mode: LayoutMode) => void;
  // ...
}
```

#### 步骤三：实现布局组件（可选）

如果新布局需要不同的 UI，需要在 `src/layouts/components/` 下创建对应的布局组件，并在 `MainLayout/index.tsx` 中添加判断逻辑。

---

## 八、添加新语言

### 8.1 添加新语言步骤

假设要添加"日文"（ja-JP）。

#### 步骤一：创建翻译文件

在每个页面的 `locales/` 目录下创建日文翻译文件：

```
src/pages/About/locales/
├── zh-cn/zh-cn.json
├── en-us/en-us.json
└── ja-jp/              # 新增
    └── ja-jp.json     # 日文翻译
```

```json
// src/pages/About/locales/ja-jp/ja-jp.json
{
  "about.title": "について",
  "about.content": "これはReact + Ant Designベースの管理システムです。"
}
```

#### 步骤二：更新语言 Store

编辑 `src/store/language.ts`：

```typescript
import flagCn from '@/assets/images/flag_zh-CN.svg';
import flagEn from '@/assets/images/flag_en-US.svg';
import flagJp from '@/assets/images/flag_ja-JP.svg'; // 需要添加对应图片

// 更新语言类型
export type Language = 'zh-CN' | 'en-US' | 'ja-JP';

// 更新语言列表
export const languages = [
  { key: 'zh-CN', image: flagCn, label: '中文', labelEn: 'Chinese', nativeLabel: '中文' },
  { key: 'en-US', image: flagEn, label: '英文', labelEn: 'English', nativeLabel: '英文' },
  { key: 'ja-JP', image: flagJp, label: '日语', labelEn: 'Japanese', nativeLabel: '日本語' },
];
```

#### 步骤三：添加 antd 语言包

编辑 `src/components/ThemeConfig/index.tsx`：

```typescript
import zhCN from 'antd/locale/zh_CN';
import enUS from 'antd/locale/en_US';
import jaJP from 'antd/locale/ja_JP';  // 导入日文语言包

// 更新 switch 语句
const antLocale = useMemo(() => {
  switch (language) {
    case 'zh-CN': return zhCN;
    case 'en-US': return enUS;
    case 'ja-JP': return jaJP;
    default: return zhCN;
  }
}, [language]);
```

### 8.2 添加语言图标

在 `src/assets/images/` 目录下添加对应语言的国旗图标：
- `flag_zh-CN.svg`
- `flag_en-US.svg`
- `flag_ja-JP.svg`

---

## 九、添加新设置项

### 9.1 设置页面结构

设置页面位于 `src/pages/Settings/`，采用"左侧菜单 + 右侧内容"的布局：

```
src/pages/Settings/
├── index.tsx           # 设置主页（包含菜单和内容切换）
├── index.module.less
├── AppearancePanel/    # 外观设置
│   ├── index.tsx
│   ├── components/     # 外观设置子组件
│   │   ├── LayoutModeSelector/
│   │   ├── ThemeModeSelector/
│   │   └── ThemeColorSelector/
│   └── locales/
├── LanguagePanel/      # 语言设置
│   ├── index.tsx
│   └── locales/
└── components/         # 公共组件（如 ActionsBar）
    └── ActionsBar/
```

### 9.2 添加新设置面板步骤

假设要添加"通知设置"面板。

#### 步骤一：创建通知设置面板

```tsx
// src/pages/Settings/NotificationPanel/index.tsx
import React from 'react';
import { Form, Switch, App } from 'antd';
import { useTranslation } from 'react-i18next';
import ActionsBar from '../components/ActionsBar';
import styles from './index.module.less';

/**
 * 通知设置面板
 * 配置系统通知相关选项
 */
const NotificationPanel: React.FC = () => {
  const { message } = App.useApp();
  const { t } = useTranslation();
  
  // 实际项目中，这里应该连接 store 来存储设置
  const [settings, setSettings] = React.useState({
    emailNotify: true,
    pushNotify: true,
  });

  const handleSave = () => {
    message.success(t('settings.settingsSaved'));
    // TODO: 保存到 store
  };

  const handleCancel = () => {
    message.info(t('settings.settingsCanceled'));
  };

  const handleReset = () => {
    message.success(t('settings.settingsReset'));
    // TODO: 重置为默认值
  };

  return (
    <div className={styles.panel}>
      <Form layout="vertical">
        <Form.Item label={t('settings.emailNotify')}>
          <Switch 
            checked={settings.emailNotify}
            onChange={(checked) => setSettings({ ...settings, emailNotify: checked })}
          />
        </Form.Item>
        <Form.Item label={t('settings.pushNotify')}>
          <Switch 
            checked={settings.pushNotify}
            onChange={(checked) => setSettings({ ...settings, pushNotify: checked })}
          />
        </Form.Item>
      </Form>
      <ActionsBar onReset={handleReset} onCancel={handleCancel} onSave={handleSave} />
    </div>
  );
};

export default NotificationPanel;
```

```less
// src/pages/Settings/NotificationPanel/index.module.less
.panel {
  padding: 24px;
}
```

#### 步骤二：创建翻译文件

```json
// src/pages/Settings/NotificationPanel/locales/zh-cn/zh-cn.json
{
  "settings.emailNotify": "邮件通知",
  "settings.pushNotify": "推送通知"
}
```

#### 步骤三：在设置主页中添加菜单项

编辑 `src/pages/Settings/index.tsx`：

```tsx
import React, { useState } from 'react';
import { Menu } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import AppearancePanel from './AppearancePanel';
import LanguagePanel from './LanguagePanel';
import NotificationPanel from './NotificationPanel'; // 导入
import styles from './index.module.less';
import { useAppearanceStore } from '../../store/appearance';

const Settings: React.FC = () => {
  const [activeKey, setActiveKey] = useState('appearance');
  const themeMode = useAppearanceStore((state) => state.themeMode);
  const { t } = useTranslation();

  const settingMenus = [
    { key: 'appearance', icon: <SkinOutlined />, label: t('settings.appearance') },
    { key: 'language', icon: <GlobalOutlined />, label: t('settings.language') },
    { key: 'notification', icon: <BellOutlined />, label: t('settings.notification') }, // 新增
  ];

  const renderPanel = () => {
    switch (activeKey) {
      case 'appearance':
        return <AppearancePanel />;
      case 'language':
        return <LanguagePanel />;
      case 'notification':  // 新增
        return <NotificationPanel />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <Menu
          mode="inline"
          theme={themeMode ?? 'light'}
          selectedKeys={[activeKey]}
          items={settingMenus}
          onClick={({ key }) => setActiveKey(key)}
        />
      </div>
      <div className={styles.content}>
        {renderPanel()}
      </div>
    </div>
  );
};

export default Settings;
```

#### 步骤四：添加翻译

在公共翻译文件 `src/locales/zh-cn/zh-cn.json` 中添加：

```json
{
  "settings.notification": "通知设置",
  "settings.emailNotify": "邮件通知",
  "settings.pushNotify": "推送通知"
}
```

---

## 十、状态管理

### 10.1 Zustand 简介

Zustand 是一个轻量级的状态管理库，用于在组件间共享数据。

### 10.2 创建 Store

```typescript
// src/store/myStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface MyState {
  // 状态
  value: string;
  // 方法
  setValue: (value: string) => void;
  reset: () => void;
}

const defaultValues = {
  value: 'default',
};

export const useMyStore = create<MyState>()(
  persist(
    (set) => ({
      ...defaultValues,
      setValue: (value) => set({ value }),
      reset: () => set(defaultValues),
    }),
    {
      name: 'my-storage',      // localStorage 键名
      storage: createJSONStorage(() => localStorage),
    }
  )
);
```

### 10.3 使用 Store

```tsx
import { useMyStore } from '@/store/myStore';

const MyComponent: React.FC = () => {
  // 方式一：解构所有需要的属性和方法
  const { value, setValue } = useMyStore();

  // 方式二：只获取需要的状态（性能更好）
  const valueOnly = useMyStore((state) => state.value);

  return (
    <div>
      <p>当前值: {value}</p>
      <button onClick={() => setValue('new value')}>修改</button>
    </div>
  );
};
```

### 10.4 本项目的 Store

| Store 文件 | 作用 | 持久化到 localStorage |
|-----------|------|---------------------|
| `appearance.ts` | 主题色、布局模式、主题模式 | 是 |
| `language.ts` | 当前语言 | 是 |
| `counter.ts` | 示例计数器 | 否 |

---

## 十一、路由配置

### 11.1 路由配置位置

路由在 `src/routes/index.tsx` 中定义。

### 11.2 RouteConfig 接口

```typescript
interface RouteConfig {
  path: string;                    // 路由路径，必须以 / 开头
  component?: React.ComponentType; // 对应的页面组件
  title: string;                  // 页面标题（用于菜单显示）
  labelKey: string;               // 翻译 key（用于多语言菜单）
  icon?: React.ReactNode;         // 菜单图标（可选）
  children?: RouteConfig[];      // 子路由（可选）
  hidden?: boolean;              // 是否隐藏（不在菜单显示）
}
```

### 11.3 路由示例

```typescript
// 简单路由
{ path: '/', component: Home, title: '首页', labelKey: 'menu.home' }

// 带图标
{ path: '/about', component: About, title: '关于', labelKey: 'menu.about', icon: <InfoCircleOutlined /> }

// 隐藏路由（不显示在菜单，但可以访问）
{ path: '/settings', component: Settings, title: '设置', labelKey: 'menu.settings', icon: <SettingOutlined />, hidden: true }

// 嵌套路由
{
  path: '/system',
  title: '系统管理',
  labelKey: 'menu.system',
  icon: <SettingOutlined />,
  children: [
    { path: '/system/user', component: User, title: '用户管理', labelKey: 'menu.systemUser' },
    { path: '/system/role', component: Role, title: '角色管理', labelKey: 'menu.systemRole' },
  ],
}
```

**重要**：
- 子路由路径是**相对路径**，不要写父路径前缀
- 正确：`path: '/system/user'`，子路由写 `user`
- 错误：子路由写 `/system/user`

---

## 十二、常见问题

### 12.1 修改后页面没有变化

1. 检查控制台是否有报错
2. 尝试重启开发服务器：`Ctrl + C` 然后 `pnpm dev`
3. 清除浏览器缓存

### 12.2 翻译没有显示

1. 检查翻译文件是否在正确目录（页面目录下或 `src/locales/`）
2. 检查 key 是否匹配（注意大小写和命名空间）
3. 检查语言代码是否正确（目录名是 `zh-cn`，不是 `zh-CN`）
4. 重启开发服务器

### 12.3 样式没有生效

1. 检查 less 文件是否正确引入（`import styles from './index.module.less'`）
2. 检查 className 是否正确使用（`className={styles.container}`）
3. 检查样式优先级是否被覆盖

### 12.4 表格高度计算不对

1. 检查是否使用了 `useTableScrollY` Hook
2. 调整 `offset` 参数：
   - 表格下方有空白 → 增大 offset
   - 表格被截断 → 减小 offset

---

本指南会持续更新，如有疑问请提 Issue。