import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ChartDetailModal from '../index';

const mockData = [
  { label: '05-15', value: 1200 },
  { label: '05-16', value: 1350 },
];

describe('ChartDetailModal - Line/Bar Chart', () => {
  const defaultProps = {
    open: true,
    title: '访问趋势（周）',
    chartType: 'line' as const,
    chartOption: {},
    data: mockData,
    onClose: vi.fn(),
  };

  it('should render data table with correct columns for line chart', () => {
    render(<ChartDetailModal {...defaultProps} chartType="line" />);
    expect(screen.getByText('时间')).toBeInTheDocument();
    expect(screen.getByText('数值')).toBeInTheDocument();
  });

  it('should render data table with correct columns for bar chart', () => {
    render(<ChartDetailModal {...defaultProps} chartType="bar" title="订单占比（周）" />);
    expect(screen.getByText('模块')).toBeInTheDocument();
    expect(screen.getByText('数值')).toBeInTheDocument();
  });

  it('should format numbers with thousands separator', () => {
    render(<ChartDetailModal {...defaultProps} />);
    expect(screen.getByText('1,200')).toBeInTheDocument();
    expect(screen.getByText('1,350')).toBeInTheDocument();
  });

  it('should show "详细数据" section title', () => {
    render(<ChartDetailModal {...defaultProps} />);
    expect(screen.getByText('详细数据')).toBeInTheDocument();
  });
});
