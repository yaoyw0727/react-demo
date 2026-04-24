import React from 'react';
import { useTranslation } from 'react-i18next';
import type { ThemeMode } from '@/constants';
import styles from './index.module.less';

interface ThemeModeSelectorProps {
  value: ThemeMode;
  primaryColor: string;
  onChange: (value: ThemeMode) => void;
}

const ThemeModeSelector: React.FC<ThemeModeSelectorProps> = ({ value, primaryColor, onChange }) => {
  const { i18n } = useTranslation();
  const isEnglish = i18n.language.startsWith('en');

  const options = [
    { key: 'light' as ThemeMode, label: '浅色', labelEn: 'Light', backgroundColor: '#f8f8f8' },
    { key: 'dark' as ThemeMode, label: '深色', labelEn: 'Dark', backgroundColor: '#2a2a2a' },
  ];

  return (
    <div className={styles.container}>
      {options.map((theme) => (
        <div
          key={theme.key}
          className={`${styles.option} ${value === theme.key ? styles.active : ''}`}
          onClick={() => onChange(theme.key)}
        >
          <div 
            className={styles.wrapper}
            style={value === theme.key ? { borderColor: primaryColor } : undefined}
          >
            <div className={styles.preview} style={{ backgroundColor: theme.backgroundColor }} />
          </div>
          <span 
            className={styles.label} 
            style={{ color: value === theme.key ? primaryColor : 'inherit' }}
          >
            {isEnglish ? theme.labelEn : theme.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ThemeModeSelector;