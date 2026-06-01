# 页面需求文档 - 产品列表 (ProductList)

**页面路径**: `/product/list`  
**路由配置**: `{ path: '/product/list', component: ProductList, title: '产品列表', labelKey: 'menu.productList' }`  
**父级路由**: `/product` (产品管理)  
**滚动模式**: 模式二（标题下滚动）  
**优先级**: P0

---

## 1. 页面概述

### 1.1 页面定位

产品列表页面是产品管理模块的核心页面，主要职责：
- 展示产品列表
- 支持多维度筛选（搜索、分类、状态）
- 显示产品关键信息（名称、分类、价格、库存、状态）

### 1.2 目标用户

产品管理员、运营人员，负责管理和查看产品信息。

### 1.3 核心价值

| 价值维度 | 说明 |
|---------|------|
| **产品展示** | 集中展示所有产品信息 |
| **多维筛选** | 支持按名称、分类、状态筛选 |
| **状态可视化** | 以标签形式展示产品在售/缺货状态 |

---

## 2. 功能需求

### 2.1 功能列表

| 功能项 | 说明 | 优先级 | 状态 |
|-------|------|--------|------|
| 页面标题 | 显示"产品列表"标题 | P0 | 已实现 |
| 产品列表展示 | 表格展示产品信息 | P0 | 已实现 |
| 搜索功能 | 按产品名称搜索 | P1 | 已实现（静态） |
| 分类筛选 | 按产品分类筛选 | P1 | 已实现（静态） |
| 状态筛选 | 按产品状态筛选 | P1 | 已实现（静态） |
| 添加产品 | 添加新产品 | P0 | 待实现 |
| 编辑产品 | 编辑现有产品 | P1 | 待实现 |
| 删除产品 | 删除产品 | P1 | 待实现 |
| 分页功能 | 内置分页 | P1 | 已实现 |

### 2.2 详细功能说明

#### 2.2.1 页面标题

**功能描述**: 显示页面主标题"产品列表"

**交互说明**:
- 使用 `Typography.Title` 组件，级别为 `level={3}`
- 标题文字通过国际化 key `product.listTitle` 获取
- 应用 CSS Module 样式 `styles.title`

#### 2.2.2 产品列表展示

**功能描述**: 以表格形式展示产品列表

**数据模型**:
```typescript
interface Product {
  key: string;          // 唯一标识
  name: string;         // 产品名称
  category: string;     // 所属分类
  price: number;        // 价格
  stock: number;        // 库存
  status: string;       // 状态（在售/缺货）
}
```

**表格列配置**:

| 列名 | 数据字段 | 国际化 Key | 渲染方式 | 说明 |
|-----|---------|-----------|---------|------|
| 产品名称 | `name` | `product.name` | 纯文本 | 显示产品名称 |
| 分类 | `category` | `product.category` | 纯文本 | 显示产品分类 |
| 价格 | `price` | `product.price` | `¥{price.toFixed(2)}` | 格式化为货币格式 |
| 库存 | `stock` | `product.stock` | 纯文本 | 显示库存数量 |
| 状态 | `status` | `product.status` | Tag 组件 | 在售=绿色，缺货=红色 |
| 操作 | `action` | `product.action` | 按钮组 | 编辑和删除按钮 |

**状态列渲染逻辑**:
```typescript
render: (status: string) => {
  const onSaleText = t('product.statusOnSale');
  return <Tag color={status === onSaleText ? 'green' : 'red'}>{status}</Tag>;
}
```

**初始数据**:
- 使用模拟数据，生成 50 条产品记录
- 产品名称: `产品 {序号}`
- 分类: 循环使用 4 种分类（手机、电脑、平板、配件）
- 价格: `(序号 + 1) * 100`
- 库存: 随机数 0-200
- 状态: 每 5 条为"缺货"，其余为"在售"

#### 2.2.3 搜索功能

**功能描述**: 支持按产品名称搜索

**交互说明**:
- 使用 `Input` 组件，带搜索图标前缀
- 占位符文字: `product.searchPlaceholder`
- 搜索框宽度: 240px
- 当前版本为**前端静态搜索**，未实现实际过滤逻辑

#### 2.2.4 分类筛选

**功能描述**: 按产品分类筛选产品

**交互说明**:
- 使用 `Select` 下拉选择器
- 占位符文字: `product.selectCategory`
- 选择器宽度: 120px

**选项列表**:

| 值 | 标签 (Key) | 中文 | 英文 |
|---|-----------|------|------|
| `all` | `product.allCategories` | 全部分类 | All Categories |
| `phone` | `product.categoryPhone` | 手机 | Phone |
| `computer` | `product.categoryComputer` | 电脑 | Computer |
| `tablet` | `product.categoryTablet` | 平板 | Tablet |

#### 2.2.5 状态筛选

