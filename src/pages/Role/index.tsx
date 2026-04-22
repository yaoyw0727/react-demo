import React from 'react';
import { Typography, Table, Tag } from 'antd';
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
  return (
    <div className={styles.container}>
      <Title level={3} className={styles.title}>角色管理</Title>
      <Table columns={columns} dataSource={data} />
    </div>
  );
};

export default Role;