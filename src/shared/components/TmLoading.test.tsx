import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TmLoading } from './TmLoading';

describe('TmLoading', () => {
  it('renders default loading text', () => {
    render(<TmLoading />);
    expect(screen.getByText('กำลังโหลด...')).toBeInTheDocument();
  });

  it('renders custom text', () => {
    render(<TmLoading text="รอสักครู่..." />);
    expect(screen.getByText('รอสักครู่...')).toBeInTheDocument();
  });

  it('has spinner element', () => {
    const { container } = render(<TmLoading />);
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });
});
