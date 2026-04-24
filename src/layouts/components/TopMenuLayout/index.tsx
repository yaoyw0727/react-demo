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
  const themeMode = useAppearanceStore((state) => state.themeMode);
  const { menuItems, selectedKeys, breadcrumbItems, handleMenuClick } = useMenu();

  return (
    <Layout className={styles.layout}>
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
      <div className={styles.contentWrapper}>
        <Breadcrumb items={breadcrumbItems} className={styles.breadcrumb} />
        <Content className={styles.content}>
          {children}
        </Content>
      </div>
      <Footer className={styles.footer}>
        {FOOTER_TEXT}
      </Footer>
    </Layout>
  );
};

export default TopMenuLayout;