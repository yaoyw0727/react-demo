# 页面需求文档 - 用户管理 (User)

**页面路径**: `/system/user`  
**路由配置**: `{ path: '/system/user', component: User, title: '用户管理', labelKey: 'menu.systemUser' }`  
**父级路由**: `/system` (系统管理)  
**滚动模式**: 模式二（标题下滚动）  
**优先级**: P0

---

## 1. 页面概述

### 1.1 页面定位

用户管理页面是系统管理模块的核心页面之一，主要职责：
- 展示系统用户列表
- 支持添加新用户
- 提供用户搜索功能
- 支持用户编辑和删除操作

### 1.2 目标用户

系统管理员，负责管理系统中的用户账号和权限。

### 1.3 核心价值

| 价值维度 | 说明 |
|---------|------|
| **用户管理** | 集中管理系统用户账号 |
| **快速搜索** | 支持按用户名快速查找用户 |
| **便捷操作** | 提供添加、编辑、删除用户的完整操作 |

---

## 2. 功能需求

### 2.1 功能列表

| 功能项 | 说明 | 优先级 | 状态 |
|-------|------|--------|------|
| 页面标题 | 显示"用户管理"标题 | P0 | 已实现 |
| 用户列表展示 | 表格展示用户信息 | P0 | 已实现 |
| 搜索功能 | 按用户名搜索 | P1 | 已实现 |
| 添加用户 | 弹窗表单添加新用户 | P0 | 已实现 |
| 编辑用户 | 编辑现有用户信息 | P1 | 待实现 |
| 删除用户 | 删除用户（带确认） | P1 | 待实现 |
| 表格滚动 | 内容区独立滚动 | P0 | 已实现 |
| 分页功能 | 固定分页器在底部 | P1 | 已实现 |

### 2.2 详细功能说明

#### 2.2.1 页面标题

**功能描述**: 显示页面主标题"用户管理"

**交互说明**:
- 使用 `Typography.Title` 组件，级别为 `level={3}`
- 标题文字通过国际化 key `user.title` 获取
- 应用 CSS Module 样式 `styles.title`

#### 2.2.2 用户列表展示

**功能描述**: 以表格形式展示系统用户列表

**数据模型**:
```typescript
interface User {
  key: string;          // 唯一标识
  username: string;     // 用户名
  email: string;        // 邮箱
  role: string;         // 角色（管理员/普通用户）
  status: string;       // 状态（启用/禁用）
}
```

**表格列配置**:

| 列名 | 数据字段 | 国际化 Key | 说明 |
|-----|---------|-----------|------|
| 用户名 | `username` | `user.username` | 显示用户账号名 |
| 邮箱 | `email` | `user.email` | 显示用户邮箱地址 |
| 角色 | `role` | `user.role` | 显示用户角色 |
| 状态 | `status` | `user.status` | 显示用户状态 |
| 操作 | `action` | `user.action` | 编辑和删除按钮 |

**操作列按钮**:

| 按钮 | 样式 | 国际化 Key | 功能 |
|-----|------|-----------|------|
| 编辑 | `color="primary" variant="link"` | `common.edit` | 编辑用户信息（待实现） |
| 删除 | `type="link" danger` | `common.delete` | 删除用户（待实现） |

**初始数据**:
- 使用模拟数据，生成 20 条用户记录
- 第一条用户角色为"管理员"，其余为"普通用户"
- 每 5 条用户状态为"禁用"，其余为"启用"

#### 2.2.3 搜索功能

**功能描述**: 支持按用户名搜索用户

**交互说明**:
- 使用 `Input` 组件，带搜索图标前缀
- 占位符文字: `user.searchPlaceholder`
- 搜索框宽度: 240px
- 当前版本为**前端静态搜索**，未实现实际过滤逻辑

#### 2.2.4 添加用户

**功能描述**: 通过弹窗表单添加新用户

**交互说明**:
- 点击"添加用户"按钮打开弹窗
- 按钮样式: `type="primary"` 带 `PlusOutlined` 图标
- 按钮文字: `user.addUser`

**弹窗组件**: `UserModal` (独立组件)

**弹窗表单字段**:

| 字段 | 类型 | 必填 | 验证规则 | 占位符 |
|-----|------|------|---------|--------|
| 用户名 | Input | 是 | 不能为空 | `user.usernamePlaceholder` |
| 邮箱 | Input | 是 | 不能为空 + 邮箱格式 | `user.emailPlaceholder` |
| 角色 | Select | 是 | 不能为空 | `user.rolePlaceholder` |

**角色选项**:
- 管理员 (`common.admin`)
- 普通用户 (`user.normalUser`)

