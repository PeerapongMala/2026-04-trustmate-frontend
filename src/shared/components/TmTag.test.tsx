import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { TmTag } from './TmTag';

describe('TmTag', () => {
  it('renders label text', () => {
    render(<TmTag label="#เศร้า" />);
    expect(screen.getByText('#เศร้า')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<TmTag label="#สุขใจ" onClick={onClick} />);

    await user.click(screen.getByText('#สุขใจ'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('applies selected styles when selected=true', () => {
    render(<TmTag label="#เศร้า" selected />);
    const tag = screen.getByText('#เศร้า');
    expect(tag.className).toContain('bg-tm-orange');
    expect(tag.className).toContain('text-white');
  });

  it('applies unselected styles when selected=false', () => {
    render(<TmTag label="#เศร้า" selected={false} />);
    const tag = screen.getByText('#เศร้า');
    expect(tag.className).toContain('border');
    expect(tag.className).toContain('text-tm-orange');
  });

  it('has rounded-full class', () => {
    render(<TmTag label="tag" />);
    expect(screen.getByText('tag').className).toContain('rounded-full');
  });
});
