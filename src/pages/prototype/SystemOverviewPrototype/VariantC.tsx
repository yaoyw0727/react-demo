/**
 * PROTOTYPE — Variant C: Tab 整合布局
 * 所有模块整合为一个大卡片，内部用 Tab 切换（概览/趋势/健康）
 */
import React, { useState } from 'react';
import { Typography, Tabs, Segmented, Button, Tag, Card } from 'antd';
import { DownloadOutlined, CloudServerOutlined, FileTextOutlined, ReloadOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import { statCardsData, visitTrendData, orderRatioData, regionData, healthData } from './mockData';
import styles from './VariantC.module.less';

const { Title } = Typography;

export const VariantC: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');
  const trendData = visitTrendData[timeRange];
  const orderData = orderRatioData[timeRange];
  const regionList = regionData[timeRange];

  const getHealthStatus = (item: typeof healthData[0]) => {
    if (item.inverse) {
      if (item.value <= item.threshold.critical) return { color: '#f5222d', label: '严重' };
      if (item.value <= item.threshold.warning) return { color: '#fa8c16', label: '警告' };
      return { color: '#52c41a', label: '正常' };
    }
    if (item.value >= item.threshold.critical) return { color: '#f5222d', label: '严重' };
    if (item.value >= item.threshold.warning) return { color: '#fa8c16', label: '警告' };
    return { color: '#52c41a', label: '正常' };
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
    series: [{ data: orderData.map((d) => d.value), type: 'bar', itemStyle: { color: '#13c2c2' } }],
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

  const gaugeOption = (item: typeof healthData[0]) => {
    const status = getHealthStatus(item);
    return {
      series: [
        {
          type: 'gauge',
          radius: '70%',
          min: 0,
          max: item.inverse ? 200 : 100,
          progress: { show: true, width: 10 },
          axisLine: { lineStyle: { width: 10 } },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: { show: false },
          pointer: { show: false },
          anchor: { show: false },
          title: { show: false },
          detail: {
            width: 50,
            height: 20,
            fontSize: 24,
            fontWeight: 'bold',
            color: status.color,
            offsetCenter: [0, '0%'],
            formatter: `{value}${item.unit}`,
          },
          data: [{ value: item.value, name: '', itemStyle: { color: status.color } }],
        },
      ],
    };
  };

  const tabItems = [
    {
      key: 'overview',
      label: '概览',
      children: (
        <div className={styles.tabContent}>
          <div className={styles.statGrid}>
            {statCardsData.map((card) => (
              <Card key={card.key} className={styles.statCard} hoverable>
                <div className={styles.statIcon}>{card.icon}</div>
                <div className={styles.statTitle}>{card.title}</div>
                <div className={styles.statValue}>
                  {card.unit === '¥' ? `¥${card.value.toLocaleString()}` : card.value.toLocaleString()}
                </div>
                {card.trend && (
                  <Tag color={card.trend.direction === 'up' ? 'green' : 'red'}>
                    {card.trend.direction === 'up' ? '↑' : '↓'} {card.trend.value}%
                  </Tag>
                )}
              </Card>
            ))}
          </div>
          <div className={styles.quickActions}>
            <Button type="primary" icon={<DownloadOutlined />}>数据导出</Button>
            <Button icon={<CloudServerOutlined />}>系统备份</Button>
            <Button icon={<FileTextOutlined />}>日志查看</Button>
          </div>
        </div>
      ),
    },
    {
      key: 'trends',
      label: '趋势',
      children: (
        <div className={styles.tabContent}>
          <div className={styles.trendHeader}>
            <Segmented
              options={[{ label: '日', value: 'day' }, { label: '周', value: 'week' }, { label: '月', value: 'month' }]}
              value={timeRange}
              onChange={(v) => setTimeRange(v as typeof timeRange)}
            />
          </div>
          <div className={styles.chartGrid}>
            <Card title="访问趋势" className={styles.chartCard}>
              <ReactECharts option={lineOption} style={{ height: 280 }} />
            </Card>
            <Card title="订单占比" className={styles.chartCard}>
              <ReactECharts option={barOption} style={{ height: 280 }} />
            </Card>
            <Card title="地域分布" className={styles.chartCard}>
              <ReactECharts option={pieOption} style={{ height: 280 }} />
            </Card>
          </div>
        </div>
      ),
    },
    {
      key: 'health',
      label: '健康',
      children: (
        <div className={styles.tabContent}>
        <div className={styles.gaugeGrid}>
          {healthData.map((item) => {
            const status = getHealthStatus(item);
            return (
              <Card key={item.key} className={styles.gaugeCard} bodyStyle={{ padding: 0 }}>
                <div style={{ fontSize: 18, fontWeight: 500, color: '#333', marginBottom: 12, padding: '24px 24px 0' }}>{item.label}</div>
                <ReactECharts option={gaugeOption(item)} style={{ height: 280, width: '100%' }} opts={{ renderer: 'canvas' }} />
                <div style={{ padding: '0 24px 24px', display: 'flex', justifyContent: 'center' }}>
                  <Tag color={status.color} style={{ marginTop: 12, fontSize: 14, padding: '4px 12px' }}>{status.label}</Tag>
                </div>
              </Card>
            );
          })}
        </div>
        </div>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Title level={3} style={{ margin: 0 }}>系统概览</Title>
        <Button icon={<ReloadOutlined />}>刷新</Button>
      </div>
      <div className={styles.scrollable}>
        <Card className={styles.mainCard}>
          <Tabs defaultActiveKey="overview" items={tabItems} size="large" />
        </Card>
      </div>
    </div>
  );
};
