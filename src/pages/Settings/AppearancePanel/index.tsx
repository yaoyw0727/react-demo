/**
 * 外观设置面板
 * 提供布局模式、主题模式、主题色配置
 */
import React, { useEffect, useState } from 'react';
import { Form, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useAppearanceStore } from '@/store/appearance';
import { DEFAULT_APPEARANCE } from '@/constants';
import type { LayoutMode, ThemeMode } from '@/constants';
import ActionsBar from '../components/ActionsBar';
import LayoutModeSelector from './components/LayoutModeSelector';
import ThemeModeSelector from './components/ThemeModeSelector';
import ThemeColorSelector from './components/ThemeColorSelector';
import styles from './index.module.less';

/**
 * 外观设置面板组件
 */
/**
 * 外观设置面板
 * 提供布局模式、主题模式、主题色配置
 */
const AppearancePanel: React.FC = () => {
  const { layoutMode, themeMode, primaryColor, setLayoutMode, setThemeMode, setPrimaryColor, resetAppearance } = useAppearanceStore();
  const [form] = Form.useForm();
  const [selectedLayout, setSelectedLayout] = useState<LayoutMode>(layoutMode);
  const [selectedTheme, setSelectedTheme] = useState<ThemeMode>(themeMode);
  const [selectedColor, setSelectedColor] = useState(primaryColor);
  const { t } = useTranslation();

  // 同步表单值与 store
  useEffect(() => {
    form.setFieldsValue({ layoutMode, themeMode, primaryColor });
    resetAll(layoutMode, themeMode, primaryColor);
  }, [layoutMode, themeMode, primaryColor, form]);

  // 保存设置到 store
  const handleSave = () => {
    setLayoutMode(selectedLayout);
    setThemeMode(selectedTheme);
    setPrimaryColor(selectedColor);
    message.success(t('settings.settingsSaved'));
  };

  // 取消更改，恢复初始值
  const handleCancel = () => {
    resetAll(layoutMode, themeMode, primaryColor);
    message.info(t('settings.settingsCanceled'));
  };

  // 重置为默认值
  const handleReset = () => {
    resetAppearance();
    form.setFieldsValue(DEFAULT_APPEARANCE);
    resetAll();
    message.success(t('settings.settingsReset'));
  };

  // 重置所有选中值为默认值
  const resetAll = (
    layout: LayoutMode = DEFAULT_APPEARANCE.layoutMode, 
    theme: ThemeMode = DEFAULT_APPEARANCE.themeMode, 
    color: string = DEFAULT_APPEARANCE.primaryColor
  ) => {
    setSelectedLayout(layout);
    setSelectedTheme(theme);
    setSelectedColor(color);
  };

  return (
    <div className={styles.panel}>
      <Form form={form} layout="vertical" initialValues={{ layoutMode, themeMode, primaryColor }}>
        <Form.Item label={t('settings.layoutMode')} name="layoutMode">
          <LayoutModeSelector 
            value={selectedLayout} 
            primaryColor={primaryColor}
            onChange={setSelectedLayout}
          />
        </Form.Item>

        <Form.Item label={t('settings.themeMode')} name="themeMode">
          <ThemeModeSelector 
            value={selectedTheme} 
            primaryColor={primaryColor}
            onChange={setSelectedTheme}
          />
        </Form.Item>

        <Form.Item label={t('settings.themeColor')} name="primaryColor">
          <ThemeColorSelector 
            value={selectedColor}
            onChange={setSelectedColor}
          />
        </Form.Item>
      </Form>

      <ActionsBar onReset={handleReset} onCancel={handleCancel} onSave={handleSave} />
    </div>
  );
};

export default AppearancePanel;