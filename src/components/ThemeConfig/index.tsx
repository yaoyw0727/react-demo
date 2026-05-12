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
import { SETTINGS_CONFIG } from '@/constants/settings';

const ThemeConfig: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { primaryColor, themeMode = 'light' } = useAppearanceStore();
  const { language = 'zh-CN' } = useLanguageStore();

  const hasAppearance = SETTINGS_CONFIG.some((item) => item.key === 'appearance');

  const primaryHover = getHoverColor(primaryColor);
  const primaryActive = getActiveColor(primaryColor);
  const primaryShadow = `${primaryColor}40`;
  const layoutColors = getThemeLayoutColors(themeMode);

  const antLocale = useMemo(() => {
    switch (language) {
      case 'zh-CN': return zhCN;
      case 'en-US': return enUS;
      default: return zhCN;
    }
  }, [language]);

  const themeConfig = hasAppearance
    ? {
        token: { colorPrimary: primaryColor },
        algorithm: themeMode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
        components: { Layout: layoutColors },
      }
    : {
        algorithm: themeMode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
        components: { Layout: layoutColors },
      };

  const style = hasAppearance
    ? {
        '--primary-color': primaryColor,
        '--primary-hover': primaryHover,
        '--primary-active': primaryActive,
        '--primary-shadow': primaryShadow,
      } as React.CSSProperties
    : {};

  return (
    <ConfigProvider theme={themeConfig} locale={antLocale}>
      <AntApp>
        <div data-theme={themeMode} style={style}>
          {children}
        </div>
      </AntApp>
    </ConfigProvider>
  );
};

export default ThemeConfig;