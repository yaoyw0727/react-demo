import React from 'react';
import { Button, Space, Typography } from 'antd';
import { useCounterStore } from '../../store/counter';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './index.module.less';

const { Title, Paragraph } = Typography;

/**
 * 首页组件
 * 展示应用介绍和状态管理示例
 */
const Home: React.FC = () => {
  const { count, increment, decrement, reset } = useCounterStore();
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <Title level={2} className={styles.title}>{t('menu.home')}</Title>
      <Paragraph>{t('home.welcome')}</Paragraph>
      
      <div className={styles.section}>
        <Title level={4}>{t('home.stateExample')}</Title>
        <Paragraph>{t('home.currentCount')}: {count}</Paragraph>
        <Space className={styles.buttonGroup}>
          <Button type="primary" onClick={increment}>{t('common.increment')}</Button>
          <Button onClick={decrement}>{t('common.decrement')}</Button>
          <Button danger onClick={reset}>{t('common.reset')}</Button>
        </Space>
      </div>

      <div className={styles.section}>
        <Title level={4}>{t('home.routeExample')}</Title>
        <Space>
          <Link to="/about">
            <Button color="primary" variant="link">{t('home.goToAbout')}</Button>
          </Link>
        </Space>
      </div>
    </div>
  );
};

export default Home;