**操作流程**:
1. 用户填写表单
2. 点击"确定"按钮
3. 表单验证通过
4. 新用户添加到列表顶部
5. 显示成功提示消息
6. 关闭弹窗并重置表单

**弹窗属性**:
- `destroyOnHidden`: 确保语言切换时 placeholder 更新
- `okText`: `common.save`
- `cancelText`: `common.cancel`

#### 2.2.5 表格滚动

**功能描述**: 使用自定义 Hook 动态计算表格滚动高度

**技术实现**:
```typescript
const { containerRef, scrollY } = useTableScrollY({ offset: 60 });
```

**参数说明**:
- `offset: 60`: 表格顶部到容器顶部的偏移量
- `containerRef`: 绑定到表格容器 div
- `scrollY`: 动态计算的表格滚动高度

**滚动行为**:
- 表格 body 独立滚动
- 表头固定在顶部
- 窗口 resize 时自动重新计算高度（防抖 100ms）

#### 2.2.6 分页功能

**功能描述**: 固定分页器在页面底部

**配置**:
- `total`: 数据总数（20）
- `showSizeChanger`: false（不显示每页条数切换）
- `showQuickJumper`: false（不显示快速跳转）

---

## 3. UI/UX 设计

### 3.1 页面布局

```
┌──────────────────────────────────────────────┐
│  用户管理 (标题固定)                          │
├──────────────────────────────────────────────┤
│  [🔍 搜索用户...]           [+ 添加用户]      │  ← 工具栏
├──────────────────────────────────────────────┤
│  ┌────────────────────────────────────────┐  │
│  │ 用户名 │ 邮箱 │ 角色 │ 状态 │ 操作     │  │  ← 表头固定
│  ├────────────────────────────────────────┤  │
│  │ user1  │ ... │ ... │ ... │ 编辑 删除  │  │
│  │ user2  │ ... │ ... │ ... │ 编辑 删除  │  │
│  │ ...    │     │     │     │            │  │  ← 表格 body 滚动
│  │ user20 │ ... │ ... │ ... │ 编辑 删除  │  │
│  └────────────────────────────────────────┘  │
├──────────────────────────────────────────────┤
│  共 20 条           < 1 2 >                   │  ← 分页固定
└──────────────────────────────────────────────┘
```

### 3.2 组件层次结构

```
User
├── Title (level=3) - 用户管理标题
├── div.toolbar
│   ├── Input (搜索框)
│   └── Button (添加用户)
├── div.tableContainer (ref={containerRef})
│   └── Table
│       ├── columns (5 列)
│       └── dataSource (20 条数据)
├── div.pagination
│   └── Pagination
└── UserModal (弹窗组件)
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
| `react` | useState, useCallback Hooks |
| `antd` | Table, Typography, Button, Space, Input, Pagination, App, Modal, Form, Select |
| `@ant-design/icons` | SearchOutlined, PlusOutlined 图标 |
| `react-i18next` | useTranslation Hook |
| `@/layouts/hooks/useTableScrollY` | 表格滚动高度计算 Hook |
| `./components/UserModal` | 添加用户弹窗组件 |
| `./index.module.less` | CSS Module 样式 |

### 4.2 状态管理

**本地状态**:

| 状态 | 类型 | 说明 |
|-----|------|------|
| `data` | `User[]` | 用户列表数据 |
| `modalVisible` | `boolean` | 弹窗显示状态 |

**状态更新**:
```typescript
const handleOk = useCallback((values) => {
  const newUser = { ...values, key: String(data.length + 1), status: '启用' };
  setData((prev) => [newUser, ...prev]);
  message.success(t('common.success'));
  setModalVisible(false);
}, [data.length, message]);
```

### 4.3 国际化 Keys

| Key | 中文 | 英文 |
|-----|------|------|
| `user.title` | 用户管理 | User Management |
| `user.username` | 用户名 | Username |
| `user.email` | 邮箱 | Email |
| `user.role` | 角色 | Role |
| `user.status` | 状态 | Status |
| `user.action` | 操作 | Action |
| `user.searchPlaceholder` | 搜索用户 | Search users |
| `user.addUser` | 添加用户 | Add User |
| `user.usernameRequired` | 请输入用户名 | Please enter username |
| `user.usernamePlaceholder` | 请输入用户名 | Enter username |
| `user.emailRequired` | 请输入邮箱 | Please enter email |
| `user.emailInvalid` | 请输入有效的邮箱地址 | Please enter a valid email |
| `user.emailPlaceholder` | 请输入邮箱 | Enter email |
| `user.roleRequired` | 请选择角色 | Please select role |
| `user.rolePlaceholder` | 请选择角色 | Select role |
| `user.normalUser` | 普通用户 | Normal User |
| `user.statusEnabled` | 启用 | Enabled |
| `user.statusDisabled` | 禁用 | Disabled |

### 4.4 文件结构

```
src/pages/System/User/
├── index.tsx                  # 页面组件
├── index.module.less          # 页面样式
├── components/                # 模块公共组件
│   └── UserModal/
│       └── index.tsx          # 添加用户弹窗
└── locales/                   # 国际化文件
    ├── zh-cn/zh-cn.json
    └── en-us/en-us.json
