import React from 'react';
import styles from './index.module.less';

interface CustomButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'primary' | 'default' | 'dashed' | 'text' | 'link';
  className?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  children,
  onClick,
  type = 'default',
  className = '',
}) => {
  const typeClass = styles[type] || '';
  
  return (
    <button
      className={`${styles.button} ${typeClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default CustomButton;