import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TmCard } from './TmCard';

describe('TmCard', () => {
  it('renders children', () => {
    render(<TmCard>เนื้อหา</TmCard>);
    expect(screen.getByText('เนื้อหา')).toBeInTheDocument();
  });

  it('has rounded-3xl class', () => {
    render(<TmCard>card</TmCard>);
    expect(screen.getByText('card').parentElement?.className || screen.getByText('card').className).toContain('rounded-3xl');
  });

  it('has shadow-sm class', () => {
    render(<TmCard>card</TmCard>);
    const el = screen.getByText('card');
    expect(el.className).toContain('shadow-sm');
  });

  it('accepts additional className', () => {
    render(<TmCard className="bg-red-500">card</TmCard>);
    const el = screen.getByText('card');
    expect(el.className).toContain('bg-red-500');
  });
});
