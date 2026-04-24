/**
 * 工具函数
 */

import { DEFAULT_LAYOUT_COLORS } from "../../constants";

/**
 * 计算 hover 颜色 - 使颜色变亮
 * @param color - 十六进制颜色值，如 #1890ff
 * @returns 变亮后的颜色值
 */
export const getHoverColor = (color: string): string => {
  const hex = color.replace('#', '');
  const r = Math.min(255, parseInt(hex.substring(0, 2), 16) + 40);
  const g = Math.min(255, parseInt(hex.substring(2, 4), 16) + 40);
  const b = Math.min(255, parseInt(hex.substring(4, 6), 16) + 40);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

/**
 * 计算 active 颜色 - 使颜色变暗
 * @param color - 十六进制颜色值
 * @returns 变暗后的颜色值
 */
export const getActiveColor = (color: string): string => {
  const hex = color.replace('#', '');
  const r = Math.max(0, parseInt(hex.substring(0, 2), 16) - 25);
  const g = Math.max(0, parseInt(hex.substring(2, 4), 16) - 25);
  const b = Math.max(0, parseInt(hex.substring(4, 6), 16) - 25);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

/**
 * 获取主题对应的的布局颜色
 * @param color - 主题  dark | light
 * 
 */
export const getThemeLayoutColors = (themeMode: 'light' | 'dark') => {
  if(!['dark', 'light']?.includes(themeMode)) return {}

  const bgColorKey = `${themeMode}Bg`; // 背景色key
  const textColorKey = `${themeMode}Text`; // 文字颜色key

  const layoutColor =  {
    headerBg: DEFAULT_LAYOUT_COLORS[bgColorKey],
    siderBg: DEFAULT_LAYOUT_COLORS[bgColorKey],
    triggerBg: DEFAULT_LAYOUT_COLORS[bgColorKey],
    triggerColor: DEFAULT_LAYOUT_COLORS[textColorKey],
  }

  return layoutColor
};

/**
 * 将 hex 颜色转换为 rgba
 * @param color - 十六进制颜色值
 * @param alpha - 透明度 0-100
 * @returns rgba 颜色字符串
 */
export const hexToRgba = (color: string, alpha: number): string => {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha / 100})`;
};