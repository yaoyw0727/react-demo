import React from 'react';
import { Table, Button, Input, Typography, Pagination } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useTableScrollY } from '@/layouts/hooks/useTableScrollY';
import styles from './index.module.less';

const { Title } = Typography;

/**
 * 产品分类页面
 * 展示产品分类列表，支持排序
 */
const ProductCategory: React.FC = () => {
  const { t } = useTranslation();
  const { containerRef, scrollY } = useTableScrollY({ offset: 76 });
  
  const columns = [
    {
      title: t('product.categoryName'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('product.categoryDescription'),
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: t('product.productCount'),
      dataIndex: 'productCount',
      key: 'productCount',
    },
    {
      title: t('product.sort'),
      dataIndex: 'sort',
      key: 'sort',
    },
  ];

  // 模拟分类数据
  const data = Array.from({ length: 30 }, (_, i) => ({
    key: String(i + 1),
    name: `${t('product.product')} ${i + 1}`,
    description: `${t('product.categoryDescriptionPrefix')} ${i + 1}`,
    productCount: Math.floor(Math.random() * 100),
    sort: i + 1,
  }));

  return (
    <div className={styles.container}>
      <Title level={3} className={styles.title}>{t('product.categoryTitle')}</Title>
      <div className={styles.toolbar}>
        <Input
          placeholder={t('product.categorySearchPlaceholder')}
          prefix={<SearchOutlined />}
          style={{ width: 240 }}
        />
        <Button type="primary" icon={<PlusOutlined />}>
          {t('product.addCategory')}
        </Button>
      </div>
      <div className={styles.tableContainer} ref={containerRef}>
        <Table 
          columns={columns} 
          dataSource={data} 
          pagination={false}
          scroll={{ y: scrollY }}
        />
      </div>
      <div className={styles.pagination}>
        <Pagination
          total={30}
          showSizeChanger={false}
          showQuickJumper={false}
        />
      </div>
    </div>
  );
};

export default ProductCategory;