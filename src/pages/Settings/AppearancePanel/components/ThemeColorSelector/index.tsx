import React from 'react';
import { useTranslation } from 'react-i18next';
import { ColorPicker } from 'antd';
import { THEME_COLORS } from '@/constants';
import styles from './index.module.less';

interface ThemeColorSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const ThemeColorSelector: React.FC<ThemeColorSelectorProps> = ({ value, onChange }) => {
  const { i18n } = useTranslation();
  const isEnglish = i18n.language.startsWith('en');
  const isCustomColor = !THEME_COLORS.some(c => c.value === value);

  return (
    <div className={styles.container}>
      {THEME_COLORS.map((color) => (
        <div
          key={color.key}
          className={`${styles.option} ${value === color.value ? styles.active : ''}`}
          onClick={() => onChange(color.value)}
        >
          <div 
            className={styles.wrapper}
            style={value === color.value ? { 
              borderColor: color.value,
              boxShadow: `0 4px 16px ${color.value}40`
            } : undefined}
          >
            <div className={styles.colorBlock} style={{ backgroundColor: color.value }} />
          </div>
          <span className={styles.label} style={{ color: color.value }}>
            {isEnglish ? color.labelEn : color.label}
          </span>
        </div>
      ))}
      <div className={styles.option}>
        <div 
          className={styles.wrapper}
          style={isCustomColor ? { 
            borderColor: value,
            boxShadow: `0 4px 16px ${value}40`
          } : undefined}
        >
          <ColorPicker
            value={value}
            onChange={(_, hex) => onChange(hex)}
          >
            <div 
              className={styles.customColor}
              style={{ 
                backgroundColor: isCustomColor ? value : '#fff',
                border: isCustomColor ? 'none' : '2px solid var(--border-color-light)'
              }}
            />
          </ColorPicker>
        </div>
        <span className={styles.label} style={{ color: isCustomColor ? value : 'inherit' }}>
          {isEnglish ? 'Custom' : '自定义'}
        </span>
      </div>
    </div>
  );
};

export default ThemeColorSelector;