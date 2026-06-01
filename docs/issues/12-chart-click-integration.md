# feat: 图表点击事件集成到系统概览页面

## Status: ✅ COMPLETED

## What to build

将 `ChartDetailModal` 集成到系统概览页面，实现图表点击交互。

- 三个图表区域添加 hover 效果（边框高亮或背景微变）
- 点击图表触发弹窗，传入对应图表配置和数据
- 弹窗标题动态生成：`{图表名称}（{时间范围}）`
- 时间范围切换后点击图表，弹窗显示对应数据
- 国际化支持（图表名称、表格列名等）

## Acceptance criteria

- [x] 鼠标悬停图表区域显示 hover 效果（cursor: pointer）
- [x] 点击访问趋势图表弹出折线图详情
- [x] 点击订单占比图表弹出柱状图详情
- [x] 点击地域分布图表弹出饼图详情
- [x] 弹窗标题显示正确（如"访问趋势（周）"）
- [x] 切换时间范围后点击，弹窗数据对应更新
- [x] 国际化文字正确显示

## Implementation Notes

- 集成页面：`src/pages/SystemOverviewWithExport/index.tsx`
- 状态管理：使用 `useState` 管理 `modalState`
- 点击处理：`handleChartClick` 函数设置弹窗状态
- 标题生成：使用 `timeRangeLabels` 映射表生成时间范围标签
- 图表卡片添加 `style={{ cursor: 'pointer' }}` 和 `onClick` 事件

## Blocked by

- #10 折线图/柱状图详情展示
- #11 饼图详情展示（含占比计算）
