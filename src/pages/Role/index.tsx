import React, { useState, useEffect, useRef } from 'react';
import { Table, Typography, Button, Space, Input, Tag, Pagination } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import styles from './index.module.less';

const { Title } = Typography;

const columns = [
  {
    title: '角色名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '描述',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: '权限',
    dataIndex: 'permissions',
    key: 'permissions',
    render: (permissions: string[]) => (
      <>
        {permissions.map((permission) => (
          <Tag color="blue" key={permission}>
            {permission}
          </Tag>
        ))}
      </>
    ),
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

const data = [
  {
    key: '1',
    name: '管理员',
    description: '系统管理员，拥有所有权限',
    permissions: ['用户管理', '角色管理', '系统设置'],
    status: '启用',
  },
  {
    key: '2',
    name: '普通用户',
    description: '普通用户，拥有基本权限',
    permissions: ['查看'],
    status: '启用',
  },
  {
    key: '3',
    name: '访客',
    description: '访客用户，只有查看权限',
    permissions: ['查看'],
    status: '禁用',
  },
];

const Role: React.FC = () => {
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
      <Title level={3} className={styles.title}>角色管理</Title>
      <div className={styles.toolbar}>
        <Input
          placeholder={t('搜索角色名称') || '搜索角色名称'}
          prefix={<SearchOutlined />}
          style={{ width: 240 }}
        />
        <Button type="primary" icon={<PlusOutlined />}>
          {t('新增角色')}
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
        <Pagination total={3} showSizeChanger={false} showQuickJumper={false} />
      </div>
    </div>
  );
};

export default Role;