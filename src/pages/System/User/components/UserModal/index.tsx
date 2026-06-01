import React, { useEffect, useState, useCallback } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { roleApi, type RoleItem } from '@/services/api/role';
import type { UserItem } from '@/services/api/user';

export interface UserModalProps {
  open: boolean;
  editItem: UserItem | null;
  onCancel: () => void;
  onOk: (values: { username: string; email: string; roleId: string; password?: string }) => void;
}

const UserModal: React.FC<UserModalProps> = ({ open, editItem, onCancel, onOk }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [roles, setRoles] = useState<RoleItem[]>([]);

  useEffect(() => {
    if (open) {
      roleApi.list({ page: 1, limit: 100 }).then((res) => setRoles(res.data)).catch(() => {});
      if (editItem) {
        form.setFieldsValue({
          username: editItem.username,
          email: editItem.email,
          roleId: editItem.roleId,
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, editItem, form]);

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
      title={editItem ? t('user.editUser') : t('user.addUser')}
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
        {!editItem && (
          <Form.Item name="password" label={t('user.password')} rules={[{ required: true, message: t('user.passwordRequired') }]}>
            <Input.Password placeholder={t('user.passwordPlaceholder')} />
          </Form.Item>
        )}
        <Form.Item
          name="roleId"
          label={t('user.role')}
          rules={[{ required: true, message: t('user.roleRequired') }]}
        >
          <Select placeholder={t('user.rolePlaceholder')}>
            {roles.map((role) => (
              <Select.Option key={role.id} value={role.id}>{role.name}</Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserModal;
