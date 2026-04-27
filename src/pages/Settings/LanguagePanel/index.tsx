/**
 * 语言设置面板
 */
import React, { useState } from 'react';
import { Form, Card, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useLanguageStore, languages } from '../../../store/language';
import type { Language } from '../../../store/language';
import ActionsBar from '../components/ActionsBar';
import styles from './index.module.less';
import i18n from '@/utils/i18n';

/**
 * 语言设置面板组件
 */
/**
 * 语言设置面板
 * 支持切换系统语言
 */
const LanguagePanel: React.FC = () => {
  const { language, setLanguage, resetLanguage } = useLanguageStore();
  const [form] = Form.useForm();
  const { t, i18n: i18nInstance } = useTranslation();
  const [selectedLang, setSelectedLang] = useState<Language>(language);
  const isEnglish = i18nInstance.language.startsWith('en');

  // 保存语言设置
  const handleSave = () => {
    setLanguage(selectedLang);
    i18n.changeLanguage(selectedLang);
    message.success(t('settings.settingsSaved'));
  };

  // 取消更改
  const handleCancel = () => {
    setSelectedLang(language);
    message.info(t('settings.settingsCanceled'));
  };

  // 重置为默认语言
  const handleReset = () => {
    resetLanguage();
    setSelectedLang('zh-cn');
    message.success(t('settings.settingsReset'));
  };

  // 选中语言
  const handleSelect = (lang: Language) => {
    setSelectedLang(lang);
  };

  return (
    <div className={styles.panel}>
      <Form form={form} layout="vertical">
        <Form.Item label={t('settings.systemLanguage')}>
          <div className={styles.languageGroup}>
            {languages.map((lang) => (
              <div
                key={lang.key}
                className={`${styles.languageOption} ${selectedLang === lang.key ? styles.active : ''}`}
                onClick={() => handleSelect(lang.key)}
              >
                <Card
                  className={styles.card}
                  hoverable
                >
                  <img src={lang.image} alt={lang.nativeLabel} className={styles.flag} />
                </Card>
                <span className={styles.langName}>{isEnglish ? lang.labelEn : lang.label}</span>
              </div>
            ))}
          </div>
        </Form.Item>
      </Form>

      <ActionsBar onReset={handleReset} onCancel={handleCancel} onSave={handleSave} />
    </div>
  );
};

export default LanguagePanel;