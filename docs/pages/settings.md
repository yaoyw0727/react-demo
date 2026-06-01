# 页面需求文档 - 设置 (Settings)

**页面路径**: `/settings`  
**路由配置**: 动态生成（基于 `SETTINGS_CONFIG`）  
**滚动模式**: 模式一（整区滚动）  
**优先级**: P0

---

## 1. 页面概述

### 1.1 页面定位

设置页面是系统配置的集中管理入口，主要职责：
- 提供外观设置（布局、主题、主题色）
- 提供语言设置（中英文切换）
- 基于配置动态生成设置面板
- 支持设置保存、取消、重置操作

### 1.2 目标用户

所有系统用户，可根据个人偏好自定义系统外观和语言。

### 1.3 核心价值

| 价值维度 | 说明 |
|---------|------|
| **个性化定制** | 用户可根据偏好自定义系统外观 |
| **配置驱动** | 通过 `SETTINGS_CONFIG` 灵活配置显示哪些设置项 |
| **即时生效** | 设置保存后立即生效，无需刷新页面 |
| **持久化存储** | 设置自动保存到 localStorage，刷新不丢失 |

---

## 2. 功能需求

### 2.1 功能列表

| 功能项 | 说明 | 优先级 | 状态 |
|-------|------|--------|------|
| 动态菜单生成 | 根据配置生成设置菜单 | P0 | 已实现 |
| 外观设置面板 | 布局、主题、主题色配置 | P0 | 已实现 |
| 语言设置面板 | 系统语言切换 | P0 | 已实现 |
| 保存设置 | 保存设置到 store | P0 | 已实现 |
| 取消设置 | 取消更改恢复原值 | P0 | 已实现 |
| 重置设置 | 重置为默认值 | P0 | 已实现 |
| 单配置项优化 | 仅一个配置时隐藏侧边菜单 | P1 | 已实现 |
| 设置入口隐藏 | 无配置时设置入口不显示 | P1 | 已实现 |

### 2.2 详细功能说明

#### 2.2.1 动态菜单生成

**功能描述**: 根据 `SETTINGS_CONFIG` 数组动态生成设置菜单

**配置结构**:
```typescript
interface SettingItem {
  key: string;              // 设置项唯一标识
  labelKey: string;         // 国际化 key
  icon: React.ReactNode;    // 设置项图标
  component: React.ComponentType; // 设置面板组件
}
```

**当前配置**:
```typescript
export const SETTINGS_CONFIG: SettingItem[] = [
  { key: 'appearance', labelKey: 'settings.appearance', icon: <SkinOutlined />, component: AppearancePanel },
  { key: 'language', labelKey: 'settings.language', icon: <GlobalOutlined />, component: LanguagePanel },
];
```

**菜单生成逻辑**:
```typescript
const settingMenus = SETTINGS_CONFIG.map((item) => ({
  key: item.key,
  icon: item.icon,
  label: t(item.labelKey),
}));
```

**交互说明**:
- 使用 `Menu` 组件，模式为 `inline`
- 主题跟随系统主题模式
- 点击菜单项切换 `activeKey` 状态
- 默认选中第一个配置项

#### 2.2.2 外观设置面板

**功能描述**: 提供布局模式、主题模式、主题色配置

**组件**: `AppearancePanel`

**配置项**:

