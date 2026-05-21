/**
 * PROTOTYPE — Variant A: 经典仪表盘布局
 * 卡片顶部 4 列，图表 2x2 网格，仪表盘底部横排，快速操作在底部
 */
import React, { useState } from 'react';
import { Typography, Segmented, Button, Space, Tag } from 'antd';
import { DownloadOutlined, CloudServerOutlined, FileTextOutlined, ReloadOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import { statCardsData, visitTrendData, orderRatioData, regionData, healthData } from './mockData';
import styles from './VariantA.module.less';

const { Title } = Typography;

export const VariantA: React.FC = () => {
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

  const gaugeOption = (item: typeof healthData[0]) => {
    const status = getHealthStatus(item);
    return {
      series: [
        {
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
            width: 50,
            height: 14,
            fontSize: 22,
            fontWeight: 'bold',
            color: status.color,
            offsetCenter: [0, '10%'],
            formatter: `{value}${item.unit}`,
          },
          data: [{ value: item.value, name: item.label, itemStyle: { color: status.color } }],
        },
      ],
    };
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Title level={3} style={{ margin: 0 }}>系统概览</Title>
        <Space>
          <Button icon={<ReloadOutlined />}>刷新</Button>
        </Space>
      </div>

      {/* 可滚动区域 */}
      <div className={styles.scrollable}>
        {/* 统计卡片 */}
        <div className={styles.statGrid}>
          {statCardsData.map((card) => (
            <div key={card.key} className={styles.statCard}>
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
            </div>
          ))}
        </div>

        {/* 趋势图表 */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <Title level={5} style={{ margin: 0 }}>趋势分析</Title>
            <Segmented
              options={[{ label: '日', value: 'day' }, { label: '周', value: 'week' }, { label: '月', value: 'month' }]}
              value={timeRange}
              onChange={(v) => setTimeRange(v as typeof timeRange)}
            />
          </div>
          <div className={styles.chartGrid}>
            <div className={styles.chartCard}>
              <div className={styles.chartTitle}>访问趋势</div>
              <ReactECharts option={lineOption} style={{ height: 280 }} />
            </div>
            <div className={styles.chartCard}>
              <div className={styles.chartTitle}>订单占比</div>
              <ReactECharts option={barOption} style={{ height: 280 }} />
            </div>
            <div className={styles.chartCard}>
              <div className={styles.chartTitle}>地域分布</div>
              <ReactECharts option={pieOption} style={{ height: 280 }} />
            </div>
          </div>
        </div>

        {/* 健康监控 */}
        <div className={styles.section}>
          <Title level={5}>系统健康</Title>
        <div className={styles.gaugeGrid}>
          {healthData.map((item) => {
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

        {/* 快速操作 */}
        <div className={styles.actions}>
          <Button type="primary" icon={<DownloadOutlined />}>数据导出</Button>
          <Button icon={<CloudServerOutlined />}>系统备份</Button>
          <Button icon={<FileTextOutlined />}>日志查看</Button>
        </div>
      </div>
    </div>
  );
};
