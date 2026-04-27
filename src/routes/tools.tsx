import React from "react";
import { Outlet } from "react-router-dom";
import { map, filter, replace } from "lodash";

/**
 * 路由配置接口
 */
export interface RouteConfig {
  path: string;
  component?: React.ComponentType;
  title: string;
  labelKey: string;
  icon?: React.ReactNode;
  children?: RouteConfig[];
  hidden?: boolean;
}

// React Router 路由配置类型
type RouterConfigItem = {
  path: string;
  element: React.ReactElement;
  children?: Array<{ path: string; element: React.ReactElement }>;
};

// Ant Design Menu 菜单项类型
type MenuItem = {
  key: string;
  icon?: React.ReactNode;
  label: string;
  children?: Array<{ key: string; label: string }>;
};

/**
 * 生成 React Router 路由配置
 */
// 生成 React Router 路由配置
// export const generateRouterConfig = (routes: RouteConfig[]): RouterConfigItem[] => {
//   return map(routes, (route) => {
//     // 如果有子路由，父路由使用 Outlet 让子路由内容显示
//     const element = route.children 
//       ? React.createElement(Outlet)
//       : route.component 
//         ? React.createElement(route.component)
//         : React.createElement(React.Fragment);

//     const config: RouterConfigItem = {
//       path: route.path,
//       element,
//     };

//     if (route.children) {
//       config.children = map(route.children, (child) => ({
//         path: child.path,
//         element: child.component 
//           ? React.createElement(child.component)
//           : React.createElement(React.Fragment),
//       }));
//     }

//     return config;
//   });
// };

/**
 * 生成 React Router 路由配置
 */
export const generateRouterConfig = (routes: RouteConfig[]): RouterConfigItem[] => {
  return map(routes, (route) => {
    // 1. 处理父路由元素
    // 如果有子路由，必须渲染 Outlet 以显示子路由内容
    // 否则，渲染指定的组件；如果没有组件，渲染空片段
    let element: React.ReactNode;
    
    if (route.children) {
      element = <Outlet />;
    } else if (route.component) {
      // 使用 JSX 语法替代 React.createElement
      const Component = route.component;
      element = <Component />;
    } else {
      element = <></>; // React.Fragment 的简写
    }

    const config: RouterConfigItem = {
      path: route.path,
      element
    };

    // 2. 递归处理子路由
    if (route.children && route.children.length > 0) {
      
      // 更完善的递归写法建议：
      config.children = generateRouterConfig(route.children);
    }

    return config;
  });
};



/**
 * 生成 Ant Design Menu 菜单项
 * @param routes - 路由配置数组
 * @param t - 翻译函数
 * @returns Ant Design Menu 格式的菜单项
 */
// 生成 Ant Design Menu 菜单项
export const generateMenuItems = (routes: RouteConfig[], t: (key: string) => string): MenuItem[] => {
  return map(filter(routes, (r) => !r.hidden), (route): MenuItem => {
    const item: MenuItem = {
      key: route.path,
      icon: route.icon,
      label: t(route.labelKey),
    };

    if (route.children) {
      item.children = map(filter(route.children, (c) => !c.hidden), (child) => ({
        key: replace(child.path, route.path + '/', ''),
        label: t(child.labelKey),
        icon: child.icon,
      }));
    }

    return item;
  });
};