**功能描述**: 按产品状态筛选

**交互说明**:
- 使用 `Select` 下拉选择器
- 占位符文字: `product.selectStatus`
- 选择器宽度: 120px

**选项列表**:

| 值 | 标签 (Key) | 中文 | 英文 |
|---|-----------|------|------|
| `all` | `product.allStatus` | 全部状态 | All Status |
| `onsale` | `product.statusOnSale` | 在售 | On Sale |
| `soldout` | `product.statusOutOfStock` | 缺货 | Out of Stock |

#### 2.2.6 添加产品

**功能描述**: 通过按钮添加新产品

**交互说明**:
- 点击"添加产品"按钮（当前未实现弹窗）
- 按钮样式: `type="primary"` 带 `PlusOutlined` 图标
- 按钮文字: `product.addProduct`

#### 2.2.7 分页功能

**功能描述**: 使用 antd Table 内置分页

**配置**:
```typescript
pagination={{ total: 50, pageSize: 10 }}
```

**分页行为**:
- 总记录数: 50
- 每页条数: 10
- 显示页码切换
- 显示快速跳转

---

## 3. UI/UX 设计

### 3.1 页面布局

```
┌──────────────────────────────────────────────────────────┐
│  产品列表 (标题固定)                                      │
├──────────────────────────────────────────────────────────┤
│  [🔍 搜索...] [分类 ▼] [状态 ▼]         [+ 添加产品]      │  ← 工具栏
├──────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────────┐  │
│  │ 产品名称 │ 分类 │ 价格 │ 库存 │ 状态 │ 操作        │  │
│  ├────────────────────────────────────────────────────┤  │
│  │ 产品 1 │ 手机 │ ¥100.00 │ 45 │ [在售] │ 编辑 删除  │  │
│  │ 产品 2 │ 电脑 │ ¥200.00 │ 120 │ [在售] │ 编辑 删除 │  │
│  │ ...                                              │  │
│  │ 产品 10 │ 配件 │ ¥1000.00 │ 0 │ [缺货] │ 编辑 删除 │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  共 50 条  < 1 2 3 4 5 >          每页 10 条 ▼           │  ← 内置分页
└──────────────────────────────────────────────────────────┘
```

### 3.2 组件层次结构

```
ProductList
├── Title (level=3) - 产品列表标题
├── div.toolbar
│   ├── Input (搜索框)
│   ├── Select (分类筛选)
│   ├── Select (状态筛选)
│   └── Button (添加产品)
└── div.tableWrapper
    └── Table
        ├── columns (6 列)
        │   ├── price 列 → 货币格式化
        │   └── status 列 → Tag 颜色渲染
        ├── dataSource (50 条数据)
        └── pagination (total=50, pageSize=10)
```

### 3.3 样式规范

**CSS Module 类名**:

| 类名 | 用途 | 说明 |
|-----|------|------|
| `container` | 页面容器 | 控制页面整体布局 |
| `title` | 标题样式 | 标题间距 |
| `toolbar` | 工具栏 | 筛选控件和按钮的布局 |
| `tableWrapper` | 表格容器 | 表格包装器 |

---

## 4. 技术实现

### 4.1 使用的依赖

| 依赖 | 用途 |
|-----|------|
| `react` | React 组件 |
| `antd` | Table, Tag, Input, Button, Select, Space, Typography |
| `@ant-design/icons` | SearchOutlined, PlusOutlined 图标 |
| `react-i18next` | useTranslation Hook |
| `./index.module.less` | CSS Module 样式 |

### 4.2 状态管理

本页面**不使用**全局状态或本地状态，为纯函数组件。数据在组件内直接生成。

### 4.3 国际化 Keys

| Key | 中文 | 英文 |
|-----|------|------|
| `product.listTitle` | 产品列表 | Product List |
| `product.name` | 产品名称 | Product Name |
| `product.category` | 分类 | Category |
| `product.price` | 价格 | Price |
| `product.stock` | 库存 | Stock |
| `product.status` | 状态 | Status |
| `product.action` | 操作 | Action |
| `product.searchPlaceholder` | 搜索产品 | Search products |
| `product.selectCategory` | 选择分类 | Select Category |
| `product.allCategories` | 全部分类 | All Categories |
| `product.categoryPhone` | 手机 | Phone |
| `product.categoryComputer` | 电脑 | Computer |
| `product.categoryTablet` | 平板 | Tablet |
| `product.categoryAccessory` | 配件 | Accessory |
| `product.selectStatus` | 选择状态 | Select Status |
| `product.allStatus` | 全部状态 | All Status |
| `product.statusOnSale` | 在售 | On Sale |
| `product.statusOutOfStock` | 缺货 | Out of Stock |
| `product.addProduct` | 添加产品 | Add Product |
| `product.product` | 产品 | Product |

