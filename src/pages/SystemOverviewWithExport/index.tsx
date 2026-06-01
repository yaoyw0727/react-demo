import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Typography, Segmented, Button, Space, Tag, Dropdown, App } from 'antd';
import { DownOutlined, CloudServerOutlined, FileTextOutlined, ReloadOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import ReactECharts from 'echarts-for-react';
import { overviewApi } from '@/services/api/overview';
import { useExport } from '@/hooks/useExport';
import ChartDetailModal from '@/components/ChartDetailModal';
import type { ExportData, ExportFormat } from '@/utils/exporters';
import styles from '@/pages/prototype/SystemOverviewPrototype/VariantA.module.less';

const { Title } = Typography;
const icons = ['👥', '👁️', '📦', '💰'];

const SystemOverviewWithExport: React.FC = () => {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<{ label: string; value: number; unit?: string }[]>([]);
  const [trendData, setTrendData] = useState<{ label: string; value: number }[]>([]);
  const [orderData, setOrderData] = useState<{ module: string; value: number }[]>([]);
  const [regionList, setRegionList] = useState<{ name: string; value: number }[]>([]);
  const [healthItems, setHealthItems] = useState<{ key: string; label: string; value: number; unit: string; threshold: { warning: number; critical: number }; inverse?: boolean }[]>([]);
  const [modalState, setModalState] = useState<{
    open: boolean;
    title: string;
    chartType: 'line' | 'bar' | 'pie';
    chartOption: any;
    data: { label: string; value: number }[];
  } | null>(null);

  const timeRangeLabels: Record<string, string> = {
    day: t('overview.day'),
    week: t('overview.week'),
    month: t('overview.month'),
  };

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [statsData, trendsData, healthData] = await Promise.all([
        overviewApi.getStats(),
        overviewApi.getTrends(timeRange),
        overviewApi.getHealth(),
      ]);

      setStats([
        { label: t('overview.onlineUsers'), value: statsData.onlineUsers },
        { label: t('overview.todayVisits'), value: statsData.todayVisits },
        { label: t('overview.totalOrders'), value: statsData.todayOrders },
        { label: t('overview.totalRevenue'), value: statsData.todayRevenue, unit: '¥' },
      ]);
      setTrendData(trendsData.visitTrend?.map((d: any) => ({ label: d.date || d.label, value: d.visits ?? d.value })) || []);
      setOrderData(trendsData.orderRatio?.map((d: any) => ({ module: d.module || d.name, value: d.value })) || []);
      setRegionList(trendsData.regionDistribution?.map((d: any) => ({ name: d.name, value: d.value })) || []);
      setHealthItems([
        { key: 'cpu', label: t('overview.cpuUsage'), value: healthData.cpuUsage, unit: '%', threshold: { warning: 70, critical: 90 } },
        { key: 'memory', label: t('overview.memoryUsage'), value: healthData.memoryUsage, unit: '%', threshold: { warning: 75, critical: 90 } },
        { key: 'disk', label: t('overview.diskFree'), value: healthData.diskFree, unit: 'GB', threshold: { warning: 50, critical: 20 }, inverse: true },
      ]);
    } catch (err) {
      message.error(t('common.error'));
    } finally {
      setLoading(false);
    }
  }, [timeRange, message, t]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const exportData = useMemo<ExportData>(() => ({
    stats: stats.map((s) => ({ label: s.label, value: s.value })),
    charts: {
      visitTrend: trendData.map((d) => ({ label: d.label, value: d.value })),
      orderRatio: orderData.map((d) => ({ label: d.module, value: d.value })),
      region: regionList.map((d) => ({ label: d.name, value: d.value })),
    },
  }), [stats, trendData, orderData, regionList]);

  const { exporting, handleExport } = useExport({ data: exportData });

  const handleChartClick = (chartType: 'line' | 'bar' | 'pie', title: string, option: any, data: { label: string; value: number }[]) => {
    setModalState({ open: true, title, chartType, chartOption: option, data });
  };

  const handleModalClose = () => setModalState(null);

  const handleExportClick = async (key: ExportFormat) => {
    if (key === 'excel') {
      try {
        const token = JSON.parse(localStorage.getItem('auth-storage') || '{}')?.state?.token;
        const res = await fetch('http://localhost:3001/api/overview/export', {
          method: 'POST',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${t('overview.exportFilename')}_${new Date().toLocaleDateString()}.xlsx`;
        a.click();
        URL.revokeObjectURL(url);
      } catch { message.error(t('common.error')); }
    } else {
      handleExport(key);
    }
  };

  const getHealthStatus = (item: typeof healthItems[0]) => {
    if (item.inverse) {
      if (item.value <= item.threshold.critical) return { color: '#f5222d', label: t('overview.statusCritical') };
      if (item.value <= item.threshold.warning) return { color: '#fa8c16', label: t('overview.statusWarning') };
      return { color: '#52c41a', label: t('overview.statusNormal') };
    }
    if (item.value >= item.threshold.critical) return { color: '#f5222d', label: t('overview.statusCritical') };
    if (item.value >= item.threshold.warning) return { color: '#fa8c16', label: t('overview.statusWarning') };
    return { color: '#52c41a', label: t('overview.statusNormal') };
  };

  const lineOption = {
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: trendData.map((d) => d.label) },
    yAxis: { type: 'value' },
    series: [{ data: trendData.map((d) => d.value), type: 'line', smooth: true, areaStyle: { opacity: 0.2 } }],
    grid: { top: 20, right: 20, bottom: 30, left: 50 },
  };

  const barOption = {
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: orderData.map((d) => d.module) },
    yAxis: { type: 'value' },
    series: [{ data: orderData.map((d) => d.value), type: 'bar', itemStyle: { color: '#1890ff' } }],
    grid: { top: 20, right: 20, bottom: 50, left: 50 },
  };

  const pieOption = {
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', right: 10, top: 'center' },
    series: [{
      type: 'pie', radius: ['40%', '70%'], center: ['35%', '50%'],
      data: regionList, label: { show: false },
    }],
  };

  const gaugeOption = (item: typeof healthItems[0]) => {
    const status = getHealthStatus(item);
    return {
      series: [{
        type: 'gauge',
        min: 0,
        max: item.inverse ? 200 : 100,
        progress: { show: true, width: 10 },
        axisLine: { lineStyle: { width: 10 } },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        pointer: { show: false },
        anchor: { show: false },
        title: { offsetCenter: [0, '60%'], fontSize: 12, color: '#888' },
        detail: {
          width: 50, height: 14, fontSize: 22, fontWeight: 'bold',
          color: status.color, offsetCenter: [0, '10%'],
          formatter: `{value}${item.unit}`,
        },
        data: [{ value: item.value, name: item.label, itemStyle: { color: status.color } }],
      }],
    };
  };

  const exportMenuItems = [
    { key: 'excel', label: t('export.excel') },
    { key: 'csv', label: t('export.csv') },
    { key: 'pdf', label: t('export.pdf') },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Title level={3} style={{ margin: 0 }}>{t('overview.pageTitle')}</Title>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={fetchAll} loading={loading}>{t('overview.refresh')}</Button>
        </Space>
      </div>

      <div className={styles.scrollable}>
        <div className={styles.statGrid}>
          {stats.map((card, idx) => (
            <div key={card.label} className={styles.statCard}>
              <div className={styles.statIcon}>{icons[idx]}</div>
              <div className={styles.statTitle}>{card.label}</div>
              <div className={styles.statValue}>
                {card.unit === '¥' ? `¥${card.value.toLocaleString()}` : card.value.toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <Title level={5} style={{ margin: 0 }}>{t('overview.trendAnalysis')}</Title>
            <Segmented
              options={[{ label: t('overview.day'), value: 'day' }, { label: t('overview.week'), value: 'week' }, { label: t('overview.month'), value: 'month' }]}
              value={timeRange}
              onChange={(v) => setTimeRange(v as typeof timeRange)}
            />
          </div>
          <div className={styles.chartGrid}>
            <div className={styles.chartCard} style={{ cursor: 'pointer' }} onClick={() => handleChartClick('line', `${t('overview.visitTrend')}（${timeRangeLabels[timeRange]}）`, lineOption, trendData.map((d) => ({ label: d.label, value: d.value })))}>
              <div className={styles.chartTitle}>{t('overview.visitTrend')}</div>
              <ReactECharts option={lineOption} style={{ height: 280 }} />
            </div>
            <div className={styles.chartCard} style={{ cursor: 'pointer' }} onClick={() => handleChartClick('bar', `${t('overview.orderRatio')}（${timeRangeLabels[timeRange]}）`, barOption, orderData.map((d) => ({ label: d.module, value: d.value })))}>
              <div className={styles.chartTitle}>{t('overview.orderRatio')}</div>
              <ReactECharts option={barOption} style={{ height: 280 }} />
            </div>
            <div className={styles.chartCard} style={{ cursor: 'pointer' }} onClick={() => handleChartClick('pie', `${t('overview.regionDistribution')}（${timeRangeLabels[timeRange]}）`, pieOption, regionList.map((d) => ({ label: d.name, value: d.value })))}>
              <div className={styles.chartTitle}>{t('overview.regionDistribution')}</div>
              <ReactECharts option={pieOption} style={{ height: 280 }} />
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <Title level={5}>{t('overview.systemHealth')}</Title>
          <div className={styles.gaugeGrid}>
            {healthItems.map((item) => {
              const status = getHealthStatus(item);
              return (
                <div key={item.key} className={styles.gaugeCard}>
                  <ReactECharts option={gaugeOption(item)} style={{ height: 180, width: '100%' }} opts={{ renderer: 'canvas' }} />
                  <Tag color={status.color}>{status.label}</Tag>
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.actions}>
          <Dropdown
            menu={{
              items: exportMenuItems,
              onClick: ({ key }) => handleExportClick(key as ExportFormat),
            }}
            trigger={['hover']}
          >
            <Button type="primary" loading={exporting}>
              {t('export.title')} <DownOutlined />
            </Button>
          </Dropdown>
          <Button icon={<CloudServerOutlined />}>{t('overview.systemBackup')}</Button>
          <Button icon={<FileTextOutlined />}>{t('overview.logView')}</Button>
        </div>
      </div>

      {modalState && (
        <ChartDetailModal
          open={modalState.open}
          title={modalState.title}
          chartType={modalState.chartType}
          chartOption={modalState.chartOption}
          data={modalState.data}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default SystemOverviewWithExport;
