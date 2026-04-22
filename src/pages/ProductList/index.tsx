import React from 'react';
import { Typography, Table, Tag } from 'antd';
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
];

const data = [
  {
    key: '1',
    name: 'iPhone 15',
    category: '手机',
    price: 7999,
    stock: 100,
    status: '在售',
  },
  {
    key: '2',
    name: 'MacBook Pro',
    category: '电脑',
    price: 14999,
    stock: 50,
    status: '在售',
  },
  {
    key: '3',
    name: 'iPad Air',
    category: '平板',
    price: 4799,
    stock: 0,
    status: '缺货',
  },
];

const ProductList: React.FC = () => {
  return (
    <div className={styles.container}>
      <Title level={3} className={styles.title}>产品列表</Title>
      <Table columns={columns} dataSource={data} />
    </div>
  );
};

export default ProductList;