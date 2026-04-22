import React from 'react';
import { Typography, Table } from 'antd';
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
];

const data = [
  {
    key: '1',
    username: 'admin',
    email: 'admin@example.com',
    role: '管理员',
    status: '启用',
  },
  {
    key: '2',
    username: 'user1',
    email: 'user1@example.com',
    role: '普通用户',
    status: '启用',
  },
  {
    key: '3',
    username: 'user2',
    email: 'user2@example.com',
    role: '普通用户',
    status: '禁用',
  },
];

const User: React.FC = () => {
  return (
    <div className={styles.container}>
      <Title level={3} className={styles.title}>用户管理</Title>
      <Table columns={columns} dataSource={data} />
    </div>
  );
};

export default User;