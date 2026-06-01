import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Input, Typography, Pagination, App } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useTableScrollY } from '@/layouts/hooks/useTableScrollY';
import { categoryApi, type CategoryItem } from '@/services/api/category';
import CategoryDrawer from './components/CategoryDrawer';
import styles from './index.module.less';

const { Title } = Typography;

const ProductCategory: React.FC = () => {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const { containerRef, scrollY } = useTableScrollY({ offset: 76 });
  const [data, setData] = useState<CategoryItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await categoryApi.list({ search: search || undefined, page, limit: pageSize });
      setData(result.data);
      setTotal(result.total);
    } catch (err) {
      message.error(err instanceof Error ? err.message : t('common.error'));
    } finally {
      setLoading(false);
    }
  }, [search, page, pageSize, message, t]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleAdd = useCallback(() => {
    setDrawerVisible(true);
  }, []);

  const handleSubmit = useCallback(
    async (values: { name: string; description?: string; sort?: number }) => {
      try {
        await categoryApi.create(values);
        message.success(t('common.success'));
        setDrawerVisible(false);
        fetchData();
      } catch (err) {
      message.error(err instanceof Error ? err.message : t('common.error'));
    }
  },
  [message, t, fetchData]
  );

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

  return (
    <div className={styles.container}>
      <Title level={3} className={styles.title}>{t('product.categoryTitle')}</Title>
      <div className={styles.toolbar}>
        <Input.Search
          placeholder={t('product.categorySearchPlaceholder')}
          prefix={<SearchOutlined />}
          style={{ width: 240 }}
          onSearch={handleSearch}
          allowClear
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          {t('product.addCategory')}
        </Button>
      </div>
      <div className={styles.tableContainer} ref={containerRef}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={data}
          pagination={false}
          scroll={{ y: scrollY }}
          loading={loading}
        />
      </div>
      <div className={styles.pagination}>
        <Pagination
          current={page}
          total={total}
          pageSize={pageSize}
          showSizeChanger={false}
          showQuickJumper={false}
          onChange={setPage}
        />
      </div>

      <CategoryDrawer
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default ProductCategory;
