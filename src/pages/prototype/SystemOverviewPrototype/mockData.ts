/**
 * PROTOTYPE — 模拟数据和共享图表配置
 */

export interface StatCardData {
  key: string;
  title: string;
  titleKey: string;
  value: number;
  unit?: string;
  trend?: { value: number; direction: 'up' | 'down' };
  icon: string;
}

export const statCardsData: StatCardData[] = [
  { key: 'online', title: '在线用户', titleKey: 'overview.onlineUsers', value: 1234, trend: { value: 12, direction: 'up' }, icon: '👥' },
  { key: 'visits', title: '今日访问', titleKey: 'overview.todayVisits', value: 5678, trend: { value: 8, direction: 'up' }, icon: '👁️' },
  { key: 'orders', title: '订单总数', titleKey: 'overview.totalOrders', value: 890, trend: { value: 15, direction: 'up' }, icon: '📦' },
  { key: 'revenue', title: '营收总额', titleKey: 'overview.totalRevenue', value: 123456, unit: '¥', trend: { value: 5, direction: 'up' }, icon: '💰' },
];

export const visitTrendData = {
  day: [
    { label: '00:00', value: 120 }, { label: '04:00', value: 80 }, { label: '08:00', value: 450 },
    { label: '12:00', value: 980 }, { label: '16:00', value: 1200 }, { label: '20:00', value: 750 },
  ],
  week: [
    { label: '05-15', value: 1200 }, { label: '05-16', value: 1350 }, { label: '05-17', value: 1100 },
    { label: '05-18', value: 1500 }, { label: '05-19', value: 1420 }, { label: '05-20', value: 1680 },
    { label: '05-21', value: 1550 },
  ],
  month: Array.from({ length: 30 }, (_, i) => ({
    label: `04-${String(i + 1).padStart(2, '0')}`,
    value: Math.floor(800 + Math.random() * 1000),
  })),
};

export const orderRatioData = {
  day: [
    { module: '电子产品', value: 45 }, { module: '服装鞋帽', value: 32 },
    { module: '食品饮料', value: 28 }, { module: '家居用品', value: 15 }, { module: '其他', value: 8 },
  ],
  week: [
    { module: '电子产品', value: 320 }, { module: '服装鞋帽', value: 210 },
    { module: '食品饮料', value: 180 }, { module: '家居用品', value: 120 }, { module: '其他', value: 60 },
  ],
  month: [
    { module: '电子产品', value: 1280 }, { module: '服装鞋帽', value: 890 },
    { module: '食品饮料', value: 720 }, { module: '家居用品', value: 480 }, { module: '其他', value: 230 },
  ],
};

export const regionData = {
  day: [
    { name: '广东', value: 180 }, { name: '北京', value: 150 }, { name: '上海', value: 120 },
    { name: '江苏', value: 110 }, { name: '浙江', value: 95 }, { name: '其他', value: 320 },
  ],
  week: [
    { name: '广东', value: 2340 }, { name: '北京', value: 1890 }, { name: '上海', value: 1560 },
    { name: '江苏', value: 1420 }, { name: '浙江', value: 1280 }, { name: '其他', value: 4150 },
  ],
  month: [
    { name: '广东', value: 9800 }, { name: '北京', value: 7600 }, { name: '上海', value: 6200 },
    { name: '江苏', value: 5800 }, { name: '浙江', value: 5100 }, { name: '其他', value: 16500 },
  ],
};

export const healthData = [
  { key: 'cpu', label: 'CPU 使用率', value: 75, unit: '%', threshold: { warning: 70, critical: 90 } },
  { key: 'memory', label: '内存占用率', value: 68, unit: '%', threshold: { warning: 75, critical: 90 } },
  { key: 'disk', label: '磁盘剩余', value: 120, unit: 'GB', threshold: { warning: 50, critical: 20 }, inverse: true },
];
