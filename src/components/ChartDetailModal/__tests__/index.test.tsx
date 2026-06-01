import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChartDetailModal from '../index';

describe('ChartDetailModal', () => {
  const defaultProps = {
    open: true,
    title: '访问趋势（周）',
    chartType: 'line' as const,
    chartOption: {},
    data: [],
    onClose: vi.fn(),
  };

  it('should render modal with correct title when open', () => {
    render(<ChartDetailModal {...defaultProps} />);
    expect(screen.getByText('访问趋势（周）')).toBeInTheDocument();
  });

  it('should not render when open is false', () => {
    render(<ChartDetailModal {...defaultProps} open={false} />);
    expect(screen.queryByText('访问趋势（周）')).not.toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<ChartDetailModal {...defaultProps} onClose={onClose} />);

    const closeBtn = screen.getByRole('button', { name: /close/i });
    await user.click(closeBtn);

    expect(onClose).toHaveBeenCalled();
  });

  it('should have width 800px', () => {
    render(<ChartDetailModal {...defaultProps} />);
    const modal = document.querySelector('.ant-modal');
    expect(modal?.getAttribute('style')).toContain('width: 800px');
  });

  it('should destroy on hidden', () => {
    const { container, rerender } = render(<ChartDetailModal {...defaultProps} />);
    rerender(<ChartDetailModal {...defaultProps} open={false} />);
    expect(container.querySelector('.ant-modal')).not.toBeInTheDocument();
  });
});
