# 页面需求文档 - 产品分类 (ProductCategory)

**页面路径**: `/product/category`  
**路由配置**: `{ path: '/product/category', component: ProductCategory, title: '产品分类', labelKey: 'menu.productCategory' }`  
**父级路由**: `/product` (产品管理)  
**滚动模式**: 模式三（表格独立滚动）  
**优先级**: P0

---

## 1. 页面概述

### 1.1 页面定位

产品分类页面是产品管理模块的重要页面，主要职责：
- 展示产品分类列表
- 支持添加新分类
- 显示每个分类下的产品数量
- 支持分类排序管理

### 1.2 目标用户

产品管理员，负责管理产品分类体系。

### 1.3 核心价值

| 价值维度 | 说明 |
|---------|------|
| **分类管理** | 集中管理产品分类 |
| **数量统计** | 显示每个分类的产品数量 |
| **排序管理** | 支持自定义分类排序 |

---

## 2. 功能需求

### 2.1 功能列表

| 功能项 | 说明 | 优先级 | 状态 |
|-------|------|--------|------|
| 页面标题 | 显示"产品分类"标题 | P0 | 已实现 |
| 分类列表展示 | 表格展示分类信息 | P0 | 已实现 |
| 搜索功能 | 按分类名称搜索 | P1 | 已实现（静态） |
| 添加分类 | 抽屉表单添加新分类 | P0 | 已实现 |
| 编辑分类 | 编辑现有分类 | P1 | 待实现 |
| 删除分类 | 删除分类 | P1 | 待实现 |
| 表格独立滚动 | 表格 body 独立滚动 | P0 | 已实现 |
| 分页功能 | 固定分页器在底部 | P1 | 已实现 |

### 2.2 详细功能说明

#### 2.2.1 页面标题

**功能描述**: 显示页面主标题"产品分类"

**交互说明**:
- 使用 `Typography.Title` 组件，级别为 `level={3}`
- 标题文字通过国际化 key `product.categoryTitle` 获取
- 应用 CSS Module 样式 `styles.title`

#### 2.2.2 分类列表展示

**功能描述**: 以表格形式展示产品分类列表

**数据模型**:
```typescript
interface Category {
  key: string;          // 唯一标识
  name: string;         // 分类名称
  description: string;  // 分类描述
  productCount: number; // 产品数量
  sort: number;         // 排序值
}
```

**表格列配置**:

| 列名 | 数据字段 | 国际化 Key | 说明 |
|-----|---------|-----------|------|
| 分类名称 | `name` | `product.categoryName` | 显示分类名称 |
| 分类描述 | `description` | `product.categoryDescription` | 显示分类描述 |
| 产品数量 | `productCount` | `product.productCount` | 显示该分类下的产品数量 |
| 排序 | `sort` | `product.sort` | 显示排序值 |

**初始数据**:
- 使用模拟数据，生成 30 条分类记录
- 分类名称: `产品 {序号}`
- 描述: `分类描述 {序号}`
- 产品数量: 随机数 0-100
- 排序: 序号 1-30

#### 2.2.3 搜索功能

**功能描述**: 支持按分类名称搜索

**交互说明**:
- 使用 `Input` 组件，带搜索图标前缀
- 占位符文字: `product.categorySearchPlaceholder`
- 搜索框宽度: 240px
- 当前版本为**前端静态搜索**，未实现实际过滤逻辑

#### 2.2.4 添加分类

**功能描述**: 通过抽屉表单添加新分类

**交互说明**:
- 点击"添加分类"按钮打开抽屉
- 按钮样式: `type="primary"` 带 `PlusOutlined` 图标
- 按钮文字: `product.addCategory`

**抽屉组件**: `CategoryDrawer` (独立组件)

**抽屉表单字段**:

| 字段 | 类型 | 必填 | 验证规则 | 占位符 |
|-----|------|------|---------|--------|
| 分类名称 | Input | 是 | 不能为空 | `product.categoryNamePlaceholder` |
| 分类描述 | TextArea | 否 | 无 | `product.categoryDescriptionPlaceholder` |
| 排序 | InputNumber | 否 | 最小值 1 | 无 |

**抽屉属性**:
- `placement`: "right"（从右侧滑出）
- `width`: 400px
- `destroyOnHidden`: 确保语言切换时 placeholder 更新
- `extra`: 保存按钮

