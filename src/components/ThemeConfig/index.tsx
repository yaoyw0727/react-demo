/**
 * 主题配置组件
 * 使用 Ant Design ConfigProvider 管理全局主题和语言
 */
import React, { useMemo } from 'react';
import { ConfigProvider, theme, App as AntApp } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import enUS from 'antd/locale/en_US';
import { useAppearanceStore } from '../../store/appearance';
import { useLanguageStore } from '../../store/language';
import { getHoverColor, getActiveColor, getThemeLayoutColors } from './tools';

/**
 * 主题配置组件
 * @param children - 子组件
 */
/**
 * 主题配置组件
 * 使用 Ant Design ConfigProvider 管理全局主题和语言
 */
const ThemeConfig: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { primaryColor, themeMode = 'light' } = useAppearanceStore();
  const { language = 'zh-CN' } = useLanguageStore();

  const primaryHover = getHoverColor(primaryColor);
  const primaryActive = getActiveColor(primaryColor);
  const primaryShadow = `${primaryColor}40`;
  const layoutColors = getThemeLayoutColors(themeMode);

  // 根据语言获取对应的 locale
  const antLocale = useMemo(() => {
    return language === 'zh-CN' ? zhCN : enUS;
  }, [language]);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: primaryColor,
        },
        algorithm: themeMode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
        components: {
          Layout: layoutColors,
        },
      }}
      locale={antLocale}
    >
      <AntApp>
        {/* 将主题色作为 CSS 变量传递给子组件 */}
        <div
          data-theme={themeMode}
          style={{
            '--primary-color': primaryColor,
            '--primary-hover': primaryHover,
            '--primary-active': primaryActive,
            '--primary-shadow': primaryShadow,
          } as React.CSSProperties}
        >
          {children}
        </div>
      </AntApp>
    </ConfigProvider>
  );
};

export default ThemeConfig;