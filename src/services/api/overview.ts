import { get, post } from '@/services/request';

export interface OverviewStats {
  onlineUsers: number;
  todayVisits: number;
  todayOrders: number;
  todayRevenue: number;
}

export interface TrendData {
  visitTrend: { label: string; value: number }[];
  orderRatio: { module: string; value: number }[];
  regionDistribution: { name: string; value: number }[];
}

export interface HealthStatus {
  cpuUsage: number;
  memoryUsage: number;
  diskFree: number;
}

export const overviewApi = {
  getStats: () => get<OverviewStats>('/overview/stats'),

  getTrends: (range: string = 'week') => get<TrendData>('/overview/trends', { range }),

  getHealth: () => get<HealthStatus>('/overview/health'),

  getChartDetail: (type: string, range: string = 'week') =>
    get<Record<string, unknown>[]>('/overview/chart-detail', { type, range }),

  exportData: () => post<Blob>('/overview/export'),
};
