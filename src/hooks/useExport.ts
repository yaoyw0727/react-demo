import { useState, useCallback } from 'react';
import { App } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  exportToExcel,
  exportToCSV,
  exportToPDF,
  generateFilename,
  triggerDownload,
  type ExportData,
  type ExportFormat,
} from '@/utils/exporters';

interface UseExportOptions {
  data: ExportData;
  onSuccess?: (format: ExportFormat) => void;
}

export function useExport({ data, onSuccess }: UseExportOptions) {
  const [exporting, setExporting] = useState(false);
  const { message } = App.useApp();
  const { t } = useTranslation();

  const handleExport = useCallback(
    async (format: ExportFormat) => {
      setExporting(true);
      try {
        const filename = generateFilename(format);
        let blob: Blob;

        switch (format) {
          case 'excel':
            blob = exportToExcel(data, filename);
            break;
          case 'csv':
            const csvContent = exportToCSV(data);
            blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            break;
          case 'pdf':
            blob = await exportToPDF(data, filename);
            break;
          default:
            throw new Error(`Unsupported format: ${format}`);
        }

        triggerDownload(blob, filename);
        onSuccess?.(format);
        message.success(t('common.success'));
      } catch (error) {
        message.error(t('common.error'));
        console.error('Export failed:', error);
      } finally {
        setExporting(false);
      }
    },
    [data, onSuccess, message, t]
  );

  return { exporting, handleExport };
}
