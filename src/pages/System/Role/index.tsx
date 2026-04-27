import React, { useState, useEffect, useRef } from 'react';
import { Table, Typography, Button, Space, Input, Tag, Pagination } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import styles from './index.module.less';

const { Title } = Typography;

// 模拟角色数据 - 在组件内部定义以访问t函数

/**
 * 角色管理页面
 * 展示角色列表，支持权限标签显示
 */
const Role: React.FC = () => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(300);

  // 动态计算表格滚动高度
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
      title: t('role.status'),
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: t('role.action'),
      key: 'action',
      render: () => (
        <Space>
          <Button color="primary" variant="link" size="small">{t('common.edit')}</Button>
          <Button type="link" size="small" danger>{t('common.delete')}</Button>
        </Space>
      ),
    },
  ];

  // 模拟角色数据
  const data = [
    {
      key: '1',
      name: t('common.admin'),
      description: t('role.adminDescription'),
      permissions: [t('menu.systemUser'), t('menu.systemRole'), t('settings.title')],
      status: t('role.statusEnabled'),
    },
    {
      key: '2',
      name: t('user.normalUser'),
      description: t('role.normalUserDescription'),
      permissions: [t('role.permissionView')],
      status: t('role.statusEnabled'),
    },
    {
      key: '3',
      name: t('role.guest'),
      description: t('role.guestDescription'),
      permissions: [t('role.permissionView')],
      status: t('role.statusDisabled'),
    },
  ];

  return (
    <div className={styles.container}>
      <Title level={3} className={styles.title}>{t('role.title')}</Title>
      <div className={styles.toolbar}>
        <Input
          placeholder={t('role.searchPlaceholder')}
          prefix={<SearchOutlined />}
          style={{ width: 240 }}
        />
        <Button type="primary" icon={<PlusOutlined />}>
          {t('role.addRole')}
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