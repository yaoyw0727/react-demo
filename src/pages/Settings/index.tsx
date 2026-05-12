/**
 * 设置页面
 * 动态根据配置生成设置面板
 */
import React, { useState } from 'react';
import { Menu } from 'antd';
import { useTranslation } from 'react-i18next';
import { SETTINGS_CONFIG } from '@/constants/settings';
import styles from './index.module.less';
import { useAppearanceStore } from '../../store/appearance';

const Settings: React.FC = () => {
  const [activeKey, setActiveKey] = useState(SETTINGS_CONFIG[0]?.key || '');
  const themeMode = useAppearanceStore((state) => state.themeMode);
  const { t } = useTranslation();

  const settingMenus = SETTINGS_CONFIG.map((item) => ({
    key: item.key,
    icon: item.icon,
    label: t(item.labelKey),
  }));

  const ActivePanel = SETTINGS_CONFIG.find((item) => item.key === activeKey)?.component;

  if (SETTINGS_CONFIG.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div style={{ textAlign: 'center', color: '#999' }}>{t('settings.noSettings')}</div>
        </div>
      </div>
    );
  }

  if (SETTINGS_CONFIG.length === 1) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          {ActivePanel && <ActivePanel />}
        </div>
      </div>
    );
  }

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
        {ActivePanel && <ActivePanel />}
      </div>
    </div>
  );
};

export default Settings;