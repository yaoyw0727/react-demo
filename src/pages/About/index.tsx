import React from 'react';
import { Typography, Button, Space } from 'antd';
import { Link } from 'react-router-dom';
import styles from './index.module.less';

const { Title, Paragraph } = Typography;

const About: React.FC = () => {
  return (
    <div className={styles.container}>
      <Title level={2} className={styles.title}>关于页面</Title>
      <Paragraph>这是一个使用以下技术栈构建的示例项目：</Paragraph>
      <ul className={styles.list}>
        <li>React 18</li>
        <li>Vite 8</li>
        <li>TypeScript</li>
        <li>Ant Design 6</li>
        <li>React Router 7</li>
        <li>Zustand 状态管理</li>
      </ul>
      
      <Space className={styles.buttonGroup}>
        <Link to="/">
          <Button type="primary">返回首页</Button>
        </Link>
      </Space>
    </div>
  );
};

export default About;