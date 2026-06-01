# feat: 图表详情弹窗基础组件

## Status: ✅ COMPLETED

## What to build

创建 `ChartDetailModal` 基础组件，提供弹窗骨架和通用布局。

- 弹窗组件（宽度 800px，支持遮罩关闭、Esc 关闭）
- 弹窗标题区域（显示图表名称 + 时间范围标签）
- 图表容器区域（高度 400px）
- 数据表格区域（基础表格骨架）
- `destroyOnHidden` 确保状态清理

## Acceptance criteria

- [x] 弹窗宽度 800px，居中显示
- [x] 点击遮罩层可关闭弹窗
- [x] 按 Esc 键可关闭弹窗
- [x] 右上角显示关闭按钮
- [x] 弹窗标题正确显示传入的 title
- [x] `destroyOnHidden` 生效，关闭后销毁内部状态

## Implementation Notes

- 组件位置：`src/components/ChartDetailModal/index.tsx`
- 测试文件：`src/components/ChartDetailModal/__tests__/index.test.tsx` (5 tests)
- 使用 antd Modal 组件，配置 `width={800}`, `maskClosable`, `destroyOnHidden`
- 图表容器使用固定高度 400px 的 div 包裹 ReactECharts
- 数据表格使用 antd Table 组件

## Blocked by

None - can start immediately
