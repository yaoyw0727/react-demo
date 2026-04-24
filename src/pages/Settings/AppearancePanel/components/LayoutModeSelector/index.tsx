import React from 'react';
import { useTranslation } from 'react-i18next';
import type { LayoutMode } from '@/constants';
import styles from './index.module.less';

interface LayoutModeSelectorProps {
  value: LayoutMode;
  primaryColor: string;
  onChange: (value: LayoutMode) => void;
}

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

const LayoutModeSelector: React.FC<LayoutModeSelectorProps> = ({ value, primaryColor, onChange }) => {
  const { i18n } = useTranslation();
  const isEnglish = i18n.language.startsWith('en');

  return (
    <div className={styles.container}>
      {LAYOUT_OPTIONS.map((layout) => (
        <div
          key={layout.key}
          className={`${styles.option} ${value === layout.key ? styles.active : ''}`}
          onClick={() => onChange(layout.key)}
        >
          <div 
            className={styles.wrapper}
            style={value === layout.key ? { borderColor: primaryColor } : undefined}
          >
            {layout.render(primaryColor)}
          </div>
          <span 
            className={styles.label} 
            style={{ color: value === layout.key ? primaryColor : 'inherit' }}
          >
            {isEnglish ? layout.labelEn : layout.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default LayoutModeSelector;