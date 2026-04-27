/**
 * 用户下拉菜单组件
 * 显示当前用户信息，提供设置和退出登录选项
 */
import React from 'react';
import { Dropdown } from 'antd';
import { UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './index.module.less';

/**
 * 用户下拉菜单组件
 */
/**
 * 用户下拉菜单组件
 * 显示当前用户信息，提供设置和退出登录选项
 */
const UserDropdown: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const menuItems = [{
    key: '/settings',
    icon: <SettingOutlined />,
    label: t('menu.settings'),
  }, {
    type: 'divider' as const,
  }, {
    key: 'logout',
    icon: <LogoutOutlined />,
    label: t('common.logout'),
  }];

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') return;
    navigate(key);
  };

  return (
    <div className={styles.userDropdown}>
      <Dropdown
        menu={{ items: menuItems, onClick: handleMenuClick }}
        placement="bottomRight"
        trigger={['hover']}
      >
        <div className={styles.userAvatar}>
          <UserOutlined />
          <span className={styles.userName}>{t('common.admin')}</span>
        </div>
      </Dropdown>
    </div>
  );
};

export default UserDropdown;