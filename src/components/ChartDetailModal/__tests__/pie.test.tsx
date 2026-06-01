import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ChartDetailModal from '../index';

const mockPieData = [
  { label: '广东', value: 2340 },
  { label: '北京', value: 1890 },
  { label: '上海', value: 1560 },
];

describe('ChartDetailModal - Pie Chart', () => {
  const defaultProps = {
    open: true,
    title: '地域分布（周）',
    chartType: 'pie' as const,
    chartOption: {},
    data: mockPieData,
    onClose: vi.fn(),
  };

  it('should render data table with three columns for pie chart', () => {
    render(<ChartDetailModal {...defaultProps} />);
    expect(screen.getByText('地区')).toBeInTheDocument();
    expect(screen.getByText('数值')).toBeInTheDocument();
    expect(screen.getByText('占比')).toBeInTheDocument();
  });

  it('should calculate percentage correctly', () => {
    render(<ChartDetailModal {...defaultProps} />);
    const total = 2340 + 1890 + 1560;
    const expectedPercentage = ((2340 / total) * 100).toFixed(1) + '%';
    expect(screen.getByText(expectedPercentage)).toBeInTheDocument();
  });

  it('should format numbers with thousands separator', () => {
    render(<ChartDetailModal {...defaultProps} />);
    expect(screen.getByText('2,340')).toBeInTheDocument();
    expect(screen.getByText('1,890')).toBeInTheDocument();
  });
});
