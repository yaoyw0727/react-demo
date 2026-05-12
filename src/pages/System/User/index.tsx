import React, { useState, useCallback } from 'react';
import { Table, Typography, Button, Space, Input, Pagination, App } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useTableScrollY } from '@/layouts/hooks/useTableScrollY';
import UserModal from './components/UserModal';
import styles from './index.module.less';

const { Title } = Typography;

/**
 * 用户管理页面
 * 展示用户列表，支持搜索和分页
 */
const User: React.FC = () => {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const { containerRef, scrollY } = useTableScrollY({ offset: 60 });
  const [data, setData] = useState(() =>
    Array.from({ length: 20 }, (_, i) => ({
      key: String(i + 1),
      username: `user${i + 1}`,
      email: `user${i + 1}@example.com`,
      role: i === 0 ? t('common.admin') : t('user.normalUser'),
      status: i % 5 === 0 ? t('user.statusDisabled') : t('user.statusEnabled'),
    }))
  );
  const [modalVisible, setModalVisible] = useState(false);

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
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: t('user.status'),
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: t('user.action'),
      key: 'action',
      render: () => (
        <Space>
          <Button color="primary" variant="link" size="small">{t('common.edit')}</Button>
          <Button type="link" size="small" danger>{t('common.delete')}</Button>
        </Space>
      ),
    },
  ];

  const handleAdd = useCallback(() => {
    setModalVisible(true);
  }, []);

  const handleOk = useCallback((values: { username: string; email: string; role: string }) => {
    const newUser = {
      key: String(data.length + 1),
      username: values.username,
      email: values.email,
      role: values.role,
      status: t('user.statusEnabled'),
    };
    setData((prev) => [newUser, ...prev]);
    message.success(t('common.success'));
    setModalVisible(false);
  }, [data.length, message, t]);

  return (
    <div className={styles.container}>
      <Title level={3} className={styles.title}>{t('user.title')}</Title>
      <div className={styles.toolbar}>
        <Input
          placeholder={t('user.searchPlaceholder')}
          prefix={<SearchOutlined />}
          style={{ width: 240 }}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          {t('user.addUser')}
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
        <Pagination total={data.length} showSizeChanger={false} showQuickJumper={false} />
      </div>

      <UserModal
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleOk}
      />
    </div>
  );
};

export default User;