# 页面需求文档 - 角色管理 (Role)

**页面路径**: `/system/role`  
**路由配置**: `{ path: '/system/role', component: Role, title: '角色管理', labelKey: 'menu.systemRole' }`  
**父级路由**: `/system` (系统管理)  
**滚动模式**: 模式二（标题下滚动）  
**优先级**: P0

---

## 1. 页面概述

### 1.1 页面定位

角色管理页面是系统管理模块的重要页面，主要职责：
- 展示系统角色列表
- 显示每个角色的权限配置
- 支持角色搜索和管理操作

### 1.2 目标用户

系统管理员，负责管理系统中的角色和权限分配。

### 1.3 核心价值

| 价值维度 | 说明 |
|---------|------|
| **角色管理** | 集中管理系统角色 |
| **权限可视化** | 以标签形式展示角色权限 |
| **状态管理** | 显示角色启用/禁用状态 |

---

## 2. 功能需求

### 2.1 功能列表

| 功能项 | 说明 | 优先级 | 状态 |
|-------|------|--------|------|
| 页面标题 | 显示"角色管理"标题 | P0 | 已实现 |
| 角色列表展示 | 表格展示角色信息 | P0 | 已实现 |
| 权限标签显示 | 以 Tag 组件展示权限 | P0 | 已实现 |
| 搜索功能 | 按角色名称搜索 | P1 | 已实现（静态） |
| 添加角色 | 添加新角色 | P1 | 待实现 |
| 编辑角色 | 编辑现有角色 | P1 | 待实现 |
| 删除角色 | 删除角色 | P1 | 待实现 |
| 表格滚动 | 内容区独立滚动 | P0 | 已实现 |
| 分页功能 | 固定分页器在底部 | P1 | 已实现 |

### 2.2 详细功能说明

#### 2.2.1 页面标题

**功能描述**: 显示页面主标题"角色管理"

**交互说明**:
- 使用 `Typography.Title` 组件，级别为 `level={3}`
- 标题文字通过国际化 key `role.title` 获取
- 应用 CSS Module 样式 `styles.title`

#### 2.2.2 角色列表展示

**功能描述**: 以表格形式展示系统角色列表

**数据模型**:
```typescript
interface Role {
  key: string;          // 唯一标识
  name: string;         // 角色名称
  description: string;  // 角色描述
  permissions: string[];// 权限列表
  status: string;       // 状态（启用/禁用）
}
```

**表格列配置**:

| 列名 | 数据字段 | 国际化 Key | 说明 |
|-----|---------|-----------|------|
| 角色名称 | `name` | `role.name` | 显示角色名称 |
| 角色描述 | `description` | `role.description` | 显示角色描述 |
| 权限 | `permissions` | `role.permissions` | 以标签形式展示权限列表 |
| 状态 | `status` | `role.status` | 显示角色状态 |
| 操作 | `action` | `role.action` | 编辑和删除按钮 |

**权限列渲染**:
- 使用 `Tag` 组件展示每个权限
- 标签颜色: `blue`
- 多个权限标签水平排列
- 权限文字通过国际化 key 获取

**初始数据** (3 条模拟数据):

| 角色 | 描述 | 权限 | 状态 |
|-----|------|------|------|
| 管理员 | 拥有所有系统权限 | 用户管理、角色管理、设置 | 启用 |
| 普通用户 | 基本查看权限 | 权限查看 | 启用 |
| 访客 | 只读访问权限 | 权限查看 | 禁用 |

#### 2.2.3 搜索功能

**功能描述**: 支持按角色名称搜索角色

**交互说明**:
- 使用 `Input` 组件，带搜索图标前缀
- 占位符文字: `role.searchPlaceholder`
- 搜索框宽度: 240px
- 当前版本为**前端静态搜索**，未实现实际过滤逻辑

#### 2.2.4 添加角色

**功能描述**: 通过按钮添加新角色

**交互说明**:
- 点击"添加角色"按钮（当前未实现弹窗）
- 按钮样式: `type="primary"` 带 `PlusOutlined` 图标
- 按钮文字: `role.addRole`

#### 2.2.5 表格滚动

**功能描述**: 手动实现表格滚动高度动态计算

