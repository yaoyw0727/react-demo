/**
 * 顶部菜单布局组件
 * 使用顶部水平菜单栏布局
 */
import React from 'react';
import { Layout, Menu, Breadcrumb } from 'antd';
import { useAppearanceStore } from '../../../store/appearance';
import UserDropdown from '../../../components/UserDropdown';
import { useMenu } from '../../hooks/useMenu';
import { FOOTER_TEXT, APP_NAME } from '../../../constants';
import styles from './index.module.less';

const { Header, Content, Footer } = Layout;

interface TopMenuLayoutProps {
  children: React.ReactNode;
}

const TopMenuLayout: React.FC<TopMenuLayoutProps> = ({ children }) => {
  // 主题模式
  const themeMode = useAppearanceStore((state) => state.themeMode);
  // 菜单相关状态和方法
  const { menuItems, selectedKeys, breadcrumbItems, handleMenuClick } = useMenu();

  return (
    <Layout className={styles.layout}>
      {/* 顶部 Header */}
      <Header className={styles.header}>
        <div className={styles.logo}>{APP_NAME}</div>
        <Menu
          theme={themeMode ?? 'light'}
          mode="horizontal"
          selectedKeys={selectedKeys}
          items={menuItems}
          className={styles.menu}
          onClick={handleMenuClick}
        />
        <UserDropdown />
      </Header>
      {/* 内容区域 */}
      <div className={styles.contentWrapper}>
        <Breadcrumb items={breadcrumbItems} className={styles.breadcrumb} />
        <Content className={styles.content}>
          {children}
        </Content>
      </div>
      {/* 页脚 */}
      <Footer className={styles.footer}>
        {FOOTER_TEXT}
      </Footer>
    </Layout>
  );
};

export default TopMenuLayout;