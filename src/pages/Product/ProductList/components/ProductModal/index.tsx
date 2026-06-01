import React, { useEffect, useState, useCallback } from 'react';
import { Modal, Form, Input, InputNumber, Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { categoryApi, type CategoryItem } from '@/services/api/category';

export interface ProductModalProps {
  open: boolean;
  editItem?: { id: string; name: string; categoryId: string; price: number; stock: number; status: string } | null;
  onCancel: () => void;
  onOk: (values: { name: string; categoryId: string; price: number; stock: number; status: string }) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ open, editItem, onCancel, onOk }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [categories, setCategories] = useState<CategoryItem[]>([]);

  useEffect(() => {
    if (open) {
      categoryApi.list({ page: 1, limit: 100 }).then((res) => setCategories(res.data)).catch(() => {});
      if (editItem) {
        form.setFieldsValue(editItem);
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
    } catch { /* do nothing */ }
  }, [form, onOk]);

  const handleCancel = useCallback(() => {
    form.resetFields();
    onCancel();
  }, [form, onCancel]);

  return (
    <Modal
      title={editItem ? t('product.editProduct') : t('product.addProduct')}
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      okText={t('common.save')}
      cancelText={t('common.cancel')}
      destroyOnHidden
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label={t('product.name')} rules={[{ required: true, message: t('product.nameRequired') }]}>
          <Input placeholder={t('product.namePlaceholder')} />
        </Form.Item>
        <Form.Item name="categoryId" label={t('product.category')} rules={[{ required: true, message: t('product.categoryRequired') }]}>
          <Select placeholder={t('product.categoryPlaceholder')}>
            {categories.map((cat) => (
              <Select.Option key={cat.id} value={cat.id}>{cat.name}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="price" label={t('product.price')} rules={[{ required: true, message: t('product.priceRequired') }]}>
          <InputNumber min={0} prefix="¥" placeholder={t('product.pricePlaceholder')} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="stock" label={t('product.stock')} rules={[{ required: true, message: t('product.stockRequired') }]}>
          <InputNumber min={0} placeholder={t('product.stockPlaceholder')} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="status" label={t('product.status')} initialValue="onSale">
          <Select placeholder={t('product.statusPlaceholder')}>
            <Select.Option value="onSale">{t('product.statusOnSale')}</Select.Option>
            <Select.Option value="outOfStock">{t('product.statusOutOfStock')}</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProductModal;
