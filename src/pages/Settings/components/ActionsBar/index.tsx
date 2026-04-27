import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './index.module.less';

interface ActionsBarProps {
  onReset: () => void;
  onCancel: () => void;
  onSave: () => void;
}

const ActionsBar: React.FC<ActionsBarProps> = ({ onReset, onCancel, onSave }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.actions}>
      <button className={`${styles.actionBtn} ${styles.resetBtn}`} onClick={onReset}>
        {t('common.reset')}
      </button>
      <div className={styles.actionGroup}>
        <button className={styles.actionBtn} onClick={onCancel}>
          {t('common.cancel')}
        </button>
        <button className={`${styles.actionBtn} ${styles.primary}`} onClick={onSave}>
          {t('common.save')}
        </button>
      </div>
    </div>
  );
};

export default ActionsBar;