**操作流程**:
1. 用户点击"添加分类"按钮
2. 抽屉从右侧滑出
3. 用户填写表单
4. 用户点击"保存"按钮
5. 表单验证通过
6. 新分类添加到列表顶部
7. 显示成功提示消息
8. 抽屉关闭并重置表单

#### 2.2.5 表格独立滚动

**功能描述**: 使用 `useTableScrollY` Hook 动态计算表格滚动高度

**技术实现**:
```typescript
const { containerRef, scrollY } = useTableScrollY({ offset: 76 });
```

**参数说明**:
- `offset: 76`: 表格顶部到容器顶部的偏移量（含标题 + 工具栏）
- `containerRef`: 绑定到表格容器 div
- `scrollY`: 动态计算的表格滚动高度

**滚动行为**:
- 面包屑 + 标题 + 工具栏固定
- 表格 body 独立滚动
- 表头固定在表格顶部
- 分页器固定在底部
- 窗口 resize 时自动重新计算高度（防抖 100ms）

#### 2.2.6 分页功能

**功能描述**: 固定分页器在页面底部

**配置**:
- `total`: 数据总数（30）
- `showSizeChanger`: false
- `showQuickJumper`: false

---

## 3. UI/UX 设计

### 3.1 页面布局

```
┌──────────────────────────────────────────────┐
│  产品分类 (标题固定)                          │
├──────────────────────────────────────────────┤
│  [🔍 搜索分类...]           [+ 添加分类]      │  ← 工具栏（固定）
├──────────────────────────────────────────────┤
│  ┌────────────────────────────────────────┐  │
│  │ 分类名称 │ 描述 │ 产品数量 │ 排序      │  │  ← 表头固定
│  ├────────────────────────────────────────┤  │
│  │ 产品 1 │ ... │ 45 │ 1                 │  │
│  │ 产品 2 │ ... │ 78 │ 2                 │  │
│  │ ...    │     │    │                   │  │  ← 表格 body 滚动
│  │ 产品 30 │ ... │ 23 │ 30               │  │
│  └────────────────────────────────────────┘  │
├──────────────────────────────────────────────┤
│  共 30 条           < 1 2 >                   │  ← 分页（固定）
└──────────────────────────────────────────────┘
```

### 3.2 组件层次结构

```
ProductCategory
├── Title (level=3) - 产品分类标题
├── div.toolbar
│   ├── Input (搜索框)
│   └── Button (添加分类)
├── div.tableContainer (ref={containerRef})
│   └── Table
│       ├── columns (4 列)
│       └── dataSource (30 条数据)
├── div.pagination
│   └── Pagination
└── CategoryDrawer (抽屉组件)
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
| `antd` | Table, Button, Input, Typography, Pagination, App, Drawer, Form, InputNumber |
| `@ant-design/icons` | SearchOutlined, PlusOutlined 图标 |
| `react-i18next` | useTranslation Hook |
| `@/layouts/hooks/useTableScrollY` | 表格滚动高度计算 Hook |
| `./components/CategoryDrawer` | 添加分类抽屉组件 |
| `./index.module.less` | CSS Module 样式 |

### 4.2 状态管理

**本地状态**:

| 状态 | 类型 | 说明 |
|-----|------|------|
| `data` | `Category[]` | 分类列表数据 |
| `drawerVisible` | `boolean` | 抽屉显示状态 |

**状态更新**:
```typescript
const handleSubmit = useCallback((values) => {
  const newCategory = {
    key: String(data.length + 1),
    name: values.name,
    description: values.description || '',
    productCount: 0,
    sort: values.sort || data.length + 1,
  };
  setData((prev) => [newCategory, ...prev]);
  message.success('成功');
  setDrawerVisible(false);
}, [data.length, message]);
```

### 4.3 国际化 Keys

| Key | 中文 | 英文 |
|-----|------|------|
| `product.categoryTitle` | 产品分类 | Product Category |
| `product.categoryName` | 分类名称 | Category Name |
| `product.categoryDescription` | 分类描述 | Description |
| `product.productCount` | 产品数量 | Product Count |
| `product.sort` | 排序 | Sort |
| `product.categorySearchPlaceholder` | 搜索分类 | Search categories |
| `product.addCategory` | 添加分类 | Add Category |
| `product.categoryNameRequired` | 请输入分类名称 | Please enter category name |
| `product.categoryNamePlaceholder` | 请输入分类名称 | Enter category name |
| `product.categoryDescriptionPlaceholder` | 请输入分类描述 | Enter category description |
| `product.categoryDescriptionPrefix` | 分类描述 | Category description |
| `product.product` | 产品 | Product |

### 4.4 文件结构

```
src/pages/Product/ProductCategory/
├── index.tsx                  # 页面组件
├── index.module.less          # 页面样式
├── components/                # 模块公共组件
│   └── CategoryDrawer/
│       └── index.tsx          # 添加分类抽屉
└── locales/                   # 国际化文件
    ├── zh-cn/zh-cn.json
    └── en-us/en-us.json
