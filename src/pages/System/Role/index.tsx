import React, { useState, useEffect, useCallback } from 'react';
import { Table, Typography, Button, Space, Input, Tag, Pagination, App } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { roleApi, type RoleItem } from '@/services/api/role';
import RoleModal from './components/RoleModal';
import styles from './index.module.less';

const { Title } = Typography;

const Role: React.FC = () => {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(300);

  const statusMap: Record<string, string> = {
    enabled: t('role.statusEnabled'),
    disabled: t('role.statusDisabled'),
  };
  const [data, setData] = useState<RoleItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editItem, setEditItem] = useState<RoleItem | null>(null);

  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setScrollY(rect.height - 60);
      }
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await roleApi.list({ search: search || undefined, page, limit: pageSize });
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

  const handleAdd = () => {
    setEditItem(null);
    setModalVisible(true);
  };

  const handleEdit = (record: RoleItem) => {
    setEditItem(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await roleApi.delete(id);
      message.success(t('common.success'));
      fetchData();
    } catch (err) {
      message.error(err instanceof Error ? err.message : t('common.error'));
    }
  };

  const handleModalOk = async (values: { name: string; description?: string; permissions: string[]; status: string }) => {
    try {
      if (editItem) {
        await roleApi.update(editItem.id, values);
        message.success(t('common.success'));
      } else {
        await roleApi.create(values);
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
      title: t('role.name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('role.description'),
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: t('role.permissions'),
      dataIndex: 'permissionList',
      key: 'permissionList',
      render: (permissions: string[]) => (
        <>
          {permissions?.map((permission) => (
            <Tag color="blue" key={permission}>{permission}</Tag>
          ))}
        </>
      ),
    },
    {
      title: t('role.status'),
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'enabled' ? 'green' : 'red'}>{statusMap[status] || status}</Tag>
      ),
    },
    {
      title: t('role.action'),
      key: 'action',
      render: (_: unknown, record: RoleItem) => (
        <Space>
          <Button color="primary" variant="link" size="small" onClick={() => handleEdit(record)}>{t('common.edit')}</Button>
          <Button type="link" size="small" danger onClick={() => handleDelete(record.id)}>{t('common.delete')}</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <Title level={3} className={styles.title}>{t('role.title')}</Title>
      <div className={styles.toolbar}>
        <Input.Search
          placeholder={t('role.searchPlaceholder')}
          prefix={<SearchOutlined />}
          style={{ width: 240 }}
          onSearch={handleSearch}
          allowClear
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          {t('role.addRole')}
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

      <RoleModal
        open={modalVisible}
        editItem={editItem}
        onCancel={() => setModalVisible(false)}
        onOk={handleModalOk}
      />
    </div>
  );
};

export default Role;
