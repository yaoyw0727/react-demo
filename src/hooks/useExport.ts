import { useState, useCallback } from 'react';
import { App } from 'antd';
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
        message.success('导出成功');
      } catch (error) {
        message.error('导出失败，请重试');
        console.error('Export failed:', error);
      } finally {
        setExporting(false);
      }
    },
    [data, onSuccess, message]
  );

  return { exporting, handleExport };
}
