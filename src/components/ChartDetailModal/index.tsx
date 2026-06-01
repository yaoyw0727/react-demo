import React from 'react';
import { Modal, Table, Typography } from 'antd';
import ReactECharts from 'echarts-for-react';
import styles from './index.module.less';

const { Title } = Typography;

export interface ChartDetailModalProps {
  open: boolean;
  title: string;
  chartType: 'line' | 'bar' | 'pie';
  chartOption: any;
  data: { label: string; value: number }[];
  onClose: () => void;
}

const getColumnConfig = (chartType: 'line' | 'bar' | 'pie') => {
  if (chartType === 'pie') {
    return {
      labelKey: '地区',
      valueKey: '数值',
      extraKey: '占比',
    };
  }
  return {
    labelKey: chartType === 'line' ? '时间' : '模块',
    valueKey: '数值',
  };
};

const ChartDetailModal: React.FC<ChartDetailModalProps> = ({
  open,
  title,
  chartType,
  chartOption,
  data,
  onClose,
}) => {
  const columns = getColumnConfig(chartType);
  const total = data.reduce((sum, item) => sum + item.value, 0);

  const tableColumns: any[] = [
    { title: columns.labelKey, dataIndex: 'label', key: 'label' },
    {
      title: columns.valueKey,
      dataIndex: 'value',
      key: 'value',
      render: (val: number) => val.toLocaleString(),
    },
  ];

  if (chartType === 'pie') {
    tableColumns.push({
      title: '占比',
      key: 'percentage',
      render: (_: any, record: { value: number }) => `${((record.value / total) * 100).toFixed(1)}%`,
    });
  }

  return (
    <Modal
      title={title}
      open={open}
      onCancel={onClose}
      width={800}
      footer={null}
      mask={{closable: true}}
      destroyOnHidden
    >
      <div className={styles.chartContainer}>
        <ReactECharts option={chartOption} style={{ height: 400, width: '100%' }} />
      </div>
      <Title level={5} className={styles.tableTitle}>详细数据</Title>
      <Table
        columns={tableColumns}
        dataSource={data.map((item, index) => ({ ...item, key: index }))}
        pagination={false}
        size="small"
      />
    </Modal>
  );
};

export default ChartDetailModal;
