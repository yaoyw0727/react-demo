import React from 'react';
import { SkinOutlined, GlobalOutlined } from '@ant-design/icons';
import AppearancePanel from '@/pages/Settings/AppearancePanel';
import LanguagePanel from '@/pages/Settings/LanguagePanel';

export interface SettingItem {
  key: string;
  labelKey: string;
  icon: React.ReactNode;
  component: React.ComponentType;
}

export const SETTINGS_CONFIG: SettingItem[] = [
  {
    key: 'appearance',
    labelKey: 'settings.appearance',
    icon: <SkinOutlined />,
    component: AppearancePanel,
  },
  {
    key: 'language',
    labelKey: 'settings.language',
    icon: <GlobalOutlined />,
    component: LanguagePanel,
  },
];