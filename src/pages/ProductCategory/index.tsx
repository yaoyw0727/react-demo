import React from 'react';
import { Typography, Table } from 'antd';
import styles from './index.module.less';

const { Title } = Typography;

const columns = [
  {
    title: '分类名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '描述',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: '产品数量',
    dataIndex: 'productCount',
    key: 'productCount',
  },
  {
    title: '排序',
    dataIndex: 'sort',
    key: 'sort',
  },
];

const data = [
  {
    key: '1',
    name: '手机',
    description: '智能手机及配件',
    productCount: 25,
    sort: 1,
  },
  {
    key: '2',
    name: '电脑',
    description: '笔记本电脑及台式机',
    productCount: 18,
    sort: 2,
  },
  {
    key: '3',
    name: '平板',
    description: '平板电脑及配件',
    productCount: 12,
    sort: 3,
  },
  {
    key: '4',
    name: '配件',
    description: '各类电子配件',
    productCount: 56,
    sort: 4,
  },
];

const ProductCategory: React.FC = () => {
  return (
    <div className={styles.container}>
      <Title level={3} className={styles.title}>产品分类</Title>
      <Table columns={columns} dataSource={data} />
    </div>
  );
};

export default ProductCategory;