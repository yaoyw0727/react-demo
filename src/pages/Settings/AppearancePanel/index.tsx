/**
 * 外观设置面板
 * 提供布局模式、主题模式、主题色配置
 */
import React, { useEffect, useState } from 'react';
import { Form, message, ColorPicker } from 'antd';
import { useTranslation } from 'react-i18next';
import { useAppearanceStore } from '../../../store/appearance';
import { THEME_COLORS, DEFAULT_APPEARANCE } from '../../../constants';
import type { LayoutMode, ThemeMode } from '../../../constants';
import ActionsBar from '../components/ActionsBar';
import styles from './index.module.less';

const LAYOUT_OPTIONS: { key: LayoutMode; label: string; labelEn: string; render: (primaryColor: string) => React.ReactNode }[] = [
  { 
    key: 'side', 
    label: '侧边菜单', 
    labelEn: 'Side Menu',
    render: (primaryColor: string) => (
      <div className={styles.layoutPreview}>
        <div className={styles.sideMenu} style={{ backgroundColor: `${primaryColor}80` }} />
        <div className={styles.mainContent}>
          <div className={styles.header} style={{ backgroundColor: `${primaryColor}40` }} />
          <div className={styles.body}>
            <div className={styles.contentBlock} />
          </div>
        </div>
      </div>
    )
  },
  { 
    key: 'top', 
    label: '顶部菜单', 
    labelEn: 'Top Menu',
    render: (primaryColor: string) => (
      <div className={styles.layoutPreview}>
        <div className={styles.headerTop} style={{ backgroundColor: `${primaryColor}80` }} />
        <div className={styles.body}>
          <div className={styles.contentBlock} />
        </div>
      </div>
    )
  },
];

/**
 * 外观设置面板组件
 */
const AppearancePanel: React.FC = () => {
  const { layoutMode, themeMode, primaryColor, setLayoutMode, setThemeMode, setPrimaryColor, resetAppearance } = useAppearanceStore();
  const [form] = Form.useForm();
  const [selectedColor, setSelectedColor] = useState(primaryColor);
  const [selectedLayout, setSelectedLayout] = useState<LayoutMode>(layoutMode);
  const [selectedTheme, setSelectedTheme] = useState<ThemeMode>(themeMode);
  const { t, i18n } = useTranslation();
  const isEnglish = i18n.language === 'en-US';
  
  const isCustomColor = !THEME_COLORS.some(c => c.value === selectedColor);

  useEffect(() => {
    form.setFieldsValue({ layoutMode, themeMode, primaryColor });
    setSelectedColor(primaryColor);
    setSelectedLayout(layoutMode);
    setSelectedTheme(themeMode);
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
    setSelectedLayout(layoutMode);
    setSelectedTheme(themeMode);
    message.info(t('settings.settingsCanceled'));
  };

  const handleReset = () => {
    resetAppearance();
    form.setFieldsValue(DEFAULT_APPEARANCE);
    setSelectedColor(DEFAULT_APPEARANCE.primaryColor);
    setSelectedLayout(DEFAULT_APPEARANCE.layoutMode);
    setSelectedTheme(DEFAULT_APPEARANCE.themeMode);
    message.success(t('settings.settingsReset'));
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    form.setFieldValue('primaryColor', color);
  };

  const handleLayoutSelect = (layout: LayoutMode) => {
    setSelectedLayout(layout);
    form.setFieldValue('layoutMode', layout);
  };

  const handleCustomColorChange = (color: string) => {
    setSelectedColor(color);
    form.setFieldValue('primaryColor', color);
  };

  return (
    <div className={styles.panel}>
      <Form form={form} layout="vertical" initialValues={{ layoutMode, themeMode, primaryColor }}>
        <Form.Item label={t('settings.layoutMode')} name="layoutMode">
          <div className={styles.layoutPicker}>
            {LAYOUT_OPTIONS.map((layout) => (
              <div
                key={layout.key}
                className={`${styles.layoutOption} ${selectedLayout === layout.key ? styles.active : ''}`}
                onClick={() => handleLayoutSelect(layout.key)}
              >
                <div 
                  className={styles.layoutWrapper}
                  style={selectedLayout === layout.key ? { borderColor: primaryColor } : undefined}
                >
                  {layout.render(primaryColor)}
                </div>
                <span 
                  className={styles.layoutLabel} 
                  style={{ color: selectedLayout === layout.key ? primaryColor : 'inherit' }}
                >
                  {isEnglish ? layout.labelEn : layout.label}
                </span>
              </div>
            ))}
          </div>
        </Form.Item>

        <Form.Item label={t('settings.themeMode')} name="themeMode">
          <div className={styles.themePicker}>
            {([
              { key: 'light' as ThemeMode, label: '浅色', labelEn: 'Light', render: () => <div className={styles.themePreview} style={{ backgroundColor: '#f8f8f8' }} /> },
              { key: 'dark' as ThemeMode, label: '深色', labelEn: 'Dark', render: () => <div className={styles.themePreview} style={{ backgroundColor: '#2a2a2a' }} /> },
            ]).map((theme) => (
              <div
                key={theme.key}
                className={`${styles.themeOption} ${selectedTheme === theme.key ? styles.active : ''}`}
                onClick={() => {
                  setSelectedTheme(theme.key);
                  form.setFieldValue('themeMode', theme.key);
                }}
              >
                <div 
                  className={styles.themeWrapper}
                  style={selectedTheme === theme.key ? { borderColor: primaryColor } : undefined}
                >
                  {theme.render()}
                </div>
                <span 
                  className={styles.themeLabel} 
                  style={{ color: selectedTheme === theme.key ? primaryColor : 'inherit' }}
                >
                  {isEnglish ? theme.labelEn : theme.label}
                </span>
              </div>
            ))}
          </div>
        </Form.Item>

        <Form.Item label={t('settings.themeColor')} name="primaryColor">
          <div className={styles.colorPicker}>
            {THEME_COLORS.map((color) => (
              <div
                key={color.key}
                className={`${styles.colorOption} ${selectedColor === color.value ? styles.active : ''}`}
                onClick={() => handleColorSelect(color.value)}
              >
                <div 
                  className={styles.colorWrapper}
                  style={selectedColor === color.value ? { 
                    borderColor: color.value,
                    boxShadow: `0 4px 16px ${color.value}40`
                  } : undefined}
                >
                  <div className={styles.colorBlock} style={{ backgroundColor: color.value }} />
                </div>
                <span className={styles.colorLabel} style={{ color: color.value }}>{isEnglish ? color.labelEn : color.label}</span>
              </div>
            ))}
            <div className={styles.colorOption}>
              <div 
                className={styles.colorWrapper}
                style={isCustomColor ? { 
                  borderColor: selectedColor,
                  boxShadow: `0 4px 16px ${selectedColor}40`
                } : undefined}
              >
                <ColorPicker
                  value={selectedColor}
                  onChange={(_, hex) => handleCustomColorChange(hex)}
                >
                  <div 
                    className={styles.customColor}
                    style={{ 
                      backgroundColor: isCustomColor ? selectedColor : '#fff',
                      border: isCustomColor ? 'none' : '2px solid var(--border-color-light)'
                    }}
                  />
                </ColorPicker>
              </div>
              <span className={styles.colorLabel} style={{ color: isCustomColor ? selectedColor : 'inherit' }}>
                {isEnglish ? 'Custom' : '自定义'}
              </span>
            </div>
          </div>
        </Form.Item>
      </Form>

      <ActionsBar onReset={handleReset} onCancel={handleCancel} onSave={handleSave} />
    </div>
  );
};

export default AppearancePanel;