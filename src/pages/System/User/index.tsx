import React, { useState, useEffect, useCallback } from 'react';
import { Table, Typography, Button, Space, Input, Pagination, Tag, App } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useTableScrollY } from '@/layouts/hooks/useTableScrollY';
import { userApi, type UserItem } from '@/services/api/user';
import UserModal from './components/UserModal';
import styles from './index.module.less';

const { Title } = Typography;

const User: React.FC = () => {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const { containerRef, scrollY } = useTableScrollY({ offset: 60 });
  const [data, setData] = useState<UserItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editItem, setEditItem] = useState<UserItem | null>(null);

  const statusMap: Record<string, string> = {
    enabled: t('user.statusEnabled'),
    disabled: t('user.statusDisabled'),
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await userApi.list({ search: search || undefined, page, limit: pageSize });
      setData(result.data);
      setTotal(result.total);
    } catch (err) {
      message.error(err instanceof Error ? err.message : '获取用户列表失败');
    } finally {
      setLoading(false);
    }
  }, [search, page, pageSize, message]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleAdd = () => {
    setEditItem(null);
    setModalVisible(true);
  };

  const handleEdit = (record: UserItem) => {
    setEditItem(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await userApi.delete(id);
      message.success(t('common.success'));
      fetchData();
    } catch (err) {
      message.error(err instanceof Error ? err.message : t('common.error'));
    }
  };

  const handleModalOk = async (values: { username: string; email: string; roleId: string; password?: string }) => {
    try {
      if (editItem) {
        await userApi.update(editItem.id, values);
        message.success(t('common.success'));
      } else {
        await userApi.create({ ...values, password: values.password || '123456', status: 'enabled' });
        message.success(t('common.success'));
      }
      setModalVisible(false);
      fetchData();
    } catch (err) {
      message.error(err instanceof Error ? err.message : t('common.error'));
    }
  };

  const toggleStatus = async (record: UserItem) => {
    const newStatus = record.status === 'enabled' ? 'disabled' : 'enabled';
    try {
      await userApi.updateStatus(record.id, newStatus);
      message.success(t('common.success'));
      fetchData();
    } catch (err) {
      message.error(err instanceof Error ? err.message : t('common.error'));
    }
  };

  const columns = [
    {
      title: t('user.username'),
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: t('user.email'),
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: t('user.role'),
      dataIndex: 'roleName',
      key: 'roleName',
    },
    {
      title: t('user.status'),
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'enabled' ? 'green' : 'red'}>{statusMap[status] || status}</Tag>
      ),
    },
    {
      title: t('user.action'),
      key: 'action',
      render: (_: unknown, record: UserItem) => (
        <Space>
          <Button color="primary" variant="link" size="small" onClick={() => handleEdit(record)}>{t('common.edit')}</Button>
          <Button color="primary" variant="link" size="small" onClick={() => toggleStatus(record)}>
            {record.status === 'enabled' ? t('user.statusDisabled') : t('user.statusEnabled')}
          </Button>
          <Button type="link" size="small" danger onClick={() => handleDelete(record.id)}>{t('common.delete')}</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <Title level={3} className={styles.title}>{t('user.title')}</Title>
      <div className={styles.toolbar}>
        <Input.Search
          placeholder={t('user.searchPlaceholder')}
          prefix={<SearchOutlined />}
          style={{ width: 240 }}
          onSearch={handleSearch}
          allowClear
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          {t('user.addUser')}
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

      <UserModal
        open={modalVisible}
        editItem={editItem}
        onCancel={() => setModalVisible(false)}
        onOk={handleModalOk}
      />
    </div>
  );
};

export default User;
