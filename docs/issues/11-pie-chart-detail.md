# feat: 饼图详情展示（含占比计算）

## Status: ✅ COMPLETED

## What to build

在 `ChartDetailModal` 中实现饼图的详情展示，包含占比计算。

- 饼图在弹窗中渲染（高度 400px）
- 数据表格展示：三列（地区 + 数值 + 占比）
- 占比计算：`(当前值 / 总值) * 100`，保留 1 位小数
- 数值列使用千分位格式化

## Acceptance criteria

- [x] 饼图在弹窗中正确渲染（高度 400px）
- [x] 数据表格显示三列：地区 + 数值 + 占比
- [x] 占比计算正确（如 18.5%）
- [x] 数值使用千分位格式化
- [x] 表格列名正确显示

## Implementation Notes

- 测试文件：`src/components/ChartDetailModal/__tests__/pie.test.tsx` (3 tests)
- 占比计算：`((value / total) * 100).toFixed(1) + '%'`
- 总值通过 `data.reduce((sum, item) => sum + item.value, 0)` 计算
- 饼图类型显示三列表格：地区、数值、占比

## Blocked by

- #9 图表详情弹窗基础组件
