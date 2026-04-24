/**
 * 主布局组件
 * 根据 layoutMode 配置显示顶部菜单或侧边栏菜单布局
 * 根据 themeMode 配置深色/浅色主题
 */
import React, { useState, useEffect, useMemo } from 'react';
import { Layout, Menu, Breadcrumb } from 'antd';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { find, some, replace } from 'lodash';
import { routes } from '../../routes';
import { useAppearanceStore } from '../../store/appearance';
import { useLanguageStore } from '../../store/language';
import i18n from '@/utils/i18n';
import UserDropdown from '../../components/UserDropdown';
import styles from './index.module.less';
import { findParentPath, getBreadcrumbKeys } from './tools';
import { generateMenuItems } from '../../routes/tools';
import { FOOTER_TEXT, APP_NAME, APP_NAME_SHORT } from '../../constants';
import './global.css';

const { Header, Content, Footer, Sider } = Layout;

/**
 * 主布局组件
 * @param children - 页面内容
 */
const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const layoutMode = useAppearanceStore((state) => state.layoutMode);
  const themeMode = useAppearanceStore((state) => state.themeMode);
  const language = useLanguageStore((state) => state.language);
  const { t } = useTranslation();
  
  // 语言切换
  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  // 生成菜单项（使用翻译）
  const menuItems = generateMenuItems(routes, t).map((item: any) => ({
    ...item,
    children: item.children?.map((child: any) => ({
      ...child,
    })),
  }));

  // 展开的子菜单 key
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  // 侧边栏收起状态
  const [collapsed, setCollapsed] = useState(false);

  // 路由变化时自动展开对应的子菜单
  useEffect(() => {
    const parentPath = findParentPath(location.pathname);
    if (parentPath) {
      setOpenKeys([parentPath]);
    } else {
      setOpenKeys([]);
    }
  }, [location.pathname]);

  // 处理菜单点击事件，跳转到对应页面
  const handleMenuClick = ({ key }: { key: string }) => {
    const route = find(routes, { path: key });
    if (route) {
      navigate(key);
      return;
    }

    for (const r of routes) {
      if (r.children) {
        const child: any = find(r.children, (c: any) => replace(c.path, r.path + '/', '') === key);
        if (child) {
          navigate(child.path);
          return;
        }
      }
    }
    navigate(key);
  };

  // 处理菜单展开/收起
  const handleOpenChange = (keys: string[]) => {
    setOpenKeys(keys);
  };

  // 计算当前选中的菜单项
  const selectedKeys = useMemo(() => {
    const pathname = location.pathname;
    const keys = [pathname];

    const route: any = find(routes, (r: any) => r.children && some(r.children, { path: pathname }));
    if (route?.children) {
      const child = find(route.children, { path: pathname });
      if (child) {
        keys.push(replace(child.path, route.path + '/', ''));
      }
    }

    return keys;
  }, [location.pathname]);

  // 面包屑翻译
  const breadcrumbKeys = getBreadcrumbKeys(location.pathname);
  const breadcrumbItems = breadcrumbKeys.map((key: string, index: number) => ({
    title: index === 0 
      ? <Link to="/">{t(key) || '首页'}</Link>
      : t(key) || key,
  }));

  // 顶部菜单布局
  if (layoutMode === 'top') {
    return (
      <Layout className={styles.layout}>
        <Header className={styles.header}>
          <div className={styles.logo}>{APP_NAME}</div>
          <Menu
            theme={themeMode ?? 'light'}
            mode="horizontal"
            selectedKeys={selectedKeys}
            openKeys={openKeys}
            items={menuItems}
            className={styles.menu}
            onClick={handleMenuClick}
            onOpenChange={handleOpenChange}
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
  }

  // 侧边栏菜单布局
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

export default MainLayout;