import React from 'react';
import { Typography, Button, Space } from 'antd';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './index.module.less';

const { Title, Paragraph } = Typography;

/**
 * 关于页面组件
 * 展示项目使用的技术栈信息
 */
const About: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <Title level={2} className={styles.title}>{t('menu.about')}</Title>
      <div className={styles.content}>
        <Paragraph>{t('about.description')}</Paragraph>
        <ul className={styles.list}>
          <li>{t('about.techStack.react')}</li>
          <li>{t('about.techStack.vite')}</li>
          <li>{t('about.techStack.typescript')}</li>
          <li>{t('about.techStack.antd')}</li>
          <li>{t('about.techStack.router')}</li>
          <li>{t('about.techStack.zustand')}</li>
        </ul>
        
        <Space className={styles.buttonGroup}>
          <Link to="/">
            <Button type="primary">{t('common.backToHome')}</Button>
          </Link>
        </Space>
      </div>
    </div>
  );
};

export default About;