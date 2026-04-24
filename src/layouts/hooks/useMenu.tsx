import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { find, some, replace } from 'lodash';
import { routes } from '../../routes';
import { generateMenuItems } from '../../routes/tools';
import { findParentPath, getBreadcrumbKeys } from '../MainLayout/tools';

interface MenuHookResult {
  menuItems: any[];
  selectedKeys: string[];
  openKeys: string[];
  breadcrumbItems: Array<{ title: React.ReactNode }>;
  handleMenuClick: ({ key }: { key: string }) => void;
  handleOpenChange: (keys: string[]) => void;
}

export const useMenu = (): MenuHookResult => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const menuItems = generateMenuItems(routes, t).map((item: any) => ({
    ...item,
    children: item.children?.map((child: any) => ({
      ...child,
    })),
  }));

  const [openKeys, setOpenKeys] = useState<string[]>([]);

  useEffect(() => {
    const parentPath = findParentPath(location.pathname);
    if (parentPath) {
      setOpenKeys([parentPath]);
    } else {
      setOpenKeys([]);
    }
  }, [location.pathname]);

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

  const handleOpenChange = (keys: string[]) => {
    setOpenKeys(keys);
  };

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

  const breadcrumbKeys = getBreadcrumbKeys(location.pathname);
  const breadcrumbItems = breadcrumbKeys.map((key: string, index: number) => ({
    title: index === 0
      ? <Link to="/">{t(key) || '首页'}</Link>
      : t(key) || key,
  }));

  return {
    menuItems,
    selectedKeys,
    openKeys,
    breadcrumbItems,
    handleMenuClick,
    handleOpenChange,
  };
};