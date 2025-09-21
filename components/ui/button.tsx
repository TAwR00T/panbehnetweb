
import React from 'react';

// Basic Button component to satisfy the import.
// The styling is applied directly in the consuming component.
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'lg' | 'default' | 'sm' | 'icon';
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, variant, size, ...props }, ref) => {
    return (
      <button className={className} ref={ref} {...props}>
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';