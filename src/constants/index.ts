/**
 * 应用常量定义
 */

/** 页脚版权信息 */
export const FOOTER_TEXT = 'React + Vite + Ant Design + React Router + Zustand ©2026';

/** 应用名称 */
export const APP_NAME = 'React App';

/** 应用简称（侧边栏收起时显示） */
export const APP_NAME_SHORT = 'RA';

/** 默认页面标题 */
export const DEFAULT_PAGE_TITLE = '首页';

/**
 * 主题色配置
 */
export const THEME_COLORS = [
  { key: 'blue', value: '#1890ff', label: '拂晓蓝', labelEn: 'Dawn Blue' },
  { key: 'green', value: '#52c41a', label: '极光绿', labelEn: 'Aurora Green' },
  { key: 'purple', value: '#722ed1', label: '酱紫', labelEn: 'Violet' },
  { key: 'red', value: '#f5222d', label: '薄暮', labelEn: 'Sunset' },
  { key: 'orange', value: '#fa8c16', label: '日暮', labelEn: 'Dusk' },
  { key: 'cyan', value: '#13c2c2', label: '明青', labelEn: 'Cyan' },
];

/**
 * 布局模式类型
 */
export type LayoutMode = 'top' | 'side';

/**
 * 主题模式类型
 */
export type ThemeMode = 'light' | 'dark';

/** 默认外观设置 */
export const DEFAULT_APPEARANCE = {
  layoutMode: 'top' as LayoutMode,
  themeMode: 'light' as ThemeMode,
  primaryColor: '#1890ff',
};

/** 主题相关的布局背景颜色和文字颜色 **/
export const DEFAULT_LAYOUT_COLORS: {
  [key: string]: string; // 添加索引签名
} = {
  darkBg: '#001529', // 深色主题背景颜色
  lightBg: '#FFF', // 浅色主题背景颜色、深色主题文字颜色
  darkText: '#FFF', // 浅色主题文字颜色
  lightText: '#000', // 深色主题文字颜色
}
