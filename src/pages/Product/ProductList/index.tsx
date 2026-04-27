import React from 'react';
import { Table, Tag, Input, Button, Select, Space, Typography } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import styles from './index.module.less';

const { Title } = Typography;

// 模拟产品数据 - 在组件内部定义以访问t函数

/**
 * 产品列表页面
 * 展示产品列表，支持按分类和状态筛选
 */
const ProductList: React.FC = () => {
  const { t } = useTranslation();
  
  const columns = [
    {
      title: t('product.name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('product.category'),
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: t('product.price'),
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `¥${price.toFixed(2)}`,
    },
    {
      title: t('product.stock'),
      dataIndex: 'stock',
      key: 'stock',
    },
    {
      title: t('product.status'),
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const onSaleText = t('product.statusOnSale');
        return <Tag color={status === onSaleText ? 'green' : 'red'}>{status}</Tag>;
      },
    },
    {
      title: t('product.action'),
      key: 'action',
      render: () => (
        <Space>
          <Button color="primary" variant="link" size="small">{t('common.edit')}</Button>
          <Button type="link" size="small" danger>{t('common.delete')}</Button>
        </Space>
      ),
    },
  ];

  // 模拟产品数据
  const data = Array.from({ length: 50 }, (_, i) => ({
    key: String(i + 1),
    name: `${t('product.product')} ${i + 1}`,
    category: [t('product.categoryPhone'), t('product.categoryComputer'), t('product.categoryTablet'), t('product.categoryAccessory')][i % 4],
    price: (i + 1) * 100,
    stock: Math.floor(Math.random() * 200),
    status: i % 5 === 0 ? t('product.statusOutOfStock') : t('product.statusOnSale'),
  }));

  return (
    <div className={styles.container}>
      <Title level={3} className={styles.title}>{t('product.listTitle')}</Title>
      <div className={styles.toolbar}>
        <Input
          placeholder={t('product.searchPlaceholder')}
          prefix={<SearchOutlined />}
          style={{ width: 240 }}
        />
        <Select
          placeholder={t('product.selectCategory')}
          style={{ width: 120 }}
          options={[
            { value: 'all', label: t('product.allCategories') },
            { value: 'phone', label: t('product.categoryPhone') },
            { value: 'computer', label: t('product.categoryComputer') },
            { value: 'tablet', label: t('product.categoryTablet') },
          ]}
        />
        <Select
          placeholder={t('product.selectStatus')}
          style={{ width: 120 }}
          options={[
            { value: 'all', label: t('product.allStatus') },
            { value: 'onsale', label: t('product.statusOnSale') },
            { value: 'soldout', label: t('product.statusOutOfStock') },
          ]}
        />
        <Button type="primary" icon={<PlusOutlined />}>
          {t('product.addProduct')}
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