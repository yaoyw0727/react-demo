# feat: 响应式优化和主题适配

## What to build

完成系统概览页面的响应式优化和深色模式主题适配。

- 各断点响应式布局优化（XL/LG/MD/SM/XS）
- 深色模式图表配色适配
- 骨架屏加载状态（页面首次加载）
- 性能优化（图表懒加载使用 IntersectionObserver）
- 窗口 resize 防抖重新计算图表尺寸

## Acceptance criteria

- [ ] 各屏幕尺寸下布局正确无错乱
- [ ] 深色模式下所有组件和图表配色正确
- [ ] 页面首次加载显示骨架屏
- [ ] 图表进入视口后才渲染（懒加载）
- [ ] 窗口 resize 时图表自适应
- [ ] Lighthouse Performance 评分 ≥ 80

## Blocked by

- #5 系统健康监控仪表盘
- #6 快速操作和数据导出
