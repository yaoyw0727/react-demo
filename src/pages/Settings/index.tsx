/**
 * 设置页面
 * 包含外观设置和语言设置两个面板
 */
import React, { useState } from 'react';
import { Menu } from 'antd';
import { SkinOutlined, GlobalOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import AppearancePanel from './AppearancePanel';
import LanguagePanel from './LanguagePanel';
import styles from './index.module.less';
import { useAppearanceStore } from '../../store/appearance';

/**
 * 设置页面组件
 */
const Settings: React.FC = () => {
  const [activeKey, setActiveKey] = useState('appearance');
  const themeMode = useAppearanceStore((state) => state.themeMode);
  const { t } = useTranslation();

  const settingMenus = [
    { key: 'appearance', icon: <SkinOutlined />, label: t('settings.appearance') },
    { key: 'language', icon: <GlobalOutlined />, label: t('settings.language') },
  ];

  const renderPanel = () => {
    switch (activeKey) {
      case 'appearance':
        return <AppearancePanel />;
      case 'language':
        return <LanguagePanel />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <Menu
          mode="inline"
          theme={themeMode ?? 'light'}
          selectedKeys={[activeKey]}
          items={settingMenus}
          onClick={({ key }) => setActiveKey(key)}
          className={styles.menu}
        />
      </div>
      <div className={styles.content}>
        {renderPanel()}
      </div>
    </div>
  );
};

export default Settings;