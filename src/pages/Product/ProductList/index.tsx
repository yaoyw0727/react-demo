import React, { useState, useEffect, useCallback } from 'react';
import { Table, Tag, Input, Button, Select, Space, Typography, App } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { productApi, type ProductItem } from '@/services/api/product';
import { categoryApi, type CategoryItem } from '@/services/api/category';
import ProductModal from './components/ProductModal';
import styles from './index.module.less';

const { Title } = Typography;

const ProductList: React.FC = () => {
  const { t } = useTranslation();
  const { message } = App.useApp();

  const statusMap: Record<string, { text: string; color: string }> = {
    onSale: { text: t('product.statusOnSale'), color: 'green' },
    outOfStock: { text: t('product.statusOutOfStock'), color: 'red' },
  };
  const [data, setData] = useState<ProductItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState<string | undefined>();
  const [status, setStatus] = useState<string | undefined>();
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editItem, setEditItem] = useState<ProductItem | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      const result = await categoryApi.list({ page: 1, limit: 100 });
      setCategories(result.data);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await productApi.list({
        search: search || undefined,
        categoryId,
        status,
        page,
        limit: pageSize,
      });
      setData(result.data);
      setTotal(result.total);
    } catch (err) {
      message.error(err instanceof Error ? err.message : t('common.error'));
    } finally {
      setLoading(false);
    }
  }, [search, categoryId, status, page, pageSize, message, t]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleAdd = () => {
    setEditItem(null);
    setModalVisible(true);
  };

  const handleEdit = (record: ProductItem) => {
    setEditItem(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await productApi.delete(id);
      message.success(t('common.success'));
      fetchData();
    } catch (err) {
      message.error(err instanceof Error ? err.message : t('common.error'));
    }
  };

  const handleModalOk = async (values: { name: string; categoryId: string; price: number; stock: number; status: string }) => {
    try {
      if (editItem) {
        await productApi.update(editItem.id, values);
        message.success(t('common.success'));
      } else {
        await productApi.create(values);
        message.success(t('common.success'));
      }
      setModalVisible(false);
      fetchData();
    } catch (err) {
      message.error(err instanceof Error ? err.message : t('common.error'));
    }
  };

  const columns = [
    {
      title: t('product.name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('product.category'),
      dataIndex: 'categoryName',
      key: 'categoryName',
    },
    {
      title: t('product.price'),
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `¥${Number(price).toFixed(2)}`,
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
      render: (s: string) => {
        const mapping = statusMap[s];
        return mapping ? <Tag color={mapping.color}>{mapping.text}</Tag> : <Tag>{s}</Tag>;
      },
    },
    {
      title: t('product.action'),
      key: 'action',
      render: (_: unknown, record: ProductItem) => (
        <Space>
          <Button color="primary" variant="link" size="small" onClick={() => handleEdit(record)}>{t('common.edit')}</Button>
          <Button type="link" size="small" danger onClick={() => handleDelete(record.id)}>{t('common.delete')}</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <Title level={3} className={styles.title}>{t('product.listTitle')}</Title>
      <div className={styles.toolbar}>
        <Input.Search
          placeholder={t('product.searchPlaceholder')}
          prefix={<SearchOutlined />}
          style={{ width: 240 }}
          onSearch={handleSearch}
          allowClear
        />
        <Select
          placeholder={t('product.selectCategory')}
          style={{ width: 120 }}
          allowClear
          value={categoryId}
          onChange={(v) => { setCategoryId(v); setPage(1); }}
          options={[
            { value: undefined, label: t('product.allCategories') },
            ...categories.map((c) => ({ value: c.id, label: c.name })),
          ]}
        />
        <Select
          placeholder={t('product.selectStatus')}
          style={{ width: 120 }}
          allowClear
          value={status}
          onChange={(v) => { setStatus(v); setPage(1); }}
          options={[
            { value: undefined, label: t('product.allStatus') },
            { value: 'onSale', label: t('product.statusOnSale') },
            { value: 'outOfStock', label: t('product.statusOutOfStock') },
          ]}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          {t('product.addProduct')}
        </Button>
      </div>
      <div className={styles.tableWrapper}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={data}
          pagination={{ current: page, total, pageSize, onChange: setPage }}
          loading={loading}
        />
      </div>

      <ProductModal
        open={modalVisible}
        editItem={editItem}
        onCancel={() => setModalVisible(false)}
        onOk={handleModalOk}
      />
    </div>
  );
};

export default ProductList;
