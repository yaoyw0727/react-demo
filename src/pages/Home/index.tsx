import React from 'react';
import { Button, Space, Typography } from 'antd';
import { useCounterStore } from '../../store/counter';
import { Link } from 'react-router-dom';
import styles from './index.module.less';

const { Title, Paragraph } = Typography;

/**
 * 首页组件
 * 展示应用介绍和状态管理示例
 */
const Home: React.FC = () => {
  const { count, increment, decrement, reset } = useCounterStore();

  return (
    <div className={styles.container}>
      <Title level={2} className={styles.title}>首页</Title>
      <Paragraph>欢迎使用 React + Vite + Ant Design + React Router + Zustand 模板</Paragraph>
      
      <div className={styles.section}>
        <Title level={4}>Zustand 状态管理示例</Title>
        <Paragraph>当前计数: {count}</Paragraph>
        <Space className={styles.buttonGroup}>
          <Button type="primary" onClick={increment}>增加</Button>
          <Button onClick={decrement}>减少</Button>
          <Button danger onClick={reset}>重置</Button>
        </Space>
      </div>

      <div className={styles.section}>
        <Title level={4}>路由示例</Title>
        <Space>
          <Link to="/about">
            <Button type="link">前往关于页面</Button>
          </Link>
        </Space>
      </div>
    </div>
  );
};

export default Home;