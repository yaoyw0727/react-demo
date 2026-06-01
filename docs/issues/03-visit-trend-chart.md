# feat: 趋势分析图表 - 访问趋势折线图

## What to build

实现系统概览页面的趋势分析图表区，包含时间范围切换器和访问趋势折线图。

- 安装并配置 ECharts（`echarts-for-react`）
- 时间范围切换器（日/周/月 Segmented 组件）
- 访问趋势折线图组件（X轴时间，Y轴访问次数）
- 鼠标悬停显示 Tooltip（时间 + 访问次数）
- 模拟数据和加载状态

## Acceptance criteria

- [ ] ECharts 正确安装和配置
- [ ] 时间范围切换器可切换（日/周/月）
- [ ] 折线图正确渲染，数据点显示
- [ ] 鼠标悬停显示 Tooltip
- [ ] 切换时间范围时显示 Loading
- [ ] 深色模式下图表配色适配

## Blocked by

- #1 系统概览页面骨架和路由
