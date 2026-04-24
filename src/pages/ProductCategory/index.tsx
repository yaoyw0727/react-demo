import React, { useRef, useState, useEffect } from 'react';
import { Table, Button, Input, Typography, Pagination } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
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

// 模拟分类数据
const data = Array.from({ length: 30 }, (_, i) => ({
  key: String(i + 1),
  name: `分类 ${i + 1}`,
  description: `这是分类 ${i + 1} 的描述`,
  productCount: Math.floor(Math.random() * 100),
  sort: i + 1,
}));

/**
 * 产品分类页面
 * 展示产品分类列表，支持排序
 */
const ProductCategory: React.FC = () => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(300);

  // 动态计算表格滚动高度
  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setScrollY(rect.height - 76);
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);
  
  return (
    <div className={styles.container}>
      <Title level={3} className={styles.title}>产品分类</Title>
      <div className={styles.toolbar}>
        <Input
          placeholder={t('搜索分类名称') || '搜索分类名称'}
          prefix={<SearchOutlined />}
          style={{ width: 240 }}
        />
        <Button type="primary" icon={<PlusOutlined />}>
          {t('新增分类')}
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