**技术实现** (未使用 Hook，内联实现):
```typescript
const containerRef = useRef<HTMLDivElement>(null);
const [scrollY, setScrollY] = useState(300);

useEffect(() => {
  const updateHeight = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setScrollY(rect.height - 60);
    }
  };
  updateHeight();
  window.addEventListener('resize', updateHeight);
  return () => window.removeEventListener('resize', updateHeight);
}, []);
```

**参数说明**:
- `offset: 60`: 表格顶部到容器顶部的偏移量
- `containerRef`: 绑定到表格容器 div
- `scrollY`: 动态计算的表格滚动高度
- 初始值: 300px

**注意**: 此页面未使用 `useTableScrollY` Hook，而是内联实现了相同逻辑。

#### 2.2.6 分页功能

**功能描述**: 固定分页器在页面底部

**配置**:
- `total`: 3（固定值）
- `showSizeChanger`: false
- `showQuickJumper`: false

---

## 3. UI/UX 设计

### 3.1 页面布局

```
┌──────────────────────────────────────────────┐
│  角色管理 (标题固定)                          │
├──────────────────────────────────────────────┤
│  [🔍 搜索角色...]           [+ 添加角色]      │  ← 工具栏
├──────────────────────────────────────────────┤
│  ┌────────────────────────────────────────┐  │
│  │ 角色名称 │ 描述 │ 权限 │ 状态 │ 操作   │  │  ← 表头固定
│  ├────────────────────────────────────────┤  │
│  │ 管理员 │ ... │ [用户][角色][设置] │ 启用│  │
│  │ 普通用户│ ... │ [权限查看] │ 启用  │    │  │  ← 表格 body 滚动
│  │ 访客   │ ... │ [权限查看] │ 禁用  │    │  │
│  └────────────────────────────────────────┘  │
├──────────────────────────────────────────────┤
│  共 3 条           < 1 >                      │  ← 分页固定
└──────────────────────────────────────────────┘
```

### 3.2 组件层次结构

```
Role
├── Title (level=3) - 角色管理标题
├── div.toolbar
│   ├── Input (搜索框)
│   └── Button (添加角色)
├── div.tableContainer (ref={containerRef})
│   └── Table
│       ├── columns (5 列)
│       │   └── permissions 列 → Tag[] 渲染
│       └── dataSource (3 条数据)
└── div.pagination
    └── Pagination
```

### 3.3 样式规范

**CSS Module 类名**:

| 类名 | 用途 | 说明 |
|-----|------|------|
| `container` | 页面容器 | 控制页面整体布局 |
| `title` | 标题样式 | 标题间距 |
| `toolbar` | 工具栏 | 搜索框和按钮的布局 |
| `tableContainer` | 表格容器 | 控制表格滚动区域 |
| `pagination` | 分页容器 | 分页器固定在底部 |

---

## 4. 技术实现

### 4.1 使用的依赖

| 依赖 | 用途 |
|-----|------|
| `react` | useState, useEffect, useRef Hooks |
| `antd` | Table, Typography, Button, Space, Input, Tag, Pagination |
| `@ant-design/icons` | SearchOutlined, PlusOutlined 图标 |
| `react-i18next` | useTranslation Hook |
| `./index.module.less` | CSS Module 样式 |

### 4.2 状态管理

**本地状态**:

| 状态 | 类型 | 说明 |
|-----|------|------|
| `scrollY` | `number` | 表格滚动高度 |
| `containerRef` | `RefObject<HTMLDivElement>` | 表格容器引用 |

**数据**: 使用组件内硬编码的模拟数据（3 条角色记录），非状态管理。

### 4.3 国际化 Keys

| Key | 中文 | 英文 |
|-----|------|------|
| `role.title` | 角色管理 | Role Management |
| `role.name` | 角色名称 | Role Name |
| `role.description` | 角色描述 | Description |
| `role.permissions` | 权限 | Permissions |
| `role.status` | 状态 | Status |
| `role.action` | 操作 | Action |
| `role.searchPlaceholder` | 搜索角色 | Search roles |
| `role.addRole` | 添加角色 | Add Role |
| `role.adminDescription` | 拥有所有系统权限 | Has all system permissions |
| `role.normalUserDescription` | 基本查看权限 | Basic view permissions |
| `role.guest` | 访客 | Guest |
| `role.guestDescription` | 只读访问权限 | Read-only access |
| `role.statusEnabled` | 启用 | Enabled |
| `role.statusDisabled` | 禁用 | Disabled |
| `role.permissionView` | 权限查看 | View Permissions |

