# feat: 折线图/柱状图详情展示

## Status: ✅ COMPLETED

## What to build

在 `ChartDetailModal` 中实现折线图和柱状图的详情展示。

- 接收 `chartOption` 渲染放大图表（高度 400px）
- 数据表格展示：两列（时间/模块 + 数值）
- 数值列使用千分位格式化
- 根据 `chartType` 动态切换表格列名（时间/模块）

## Acceptance criteria

- [x] 折线图在弹窗中正确渲染（高度 400px）
- [x] 柱状图在弹窗中正确渲染（高度 400px）
- [x] 数据表格显示两列：时间/模块 + 数值
- [x] 数值使用千分位格式化（如 1,200）
- [x] 表格列名根据图表类型正确切换

## Implementation Notes

- 测试文件：`src/components/ChartDetailModal/__tests__/line-bar.test.tsx` (4 tests)
- 动态列配置：`chartType === 'line' ? '时间' : '模块'`
- 数值格式化使用 `value.toLocaleString()`
- 表格标题显示"详细数据"

## Blocked by

- #9 图表详情弹窗基础组件