```

---

## 5. 交互流程

### 5.1 添加用户流程

```
1. 用户点击 [添加用户] 按钮
2. UserModal 弹窗打开
3. 用户填写表单（用户名、邮箱、角色）
4. 用户点击 [确定] 按钮
5. 表单验证
   ├─ 验证失败 → 显示错误提示，停留在弹窗
   └─ 验证成功 → 继续
6. 新用户添加到 data 状态（列表顶部）
7. 显示成功提示 message.success
8. 弹窗关闭，表单重置
9. 表格自动更新显示新用户
```

### 5.2 表格滚动流程

```
1. 页面加载 → useTableScrollY 计算初始 scrollY
2. 用户滚动表格 → 表格 body 滚动，表头固定
3. 窗口 resize → 防抖 100ms 后重新计算 scrollY
4. 表格滚动高度自动调整
```

---

## 6. 性能要求

| 指标 | 要求 | 说明 |
|-----|------|------|
| 首屏渲染 | < 200ms | 20 条模拟数据 |
| 表格滚动 | 60fps | 使用 CSS 硬件加速 |
| 添加用户 | < 100ms | 状态更新和重新渲染 |
| resize 响应 | < 150ms | 防抖 100ms + 计算 50ms |

---

## 7. 测试要点

### 7.1 功能测试

| 测试项 | 预期结果 |
|-------|---------|
| 页面加载显示 20 条用户 | 表格显示 20 行数据 |
| 第一条用户角色为管理员 | 第一行角色列显示"管理员" |
| 点击添加用户打开弹窗 | UserModal 弹窗显示 |
| 表单验证 - 用户名为空 | 显示"请输入用户名"错误 |
| 表单验证 - 邮箱格式错误 | 显示"请输入有效的邮箱地址"错误 |
| 表单验证 - 角色未选择 | 显示"请选择角色"错误 |
| 提交成功添加用户 | 新用户出现在列表顶部 |
| 提交成功显示提示 | 显示成功消息 |
| 取消弹窗重置表单 | 关闭弹窗后表单清空 |
| 表格滚动正常 | 表头固定，body 可滚动 |
| 窗口 resize 后表格高度调整 | 表格高度自动适应 |

### 7.2 样式测试

| 测试项 | 预期结果 |
|-------|---------|
| 工具栏布局 | 搜索框在左，按钮在右 |
| 表格列宽 | 各列宽度合理分配 |
| 操作按钮样式 | 编辑为 primary link，删除为 danger link |
| 分页器位置 | 固定在表格底部 |
| 深色模式 | 表格背景色和文字色正确切换 |

### 7.3 边界测试

| 测试项 | 预期结果 |
|-------|---------|
| 添加大量用户 | 表格滚动性能正常 |
| 快速连续点击添加 | 不会重复提交 |
| 弹窗中切换语言 | placeholder 文字正确更新 |

---

## 8. 扩展规划

### 8.1 短期优化

| 功能 | 说明 | 优先级 |
|-----|------|--------|
| 实现搜索过滤 | 前端过滤用户列表 | P1 |
| 实现编辑功能 | 编辑现有用户信息 | P1 |
| 实现删除功能 | 删除用户（带确认弹窗） | P1 |
| 分页逻辑 | 实现真实分页功能 | P1 |

### 8.2 中期规划

| 功能 | 说明 | 优先级 |
|-----|------|--------|
| 批量操作 | 批量启用/禁用/删除用户 | P2 |
| 用户详情 | 点击用户名查看详情 | P2 |
| 状态切换 | 直接切换用户启用/禁用状态 | P2 |
| 导出功能 | 导出用户列表为 Excel | P2 |

### 8.3 长期规划

| 功能 | 说明 | 优先级 |
|-----|------|--------|
| 后端对接 | 对接真实用户管理 API | P0 |
| 权限控制 | 基于角色的操作权限控制 | P0 |
| 操作日志 | 记录用户管理操作日志 | P1 |

---

**文档结束**
