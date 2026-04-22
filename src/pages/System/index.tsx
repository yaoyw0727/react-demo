import React from 'react';
import { Typography } from 'antd';
import { Outlet } from 'react-router-dom';
import styles from './index.module.less';

const { Title, Paragraph } = Typography;

const System: React.FC = () => {
  return (
    <div className={styles.container}>
      <Title level={2} className={styles.title}>系统管理</Title>
      <Paragraph>这是系统管理模块的父级页面，下面是子路由内容：</Paragraph>
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
};

export default System;