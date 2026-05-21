import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export interface ExportData {
  stats: { label: string; value: number }[];
  charts: {
    visitTrend: { label: string; value: number }[];
    orderRatio: { label: string; value: number }[];
    region: { label: string; value: number }[];
  };
}

export type ExportFormat = 'excel' | 'csv' | 'pdf';

interface SheetConfig {
  title: string;
  headers: [string, string];
  data: { label: string; value: number }[];
}

const EXCEL_MIME_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

function getSheetConfigs(data: ExportData): SheetConfig[] {
  return [
    { title: '统计数据', headers: ['指标', '数值'], data: data.stats },
    { title: '访问趋势', headers: ['时间', '数值'], data: data.charts.visitTrend },
    { title: '订单占比', headers: ['模块', '数值'], data: data.charts.orderRatio },
    { title: '地域分布', headers: ['地区', '数值'], data: data.charts.region },
  ];
}

function rowsToCSV(headers: [string, string], data: { label: string; value: number }[]): string {
  const headerRow = `${headers[0]},${headers[1]}`;
  const dataRows = data.map((item) => `${item.label},${item.value}`);
  return [headerRow, ...dataRows].join('\n');
}

export function generateFilename(format: ExportFormat): string {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const ext = format === 'excel' ? 'xlsx' : format;
  return `系统概览_${timestamp}.${ext}`;
}

export function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToExcel(data: ExportData, _filename: string): Blob {
  const wb = XLSX.utils.book_new();

  getSheetConfigs(data).forEach(({ title, data: sheetData }) => {
    const ws = XLSX.utils.json_to_sheet(sheetData);
    XLSX.utils.book_append_sheet(wb, ws, title);
  });

  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  return new Blob([wbout], { type: EXCEL_MIME_TYPE });
}

export function exportToCSV(data: ExportData, _filename?: string): string {
  return getSheetConfigs(data)
    .map(({ title, headers, data: sheetData }) => `${title}\n${rowsToCSV(headers, sheetData)}`)
    .join('\n\n');
}

export async function exportToPDF(data: ExportData, _filename: string): Promise<Blob> {
  const container = document.createElement('div');
  container.style.cssText = 'position:fixed;left:-9999px;top:0;width:800px;padding:40px;background:#fff;font-family:sans-serif;';

  let html = '<h1 style="text-align:center;font-size:24px;margin-bottom:30px;">系统概览数据</h1>';

  getSheetConfigs(data).forEach(({ title, headers, data: sheetData }) => {
    html += `<h2 style="font-size:18px;margin:20px 0 10px;">${title}</h2>`;
    html += '<table style="width:100%;border-collapse:collapse;margin-bottom:20px;">';
    html += `<tr style="background:#f0f0f0;"><th style="border:1px solid #ddd;padding:8px;text-align:left;">${headers[0]}</th><th style="border:1px solid #ddd;padding:8px;text-align:left;">${headers[1]}</th></tr>`;
    sheetData.forEach((item) => {
      html += `<tr><td style="border:1px solid #ddd;padding:8px;">${item.label}</td><td style="border:1px solid #ddd;padding:8px;">${item.value}</td></tr>`;
    });
    html += '</table>';
  });

  container.innerHTML = html;
  document.body.appendChild(container);

  const canvas = await html2canvas(container, { scale: 2, useCORS: true });
  document.body.removeChild(container);

  const imgData = canvas.toDataURL('image/png');
  const pdfWidth = 210;
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

  const pdfOutput = doc.output('blob');
  return new Blob([pdfOutput], { type: 'application/pdf' });
}
