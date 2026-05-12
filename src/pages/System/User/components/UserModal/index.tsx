import React, { useCallback } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import { useTranslation } from 'react-i18next';

export interface UserModalProps {
  open: boolean;
  onCancel: () => void;
  onOk: (values: { username: string; email: string; role: string }) => void;
}

const UserModal: React.FC<UserModalProps> = ({ open, onCancel, onOk }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const handleOk = useCallback(async () => {
    try {
      const values = await form.validateFields();
      onOk(values);
      form.resetFields();
    } catch {
      // 表单验证失败，不做处理
    }
  }, [form, onOk]);

  const handleCancel = useCallback(() => {
    form.resetFields();
    onCancel();
  }, [form, onCancel]);

  return (
    <Modal
      title={t('user.addUser')}
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      okText={t('common.save')}
      cancelText={t('common.cancel')}
      destroyOnHidden
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="username"
          label={t('user.username')}
          rules={[{ required: true, message: t('user.usernameRequired') }]}
        >
          <Input placeholder={t('user.usernamePlaceholder')} />
        </Form.Item>
        <Form.Item
          name="email"
          label={t('user.email')}
          rules={[
            { required: true, message: t('user.emailRequired') },
            { type: 'email', message: t('user.emailInvalid') },
          ]}
        >
          <Input placeholder={t('user.emailPlaceholder')} />
        </Form.Item>
        <Form.Item
          name="role"
          label={t('user.role')}
          rules={[{ required: true, message: t('user.roleRequired') }]}
        >
          <Select placeholder={t('user.rolePlaceholder')}>
            <Select.Option value={t('common.admin')}>{t('common.admin')}</Select.Option>
            <Select.Option value={t('user.normalUser')}>{t('user.normalUser')}</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserModal;