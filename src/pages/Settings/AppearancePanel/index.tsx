/**
 * 外观设置面板
 * 提供布局模式、主题模式、主题色配置
 */
import React, { useEffect, useState } from 'react';
import { Radio, Form, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useAppearanceStore } from '../../../store/appearance';
import { THEME_COLORS, DEFAULT_APPEARANCE } from '../../../constants';
import ActionsBar from '../components/ActionsBar';
import styles from './index.module.less';

/**
 * 外观设置面板组件
 */
const AppearancePanel: React.FC = () => {
  const { layoutMode, themeMode, primaryColor, setLayoutMode, setThemeMode, setPrimaryColor, resetAppearance } = useAppearanceStore();
  const [form] = Form.useForm();
  const [selectedColor, setSelectedColor] = useState(primaryColor);
  const { t } = useTranslation();

  useEffect(() => {
    form.setFieldsValue({ layoutMode, themeMode, primaryColor });
    setSelectedColor(primaryColor);
  }, [layoutMode, themeMode, primaryColor, form]);

  const handleSave = () => {
    const values = form.getFieldsValue();
    setLayoutMode(values.layoutMode);
    setThemeMode(values.themeMode);
    setPrimaryColor(values.primaryColor);
    message.success(t('settings.settingsSaved'));
  };

  const handleCancel = () => {
    form.setFieldsValue({ layoutMode, themeMode, primaryColor });
    setSelectedColor(primaryColor);
    message.info(t('settings.settingsCanceled'));
  };

  const handleReset = () => {
    resetAppearance();
    form.setFieldsValue(DEFAULT_APPEARANCE);
    setSelectedColor(DEFAULT_APPEARANCE.primaryColor);
    message.success(t('settings.settingsReset'));
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    form.setFieldValue('primaryColor', color);
  };

  return (
    <div className={styles.panel}>
      <Form form={form} layout="vertical" initialValues={{ layoutMode, themeMode, primaryColor }}>
        <Form.Item label={t('settings.layoutMode')} name="layoutMode">
          <Radio.Group>
            <Radio.Button value="top">{t('settings.topMenu')}</Radio.Button>
            <Radio.Button value="side">{t('settings.sideMenu')}</Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item label={t('settings.themeMode')} name="themeMode">
          <Radio.Group>
            <Radio.Button value="light">{t('settings.light')}</Radio.Button>
            <Radio.Button value="dark">{t('settings.dark')}</Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item label={t('settings.themeColor')} name="primaryColor">
          <div className={styles.colorPicker}>
            {THEME_COLORS.map((color) => (
              <div
                key={color.key}
                className={`${styles.colorOption} ${selectedColor === color.value ? styles.active : ''}`}
                style={{ backgroundColor: color.value }}
                onClick={() => handleColorSelect(color.value)}
                title={color.label}
              />
            ))}
            <div className={styles.customColor}>
              <input
                type="color"
                value={selectedColor}
                onChange={(e) => handleColorSelect(e.target.value)}
                className={styles.colorInput}
              />
            </div>
          </div>
        </Form.Item>
      </Form>

      <ActionsBar onReset={handleReset} onCancel={handleCancel} onSave={handleSave} />
    </div>
  );
};

export default AppearancePanel;