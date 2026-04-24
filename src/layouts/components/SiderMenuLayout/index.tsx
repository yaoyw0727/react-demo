import React, { useState } from 'react';
import { Layout, Menu, Breadcrumb } from 'antd';
import { useAppearanceStore } from '../../../store/appearance';
import UserDropdown from '../../../components/UserDropdown';
import { useMenu } from '../../hooks/useMenu';
import { FOOTER_TEXT, APP_NAME, APP_NAME_SHORT } from '../../../constants';
import styles from './index.module.less';

const { Header, Content, Footer, Sider } = Layout;

interface SiderMenuLayoutProps {
  children: React.ReactNode;
}

const SiderMenuLayout: React.FC<SiderMenuLayoutProps> = ({ children }) => {
  const themeMode = useAppearanceStore((state) => state.themeMode);
  const { menuItems, selectedKeys, openKeys, breadcrumbItems, handleMenuClick, handleOpenChange } = useMenu();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout className={styles.layout}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value: boolean) => setCollapsed(value)}
        className={styles.sider}
        width={200}
        collapsedWidth={80}
        style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
      >
        <div className={styles.siderContent}>
          <div className={styles.siderLogo}>
            {collapsed ? APP_NAME_SHORT : APP_NAME}
          </div>
          <Menu
            mode="inline"
            theme={themeMode ?? 'light'}
            selectedKeys={selectedKeys}
            openKeys={openKeys}
            items={menuItems}
            onClick={handleMenuClick}
            onOpenChange={handleOpenChange}
            className={styles.siderMenu}
          />
        </div>
      </Sider>
      <Layout className={styles.mainLayout}>
        <Header className={styles.sideHeader}>
          <div />
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
    </Layout>
  );
};

export default SiderMenuLayout;