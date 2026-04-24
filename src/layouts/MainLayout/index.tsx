/**
 * 主布局组件
 * 根据 layoutMode 配置显示顶部菜单或侧边栏菜单布局
 * 根据 themeMode 配置深色/浅色主题
 */
import React, { useEffect } from 'react';
import { useAppearanceStore } from '../../store/appearance';
import { useLanguageStore } from '../../store/language';
import i18n from '@/utils/i18n';
import TopMenuLayout from '../components/TopMenuLayout';
import SiderMenuLayout from '../components/SiderMenuLayout';
import '../global.css';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const layoutMode = useAppearanceStore((state) => state.layoutMode);
  const language = useLanguageStore((state) => state.language);

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  if (layoutMode === 'top') {
    return <TopMenuLayout>{children}</TopMenuLayout>;
  }

  return <SiderMenuLayout>{children}</SiderMenuLayout>;
};

export default MainLayout;