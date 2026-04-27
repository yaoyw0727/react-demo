/**
 * 路由配置
 * 定义应用的所有页面路由和菜单结构
 */
import { HomeOutlined, InfoCircleOutlined, SettingOutlined, ShoppingOutlined } from '@ant-design/icons';
import Home from '@/pages/Home';
import About from '@/pages/About';
import User from '@/pages/System/User';
import Role from '@/pages/System/Role';
import ProductList from '@/pages/Product/ProductList';
import ProductCategory from '@/pages/Product/ProductCategory';
import Settings from '../pages/Settings';
import type { RouteConfig } from './tools';
export type { RouteConfig };

/**
 * 应用路由配置
 * 包括：首页、关于、系统管理（含用户管理、角色管理）、产品管理（含产品列表、产品分类）、设置（隐藏）
 */
export const routes: RouteConfig[] = [
  { path: '/', component: Home, title: '首页', labelKey: 'menu.home', icon: <HomeOutlined /> },
  { path: '/about', component: About, title: '关于', labelKey: 'menu.about', icon: <InfoCircleOutlined /> },
  {
    path: '/system',
    title: '系统管理',
    labelKey: 'menu.system',
    icon: <SettingOutlined />,
    children: [
      { path: '/system/user', component: User, title: '用户管理', labelKey: 'menu.systemUser' },
      { path: '/system/role', component: Role, title: '角色管理', labelKey: 'menu.systemRole' },
    ],
  },
  {
    path: '/product',
    title: '产品管理',
    labelKey: 'menu.product',
    icon: <ShoppingOutlined />,
    children: [
      { path: '/product/list', component: ProductList, title: '产品列表', labelKey: 'menu.productList' },
      { path: '/product/category', component: ProductCategory, title: '产品分类', labelKey: 'menu.productCategory' },
    ],
  },
  { path: '/settings', component: Settings, title: '设置', labelKey: 'menu.settings', icon: <SettingOutlined />, hidden: true },
];