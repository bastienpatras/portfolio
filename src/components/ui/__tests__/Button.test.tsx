import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('applies variant classes', () => {
    render(<Button variant="outline">Outline</Button>);
    const button = screen.getByText('Outline');
    expect(button).toHaveClass('border');
  });

  it('applies size classes', () => {
    render(<Button size="sm">Small</Button>);
    const button = screen.getByText('Small');
    expect(button).toHaveClass('h-9');
  });

  it('can be disabled', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByText('Disabled');
    expect(button).toBeDisabled();
  });
});
