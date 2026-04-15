import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { TmInput } from './TmInput';

describe('TmInput', () => {
  it('renders with label', () => {
    render(<TmInput label="อีเมล" />);
    expect(screen.getByText('อีเมล')).toBeInTheDocument();
  });

  it('renders without label', () => {
    render(<TmInput placeholder="กรอก..." />);
    expect(screen.getByPlaceholderText('กรอก...')).toBeInTheDocument();
  });

  it('shows error message', () => {
    render(<TmInput error="กรุณากรอกอีเมล" />);
    expect(screen.getByText('กรุณากรอกอีเมล')).toBeInTheDocument();
  });

  it('handles onChange', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TmInput onChange={onChange} />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'test');
    expect(onChange).toHaveBeenCalled();
  });

  it('has rounded-2xl class for input', () => {
    render(<TmInput data-testid="input" />);
    const input = screen.getByRole('textbox');
    expect(input.className).toContain('rounded-2xl');
  });

  it('has bg-tm-light class', () => {
    render(<TmInput />);
    const input = screen.getByRole('textbox');
    expect(input.className).toContain('bg-tm-light');
  });

  it('adds ring class when error is present', () => {
    render(<TmInput error="error" />);
    const input = screen.getByRole('textbox');
    expect(input.className).toContain('ring-2');
  });
});