### 4.4 文件结构

```
src/pages/System/Role/
├── index.tsx                  # 页面组件
├── index.module.less          # 页面样式
└── locales/                   # 国际化文件
    ├── zh-cn/zh-cn.json
    └── en-us/en-us.json
```

---

## 5. 交互流程

### 5.1 表格滚动流程

```
1. 页面加载 → useEffect 执行 updateHeight
2. 计算 containerRef 高度 - 60 = scrollY
3. 用户滚动表格 → 表格 body 滚动，表头固定
4. 窗口 resize → 触发 updateHeight 重新计算
5. 表格滚动高度自动调整
```

### 5.2 权限标签渲染流程

```
1. 表格渲染 permissions 列
2. render 函数接收 permissions 数组
3. 遍历数组，为每个权限生成 <Tag color="blue">
4. 多个标签水平排列显示
```

---

## 6. 性能要求

| 指标 | 要求 | 说明 |
|-----|------|------|
| 首屏渲染 | < 200ms | 3 条模拟数据 |
| 表格滚动 | 60fps | 使用 CSS 硬件加速 |
| resize 响应 | < 150ms | 直接计算，无防抖 |

---

## 7. 测试要点

### 7.1 功能测试

| 测试项 | 预期结果 |
|-------|---------|
| 页面加载显示 3 条角色 | 表格显示 3 行数据 |
| 管理员角色权限显示 3 个标签 | 显示 [用户管理] [角色管理] [设置] |
| 普通用户权限显示 1 个标签 | 显示 [权限查看] |
| 访客状态为禁用 | 状态列显示"禁用" |
| 表格滚动正常 | 表头固定，body 可滚动 |
| 窗口 resize 后表格高度调整 | 表格高度自动适应 |

### 7.2 样式测试

| 测试项 | 预期结果 |
|-------|---------|
| 权限标签颜色 | 所有标签为蓝色 |
| 工具栏布局 | 搜索框在左，按钮在右 |
| 分页器位置 | 固定在表格底部 |
| 深色模式 | 表格背景色和文字色正确切换 |

### 7.3 兼容性测试

| 浏览器 | 测试要点 |
|-------|---------|
| Chrome 90+ | 所有功能正常 |
| Firefox 88+ | 所有功能正常 |
| Safari 14+ | 所有功能正常 |
| Edge 90+ | 所有功能正常 |

---

## 8. 代码改进建议

### 8.1 当前问题

| 问题 | 说明 | 建议 |
|-----|------|------|
| 未使用 Hook | 内联实现表格滚动计算 | 使用 `useTableScrollY` Hook 保持一致性 |
| 无添加角色弹窗 | 按钮点击无响应 | 创建 `RoleModal` 组件 |
| 编辑/删除未实现 | 操作列按钮无功能 | 实现编辑和删除逻辑 |
| 搜索未实现 | 搜索框无过滤功能 | 实现前端搜索过滤 |

### 8.2 重构建议

```typescript
// 建议改为使用 Hook
const { containerRef, scrollY } = useTableScrollY({ offset: 60 });

// 数据改为状态管理
const [data, setData] = useState(initialRoles);
```

---

## 9. 扩展规划

### 9.1 短期优化

| 功能 | 说明 | 优先级 |
|-----|------|--------|
| 添加角色弹窗 | 创建 RoleModal 组件 | P1 |
| 实现搜索过滤 | 前端过滤角色列表 | P1 |
| 实现编辑功能 | 编辑现有角色信息 | P1 |
| 实现删除功能 | 删除角色（带确认） | P1 |

### 9.2 中期规划

| 功能 | 说明 | 优先级 |
|-----|------|--------|
| 权限配置器 | 可视化配置角色权限 | P2 |
| 角色复制 | 复制现有角色快速创建 | P2 |
| 批量操作 | 批量启用/禁用角色 | P2 |

### 9.3 长期规划

| 功能 | 说明 | 优先级 |
|-----|------|--------|
| 后端对接 | 对接真实角色管理 API | P0 |
| RBAC 集成 | 基于角色的访问控制 | P0 |
| 权限树 | 树形结构展示权限 | P1 |

---

**文档结束**
