import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { TmButton } from './TmButton';

describe('TmButton', () => {
  it('renders children text', () => {
    render(<TmButton>คลิก</TmButton>);
    expect(screen.getByText('คลิก')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<TmButton onClick={onClick}>กด</TmButton>);

    await user.click(screen.getByText('กด'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<TmButton onClick={onClick} disabled>กด</TmButton>);

    await user.click(screen.getByText('กด'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('applies solid variant styles by default', () => {
    render(<TmButton>ปุ่ม</TmButton>);
    const btn = screen.getByText('ปุ่ม');
    expect(btn.className).toContain('bg-tm-orange');
  });

  it('applies outline variant styles', () => {
    render(<TmButton variant="outline">ปุ่ม</TmButton>);
    const btn = screen.getByText('ปุ่ม');
    expect(btn.className).toContain('border-');
    expect(btn.className).toContain('text-tm-orange');
  });

  it('applies size classes', () => {
    render(<TmButton size="sm">เล็ก</TmButton>);
    const btn = screen.getByText('เล็ก');
    expect(btn.className).toContain('px-4');
  });

  it('has rounded-full class', () => {
    render(<TmButton>ปุ่ม</TmButton>);
    const btn = screen.getByText('ปุ่ม');
    expect(btn.className).toContain('rounded-full');
  });
});
