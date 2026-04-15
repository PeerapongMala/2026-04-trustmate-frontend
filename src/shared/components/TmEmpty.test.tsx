import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TmEmpty } from './TmEmpty';

describe('TmEmpty', () => {
  it('renders title', () => {
    render(<TmEmpty title="ไม่มีข้อมูล" />);
    expect(screen.getByText('ไม่มีข้อมูล')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(<TmEmpty title="ว่าง" description="ลองเพิ่มข้อมูลใหม่" />);
    expect(screen.getByText('ลองเพิ่มข้อมูลใหม่')).toBeInTheDocument();
  });

  it('does not render description when not provided', () => {
    const { container } = render(<TmEmpty title="ว่าง" />);
    const paragraphs = container.querySelectorAll('p');
    expect(paragraphs).toHaveLength(1);
  });

  it('shows default icon', () => {
    render(<TmEmpty title="ว่าง" />);
    expect(screen.getByText('📭')).toBeInTheDocument();
  });

  it('shows custom icon', () => {
    render(<TmEmpty title="ว่าง" icon="🎉" />);
    expect(screen.getByText('🎉')).toBeInTheDocument();
  });
});
