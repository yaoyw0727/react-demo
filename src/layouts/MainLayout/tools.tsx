/**
 * 布局相关的工具函数
 */
import { routes } from "../../routes";
import type { RouteConfig } from "../../routes";

/**
 * 根据路径查找路由配置
 */
export const findRouteByPath = (pathname: string, routeList: RouteConfig[] = routes): RouteConfig | undefined => {
  for (const route of routeList) {
    if (route.path === pathname) return route;
    if (route.children) {
      const child = route.children.find((c: RouteConfig) => c.path === pathname);
      if (child) return child;
    }
  }
  return undefined;
};

/**
 * 根据当前路径查找父级路由路径
 */
export const findParentPath = (pathname: string): string | undefined => {
  for (const route of routes) {
    if (route.children) {
      const child = route.children.find((c) => c.path === pathname);
      if (child) return route.path;
    }
  }
  return undefined;
};

/**
 * 获取页面标题的翻译 key
 */
export const getPageTitleKey = (pathname: string): string => {
  const route = findRouteByPath(pathname);
  if (route) return route.labelKey;
  return 'menu.home';
};

/**
 * 获取面包屑项的翻译 key 数组
 */
export const getBreadcrumbKeys = (pathname: string): string[] => {
  const keys: string[] = ['menu.home'];

  const route = findRouteByPath(pathname);
  if (!route) return keys;

  const parentRoute = routes.find((r) => r.children?.some((c) => c.path === pathname));
  if (parentRoute) {
    keys.push(parentRoute.labelKey);
  }
  keys.push(route.labelKey);

  return keys;
};