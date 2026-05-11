/**
 * 菜单 Hook
 * 提供菜单相关状态和操作方法
 * 用于在布局组件中管理菜单选中状态、展开状态和面包屑
 */
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { find, some, replace } from 'lodash';
import { routes, type RouteConfig } from '../../routes';
import { generateMenuItems } from '../../routes/tools';
import { findParentPath, getBreadcrumbKeys } from '../MainLayout/tools';

/**
 * useMenu Hook 返回值接口
 */
interface MenuHookResult {
  menuItems: any[];
  selectedKeys: string[];
  openKeys: string[];
  breadcrumbItems: Array<{ title: React.ReactNode }>;
  handleMenuClick: ({ key }: { key: string }) => void;
  handleOpenChange: (keys: string[]) => void;
}

/**
 * 菜单 Hook
 * @returns 菜单相关状态和方法
 * - menuItems: 生成的菜单项
 * - selectedKeys: 当前选中的菜单 key
 * - openKeys: 当前展开的子菜单 key
 * - breadcrumbItems: 面包屑项
 * - handleMenuClick: 处理菜单点击
 * - handleOpenChange: 处理菜单展开/收起
 */
export const useMenu = (): MenuHookResult => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // 生成菜单项 - 使用 useMemo 缓存
  const menuItems = useMemo(() => {
    return generateMenuItems(routes, (key: string) => t(key));
  }, [t]);

  // 展开的子菜单 key
  const [openKeys, setOpenKeys] = useState<string[]>([]);

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
  const handleMenuClick = useCallback(({ key }: { key: string }) => {
    const route = find(routes, { path: key }) as RouteConfig | undefined;
    if (route) {
      navigate(key);
      return;
    }

    for (const r of routes) {
      if (r.children) {
        const child = find(r.children, (c: RouteConfig) => replace(c.path, r.path + '/', '') === key) as RouteConfig | undefined;
        if (child) {
          navigate(child.path);
          return;
        }
      }
    }
    navigate(key);
  }, [navigate]);

  // 处理菜单展开/收起
  const handleOpenChange = useCallback((keys: string[]) => {
    setOpenKeys(keys);
  }, []);

  // 计算当前选中的菜单项
  const selectedKeys = useMemo(() => {
    const pathname = location.pathname;
    const keys = [pathname];

    const route = find(routes, (r: RouteConfig) => r.children && some(r.children, { path: pathname })) as RouteConfig | undefined;
    if (route?.children) {
      const child = find(route.children, { path: pathname }) as RouteConfig | undefined;
      if (child) {
        keys.push(replace(child.path, route.path + '/', ''));
      }
    }

    return keys;
  }, [location.pathname]);

  // 获取面包屑 - 使用 useMemo 缓存
  const breadcrumbItems = useMemo(() => {
    const breadcrumbKeys = getBreadcrumbKeys(location.pathname);
    return breadcrumbKeys.map((key: string, index: number) => ({
      title: index === 0
        ? <Link to="/">{t(key) || t('menu.home')}</Link>
        : t(key) || key,
    }));
  }, [location.pathname, t]);

  return {
    menuItems,
    selectedKeys,
    openKeys,
    breadcrumbItems,
    handleMenuClick,
    handleOpenChange,
  };
};