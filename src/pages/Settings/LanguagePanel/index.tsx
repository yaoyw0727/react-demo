/**
 * 语言设置面板
 */
import React, { useEffect } from 'react';
import { Radio, Form, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useLanguageStore, languages } from '../../../store/language';
import IconFont from '../../../components/IconFont';
import ActionsBar from '../components/ActionsBar';
import styles from './index.module.less';
import i18n from '../../../i18n';

/**
 * 语言设置面板组件
 */
const LanguagePanel: React.FC = () => {
  const { language, setLanguage, resetLanguage } = useLanguageStore();
  const [form] = Form.useForm();
  const { t } = useTranslation();

  useEffect(() => {
    form.setFieldsValue({ language });
  }, [language, form]);

  const handleSave = () => {
    const values = form.getFieldsValue();
    setLanguage(values.language);
    i18n.changeLanguage(values.language);
    message.success(t('settings.settingsSaved'));
  };

  const handleCancel = () => {
    form.setFieldsValue({ language });
    message.info(t('settings.settingsCanceled'));
  };

  const handleReset = () => {
    resetLanguage();
    form.setFieldsValue({ language: 'zh-CN' });
    message.success(t('settings.settingsReset'));
  };

  return (
    <div className={styles.panel}>
      <Form form={form} layout="vertical" initialValues={{ language }}>
        <Form.Item label={t('settings.systemLanguage')} name="language">
          <Radio.Group className={styles.languageGroup}>
            {languages.map((lang) => (
              <Radio key={lang.key} value={lang.key} className={styles.languageOption}>
                <span className={styles.flagWrapper}>
                  <IconFont type={lang.icon} className={styles.flag} />
                </span>
                <span className={styles.langName}>{lang.nativeLabel}</span>
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>
      </Form>

      <ActionsBar onReset={handleReset} onCancel={handleCancel} onSave={handleSave} />
    </div>
  );
};

export default LanguagePanel;