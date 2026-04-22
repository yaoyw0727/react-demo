import React from 'react';
import styles from './index.module.less';

interface ActionsBarProps {
  onReset: () => void;
  onCancel: () => void;
  onSave: () => void;
}

const ActionsBar: React.FC<ActionsBarProps> = ({ onReset, onCancel, onSave }) => {
  return (
    <div className={styles.actions}>
      <button className={`${styles.actionBtn} ${styles.resetBtn}`} onClick={onReset}>
        恢复默认
      </button>
      <div className={styles.actionGroup}>
        <button className={styles.actionBtn} onClick={onCancel}>
          取消
        </button>
        <button className={`${styles.actionBtn} ${styles.primary}`} onClick={onSave}>
          保存
        </button>
      </div>
    </div>
  );
};

export default ActionsBar;