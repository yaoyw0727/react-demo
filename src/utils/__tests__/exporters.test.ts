import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { exportToExcel, exportToCSV, exportToPDF, generateFilename, triggerDownload } from '../exporters';
import type { ExportData } from '../exporters';

vi.mock('html2canvas', () => ({
  default: vi.fn().mockResolvedValue({
    toDataURL: () => 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    height: 800,
    width: 600,
  }),
}));

const mockData: ExportData = {
  stats: [
    { label: '在线用户', value: 1234 },
    { label: '今日访问', value: 5678 },
    { label: '订单总数', value: 890 },
    { label: '营收总额', value: 123456 },
  ],
  charts: {
    visitTrend: [
      { label: '05-15', value: 1200 },
      { label: '05-16', value: 1350 },
    ],
    orderRatio: [
      { label: '电子产品', value: 320 },
      { label: '服装鞋帽', value: 210 },
    ],
    region: [
      { label: '广东', value: 2340 },
      { label: '北京', value: 1890 },
    ],
  },
};

describe('exportToExcel', () => {
  it('should generate Excel file blob', () => {
    const result = exportToExcel(mockData, 'test.xlsx');
    expect(result).toBeInstanceOf(Blob);
    expect(result.type).toContain('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  });
});

describe('exportToCSV', () => {
  it('should generate CSV string with correct format', () => {
    const result = exportToCSV(mockData);
    expect(result).toContain('在线用户');
    expect(result).toContain('1234');
    expect(result).toContain('今日访问');
    expect(result).toContain('5678');
  });
});

describe('exportToPDF', () => {
  it('should generate PDF file blob', async () => {
    const result = await exportToPDF(mockData, 'test.pdf');
    expect(result).toBeInstanceOf(Blob);
    expect(result.type).toBe('application/pdf');
  });
});

describe('generateFilename', () => {
  it('should generate filename with timestamp and correct extension', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-05-21T10:30:45.123Z'));

    expect(generateFilename('excel')).toBe('系统概览_2026-05-21T10-30-45.xlsx');
    expect(generateFilename('csv')).toBe('系统概览_2026-05-21T10-30-45.csv');
    expect(generateFilename('pdf')).toBe('系统概览_2026-05-21T10-30-45.pdf');

    vi.useRealTimers();
  });
});

describe('triggerDownload', () => {
  beforeEach(() => {
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn(() => 'blob:test'),
      revokeObjectURL: vi.fn(),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should create and click a download link', () => {
    const blob = new Blob(['test'], { type: 'text/plain' });
    const createElementSpy = vi.spyOn(document, 'createElement');
    const appendChildSpy = vi.spyOn(document.body, 'appendChild');
    const removeChildSpy = vi.spyOn(document.body, 'removeChild');

    triggerDownload(blob, 'test.txt');

    expect(createElementSpy).toHaveBeenCalledWith('a');
    expect(appendChildSpy).toHaveBeenCalled();
    expect(removeChildSpy).toHaveBeenCalled();
    expect(URL.createObjectURL).toHaveBeenCalledWith(blob);
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:test');

    createElementSpy.mockRestore();
    appendChildSpy.mockRestore();
    removeChildSpy.mockRestore();
  });
});