| 配置项 | 类型 | 选项 | 默认值 |
|-------|------|------|--------|
| 布局模式 | 单选 | 顶部菜单 / 侧边栏菜单 | 顶部菜单 |
| 主题模式 | 单选 | 浅色 / 深色 | 浅色 |
| 主题色 | 单选 | 6 种预设颜色 | 拂晓蓝 (#1890ff) |

**操作按钮**:

| 按钮 | 功能 | 国际化 Key |
|-----|------|-----------|
| 重置 | 恢复默认值 | `settings.settingsReset` |
| 取消 | 取消更改 | `settings.settingsCanceled` |
| 保存 | 保存设置 | `settings.settingsSaved` |

**状态同步**:
- 使用 `useEffect` 同步表单值与 store
- 使用本地 state 暂存用户选择
- 点击"保存"后才写入 store

#### 2.2.3 语言设置面板

**功能描述**: 提供系统语言切换功能

**组件**: `LanguagePanel`

**可选语言**:

| 语言 | Key | 国旗图标 | 中文标签 | 英文标签 |
|-----|-----|---------|---------|---------|
| 中文 | zh-CN | 🇨🇳 | 中文 | Chinese |
| 英文 | en-US | 🇺🇸 | 英文 | English |

**交互说明**:
- 卡片式选择器，每个语言一个卡片
- 点击卡片选中语言
- 选中状态高亮显示
- 卡片支持 hover 效果

**语言标签显示逻辑**:
```typescript
const isEnglish = i18nInstance.language.startsWith('en');
// 英文环境下显示英文标签，中文环境下显示中文标签
```

**保存逻辑**:
```typescript
const handleSave = () => {
  setLanguage(selectedLang);        // 更新 store
  i18n.changeLanguage(selectedLang); // 切换 i18n 语言
  message.success('设置已保存');
};
```

#### 2.2.4 保存/取消/重置操作

**保存操作**:
- 将本地 state 的值写入 Zustand store
- store 的 persist 中间件自动持久化到 localStorage
- 显示成功提示消息

**取消操作**:
- 恢复本地 state 为 store 当前值
- 不修改 store
- 显示提示消息

**重置操作**:
- 调用 store 的 `resetAppearance` 或 `resetLanguage` 方法
- 恢复为默认值
- 显示成功提示消息

#### 2.2.5 单配置项优化

**功能描述**: 当 `SETTINGS_CONFIG` 只有一个配置项时，隐藏左侧菜单

**判断逻辑**:
```typescript
if (SETTINGS_CONFIG.length === 1) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {ActivePanel && <ActivePanel />}
      </div>
    </div>
  );
}
```

**效果**:
- 多个配置项: 显示左侧菜单 + 右侧内容
- 单个配置项: 只显示内容面板

#### 2.2.6 设置入口隐藏

**功能描述**: 当 `SETTINGS_CONFIG` 为空时，设置入口不显示

**影响范围**:
- 用户下拉菜单中不显示"设置"选项
- 访问 `/settings` 路径显示 404 页面
- 不设置主题相关的 CSS 变量

---

## 3. UI/UX 设计

### 3.1 页面布局（多配置项）

```
┌──────────────────────────────────────────────┐
│  设置                                         │
├──────────────┬───────────────────────────────┤
│  侧边菜单     │  内容面板                      │
│              │                               │
│  🎨 外观     │  ┌─ 布局模式 ───────────────┐  │
│  🌐 语言     │  │  [顶部菜单] [侧边栏]      │  │
│              │  └──────────────────────────┘  │
│              │                               │
│              │  ┌─ 主题模式 ───────────────┐  │
│              │  │  [浅色] [深色]            │  │
│              │  └──────────────────────────┘  │
│              │                               │
│              │  ┌─ 主题色 ─────────────────┐  │
│              │  │  🔵 🟢 🟣 🔴 🟠 🔷      │  │
│              │  └──────────────────────────┘  │
│              │                               │
│              │  ─────────────────────────     │
│              │  [重置] [取消] [保存]          │
└──────────────┴───────────────────────────────┘
```

### 3.2 页面布局（单配置项）

```
┌──────────────────────────────────────────────┐
│  设置                                         │
├──────────────────────────────────────────────┤
│                                              │
│  ┌─ 布局模式 ─────────────────────────────┐  │
│  │  [顶部菜单] [侧边栏]                    │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  ┌─ 主题模式 ─────────────────────────────┐  │
│  │  [浅色] [深色]                          │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  ┌─ 主题色 ───────────────────────────────┐  │
│  │  🔵 🟢 🟣 🔴 🟠 🔷                    │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  ─────────────────────────────────────────   │
│  [重置] [取消] [保存]                        │
└──────────────────────────────────────────────┘
```

### 3.3 组件层次结构

```
Settings
├── (SETTINGS_CONFIG.length === 1)
│   └── div.container
│       └── div.content
│           └── ActivePanel (AppearancePanel 或 LanguagePanel)
│
└── (SETTINGS_CONFIG.length > 1)
    └── div.container
        ├── div.sidebar
        │   └── Menu (mode="inline")
        │       └── MenuItem[] (从 SETTINGS_CONFIG 生成)
        └── div.content
            └── ActivePanel (根据 activeKey 动态渲染)
```

### 3.4 样式规范

**CSS Module 类名**:

| 类名 | 用途 | 说明 |
|-----|------|------|
| `container` | 页面容器 | flex 布局 |
| `sidebar` | 侧边栏 | 左侧菜单容器 |
| `menu` | 菜单 | Menu 组件样式 |
| `content` | 内容区 | 右侧设置面板容器 |

---

## 4. 技术实现

### 4.1 使用的依赖

| 依赖 | 用途 |
|-----|------|
| `react` | useState Hook |
| `antd` | Menu 组件 |
| `react-i18next` | useTranslation Hook |
| `@/constants/settings` | SETTINGS_CONFIG 配置 |
| `@/store/appearance` | useAppearanceStore |
| `./index.module.less` | CSS Module 样式 |

### 4.2 状态管理

**本地状态**:

| 状态 | 类型 | 说明 |
|-----|------|------|
| `activeKey` | `string` | 当前选中的设置项 key |

**全局 Store**:
- `useAppearanceStore`: 外观设置（布局、主题、主题色）
- `useLanguageStore`: 语言设置

**主题模式读取**:
```typescript
const themeMode = useAppearanceStore((state) => state.themeMode);
```

### 4.3 国际化 Keys

| Key | 中文 | 英文 |
|-----|------|------|
| `settings.title` | 设置 | Settings |
| `settings.appearance` | 外观 | Appearance |
| `settings.language` | 语言 | Language |
| `settings.layoutMode` | 布局模式 | Layout Mode |
| `settings.themeMode` | 主题模式 | Theme Mode |
| `settings.themeColor` | 主题色 | Theme Color |
| `settings.systemLanguage` | 系统语言 | System Language |
| `settings.settingsSaved` | 设置已保存 | Settings saved |
| `settings.settingsCanceled` | 已取消设置更改 | Settings changes cancelled |
| `settings.settingsReset` | 设置已重置 | Settings reset |
| `settings.topMenu` | 顶部菜单 | Top Menu |
| `settings.sideMenu` | 侧边栏菜单 | Side Menu |
| `settings.lightMode` | 浅色模式 | Light Mode |
| `settings.darkMode` | 深色模式 | Dark Mode |

### 4.4 文件结构

```
src/pages/Settings/
├── index.tsx                  # 页面组件
├── index.module.less          # 页面样式
├── AppearancePanel/           # 外观设置面板
│   ├── index.tsx
│   ├── index.module.less
│   └── components/
│       ├── LayoutModeSelector/
│       ├── ThemeModeSelector/
│       └── ThemeColorSelector/
├── LanguagePanel/             # 语言设置面板
│   ├── index.tsx
│   └── index.module.less
├── components/                # 设置公共组件
│   └── ActionsBar/            # 操作按钮栏
│       └── index.tsx
└── locales/                   # 国际化文件
    ├── zh-cn/zh-cn.json
    └── en-us/en-us.json
```

---

## 5. 交互流程

### 5.1 设置页面导航流程

```
1. 用户从 UserDropdown 点击"设置"
2. React Router 导航到 /settings
3. Settings 组件渲染
4. 根据 SETTINGS_CONFIG 生成菜单
5. 默认选中第一个配置项
6. 渲染对应的设置面板
```

### 5.2 切换设置面板流程

```
1. 用户点击左侧菜单项
2. Menu onClick 触发 setActiveKey
3. activeKey 更新
4. 查找对应的 component
5. 渲染新的设置面板
```

### 5.3 保存外观设置流程

```
1. 用户选择布局模式 → 更新 selectedLayout
2. 用户选择主题模式 → 更新 selectedTheme
3. 用户选择主题色 → 更新 selectedColor
4. 用户点击 [保存] 按钮
5. handleSave 执行:
   ├─ setLayoutMode(selectedLayout)
   ├─ setThemeMode(selectedTheme)
   ├─ setPrimaryColor(selectedColor)
   └─ message.success('设置已保存')
6. Zustand persist 中间件自动保存到 localStorage
7. ThemeConfig 组件检测到 store 变化
8. 应用主题和布局立即更新
```

### 5.4 切换语言流程

```
1. 用户点击语言卡片 → 更新 selectedLang
2. 用户点击 [保存] 按钮
3. handleSave 执行:
   ├─ setLanguage(selectedLang) → 更新 store
   ├─ i18n.changeLanguage(selectedLang) → 切换语言
   └─ message.success('设置已保存')
4. MainLayout 检测到 language 变化
5. useEffect 触发 i18n.changeLanguage
6. 所有使用 t() 的组件重新渲染
7. 页面文字切换完成
```

---

## 6. 性能要求

| 指标 | 要求 | 说明 |
|-----|------|------|
| 首屏渲染 | < 200ms | 设置面板组件按需加载 |
| 面板切换 | < 100ms | 组件切换无延迟 |
| 语言切换 | < 200ms | i18n 资源已预加载 |
| 主题切换 | < 100ms | CSS 变量即时更新 |

---

## 7. 测试要点

### 7.1 功能测试

| 测试项 | 预期结果 |
|-------|---------|
| 页面加载显示设置菜单 | 显示外观和语言两个选项 |
| 默认选中外观设置 | 外观面板显示 |
| 点击语言菜单 | 语言面板显示 |
| 选择布局模式并保存 | 布局立即切换 |
| 选择主题模式并保存 | 主题立即切换 |
| 选择主题色并保存 | 主题色立即切换 |
| 点击取消恢复原值 | 设置恢复保存前的值 |
| 点击重置恢复默认 | 恢复为 DEFAULT_APPEARANCE |
| 切换语言并保存 | 界面文字切换 |
| 刷新页面设置保留 | 从 localStorage 恢复设置 |

### 7.2 样式测试

| 测试项 | 预期结果 |
|-------|---------|
| 菜单主题跟随系统 | 深色模式下菜单为深色 |
| 语言卡片选中高亮 | 选中卡片有明显高亮 |
| 主题色选择器 | 6 种颜色正确显示 |
| 深色模式 | 设置面板背景色正确切换 |

### 7.3 边界测试

| 测试项 | 预期结果 |
|-------|---------|
| SETTINGS_CONFIG 为空 | 访问 /settings 显示 404 |
| SETTINGS_CONFIG 只有一个 | 不显示左侧菜单 |
| 快速切换面板 | 不会渲染错误 |
| 保存后刷新 | 设置保留 |

---

## 8. 扩展规划

### 8.1 短期优化

| 功能 | 说明 | 优先级 |
|-----|------|--------|
| 更多主题色 | 添加自定义颜色选择器 | P2 |
| 字体大小设置 | 支持调整系统字体大小 | P2 |
| 紧凑模式 | 支持紧凑/默认密度切换 | P2 |

### 8.2 中期规划

| 功能 | 说明 | 优先级 |
|-----|------|--------|
| 主题预览 | 实时预览主题效果 | P2 |
| 导入导出配置 | 导出/导入设置配置 | P2 |
| 多主题支持 | 保存多个主题配置 | P3 |

### 8.3 长期规划

| 功能 | 说明 | 优先级 |
|-----|------|--------|
| 用户级配置 | 不同用户不同设置 | P2 |
| 云端同步 | 设置同步到云端 | P2 |
| 主题市场 | 下载分享主题 | P3 |

---

**文档结束**
