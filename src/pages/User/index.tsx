import React, { useState, useEffect, useRef } from 'react';
import { Table, Typography, Button, Space, Input, Pagination } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import styles from './index.module.less';

const { Title } = Typography;

const columns = [
  {
    title: '用户名',
    dataIndex: 'username',
    key: 'username',
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: '角色',
    dataIndex: 'role',
    key: 'role',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: '操作',
    key: 'action',
    render: () => (
      <Space>
        <Button type="link" size="small">编辑</Button>
        <Button type="link" size="small" danger>删除</Button>
      </Space>
    ),
  },
];

const data = Array.from({ length: 20 }, (_, i) => ({
  key: String(i + 1),
  username: `user${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: i === 0 ? '管理员' : '普通用户',
  status: i % 5 === 0 ? '禁用' : '启用',
}));

const User: React.FC = () => {
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

  return (
    <div className={styles.container}>
      <Title level={3} className={styles.title}>用户管理</Title>
      <div className={styles.toolbar}>
        <Input
          placeholder={t('搜索用户名') || '搜索用户名'}
          prefix={<SearchOutlined />}
          style={{ width: 240 }}
        />
        <Button type="primary" icon={<PlusOutlined />}>
          {t('新增用户')}
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