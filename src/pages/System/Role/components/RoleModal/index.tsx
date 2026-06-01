import React, { useEffect, useCallback } from 'react';
import { Modal, Form, Input, Select, Switch } from 'antd';
import { useTranslation } from 'react-i18next';
import type { RoleItem } from '@/services/api/role';

const allPermissions = [
  'user:read', 'user:create', 'user:update', 'user:delete',
  'role:read', 'role:create', 'role:update', 'role:delete',
  'product:read', 'product:create', 'product:update', 'product:delete',
  'category:read', 'category:create', 'category:update', 'category:delete',
  'overview:read', 'overview:export',
  'settings:read', 'settings:update',
];

export interface RoleModalProps {
  open: boolean;
  editItem: RoleItem | null;
  onCancel: () => void;
  onOk: (values: { name: string; description?: string; permissions: string[]; status: string }) => void;
}

const RoleModal: React.FC<RoleModalProps> = ({ open, editItem, onCancel, onOk }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      if (editItem) {
        form.setFieldsValue({
          name: editItem.name,
          description: editItem.description,
          permissions: editItem.permissionList,
          status: editItem.status === 'enabled',
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, editItem, form]);

  const handleOk = useCallback(async () => {
    try {
      const values = await form.validateFields();
      onOk({
        name: values.name,
        description: values.description,
        permissions: values.permissions || [],
        status: values.status ? 'enabled' : 'disabled',
      });
      form.resetFields();
    } catch {
      // 表单验证失败
    }
  }, [form, onOk]);

  const handleCancel = useCallback(() => {
    form.resetFields();
    onCancel();
  }, [form, onCancel]);

  return (
    <Modal
      title={editItem ? t('role.editRole') : t('role.addRole')}
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      okText={t('common.save')}
      cancelText={t('common.cancel')}
      destroyOnHidden
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label={t('role.name')}
          rules={[{ required: true, message: t('role.nameRequired') }]}
        >
          <Input placeholder={t('role.namePlaceholder')} />
        </Form.Item>
        <Form.Item name="description" label={t('role.description')}>
          <Input.TextArea rows={3} placeholder={t('role.descriptionPlaceholder')} />
        </Form.Item>
        <Form.Item name="permissions" label={t('role.permissions')}>
          <Select mode="multiple" placeholder={t('role.permissionsPlaceholder')} options={allPermissions.map((p) => ({ label: p, value: p }))} />
        </Form.Item>
        <Form.Item name="status" label={t('role.status')} valuePropName="checked">
          <Switch checkedChildren={t('role.statusEnabled')} unCheckedChildren={t('role.statusDisabled')} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RoleModal;
