import React, { useState, useEffect, useRef } from 'react';
import { Table, Typography, Button, Space, Input, Pagination } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import styles from './index.module.less';

const { Title } = Typography;

// 模拟用户数据 - 在组件内部定义以访问t函数

/**
 * 用户管理页面
 * 展示用户列表，支持搜索和分页
 */
const User: React.FC = () => {
  // 动态计算表格滚动高度
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(300);

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

  // 模拟用户数据
  const data = Array.from({ length: 20 }, (_, i) => ({
    key: String(i + 1),
    username: `user${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: i === 0 ? t('common.admin') : t('user.normalUser'),
    status: i % 5 === 0 ? t('user.statusDisabled') : t('user.statusEnabled'),
  }));

  return (
    <div className={styles.container}>
      <Title level={3} className={styles.title}>{t('user.title')}</Title>
      <div className={styles.toolbar}>
        <Input
          placeholder={t('user.searchPlaceholder')}
          prefix={<SearchOutlined />}
          style={{ width: 240 }}
        />
        <Button type="primary" icon={<PlusOutlined />}>
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
        <Pagination total={20} showSizeChanger={false} showQuickJumper={false} />
      </div>
    </div>
  );
};

export default User;