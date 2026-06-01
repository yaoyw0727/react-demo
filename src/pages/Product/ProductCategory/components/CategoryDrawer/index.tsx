import React, { useCallback } from 'react';
import { Drawer, Form, Input, InputNumber, Button } from 'antd';
import { useTranslation } from 'react-i18next';

export interface CategoryDrawerProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: { name: string; description?: string; sort?: number }) => void;
}

const CategoryDrawer: React.FC<CategoryDrawerProps> = ({ open, onClose, onSubmit }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const handleSubmit = useCallback(async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
      form.resetFields();
    } catch {
      // 表单验证失败，不做处理
    }
  }, [form, onSubmit]);

  const handleClose = useCallback(() => {
    form.resetFields();
    onClose();
  }, [form, onClose]);

  return (
    <Drawer
      title={t('product.addCategory')}
      placement="right"
      width={400}
      open={open}
      onClose={handleClose}
      extra={
        <Button type="primary" onClick={handleSubmit}>
          {t('common.save')}
        </Button>
      }
      destroyOnHidden
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label={t('product.categoryName')}
          rules={[{ required: true, message: t('product.categoryNameRequired') }]}
        >
          <Input placeholder={t('product.categoryNamePlaceholder')} />
        </Form.Item>
        <Form.Item
          name="description"
          label={t('product.categoryDescription')}
        >
          <Input.TextArea rows={3} placeholder={t('product.categoryDescriptionPlaceholder')} />
        </Form.Item>
        <Form.Item
          name="sort"
          label={t('product.sort')}
        >
          <InputNumber min={1} placeholder={t('product.sortPlaceholder')} style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default CategoryDrawer;