```

---

## 5. 交互流程

### 5.1 添加分类流程

```
1. 用户点击 [添加分类] 按钮
2. CategoryDrawer 抽屉从右侧滑出
3. 用户填写表单
   ├─ 分类名称（必填）
   ├─ 分类描述（可选）
   └─ 排序（可选，默认最大值+1）
4. 用户点击 [保存] 按钮
5. 表单验证
   ├─ 验证失败 → 显示错误提示，停留在抽屉
   └─ 验证成功 → 继续
6. 新分类添加到 data 状态（列表顶部）
7. 显示成功提示 message.success
8. 抽屉关闭，表单重置
9. 表格自动更新显示新分类
```

### 5.2 表格滚动流程

```
1. 页面加载 → useTableScrollY 计算初始 scrollY (offset=76)
2. 用户滚动表格 → 表格 body 滚动，表头固定
3. 窗口 resize → 防抖 100ms 后重新计算 scrollY
4. 表格滚动高度自动调整
5. 分页器始终固定在底部
```

---

## 6. 性能要求

| 指标 | 要求 | 说明 |
|-----|------|------|
| 首屏渲染 | < 200ms | 30 条模拟数据 |
| 表格滚动 | 60fps | 使用 CSS 硬件加速 |
| 添加分类 | < 100ms | 状态更新和重新渲染 |
| resize 响应 | < 150ms | 防抖 100ms + 计算 50ms |

---

## 7. 测试要点

### 7.1 功能测试

| 测试项 | 预期结果 |
|-------|---------|
| 页面加载显示 30 条分类 | 表格显示 30 行数据 |
| 点击添加分类打开抽屉 | CategoryDrawer 从右侧滑出 |
| 表单验证 - 名称为空 | 显示"请输入分类名称"错误 |
| 提交成功添加分类 | 新分类出现在列表顶部 |
| 提交成功显示提示 | 显示成功消息 |
| 关闭抽屉重置表单 | 抽屉关闭后表单清空 |
| 表格滚动正常 | 表头固定，body 可滚动 |
| 窗口 resize 后表格高度调整 | 表格高度自动适应 |
| 分页器固定在底部 | 滚动时分页器不动 |

### 7.2 样式测试

| 测试项 | 预期结果 |
|-------|---------|
| 工具栏布局 | 搜索框在左，按钮在右 |
| 抽屉宽度 | 400px，从右侧滑出 |
| 表格列宽 | 各列宽度合理分配 |
| 深色模式 | 表格背景色和文字色正确切换 |

### 7.3 边界测试

| 测试项 | 预期结果 |
|-------|---------|
| 描述为空 | 提交成功，显示空字符串 |
| 排序为负数 | InputNumber 限制最小值为 1 |
| 快速连续点击添加 | 不会重复提交 |
| 抽屉中切换语言 | placeholder 文字正确更新 |

---

## 8. 扩展规划

### 8.1 短期优化

| 功能 | 说明 | 优先级 |
|-----|------|--------|
| 实现搜索过滤 | 前端过滤分类列表 | P1 |
| 实现编辑功能 | 编辑现有分类信息 | P1 |
| 实现删除功能 | 删除分类（带确认） | P1 |
| 拖拽排序 | 拖拽调整分类排序 | P2 |

### 8.2 中期规划

| 功能 | 说明 | 优先级 |
|-----|------|--------|
| 分类图标 | 为分类上传图标 | P2 |
| 子分类 | 支持多级分类 | P2 |
| 批量操作 | 批量删除分类 | P2 |

### 8.3 长期规划

| 功能 | 说明 | 优先级 |
|-----|------|--------|
| 后端对接 | 对接真实分类 API | P0 |
| 分类树 | 树形结构展示分类 | P1 |
| 产品关联 | 查看分类下的产品列表 | P1 |

---

**文档结束**
