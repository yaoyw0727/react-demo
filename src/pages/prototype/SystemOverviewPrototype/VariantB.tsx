/**
 * PROTOTYPE — Variant B: 左右分栏布局
 * 左侧大图表区（占 2/3），右侧卡片+仪表盘垂直堆叠（占 1/3）
 */
import React, { useState } from 'react';
import { Typography, Segmented, Button, Space, Tag, Divider } from 'antd';
import { DownloadOutlined, CloudServerOutlined, FileTextOutlined, ReloadOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import { statCardsData, visitTrendData, orderRatioData, regionData, healthData } from './mockData';
import styles from './VariantB.module.less';

const { Title } = Typography;

export const VariantB: React.FC = () => {
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
    series: [{ data: trendData.map((d) => d.value), type: 'line', smooth: true, areaStyle: { opacity: 0.3 } }],
    grid: { top: 20, right: 20, bottom: 30, left: 50 },
  };

  const barOption = {
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: orderData.map((d) => d.module), axisLabel: { rotate: 30 } },
    yAxis: { type: 'value' },
    series: [{ data: orderData.map((d) => d.value), type: 'bar', itemStyle: { color: '#722ed1' } }],
    grid: { top: 20, right: 20, bottom: 60, left: 50 },
  };

  const pieOption = {
    tooltip: { trigger: 'item' },
    legend: { bottom: 0 },
    series: [{
      type: 'pie', radius: '60%', center: ['50%', '45%'],
      data: regionList,
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
          title: { offsetCenter: [0, '60%'], fontSize: 11, color: '#888' },
          detail: {
            width: 40,
            height: 12,
            fontSize: 18,
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

      <div className={styles.scrollable}>
        <div className={styles.mainLayout}>
          {/* 左侧图表区 */}
          <div className={styles.leftPanel}>
            <div className={styles.chartSection}>
              <div className={styles.chartHeader}>
                <Title level={5} style={{ margin: 0 }}>访问趋势</Title>
                <Segmented
                  options={[{ label: '日', value: 'day' }, { label: '周', value: 'week' }, { label: '月', value: 'month' }]}
                  value={timeRange}
                  onChange={(v) => setTimeRange(v as typeof timeRange)}
                />
              </div>
              <ReactECharts option={lineOption} style={{ height: 320 }} />
            </div>
            <div className={styles.chartRow}>
              <div className={styles.chartHalf}>
                <Title level={5}>订单占比</Title>
                <ReactECharts option={barOption} style={{ height: 260 }} />
              </div>
              <div className={styles.chartHalf}>
                <Title level={5}>地域分布</Title>
                <ReactECharts option={pieOption} style={{ height: 260 }} />
              </div>
            </div>
          </div>

          {/* 右侧信息区 */}
          <div className={styles.rightPanel}>
            {/* 统计卡片垂直堆叠 */}
            <div className={styles.statStack}>
              {statCardsData.map((card) => (
                <div key={card.key} className={styles.statRow}>
                  <div className={styles.statLeft}>
                    <span className={styles.statIcon}>{card.icon}</span>
                    <span className={styles.statTitle}>{card.title}</span>
                  </div>
                  <div className={styles.statRight}>
                    <div className={styles.statValue}>
                      {card.unit === '¥' ? `¥${card.value.toLocaleString()}` : card.value.toLocaleString()}
                    </div>
                    {card.trend && (
                      <Tag color={card.trend.direction === 'up' ? 'green' : 'red'} style={{ fontSize: 11 }}>
                        {card.trend.direction === 'up' ? '↑' : '↓'}{card.trend.value}%
                      </Tag>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <Divider style={{ margin: '16px 0' }} />

            {/* 健康监控 */}
            <Title level={5}>系统健康</Title>
            <div className={styles.gaugeStack}>
              {healthData.map((item) => {
                const status = getHealthStatus(item);
                return (
                  <div key={item.key} className={styles.gaugeRow}>
                    <ReactECharts option={gaugeOption(item)} style={{ height: 120, width: 120 }} opts={{ renderer: 'canvas' }} />
                    <div className={styles.gaugeInfo}>
                      <div style={{ fontSize: 13, color: '#666' }}>{item.label}</div>
                      <Tag color={status.color} style={{ marginTop: 4 }}>{status.label}</Tag>
                    </div>
                  </div>
                );
              })}
            </div>

            <Divider style={{ margin: '16px 0' }} />

            {/* 快速操作 */}
            <div className={styles.actionStack}>
              <Button type="primary" icon={<DownloadOutlined />} block>数据导出</Button>
              <Button icon={<CloudServerOutlined />} block>系统备份</Button>
              <Button icon={<FileTextOutlined />} block>日志查看</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