### 4.4 文件结构

```
src/pages/Product/ProductList/
├── index.tsx                  # 页面组件
├── index.module.less          # 页面样式
└── locales/                   # 国际化文件
    ├── zh-cn/zh-cn.json
    └── en-us/en-us.json
```

---

## 5. 交互流程

### 5.1 数据生成流程

```
1. 组件渲染
2. Array.from({ length: 50 }, (_, i) => {...}) 生成 50 条数据
3. 每条数据:
   - name = "产品 {i+1}"
   - category = 4 种分类循环
   - price = (i+1) * 100
   - stock = 随机数 0-200
   - status = i%5===0 ? "缺货" : "在售"
4. 数据传递给 Table dataSource
```

### 5.2 状态标签渲染流程

```
1. Table 渲染 status 列
2. render 函数接收 status 值
3. 获取 "在售" 的国际化文字
4. 比较 status === onSaleText
   ├─ 相等 → Tag color="green"
   └─ 不等 → Tag color="red"
5. 标签显示对应颜色
```

---

## 6. 性能要求

| 指标 | 要求 | 说明 |
|-----|------|------|
| 首屏渲染 | < 300ms | 50 条模拟数据 |
| 分页切换 | < 100ms | 客户端分页 |
| 筛选响应 | < 150ms | 前端过滤（待实现） |

---

## 7. 测试要点

### 7.1 功能测试

| 测试项 | 预期结果 |
|-------|---------|
| 页面加载显示 50 条产品 | Table 显示 50 条记录 |
| 第一页显示 10 条 | 默认每页 10 条 |
| 价格格式化正确 | 显示 ¥100.00 格式 |
| 每 5 条产品状态为缺货 | 第 5、10、15...条显示红色标签 |
| 其他产品状态为在售 | 显示绿色标签 |
| 分页切换正常 | 点击页码切换数据 |
| 分类下拉选项正确 | 显示 4 个选项 |
| 状态下拉选项正确 | 显示 3 个选项 |

### 7.2 样式测试

| 测试项 | 预期结果 |
|-------|---------|
| 工具栏布局 | 搜索框、筛选器、按钮水平排列 |
| 状态标签颜色 | 在售=绿色，缺货=红色 |
| 价格列右对齐 | 货币格式右对齐显示 |
| 深色模式 | 表格背景色和文字色正确切换 |

### 7.3 边界测试

| 测试项 | 预期结果 |
|-------|---------|
| 库存为 0 | 显示 0，状态为缺货 |
| 价格含小数 | 显示两位小数 |
| 快速切换页码 | 分页响应正常 |

---

## 8. 代码改进建议

### 8.1 当前问题

| 问题 | 说明 | 建议 |
|-----|------|------|
| 无状态管理 | 数据硬编码在组件内 | 使用 useState 管理数据 |
| 筛选未实现 | 搜索框和选择器无功能 | 实现前端过滤逻辑 |
| 无添加产品弹窗 | 按钮点击无响应 | 创建 ProductModal 组件 |
| 编辑/删除未实现 | 操作列按钮无功能 | 实现编辑和删除逻辑 |

### 8.2 重构建议

```typescript
// 建议改为状态管理
const [data, setData] = useState(generateInitialData);
const [searchText, setSearchText] = useState('');
const [categoryFilter, setCategoryFilter] = useState('all');
const [statusFilter, setStatusFilter] = useState('all');

// 过滤后的数据
const filteredData = useMemo(() => {
  return data.filter(item => 
    item.name.includes(searchText) &&
    (categoryFilter === 'all' || item.category === categoryFilter) &&
    (statusFilter === 'all' || item.status === statusFilter)
  );
}, [data, searchText, categoryFilter, statusFilter]);
```

---

## 9. 扩展规划

### 9.1 短期优化

| 功能 | 说明 | 优先级 |
|-----|------|--------|
| 实现搜索过滤 | 前端过滤产品列表 | P1 |
| 实现分类筛选 | 按分类过滤 | P1 |
| 实现状态筛选 | 按状态过滤 | P1 |
| 添加产品弹窗 | 创建 ProductModal 组件 | P1 |

### 9.2 中期规划

| 功能 | 说明 | 优先级 |
|-----|------|--------|
| 产品图片 | 显示产品缩略图 | P2 |
| 批量操作 | 批量上架/下架/删除 | P2 |
| 排序功能 | 按价格/库存/名称排序 | P2 |
| 导出功能 | 导出产品列表为 Excel | P2 |

### 9.3 长期规划

| 功能 | 说明 | 优先级 |
|-----|------|--------|
| 后端对接 | 对接真实产品 API | P0 |
| 库存预警 | 低库存高亮提醒 | P1 |
| 价格趋势 | 显示价格变化趋势 | P2 |

---

**文档结束**
