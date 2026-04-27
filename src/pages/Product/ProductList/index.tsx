import React from 'react';
import { Table, Tag, Input, Button, Select, Space, Typography } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import styles from './index.module.less';

const { Title } = Typography;

const columns = [
  {
    title: '产品名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '分类',
    dataIndex: 'category',
    key: 'category',
  },
  {
    title: '价格',
    dataIndex: 'price',
    key: 'price',
    render: (price: number) => `¥${price.toFixed(2)}`,
  },
  {
    title: '库存',
    dataIndex: 'stock',
    key: 'stock',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => (
      <Tag color={status === '在售' ? 'green' : 'red'}>{status}</Tag>
    ),
  },
  {
    title: '操作',
    key: 'action',
    render: () => (
      <Space>
        <Button color="primary" variant="link" size="small">编辑</Button>
        <Button type="link" size="small" danger>删除</Button>
      </Space>
    ),
  },
];

// 模拟产品数据
const data = Array.from({ length: 50 }, (_, i) => ({
  key: String(i + 1),
  name: `产品 ${i + 1}`,
  category: ['手机', '电脑', '平板', '配件'][i % 4],
  price: (i + 1) * 100,
  stock: Math.floor(Math.random() * 200),
  status: i % 5 === 0 ? '缺货' : '在售',
}));

/**
 * 产品列表页面
 * 展示产品列表，支持按分类和状态筛选
 */
const ProductList: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className={styles.container}>
      <Title level={3} className={styles.title}>产品列表</Title>
      <div className={styles.toolbar}>
        <Input
          placeholder={t('搜索产品名称') || '搜索产品名称'}
          prefix={<SearchOutlined />}
          style={{ width: 240 }}
        />
        <Select
          placeholder={t('选择分类') || '选择分类'}
          style={{ width: 120 }}
          options={[
            { value: 'all', label: t('全部') || '全部' },
            { value: 'phone', label: t('手机') || '手机' },
            { value: 'computer', label: t('电脑') || '电脑' },
            { value: 'tablet', label: t('平板') || '平板' },
          ]}
        />
        <Select
          placeholder={t('选择状态') || '选择状态'}
          style={{ width: 120 }}
          options={[
            { value: 'all', label: t('全部') || '全部' },
            { value: 'onsale', label: t('在售') || '在售' },
            { value: 'soldout', label: t('缺货') || '缺货' },
          ]}
        />
        <Button type="primary" icon={<PlusOutlined />}>
          {t('新增产品')}
        </Button>
      </div>
      <div className={styles.tableWrapper}>
        <Table 
          columns={columns} 
          dataSource={data} 
          pagination={{ total: 50, pageSize: 10 }}
        />
      </div>
    </div>
  );
};

export default ProductList;