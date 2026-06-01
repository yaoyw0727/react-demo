import React from 'react';
import { Modal, Button, Space } from 'antd';
import { FileExcelOutlined, FileTextOutlined, FilePdfOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import type { ExportFormat } from '@/utils/exporters';

export interface ExportModalProps {
  open: boolean;
  exporting: boolean;
  onCancel: () => void;
  onExport: (format: ExportFormat) => void;
}

const ExportModal: React.FC<ExportModalProps> = ({ open, exporting, onCancel, onExport }) => {
  const { t } = useTranslation();

  return (
    <Modal
      title={t('export.title')}
      open={open}
      onCancel={onCancel}
      footer={null}
      destroyOnHidden
    >
      <Space orientation="vertical" style={{ width: '100%' }} size="large">
        <Button
          type="primary"
          icon={<FileExcelOutlined />}
          block
          size="large"
          loading={exporting}
          onClick={() => onExport('excel')}
        >
          {t('export.excel')}
        </Button>
        <Button
          icon={<FileTextOutlined />}
          block
          size="large"
          loading={exporting}
          onClick={() => onExport('csv')}
        >
          {t('export.csv')}
        </Button>
        <Button
          icon={<FilePdfOutlined />}
          block
          size="large"
          loading={exporting}
          onClick={() => onExport('pdf')}
        >
          {t('export.pdf')}
        </Button>
      </Space>
    </Modal>
  );
};

export default ExportModal;
